import { Module } from '@nestjs/common';
import { WebsocketGateway } from './websockets/websocket/websocket.gateway';
import { WebsocketModule } from './websockets/websocket/websocket.module';

@Module({
  imports: [WebsocketModule],
  controllers: [],
  providers: [WebsocketGateway],
})
export class AppModule {}
