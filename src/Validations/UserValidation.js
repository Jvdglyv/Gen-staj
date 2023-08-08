import * as yup from 'yup';

export const patientSchema = yup.object().shape({
  given: yup.string().required('First Name is required'),
  family: yup.string().required('Last Name is required'),
  gender: yup
  .string()
  .required('Gender is required')
  .oneOf(['male', 'female'], 'Gender must be either "male" or "female"'),
  birthDate: yup
  .string()
  .required('Birth Date is required')
  .matches(/^\d{4}-\d{2}-\d{2}$/, 'Birth Date must be in the format "yyyy-mm-dd"'),
  telecom: yup.string().required('Telecom is required'),
});
