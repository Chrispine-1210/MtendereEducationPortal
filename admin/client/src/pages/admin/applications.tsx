import { useState } from "react";
import { useApplications, useUpdateApplication } from "@/hooks/use-admin";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Calendar,
  Award,
  Briefcase,
  Eye,
  MessageSquare
} from "lucide-react";
import { format } from "date-fns";

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Waitlisted", value: "waitlisted" },
];

const typeOptions = [
  { label: "Scholarship", value: "scholarship" },
  { label: "Job", value: "job" },
];

export default function Applications() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { 
    data: applicationsData, 
    isLoading, 
    error 
  } = useApplications({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
    status: statusFilter,
  });

  const updateApplication = useUpdateApplication();

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { 
        icon: Clock, 
        color: "bg-yellow-100 text-yellow-800",
        label: "Pending Review"
      },
      approved: { 
        icon: CheckCircle, 
        color: "bg-green-100 text-green-800",
        label: "Approved"
      },
      rejected: { 
        icon: XCircle, 
        color: "bg-red-100 text-red-800",
        label: "Rejected"
      },
      waitlisted: { 
        icon: AlertCircle, 
        color: "bg-blue-100 text-blue-800",
        label: "Waitlisted"
      },
    } as const;
    
    return configs[status as keyof typeof configs] || configs.pending;
  };

  const columns = [
    {
      key: "userId" as const,
      header: "Applicant",
      render: (value: string, item: any) => (
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={item.user?.profileImage} alt={item.user?.username} />
            <AvatarFallback>
              <User className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.user?.firstName && item.user?.lastName 
                ? `${item.user.firstName} ${item.user.lastName}`
                : item.user?.username || "Unknown User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {item.user?.email || "No email"}
            </p>
            <p className="text-xs text-gray-400">
              ID: {value}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "type" as const,
      header: "Type",
      render: (value: any, item: any) => {
        const isScholarship = item.scholarshipId;
        const isJob = item.jobId;
        
        return (
          <div className="flex items-center">
            {isScholarship && (
              <>
                <Award className="w-4 h-4 mr-2 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Scholarship</p>
                  <p className="text-xs text-gray-500 truncate max-w-32">
                    {item.scholarship?.title || "Unknown"}
                  </p>
                </div>
              </>
            )}
            {isJob && (
              <>
                <Briefcase className="w-4 h-4 mr-2 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Job</p>
                  <p className="text-xs text-gray-500 truncate max-w-32">
                    {item.job?.title || "Unknown"}
                  </p>
                </div>
              </>
            )}
            {!isScholarship && !isJob && (
              <span className="text-gray-400">Unknown</span>
            )}
          </div>
        );
      },
    },
    {
      key: "status" as const,
      header: "Status",
      render: (value: string) => {
        const config = getStatusConfig(value);
        const Icon = config.icon;
        
        return (
          <Badge variant="secondary" className={config.color}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "createdAt" as const,
      header: "Submitted",
      render: (value: string) => (
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-1" />
          {format(new Date(value), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      key: "reviewedAt" as const,
      header: "Reviewed",
      render: (value: string, item: any) => {
        if (!value) return <span className="text-gray-400">Not reviewed</span>;
        
        return (
          <div className="text-sm text-gray-600">
            <p>{format(new Date(value), "MMM dd, yyyy")}</p>
            {item.reviewedBy && (
              <p className="text-xs text-gray-500">
                by {item.reviewer?.username || "Unknown"}
              </p>
            )}
          </div>
        );
      },
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

  const handleView = (application: any) => {
    // TODO: Implement application detail modal
    console.log("View application:", application);
  };

  const handleApprove = async (application: any) => {
    try {
      await updateApplication.mutateAsync({
        id: application.id,
        data: { 
          status: "approved",
          reviewNotes: "Application approved by admin"
        }
      });
    } catch (error) {
      console.error("Approve error:", error);
    }
  };

  const handleReject = async (application: any) => {
    const reason = prompt("Please provide a reason for rejection (optional):");
    
    try {
      await updateApplication.mutateAsync({
        id: application.id,
        data: { 
          status: "rejected",
          reviewNotes: reason || "Application rejected by admin"
        }
      });
    } catch (error) {
      console.error("Reject error:", error);
    }
  };

  const handleWaitlist = async (application: any) => {
    try {
      await updateApplication.mutateAsync({
        id: application.id,
        data: { 
          status: "waitlisted",
          reviewNotes: "Application waitlisted for further review"
        }
      });
    } catch (error) {
      console.error("Waitlist error:", error);
    }
  };

  const handleEdit = (application: any) => {
    // Show action menu for approve/reject/waitlist
    console.log("Edit application:", application);
  };

  const handleDelete = async (application: any) => {
    if (window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) {
      try {
        // await deleteApplication.mutateAsync(application.id);
        console.log("Delete application:", application.id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export applications");
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Applications</h2>
          <p className="text-gray-600 mb-4">Failed to load applications data</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="applications-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          <p className="text-gray-600 mt-1">
            Review and manage scholarship and job applications
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <FileCheck className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {applicationsData?.total || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Pending Review</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {applicationsData?.applications?.filter(a => a.status === "pending").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {applicationsData?.applications?.filter(a => a.status === "approved").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Rejected</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {applicationsData?.applications?.filter(a => a.status === "rejected").length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        title="All Applications"
        data={applicationsData?.applications || []}
        columns={columns}
        totalCount={applicationsData?.total || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        filters={[
          {
            key: "status",
            label: "Status",
            options: statusOptions,
          },
        ]}
        loading={isLoading}
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => setStatusFilter("pending")}
            >
              <Clock className="w-4 h-4 mr-2" />
              Review Pending ({applicationsData?.applications?.filter(a => a.status === "pending").length || 0})
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => handleExport()}
            >
              <FileCheck className="w-4 h-4 mr-2" />
              Export Applications
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Bulk Email
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
            >
              <Eye className="w-4 h-4 mr-2" />
              Application Insights
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
