import omit from 'lodash/omit';

import Order from '../models/order';
import Car from '../models/car';
import User from '../models/user';
import Offer from '../models/offer';

export function getOrders(req, res) {
  const orders = Order.getAll().map(orderDecorator);
  res.send(orders);
}

function orderDecorator(order) {
  const user = User.getUserById(order.userId);
  const car = Car.getCarById(order.carId);
  const offers = Offer.getOffersByOrderId(order.id).map(offerDecorator);
  return omit({ ...order, car, user, offers }, ['userId', 'carId']);
}

function offerDecorator(offer) {
  const car = Car.getCarById(offer.carId);
  return omit({ ...offer, car }, ['carId']);
}

export function createOrder(req, res) {
  const orders = Order.getOrdersByUser(req.body.userId);
  if (orders.find((order) => order.carId === req.body.carId)) {
    res.send({ isExist: true });
    return;
  }
  const order = Order.createOrder(req.body);
  res.send(order);
  console.log(
    order ? `Success! Order was created with id=${order.id}` : 'Failure!'
  );
}

export function deleteOrder(req, res) {
  const id = req.params.id;
  try {
    Order.deleteOrder(id);
    Offer.deleteOffersByOrderId(id);
  } catch {
    console.log('Что-то пошло не так!');
  } finally {
    res.send(true);
  }
}

export async function acceptOrder(req, res) {
  const id = req.params.id;
  const result = await Order.acceptOrder(id);
  res.send(result);
  console.log(
    result ? `Success! Order was accepted with id=${id}` : 'Failure!'
  );
}

export function denyOrder(req, res) {
  const id = req.params.id;
  const result = Order.denyOrder(id);
  res.send(result);
  console.log(result ? `Success! Order was denyed with id=${id}` : 'Failure!');
}
