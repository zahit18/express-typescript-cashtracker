import type { Request, Response } from 'express'
import Budget from '../models/Budget'

export class BudgetController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const budgets = await Budget.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                // TDDO: Filtrar por el usuario
            })

            res.json(budgets)
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static getById = async (req: Request, res: Response) => {
        console.log('desde /api/budgets/id')
    }

    static create = async (req: Request, res: Response) => {
        try {
            const budget = new Budget(req.body)
            await budget.save()

            res.status(201).json('Presupuesto creado correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updateById = async (req: Request, res: Response) => {
        console.log('desde /api/budgets/id')
    }

    static deleteById = async (req: Request, res: Response) => {
        console.log('desde /api/budgets/id')
    }
}