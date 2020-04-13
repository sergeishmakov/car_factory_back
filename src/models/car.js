import pick from 'lodash/pick';
import { v4 as uuidv4 } from 'uuid';

import { writeStore, readStore } from '../store';
import Offer from './offer';
import Order from './order';

const NOT_FOUND_BY_ID_ERROR = 'Not found car with id=';

const CarWhiteList = Object.freeze(['id', 'mark', 'model', 'price', 'inStock']);

class Car {
  constructor({ mark, model, price, inStock }) {
    this.id = uuidv4();
    this.mark = mark;
    this.model = model;
    this.price = price;
    this.inStock = inStock;
    this.createdAt = new Date();
  }

  static createCar(data) {
    const cars = readStore('cars');
    const newCar = new Car({ ...pick(data, CarWhiteList) });
    writeStore({ cars: [...cars, newCar] });
    return newCar;
  }

  static updateCar(id, data) {
    const cars = readStore('cars');
    const carIndex = cars?.findIndex((car) => car.id === id);
    if (carIndex < 0) throw new Error(NOT_FOUND_BY_ID_ERROR + id);
    const newCar = { ...cars[carIndex], ...data };
    cars.splice(carIndex, 1, newCar);
    writeStore({ cars });
    return newCar;
  }

  static deleteCar(id) {
    const cars = readStore('cars');
    writeStore({ cars: cars.filter((car) => car.id !== id) });
    return id;
  }

  static orderCar(carId, userId) {
    const car = this.getCarById();

    if (car.inStock > 0) {
      this.updateCar(car.id, { inStock: car.inStock - 1 });
      return { status: 'success', car };
    }
    const offers = Offer.getOffersByUserId(userId);
    if (offers < 2) {
      const order = Order.createOrder({ carId, userId });
      return { status: 'in_process', order };
    }
  }

  static getAll() {
    return readStore('cars');
  }

  static getCarById(id) {
    const cars = readStore('cars');
    return cars.find((car) => car.id === id);
  }

  static getCarByName(name) {
    const cars = readStore('cars');
    return cars.find((car) => car.name === name);
  }
}

export default Car;
