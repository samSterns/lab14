const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/v1/USER', require('./routes/user'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
