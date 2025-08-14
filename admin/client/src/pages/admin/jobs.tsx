import { useState } from "react";
import { useJobs, useUpdateJob, useDeleteJob } from "@/hooks/use-admin";
import DataTable from "@/components/admin/DataTable";
import CreateContentModal from "@/components/admin/CreateContentModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, MapPin, Calendar, Building } from "lucide-react";
import { format } from "date-fns";

const statusOptions = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
  { label: "Archived", value: "archived" },
];

const jobTypeOptions = [
  { label: "Full Time", value: "full-time" },
  { label: "Part Time", value: "part-time" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
];

export default function Jobs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");

  const { 
    data: jobsData, 
    isLoading, 
    error 
  } = useJobs({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    status: statusFilter,
  });

  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const columns = [
    {
      key: "title" as const,
      header: "Position",
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
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {value}
            </p>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <Building className="w-3 h-3 mr-1" />
              {item.company}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "location" as const,
      header: "Location",
      render: (value: string) => (
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-1" />
          {value}
        </div>
      ),
    },
    {
      key: "jobType" as const,
      header: "Type",
      render: (value: string) => {
        const colors = {
          "full-time": "bg-blue-100 text-blue-800",
          "part-time": "bg-purple-100 text-purple-800", 
          "contract": "bg-orange-100 text-orange-800",
          "internship": "bg-green-100 text-green-800",
        } as const;

        return (
          <Badge 
            variant="secondary" 
            className={`capitalize ${colors[value as keyof typeof colors] || ""}`}
          >
            {value?.replace("-", " ")}
          </Badge>
        );
      },
    },
    {
      key: "salaryRange" as const,
      header: "Salary",
      render: (value: string) => (
        <span className="text-green-600 font-medium">
          {value || "Not specified"}
        </span>
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
      header: "Posted",
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
    } else if (key === "jobType") {
      setJobTypeFilter(value);
    }
    setCurrentPage(1);
  };

  const handleView = (job: any) => {
    // TODO: Implement view job modal or navigation
    console.log("View job:", job);
  };

  const handleEdit = (job: any) => {
    // TODO: Implement edit job modal
    console.log("Edit job:", job);
  };

  const handleDelete = async (job: any) => {
    if (window.confirm(`Are you sure you want to delete "${job.title}"?`)) {
      try {
        await deleteJob.mutateAsync(job.id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export jobs");
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Jobs</h2>
          <p className="text-gray-600 mb-4">Failed to load job opportunities data</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="jobs-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Opportunities</h1>
          <p className="text-gray-600 mt-1">
            Manage job postings and career opportunities
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        title="All Job Opportunities"
        data={jobsData?.jobs || []}
        columns={columns}
        totalCount={jobsData?.total || 0}
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
            key: "jobType",
            label: "Job Type",
            options: jobTypeOptions,
          },
        ]}
        loading={isLoading}
      />
    </div>
  );
}
