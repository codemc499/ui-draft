import React from 'react';
import { FieldError } from 'react-hook-form';

interface FormFieldErrorProps {
  error?: FieldError;
}

const FormFieldError: React.FC<FormFieldErrorProps> = ({ error }) => {
  if (!error) return null;

  return <p className='text-sm mt-1 text-red-600'>{error.message}</p>;
};

export default FormFieldError;
