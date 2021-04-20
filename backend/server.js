const express = require('express');
const { readdirSync } = require('fs');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const connectDb = require('./config/db');


require('dotenv').config();
connectDb();

const app = express();

// Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(cors());
app.use(express.json());

// Import and Use Routes
readdirSync(`${__dirname}/routes`).map((r) =>
  app.use('/api', require(`./routes/${r}`))
);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
