import { z } from 'zod';

export const symptomCheckerSchema = z.object({
    age: z.number()
        .min(0, 'Age must be greater than 0')
        .max(150, 'Age must be less than 150')
        .nullable()
        .refine((val) => val !== null, { message: 'Age is required' }),
    sex: z.string().min(1, 'Sex is required'),
    symptoms: z.array(z.object({
        value: z.string(),
        label: z.string()
    })).min(1, 'Please select at least one symptom')
});
