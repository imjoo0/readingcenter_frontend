// hooks/useWebSocket.js
import { useEffect, useState } from 'react';

function useWebSocket(url, onMessage) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const webSocket = new WebSocket(url);

    webSocket.onopen = () => {
      console.log('WebSocket connection opened');
    };

    webSocket.onmessage = (event) => {
      console.log('Received data:', event.data);
      if (onMessage) {
        onMessage(event.data);
      }
    };

    webSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    webSocket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(webSocket);

    return () => {
      webSocket.close();  // 웹소켓 연결을 종료하는 로직
    };
  }, [url, onMessage]);

  return socket;
}

export default useWebSocket;
