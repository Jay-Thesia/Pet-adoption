import * as yup from 'yup';

export const createAdoptionSchema = yup.object().shape({
  petId: yup
    .string()
    .required('Pet ID is required')
});

export const approveRejectSchema = yup.object().shape({
  notes: yup
    .string()
    .trim()
    .optional()
});

