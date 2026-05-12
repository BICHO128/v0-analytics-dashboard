// Almacén de datos en memoria para el Dashboard
// Nota: En producción, esto debería conectarse a una base de datos como Supabase o Prisma

import type { CorreoIA } from './types'

// Datos de ejemplo para demostración
const datosEjemplo: CorreoIA[] = [
  {
    id: '1',
    fecha: '2026-05-10',
    remitente: 'cliente1@ejemplo.com',
    tipo_consulta: 'Facturación',
    prioridad: 'alta',
    escalado: false,
    respuesta_ia: 'Su factura ha sido procesada correctamente.',
    razon_escalado: null,
    seccion_aplicada: 'Política de Facturación',
    created_at: new Date('2026-05-10T10:30:00').toISOString(),
  },
  {
    id: '2',
    fecha: '2026-05-10',
    remitente: 'cliente2@ejemplo.com',
    tipo_consulta: 'Soporte Técnico',
    prioridad: 'media',
    escalado: true,
    respuesta_ia: 'Se requiere asistencia técnica especializada.',
    razon_escalado: 'Problema complejo fuera del alcance de la IA',
    seccion_aplicada: 'Protocolo de Escalamiento',
    created_at: new Date('2026-05-10T11:45:00').toISOString(),
  },
  {
    id: '3',
    fecha: '2026-05-09',
    remitente: 'cliente3@ejemplo.com',
    tipo_consulta: 'Devoluciones',
    prioridad: 'baja',
    escalado: false,
    respuesta_ia: 'Su solicitud de devolución ha sido aprobada.',
    razon_escalado: null,
    seccion_aplicada: 'Política de Devoluciones',
    created_at: new Date('2026-05-09T09:15:00').toISOString(),
  },
  {
    id: '4',
    fecha: '2026-05-09',
    remitente: 'cliente4@ejemplo.com',
    tipo_consulta: 'Consulta General',
    prioridad: 'baja',
    escalado: false,
    respuesta_ia: 'Gracias por su consulta. Aquí está la información solicitada.',
    razon_escalado: null,
    seccion_aplicada: 'FAQ General',
    created_at: new Date('2026-05-09T14:20:00').toISOString(),
  },
  {
    id: '5',
    fecha: '2026-05-08',
    remitente: 'cliente5@ejemplo.com',
    tipo_consulta: 'Facturación',
    prioridad: 'alta',
    escalado: true,
    respuesta_ia: 'Detectamos una discrepancia en su cuenta.',
    razon_escalado: 'Requiere revisión manual de facturación',
    seccion_aplicada: 'Política de Facturación',
    created_at: new Date('2026-05-08T16:00:00').toISOString(),
  },
  {
    id: '6',
    fecha: '2026-05-08',
    remitente: 'cliente6@ejemplo.com',
    tipo_consulta: 'Soporte Técnico',
    prioridad: 'media',
    escalado: false,
    respuesta_ia: 'El problema se ha resuelto reiniciando el servicio.',
    razon_escalado: null,
    seccion_aplicada: 'Guía de Solución de Problemas',
    created_at: new Date('2026-05-08T10:30:00').toISOString(),
  },
  {
    id: '7',
    fecha: '2026-05-07',
    remitente: 'cliente7@ejemplo.com',
    tipo_consulta: 'Devoluciones',
    prioridad: 'alta',
    escalado: true,
    respuesta_ia: 'Su caso requiere aprobación especial.',
    razon_escalado: 'Monto excede el límite automático',
    seccion_aplicada: 'Política de Devoluciones',
    created_at: new Date('2026-05-07T11:00:00').toISOString(),
  },
  {
    id: '8',
    fecha: '2026-05-07',
    remitente: 'cliente8@ejemplo.com',
    tipo_consulta: 'Consulta General',
    prioridad: 'baja',
    escalado: false,
    respuesta_ia: 'Información enviada a su correo electrónico.',
    razon_escalado: null,
    seccion_aplicada: 'FAQ General',
    created_at: new Date('2026-05-07T15:45:00').toISOString(),
  },
  {
    id: '9',
    fecha: '2026-05-06',
    remitente: 'cliente9@ejemplo.com',
    tipo_consulta: 'Facturación',
    prioridad: 'media',
    escalado: false,
    respuesta_ia: 'Su pago ha sido confirmado exitosamente.',
    razon_escalado: null,
    seccion_aplicada: 'Política de Facturación',
    created_at: new Date('2026-05-06T09:00:00').toISOString(),
  },
  {
    id: '10',
    fecha: '2026-05-06',
    remitente: 'cliente10@ejemplo.com',
    tipo_consulta: 'Soporte Técnico',
    prioridad: 'alta',
    escalado: true,
    respuesta_ia: 'Error crítico detectado en su cuenta.',
    razon_escalado: 'Problema de seguridad identificado',
    seccion_aplicada: 'Protocolo de Seguridad',
    created_at: new Date('2026-05-06T13:30:00').toISOString(),
  },
]

// Almacén global en memoria
let correos: CorreoIA[] = [...datosEjemplo]

export function obtenerCorreos(): CorreoIA[] {
  return correos.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
}

export function agregarCorreo(correo: CorreoIA): void {
  correos.push(correo)
}

export function generarId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}
