import { NextRequest, NextResponse } from "next/server"
import { initiatePasswordReset, resetPassword } from "@/lib/auth"
import { z } from "zod"

const initiateResetSchema = z.object({
  email: z.string().email(),
})

const resetSchema = z.object({
  token: z.string(),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = initiateResetSchema.parse(body)

    const result = await initiatePasswordReset(email)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Password reset email sent" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, password } = resetSchema.parse(body)

    const result = await resetPassword(token, password)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Password reset successful" },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "An error occurred" },
      { status: 500 }
    )
  }
}