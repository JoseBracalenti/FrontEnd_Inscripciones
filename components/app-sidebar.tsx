"use client"

import { LayoutDashboard, Users, FileText, Upload, History, BookOpen, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Inscripciones", href: "/admin/inscripciones", icon: Users },
  { name: "Cursos", href: "/admin/cursos", icon: BookOpen },
  { name: "Consultas", href: "/admin/consultas", icon: FileText },
  { name: "Importar Datos", href: "/admin/importar", icon: Upload },
  { name: "Auditoría", href: "/admin/auditoria", icon: History },
  { name: "Configuración", href: "/admin/configuracion", icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-primary">
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
