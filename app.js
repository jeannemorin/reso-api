require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/contents', contentRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
