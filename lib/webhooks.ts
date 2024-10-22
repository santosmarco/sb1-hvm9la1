"use server"

import { db } from "@/db"
import { webhooks, requests } from "@/db/schema"
import { eq } from "drizzle-orm"
import { randomBytes } from "crypto"
import { createClient } from "@/lib/supabase/server"

export async function createWebhook(userId: string, name: string) {
  const endpoint = `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/${randomBytes(16).toString("hex")}`
  const secret = randomBytes(32).toString("hex")

  const [webhook] = await db.insert(webhooks).values({
    userId: Number(userId),
    name,
    endpoint,
    secret,
  }).returning()

  return webhook
}

export async function getWebhooks(userId: string) {
  return db.query.webhooks.findMany({
    where: eq(webhooks.userId, Number(userId)),
    orderBy: (webhooks, { desc }) => [desc(webhooks.createdAt)],
  })
}

export async function getWebhookRequests(webhookId: number) {
  return db.query.requests.findMany({
    where: eq(requests.webhookId, webhookId),
    orderBy: (requests, { desc }) => [desc(requests.timestamp)],
  })
}

export async function getUserWebhooks() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (!session?.user) {
    return []
  }

  return getWebhooks(session.user.id)
}