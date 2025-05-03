import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { body } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { limiter } from '../config/limiter'

const router = Router()

router.use(limiter)

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('El Nombre no puede ir vacio'),
    body('email')
        .isEmail().withMessage('E-mail no valido'),
    body('password')
        .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 carateres'),
    handleInputErrors,
    AuthController.create
)

router.post('/confirm-account',
    body('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token no valido'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('Email no valido'),
    body('password')
        .notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    AuthController.login
)


export default router