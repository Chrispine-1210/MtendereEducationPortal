import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, Clock, User, BookOpen } from "lucide-react";
import type { BlogPost, BlogFilters } from "@/types";

export default function Blog() {
  const [filters, setFilters] = useState<BlogFilters>({
    search: "",
    category: "",
    page: 1,
    limit: 12
  });

  const buildQueryString = (currentFilters: BlogFilters) => {
    const params = new URLSearchParams();
    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        params.set(key, value.toString());
      }
    });
    return params.toString();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/blog?${buildQueryString(filters)}`],
  });

  const posts = data?.posts || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / (filters.limit || 12));

  const handleFilterChange = (key: keyof BlogFilters, value: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Study Tips": "bg-green-100 text-green-800",
      "Scholarships": "bg-yellow-100 text-yellow-800",
      "Visa Guide": "bg-blue-100 text-blue-800",
      "University": "bg-purple-100 text-purple-800",
      "Career": "bg-red-100 text-red-800",
      "News": "bg-gray-100 text-gray-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 hero-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-bold text-4xl md:text-5xl mb-6">
            Education Insights
          </h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Stay updated with the latest trends, tips, and opportunities in international education
          </p>
        </div>
      </section>

      <div className="bg-neutral-bg">
        <div className="container mx-auto px-4 py-8">
          {/* Search and Filter Bar */}
          <Card className="mb-8 -mt-8 relative z-10">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Input
                    placeholder="Search articles..."
                    value={filters.search || ""}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
                
                <Select
                  value={filters.category || ""}
                  onValueChange={(value) => handleFilterChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Study Tips">Study Tips</SelectItem>
                    <SelectItem value="Scholarships">Scholarships</SelectItem>
                    <SelectItem value="Visa Guide">Visa Guide</SelectItem>
                    <SelectItem value="University">University</SelectItem>
                    <SelectItem value="Career">Career</SelectItem>
                    <SelectItem value="News">News</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button 
                  onClick={handleSearch}
                  className="bg-secondary text-white hover:bg-secondary/90"
                >
                  <Search className="mr-2" size={16} />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {isLoading ? "Loading..." : `Showing ${posts.length} of ${total} articles`}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <Select defaultValue="date">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Latest</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Blog Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-full"></div>
                    <div className="h-16 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Error loading articles</h3>
              <p className="text-gray-500">Please try again later or contact support.</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
              <p className="text-gray-500">Try adjusting your search criteria to see more articles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: BlogPost) => (
                <article key={post.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.imageUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=200&fit=crop"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(post.category || "General")}>
                        {post.category || "General"}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                      <span className="flex items-center">
                        <Calendar className="mr-1" size={12} />
                        {formatDate(post.publishedAt || post.createdAt)}
                      </span>
                      {post.readTime && (
                        <span className="flex items-center">
                          <Clock className="mr-1" size={12} />
                          {post.readTime} min read
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-xl text-primary mb-3 group-hover:text-secondary transition-colors cursor-pointer line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <User className="mr-2 text-gray-400" size={14} />
                        <span className="text-sm text-gray-600">
                          {post.authorId ? "Staff Writer" : "Editorial Team"}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-secondary hover:text-primary p-0"
                      >
                        Read More <span className="ml-1">→</span>
                      </Button>
                    </div>
                  </div>
                </article>
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
