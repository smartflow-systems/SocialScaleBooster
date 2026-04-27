import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth-context";

export interface NotificationPrefs {
  badgePulse: boolean;
  toastNotifications: boolean;
}

interface NotificationPrefsContextType {
  prefs: NotificationPrefs;
  update: (patch: Partial<NotificationPrefs>) => void;
}

const STORAGE_KEY = "smartflow_notification_prefs";

const defaults: NotificationPrefs = {
  badgePulse: true,
  toastNotifications: true,
};

function load(): NotificationPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaults };
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return { ...defaults };
  }
}

const NotificationPrefsContext = createContext<NotificationPrefsContextType>({
  prefs: { ...defaults },
  update: () => {},
});

export function NotificationPrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<NotificationPrefs>(load);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}
  }, [prefs]);

  useEffect(() => {
    if (!token) return;
    apiRequest("GET", "/api/user/preferences")
      .then((res) => res.json())
      .then((data: { notificationPrefs: Partial<NotificationPrefs> | null }) => {
        if (data.notificationPrefs && typeof data.notificationPrefs === "object") {
          setPrefs((prev) => ({ ...prev, ...data.notificationPrefs }));
        }
      })
      .catch(() => {});
  }, [token]);

  function update(patch: Partial<NotificationPrefs>) {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      if (token) {
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(() => {
          apiRequest("PATCH", "/api/user/preferences", next).catch(() => {});
        }, 300);
      }
      return next;
    });
  }

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  return (
    <NotificationPrefsContext.Provider value={{ prefs, update }}>
      {children}
    </NotificationPrefsContext.Provider>
  );
}

export function useNotificationPrefs() {
  return useContext(NotificationPrefsContext);
}
