import path from 'path';
import uploadConfig from '../config/upload';

import Transaction from '../models/Transaction';
import loadTransactionsCSV from '../utils/loadTransactionsCSV';

import CreateTransactionService from './CreateTransactionService';

interface Request {
  filename: string;
}

interface ImportDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class ImportTransactionsService {
  constructor(private createTransactionService: CreateTransactionService) {}

  async execute({ filename }: Request): Promise<Transaction[]> {
    const filePath = path.resolve(uploadConfig.temporaryFolder, filename);

    const loadedTransactions = await loadTransactionsCSV(filePath);

    const importedTransactions: Transaction[] = [];

    for (const transactionData of loadedTransactions) {
      importedTransactions.push(
        await this.createTransactionService.execute(transactionData),
      );
    }

    return importedTransactions;
  }
}

export default ImportTransactionsService;
