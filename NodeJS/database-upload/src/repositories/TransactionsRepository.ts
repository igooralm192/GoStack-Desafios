import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const reducer = (type: 'income' | 'outcome') => (
      acc: number,
      transaction: Transaction,
    ): number => acc + (type === transaction.type ? transaction.value : 0);

    const transactions = await this.find();

    const income = transactions.reduce(reducer('income'), 0);
    const outcome = transactions.reduce(reducer('outcome'), 0);

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
