import Car from '../models/car';

export function getCar(req, res) {
  res.send('pnh');
}

export function getCars(req, res) {
  res.send(Car.getAll());
}

export function createCar(req, res) {
  const car = Car.createCar(req.body);
  res.send(car);
  console.log(car ? `Success! Car was created with id=${car.id}` : 'Failure!');
}

export function updateCar(req, res) {
  const id = req.params.id;
  const car = Car.updateCar(id, req.body);
  res.send(car);
  console.log(car ? `Success! Car was updated with id=${car.id}` : 'Failure!');
}

export function deleteCar(req, res) {
  const id = req.params.id;
  Car.deleteCar(id);
  res.send(true);
  console.log(car ? `Success! Car was deleted with id=${id}` : 'Failure!');
}
