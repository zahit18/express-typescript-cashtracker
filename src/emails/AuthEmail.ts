import { transport } from "../config/nodemailer"

type EmailType = {
    name: string
    email: string
    token: string
}

export class AuthEmails {

    static sendConfirmationEmail = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: 'CashTracker <admin@cashtracker.com>',
            to: user.email,
            subject: 'CashTracker - Confirma tu cuenta',
            html: `
                <p>Hola: ${user.name}, has creado tu cuenta en CashTracker, ya esta casi lista</p>
                <p>Visita el siguiente enlace:</p>
                <a href="#">Confirmar cuenta</a>
                <p>e ingresa el codigo: <b>${user.token}</b></p>
            `
        })
    }

    static sendPasswordResetToken = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: 'CashTracker <admin@cashtracker.com>',
            to: user.email,
            subject: 'CashTracker - Restablece tu Password',
            html: `
                <p>Hola: ${user.name}, has solicitado restablecer tu password</p>
                <p>Visita el siguiente enlace:</p>
                <a href="#">Restablecer Password</a>
                <p>e ingresa el codigo: <b>${user.token}</b></p>
            `
        })
    }
}