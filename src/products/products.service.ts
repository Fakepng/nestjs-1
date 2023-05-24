import { Injectable, NotFoundException } from "@nestjs/common";
import { createId } from "@paralleldrive/cuid2";

import { Product } from "./product.model";

@Injectable()
export class ProductsService {
  private products: Product[] = [];

  insertProduct(title: string, description: string, price: number) {
    const prodId = createId();
    const newProduct = new Product(prodId, title, description, price);
    this.products.push(newProduct);

    return prodId;
  }

  getAllProducts() {
    return [...this.products];
  }

  getProduct(prodId: string) {
    const [product, productIndex] = this.findProduct(prodId);
    return { ...product };
  }

  updateProduct(
    prodId: string,
    title: string,
    description: string,
    price: number,
  ) {
    const [product, productIndex] = this.findProduct(prodId);

    const updatedProduct = { ...product };

    if (title) updatedProduct.title = title;
    if (description) updatedProduct.description = description;
    if (price) updatedProduct.price = price;

    this.products[productIndex] = updatedProduct;
  }

  removeProduct(prodId: string) {
    const [product, productIndex] = this.findProduct(prodId);

    this.products.splice(productIndex, 1);
  }

  private findProduct(id: string): [Product, number] {
    const productIndex = this.products.findIndex(
      (product) => product.id === id,
    );

    const product = this.products[productIndex];

    if (!product) {
      throw new NotFoundException("Could not find product.");
    }

    return [product, productIndex];
  }
}
