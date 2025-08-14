import { useState } from "react";
import { useUsers, useUpdateUser } from "@/hooks/use-admin";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Crown, 
  UserCheck, 
  User, 
  Settings, 
  Lock,
  Users,
  FileText,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";

const rolePermissions = {
  user: {
    icon: User,
    color: "bg-gray-100 text-gray-800",
    label: "User",
    description: "Basic user with limited access",
    permissions: [
      "View scholarships",
      "View job opportunities",
      "Submit applications",
      "Edit own profile",
      "Use AI chat"
    ]
  },
  moderator: {
    icon: Shield,
    color: "bg-blue-100 text-blue-800",
    label: "Moderator",
    description: "Can moderate content and manage applications",
    permissions: [
      "All user permissions",
      "Review applications",
      "Moderate AI chat conversations",
      "Edit blog posts",
      "Manage user comments"
    ]
  },
  admin: {
    icon: UserCheck,
    color: "bg-purple-100 text-purple-800",
    label: "Admin",
    description: "Full content management access",
    permissions: [
      "All moderator permissions",
      "Create/edit scholarships",
      "Create/edit job opportunities",
      "Manage partner institutions",
      "Create/edit blog posts",
      "Manage team members",
      "View analytics",
      "Promote users to moderator"
    ]
  },
  super_admin: {
    icon: Crown,
    color: "bg-yellow-100 text-yellow-800",
    label: "Super Admin",
    description: "Complete system access and user management",
    permissions: [
      "All admin permissions",
      "Manage admin roles",
      "Delete users",
      "System settings",
      "Audit logs access",
      "Database management",
      "API key management"
    ]
  }
};

export default function AdminRoles() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("admin");

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

  // Filter users by admin roles only
  const adminUsers = usersData?.users?.filter(user => 
    ["moderator", "admin", "super_admin"].includes(user.role)
  ) || [];

  const columns = [
    {
      key: "username" as const,
      header: "Admin User",
      render: (value: string, item: any) => (
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={item.profileImage} alt={value} />
            <AvatarFallback>
              {item.firstName?.[0] || item.username?.[0] || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.firstName && item.lastName ? `${item.firstName} ${item.lastName}` : value}
            </p>
            <p className="text-xs text-gray-500 truncate">
              @{value}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "role" as const,
      header: "Role",
      render: (value: string) => {
        const config = rolePermissions[value as keyof typeof rolePermissions];
        if (!config) return null;
        
        const Icon = config.icon;
        
        return (
          <Badge variant="secondary" className={`capitalize ${config.color}`}>
            <Icon className="w-3 h-3 mr-1" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: "email" as const,
      header: "Email",
      render: (value: string) => (
        <a href={`mailto:${value}`} className="text-blue-600 hover:underline text-sm">
          {value}
        </a>
      ),
    },
    {
      key: "lastLogin" as const,
      header: "Last Active",
      render: (value: string) => {
        if (!value) return <span className="text-gray-400">Never</span>;
        
        const lastLogin = new Date(value);
        const now = new Date();
        const diffHours = Math.abs(now.getTime() - lastLogin.getTime()) / 36e5;
        
        return (
          <span className={`text-sm ${
            diffHours > 168 ? 'text-red-600' : diffHours > 24 ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {format(lastLogin, "MMM dd, yyyy")}
          </span>
        );
      },
    },
    {
      key: "createdAt" as const,
      header: "Promoted On",
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

  const handlePromoteUser = async (userId: string, newRole: string) => {
    if (window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      try {
        await updateUser.mutateAsync({
          id: userId,
          data: { role: newRole }
        });
      } catch (error) {
        console.error("Role update error:", error);
      }
    }
  };

  const handleView = (user: any) => {
    console.log("View admin user:", user);
  };

  const handleEdit = (user: any) => {
    console.log("Edit admin user:", user);
  };

  const handleDelete = (user: any) => {
    if (user.role === "super_admin") {
      alert("Super Admin users cannot be deleted.");
      return;
    }
    
    if (window.confirm(`Are you sure you want to remove admin privileges from "${user.username}"?`)) {
      handlePromoteUser(user.id, "user");
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Admin Roles</h2>
          <p className="text-gray-600 mb-4">Failed to load admin users data</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="admin-roles-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Roles & Permissions</h1>
          <p className="text-gray-600 mt-1">
            Manage administrative roles and user permissions
          </p>
        </div>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Role Settings
        </Button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(rolePermissions).map(([roleKey, roleInfo]) => {
          const Icon = roleInfo.icon;
          const userCount = usersData?.users?.filter(u => u.role === roleKey).length || 0;
          
          return (
            <Card 
              key={roleKey}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRole === roleKey ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedRole(roleKey)}
              data-testid={`role-card-${roleKey}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${roleInfo.color.replace('text-', 'bg-').replace('bg-bg-', 'bg-')}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <Badge variant="secondary">{userCount}</Badge>
                </div>
                <CardTitle className="text-lg">{roleInfo.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  {roleInfo.description}
                </p>
                <div className="space-y-1">
                  {roleInfo.permissions.slice(0, 3).map((permission, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-500">
                      <div className="w-1 h-1 bg-green-500 rounded-full mr-2" />
                      {permission}
                    </div>
                  ))}
                  {roleInfo.permissions.length > 3 && (
                    <p className="text-xs text-gray-400 mt-1">
                      +{roleInfo.permissions.length - 3} more permissions
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Role Permissions Detail */}
      {selectedRole && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {(() => {
                const Icon = rolePermissions[selectedRole as keyof typeof rolePermissions]?.icon;
                return Icon ? <Icon className="w-5 h-5" /> : null;
              })()}
              {rolePermissions[selectedRole as keyof typeof rolePermissions]?.label} Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rolePermissions[selectedRole as keyof typeof rolePermissions]?.permissions.map((permission, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <Lock className="w-4 h-4 text-green-600 mr-3 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{permission}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Users Table */}
      <DataTable
        title="Admin Users"
        data={adminUsers}
        columns={columns}
        totalCount={adminUsers.length}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSearch={handleSearch}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        filters={[
          {
            key: "role",
            label: "Admin Role",
            options: [
              { label: "Moderator", value: "moderator" },
              { label: "Admin", value: "admin" },
              { label: "Super Admin", value: "super_admin" },
            ],
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Users className="w-4 h-4 mr-2" />
              Promote User to Moderator
            </Button>
            <Button variant="outline" className="justify-start">
              <UserCheck className="w-4 h-4 mr-2" />
              Promote Moderator to Admin
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Manage Role Permissions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
