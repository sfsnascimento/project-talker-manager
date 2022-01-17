module.exports = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
 
  //   // regex retirado do site https://medium.com/xp-inc/regex-um-guia-pratico-para-express%C3%B5es-regulares-1ac5fa4dd39f
  const date = /(\d{2})\/?(\d{2})?\/(\d{4})/.test(watchedAt);

  if (watchedAt !== undefined && !date) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  next();
};