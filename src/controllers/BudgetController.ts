import type { Request, Response } from 'express'

export class BudgetController {
    static getAll = async (req: Request, res: Response) => {
        console.log('desde /api/budgets')
    }

        static getById = async (req: Request, res: Response) => {
        console.log('desde /api/budgets/id')
    }

    static create = async (req: Request, res: Response) => {
        console.log('desde /api/budgets')
    }

    static updateById = async (req: Request, res: Response) => {
        console.log('desde /api/budgets/id')
    }

    static deleteById = async (req: Request, res: Response) => {
        console.log('desde /api/budgets/id')
    }
}