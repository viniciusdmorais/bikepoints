const express = require('express');
const cors = require('cors');

const db = require('./database');

const app = express();

const PORT = 3000;

const ADMIN_PASSWORD = 'bike123';

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {

    res.send('🚴 BikePoints API rodando!');
});

app.get('/scores', (req, res) => {

    try {

        const scores = db.prepare(`
            SELECT * FROM scores
            WHERE id = 1
        `).get();

        res.json(scores);

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });
    }
});

app.put('/scores', (req, res) => {

    const password = req.headers['x-admin-password'];

    if (password !== ADMIN_PASSWORD) {

        return res.status(401).json({
            erro: 'Senha inválida'
        });
    }

    try {

        const { brabo, gabriel } = req.body;

        db.prepare(`
            UPDATE scores
            SET
                brabo = ?,
                gabriel = ?
            WHERE id = 1
        `).run(brabo, gabriel);

        res.json({
            mensagem: 'Pontuação atualizada!'
        });

    } catch (error) {

        res.status(500).json({
            erro: error.message
        });
    }
});

app.listen(PORT, () => {

    console.log(`🔥 API rodando em http://localhost:${PORT}`);
});