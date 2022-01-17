const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const crypto = require('crypto');

const talkerJson = './talker.json';
const validateEmail = require('./verifications/validateEmail');
const validatePassword = require('./verifications/validatePassword');
const authorizationToken = require('./verifications/authorizationToken');
const nameVerification = require('./verifications/nameVerification');
const ageVerification = require('./verifications/ageVerification');
const dateVerification = require('./verifications/dateVerification');
const talkKeysVerification = require('./verifications/talkKeysVerification');
const rateVerification = require('./verifications/rateVerification');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const talkers = await fs.readFile('./talker.json', 'utf-8')
    .then((response) => JSON.parse(response));

  if (talkers.length === 0) return res.status(200).json([]);

  res.status(200).json(talkers);
});

app.get('/talker/search', authorizationToken, async (req, res) => {
  const { name } = req.query;
  
  const talkers = await fs.readFile('./talker.json', 'utf-8')
    .then((response) => JSON.parse(response));
  
  if (!name || name === '') return res.status(200).json(talkers);

  const findTalker = talkers.find((talker) => talker.name.includes(name));

  res.status(200).json(findTalker);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talkers = await fs.readFile(talkerJson, 'utf-8')
    .then((response) => JSON.parse(response));
  
  const talker = talkers.find((t) => t.id === parseInt(id, 10));

  if (!talker) return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });

  res.status(200).json(talker);
});

app.post('/login', validateEmail, validatePassword, (_req, res) => {
  // geração do token retirado de https://qastack.com.br/programming/8855687/secure-random-token-in-node-js
  const token = crypto.randomBytes(10).toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
  
  res.status(200).json({ token });
});

app.post('/talker', dateVerification, rateVerification, authorizationToken, nameVerification,
  ageVerification, talkKeysVerification, async (req, res) => {
  const { name, age, talk } = req.body;
  const talkers = await fs.readFile(talkerJson, 'utf-8')
    .then((response) => JSON.parse(response));
  
  const findLastId = talkers[talkers.length - 1].id;
  const id = findLastId + 1;

  talkers.push({ name, age, id, talk });

  await fs.writeFile(talkerJson, JSON.stringify(talkers));
  res.status(201).json({ name, age, id, talk });
});

app.put('/talker/:id', authorizationToken, nameVerification,
ageVerification, dateVerification, rateVerification, talkKeysVerification, async (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  const { name, age, talk } = req.body;
  const talkers = await fs.readFile(talkerJson, 'utf-8')
    .then((response) => JSON.parse(response));

  const findIndex = talkers.findIndex((talker) => talker.id === parseInt(id, 10));
  talkers[findIndex] = { ...talkers[findIndex], name, age, talk };

  await fs.writeFile(talkerJson, JSON.stringify(talkers));
  res.status(200).json({ name, age, id: parseInt(id, 10), talk });
});

app.delete('/talker/:id', authorizationToken, async (req, res) => {
  const { id } = req.params;

  const talkers = await fs.readFile(talkerJson, 'utf-8')
    .then((response) => JSON.parse(response));

  const findIndex = talkers.findIndex((talker) => talker.id === parseInt(id, 10));

  talkers.splice(findIndex, 1);
  await fs.writeFile(talkerJson, JSON.stringify(talkers));

  res.status(204).end();
});

app.listen(PORT, () => {
  console.log('Online');
});
