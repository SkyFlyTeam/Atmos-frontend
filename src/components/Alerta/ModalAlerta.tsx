"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { NotificationData } from "../Alerta/DadosMockados"

interface NotificationModalProps {
  notifications: NotificationData[]
  onMarkAsRead: (notificationId: number) => void
  isOpen: boolean
  onClose: () => void
}

const iconColors: Record<string, string> = {
  yellow: "bg-yellow-400",
  orange: "bg-orange-400",
  red: "bg-red-500",
}

export function NotificationModal({ notifications, onMarkAsRead, isOpen, onClose }: NotificationModalProps) {
  // local copy to allow marking as read inside modal before notifying parent
  const [localNotifications, setLocalNotifications] = useState<NotificationData[]>(notifications)

  useEffect(() => {
    setLocalNotifications(notifications)
  }, [notifications])

  const unreadCount = localNotifications.filter((n) => !n.isRead).length

  const handleClose = () => {
    // Mark all as read when closing
    const updated = localNotifications.map((n) => ({ ...n, isRead: true }))
    setLocalNotifications(updated)
    updated.forEach((n) => onMarkAsRead(n.pk))
    onClose()
  }

  return (
    <>
      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Overlay */}
          <div className="fixed inset-0 bg-black/50" onClick={handleClose} />

          {/* Panel container: center on small screens, align to right on md+ */}
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

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {localNotifications.length === 0 ? (
                    <div className="p-6 flex flex-col items-center justify-center gap-4">
                      <div className="w-48 h-48 relative">
                        {/* Use public/sem-dados.svg when there are no notifications */}
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
                              className={`w-10 h-10 rounded-full flex-shrink-0 ${
                                iconColors[notification.tipoAlerta.icone]
                              }`}
                            />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-sm text-foreground">
                                  {notification.tipoAlerta.nome} | {notification.valorCapturado.descricao}
                                </p>
                                <p className="text-xs text-muted-foreground ml-2">{notification.data}</p>
                              </div>

                              <div className="flex items-center justify-between mt-1">
                                <p className="text-xs text-muted-foreground">{notification.valorCapturado.estacao}</p>
                                {!notification.isRead && (
                                  <Badge variant="destructive" className="text-xs text-white">
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
