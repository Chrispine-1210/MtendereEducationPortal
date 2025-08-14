import { useState } from "react";
import { useScholarships, useUpdateScholarship, useDeleteScholarship } from "@/hooks/use-admin";
import DataTable from "@/components/admin/DataTable";
import CreateContentModal from "@/components/admin/CreateContentModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Award, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

const categoryOptions = [
  { label: "Undergraduate", value: "undergraduate" },
  { label: "Postgraduate", value: "postgraduate" },
  { label: "Research", value: "research" },
  { label: "Merit-based", value: "merit" },
  { label: "Need-based", value: "need" },
];

export default function Scholarships() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { 
    data: scholarshipsData, 
    isLoading, 
    error 
  } = useScholarships({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    status: statusFilter,
  });

  const updateScholarship = useUpdateScholarship();
  const deleteScholarship = useDeleteScholarship();

  const columns = [
    {
      key: "title" as const,
      header: "Title",
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
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-primary" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {value}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {item.institution}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "category" as const,
      header: "Category",
      render: (value: string) => (
        <Badge variant="secondary" className="capitalize">
          {value}
        </Badge>
      ),
    },
    {
      key: "amount" as const,
      header: "Amount",
      render: (value: string) => (
        <div className="flex items-center text-green-600">
          <DollarSign className="w-4 h-4 mr-1" />
          {value || "Not specified"}
        </div>
      ),
    },
    {
      key: "deadline" as const,
      header: "Deadline",
      render: (value: string) => {
        if (!value) return <span className="text-gray-400">No deadline</span>;
        
        const deadline = new Date(value);
        const isExpired = deadline < new Date();
        
        return (
          <div className={`flex items-center ${isExpired ? 'text-red-600' : 'text-gray-900'}`}>
            <Calendar className="w-4 h-4 mr-1" />
            {format(deadline, "MMM dd, yyyy")}
          </div>
        );
      },
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

  const handleView = (scholarship: any) => {
    // TODO: Implement view scholarship modal or navigation
    console.log("View scholarship:", scholarship);
  };

  const handleEdit = (scholarship: any) => {
    // TODO: Implement edit scholarship modal
    console.log("Edit scholarship:", scholarship);
  };

  const handleDelete = async (scholarship: any) => {
    if (window.confirm(`Are you sure you want to delete "${scholarship.title}"?`)) {
      try {
        await deleteScholarship.mutateAsync(scholarship.id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export scholarships");
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Scholarships</h2>
          <p className="text-gray-600 mb-4">Failed to load scholarship data</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="scholarships-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scholarships</h1>
          <p className="text-gray-600 mt-1">
            Manage scholarship opportunities for students
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        title="All Scholarships"
        data={scholarshipsData?.scholarships || []}
        columns={columns}
        totalCount={scholarshipsData?.total || 0}
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
