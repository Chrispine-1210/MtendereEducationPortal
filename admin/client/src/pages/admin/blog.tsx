import { useState } from "react";
import { useBlogPosts, useCreateBlogPost } from "@/hooks/use-admin";
import DataTable from "@/components/admin/DataTable";
import CreateContentModal from "@/components/admin/CreateContentModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Calendar, Eye, MessageCircle } from "lucide-react";
import { format } from "date-fns";

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

const categoryOptions = [
  { label: "Education", value: "education" },
  { label: "Career", value: "career" },
  { label: "Scholarships", value: "scholarships" },
  { label: "Technology", value: "technology" },
  { label: "Life Skills", value: "life-skills" },
  { label: "News", value: "news" },
];

export default function BlogPosts() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { 
    data: blogData, 
    isLoading, 
    error 
  } = useBlogPosts({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    status: statusFilter,
  });

  const createBlogPost = useCreateBlogPost();

  const columns = [
    {
      key: "title" as const,
      header: "Post",
      render: (value: string, item: any) => (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {item.featuredImage ? (
              <img 
                src={item.featuredImage} 
                alt={value}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {value}
            </p>
            {item.excerpt && (
              <p className="text-xs text-gray-500 truncate mt-1">
                {item.excerpt}
              </p>
            )}
            <div className="flex items-center mt-1 space-x-2">
              {item.slug && (
                <span className="text-xs text-blue-600">/{item.slug}</span>
              )}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "category" as const,
      header: "Category",
      render: (value: string) => (
        <Badge variant="secondary" className="capitalize">
          {value?.replace("-", " ")}
        </Badge>
      ),
    },
    {
      key: "tags" as const,
      header: "Tags",
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value?.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {value?.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{value.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "status" as const,
      header: "Status",
      render: (value: string) => {
        const variants = {
          draft: "secondary",
          published: "default", 
          archived: "outline",
        } as const;
        
        return (
          <Badge variant={variants[value as keyof typeof variants] || "secondary"}>
            {value}
          </Badge>
        );
      },
    },
    {
      key: "publishedAt" as const,
      header: "Published",
      render: (value: string, item: any) => {
        if (item.status !== "published" || !value) {
          return <span className="text-gray-400">Not published</span>;
        }
        
        return (
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            {format(new Date(value), "MMM dd, yyyy")}
          </div>
        );
      },
    },
    {
      key: "createdAt" as const,
      header: "Created",
      render: (value: string) => format(new Date(value), "MMM dd, yyyy"),
    },
    {
      key: "actions" as const,
      header: "Actions",
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilter = (key: string, value: string) => {
    if (key === "status") {
      setStatusFilter(value);
    }
    setCurrentPage(1);
  };

  const handleView = (post: any) => {
    if (post.slug && post.status === "published") {
      // Open published post in new tab
      window.open(`/blog/${post.slug}`, "_blank");
    } else {
      // TODO: Implement preview modal for drafts
      console.log("Preview post:", post);
    }
  };

  const handleEdit = (post: any) => {
    // TODO: Implement edit post modal or navigation to editor
    console.log("Edit post:", post);
  };

  const handleDelete = async (post: any) => {
    if (window.confirm(`Are you sure you want to delete "${post.title}"?`)) {
      try {
        // await deleteBlogPost.mutateAsync(post.id);
        console.log("Delete post:", post.id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export blog posts");
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Blog Posts</h2>
          <p className="text-gray-600 mb-4">Failed to load blog posts data</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="blog-posts-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600 mt-1">
            Create and manage blog content for your education portal
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Posts</p>
              <p className="text-2xl font-semibold text-gray-900">
                {blogData?.total || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Published</p>
              <p className="text-2xl font-semibold text-gray-900">
                {blogData?.posts?.filter(p => p.status === "published").length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <MessageCircle className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Drafts</p>
              <p className="text-2xl font-semibold text-gray-900">
                {blogData?.posts?.filter(p => p.status === "draft").length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {blogData?.posts?.filter(p => {
                  const postDate = new Date(p.createdAt);
                  const thisMonth = new Date();
                  return postDate.getMonth() === thisMonth.getMonth() && 
                         postDate.getFullYear() === thisMonth.getFullYear();
                }).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        title="All Blog Posts"
        data={blogData?.posts || []}
        columns={columns}
        totalCount={blogData?.total || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={() => {/* Handled by CreateContentModal */}}
        onExport={handleExport}
        filters={[
          {
            key: "status",
            label: "Status",
            options: statusOptions,
          },
          {
            key: "category",
            label: "Category",
            options: categoryOptions,
          },
        ]}
        loading={isLoading}
      />
    </div>
  );
}
