require('dotenv').config();
require('express-async-errors');

// security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const express = require('express');
const connectDB = require('./db/connect')
const jobRouter = require('./routes/jobs');
const authRouter = require('./routes/auth');
const authenticateUser = require('./middleware/authentication')
const app = express();

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());
// extra packages

// routes
app.use('/api/v1/jobs', authenticateUser, jobRouter);
app.use('/api/v1/auth', authRouter);
app.get('/', (req, res) => {
  res.send('JObs Manager')
})

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.set('trust proxy', 1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000,  //15 minutes
  max: 100    //limit each IP to 100 requests per windowMs
}));
app.use(helmet());
app.use(cors());
app.use(xss());

const port = process.env.PORT || 8080;

const start = async () => {
  try {
    await connectDB()
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
    })
  } catch (error) {
    console.log(error);
  }
};

start();
