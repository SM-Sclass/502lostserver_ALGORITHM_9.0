'use client';
import { useQuery } from '@tanstack/react-query';

async function fetchUser() {
    try {
        const response = await fetch('/api/auth/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Important for cookies
        });

        if (!response.ok) {
            console.log('Failed to fetch user');
            return false
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

export function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        retry: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 30, // 30 minutes
    });
}
