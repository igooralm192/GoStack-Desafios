import request from 'supertest'
import { isUuid } from 'uuidv4'

import app from '../app'

describe('Transaction', () => {
	it('should be able to create a new transaction', async () => {
		const response = await request(app).post('/transactions').send({
			title: 'Loan',
			type: 'income',
			value: 1200,
		})

		expect(isUuid(response.body.id)).toBe(true)

		expect(response.body).toMatchObject({
			title: 'Loan',
			type: 'income',
			value: 1200,
		})
	})

	it('should be able to list the transactions', async () => {
		const transaction1 = await request(app).post('/transactions').send({
			title: 'Salary',
			type: 'income',
			value: 3000,
		})

		const transaction2 = await request(app).post('/transactions').send({
			title: 'Bicycle',
			type: 'outcome',
			value: 1500,
		})

		const response = await request(app).get('/transactions')

		expect(response.body.transactions).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: transaction1.body.id,
					title: 'Salary',
					type: 'income',
					value: 3000,
				}),
				expect.objectContaining({
					id: transaction2.body.id,
					title: 'Bicycle',
					type: 'outcome',
					value: 1500,
				}),
			]),
		)

		expect(response.body.balance).toMatchObject({
			income: 4200,
			outcome: 1500,
			total: 2700,
		})
	})

	it('should not be able to create outcome transaction without a valid balance', async () => {
		const response = await request(app).post('/transactions').send({
			title: 'Bicycle',
			type: 'outcome',
			value: 9999,
		})

		expect(response.status).toBe(400)
		expect(response.body).toMatchObject(
			expect.objectContaining({
				error: expect.any(String),
			}),
		)
	})
})
