import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectedClients {
  [id: string]: Socket; // id de los sockets
}

@Injectable()
export class MessagesWsService {
  // Almacenar los sockets para después identificalos
  private connectedClients: ConnectedClients = {};

  // Cuando un cliente se conecte, se ejecutará
  registerCliente(client: Socket) {
    this.connectedClients[client.id] = client;
  }

  //Cuando el cliente se desconecte
  removeCliente(clienteId: string) {
    delete this.connectedClients[clienteId];
  }

  getConnectendClients(): string[] {
    return Object.keys(this.connectedClients);
  }
}
