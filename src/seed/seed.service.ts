import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {
  constructor(private _productService: ProductsService) {}
  async runSeed() {
    this.insertNewProducts();
    return 'SEED EXECUTED';
  }

  private async insertNewProducts() {
    this._productService.deleteAllProducts();

    const products = initialData.products;
    const insertPromises = [];

    // products.forEach((product) => {
    // insertPromises.push(this._productService.create(product));
    // });

    await Promise.all(insertPromises);

    return true;
  }
}
