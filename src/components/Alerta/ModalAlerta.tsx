"use client"

import { useState, useEffect, useMemo } from "react"
import { X } from "lucide-react"
import { BiFilter } from "react-icons/bi"
import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns'
import { MultipleCombobox } from "@/components/MultipleCombobox/MultipleCombobox"
import DateInput from "@/components/Inputs/DateInput/DateInput"

function formatNotificationDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return format(d, 'dd/MM/yyyy HH:mm')
  } catch {
    return dateStr
  }
}
// Notifications come from backend and websocket; shape may include nested `tipoAlerta` and `valorCapturado`.
type NotificationData = any;

const _localColorMap: Record<number, string> = {}
function getColorForTipoLocal(tipoPk: number): string {
  if (_localColorMap[tipoPk]) return _localColorMap[tipoPk]
  const hue = (tipoPk * 137) % 360
  const saturation = 70
  const lightness = 50
  const color = `hsl(${hue} ${saturation}% ${lightness}%)`
  _localColorMap[tipoPk] = color
  return color
}

interface NotificationModalProps {
  notifications: NotificationData[]
  onMarkAsRead: (notificationId: number) => void
  isOpen: boolean
  onClose: () => void
}

export function NotificationModal({ notifications, onMarkAsRead, isOpen, onClose }: NotificationModalProps) {
  
  const [localNotifications, setLocalNotifications] = useState<NotificationData[]>([])
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [selectedTipo, setSelectedTipo] = useState<string[] | undefined>(undefined)
  const [selectedEstacao, setSelectedEstacao] = useState<string[] | undefined>(undefined)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    // Ensure a defensive copy and sort newest -> oldest
    const sorted = (Array.isArray(notifications) ? notifications.slice() : [])
      .sort((a: any, b: any) => {
        const da = new Date(a.data).getTime() || 0
        const db = new Date(b.data).getTime() || 0
        return db - da
      })
    setLocalNotifications(sorted)
  }, [notifications])

  const tipoOptions = useMemo(() => {
    const map = new Map<string, string>()
    localNotifications.forEach((n: any) => {
      const tipo = n?.tipoAlerta ?? {}
      const pk = tipo?.pk ?? n?.tipo_alerta_pk
      const label = tipo?.tipo ?? tipo?.nome ?? (pk ? String(pk) : undefined)
      if (pk != null && label) map.set(String(pk), String(label))
    })
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }))
  }, [localNotifications])

  const estacaoOptions = useMemo(() => {
    const map = new Map<string, string>()
    localNotifications.forEach((n: any) => {
      const vc = n?.valorCapturado ?? {}
      const est = vc?.estacao
      if (!est) return
      const pk = est?.pk ?? est?.id
      const label = typeof est === 'string' ? est : (est?.nome ?? (pk ? String(pk) : undefined))
      const value = pk != null ? String(pk) : String(label)
      if (value && label) map.set(value, label)
    })
    return Array.from(map.entries()).map(([value, label]) => ({ value, label }))
  }, [localNotifications])

  const filteredNotifications = useMemo(() => {
    return localNotifications.filter((n: any) => {
      if (selectedTipo && selectedTipo.length > 0) {
        const tipoPk = n?.tipoAlerta?.pk ?? n?.tipo_alerta_pk
        if (!tipoPk || !selectedTipo.includes(String(tipoPk))) return false
      }
      if (selectedEstacao && selectedEstacao.length > 0) {
        const est = n?.valorCapturado?.estacao
        const estPk = est?.pk ?? est?.id
        const estValue = estPk != null ? String(estPk) : (typeof est === 'string' ? est : (est?.nome ?? undefined))
        if (!estValue || !selectedEstacao.includes(String(estValue))) return false
      }
      if (selectedDate) {
        const d = new Date(n.data)
        if (isNaN(d.getTime())) return false
        const a = d.getFullYear() === selectedDate.getFullYear() && d.getMonth() === selectedDate.getMonth() && d.getDate() === selectedDate.getDate()
        if (!a) return false
      }
      return true
    })
  }, [localNotifications, selectedTipo, selectedEstacao, selectedDate])

  const unreadCount = localNotifications.filter((n) => !n.isRead).length

  const handleClose = () => {
    const updated = localNotifications.map((n) => ({ ...n, isRead: true }))
    setLocalNotifications(updated)
    updated.forEach((n) => onMarkAsRead(n.pk))
    onClose()
  }

  const handleMarkSingle = (pk: number) => {
    setLocalNotifications((prev) => prev.map((p) => (p.pk === pk ? { ...p, isRead: true } : p)))
    onMarkAsRead(pk)
  }

  return (
    <>
      
      {isOpen && (
        <div className="fixed inset-0 z-50">
          
          <div className="fixed inset-0 bg-black/50" onClick={handleClose} />

          <div className="fixed inset-0 z-50 flex items-start pt-16 md:pt-16 justify-center md:justify-end">
            {/* wider on desktop so date/time and type|valor fit on one line when possible */}
            <div className="w-full md:w-[560px] md:mr-4 px-4">
              <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-background">
                  <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-foreground">Todos</h2>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs text-white">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowFilters((s) => !s)}
                      className={"p-1 rounded transition-colors " + (showFilters ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800')}
                      aria-label="Filtro"
                      title="Filtros"
                      aria-pressed={showFilters}
                    >
                      <BiFilter className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleClose}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                      aria-label="Fechar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {showFilters && (
                  <div className="p-3 border-b bg-white">
                    <div className="grid grid-cols-1 gap-3 items-start w-full" style={{ gridTemplateColumns: '1fr 1fr auto' }}>
                      <div className="flex flex-col min-w-0">
                        <label className="text-xs text-muted-foreground mb-1">Tipo de alerta</label>
                        <MultipleCombobox
                          options={tipoOptions}
                          value={selectedTipo ?? []}
                          onSelect={(vals) => setSelectedTipo(vals.length ? vals : undefined)}
                          placeholder="Selecione"
                          searchPlaceholder="Buscar tipo..."
                          widthClass="w-full"
                          className="!pl-0 pr-2"
                        />
                      </div>

                      <div className="flex flex-col min-w-0">
                        <label className="text-xs text-muted-foreground mb-1">Estação</label>
                        <MultipleCombobox
                          options={estacaoOptions}
                          value={selectedEstacao ?? []}
                          onSelect={(vals) => setSelectedEstacao(vals.length ? vals : undefined)}
                          placeholder="Selecione"
                          searchPlaceholder="Buscar estação..."
                          widthClass="w-full"
                          className="!pl-0 pr-2"
                        />
                      </div>

                      <div className="flex flex-col relative min-w-0">
                        <label className="text-xs text-muted-foreground mb-1">Data</label>
                        <div className="flex items-center gap-2">
                          <div className="w-full">
                            <DateInput
                              date={selectedDate}
                              setDate={(d: any) => {
                                if (d instanceof Date) setSelectedDate(d)
                                else if (Array.isArray(d) && d.length > 0 && d[0] instanceof Date) setSelectedDate(d[0])
                                else setSelectedDate(null)
                              }}
                              mode="single"
                              disabledDates={{}}
                              placeholder="Selecione"
                              buttonClassName="!pl-0 pr-2"
                            />
                          </div>
                          {selectedDate && (
                            <button
                              onClick={() => setSelectedDate(null)}
                              className="flex items-center justify-center w-8 h-8 rounded bg-gray-100 hover:bg-gray-200"
                              aria-label="Limpar data"
                              title="Limpar data"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

               
                <div className="max-h-96 overflow-y-auto">
                  {filteredNotifications.length === 0 ? (
                    <div className="p-6 flex flex-col items-center justify-center gap-4">
                      <div className="w-48 h-48 relative">
                        
                        <Image src="/sem-dados.svg" alt="Sem dados" fill style={{ objectFit: 'contain' }} />
                      </div>
                      <p className="text-center text-foreground" style={{ fontFamily: 'Londrina Solid, sans-serif' }}>
                        Oops! Parece que não tem dados aqui!
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {filteredNotifications.map((notification) => (
                        <div key={notification.pk} className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex gap-3">
                            {/* Icon */}
                            <div
                              className="w-10 h-10 rounded-full flex-shrink-0"
                              style={{ backgroundColor: getColorForTipoLocal(notification?.tipoAlerta?.pk ?? notification?.tipo_alerta_pk ?? 0) }}
                            />

                           
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-sm text-foreground">
                                  {notification?.tipoAlerta?.tipo ?? notification?.tipoAlerta?.nome ?? notification.tipo_alerta_pk} |
                                  {(() => {
                                    const vc = notification?.valorCapturado ?? {};
                                    const valor = vc?.valor ?? vc?.descricao ?? notification?.valor ?? notification?.descricao ?? notification?.valor_capturado_pk;
                                    const unidade = vc?.unidade ?? '';
                                    return ` ${valor}${unidade ? ` ${unidade}` : ''}`;
                                  })()}
                                </p>
                                <p className="text-xs text-muted-foreground ml-2">{formatNotificationDate(notification.data)}</p>
                              </div>

                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-muted-foreground">{typeof notification?.valorCapturado?.estacao === 'string' ? notification.valorCapturado.estacao : (notification?.valorCapturado?.estacao?.nome ?? '')}</p>
                                {!notification.isRead && (
                                  <Badge variant="destructive" className="text-xs text-white" onClick={() => handleMarkSingle(notification.pk)}>
                                    Novo
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
