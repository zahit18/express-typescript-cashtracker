import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { body } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'

const router = Router()

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El Nombre no puede ir vacio'),
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    body('password')
        .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 carateres'),
    handleInputErrors,
    UserController.create
)


export default router