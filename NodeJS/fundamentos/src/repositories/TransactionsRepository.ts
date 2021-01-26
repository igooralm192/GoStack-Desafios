import Transaction, { TransactionType } from '../models/Transaction'

interface Balance {
	income: number
	outcome: number
	total: number
}

interface CreateTransactionDTO {
	title: string
	value: number
	type: TransactionType
}

class TransactionsRepository {
	private transactions: Transaction[]

	constructor() {
		this.transactions = []
	}

	public all(): Transaction[] {
		return this.transactions
	}

	public getBalance(): Balance {
		const reducer = (type: TransactionType) => (
			acc: number,
			transaction: Transaction,
		): number => acc + (type === transaction.type ? transaction.value : 0)

		const income = this.transactions.reduce(reducer('income'), 0)
		const outcome = this.transactions.reduce(reducer('outcome'), 0)

		const total = income - outcome

		return {
			income,
			outcome,
			total,
		}
	}

	public create({ title, value, type }: CreateTransactionDTO): Transaction {
		const transaction = new Transaction({
			title,
			value,
			type,
		})

		this.transactions.push(transaction)

		return transaction
	}
}

export default TransactionsRepository
