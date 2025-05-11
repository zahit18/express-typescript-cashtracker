import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { body, param } from 'express-validator'
import { handleInputErrors } from '../middleware/validation'
import { limiter } from '../config/limiter'
import { authenticate } from '../middleware/auth'

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

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Email no valido'),
    handleInputErrors,
    AuthController.forgotPassword
)

router.post('/validate-token',
    body('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token no valido'),
    handleInputErrors,
    AuthController.validateToken
)

router.post('/reset-password/:token',
    param('token')
        .notEmpty()
        .isLength({ min: 6, max: 6 })
        .withMessage('Token no valido'),
    body('password')
        .isLength({ min: 8 }).withMessage('El password es muy corto, minimo 8 carateres'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
)

router.get('/user',
    authenticate,
    AuthController.user
)

router.post('/update-password',
    authenticate,
    body('current_password')
        .notEmpty().withMessage('El password actual no puede ir vacio'),
    body('password')
        .isLength({min: 8}).withMessage('El password nuevo es muy corto, minimo 8 caracteres'),
    handleInputErrors,
    AuthController.updateCurrentUserPassword
)

router.post('/check-password',
    authenticate,
    body('password')
        .notEmpty().withMessage('El password no puede ir vacio'),
    handleInputErrors,
    AuthController.checkCurrentUserPassword
)

export default router