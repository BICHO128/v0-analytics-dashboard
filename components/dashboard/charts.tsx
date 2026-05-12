'use client'

import {
  Bar,
  BarChart,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { ConsultaPorTipo, CorreosPorDia } from '@/lib/types'

interface ChartsProps {
  consultasPorTipo: ConsultaPorTipo[]
  correosPorDia: CorreosPorDia[]
}

// Tooltip personalizado estilizado
function TooltipPersonalizado({ 
  active, 
  payload, 
  label,
  unidad = 'items'
}: { 
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
  unidad?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border/50 bg-card/95 backdrop-blur-sm px-4 py-3 shadow-xl">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold text-foreground">
          {payload[0].value}
          <span className="text-sm font-normal text-muted-foreground ml-1">{unidad}</span>
        </p>
      </div>
    )
  }
  return null
}

export function Charts({ consultasPorTipo, correosPorDia }: ChartsProps) {
  // Formatear fecha para mostrar
  const correosPorDiaFormateados = correosPorDia.map((item) => ({
    ...item,
    fechaCorta: new Date(item.fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
    }),
  }))

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Gráfico de Barras - Consultas por Tipo */}
      <Card className="border-border/50 bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Consultas por Tipo
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Distribución de consultas según categoría
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={consultasPorTipo} 
                layout="vertical"
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="var(--border)"
                  opacity={0.3}
                />
                <XAxis
                  type="number"
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="tipo"
                  type="category"
                  width={130}
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<TooltipPersonalizado unidad="consultas" />}
                  cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
                />
                <Bar
                  dataKey="cantidad"
                  fill="url(#barGradient)"
                  radius={[0, 6, 6, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Área - Flujo de Correos */}
      <Card className="border-border/50 bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground">
            Flujo de Correos
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Correos procesados por día (últimos 7 días)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={correosPorDiaFormateados}
                margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
              >
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="var(--chart-2)" stopOpacity={0.15} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                  opacity={0.3}
                  vertical={false}
                />
                <XAxis
                  dataKey="fechaCorta"
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  dx={-10}
                />
                <Tooltip
                  content={<TooltipPersonalizado unidad="correos" />}
                  cursor={{ stroke: 'var(--chart-2)', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                  type="monotone"
                  dataKey="cantidad"
                  stroke="var(--chart-2)"
                  strokeWidth={2.5}
                  fill="url(#areaGradient)"
                  dot={{
                    fill: 'hsl(var(--card))',
                    stroke: 'var(--chart-2)',
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{
                    fill: 'var(--chart-2)',
                    stroke: 'hsl(var(--card))',
                    strokeWidth: 2,
                    r: 6,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
