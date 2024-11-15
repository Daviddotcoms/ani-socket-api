import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, map, Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected from server', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected', client.id);
  }

  @SubscribeMessage('events')
  findAll(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ): Observable<WsResponse<number>> {
    client.broadcast.emit('eventsServer', data);
    const event = 'events';
    const response = [1, 2, 3];
    return from(response).pipe(
      map((data) => (console.log({ event, data }), { event, data })),
    );
  }

  @SubscribeMessage('identity')
  async identity(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: number,
  ): Promise<number> {
    client.broadcast.emit('eventsServer', data);
    return data;
  }
}
