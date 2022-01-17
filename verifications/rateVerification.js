module.exports = (req, res, next) => {
  const { talk: { rate } } = req.body;

  const integer = Number.isInteger(rate);
  if (rate !== undefined && (rate < 1 || rate > 5 || !integer)) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  next();
};