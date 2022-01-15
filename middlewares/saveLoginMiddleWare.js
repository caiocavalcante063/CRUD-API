const fs = require('fs').promises;

const USERS_JSON = './users.json';

const saveLoginMiddleWare = async (req, res) => {
  const { email, password, token } = req;

  const users = await fs.readFile(USERS_JSON, 'utf-8');
  const usersJson = JSON.parse(users);

  const user = usersJson.find((u) => u.email === email);

  if (user) return res.status(400).json({ message: 'Pessoa já cadastrada' });

  usersJson.push({ email, password, token });

  await fs.writeFile(USERS_JSON, JSON.stringify(usersJson));

  return res.status(200).send({ token });
};

module.exports = saveLoginMiddleWare;