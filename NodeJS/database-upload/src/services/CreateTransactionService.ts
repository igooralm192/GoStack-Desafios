import { Repository } from 'typeorm';

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  constructor(
    private transactionsRepository: TransactionsRepository,
    private categoryRepository: Repository<Category>,
  ) {}

  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const balance = await this.transactionsRepository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Forbidden post transaction outcome.');
    }

    let findCategory = await this.categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!findCategory) {
      findCategory = this.categoryRepository.create({
        title: category,
      });

      await this.categoryRepository.save(findCategory);
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
      category_id: findCategory.id,
    });

    await this.transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
