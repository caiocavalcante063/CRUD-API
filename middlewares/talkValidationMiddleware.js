const watchedAtInvalidMessage = {
  message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
};

const rateInvalidMessage = {
  message: 'O campo "rate" deve ser um inteiro de 1 à 5',
};

const requiredFieldsMessage = {
  message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
};

const numberIsBetween = (limInf, limSup, n) => (parseInt(n, 10) >= limInf 
  && parseInt(n, 10) <= limSup);

const requiredFieldsCheck = (talk) => {
 const { watchedAt, rate } = talk;

 if (!watchedAt || !rate) return false;
 if (watchedAt.length === 0 || rate.length === 0) return false;
 
 return true;
};

const talkValidationMiddlleware = (req, res, next) => {
  const { talk } = req.body;
  if (!talk || !requiredFieldsCheck(talk)) {
    return res.status(400).json(requiredFieldsMessage); 
  } 
  const validDateFormat = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  const testedDate = validDateFormat.test(String(talk.watchedAt).toLowerCase());

  if (!testedDate) return res.status(400).json(watchedAtInvalidMessage); 
  if (!numberIsBetween(0, 5, talk.rate)) { 
    return res.status(400).json(rateInvalidMessage); 
  }

  res.status(204);
  next();
};

module.exports = talkValidationMiddlleware;