const express = require('express');
const fs = require('fs').promises;
const tokenValidationMiddlleware = require('../tokenValidationMiddleware');
const nameValidationMiddlleware = require('../nameValidationMiddleware');
const ageValidationMiddlleware = require('../ageValidationMiddleware');
const talkValidationMiddlleware = require('../talkValidationMiddleware');

const router = express.Router();

const TALKER_JSON = './talker.json';

router.get('/', async (_req, res) => {
  const talkers = await fs.readFile(TALKER_JSON, 'utf-8');
  res.status(200).json(JSON.parse(talkers));
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  const talkers = await fs.readFile(TALKER_JSON, 'utf-8');
  const talkersJson = JSON.parse(talkers);

  const talker = talkersJson.find((t) => Number(t.id) === Number(id));

  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(200).json(talker);
});

router
  .post('/',
    tokenValidationMiddlleware,
    nameValidationMiddlleware,
    ageValidationMiddlleware, 
    talkValidationMiddlleware, 
    async (req, res) => {
      const { name, age, talk: { watchedAt, rate } } = req.body;

      const newTalker = {
        name,
        age,
        id: 0,
        talk: {
          watchedAt,
          rate,
        },
      };
      const talkers = await fs.readFile(TALKER_JSON, 'utf-8');
      const talkersJson = JSON.parse(talkers);
      newTalker.id = talkersJson.length + 1;
      talkersJson.push(newTalker);
      await fs.writeFile(TALKER_JSON, JSON.stringify(talkersJson));

      res.status(201).json(newTalker);
});

module.exports = router;