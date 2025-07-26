import api from "@/api/api";

export const fetchTestimonials = async () => {
    const res = await api.get("/testimonials");
    return res.data;
};
