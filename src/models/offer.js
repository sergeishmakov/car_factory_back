import { v4 as uuidv4 } from 'uuid';
import pick from 'lodash/pick';

import { writeStore, readStore } from '../store';
import Order, { orderStateTypes, orderProgressTypes } from './order';

const NOT_FOUND_BY_ID_ERROR = 'Not found offer with id=';

const OfferWhiteList = Object.freeze(['orderId', 'carId']);

export const offerStateTypes = {
  opened: 'opened',
  closed: 'closed',
};

export const offerProgressTypes = {
  denyed: 'denyed',
  accepted: 'accepted',
};

class Offer {
  constructor({ carId, orderId }) {
    this.id = uuidv4();
    this.carId = carId;
    this.orderId = orderId;
    this.state = offerStateTypes.opened;
    this.progress = null;
    this.createdAt = new Date();
  }

  static createOffer(data) {
    const offers = readStore('offers');
    const orderOffers = this.getOffersByOrderId(data.orderId);
    if (orderOffers.length > 1) {
      Order.updateOrder(data.orderId, {
        progress: orderProgressTypes.accepted,
        state: orderStateTypes.closed,
      });
    }
    const newOffer = new Offer({ ...pick(data, OfferWhiteList) });
    writeStore({ offers: [...offers, newOffer] });
    return newOffer;
  }

  static updateOffer(id, data) {
    const offers = readStore('offers');
    const offerIndex = offers?.findIndex((offer) => offer.id === id);
    if (offerIndex < 0) throw new Error(NOT_FOUND_BY_ID_ERROR + id);
    const newOffer = { ...offers[offerIndex], ...data };
    offers.splice(offerIndex, 1, newOffer);
    writeStore({ offers });
    return newOffer;
  }

  static acceptOffer(offerId) {
    const offer = this.updateOffer(offerId, {
      state: offerStateTypes.closed,
      progress: offerProgressTypes.accepted,
    });
    Order.updateOrder(offer.orderId, {
      progress: orderProgressTypes.accepted,
      state: orderStateTypes.closed,
    });
    return { offer };
  }

  static denyOffer(offerId) {
    const offer = this.updateOffer(offerId, {
      state: offerStateTypes.closed,
      progress: offerProgressTypes.denyed,
    });
    return { offer };
  }

  static deleteOffersByUserId(userId) {
    const offers = readStore('offers');
    writeStore({ offers: offers.filter((offer) => offer.userId !== userId) });
    return true;
  }

  static deleteOffersByOrderId(orderId) {
    const offers = readStore('offers');
    writeStore({ offers: offers.filter((offer) => offer.orderId !== orderId) });
    return true;
  }

  static closeOffersByOrderId(orderId) {
    const offers = readStore('offers');
    writeStore({
      offers: offers.map((offer) =>
        offer.orderId === orderId
          ? { ...offer, state: offerStateTypes.closed }
          : offer
      ),
    });
    return true;
  }

  static getOffersByUserId(userId) {
    const offers = readStore('offers');
    return offers.filter((offer) => offer.userId === userId);
  }

  static getOffersByOrderId(orderId) {
    const offers = readStore('offers');
    return offers.filter((offer) => offer.orderId === orderId);
  }

  static getOfferById(offerId) {
    const offers = readStore('offers');
    return offers.find((offer) => offer.id === offerId);
  }
}

export default Offer;
