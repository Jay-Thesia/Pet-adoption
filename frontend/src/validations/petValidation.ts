import * as yup from 'yup';

export const createPetSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(1, 'Name is required')
    .required('Name is required'),
  species: yup
    .string()
    .oneOf(['dog', 'cat', 'bird', 'rabbit', 'other'], 'Invalid species')
    .required('Species is required'),
  breed: yup
    .string()
    .trim()
    .min(1, 'Breed is required')
    .required('Breed is required'),
  age: yup
    .number()
    .integer('Age must be an integer')
    .min(0, 'Age must be a non-negative integer')
    .required('Age is required'),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'unknown'], 'Invalid gender')
    .optional(),
  description: yup
    .string()
    .trim()
    .optional(),
  photo: yup
    .string()
    .url('Photo must be a valid URL')
    .optional(),
  status: yup
    .string()
    .oneOf(['available', 'pending', 'adopted'], 'Invalid status')
    .optional()
});

export const updatePetSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(1, 'Name is required')
    .optional(),
  species: yup
    .string()
    .oneOf(['dog', 'cat', 'bird', 'rabbit', 'other'], 'Invalid species')
    .optional(),
  breed: yup
    .string()
    .trim()
    .min(1, 'Breed is required')
    .optional(),
  age: yup
    .number()
    .integer('Age must be an integer')
    .min(0, 'Age must be a non-negative integer')
    .optional(),
  gender: yup
    .string()
    .oneOf(['male', 'female', 'unknown'], 'Invalid gender')
    .optional(),
  description: yup
    .string()
    .trim()
    .optional(),
  photo: yup
    .string()
    .url('Photo must be a valid URL')
    .optional(),
  status: yup
    .string()
    .oneOf(['available', 'pending', 'adopted'], 'Invalid status')
    .optional()
}).test('at-least-one', 'At least one field must be provided', function(value) {
  return Object.keys(value).length > 0;
});

