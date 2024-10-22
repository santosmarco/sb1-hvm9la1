import { Suspense } from "react"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { WebhooksList } from "@/components/dashboard/webhooks-list"
import { DashboardStats } from "@/components/dashboard/stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { WebhookCreateButton } from "@/components/dashboard/webhook-create-button"
import { DashboardSkeleton } from "@/components/dashboard/skeleton"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="Monitor and manage your webhook endpoints."
      >
        <WebhookCreateButton />
      </DashboardHeader>
      <Suspense fallback={<DashboardSkeleton />}>
        <div className="grid gap-6">
          <DashboardStats />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <WebhooksList className="lg:col-span-4" />
            <RecentActivity className="lg:col-span-3" />
          </div>
        </div>
      </Suspense>
    </DashboardShell>
  )
}