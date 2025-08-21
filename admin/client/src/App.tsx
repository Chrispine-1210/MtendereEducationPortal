import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/pages/admin/dashboard";
import Login from "@/pages/admin/login";
import Register from "@/pages/admin/register";
import Scholarships from "./pages/admin/scholarships";
import Partners from "./pages/admin/partners";
import Applications from "./pages/admin/applications";
import Analytics from "./pages/admin/analytics";
import Jobs from "./pages/admin/jobs";
import Roles from "./pages/admin/roles";
import Teams from "./pages/admin/team";
import Blogs from "./pages/admin/blog";
import AiChat from "./pages/admin/ai-chat";
import Users from "./pages/admin/users";
import Settings from "./pages/admin/settings";


function AdminRouter() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin" component={Dashboard} />
        <Route path="/admin/dashboard" component={Dashboard} />
        <Route path="/admin/scholarships" component={Scholarships} />
        <Route path="/admin/jobs" component={Jobs} />
        <Route path="/admin/partners" component={Partners} />
        <Route path="/admin/blog" component={Blogs} />
        <Route path="/admin/team" component={Teams} />
        <Route path="/admin/users" component={Users} />
        <Route path="/admin/login" component={Login} />
        <Route path="/admin/register" component={Register} />
        <Route path="/admin/roles" component={Roles} />
        <Route path="/admin/applications" component={Applications} />
        <Route path="/admin/analytics" component={Analytics} />
        <Route path="/admin/ai-chat" component={AiChat} />
        <Route path="/admin/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </AdminLayout>
  );
}

function Router() {
  return (
    <Switch>
      {/* Home route */}
      <Route path="/" component={(AdminRouter) => (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center max-w-md p-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Mtendere Education Platform</h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your comprehensive educational consulting platform for scholarships, job opportunities, and academic partnerships.
            </p>
            <a 
              href="/login" 
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Access Admin Panel
            </a>
          </div>
        </div>
      )} />
      

      {/* Admin routes */}
      <Route component={Login} />
      <Route component={Register} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;