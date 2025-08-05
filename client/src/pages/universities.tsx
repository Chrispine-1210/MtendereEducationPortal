import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import UniversityCard from "@/components/university-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, GraduationCap } from "lucide-react";
import type { University, UniversityFilters } from "@/types";

export default function Universities() {
  const [filters, setFilters] = useState<UniversityFilters>({
    search: "",
    country: "",
    ranking: "",
    tuition: "",
    page: 1,
    limit: 12
  });

  // Parse URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newFilters = { ...filters };
    
    if (urlParams.get("country")) newFilters.country = urlParams.get("country")!;
    if (urlParams.get("level")) newFilters.level = urlParams.get("level")!;
    if (urlParams.get("field")) newFilters.field = urlParams.get("field")!;
    if (urlParams.get("search")) newFilters.search = urlParams.get("search")!;
    
    setFilters(newFilters);
  }, []);

  const buildQueryString = (currentFilters: UniversityFilters) => {
    const params = new URLSearchParams();
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value.toString());
      }
    });
    return params.toString();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/universities?${buildQueryString(filters)}`],
  });

  const universities = data?.universities || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / (filters.limit || 12));

  const handleFilterChange = (key: keyof UniversityFilters, value: string) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
  };

  const handleSearch = () => {
    // Query will automatically refetch due to dependency on filters
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-neutral-bg">
      <Header />
      
      <div className="pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="font-bold text-4xl md:text-5xl text-primary mb-6">
              Partner Universities
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our extensive network of top-ranked universities across the globe
            </p>
          </div>

          {/* Search and Filter Bar */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-2 relative">
                  <Input
                    placeholder="Search universities..."
                    value={filters.search || ""}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
                
                <Select
                  value={filters.country || ""}
                  onValueChange={(value) => handleFilterChange("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="Australia">Australia</SelectItem>
                    <SelectItem value="Germany">Germany</SelectItem>
                    <SelectItem value="Netherlands">Netherlands</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filters.ranking || ""}
                  onValueChange={(value) => handleFilterChange("ranking", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Rankings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rankings</SelectItem>
                    <SelectItem value="top50">Top 50</SelectItem>
                    <SelectItem value="top100">Top 100</SelectItem>
                    <SelectItem value="top200">Top 200</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={filters.tuition || ""}
                  onValueChange={(value) => handleFilterChange("tuition", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Tuition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tuition</SelectItem>
                    <SelectItem value="low">Under $20,000</SelectItem>
                    <SelectItem value="medium">$20,000 - $40,000</SelectItem>
                    <SelectItem value="high">Above $40,000</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleSearch}
                  className="bg-secondary text-white hover:bg-secondary/90"
                >
                  <Filter className="mr-2" size={16} />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {isLoading ? "Loading..." : `Showing ${universities.length} of ${total} universities`}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select defaultValue="ranking">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ranking">Ranking</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="tuition">Tuition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* University Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                    <div className="h-16 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <GraduationCap className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Error loading universities</h3>
              <p className="text-gray-500">Please try again later or contact support.</p>
            </div>
          ) : universities.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No universities found</h3>
              <p className="text-gray-500">Try adjusting your search criteria to see more results.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {universities.map((university: University) => (
                <UniversityCard key={university.id} university={university} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <Button
                variant="outline"
                disabled={filters.page === 1}
                onClick={() => handlePageChange((filters.page || 1) - 1)}
              >
                Previous
              </Button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const page = Math.max(1, Math.min(totalPages - 4, (filters.page || 1) - 2)) + i;
                return (
                  <Button
                    key={page}
                    variant={page === filters.page ? "default" : "outline"}
                    className={page === filters.page ? "bg-primary text-white" : ""}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                disabled={filters.page === totalPages}
                onClick={() => handlePageChange((filters.page || 1) + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
