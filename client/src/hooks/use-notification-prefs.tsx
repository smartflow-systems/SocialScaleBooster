import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {}
  }, [prefs]);

  function update(patch: Partial<NotificationPrefs>) {
    setPrefs((prev) => ({ ...prev, ...patch }));
  }

  return (
    <NotificationPrefsContext.Provider value={{ prefs, update }}>
      {children}
    </NotificationPrefsContext.Provider>
  );
}

export function useNotificationPrefs() {
  return useContext(NotificationPrefsContext);
}
