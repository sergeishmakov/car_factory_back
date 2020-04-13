import pick from 'lodash/pick';

import { v4 as uuidv4 } from 'uuid';
import { writeStore, readStore } from '../store';
import Offer from './offer';
import Car from './car';

const NOT_FOUND_BY_ID_ERROR = 'Not found order with id=';

const OrderWhiteList = Object.freeze(['id', 'carId', 'userId']);

export const orderStateTypes = {
  opened: 'opened',
  closed: 'closed',
};

export const orderProgressTypes = {
  accepted: 'accepted',
  denyed: 'denyed',
};

class Order {
  constructor({ carId, userId }) {
    this.id = uuidv4();
    this.carId = carId;
    this.userId = userId;
    this.progress = null;
    this.state = orderStateTypes.opened;
    this.createdAt = new Date();
  }

  static createOrder(data) {
    const orders = readStore('orders');
    const newOrder = new Order({
      ...pick(data, OrderWhiteList),
    });
    writeStore({ orders: [...orders, newOrder] });
    return newOrder;
  }

  static updateOrder(id, data) {
    const orders = readStore('orders');
    const orderIndex = orders?.findIndex((order) => order.id === id);
    if (orderIndex < 0) throw new Error(NOT_FOUND_BY_ID_ERROR + id);
    const newOrder = { ...orders[orderIndex], ...data };
    orders.splice(orderIndex, 1, newOrder);
    writeStore({ orders });
    return newOrder;
  }

  static deleteOrder(id) {
    const orders = readStore('orders');
    writeStore({ orders: orders.filter((order) => order.id !== id) });
    return true;
  }

  static acceptOrder(id) {
    const order = this.getOrderById(id);
    Offer.closeOffersByOrderId(id);
    const car = Car.getCarById(order.carId);
    if (!car.inStock) return { error: 'Авто нет в наличии' };
    this.updateOrder(id, {
      progress: orderProgressTypes.accepted,
      state: orderStateTypes.closed,
    });
    this.updateCar(order.carId, { inStock: car.inStock - 1 });
    return { order };
  }

  static denyOrder(id) {
    const order = this.updateOrder(id, {
      progress: orderProgressTypes.denyed,
      state: orderStateTypes.closed,
    });
    return { order };
  }

  static getAll() {
    return readStore('orders');
  }

  static getOrdersByUser(userId) {
    const orders = readStore('orders');
    return orders.filter((order) => order.userId === userId);
  }

  static getOrderById(id) {
    const orders = readStore('orders');
    return orders.find((order) => order.id === id);
  }
}

export default Order;
