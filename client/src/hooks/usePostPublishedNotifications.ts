import { useEffect, useRef } from 'react';
import { useToast } from './use-toast';

interface Options {
  userId: number;
  token: string;
}

export function usePostPublishedNotifications({ userId, token }: Options) {
  const { toast } = useToast();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function connect() {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/analytics?token=${encodeURIComponent(token)}`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.type === 'post_published') {
            if (message.data.userId !== userId) return;
            const { platform, content } = message.data;
            const preview =
              content && content.length > 60 ? content.slice(0, 60) + '…' : content;
            const platformLabel = platform
              ? platform.charAt(0).toUpperCase() + platform.slice(1)
              : 'Your';
            toast({
              title: `${platformLabel} post is now live`,
              description: preview || 'Your scheduled post has been published.',
              duration: 6000,
            });
          }
        } catch {
        }
      };

      ws.onclose = () => {
        reconnectRef.current = setTimeout(connect, 4000);
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [userId, token]);
}
