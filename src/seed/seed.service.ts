import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Admin, Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    private _productService: ProductsService,
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}
  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.inserUsers();
    await this.insertNewProducts(adminUser);
    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this._productService.deleteAllProducts();
    const queryBuilder = this._userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async inserUsers() {
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach((user) => {
      users.push(this._userRepository.create(user));
    });

    const dbUsers = await this._userRepository.save(seedUsers);
    return dbUsers[0];
  }

  private async insertNewProducts(user: User) {
    this._productService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];

    products.forEach((product) => {
      insertPromises.push(this._productService.create(product, user));
    });

    await Promise.all(insertPromises);

    return true;
  }
}
