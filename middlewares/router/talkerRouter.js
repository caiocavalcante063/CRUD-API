const express = require('express');
const fs = require('fs').promises;

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

module.exports = router;