import type { Request, Response } from 'express'
import User from '../models/User'
import { hashPassword } from '../utils/auth'
import { generateToken } from '../utils/token'
import { AuthEmails } from '../emails/AuthEmail'

export class AuthController {

    static create = async (req: Request, res: Response) => {

        const { email, password } = req.body
        const userExist = await User.findOne({where: {email}})
        if(userExist) {
            const error = new Error('Un Usuario con ese email ya esta registrado')
            res.status(409).json({error: error.message})
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

        static confirmAccount = async (req: Request, res: Response) => {
            const { token } = req.body

            const user = await User.findOne({where: { token }})
            if(!user) {
                const error = new Error('Token no valido')
                res.status(401).json({error: error.message})
            }

            user.confirmed = true
            user.token = null
            await user.save()

            res.json("Cuenta confirmada correctamente")
        }
}