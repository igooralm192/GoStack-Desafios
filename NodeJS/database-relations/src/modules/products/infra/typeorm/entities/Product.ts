import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import OrderProduct from '@modules/orders/infra/typeorm/entities/OrderProduct';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 8, scale: 2 })
  price: number;

  @Column()
  quantity: number;

  @OneToMany(() => OrderProduct, orderProduct => orderProduct.product)
  order_products: OrderProduct[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Product;
