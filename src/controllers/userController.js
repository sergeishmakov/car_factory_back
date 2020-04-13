import omit from 'lodash/omit';

import User from '../models/user';
import Order from '../models/order';
import Car from '../models/car';
import Offer from '../models/offer';

const USER_EXIST_ERROR = 'Пользователь с таким логином уже существует';

export function signinUser(req, res) {
  const result = User.loginUser(req.body);
  res.send(result);
}

export function signupUser(req, res) {
  const user = User.getUserByLogin(req.body.login);
  if (user) {
    res.send({ error: USER_EXIST_ERROR });
    return;
  }
  const result = User.createUser(req.body);
  res.send(result);
}

export function getUserOrders(req, res) {
  const userId = req.params.userId;
  const userOrders = Order.getOrdersByUser(userId).map(orderDecorator);
  res.send(userOrders);
}

function orderDecorator(order) {
  const car = Car.getCarById(order.carId);
  const offers = Offer.getOffersByOrderId(order.id).map(offerDecorator);
  return omit({ ...order, car, offers }, ['carId']);
}

function offerDecorator(offer) {
  const car = Car.getCarById(offer.carId);
  return omit({ ...offer, car }, ['carId']);
}

export function getUserCars(req, res) {
  const userId = req.params.userId;
  const userOrders = Order.getOrdersByUser(userId);
  const cars = Car.getAll().map((car) => carDecorator(car, userOrders));
  res.send(cars);
}

function carDecorator(car, orders) {
  if (orders.some((order) => order.carId === car.id))
    return { ...car, ordered: true };
  return car;
}
