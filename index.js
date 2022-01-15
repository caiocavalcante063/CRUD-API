const express = require('express');
const rescue = require('express-rescue');
const bodyParser = require('body-parser');
const fs = require('fs').promises;

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', rescue(async (_req, res) => {
  const talkers = await fs.readFile('./talker.json', 'utf-8');
  res.status(200).json(JSON.parse(talkers));
}));

app.get('/talker/:id', rescue(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const talkers = await fs.readFile('./talker.json', 'utf-8');
  const talkersJson = JSON.parse(talkers);

  const talker = talkersJson.find((t) => Number(t.id) === Number(id));

  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  return res.status(200).json(talker);
}));

app.use((err, _req, res, _next) => {
  res.status(500).json({ error: `Erro: ${err.message}` });
});
