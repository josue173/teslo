import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces';

@WebSocketGateway({ cors: true }) // Interfaces para sabir cuando el usuario se conecta y cuando se desconecta
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server; // Contiene la información de los clientes conectados
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly _jwtService: JwtService,
  ) {}
  // handleConnection(client: Socket) {
  //   // console.log('User connected: ', client.id);
  //   const token = client.handshake.headers.authentication as string;
  //   let payload: JwtPayload;
  //   console.log({ token });

  //   try {
  //     payload = this._jwtService.verify(token);
  //   } catch (error) {
  //     client.disconnect();
  //     return;
  //   }

  //   this.messagesWsService.registerCliente(client);
  //   // console.log({ conectado: this.messagesWsService.getConnectendClients() }); // No de clientes conectados
  //   this.wss.emit(
  //     'clients-updated',
  //     this.messagesWsService.getConnectendClients(),
  //   );
  // }
  async handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this._jwtService.verify(token);
      await this.messagesWsService.registerCliente(client, payload.id);
      //await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    console.log({ payload });
    // console.log('Cliente conectado:', client.id );
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

  @SubscribeMessage('message-from-client') // Recibiendo evento del cliente
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    console.log(client.id, payload);
    // Emisión a un solo cliente
    // client.emit('messsage-from-server', { // Emitiendo al cliente
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message',
    // });
    // Emisión a todos los clientes, menos al inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy yo',
    //   message: payload.message || 'no-message',
    // });
    // Emisión a todos los clientes
    this.wss.emit('message-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message',
    });
  }
}
