"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

interface RecentActivityProps extends React.HTMLAttributes<HTMLDivElement> {}

// TODO: Replace with real data from the server
const DEMO_ACTIVITY = [
  {
    id: 1,
    webhook: "Payment Webhook",
    method: "POST",
    status: 200,
    timestamp: new Date(),
    ip: "192.168.1.1",
  },
  {
    id: 2,
    webhook: "Notification Service",
    method: "POST",
    status: 400,
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    ip: "192.168.1.2",
  },
  {
    id: 3,
    webhook: "Analytics Hook",
    method: "GET",
    status: 200,
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    ip: "192.168.1.3",
  },
]

export function RecentActivity({ className, ...props }: RecentActivityProps) {
  return (
    <Card className={cn("col-span-3", className)} {...props}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Your webhook requests in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[450px]">
          <div className="space-y-4">
            {DEMO_ACTIVITY.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center space-x-4 rounded-lg border p-4"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{activity.method}</Badge>
                    <span className="font-semibold">{activity.webhook}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp)} ago from {activity.ip}
                  </div>
                </div>
                <Badge
                  variant={activity.status < 400 ? "default" : "destructive"}
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}