let usersTable = require('../models/users.js');
const jwt = require('jsonwebtoken');

let checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token de autenticação não fornecido' });
    }

    jwt.verify(token, 'seu_segredo_jwt', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token de autenticação inválido' });
        }

        usersTable.findByPk(decoded.userId).then(user => {
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }

            req.user = user;
            next();
        }).catch(error => {
            res.status(500).json({ message: 'Erro ao verificar usuário', error });
        });
    });
};

module.exports = checkAuth; 