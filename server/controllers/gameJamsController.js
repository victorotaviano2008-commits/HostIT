const GameJams = require('../models/gameJams.js');

const getAllGameJams = async (req, res) => {
    try {
        const jams = await GameJams.findAll({
            order: [['startDate', 'DESC']]
        });

        const formattedJams = jams.map(jam => ({
            ...jam.toJSON(),
            tags: jam.tags ? JSON.parse(jam.tags) : []
        }));

        res.status(200).json(formattedJams);
    } catch (error) {
        console.error('Error fetching game jams:', error);
        res.status(500).json({ message: 'Erro ao buscar game jams' });
    }
};

const getGameJamById = async (req, res) => {
    try {
        const { id } = req.params;
        const jam = await GameJams.findByPk(id);

        if (!jam) {
            return res.status(404).json({ message: 'Game Jam não encontrada' });
        }

        const formattedJam = {
            ...jam.toJSON(),
            tags: jam.tags ? JSON.parse(jam.tags) : []
        };

        res.status(200).json(formattedJam);
    } catch (error) {
        console.error('Error fetching game jam:', error);
        res.status(500).json({ message: 'Erro ao buscar game jam' });
    }
};

const createGameJam = async (req, res) => {
    try {
        const { title, description, coverURL, organizer, startDate, endDate, theme, prize, rules, website, tags } = req.body;

        if (!title || !description || !organizer || !startDate || !endDate) {
            return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
        }

        const newJam = await GameJams.create({
            title,
            description,
            coverURL,
            organizer,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            theme,
            prize,
            rules,
            website,
            tags: tags ? JSON.stringify(tags) : null,
            status: 'upcoming'
        });

        const formattedJam = {
            ...newJam.toJSON(),
            tags: newJam.tags ? JSON.parse(newJam.tags) : []
        };

        res.status(201).json(formattedJam);
    } catch (error) {
        console.error('Error creating game jam:', error);
        res.status(500).json({ message: 'Erro ao criar game jam' });
    }
};

const updateGameJam = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, coverURL, organizer, startDate, endDate, theme, prize, rules, website, tags, status } = req.body;

        const jam = await GameJams.findByPk(id);
        if (!jam) {
            return res.status(404).json({ message: 'Game Jam não encontrada' });
        }

        await jam.update({
            title: title || jam.title,
            description: description || jam.description,
            coverURL: coverURL || jam.coverURL,
            organizer: organizer || jam.organizer,
            startDate: startDate ? new Date(startDate) : jam.startDate,
            endDate: endDate ? new Date(endDate) : jam.endDate,
            theme: theme !== undefined ? theme : jam.theme,
            prize: prize !== undefined ? prize : jam.prize,
            rules: rules !== undefined ? rules : jam.rules,
            website: website !== undefined ? website : jam.website,
            tags: tags ? JSON.stringify(tags) : jam.tags,
            status: status || jam.status
        });

        const formattedJam = {
            ...jam.toJSON(),
            tags: jam.tags ? JSON.parse(jam.tags) : []
        };

        res.status(200).json(formattedJam);
    } catch (error) {
        console.error('Error updating game jam:', error);
        res.status(500).json({ message: 'Erro ao atualizar game jam' });
    }
};

const deleteGameJam = async (req, res) => {
    try {
        const { id } = req.params;
        const jam = await GameJams.findByPk(id);

        if (!jam) {
            return res.status(404).json({ message: 'Game Jam não encontrada' });
        }

        await jam.destroy();
        res.status(200).json({ message: 'Game Jam deletada com sucesso' });
    } catch (error) {
        console.error('Error deleting game jam:', error);
        res.status(500).json({ message: 'Erro ao deletar game jam' });
    }
};

module.exports = {
    getAllGameJams,
    getGameJamById,
    createGameJam,
    updateGameJam,
    deleteGameJam
};
