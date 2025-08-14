import { useState } from "react";
import { useDashboardStats } from "@/hooks/use-admin";
import AnalyticsChart from "@/components/admin/AnalyticsChart";
import StatsCard from "@/components/admin/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Users, 
  FileCheck, 
  Award, 
  Briefcase,
  Eye,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Globe
} from "lucide-react";

// Sample analytics data (in real app this would come from API)
const userGrowthData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
  datasets: [
    {
      label: "New Users",
      data: [120, 190, 300, 500, 200, 300, 450],
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "rgb(59, 130, 246)",
    },
  ],
};

const applicationStatusData = {
  labels: ["Pending", "Approved", "Rejected", "Waitlisted"],
  datasets: [
    {
      label: "Applications",
      data: [45, 85, 25, 15],
      backgroundColor: [
        "rgba(245, 158, 11, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(239, 68, 68, 0.8)",
        "rgba(59, 130, 246, 0.8)",
      ],
    },
  ],
};

const contentDistributionData = {
  labels: ["Scholarships", "Jobs", "Blog Posts", "Partners"],
  datasets: [
    {
      label: "Content",
      data: [156, 89, 45, 23],
      backgroundColor: [
        "rgba(99, 102, 241, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(245, 158, 11, 0.8)",
        "rgba(239, 68, 68, 0.8)",
      ],
    },
  ],
};

const trafficSourceData = {
  labels: ["Direct", "Search", "Social", "Referral", "Email"],
  datasets: [
    {
      label: "Traffic Sources",
      data: [35, 25, 20, 15, 5],
      backgroundColor: [
        "rgba(59, 130, 246, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(245, 158, 11, 0.8)",
        "rgba(239, 68, 68, 0.8)",
        "rgba(99, 102, 241, 0.8)",
      ],
    },
  ],
};

const monthlyEngagementData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "Page Views",
      data: [15000, 18000, 22000, 19000, 25000, 28000],
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderColor: "rgb(59, 130, 246)",
    },
    {
      label: "Unique Visitors",
      data: [8000, 9500, 11000, 9800, 13000, 15000],
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      borderColor: "rgb(16, 185, 129)",
    },
  ],
};

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<"7D" | "30D" | "90D">("30D");
  const { data: stats, isLoading, error } = useDashboardStats();

  const handleExportReport = () => {
    // TODO: Implement comprehensive analytics export
    console.log("Export analytics report");
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Analytics</h2>
          <p className="text-gray-600 mb-4">Failed to load analytics data</p>
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="analytics-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into your education portal performance
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <div className="flex space-x-2">
            {(["7D", "30D", "90D"] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
                data-testid={`time-range-${range}`}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats?.totalUsers || 2847}
          change={{ value: "12% from last month", trend: "up" }}
          icon={Users}
          iconBgColor="bg-blue-100"
          iconColor="text-primary"
        />
        <StatsCard
          title="Applications"
          value={stats?.totalApplications || 1235}
          change={{ value: "8% from last month", trend: "up" }}
          icon={FileCheck}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatsCard
          title="Active Scholarships"
          value={stats?.activeScholarships || 156}
          change={{ value: "3% from last month", trend: "down" }}
          icon={Award}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
        <StatsCard
          title="Job Opportunities"
          value={stats?.activeJobs || 89}
          change={{ value: "15% from last month", trend: "up" }}
          icon={Briefcase}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <AnalyticsChart
          title="User Growth Trend"
          data={userGrowthData}
          type="line"
          height={300}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />

        {/* Application Status */}
        <AnalyticsChart
          title="Application Status Distribution"
          data={applicationStatusData}
          type="doughnut"
          height={300}
        />

        {/* Monthly Engagement */}
        <AnalyticsChart
          title="Monthly Engagement"
          data={monthlyEngagementData}
          type="line"
          height={300}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />

        {/* Content Distribution */}
        <AnalyticsChart
          title="Content Type Distribution"
          data={contentDistributionData}
          type="bar"
          height={300}
        />
      </div>

      {/* Traffic Sources and Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSourceData.labels.map((source, index) => {
                const percentage = trafficSourceData.datasets[0].data[index];
                const color = trafficSourceData.datasets[0].backgroundColor[index];
                
                return (
                  <div key={source} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm text-gray-700">{source}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{percentage}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full"
                          style={{ 
                            width: `${percentage}%`, 
                            backgroundColor: color 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Performance Metrics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Engagement Metrics</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg. Session Duration</span>
                    <span className="font-medium">4m 32s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Bounce Rate</span>
                    <span className="font-medium">32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pages per Session</span>
                    <span className="font-medium">3.2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Return Visitor Rate</span>
                    <span className="font-medium">68%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Content Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Most Popular Scholarship</span>
                    <Badge variant="secondary">CS Excellence</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Top Job Category</span>
                    <Badge variant="secondary">Technology</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Most Read Blog</span>
                    <Badge variant="secondary">Career Tips</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Application Success Rate</span>
                    <span className="font-medium text-green-600">78%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Real-time Activity (Last 30 minutes)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">23</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">5</div>
              <div className="text-sm text-gray-600">New Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-gray-600">Page Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">8</div>
              <div className="text-sm text-gray-600">New Registrations</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export & Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Monthly Report
            </Button>
            <Button variant="outline" className="justify-start">
              <PieChart className="w-4 h-4 mr-2" />
              Export User Analytics
            </Button>
            <Button variant="outline" className="justify-start">
              <Download className="w-4 h-4 mr-2" />
              Download Raw Data
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
