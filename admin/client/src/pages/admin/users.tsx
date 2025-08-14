import { useState } from "react";
import { useUsers, useUpdateUser, useDeleteUser } from "@/hooks/use-admin";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Mail, 
  Calendar, 
  Shield, 
  UserCheck, 
  UserX,
  Crown,
  User
} from "lucide-react";
import { format } from "date-fns";

const roleOptions = [
  { label: "User", value: "user" },
  { label: "Moderator", value: "moderator" },
  { label: "Admin", value: "admin" },
  { label: "Super Admin", value: "super_admin" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

export default function UsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");

  const { 
    data: usersData, 
    isLoading, 
    error 
  } = useUsers({
    page: currentPage,
    limit: pageSize,
    search: searchQuery,
  });

  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const columns = [
    {
      key: "username" as const,
      header: "User",
      render: (value: string, item: any) => (
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={item.profileImage} alt={value} />
            <AvatarFallback>
              {item.firstName?.[0] || item.username?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.firstName && item.lastName ? `${item.firstName} ${item.lastName}` : value}
            </p>
            <p className="text-xs text-gray-500 truncate">
              @{value}
            </p>
            {item.email && (
              <div className="flex items-center text-xs text-blue-600 mt-1">
                <Mail className="w-3 h-3 mr-1" />
                <a href={`mailto:${item.email}`} className="hover:underline truncate">
                  {item.email}
                </a>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "role" as const,
      header: "Role",
      render: (value: string) => {
        const roleConfig = {
          user: { icon: User, color: "bg-gray-100 text-gray-800" },
          moderator: { icon: Shield, color: "bg-blue-100 text-blue-800" },
          admin: { icon: UserCheck, color: "bg-purple-100 text-purple-800" },
          super_admin: { icon: Crown, color: "bg-yellow-100 text-yellow-800" },
        } as const;
        
        const config = roleConfig[value as keyof typeof roleConfig] || roleConfig.user;
        const Icon = config.icon;
        
        return (
          <Badge variant="secondary" className={`capitalize ${config.color}`}>
            <Icon className="w-3 h-3 mr-1" />
            {value.replace("_", " ")}
          </Badge>
        );
      },
    },
    {
      key: "isActive" as const,
      header: "Status",
      render: (value: boolean) => (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? (
            <>
              <UserCheck className="w-3 h-3 mr-1" />
              Active
            </>
          ) : (
            <>
              <UserX className="w-3 h-3 mr-1" />
              Inactive
            </>
          )}
        </Badge>
      ),
    },
    {
      key: "lastLogin" as const,
      header: "Last Login",
      render: (value: string) => {
        if (!value) return <span className="text-gray-400">Never</span>;
        
        const lastLogin = new Date(value);
        const now = new Date();
        const diffHours = Math.abs(now.getTime() - lastLogin.getTime()) / 36e5;
        
        return (
          <div className={`flex items-center text-sm ${
            diffHours > 168 ? 'text-red-600' : diffHours > 24 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            <Calendar className="w-3 h-3 mr-1" />
            {format(lastLogin, "MMM dd, yyyy")}
          </div>
        );
      },
    },
    {
      key: "createdAt" as const,
      header: "Joined",
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

  const handleView = (user: any) => {
    // TODO: Implement view user modal with full details
    console.log("View user:", user);
  };

  const handleEdit = (user: any) => {
    // TODO: Implement edit user modal
    console.log("Edit user:", user);
  };

  const handleDelete = async (user: any) => {
    if (window.confirm(`Are you sure you want to delete user "${user.username}"? This action cannot be undone.`)) {
      try {
        await deleteUser.mutateAsync(user.id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handlePromoteUser = async (user: any) => {
    const newRole = user.role === "user" ? "moderator" : user.role === "moderator" ? "admin" : "admin";
    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: { role: newRole }
      });
    } catch (error) {
      console.error("Promotion error:", error);
    }
  };

  const handleToggleStatus = async (user: any) => {
    try {
      await updateUser.mutateAsync({
        id: user.id,
        data: { isActive: !user.isActive }
      });
    } catch (error) {
      console.error("Status toggle error:", error);
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export users");
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Users</h2>
          <p className="text-gray-600 mb-4">Failed to load users data</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="users-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">
            Manage user accounts, roles, and permissions
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {usersData?.total || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <UserCheck className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">
                {usersData?.users?.filter(u => u.isActive).length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Crown className="w-8 h-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Admins</p>
              <p className="text-2xl font-semibold text-gray-900">
                {usersData?.users?.filter(u => u.role === "admin" || u.role === "super_admin").length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Shield className="w-8 h-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Moderators</p>
              <p className="text-2xl font-semibold text-gray-900">
                {usersData?.users?.filter(u => u.role === "moderator").length || 0}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">New This Month</p>
              <p className="text-2xl font-semibold text-gray-900">
                {usersData?.users?.filter(u => {
                  const userDate = new Date(u.createdAt);
                  const thisMonth = new Date();
                  return userDate.getMonth() === thisMonth.getMonth() && 
                         userDate.getFullYear() === thisMonth.getFullYear();
                }).length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        title="All Users"
        data={usersData?.users || []}
        columns={columns}
        totalCount={usersData?.total || 0}
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
            key: "role",
            label: "Role",
            options: roleOptions,
          },
          {
            key: "status",
            label: "Status",
            options: statusOptions,
          },
        ]}
        loading={isLoading}
      />
    </div>
  );
}
