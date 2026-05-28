# Sistema de Reset de Senha - Documentação

## Visão Geral

Foi implementado um sistema completo de recuperação de senha que permite aos usuários redefinir suas senhas quando esquecidas. O sistema segue as melhores práticas de segurança com tokens com expiração.

## Fluxo do Usuário

1. **Página de Login** → Clica em "Esqueceu a senha?"
2. **Página Forgot Password** → Insere seu email
3. **Email de Recuperação** → Recebe um link com token (em produção)
4. **Página Reset Password** → Insere nova senha
5. **Confirmação** → Senha redefinida com sucesso

## Componentes Implementados

### Backend

#### 1. Modelo de Usuário Atualizado (`/server/models/users.js`)
```javascript
resetPasswordToken: STRING (nullable)
resetPasswordExpiry: DATE (nullable)
```

#### 2. Controller de Autenticação (`/server/controllers/authController.js`)

**forgotPassword()**
- POST `/auth/forgot-password`
- Body: `{ email: "user@email.com" }`
- Gera token aleatório com validade de 15 minutos
- Armazena hash do token no banco (não o token em si)
- Em desenvolvimento, retorna o link na resposta
- Em produção, enviaria por email

**verifyResetToken()**
- GET `/auth/verify-reset-token?token=...`
- Valida se o token existe e ainda é válido
- Retorna o email associado

**resetPassword()**
- POST `/auth/reset-password`
- Body: `{ token, newPassword, confirmPassword }`
- Valida se o token é válido
- Hash a nova senha com bcrypt
- Limpa os dados de reset (token e data)

#### 3. Rotas (`/server/routes/authRoute.js`)
```javascript
POST   /auth/forgot-password      // Solicitar reset
GET    /auth/verify-reset-token   // Validar token
POST   /auth/reset-password       // Executar reset
```

### Frontend

#### 1. Página Forgot Password (`/client/src/pages/forgotPassword.jsx`)
- Input de email
- Mensagem de sucesso com link em desenvolvimento
- Link para voltar ao login
- Tratamento de erros

#### 2. Página Reset Password (`/client/src/pages/resetPassword.jsx`)
- Verificação automática do token da URL
- Inputs para nova senha e confirmação
- Validação:
  - Mínimo 6 caracteres
  - Senhas devem corresponder
- Mensagens de erro clara
- Redirect automático para login após sucesso

#### 3. Página de Login Atualizada
- Link "Esqueceu a senha?" funcional
- Navega para `/auth/forgot-password`

## Fluxo Técnico Detalhado

### 1. Solicitação de Reset

```
Usuario → POST /auth/forgot-password { email }
         → Servidor gera token aleatorio
         → Cria hash SHA256 do token
         → Armazena hash e expiracão no banco
         → Retorna (em dev: link completo)
         → Usuário clica no link: /auth/reset-password?token=TOKEN
```

### 2. Validação do Token

```
Usuario acessa /auth/reset-password?token=TOKEN
         → Frontend verifica se há token na URL
         → Envia GET /auth/verify-reset-token?token=TOKEN
         → Backend cria hash do token
         → Compara com hash armazenado
         → Verifica data de expiração
         → Retorna sucesso ou erro
         → Mostra formulário ou erro
```

### 3. Reset de Senha

```
Usuario preenche nova senha + confirmação
         → Clica "Redefinir Senha"
         → POST /auth/reset-password { token, newPassword, confirmPassword }
         → Backend valida token novamente
         → Hash nova senha
         → Atualiza user.password
         → Limpa resetPasswordToken e resetPasswordExpiry
         → Retorna sucesso
         → Frontend redireciona para login
```

## Segurança

### Medidas Implementadas

1. **Tokens Aleatórios**
   - Usam `crypto.randomBytes(32)` para gerar tokens únicos
   - Virtualmente impossível de adivinhar

2. **Hashing de Tokens**
   - Tokens são hasheados com SHA256 antes de armazenar
   - Banco de dados não contém o token real

3. **Expiração Limitada**
   - Tokens expiram em 15 minutos
   - Data armazenada no banco é verificada

4. **Senhas Hasheadas**
   - Nova senha é hasheada com bcrypt (10 rounds)
   - Mesma segurança do registro

5. **Validação Dupla**
   - Token é validado na verificação e no reset
   - Senhas devem corresponder

6. **Limpeza de Dados**
   - Após reset bem-sucedido, token e expiração são removidos
   - Impede reutilização do token

### Contra Ataques Comuns

- **Enumeration de Emails**: A resposta é sempre "Se o email existe, um link foi enviado" (mesmo que não exista)
- **Brute Force**: Tokens são aleatórios e únicos, tempo de expiração reduz janela
- **Token Fixation**: Tokens expiram rapidamente
- **CSRF**: Usar POST para operações sensíveis

## Configuração para Produção

### Variáveis de Ambiente Necessárias

```bash
# .env
NODE_ENV=production
SMTP_HOST=seu-smtp.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
EMAIL_FROM=noreply@hostit.com
FRONTEND_URL=https://seu-dominio.com
```

### Envio de Email (Não Implementado)

Para ativar o envio real de emails, adicione a dependência:

```bash
npm install nodemailer
```

Exemplo de implementação:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const resetLink = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;

await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Redefinir sua senha HostIT',
    html: `<a href="${resetLink}">Clique aqui para redefinir sua senha</a>`
});
```

## Testing

### Via Frontend

1. Acesse `http://localhost:5173/auth`
2. Clique em "Esqueceu a senha?"
3. Digite seu email de usuário registrado
4. Copie o link da resposta (em desenvolvimento)
5. Clique no link ou acesse manualmente
6. Insira nova senha (mínimo 6 caracteres)
7. Confirme a senha
8. Clique "Redefinir Senha"
9. Serás redirecionado para login

### Via cURL

```bash
# 1. Solicitar reset
curl -X POST http://localhost:3001/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Resposta incluirá resetLink (em dev)
# Copie o token da URL

# 2. Validar token
curl "http://localhost:3001/auth/verify-reset-token?token=SEU_TOKEN_AQUI"

# 3. Reset de senha
curl -X POST http://localhost:3001/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"SEU_TOKEN_AQUI",
    "newPassword":"novaSenha123",
    "confirmPassword":"novaSenha123"
  }'
```

## Erros Possíveis e Soluções

### "Token inválido ou expirado"
- O token expirou (15 minutos)
- O token foi digitado incorretamente
- Solução: Solicitar um novo reset

### "As senhas não correspondem"
- Verificar se ambas as senhas foram digitadas igualmente
- Verificar caps lock

### "A senha deve ter no mínimo 6 caracteres"
- Escolher uma senha mais comprida

### "Email ou usuário não encontrado"
- O email não está registrado no sistema
- Verificar se o email está correto
- Registrar uma nova conta se necessário

## Fluxo de Recuperação de Conta Perdida

Se um usuário não conseguir acessar seu email:

1. Não há forma automática de recuperar a conta
2. Recomenda-se contato com suporte (não implementado)
3. Ou criar nova conta com email diferente

## Melhorias Futuras Sugeridas

1. **Integração com Email Real**
   - Usar Nodemailer ou SendGrid
   - Templates HTML para emails

2. **Two-Factor Authentication**
   - Código OTP via SMS ou email
   - Autenticador TOTP

3. **Histórico de Tentativas**
   - Log de tentativas de reset
   - Rate limiting mais rigoroso

4. **Dashboard Admin**
   - Reset de senha por admin
   - Suporte ao usuário integrado

5. **Notificação de Segurança**
   - Email informando tentativa de reset
   - IP e dispositivo que solicitou

6. **Recuperação Social**
   - Login com GitHub/Google
   - Recuperação via conta social

---

**Status**: ✅ Pronto para Desenvolvimento/Staging
**Segurança**: ✅ Implementada (adequada para MVP)
**Email**: ⚠️ Não configurado (necessário para produção)
**Data**: 28 de Maio, 2026
