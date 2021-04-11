import moment from 'moment';
import * as Yup from 'yup';

const lengthSchema = Yup.string()
  .min(2, 'Veľmi krátke')
  .max(50, 'Veľmi dlhé')
  .required('Toto pole je nutné vyplniť');

const postCodeSchema = Yup.string()
  .min(5, 'PSČ má mať 5 čísel, nie menej')
  .max(5, 'PSČ má mať 5 čísel, nie viac')
  .required('Toto pole je nutné vyplniť');

const phoneNumberSchema = Yup.string()
  .min(10, 'Telefónne číslo má mať dlhšie')
  .max(13, 'Telefónne číslo má mať kratšie')
  .required('Toto pole je nutné vyplniť');

const numberSchema = Yup.number()
  .typeError('Musí to byť číslo')
  .required('Toto pole je nutné vyplniť');

const dateSchema = Yup.date()
  .required('Toto pole je nutné vyplniť');

export const addUserSchema = Yup.object().shape({
  firstName: lengthSchema,
  lastName: lengthSchema,
  phoneNumber: phoneNumberSchema,
  city: lengthSchema,
  postCode: postCodeSchema,
  address: lengthSchema
});

export const addOrderSchema = Yup.object().shape({
  volume: numberSchema,
  price: numberSchema,
  date: dateSchema,
});
