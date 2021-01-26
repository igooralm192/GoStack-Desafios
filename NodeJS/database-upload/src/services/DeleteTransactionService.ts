// import AppError from '../errors/AppError';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  transactionId: string;
}

class DeleteTransactionService {
  constructor(private transactionsRepository: TransactionsRepository) {}

  public async execute({ transactionId }: Request): Promise<void> {
    const findTransaction = await this.transactionsRepository.findOne(
      transactionId,
    );

    if (!findTransaction) {
      throw new AppError('Transaction does not exists.', 404);
    }

    await this.transactionsRepository.remove(findTransaction);
  }
}

export default DeleteTransactionService;
