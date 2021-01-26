import TransactionsRepository from '../repositories/TransactionsRepository'
import Transaction, { TransactionType } from '../models/Transaction'

interface Request {
	title: string
	value: number
	type: TransactionType
}

class CreateTransactionService {
	private transactionsRepository: TransactionsRepository

	constructor(transactionsRepository: TransactionsRepository) {
		this.transactionsRepository = transactionsRepository
	}

	public execute({ title, value, type }: Request): Transaction {
		const balance = this.transactionsRepository.getBalance()

		if (type === 'outcome' && balance.total - value < 0) {
			throw new Error('Forbidden post transaction outcome.')
		}

		const transaction = this.transactionsRepository.create({
			title,
			value,
			type,
		})

		return transaction
	}
}

export default CreateTransactionService
