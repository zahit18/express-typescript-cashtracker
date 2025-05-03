import { Request, Response, NextFunction } from 'express'
import { body, param, validationResult } from 'express-validator'
import Expense from '../models/Expense'


declare global {
    namespace Express {
        interface Request {
            expense?: Expense
        }
    }
}

export const validateExpenseInput = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio').run(req)

    await body('amount')
        .notEmpty().withMessage('La cantida no puede ir vacia')
        .isNumeric().withMessage('Cantidad no valida')
        .custom(value => value > 0).withMessage('El gasto debe ser mayor a 0').run(req)

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
    }
    next()
}

export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {
    await param('expenseId').isInt().custom(value => value > 0).withMessage('El gasto debe ser mayor a 0').run(req)

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() })
    }

    next()
}

export const existExpenseId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { expenseId } = req.params
        const expense = await Expense.findByPk(expenseId)

        if (!expense) {
            const error = new Error('Gasto no encontrado')
            res.status(404).json({ error: error.message })
        }

        req.expense = expense

        next()
    } catch (error) {
        res.status(500).json({ error: 'Hubo un error' })
    }
}