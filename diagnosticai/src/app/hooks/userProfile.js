import { useQuery } from "@tanstack/react-query";

export default function useUser() {
    const { data, isLoading, isError } = useQuery("user", () =>
        fetch("/api/user").then((res) => res.json())
    );
    
    return {
        user: data,
        isLoading,
        isError,
    };
    }
