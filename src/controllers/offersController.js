import Offer from '../models/offer';

export function createOffer(req, res) {
  const result = Offer.createOffer(req.body);
  res.send(result);
  console.log(
    result ? `Success! Offer was created with id=${result.id}` : 'Failure!'
  );
}

export function acceptOffer(req, res) {
  const id = req.params.id;
  const result = Offer.acceptOffer(id);
  res.send(result);
  console.log(
    result ? `Success! Offer was accepted with id=${id}` : 'Failure!'
  );
}

export function denyOffer(req, res) {
  const id = req.params.id;
  const result = Offer.denyOffer(id);
  res.send(result);
  console.log(result ? `Success! Offer was denyed with id=${id}` : 'Failure!');
}
