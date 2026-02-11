"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { History, User } from "lucide-react"

const auditLogs = [
  {
    id: 1,
    usuario: "admin@liceo.edu",
    accion: "Confirmar Inscripción",
    detalle: "Inscripción #000342 confirmada - Pago recibido",
    fecha: "2026-01-25 14:23:15",
    tipo: "success",
  },
  {
    id: 2,
    usuario: "admin@liceo.edu",
    accion: "Crear Inscripción",
    detalle: "Nueva inscripción registrada - Alumno García, María",
    fecha: "2026-01-25 11:15:42",
    tipo: "info",
  },
  {
    id: 3,
    usuario: "admin@liceo.edu",
    accion: "Cancelar Inscripción",
    detalle: "Inscripción #000298 cancelada - Vencimiento plazo",
    fecha: "2026-01-24 09:30:22",
    tipo: "warning",
  },
  {
    id: 4,
    usuario: "admin@liceo.edu",
    accion: "Modificar Datos",
    detalle: "Actualización de datos de contacto - Alumno López",
    fecha: "2026-01-23 16:45:10",
    tipo: "info",
  },
  {
    id: 5,
    usuario: "admin@liceo.edu",
    accion: "Importar Datos",
    detalle: "Archivo pagos-enero-2026.csv procesado - 145 registros",
    fecha: "2026-01-20 10:12:05",
    tipo: "success",
  },
]

export default function AuditoriaPage() {
  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "success":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Éxito</Badge>
      case "warning":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Advertencia</Badge>
      case "info":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Info</Badge>
      default:
        return <Badge variant="secondary">{tipo}</Badge>
    }
  }

  return (
    <AppLayout title="Auditoría">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Auditoría del Sistema</h2>
          <p className="text-muted-foreground">Historial de modificaciones y acciones registradas</p>
        </div>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Registro de Auditoría
            </CardTitle>
            <CardDescription>
              Todas las modificaciones en los datos de inscripción quedan registradas con usuario, fecha y detalle de la acción
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Detalle</TableHead>
                    <TableHead>Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">{log.fecha}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          {log.usuario}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{log.accion}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.detalle}</TableCell>
                      <TableCell>{getTipoBadge(log.tipo)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Info Alert */}
        <div className="rounded-lg border bg-muted/30 p-4">
          <p className="text-sm text-muted-foreground">
            <strong>Nota:</strong> El historial de auditoría no puede ser alterado ni eliminado por usuarios 
            finales o administrativos. Todos los registros son permanentes y se conservan para fines de 
            trazabilidad y cumplimiento normativo.
          </p>
        </div>
      </div>
    </AppLayout>
  )
}
