import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-dto.user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user-dto.user';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this._userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this._userRepository.save(user);
      // delete user.password;
      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this._userRepository.findOne({
      where: { email },
      select: { email: true, password: true },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)'); // Validando email
    if (!bcrypt.compareSync(password, user.password))
      // compareSync toma la nueva contraseña, le hace hash y verifica si coincide con la misma
      throw new UnauthorizedException('Credentials are not valid (password)');
    return user;
    // TO-DO: RETORNAR JWT
  }

  private handleDBErrors(error: any): never {
    if (error.code == 23505) {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Check server logs');
  }
}
