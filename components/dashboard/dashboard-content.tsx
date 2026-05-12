'use client'

import useSWR from 'swr'
import { RefreshCw } from 'lucide-react'

import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StatsCards } from './stats-cards'
import { Charts } from './charts'
import { DataTable } from './data-table'
import type {
  CorreoIA,
  ResumenEstadisticas,
  ConsultaPorTipo,
  CorreosPorDia,
} from '@/lib/types'

interface DashboardData {
  correos: CorreoIA[]
  resumen: ResumenEstadisticas
  consultasPorTipo: ConsultaPorTipo[]
  correosPorDia: CorreosPorDia[]
}

// Fetcher para SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json())

// Componente de carga
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-lg" />
        ))}
      </div>
      {/* Charts skeleton */}
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[400px] rounded-lg" />
        <Skeleton className="h-[400px] rounded-lg" />
      </div>
      {/* Table skeleton */}
      <Skeleton className="h-[500px] rounded-lg" />
    </div>
  )
}

export function DashboardContent() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>(
    '/api/correos',
    fetcher,
    {
      refreshInterval: 30000, // Actualizar cada 30 segundos
      revalidateOnFocus: true,
    }
  )

  return (
    <SidebarInset>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-1 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              Dashboard de Analítica
            </h1>
            <p className="text-sm text-muted-foreground">
              Automatización n8n + IA (Ollama + RAG)
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => mutate()}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 md:p-6">
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-500">
            Error al cargar los datos. Por favor, intenta de nuevo.
          </div>
        )}

        {isLoading && <LoadingSkeleton />}

        {data && !isLoading && (
          <div className="space-y-6">
            {/* Tarjetas de Resumen */}
            <StatsCards resumen={data.resumen} />

            {/* Gráficos */}
            <Charts
              consultasPorTipo={data.consultasPorTipo}
              correosPorDia={data.correosPorDia}
            />

            {/* Tabla de Datos */}
            <DataTable data={data.correos} />
          </div>
        )}
      </main>
    </SidebarInset>
  )
}
