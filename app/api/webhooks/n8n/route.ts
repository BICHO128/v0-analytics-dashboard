import { NextResponse } from 'next/server'
import { agregarCorreo, generarId } from '@/lib/store'
import type { WebhookPayload, CorreoIA } from '@/lib/types'

// POST /api/webhooks/n8n
// Recibe datos del flujo de automatización de n8n
export async function POST(request: Request) {
  try {
    const payload: WebhookPayload = await request.json()

    // Validar campos requeridos
    const camposRequeridos: (keyof WebhookPayload)[] = [
      'fecha',
      'remitente',
      'tipo_consulta',
      'prioridad',
      'escalado',
      'respuesta_ia',
      'seccion_aplicada',
    ]

    for (const campo of camposRequeridos) {
      if (payload[campo] === undefined || payload[campo] === null) {
        // razon_escalado puede ser null
        if (campo !== 'razon_escalado') {
          return NextResponse.json(
            { error: `Campo requerido faltante: ${campo}` },
            { status: 400 }
          )
        }
      }
    }

    // Validar prioridad
    const prioridadesValidas = ['alta', 'media', 'baja']
    if (!prioridadesValidas.includes(payload.prioridad)) {
      return NextResponse.json(
        { error: 'Prioridad inválida. Debe ser: alta, media o baja' },
        { status: 400 }
      )
    }

    // Crear nuevo registro de correo
    const nuevoCorreo: CorreoIA = {
      id: generarId(),
      fecha: payload.fecha,
      remitente: payload.remitente,
      tipo_consulta: payload.tipo_consulta,
      prioridad: payload.prioridad,
      escalado: Boolean(payload.escalado),
      respuesta_ia: payload.respuesta_ia,
      razon_escalado: payload.razon_escalado || null,
      seccion_aplicada: payload.seccion_aplicada,
      created_at: new Date().toISOString(),
    }

    // Guardar en el almacén
    // Nota: En producción, aquí se guardaría en Supabase/Prisma
    agregarCorreo(nuevoCorreo)

    return NextResponse.json(
      {
        success: true,
        mensaje: 'Correo procesado correctamente',
        id: nuevoCorreo.id,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error procesando webhook de n8n:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// GET /api/webhooks/n8n
// Verificar que el endpoint está activo
export async function GET() {
  return NextResponse.json({
    status: 'activo',
    mensaje: 'Endpoint de webhook n8n funcionando correctamente',
    timestamp: new Date().toISOString(),
  })
}
