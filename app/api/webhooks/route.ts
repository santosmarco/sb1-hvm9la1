import { NextRequest, NextResponse } from "next/server"
import { createWebhook } from "@/lib/webhooks"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const createWebhookSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().max(500).optional(),
  notifications: z.object({
    email: z.boolean(),
    slack: z.boolean(),
  }),
})

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, description, notifications } = createWebhookSchema.parse(body)

    const webhook = await createWebhook(session.user.id, name)

    return NextResponse.json(webhook, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create webhook" },
      { status: 500 }
    )
  }
}