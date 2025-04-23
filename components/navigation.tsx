"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Upload, ClipboardList, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    { name: "Upload", path: "/", icon: <Upload className="h-5 w-5 mr-2" /> },
    { name: "Review", path: "/review", icon: <ClipboardList className="h-5 w-5 mr-2" /> },
    { name: "Allocate", path: "/allocate", icon: <Users className="h-5 w-5 mr-2" /> },
    { name: "History", path: "/history", icon: <Clock className="h-5 w-5 mr-2" /> },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <nav className="flex flex-col gap-4 mt-8">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              onClick={() => setOpen(false)}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                pathname === route.path ? "bg-[#2DD4BF]/10 text-[#2DD4BF]" : "hover:bg-gray-100"
              }`}
            >
              {route.icon}
              {route.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
