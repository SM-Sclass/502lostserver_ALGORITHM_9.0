import { z } from 'zod';

const phoneRegex = /^([+]?\d{1,2}[-\s]?|)\d{3}[-\s]?\d{3}[-\s]?\d{4}$/;
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const userProfileSchema = z.object({
    name: z.string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters')
        .regex(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),

    email: z.string()
        .email('Invalid email address')
        .min(5, 'Email must be at least 5 characters')
        .max(100, 'Email must not exceed 100 characters'),

    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must not exceed 100 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

    age: z.number()
        .min(0, 'Age must be positive')
        .max(150, 'Age must be less than 150')
        .nullable()
        .optional(),

    bloodGroup: z.enum(bloodGroups)
        .nullable()
        .optional(),

    dob: z.date()
        .max(new Date(), 'Date of birth cannot be in the future')
        .nullable()
        .optional(),

    allergies: z.string()
        .max(1000, 'Allergies description must not exceed 1000 characters')
        .nullable()
        .optional(),

    weight: z.number()
        .min(0, 'Weight must be positive')
        .max(500, 'Weight must be less than 500 kg')
        .nullable()
        .optional(),

    phone: z.string()
        .regex(phoneRegex, 'Invalid phone number format')
        .nullable()
        .optional(),

    emergencyContact: z.string()
        .regex(phoneRegex, 'Invalid phone number format')
        .nullable()
        .optional()
});

// Custom type for TypeScript (if needed)

