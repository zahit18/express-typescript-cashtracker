import { Request, Response, NextFunction } from 'express'
import { body, param, validationResult } from 'express-validator'

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