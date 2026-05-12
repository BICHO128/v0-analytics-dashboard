'use client'

import {
  Bar,
  BarChart,
  Line,
  LineChart,
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
    <div className="grid gap-4 md:grid-cols-2">
      {/* Gráfico de Barras - Consultas por Tipo */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Consultas por Tipo</CardTitle>
          <CardDescription>
            Distribución de consultas según su categoría
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consultasPorTipo} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  type="number"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis
                  dataKey="tipo"
                  type="category"
                  width={120}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [value, 'Consultas']}
                />
                <Bar
                  dataKey="cantidad"
                  fill="hsl(var(--primary))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Líneas - Correos por Día */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Flujo de Correos</CardTitle>
          <CardDescription>
            Correos procesados por día (últimos 7 días)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={correosPorDiaFormateados}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="fechaCorta"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value: number) => [value, 'Correos']}
                />
                <Line
                  type="monotone"
                  dataKey="cantidad"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
