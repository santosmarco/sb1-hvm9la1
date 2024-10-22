"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Webhook } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface WebhooksListProps extends React.HTMLAttributes<HTMLDivElement> {}

// TODO: Replace with real data from the server
const DEMO_WEBHOOKS = [
  {
    id: 1,
    name: "Payment Webhook",
    endpoint: "https://example.com/webhook/123",
    lastUsedAt: new Date(),
    requestCount: 42,
    status: "active",
  },
  {
    id: 2,
    name: "Notification Service",
    endpoint: "https://example.com/webhook/456",
    lastUsedAt: new Date(Date.now() - 1000 * 60 * 30),
    requestCount: 128,
    status: "active",
  },
  {
    id: 3,
    name: "Analytics Hook",
    endpoint: "https://example.com/webhook/789",
    lastUsedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    requestCount: 256,
    status: "inactive",
  },
]

export function WebhooksList({ className, ...props }: WebhooksListProps) {
  return (
    <Card className={cn("col-span-3", className)} {...props}>
      <CardHeader>
        <CardTitle>Active Webhooks</CardTitle>
        <CardDescription>
          Your webhook endpoints and their current status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px]">
          <div className="space-y-4">
            {DEMO_WEBHOOKS.map((webhook) => (
              <div
                key={webhook.id}
                className="flex items-center justify-between space-x-4 rounded-lg border p-4"
              >
                <div className="flex items-start space-x-4">
                  <Webhook className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">{webhook.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Last used {formatDistanceToNow(webhook.lastUsedAt)} ago
                    </div>
                    <code className="mt-1 block text-xs text-muted-foreground">
                      {webhook.endpoint}
                    </code>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={webhook.status === "active" ? "default" : "secondary"}
                  >
                    {webhook.requestCount} Requests
                  </Badge>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}