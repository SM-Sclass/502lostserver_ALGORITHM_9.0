'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userProfileSchema } from '@/lib/validations/userProfile';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
export default function UserProfileForm({ initialData = {} }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(userProfileSchema),
        defaultValues: initialData
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            console.log(data);
            toast.success('Profile updated successfully');
            router.push('/dashboard');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = (error) => `
        w-full p-2 border rounded-md transition-colors
        ${error ? 'border-red-500' : 'border-gray-300'}
        focus:outline-none focus:ring-2 focus:ring-blue-500
    `;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium mb-1">Name*</label>
                    <input
                        type="text"
                        {...register('name')}
                        className={inputClasses(errors.name)}
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium mb-1">Email*</label>
                    <input
                        type="email"
                        {...register('email')}
                        className={inputClasses(errors.email)}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium mb-1">Password*</label>
                    <input
                        type="password"
                        {...register('password')}
                        className={inputClasses(errors.password)}
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
                    )}
                </div>

                {/* Age */}
                <div>
                    <label className="block text-sm font-medium mb-1">Age</label>
                    <input
                        type="number"
                        {...register('age', { valueAsNumber: true })}
                        className={inputClasses(errors.age)}
                    />
                    {errors.age && (
                        <p className="mt-1 text-sm text-red-500">{errors.age.message}</p>
                    )}
                </div>

                {/* Blood Group */}
                <div>
                    <label className="block text-sm font-medium mb-1">Blood Group</label>
                    <select
                        {...register('bloodGroup')}
                        className={inputClasses(errors.bloodGroup)}
                    >
                        <option value="">Select...</option>
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(group => (
                            <option key={group} value={group}>{group}</option>
                        ))}
                    </select>
                </div>

                {/* Date of Birth */}
                <div>
                    <label className="block text-sm font-medium mb-1">Date of Birth</label>
                    <input
                        type="date"
                        {...register('dob', { valueAsDate: true })}
                        className={inputClasses(errors.dob)}
                    />
                </div>

                {/* Weight */}
                <div>
                    <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                    <input
                        type="number"
                        {...register('weight', { valueAsNumber: true })}
                        className={inputClasses(errors.weight)}
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium mb-1">Phone</label>
                    <input
                        type="tel"
                        {...register('phone')}
                        className={inputClasses(errors.phone)}
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                    )}
                </div>

                {/* Emergency Contact */}
                <div>
                    <label className="block text-sm font-medium mb-1">Emergency Contact</label>
                    <input
                        type="tel"
                        {...register('emergencyContact')}
                        className={inputClasses(errors.emergencyContact)}
                    />
                    {errors.emergencyContact && (
                        <p className="mt-1 text-sm text-red-500">{errors.emergencyContact.message}</p>
                    )}
                </div>
            </div>

            {/* Allergies */}
            <div>
                <label className="block text-sm font-medium mb-1">Allergies</label>
                <textarea
                    {...register('allergies')}
                    className={`${inputClasses(errors.allergies)} min-h-[100px]`}
                    placeholder="List any allergies..."
                />
            </div>

            {/* Submit Button */}
            <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                    w-full py-3 rounded-md text-white font-medium
                    ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}
                    transition-colors duration-200
                `}
            >
                {loading ? 'Saving...' : 'Save Profile'}
            </motion.button>
        </form>
    );
}
