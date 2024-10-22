"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Webhook } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

// TODO: Replace with real data from the server
const DEMO_WEBHOOKS = [
  {
    id: 1,
    name: "Test Webhook",
    endpoint: "https://example.com/webhook/123",
    lastUsedAt: new Date(),
    requestCount: 42,
  }
]

export function WebhooksList() {
  return (
    <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
      {DEMO_WEBHOOKS.map((webhook) => (
        <Card key={webhook.id}>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Webhook className="h-8 w-8 text-primary" />
              <div>
                <CardTitle>{webhook.name}</CardTitle>
                <CardDescription>
                  Last used {formatDistanceToNow(webhook.lastUsedAt)} ago
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-muted-foreground">Endpoint</div>
                <code className="block w-full overflow-x-auto rounded bg-muted p-2 text-sm">
                  {webhook.endpoint}
                </code>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{webhook.requestCount} Requests</Badge>
                <Button variant="ghost" size="sm">View Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}