const router = require('express').Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

router.get('/notes', async (req, res) => {
    try {
        const dbJSON = await fs.promises.readFile('db/db.json', 'utf8');
        res.json(JSON.parse(dbJSON));
    } catch (error) {
        res.status(500).json({ error: 'Error reading db.json file' });
    }
});

router.post('/notes', async (req, res) => {
    try {
        let dbJSON = await fs.promises.readFile('db/db.json', 'utf8');
        dbJSON = JSON.parse(dbJSON);

        // Create note with a unique id
        const newNote = {
            title: req.body.title,
            text: req.body.text,
            id: uuidv4(),
        };

        dbJSON.push(newNote);
        await fs.promises.writeFile('db/db.json', JSON.stringify(dbJSON));
        res.json(dbJSON);
    } catch (error) {
        res.status(500).json({ error: 'Error writing to db.json file' });
    }
});

router.delete('/notes/:id', async (req, res) => {
    try {
        let dbJSON = await fs.promises.readFile('db/db.json', 'utf8');
        dbJSON = JSON.parse(dbJSON);

        // Filter out notes with matching id
        dbJSON = dbJSON.filter(note => note.id != req.params.id);

        await fs.promises.writeFile('db/db.json', JSON.stringify(dbJSON));
        res.json(dbJSON);
    } catch (error) {
        res.status(500).json({ error: 'Error writing to db.json file' });
    }
});

module.exports = router;