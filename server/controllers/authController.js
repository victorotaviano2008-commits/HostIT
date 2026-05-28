const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');
const Users = require('../models/users.js');

const createMailTransporter = () => {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        return null;
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true' || false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

const transporter = createMailTransporter();

const getFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';

const sendResetPasswordEmail = async (email, resetLink) => {
    if (!transporter) {
        console.warn('SMTP não configurado. O email de reset não será enviado.');
        return false;
    }

    const mailOptions = {
        from: process.env.EMAIL_FROM || 'no-reply@hostit.com',
        to: email,
        subject: 'Redefinição de senha HostIT',
        html: `
            <div style="font-family: Arial, sans-serif; color: #111;">
                <h2>Redefinição de senha</h2>
                <p>Olá,</p>
                <p>Recebemos uma solicitação para redefinir sua senha.</p>
                <p>Clique no botão abaixo para redefinir sua senha:</p>
                <a href="${resetLink}" style="display:inline-block;padding:12px 20px;margin:16px 0;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;">Redefinir minha senha</a>
                <p>Se você não solicitou essa alteração, ignore este email.</p>
                <p>O link expira em 15 minutos.</p>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
    return true;
};

let register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await Users.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email já registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await Users.create({ username, email, password: hashedPassword });

        res.status(201).json({ message: 'Usuário registrado com sucesso', userId: newUser.id });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao registrar usuário', error });
    }
};

let login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Email ou senha inválidos' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Email ou senha inválidos' });
        }

        const token = jwt.sign({ userId: user.id }, 'seu_segredo_jwt', { expiresIn: '1h' });
        res.json({ message: 'Login bem-sucedido', token });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao fazer login', error });
    }
};

let logout = (req, res) => {
    res.json({ message: 'Logout bem-sucedido' });
};

let forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            // Não retorna erro para evitar enumeração de emails
            return res.status(200).json({ message: 'Se o email existe em nosso sistema, um link de reset foi enviado' });
        }

        // Gera token aleatório
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

        await user.update({
            resetPasswordToken: resetTokenHash,
            resetPasswordExpiry: resetTokenExpiry
        });

        const resetLink = `${getFrontendUrl()}/auth/reset-password?token=${resetToken}`;
        const emailSent = await sendResetPasswordEmail(email, resetLink).catch((err) => {
            console.error('Erro ao enviar email de reset:', err);
            return false;
        });

        if (emailSent) {
            console.log(`Email de reset enviado para ${email}`);
        } else {
            console.warn(`SMTP não configurado ou falha no envio. Link de reset: ${resetLink}`);
        }

        res.status(200).json({ 
            message: 'Se o email existe em nosso sistema, um link de reset foi enviado',
            resetLink: !emailSent ? resetLink : undefined
        });
    } catch (error) {
        console.error('Erro ao solicitar reset de senha:', error);
        res.status(500).json({ message: 'Erro ao processar solicitação' });
    }
};

let verifyResetToken = async (req, res) => {
    const { token } = req.query;

    try {
        if (!token) {
            return res.status(400).json({ message: 'Token não fornecido' });
        }

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await Users.findOne({ 
            where: { 
                resetPasswordToken: tokenHash,
                resetPasswordExpiry: {
                    [Op.gt]: new Date()
                }
            } 
        });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido ou expirado' });
        }

        res.status(200).json({ message: 'Token válido', email: user.email });
    } catch (error) {
        console.error('Erro ao verificar token:', error);
        res.status(500).json({ message: 'Erro ao verificar token' });
    }
};

let resetPassword = async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    try {
        if (!token || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'As senhas não correspondem' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres' });
        }

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const user = await Users.findOne({ 
            where: { 
                resetPasswordToken: tokenHash,
                resetPasswordExpiry: {
                    [Op.gt]: new Date()
                }
            } 
        });

        if (!user) {
            return res.status(400).json({ message: 'Token inválido ou expirado' });
        }

        // Hash nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Atualiza senha e limpa token
        await user.update({
            password: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpiry: null
        });

        res.status(200).json({ message: 'Senha redefinida com sucesso' });
    } catch (error) {
        console.error('Erro ao redefinir senha:', error);
        res.status(500).json({ message: 'Erro ao redefinir senha' });
    }
};

module.exports = {
    register,
    login,
    logout,
    forgotPassword,
    verifyResetToken,
    resetPassword
}