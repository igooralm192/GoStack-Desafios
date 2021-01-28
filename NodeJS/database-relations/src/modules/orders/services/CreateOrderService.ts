import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';

import Order from '../infra/typeorm/entities/Order';
import IOrdersRepository from '../repositories/IOrdersRepository';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateOrderService {
  constructor(
    @inject('OrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const filteredCustomer = await this.customersRepository.findById(
      customer_id,
    );

    if (!filteredCustomer) {
      throw new AppError('Customer does not exists.');
    }

    const filteredProducts = await this.productsRepository.findAllById(
      products,
    );

    const allProductsExists = filteredProducts.length === products.length;

    if (!allProductsExists) {
      throw new AppError("You can't create a order with inexistent products.");
    }

    const productsMap: { [key: string]: IProduct } = products.reduce(
      (map, product) => ({ ...map, [product.id]: product }),
      {},
    );

    const allProductsHaveSufficientQuantities = filteredProducts.every(
      ({ id, quantity: totalQuantity }) => {
        return productsMap[id].quantity <= totalQuantity;
      },
    );

    if (!allProductsHaveSufficientQuantities) {
      throw new AppError(
        "You can't create a order with insufficient quantities of a product.",
      );
    }

    const order = await this.ordersRepository.create({
      customer: filteredCustomer,
      products: filteredProducts.map(product => {
        return {
          product_id: product.id,
          price: product.price,
          quantity: productsMap[product.id].quantity,
        };
      }),
    });

    await this.productsRepository.updateQuantity(
      filteredProducts.map(({ id, quantity: totalQuantity }) => {
        return {
          id,
          quantity: totalQuantity - productsMap[id].quantity,
        };
      }),
    );

    return order;
  }
}

export default CreateOrderService;
