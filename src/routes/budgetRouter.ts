import { Router } from 'express'
import { BudgetController } from '../controllers/BudgetController'
import { existBudgetId, validateBudgetId, validateBudgetInput } from '../middleware/budget'

const router = Router()

router.param('budgetId', validateBudgetId)
router.param('budgetId', existBudgetId)

router.get('/', BudgetController.getAll)

router.get('/:budgetId', BudgetController.getById)

router.post('/',
    validateBudgetInput,
    BudgetController.create
)

router.put('/:budgetId',
    validateBudgetInput,
    BudgetController.updateById
)

router.delete('/:budgetId', BudgetController.deleteById)

export default router