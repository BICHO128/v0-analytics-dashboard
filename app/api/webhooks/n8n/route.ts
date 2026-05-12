import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { WebhookPayload } from '@/lib/types'

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

    // Crear cliente Supabase
    const supabase = await createRouteClient()

    // Insertar en Supabase
    const { data, error } = await supabase
      .from('correos_ia')
      .insert([
        {
          fecha: payload.fecha,
          remitente: payload.remitente,
          tipo_consulta: payload.tipo_consulta,
          prioridad: payload.prioridad,
          escalado: Boolean(payload.escalado),
          respuesta_ia: payload.respuesta_ia,
          razon_escalado: payload.razon_escalado || null,
          seccion_aplicada: payload.seccion_aplicada,
        },
      ])
      .select('id')
      .single()

    if (error) {
      console.error('Error insertando en Supabase:', error)
      return NextResponse.json(
        { error: 'Error guardando el correo en la base de datos' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        mensaje: 'Correo procesado correctamente',
        id: data.id,
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
