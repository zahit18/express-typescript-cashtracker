import { Router } from 'express'
import { body } from 'express-validator'
import { BudgetController } from '../controllers/BudgetController'
import { handleInputErrors } from '../middleware/validation'

const router = Router()

router.get('/', BudgetController.getAll)
router.get('/:id', BudgetController.getById)

router.post('/',
    body('name')
        .notEmpty().withMessage('El nombre no puede ir vacio'),
    body('amount')
        .notEmpty().withMessage('La cantida no puede ir vacia')
        .isNumeric().withMessage('Cantidad no valida')
        .custom(value => value > 0).withMessage('El presupuesto debe ser mayor a 0'),
        handleInputErrors,
    BudgetController.create
)

router.put('/:id', BudgetController.updateById)
router.delete('/:id', BudgetController.deleteById)

export default router