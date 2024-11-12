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
import { Observable, from, map } from 'rxjs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected', client.id);
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

    console.log(data);
    console.log(from(response).pipe(map((data) => ({ event, data }))));
    return from(response).pipe(map((data) => (console.log({event, data}), {event, data})));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
