const ageValidationMiddlleware = (req, res, next) => {
  const { age } = req.body;
  
  if (!age || age.length === 0) {
    return res.status(400).json({
        message: 'O campo "age" é obrigatório',
    }); 
  }

  if (Number(age) < 18) {
    return res.status(400).json({
      message: 'A pessoa palestrante deve ser maior de idade',
    }); 
  }
 
  res.status(204);
  next();
};

module.exports = ageValidationMiddlleware;