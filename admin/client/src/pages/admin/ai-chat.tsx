import { useState } from "react";
import { useAiChatConversations } from "@/hooks/use-admin";
import DataTable from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bot, 
  MessageCircle, 
  AlertTriangle, 
  Shield, 
  TrendingUp,
  Users,
  Clock,
  Activity,
  Flag,
  CheckCircle,
  XCircle,
  Eye,
  Settings
} from "lucide-react";
import { format } from "date-fns";

export default function AiChatManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const { 
    data: conversationsData, 
    isLoading, 
    error 
  } = useAiChatConversations({
    page: currentPage,
    limit: pageSize,
  });

  const columns = [
    {
      key: "userId" as const,
      header: "User",
      render: (value: string, item: any) => (
        <div className="flex items-start space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={item.user?.profileImage} alt={item.user?.username} />
            <AvatarFallback>
              <Users className="w-5 h-5" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {item.user?.firstName && item.user?.lastName 
                ? `${item.user.firstName} ${item.user.lastName}`
                : item.user?.username || "Anonymous User"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              ID: {value}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "summary" as const,
      header: "Conversation",
      render: (value: string, item: any) => {
        const messageCount = Array.isArray(item.messages) ? item.messages.length : 0;
        
        return (
          <div className="max-w-xs">
            <p className="text-sm text-gray-900 line-clamp-2">
              {value || "No summary available"}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {messageCount} messages
            </p>
          </div>
        );
      },
    },
    {
      key: "moderationFlags" as const,
      header: "Moderation",
      render: (value: any, item: any) => {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Clean
            </Badge>
          );
        }

        const flags = Array.isArray(value) ? value : [value];
        const flagCount = flags.length;

        if (flagCount > 0) {
          return (
            <Badge variant="secondary" className="bg-red-100 text-red-800">
              <Flag className="w-3 h-3 mr-1" />
              {flagCount} flag{flagCount > 1 ? 's' : ''}
            </Badge>
          );
        }

        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Review
          </Badge>
        );
      },
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
      key: "updatedAt" as const,
      header: "Last Activity",
      render: (value: string) => (
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          {format(new Date(value), "MMM dd, yyyy")}
        </div>
      ),
    },
    {
      key: "createdAt" as const,
      header: "Started",
      render: (value: string) => format(new Date(value), "MMM dd, yyyy"),
    },
    {
      key: "actions" as const,
      header: "Actions",
    },
  ];

  const handleView = (conversation: any) => {
    // TODO: Implement conversation detail modal
    console.log("View conversation:", conversation);
  };

  const handleModerate = (conversation: any) => {
    // TODO: Implement moderation actions
    console.log("Moderate conversation:", conversation);
  };

  const handleDelete = async (conversation: any) => {
    if (window.confirm("Are you sure you want to delete this conversation? This action cannot be undone.")) {
      try {
        // await deleteConversation.mutateAsync(conversation.id);
        console.log("Delete conversation:", conversation.id);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log("Export conversations");
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading AI Chat Data</h2>
          <p className="text-gray-600 mb-4">Failed to load AI chat conversations</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="ai-chat-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Chat Management</h1>
          <p className="text-gray-600 mt-1">
            Monitor and moderate AI chat conversations for quality and safety
          </p>
        </div>
        <Button>
          <Settings className="w-4 h-4 mr-2" />
          Chat Settings
        </Button>
      </div>

      {/* AI Chat Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <MessageCircle className="w-8 h-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Conversations</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {conversationsData?.total || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active Today</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {conversationsData?.conversations?.filter(c => c.isActive).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Flag className="w-8 h-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Flagged Content</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {conversationsData?.conversations?.filter(c => 
                    c.moderationFlags && (Array.isArray(c.moderationFlags) ? c.moderationFlags.length > 0 : true)
                  ).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Avg. Messages</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {conversationsData?.conversations?.length > 0 
                    ? Math.round(
                        conversationsData.conversations.reduce((acc, c) => 
                          acc + (Array.isArray(c.messages) ? c.messages.length : 0), 0
                        ) / conversationsData.conversations.length
                      )
                    : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Moderation Alerts */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            Moderation Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
              <div className="flex items-center space-x-3">
                <Flag className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Inappropriate content detected</p>
                  <p className="text-xs text-gray-500">Conversation #1234 - 5 minutes ago</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Review
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Spam pattern identified</p>
                  <p className="text-xs text-gray-500">Multiple conversations - 2 hours ago</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Investigate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Accuracy</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="h-2 bg-green-500 rounded-full w-20" />
                  </div>
                  <span className="text-sm font-medium">94%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Average Response Time</span>
                <span className="text-sm font-medium">1.2s</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">User Satisfaction</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div className="h-2 bg-blue-500 rounded-full w-16" />
                  </div>
                  <span className="text-sm font-medium">87%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Topics Handled</span>
                <span className="text-sm font-medium">Education, Careers, Applications</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Content Safety
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Safe Conversations</span>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">98.5%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Auto-blocked Messages</span>
                <div className="flex items-center space-x-2">
                  <XCircle className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">12</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Manual Reviews</span>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">3</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Last Safety Update</span>
                <span className="text-sm font-medium">2 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conversations Table */}
      <DataTable
        title="All AI Chat Conversations"
        data={conversationsData?.conversations || []}
        columns={columns}
        totalCount={conversationsData?.total || 0}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSearch={() => {}} // AI chat doesn't need search for now
        onView={handleView}
        onEdit={handleModerate}
        onDelete={handleDelete}
        onExport={handleExport}
        loading={isLoading}
      />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>AI Management Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="justify-start">
              <Bot className="w-4 h-4 mr-2" />
              Train AI Model
            </Button>
            <Button variant="outline" className="justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Update Safety Rules
            </Button>
            <Button variant="outline" className="justify-start">
              <MessageCircle className="w-4 h-4 mr-2" />
              Review Flagged Content
            </Button>
            <Button variant="outline" className="justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Configure Responses
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
