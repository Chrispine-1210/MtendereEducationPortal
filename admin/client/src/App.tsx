import { Switch, Route, useRoute } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-admin";
import { WebSocketProvider } from "@/hooks/use-websocket";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AdminLayout from "@/components/admin/AdminLayout";
import Dashboard from "@/pages/admin/dashboard";
import LoginAndTestDashboard from "@/pages/LoginAndTestDashboard";
import NotFound from "@/pages/not-found";
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
import Index from "./pages/admin/index"

function Router() {
  return (
    <Switch>
      <Route path="/" component={Index} />
      <Route path="/admin/*" component={Dashboard} />
      <Route path="/admin/dashboard" component={Dashboard} />
      <Route path="/admin/scholarships" component={Scholarships} />
      <Route path="/admin/jobs" component={Jobs} />
      <Route path="/admin/partners" component={Partners} />
      <Route path="/admin/blog" component={Blogs} />
      <Route path="/admin/team" component={Teams} />
      <Route path="/admin/users" component={Users} />
      <Route path="/admin/roles" component={Roles} />
      <Route path="/admin/applications" component={Applications} />
      <Route path="/admin/analytics" component={Analytics} />
      <Route path="/admin/ai-chat" component={AiChat} />
      <Route path="/admin/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}


/**
* The main App component that wraps the entire application.
*/
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WebSocketProvider>
            <Toaster />
            <Router />
          </WebSocketProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
