const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const PORT = '3000';

app.listen(PORT, () => {
  console.log('Online');
});

const login = require('./middleware/login');
// const saveLoginMiddleWare = require('./middlewares/saveLoginMiddleware');

app.post('/login', login/* , saveLoginMiddleWare */);

const talkerRouter = require('./routes/talker');

app.use('/talker', talkerRouter);
