import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Interfaces para sabir cuando el usuario se conecta y cuando se desconecta
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messagesWsService: MessagesWsService) {}
  handleConnection(client: Socket) {
    // console.log('User connected: ', client.id);
    this.messagesWsService.registerCliente(client);
    // console.log({ conectado: this.messagesWsService.getConnectendClients() }); // No de clientes conectados
    
  }
  handleDisconnect(client: Socket) {
    // console.log('User disconnected: ', client.id);
    this.messagesWsService.removeCliente(client.id);
  }
}
