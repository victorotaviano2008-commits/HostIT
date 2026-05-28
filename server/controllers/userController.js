const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');
const uploadedGamesTable = require('../models/games.js')
const Favorites = require('../models/favorites.js')
const upload = require('../middlewares/multer.js')
const usersTable = require('../models/users.js');

const findHtmlEntry = (entries) => {
    const htmlEntries = entries.filter((entry) => {
        if (entry.isDirectory) return false;
        const name = entry.entryName.toLowerCase();
        return name.endsWith('.html') || name.endsWith('.htm');
    });

    if (htmlEntries.length === 0) {
        return null;
    }

    const preferredIndex = htmlEntries.find((entry) => {
        const lower = entry.entryName.toLowerCase();
        return lower.endsWith('/index.html') || lower.endsWith('/index.htm') || lower === 'index.html' || lower === 'index.htm';
    });
    if (preferredIndex) return preferredIndex;

    const engineCandidates = entries.reduce((acc, entry) => {
        if (entry.isDirectory) return acc;
        const lower = entry.entryName.toLowerCase();
        if (lower.endsWith('.data') || lower.endsWith('.wasm') || lower.endsWith('.mem') || lower.includes('build/') || lower.includes('build\\')) acc.push(lower);
        if (lower.endsWith('.pck')) acc.push(lower);
        return acc;
    }, []);

    if (engineCandidates.length > 0) {
        for (const he of htmlEntries) {
            const htmlDir = he.entryName.replace(/\\\\/g, '/').split('/').slice(0, -1).join('/');
            const match = engineCandidates.find(ec => ec.startsWith(htmlDir) || ec.includes(htmlDir));
            if (match) return he;
        }
    }

    return htmlEntries[0];
};

const getRequestOrigin = (req) => {
    const envOrigin = process.env.BACKEND_URL;
    if (envOrigin) {
        const normalizedEnvOrigin = envOrigin.trim().replace(/\/+$/, '');
        if (normalizedEnvOrigin.startsWith('http://')) {
            return normalizedEnvOrigin.replace(/^http:\/\//, 'https://');
        }
        return normalizedEnvOrigin;
    }

    const forwardedProto = req.headers['x-forwarded-proto']
        ? req.headers['x-forwarded-proto'].split(',')[0].trim()
        : null;
    const protocol = forwardedProto || req.protocol || 'https';
    const host = req.get('host');

    if (host && host.includes('hostit-server.up.railway.app')) {
        return `https://${host}`;
    }

    return `${protocol}://${host}`;
};

const normalizeStoredUrl = (url) => {
    if (!url || typeof url !== 'string') return url;
    return url.replace(
        /^http:\/\/hostit-server\.up\.railway\.app(?::\d+)?(\/.*)?$/,
        'https://hostit-server.up.railway.app$1'
    );
};

let uploadGame = async(req, res) => {
    try {
const { title, description, genre, visibility, version, fileSize, platforms, tags, codeOpenSource, repoVisibility, license, repositoryUrl } = req.body;
        const filePath = req.file ? req.file.path : null;
        const currentUser = req.user;

        if (!currentUser) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }

    console.log('Received game upload:', { title, description, genre, developer: currentUser.username, filePath });

    if (!filePath) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!title || !description) {
        return res.status(400).json({ message: 'Title and description are required' });
    }

    const origin = getRequestOrigin(req);
    const uploadFolderName = req.file ? path.basename(req.file.filename, path.extname(req.file.filename)) : null;
    const uploadFolder = uploadFolderName ? path.join(__dirname, '../uploads', uploadFolderName) : null;
    let isWebGLLaunchable = false;
    let htmlPreviewUrl = null;
    let archiveHtmlUrl = null;

    if (req.file) {
        const extension = path.extname(req.file.originalname).toLowerCase();
        if (extension === '.zip') {
            try {
                const zip = new AdmZip(req.file.path);
                const entries = zip.getEntries();
                const htmlEntry = findHtmlEntry(entries);
                if (!htmlEntry) {
                    return res.status(400).json({ message: 'O arquivo ZIP não contém um arquivo HTML executável' });
                }
                isWebGLLaunchable = true;
                if (!fs.existsSync(uploadFolder)) {
                    try {
                        fs.mkdirSync(uploadFolder, { recursive: true });
                    } catch (err) {
                        console.error('Erro ao criar pasta de upload:', err);
                        return res.status(500).json({ message: 'Erro ao processar arquivo ZIP' });
                    }
                }
                try {
                    zip.extractAllTo(uploadFolder, true);
                } catch (err) {
                    console.error('Erro ao extrair arquivo ZIP:', err);
                    // try to remove the uploaded zip to avoid leaving partial data
                    try {
                        if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
                    } catch (unlinkErr) {
                        console.warn('Falha ao remover arquivo ZIP após erro de extração:', unlinkErr);
                    }
                    return res.status(500).json({ message: 'Erro ao processar arquivo ZIP' });
                }

                const relativeHtmlPath = htmlEntry.entryName.replace(/\\/g, '/').replace(/^\/+/g, '');
                htmlPreviewUrl = `${origin}/uploads/${uploadFolderName}/${relativeHtmlPath}`;
                archiveHtmlUrl = htmlPreviewUrl;

                htmlPreviewUrl = normalizeStoredUrl(htmlPreviewUrl);
                archiveHtmlUrl = normalizeStoredUrl(archiveHtmlUrl);

                // remove the uploaded ZIP file now that extraction succeeded
                try {
                    if (fs.existsSync(req.file.path)) {
                        fs.unlinkSync(req.file.path);
                        console.log('Uploaded ZIP removed:', req.file.path);
                    }
                } catch (unlinkErr) {
                    console.warn('Falha ao remover arquivo ZIP após extração bem-sucedida:', unlinkErr);
                }
            } catch (zipError) {
                console.error('Erro ao inspecionar ZIP para arquivos HTML:', zipError);
                return res.status(500).json({ message: 'Erro ao processar arquivo ZIP' });
            }
        } else if (extension === '.html' || extension === '.htm') {
            isWebGLLaunchable = true;
            archiveHtmlUrl = `${origin}/uploads/${req.file.filename}`;
            htmlPreviewUrl = archiveHtmlUrl;

            htmlPreviewUrl = normalizeStoredUrl(htmlPreviewUrl);
            archiveHtmlUrl = normalizeStoredUrl(archiveHtmlUrl);
        }
    }

    const gameData = {
        title,
        description,
        genre: genre || null,
        developer: currentUser.username,
        userId: currentUser.id,
        visibility: visibility || 'Public',
        version: version || 'v1.0.0',
        fileSize: fileSize || 'unknown',
        fileURL: normalizeStoredUrl(htmlPreviewUrl),
        stars: 0,
        forks: 0,
        isWebGLLaunchable,
        platforms: platforms ? JSON.stringify(platforms.split(',').map(p => p.trim())) : JSON.stringify([]),
        tags: tags ? JSON.stringify(tags.split(',').map(t => t.trim())) : JSON.stringify([]),
        codeOpenSource: codeOpenSource === 'true' || codeOpenSource === true,
        repoVisibility: repoVisibility || 'Public',
        license: codeOpenSource === 'true' || codeOpenSource === true ? license : 'Proprietary',
        repositoryUrl: codeOpenSource === 'true' || codeOpenSource === true ? repositoryUrl : null
    };

    uploadedGamesTable.create(gameData).then((game) => {
        res.status(201).json({ 
            message: 'Game uploaded successfully',
            gameId: game.id,
            game: game
        });
    }).catch((error) => {
        res.status(500).json({ message: 'Erro ao fazer upload do jogo', error });
        console.error('Error uploading game:', error);
    });
  } catch (err) {
    console.error('Erro inesperado no uploadGame:', err);
    res.status(500).json({ message: 'Erro interno ao processar o upload do jogo' });
  }
}

let getGameById = async (req, res) => {
    const gameId = req.params.id;

    try {
        const game = await uploadedGamesTable.findByPk(gameId);
        if (!game) return res.status(404).json({ message: 'Jogo não encontrado' });

        const parsedGame = {
            ...game.toJSON(),
            platforms: game.platforms ? JSON.parse(game.platforms) : [],
            tags: game.tags ? JSON.parse(game.tags) : [],
            fileURL: normalizeStoredUrl(game.fileURL),
        };

        // if authenticated, include whether the current user favorited this game
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            // lightweight check: the checkAuth middleware would normally expose req.user; here we attempt to read a user id from req.user if set
            if (req.user && req.user.id) {
                const fav = await Favorites.findOne({ where: { userId: req.user.id, gameId } });
                parsedGame.isFavorited = !!fav;
            }
        }

        res.json(parsedGame);
    } catch (error) {
        console.error('Erro ao buscar jogo:', error);
        res.status(500).json({ message: 'Erro ao visualizar jogo' });
    }
}

let getAllGames = (req, res) => {
    const developer = req.query.developer;
    const options = {
        order: [['createdAt', 'DESC']]
    };

    if (developer) {
        options.where = { developer };
    }

    uploadedGamesTable.findAll(options).then(games => {
        const parsedGames = games.map(game => ({
            ...game.toJSON(),
            platforms: game.platforms ? JSON.parse(game.platforms) : [],
            tags: game.tags ? JSON.parse(game.tags) : [],
            fileURL: normalizeStoredUrl(game.fileURL),
        }));
        res.json(parsedGames);
    }).catch(error => {
        res.status(500).json({ message: 'Erro ao buscar jogos', error });
    });
}

// Toggle star count (simple increment/decrement, not per-user unique)
let toggleStar = async (req, res) => {
    try {
        const gameId = req.params.id;
        const action = req.body && req.body.action; // 'add' or 'remove' or undefined to toggle
        const game = await uploadedGamesTable.findByPk(gameId);
        if (!game) return res.status(404).json({ message: 'Jogo não encontrado' });

        if (action === 'add') {
            game.stars = (game.stars || 0) + 1;
        } else if (action === 'remove') {
            game.stars = Math.max(0, (game.stars || 0) - 1);
        } else {
            // toggle: increment by 1
            game.stars = (game.stars || 0) + 1;
        }

        await game.save();
        res.json({ stars: game.stars });
    } catch (error) {
        console.error('Erro ao dar star:', error);
        res.status(500).json({ message: 'Erro ao processar star' });
    }
}

// Toggle favorite for current user
let toggleFavorite = async (req, res) => {
    try {
        const gameId = req.params.id;
        const currentUser = req.user;
        if (!currentUser) return res.status(401).json({ message: 'Usuário não autenticado' });

        const existing = await Favorites.findOne({ where: { userId: currentUser.id, gameId } });
        if (existing) {
            await existing.destroy();
            return res.json({ favorited: false });
        } else {
            await Favorites.create({ userId: currentUser.id, gameId });
            return res.json({ favorited: true });
        }
    } catch (error) {
        console.error('Erro ao alternar favorito:', error);
        res.status(500).json({ message: 'Erro ao processar favorito' });
    }
}

let getCurrentUser = (req, res) => {
    const userId = req.user.id;

    usersTable.findByPk(userId).then(user => {
        if (user) {
            res.json({ username: user.username, email: user.email, createdAt: user.createdAt });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    }).catch(error => {
        res.status(500).json({ message: 'Erro ao buscar informações do usuário', error });
    });
}   

module.exports = {
    uploadGame,
    getGameById,
    getAllGames,
    getCurrentUser,
    toggleStar,
    toggleFavorite
}           
