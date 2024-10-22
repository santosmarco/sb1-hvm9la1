import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { webhooks, requests } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const webhook = await db.query.webhooks.findFirst({
    where: eq(webhooks.endpoint, `${process.env.NEXT_PUBLIC_APP_URL}/api/webhook/${params.id}`),
  })

  if (!webhook) {
    return new NextResponse("Not Found", { status: 404 })
  }

  const headers: Record<string, string> = {}
  req.headers.forEach((value, key) => {
    headers[key] = value
  })

  const body = await req.json().catch(() => null)
  const queryParams = Object.fromEntries(new URL(req.url).searchParams)

  await db.insert(requests).values({
    webhookId: webhook.id,
    method: req.method,
    headers,
    queryParams,
    body,
    ip: req.headers.get("x-forwarded-for") || req.ip,
    userAgent: req.headers.get("user-agent"),
  })

  // Update last used timestamp
  await db
    .update(webhooks)
    .set({ lastUsedAt: new Date() })
    .where(eq(webhooks.id, webhook.id))

  return new NextResponse("OK", { status: 200 })
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return POST(req, { params })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  return POST(req, { params })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  return POST(req, { params })
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  return POST(req, { params })
}