const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./configs/db.js');

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));


const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.BACKEND_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'https://hostit.up.railway.app',
      'https://hostit-server.up.railway.app'
    ].filter(Boolean);
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS request blocked from: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  allowedHeaders: ['Authorization', 'Content-Type'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
// Ensure WebGL build files are served with correct MIME types and CORS headers
const uploadsPath = path.join(__dirname, 'uploads');
app.use('/uploads', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
}, express.static(uploadsPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.wasm')) {
      res.setHeader('Content-Type', 'application/wasm');
    }
    if (filePath.endsWith('.mem') || filePath.endsWith('.data') || filePath.endsWith('.pck')) {
      res.setHeader('Content-Type', 'application/octet-stream');
    }
  }
}));

const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

const authRoute = require('./routes/authRoute.js');
app.use('/auth', authRoute);

const mainRoute = require('./routes/mainRoute.js');
app.use('/', mainRoute);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }
    if (err && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'Arquivo muito grande. O limite é 100MB.' });
    }
    next(err);
});

if (fs.existsSync(path.join(clientDistPath, 'index.html'))) {
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(process.env.PORT || 3000, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT || 3000}`);
    db.sequelize.sync({ alter: true }).then(() => {
        console.log('Banco de dados sincronizado');
    }).catch((error) => {
        console.error('Erro ao sincronizar banco de dados:', error);
    });
});