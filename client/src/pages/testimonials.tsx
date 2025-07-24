import React, { useEffect, useState } from "react";
import api from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ExpandingNav from "@/components/expanding-nav";
import { 
  Users, 
  Trophy, 
  Award, 
  MapPin, 
  Globe, 
  GraduationCap,
  ExternalLink,
  Building,
  Star,
  Calendar,
  BookOpen
} from "lucide-react";
const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        const fetchTestimonials = async () => {
            const res = await api.get("/testimonials");
            setTestimonials(res.data);
        };
        fetchTestimonials();
    }, []);

    return (
        <div>
            <h1>Testimonials</h1>
            {testimonials.map(t => (
                <div key={t.id}>
                    <h3>{t.name}</h3>
                    <p>{t.content}</p>
                    {t.imageUrl && <img src={t.imageUrl} alt={t.name} />}
                </div>
            ))}
        </div>
    );
};

export default Testimonials;
