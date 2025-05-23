import type { Request, Response } from 'express'
import User from '../models/User'
import { checkPassword, hashPassword } from '../utils/auth'
import { generateToken } from '../utils/token'
import { AuthEmails } from '../emails/AuthEmail'
import { generateJWT } from '../utils/jwt'

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export class AuthController {

    static create = async (req: Request, res: Response) => {

        const { email, password } = req.body
        const userExist = await User.findOne({ where: { email } })
        if (userExist) {
            const error = new Error('Un Usuario con ese email ya esta registrado')
            res.status(409).json({ error: error.message })
        }

        try {
            const user = new User(req.body)
            user.password = await hashPassword(password)
            user.token = generateToken()
            await user.save()

            await AuthEmails.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token
            })

            res.json('Cuenta creada correctamente')
        } catch (error) {
            res.status(500).json({ error: 'Hubo un error' })
        }
    }

    static updateCurrentUser = async (req: Request, res: Response) => {
        const { name, email } = req.body
        const { id } = req.user

        const user = await User.findByPk(id)

        const emailExist = await User.findOne({ where: { email } })
        if (emailExist) {
            if (user.email !== email){
                const error = new Error('Un Usuario con ese email ya esta registrado')
                res.status(409).json({ error: error.message })
            }
        }

        if (!user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({ error: error.message })
        }
        user.name = name != '' ? name : user.name
        user.email = email != '' ? email : user.email

        await user.save()

        res.json("Actualizado correctamente")
    }

    static confirmAccount = async (req: Request, res: Response) => {
        const { token } = req.body

        const user = await User.findOne({ where: { token } })
        if (!user) {
            const error = new Error('Token no valido')
            res.status(401).json({ error: error.message })
        }

        user.confirmed = true
        user.token = null
        await user.save()

        res.json("Cuenta confirmada correctamente")
    }

    static login = async (req: Request, res: Response) => {

        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({ error: error.message })
        }

        if (!user.confirmed) {
            const error = new Error('La cuenta no ha sido confirmada')
            res.status(403).json({ error: error.message })
        }

        const isPasswordCorrect = await checkPassword(password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error('Password Incorrecto')
            res.status(401).json({ error: error.message })
        }

        const token = generateJWT(user.id)

        res.json(token)

    }

    static forgotPassword = async (req: Request, res: Response) => {
        const { email, password } = req.body
        const user = await User.findOne({ where: { email } })
        if (!user) {
            const error = new Error('Usuario no encontrado')
            res.status(404).json({ error: error.message })
        }

        user.token = generateToken()
        await user.save()

        await AuthEmails.sendPasswordResetToken({
            email: user.email,
            name: user.name,
            token: user.token
        })

        res.json('Revisa tu email para instrucciones')
    }

    static validateToken = async (req: Request, res: Response) => {
        const { token } = req.body
        const tokenExists = await User.findOne({ where: { token } })
        if (!tokenExists) {
            const error = new Error('Token no valido')
            res.status(404).json({ error: error.message })
        }

        res.json('Token valido, asigna un nuevo password')
    }

    static resetPasswordWithToken = async (req: Request, res: Response) => {
        const { token } = req.params
        const { password } = req.body

        const user = await User.findOne({ where: { token } })
        if (!user) {
            const error = new Error('Token no valido')
            res.status(404).json({ error: error.message })
        }

        user.password = await hashPassword(password)
        user.token = null
        await user.save()

        res.json('El password se modifico correctamente')
    }

    static user = async (req: Request, res: Response) => {
        res.json(req.user)
    }


    static updateCurrentUserPassword = async (req: Request, res: Response) => {
        const { current_password, password } = req.body
        const { id } = req.user

        const user = await User.findByPk(id)

        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error('El password actual es incorrecto')
            res.status(401).json({ error: error.message })
        }

        user.password = await hashPassword(password)
        await user.save()

        res.json("El password se modifico correctamente")
    }


    static checkCurrentUserPassword = async (req: Request, res: Response) => {
        const { password } = req.body
        const { id } = req.user

        const user = await User.findByPk(id)

        const isPasswordCorrect = await checkPassword(password, user.password)
        if (!isPasswordCorrect) {
            const error = new Error('El password actual es incorrecto')
            res.status(401).json({ error: error.message })
        }

        res.json("Password correcto")
    }
}