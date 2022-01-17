module.exports = (req, res, next) => {
  const { email } = req.body;

  // Regex utilizada foi retirada de https://stackoverflow.com/questions/53377994/email-validation-in-reactjs-is-not-working-properly
  const testEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

  if (!email || email === '') {
    return res.status(400).json({ message: 'O campo "email" é obrigatório' });
  }

  if (!testEmail) {
    return res.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
};