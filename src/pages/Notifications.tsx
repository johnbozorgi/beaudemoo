import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, AlertCircle, Info, Trash2, Clock, Check, BellOff } from "lucide-react";
import { useNotifications, Notification } from "@/context/NotificationContext";
import { motion, AnimatePresence } from "motion/react";
import { formatDistanceToNow } from "date-fns";

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead, clearNotifications, unreadCount } = useNotifications();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Bell className="h-6 w-6 text-blue-500" />
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-slate-400">Stay updated on your biological telemetry and system alerts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
            className="border-slate-800 text-slate-400 hover:bg-slate-800"
          >
            <Check className="h-4 w-4 mr-2" /> Mark all as read
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearNotifications}
            disabled={notifications.length === 0}
            className="border-slate-800 text-red-400 hover:bg-red-400/10 hover:border-red-400/20"
          >
            <Trash2 className="h-4 w-4 mr-2" /> Clear all
          </Button>
        </div>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <AnimatePresence mode="popLayout">
            {notifications.length > 0 ? (
              <div className="divide-y divide-slate-800">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className={`p-6 flex items-start gap-4 transition-colors ${notification.read ? 'opacity-60' : 'bg-blue-500/5'}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-semibold ${notification.read ? 'text-slate-400' : 'text-slate-100'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-2 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center px-6">
                <div className="h-16 w-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  <BellOff className="h-8 w-8 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-300">All caught up!</h3>
                <p className="text-slate-500 max-w-xs mt-2">
                  You don't have any notifications right now. We'll alert you when there's new biological telemetry or system updates.
                </p>
              </div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
