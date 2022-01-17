const nameValidationMiddlleware = (req, res, next) => {
  const { name } = req.body;
  
  if (!name || name.length === 0) {
    return res.status(400).json({
        message: 'O campo "name" é obrigatório',
    }); 
  }

  if (name.length < 3) {
    return res.status(400).json({
      message: 'O "name" deve ter pelo menos 3 caracteres',
    }); 
  }

  res.status(204);
  next();
};

module.exports = nameValidationMiddlleware;