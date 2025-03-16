const express = require('express');
const winston = require('winston');

const app = express();
const PORT = 3000;

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'calculator-microservice' },
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

const validateInput = (req, res, next) => {
  const { num1, num2 } = req.query;
  if (!num1 || isNaN(num1)) {
    logger.error('Invalid input for num1');
    return res.status(400).json({ error: 'Invalid input for num1' });
  }
  req.num1 = parseFloat(num1);
  
  if (num2 !== undefined && isNaN(num2)) {
    logger.error('Invalid input for num2');
    return res.status(400).json({ error: 'Invalid input for num2' });
  }
  req.num2 = num2 !== undefined ? parseFloat(num2) : null;
  next();
};

app.get('/add', validateInput, (req, res) => {
  const result = req.num1 + req.num2;
  logger.info(`Addition operation: ${req.num1} + ${req.num2} = ${result}`);
  res.json({ result });
});

app.get('/subtract', validateInput, (req, res) => {
  const result = req.num1 - req.num2;
  logger.info(`Subtraction operation: ${req.num1} - ${req.num2} = ${result}`);
  res.json({ result });
});

app.get('/multiply', validateInput, (req, res) => {
  const result = req.num1 * req.num2;
  logger.info(`Multiplication operation: ${req.num1} * ${req.num2} = ${result}`);
  res.json({ result });
});

app.get('/divide', validateInput, (req, res) => {
  if (req.num2 === 0) {
    logger.error('Division by zero error');
    return res.status(400).json({ error: 'Cannot divide by zero' });
  }
  const result = req.num1 / req.num2;
  logger.info(`Division operation: ${req.num1} / ${req.num2} = ${result}`);
  res.json({ result });
});

// Exponentiation
app.get('/exponentiate', validateInput, (req, res) => {
  const result = Math.pow(req.num1, req.num2);
  logger.info(`Exponentiation operation: ${req.num1} ^ ${req.num2} = ${result}`);
  res.json({ result });
});

// Square Root
app.get('/sqrt', validateInput, (req, res) => {
  if (req.num1 < 0) {
    logger.error('Square root of negative number error');
    return res.status(400).json({ error: 'Cannot calculate the square root of a negative number' });
  }
  const result = Math.sqrt(req.num1);
  logger.info(`Square root operation: √${req.num1} = ${result}`);
  res.json({ result });
});

// Modulo
app.get('/modulo', validateInput, (req, res) => {
  if (req.num2 === 0) {
    logger.error('Modulo by zero error');
    return res.status(400).json({ error: 'Cannot perform modulo by zero' });
  }
  const result = req.num1 % req.num2;
  logger.info(`Modulo operation: ${req.num1} % ${req.num2} = ${result}`);
  res.json({ result });
});

app.listen(PORT, () => {
  console.log(`Calculator microservice is running on http://localhost:${PORT}`);
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});