import { RealtimeEvent, RealtimeEventType, RealtimeConfig, EventCallback, ConnectionCallback } from './types';

export class RealtimeManager {
  private ws: WebSocket | null = null;
  private config: RealtimeConfig;
  private eventCallbacks = new Map<RealtimeEventType, Set<EventCallback>>();
  private connectionCallbacks = new Set<ConnectionCallback>();
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private _isConnected = false;
  private rooms = new Set<string>();
  private _sessionId: string;

  constructor(config: RealtimeConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      enableLogging: false,
      ...config,
    };
    this._sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private log(message: string, ...args: any[]) {
    if (this.config.enableLogging) {
      console.log(`[Realtime] ${message}`, ...args);
    }
  }

  // Connection management
  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    return new Promise((resolve, reject) => {
      try {
        this.log('Connecting to:', this.config.url);
        this.ws = new WebSocket(this.config.url);

        this.ws.onopen = () => {
          this.log('Connected');
          this._isConnected = true;
          this.reconnectAttempts = 0;

          // Send authentication/session info
          this.send({
            type: 'auth',
            sessionId: this._sessionId,
            rooms: Array.from(this.rooms),
          });

          this.connectionCallbacks.forEach(callback => callback(true));
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            this.log('Failed to parse message:', error);
          }
        };

        this.ws.onclose = (event) => {
          this.log('Disconnected:', event.code, event.reason);
          this._isConnected = false;
          this.connectionCallbacks.forEach(callback => callback(false));

          if (!event.wasClean && this.reconnectAttempts < (this.config.maxReconnectAttempts || 10)) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          this.log('WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        this.log('Connection failed:', error);
        reject(error);
      }
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) return;

    this.reconnectAttempts++;
    this.log(`Scheduling reconnect attempt ${this.reconnectAttempts}`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, this.config.reconnectInterval);
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this._isConnected = false;
  }

  // Room management (for dataset/file-specific events)
  joinRoom(room: string) {
    this.rooms.add(room);
    if (this._isConnected) {
      this.send({ type: 'join_room', room });
    }
  }

  leaveRoom(room: string) {
    this.rooms.delete(room);
    if (this._isConnected) {
      this.send({ type: 'leave_room', room });
    }
  }

  // Event handling
  private handleMessage(data: any) {
    if (data.type && typeof data.type === 'string') {
      const event: RealtimeEvent = {
        id: data.id || `event_${Date.now()}`,
        type: data.type,
        payload: data.payload || {},
        timestamp: data.timestamp || new Date().toISOString(),
        userId: data.userId,
        sessionId: data.sessionId,
        room: data.room,
      };

      this.emitEvent(event);
    }
  }

  private emitEvent(event: RealtimeEvent) {
    const callbacks = this.eventCallbacks.get(event.type);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          this.log('Error in event callback:', error);
        }
      });
    }
  }

  // Event subscription
  on(eventType: RealtimeEventType, callback: EventCallback) {
    if (!this.eventCallbacks.has(eventType)) {
      this.eventCallbacks.set(eventType, new Set());
    }
    this.eventCallbacks.get(eventType)!.add(callback);
  }

  off(eventType: RealtimeEventType, callback: EventCallback) {
    const callbacks = this.eventCallbacks.get(eventType);
    if (callbacks) {
      callbacks.delete(callback);
    }
  }

  onConnection(callback: ConnectionCallback) {
    this.connectionCallbacks.add(callback);
  }

  offConnection(callback: ConnectionCallback) {
    this.connectionCallbacks.delete(callback);
  }

  // Send messages
  send(data: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      this.log('Cannot send: WebSocket not connected');
    }
  }

  // Broadcast events to other clients
  broadcast(eventType: RealtimeEventType, payload: any, room?: string) {
    this.send({
      type: 'broadcast',
      eventType,
      payload,
      room,
      sessionId: this._sessionId,
    });
  }

  // Getters
  get isConnected(): boolean {
    return this._isConnected;
  }

  get sessionId(): string {
    return this._sessionId;
  }
}