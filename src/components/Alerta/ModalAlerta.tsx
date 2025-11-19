"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from 'date-fns'

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
                  <button
                    onClick={handleClose}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    aria-label="Fechar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

               
                <div className="max-h-96 overflow-y-auto">
                  {localNotifications.length === 0 ? (
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
                      {localNotifications.map((notification) => (
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
