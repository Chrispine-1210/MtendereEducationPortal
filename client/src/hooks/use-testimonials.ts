import { useEffect, useState } from "react";
import api from "@/api/api";

export interface Testimonial {
    id: string;
    name: string;
    content: string;
}

const useTestimonials = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTestimonials = async () => {
        setLoading(true);
        try {
            const res = await api.get("/testimonials");
            setTestimonials(res.data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch testimonials.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    return { testimonials, loading, error };
};

export default useTestimonials;
