"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Copy, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { createClient } from "@/lib/supabase/client"

const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  description: z.string().max(500).optional(),
  notifications: z.object({
    email: z.boolean().default(false),
    slack: z.boolean().default(false),
  }),
})

export function WebhookCreateButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [createdWebhook, setCreatedWebhook] = useState<{ endpoint: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      notifications: {
        email: false,
        slack: false,
      },
    },
  })

  const copyToClipboard = async () => {
    if (!createdWebhook) return
    await navigator.clipboard.writeText(createdWebhook.endpoint)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      // if (!session) {
      //   toast.error("Please sign in to create webhooks")
      //   return
      // }

      const response = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error("Failed to create webhook")

      const webhook = await response.json()
      setCreatedWebhook(webhook)
      toast.success("Webhook created successfully!")
      router.refresh()
    } catch (error) {
      toast.error("Failed to create webhook")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Webhook
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        {!createdWebhook ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>Create New Webhook</DialogTitle>
                <DialogDescription>
                  Create a new webhook endpoint to start receiving and inspecting requests.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Payment Webhook" {...field} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for your webhook endpoint.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Handles payment notifications from Stripe..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional description of the webhook&apos;s purpose.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <FormLabel>Notifications</FormLabel>
                  <FormField
                    control={form.control}
                    name="notifications.email"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Email Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive email notifications for new requests.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notifications.slack"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Slack Notifications
                          </FormLabel>
                          <FormDescription>
                            Receive Slack notifications for new requests.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Webhook"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="space-y-6">
            <DialogHeader>
              <DialogTitle>Webhook Created Successfully!</DialogTitle>
              <DialogDescription>
                Your webhook endpoint is ready to receive requests.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Endpoint URL</label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">
                    {createdWebhook.endpoint}
                  </code>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full">
                    View Setup Instructions
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4">
                  <div className="rounded-md bg-muted p-4">
                    <h4 className="mb-2 font-medium">cURL Example</h4>
                    <code className="block text-sm text-muted-foreground">
                      curl -X POST \<br />
                     {`&nbsp;&nbsp;${createdWebhook.endpoint} \<br />
                      &nbsp;&nbsp;-H 'Content-Type: application/json' \<br />
                      &nbsp;&nbsp;-d '{"payload": "test"}'`}
                    </code>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>Your webhook will accept:</p>
                    <ul className="list-inside list-disc">
                      <li>POST, GET, PUT, DELETE, PATCH requests</li>
                      <li>JSON payloads</li>
                      <li>Query parameters</li>
                      <li>Custom headers</li>
                    </ul>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => {
                  setCreatedWebhook(null)
                  setOpen(false)
                }}
              >
                Close
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}