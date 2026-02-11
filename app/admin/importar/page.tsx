"use client"

import { Badge } from "@/components/ui/badge"

import React from "react"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileSpreadsheet, Download, AlertCircle, CheckCircle } from "lucide-react"

export default function ImportarPage() {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = () => {
    setImporting(true)
    // Simular importación
    setTimeout(() => {
      setImporting(false)
      setFile(null)
    }, 2000)
  }

  return (
    <AppLayout title="Importar Datos">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Importar Archivo Municipal</h2>
          <p className="text-muted-foreground">Procesar archivo CSV/Excel con pagos del sistema municipal</p>
        </div>

        {/* Info Alert */}
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-semibold text-blue-900">Información Importante</h3>
              <p className="text-sm text-blue-800">
                Este módulo permite importar archivos CSV o Excel con los pagos procesados por el sistema 
                municipal. El archivo debe contener las columnas: DNI, Monto, Fecha de Pago, Comprobante.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Cargar Archivo
            </CardTitle>
            <CardDescription>Seleccione el archivo CSV o Excel del sistema municipal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FileSpreadsheet className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click para seleccionar</span> o arrastre el archivo
                  </p>
                  <p className="text-xs text-muted-foreground">CSV o XLSX (MAX. 10MB)</p>
                  {file && (
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                      <CheckCircle className="h-4 w-4" />
                      {file.name}
                    </div>
                  )}
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                disabled={!file || importing}
                onClick={handleImport}
              >
                {importing ? "Procesando..." : "Procesar Archivo"}
              </Button>
              <Button variant="outline" onClick={() => setFile(null)} disabled={!file}>
                Limpiar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Template Download */}
        <Card>
          <CardHeader>
            <CardTitle>Plantilla de Ejemplo</CardTitle>
            <CardDescription>Descargue la plantilla con el formato correcto</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Descargar Plantilla CSV
            </Button>
          </CardContent>
        </Card>

        {/* Recent Imports */}
        <Card>
          <CardHeader>
            <CardTitle>Importaciones Recientes</CardTitle>
            <CardDescription>Historial de archivos procesados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { file: "pagos-enero-2026.csv", date: "2026-01-20", records: 145, status: "Exitoso" },
                { file: "pagos-diciembre-2025.csv", date: "2025-12-28", records: 132, status: "Exitoso" },
                { file: "pagos-noviembre-2025.csv", date: "2025-11-25", records: 128, status: "Exitoso" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{item.file}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.records} registros procesados
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      {item.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
