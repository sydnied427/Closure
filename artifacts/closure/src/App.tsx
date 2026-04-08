import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Create from "@/pages/Create";
import Archive from "@/pages/Archive";
import Pitch from "@/pages/Pitch";
import { Navbar } from "@/components/layout/Navbar";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/pitch" component={Pitch} />
      <Route>
        <>
          <Navbar />
          <Switch>
            <Route path="/" component={Landing} />
            <Route path="/create" component={Create} />
            <Route path="/my-boxes" component={Archive} />
            <Route component={NotFound} />
          </Switch>
        </>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
