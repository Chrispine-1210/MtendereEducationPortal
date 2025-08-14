import { useState } from "react";
import { useTeamMembers, useCreateTeamMember } from "@/hooks/use-admin";
import DataTable from "@/components/admin/DataTable";
import CreateContentModal from "@/components/admin/CreateContentModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Mail, Linkedin, Twitter, Phone } from "lucide-react";
import { format } from "date-fns";

const departmentOptions = [
  { label: "Leadership", value: "leadership" },
  { label: "Education", value: "education" },
  { label: "Technology", value: "technology" },
  { label: "Operations", value: "operations" },
  { label: "Marketing", value: "marketing" },
  { label: "Finance", value: "finance" },
];

export default function TeamMembers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    data: teamData, 
    isLoading, 
    error 
  } = useTeamMembers({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
  });

  const createTeamMember = useCreateTeamMember();

  const columns = [
    {
      key: "name" as const,
      header: "Member",
      render: (value: string, item: any) => (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {item.profileImage ? (
              <img 
                src={item.profileImage} 
                alt={value}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {value}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {item.position}
            </p>
            {item.email && (
              <div className="flex items-center text-xs text-blue-600 mt-1">
                <Mail className="w-3 h-3 mr-1" />
                <a href={`mailto:${item.email}`} className="hover:underline">
                  {item.email}
                </a>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "department" as const,
      header: "Department",
      render: (value: string) => (
        <Badge variant="secondary" className="capitalize">
          {value}
        </Badge>
      ),
    },
    {
      key: "bio" as const,
      header: "Bio",
      render: (value: string) => (
        <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
          {value ? value.substring(0, 100) + (value.length > 100 ? "..." : "") : "No bio provided"}
        </p>
      ),
    },
    {
      key: "order" as const,
      header: "Display Order",
      render: (value: number) => (
        <span className="text-sm text-gray-600">
          {value || 0}
        </span>
      ),
    },
    {
      key: "social" as const,
      header: "Social Links",
      render: (value: any, item: any) => (
        <div className="flex items-center space-x-2">
          {item.linkedIn && (
            <a 
              href={item.linkedIn} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
              data-testid={`linkedin-${item.id}`}
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {item.twitter && (
            <a 
              href={item.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sky-500 hover:text-sky-700"
              data-testid={`twitter-${item.id}`}
            >
              <Twitter className="w-4 h-4" />
            </a>
          )}
        </div>
      ),
    },
    {
      key: "isActive" as const,
      header: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "createdAt" as const,
      header: "Added",
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
    // TODO: Implement filtering logic
    setCurrentPage(1);
  };

  const handleView = (member: any) => {
    // TODO: Implement view member modal or navigation
    console.log("View member:", member);
  };

  const handleEdit = (member: any) => {
    // TODO: Implement edit member modal
    console.log("Edit member:", member);
  };

  const handleDelete = async (member: any) => {
    if (window.confirm(`Are you sure you want to remove "${member.name}"?`)) {
      try {
        // await deleteTeamMember.mutateAsync(member.id);
        console.log("Delete member:", member.id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export team members");
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Team Members</h2>
          <p className="text-gray-600 mb-4">Failed to load team members data</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="team-members-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-600 mt-1">
            Manage your team profiles and organizational structure
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Members</p>
              <p className="text-2xl font-semibold text-gray-900">
                {teamData?.total || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Badge className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">
                {teamData?.members?.filter(m => m.isActive).length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Linkedin className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">With LinkedIn</p>
              <p className="text-2xl font-semibold text-gray-900">
                {teamData?.members?.filter(m => m.linkedIn).length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Mail className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">With Email</p>
              <p className="text-2xl font-semibold text-gray-900">
                {teamData?.members?.filter(m => m.email).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        title="All Team Members"
        data={teamData?.members || []}
        columns={columns}
        totalCount={teamData?.total || 0}
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
            key: "department",
            label: "Department",
            options: departmentOptions,
          },
        ]}
        loading={isLoading}
      />
    </div>
  );
}
