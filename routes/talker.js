const express = require('express');
const fs = require('fs').promises;
const tokenValidation = require('../middleware/tokenValidation');
const nameValidation = require('../middleware/nameValidation');
const ageValidation = require('../middleware/ageValidation');
const talkValidation = require('../middleware/talkValidation');

const router = express.Router();

const TALKER_JSON = './talker.json';

router.get('/', async (_req, res) => {
  const talkers = await fs.readFile(TALKER_JSON, 'utf-8');
  res.status(200).json(JSON.parse(talkers));
});

router.get('/search', tokenValidation, async (req, res) => {
  const { name } = req.query;
  const talkers = await fs.readFile(TALKER_JSON, 'utf-8');
  const talkersJson = JSON.parse(talkers);

  if (!name) return res.status(200).json(talkersJson);

 return res.status(200).json(talkersJson.filter((t) => t.name.includes(name)));
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  const talkers = await fs.readFile(TALKER_JSON, 'utf-8');
  const talkersJson = JSON.parse(talkers);

  const talker = talkersJson.find((t) => Number(t.id) === Number(id));

  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(200).json(talker);
});

router.use(tokenValidation);

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await fs.readFile(TALKER_JSON, 'utf-8');
  const talkersJson = JSON.parse(talkers);
  const talkerIndex = talkersJson.indexOf(talkersJson.find((r) => r.id === Number(id)));

  if (talkerIndex === -1) return res.status(404).json({ message: 'Talker not found!' });
  talkersJson.splice(talkerIndex, 1);

  await fs.writeFile(TALKER_JSON, JSON.stringify(talkersJson));

  return res.status(204).end();
});

router.use(
    nameValidation,
    ageValidation,
    talkValidation,
  );

router.post('/', async (req, res) => {
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

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, talk: { watchedAt, rate } } = req.body;
  const talkers = await fs.readFile(TALKER_JSON, 'utf-8');
  const talkersJson = JSON.parse(talkers);
  const talkerIndex = talkersJson.indexOf(talkersJson.find((r) => r.id === Number(id)));

  if (talkerIndex === -1) return res.status(404).json({ message: 'Talker not found!' });

  talkersJson[talkerIndex] = { 
    name, age, id: talkersJson[talkerIndex].id, talk: { watchedAt, rate },
  };

  await fs.writeFile(TALKER_JSON, JSON.stringify(talkersJson));
  
  res.status(200).json(talkersJson[talkerIndex]);
});

module.exports = router;