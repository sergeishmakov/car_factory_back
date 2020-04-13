import express from 'express';

import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

import {
  getCar,
  getCars,
  createCar,
  updateCar,
  deleteCar,
} from './controllers/carsController';

import {
  signinUser,
  signupUser,
  getUserOrders,
  getUserCars,
} from './controllers/userController';
import {
  getOrders,
  createOrder,
  deleteOrder,
  acceptOrder,
  denyOrder,
} from './controllers/ordersController';
import {
  createOffer,
  acceptOffer,
  denyOffer,
} from './controllers/offersController';

const app = express();

app.use(cors());
app.options('http://localhost:8080/', cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/cars', getCars);
app.get('/api/cars/:id', getCar);
app.post('/api/cars', createCar);
app.put('/api/cars/:id', updateCar);
app.delete('/api/cars/:id', deleteCar);

app.get('/api/orders', getOrders);
app.post('/api/orders', createOrder);
app.post('/api/orders/accept/:id', acceptOrder);
app.post('/api/orders/deny/:id', denyOrder);
app.delete('/api/orders/:id', deleteOrder);

app.post('/api/offers', createOffer);
app.post('/api/offers/accept/:id', acceptOffer);
app.post('/api/offers/deny/:id', denyOffer);

app.post('/api/user/signin', signinUser);
app.post('/api/user/signup', signupUser);
app.get('/api/user/orders/:userId', getUserOrders);
app.get('/api/user/cars/:userId', getUserCars);

app.get('/', function (request, response) {
  response.send(null);
});

app.listen(3000);
