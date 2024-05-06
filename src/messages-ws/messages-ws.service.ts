import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
  }; // id de los sockets
}

@Injectable()
export class MessagesWsService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  // Almacenar los sockets para después identificalos
  private connectedClients: ConnectedClients = {};

  // Cuando un cliente se conecte, se ejecutará
  async registerCliente(client: Socket, id: string) {
    const user = await this._userRepository.findOneBy({ id });
    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User not active');
    this.connectedClients[client.id] = { socket: client, user };
  }

  //Cuando el cliente se desconecte
  removeCliente(clienteId: string) {
    delete this.connectedClients[clienteId];
  }

  getConnectendClients(): string[] {
    console.log(this.connectedClients);

    return Object.keys(this.connectedClients);
  }

  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.fullName;
  }
}
