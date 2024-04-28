import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true }) // Interfaces para sabir cuando el usuario se conecta y cuando se desconecta
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server; // Contiene la información de los clientes conectados
  constructor(private readonly messagesWsService: MessagesWsService) {}
  handleConnection(client: Socket) {
    // console.log('User connected: ', client.id);
    this.messagesWsService.registerCliente(client);
    // console.log({ conectado: this.messagesWsService.getConnectendClients() }); // No de clientes conectados
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectendClients(),
    );
  }
  handleDisconnect(client: Socket) {
    // console.log('User disconnected: ', client.id);
    this.messagesWsService.removeCliente(client.id);
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectendClients(),
    );
  }
}
