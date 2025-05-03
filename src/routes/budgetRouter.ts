import { Router } from 'express'
import { BudgetController } from '../controllers/BudgetController'
import { existBudgetId, validateBudgetId, validateBudgetInput } from '../middleware/budget'
import { ExpensesController } from '../controllers/ExpenseController'
import { existExpenseId, validateExpenseId, validateExpenseInput } from '../middleware/expense'
import { handleInputErrors } from '../middleware/validation'

const router = Router()

router.param('budgetId', validateBudgetId)
router.param('budgetId', existBudgetId)

router.param('expenseId', validateExpenseId)
router.param('expenseId', existExpenseId)

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

// Routes for Expenses

router.post('/:budgetId/expenses', 
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.create
)

router.get('/:budgetId/expenses/:expenseId', ExpensesController.getById)

router.put('/:budgetId/expenses/:expenseId', 
    validateExpenseInput,
    handleInputErrors,
    ExpensesController.updateById
)

router.delete('/:budgetId/expenses/:expenseId', ExpensesController.deleteById)

export default router