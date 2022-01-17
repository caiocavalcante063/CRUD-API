const crypto = require('crypto');

const emailIsRequiredMessage = {
  message: 'O campo "email" é obrigatório',
};

const emailMustHaveValidFormatMessage = {
  message: 'O "email" deve ter o formato "email@email.com"',
};

const passwordIsRequiredMessage = {
  message: 'O campo "password" é obrigatório',
};

const passwordMustHaveMinLengthMessage = {
  message: 'O "password" deve ter pelo menos 6 caracteres',
};

const loginMiddleWare = (req, res, _next) => {
  const { email, password } = req.body;
  const token = crypto.randomBytes(8).toString('hex');
  const validEmailFormat = /\S+@\S+\.\S+/;
  const testedEmail = validEmailFormat.test(String(email).toLowerCase());

  if (!email) return res.status(400).json(emailIsRequiredMessage); 
  if (!testedEmail) return res.status(400).json(emailMustHaveValidFormatMessage);
  if (!password) return res.status(400).json(passwordIsRequiredMessage);
  if (password.length < 6) return res.status(400).json(passwordMustHaveMinLengthMessage); 

  // req.email = email;
  // req.password = password;
  // req.token = token;

  // next();

  return res.status(200).send({ token });
};

module.exports = loginMiddleWare;