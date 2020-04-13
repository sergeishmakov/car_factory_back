import pick from 'lodash/pick';

import { v4 as uuidv4 } from 'uuid';

import { writeStore, readStore } from '../store';

const LOGIN_ERROR_MESSAGE = 'Неверный логин или пароль';
const NOT_FOUND_BY_ID_ERROR = 'Not found car with id=';

const UserWhiteList = Object.freeze([
  'id',
  'firstName',
  'lastName',
  'login',
  'password',
]);

class User {
  constructor({ firstName, lastName, password, login }) {
    this.id = uuidv4();
    this.firstName = firstName;
    this.lastName = lastName;
    this.fullName = `${firstName} ${lastName}`;
    this.password = password;
    this.login = login;
    this.role = 'user';
    this.createdAt = new Date();
  }

  static createUser(data) {
    if (!data || !data.login || !data.password)
      return { error: 'Необходимо указать логин и пароль' };
    const users = readStore('users');
    const newUser = new Offer({ ...pick(data, UserWhiteList) });
    writeStore({ users: [...users, newUser] });
    console.log(
      `Поьзователь с ником ${newUser.login} был успешно зарегистрирован`
    );
    return { user: newUser };
  }

  static updateUser(id, data) {
    const users = readStore('users');
    const userIndex = users?.findIndex((user) => user.id === id);
    if (userIndex < 0) throw new Error(NOT_FOUND_BY_ID_ERROR + id);
    const newUser = { ...users[userIndex], ...pick(data, UserWhiteList) };
    users.splice(userIndex, 1, newUser);
    writeStore({ users });
    return newUser;
  }

  static getUserByLogin(login) {
    const users = readStore('users');
    const user = users.find((user) => user.login === login);
    if (!user) return null;
    return user;
  }

  static getUserById(id) {
    const users = readStore('users');
    const user = users.find((user) => user.id === id);
    if (!user) return null;
    return user;
  }

  static loginUser({ login, password }) {
    const user = getUserByLogin(login);
    if (!user) return { error: LOGIN_ERROR_MESSAGE };
    if (user.password !== password) return { error: LOGIN_ERROR_MESSAGE };
    return { user };
  }
}

export default User;
