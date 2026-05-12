'use client'

import {
  BarChart3,
  Bot,
  Home,
  Mail,
  Settings,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar'

// Elementos del menú principal
const menuPrincipal = [
  {
    titulo: 'Panel Principal',
    url: '#',
    icono: Home,
    activo: true,
  },
  {
    titulo: 'Correos Procesados',
    url: '#correos',
    icono: Mail,
    activo: false,
  },
  {
    titulo: 'Analíticas',
    url: '#analiticas',
    icono: BarChart3,
    activo: false,
  },
  {
    titulo: 'Escalamientos',
    url: '#escalamientos',
    icono: AlertTriangle,
    activo: false,
  },
]

// Elementos del menú secundario
const menuSecundario = [
  {
    titulo: 'Rendimiento IA',
    url: '#rendimiento',
    icono: TrendingUp,
  },
  {
    titulo: 'Configuración',
    url: '#config',
    icono: Settings,
  },
]

export function SidebarNav() {
  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold text-foreground">
              n8n Analytics
            </span>
            <span className="text-xs text-muted-foreground">
              Dashboard IA
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuPrincipal.map((item) => (
                <SidebarMenuItem key={item.titulo}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.activo}
                    tooltip={item.titulo}
                  >
                    <a href={item.url}>
                      <item.icono className="h-4 w-4" />
                      <span>{item.titulo}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Herramientas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuSecundario.map((item) => (
                <SidebarMenuItem key={item.titulo}>
                  <SidebarMenuButton asChild tooltip={item.titulo}>
                    <a href={item.url}>
                      <item.icono className="h-4 w-4" />
                      <span>{item.titulo}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:hidden">
        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs text-muted-foreground">
            Conectado a n8n
          </p>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-foreground">
              Webhook Activo
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
