"use server"

import { cookies } from "next/headers"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { createHash, randomBytes, timingSafeEqual } from "crypto"
import { SignJWT, jwtVerify } from "jose"
import { z } from "zod"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || randomBytes(32).toString("hex")
)

const SESSION_COOKIE = "session"
const SESSION_LENGTH = 60 * 60 * 24 * 7 // 7 days

// Rate limiting maps
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()
const resetAttempts = new Map<string, { count: number; lastAttempt: number }>()

// Rate limiting configuration
const MAX_ATTEMPTS = 5
const LOCKOUT_TIME = 15 * 60 * 1000 // 15 minutes

export async function checkRateLimit(
  map: Map<string, { count: number; lastAttempt: number }>,
  key: string
): Promise<boolean> {
  const now = Date.now()
  const attempt = map.get(key)

  if (!attempt) {
    map.set(key, { count: 1, lastAttempt: now })
    return true
  }

  if (now - attempt.lastAttempt > LOCKOUT_TIME) {
    map.set(key, { count: 1, lastAttempt: now })
    return true
  }

  if (attempt.count >= MAX_ATTEMPTS) {
    return false
  }

  attempt.count += 1
  attempt.lastAttempt = now
  map.set(key, attempt)
  return true
}

export async function createUser(
  email: string,
  password: string,
  name: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate input
    const userSchema = z.object({
      email: z.string().email(),
      password: z
        .string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        }),
      name: z.string().min(2),
    });

    userSchema.parse({ email, password, name });

    // Create user in Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Failed to create user" };
    }

    // Insert user into your database
    await db.insert(users).values({
      id: data.user.id,
      email: data.user.email!,
      name,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "An error occurred during registration" };
  }
}

export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check rate limiting
    if (!(await checkRateLimit(loginAttempts, email))) {
      return {
        success: false,
        error: "Too many login attempts. Please try again later.",
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Set session cookie
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      return { success: false, error: "Failed to create session" };
    }

    cookies().set(SESSION_COOKIE, sessionData.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_LENGTH,
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "An error occurred during login" };
  }
}

export async function getCurrentUser() {
  try {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) return null;

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.id),
    });

    return dbUser;
  } catch {
    return null;
  }
}

export async function logout() {
  await supabase.auth.signOut();
  cookies().delete(SESSION_COOKIE);
}