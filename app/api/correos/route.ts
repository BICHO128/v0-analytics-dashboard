import { NextResponse } from 'next/server'
import { obtenerCorreos } from '@/lib/store'
import type {
  ResumenEstadisticas,
  ConsultaPorTipo,
  CorreosPorDia,
} from '@/lib/types'

// GET /api/correos
// Obtiene todos los correos procesados con estadísticas
export async function GET() {
  try {
    const correos = obtenerCorreos()

    // Calcular estadísticas
    const totalCorreos = correos.length
    const correosEscalados = correos.filter((c) => c.escalado).length
    const porcentajeEscalados =
      totalCorreos > 0 ? Math.round((correosEscalados / totalCorreos) * 100) : 0

    // Tiempo promedio de respuesta (simulado - en producción vendría de los datos reales)
    const tiempoPromedioRespuesta = 2.5 // minutos

    // Calcular prioridad predominante
    const contadorPrioridades = correos.reduce(
      (acc, c) => {
        acc[c.prioridad]++
        return acc
      },
      { alta: 0, media: 0, baja: 0 }
    )

    const prioridadPredominante = (
      Object.entries(contadorPrioridades) as [
        'alta' | 'media' | 'baja',
        number,
      ][]
    ).reduce((a, b) => (a[1] > b[1] ? a : b))[0]

    const resumen: ResumenEstadisticas = {
      totalCorreos,
      porcentajeEscalados,
      tiempoPromedioRespuesta,
      prioridadPredominante,
    }

    // Calcular consultas por tipo
    const consultasPorTipoMap = correos.reduce(
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
    const correosPorDiaMap = correos.reduce(
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
      correos,
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
