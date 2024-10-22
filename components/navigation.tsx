"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/auth/user-nav"
import { createClient } from "@/lib/supabase/client"

export function Navigation() {
  const [open, setOpen] = React.useState(false)
  const [user, setUser] = React.useState<any>(null)
  const pathname = usePathname()
  const supabase = createClient()

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const routes = [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      auth: true,
    },
    {
      href: "/settings",
      label: "Settings",
      auth: true,
    },
  ]

  const filteredRoutes = routes.filter(route => !route.auth || (route.auth && user))

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Modern App
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {filteredRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === route.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10">
              <div className="flex flex-col space-y-3">
                {filteredRoutes.map(
                  (route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "text-foreground/70 transition-colors hover:text-foreground",
                        pathname === route.href && "text-foreground"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {route.label}
                    </Link>
                  )
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
          </div>
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            {user ? (
              <UserNav user={user} />
            ) : (
              <Button asChild variant="secondary" size="sm">
                <Link href="/login">
                  Sign In
                </Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}