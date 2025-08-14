import { useState } from "react";
import { usePartners, useCreatePartner } from "@/hooks/use-admin";
import DataTable from "@/components/admin/DataTable";
import CreateContentModal from "@/components/admin/CreateContentModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, University, Globe, Mail, Phone } from "lucide-react";
import { format } from "date-fns";

const partnershipTypeOptions = [
  { label: "Educational", value: "educational" },
  { label: "Research", value: "research" },
  { label: "Corporate", value: "corporate" },
  { label: "Non-profit", value: "non-profit" },
  { label: "Government", value: "government" },
];

export default function Partners() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    data: partnersData, 
    isLoading, 
    error 
  } = usePartners({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
  });

  const createPartner = useCreatePartner();

  const columns = [
    {
      key: "name" as const,
      header: "Institution",
      render: (value: string, item: any) => (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {item.logo ? (
              <img 
                src={item.logo} 
                alt={value}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <University className="w-5 h-5 text-purple-600" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {value}
            </p>
            {item.website && (
              <div className="flex items-center text-xs text-blue-600 mt-1">
                <Globe className="w-3 h-3 mr-1" />
                <a 
                  href={item.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline truncate"
                >
                  {item.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "partnershipType" as const,
      header: "Type",
      render: (value: string) => (
        <Badge variant="secondary" className="capitalize">
          {value?.replace("-", " ")}
        </Badge>
      ),
    },
    {
      key: "contactEmail" as const,
      header: "Contact",
      render: (value: string, item: any) => (
        <div className="space-y-1">
          {value && (
            <div className="flex items-center text-xs text-gray-600">
              <Mail className="w-3 h-3 mr-1" />
              <a href={`mailto:${value}`} className="hover:underline">
                {value}
              </a>
            </div>
          )}
          {item.contactPhone && (
            <div className="flex items-center text-xs text-gray-600">
              <Phone className="w-3 h-3 mr-1" />
              <a href={`tel:${item.contactPhone}`} className="hover:underline">
                {item.contactPhone}
              </a>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "address" as const,
      header: "Location",
      render: (value: string) => (
        <span className="text-sm text-gray-600 line-clamp-2">
          {value || "Not provided"}
        </span>
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

  const handleView = (partner: any) => {
    // TODO: Implement view partner modal or navigation
    console.log("View partner:", partner);
  };

  const handleEdit = (partner: any) => {
    // TODO: Implement edit partner modal
    console.log("Edit partner:", partner);
  };

  const handleDelete = async (partner: any) => {
    if (window.confirm(`Are you sure you want to remove "${partner.name}"?`)) {
      try {
        // await deletePartner.mutateAsync(partner.id);
        console.log("Delete partner:", partner.id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export partners");
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Partners</h2>
          <p className="text-gray-600 mb-4">Failed to load partner institutions data</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="partners-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Partner Institutions</h1>
          <p className="text-gray-600 mt-1">
            Manage partnerships with educational and corporate institutions
          </p>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        title="All Partner Institutions"
        data={partnersData?.partners || []}
        columns={columns}
        totalCount={partnersData?.total || 0}
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
            key: "partnershipType",
            label: "Partnership Type",
            options: partnershipTypeOptions,
          },
        ]}
        loading={isLoading}
      />
    </div>
  );
}
