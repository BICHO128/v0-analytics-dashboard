import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type {
  ResumenEstadisticas,
  ConsultaPorTipo,
  CorreosPorDia,
  CorreoIA,
} from '@/lib/types'

// Crear cliente Supabase para Route Handlers
async function createRouteClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignorar errores de cookies en Server Components
          }
        },
      },
    }
  )
}

// GET /api/correos
// Obtiene todos los correos procesados con estadísticas
export async function GET() {
  try {
    const supabase = await createRouteClient()

    const { data: correos, error } = await supabase
      .from('correos_ia')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error obteniendo correos de Supabase:', error)
      return NextResponse.json(
        { error: 'Error obteniendo datos de la base de datos' },
        { status: 500 }
      )
    }

    const correosData: CorreoIA[] = correos || []

    // Calcular estadísticas
    const totalCorreos = correosData.length
    const correosEscalados = correosData.filter((c) => c.escalado).length
    const porcentajeEscalados =
      totalCorreos > 0 ? Math.round((correosEscalados / totalCorreos) * 100) : 0

    // Tiempo promedio de respuesta (simulado)
    const tiempoPromedioRespuesta = 2.5

    // Calcular prioridad predominante
    const contadorPrioridades = correosData.reduce(
      (acc, c) => {
        acc[c.prioridad]++
        return acc
      },
      { alta: 0, media: 0, baja: 0 }
    )

    const prioridadPredominante =
      totalCorreos > 0
        ? (
            Object.entries(contadorPrioridades) as [
              'alta' | 'media' | 'baja',
              number,
            ][]
          ).reduce((a, b) => (a[1] > b[1] ? a : b))[0]
        : 'baja'

    const resumen: ResumenEstadisticas = {
      totalCorreos,
      porcentajeEscalados,
      tiempoPromedioRespuesta,
      prioridadPredominante,
    }

    // Calcular consultas por tipo
    const consultasPorTipoMap = correosData.reduce(
      (acc, c) => {
        acc[c.tipo_consulta] = (acc[c.tipo_consulta] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const consultasPorTipo: ConsultaPorTipo[] = Object.entries(
      consultasPorTipoMap
    ).map(([tipo, cantidad]) => ({
      tipo,
      cantidad,
    }))

    // Calcular correos por día (últimos 7 días)
    const correosPorDiaMap = correosData.reduce(
      (acc, c) => {
        const fecha = c.fecha
        acc[fecha] = (acc[fecha] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const correosPorDia: CorreosPorDia[] = Object.entries(correosPorDiaMap)
      .map(([fecha, cantidad]) => ({ fecha, cantidad }))
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
      .slice(-7)

    return NextResponse.json({
      correos: correosData,
      resumen,
      consultasPorTipo,
      correosPorDia,
    })
  } catch (error) {
    console.error('Error obteniendo correos:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
