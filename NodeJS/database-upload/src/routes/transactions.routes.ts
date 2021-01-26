import { Router } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';

import Category from '../models/Category';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const categoryRepository = getRepository(Category);

  const createTransactionService = new CreateTransactionService(
    transactionsRepository,
    categoryRepository,
  );

  const transaction = await createTransactionService.execute({
    title,
    value,
    type,
    category,
  });

  return response.status(200).json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const deleteTransactionService = new DeleteTransactionService(
    transactionsRepository,
  );

  await deleteTransactionService.execute({ transactionId: id });

  return response.status(204).json();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const { filename } = request.file;

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const createTransactionService = new CreateTransactionService(
      transactionsRepository,
      categoryRepository,
    );

    const importTransactionsService = new ImportTransactionsService(
      createTransactionService,
    );

    const transactions = await importTransactionsService.execute({
      filename,
    });

    return response.json(transactions);
  },
);

export default transactionsRouter;
