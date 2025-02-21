import { z } from 'zod';

const MAX_FILE_SIZE = 15000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const ACCEPTED_PDF_TYPES = ['application/pdf'];

const fileValidation = z.custom((file) => {
  if (!(file instanceof File)) {
    throw new Error('Upload a valid file');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must be less than 5MB');
  }
  return true;
});

export const diagnosisFormSchema = z.object({
  file: fileValidation.and(
    z.custom((file) => {
      if (!file.type) return false;
      return ACCEPTED_IMAGE_TYPES.includes(file.type) || file.name?.endsWith('.edf') || ACCEPTED_PDF_TYPES.includes(file.type);
    }, 'Unsupported file format. Please upload an image or .edf file')
  ),
});

export const reportFormSchema = z.object({
  file: fileValidation.and(
    z.custom((file) => {
      if (!file.type) return false;
      return ACCEPTED_IMAGE_TYPES.includes(file.type) || ACCEPTED_PDF_TYPES.includes(file.type);
    }, 'Only .jpg, .jpeg, .png and .pdf files are accepted')
  )
});
