/** Design reminder — รักษาเส้นทางกฎหมายทุกฉบับให้เข้าถึงได้จากแท็บร่วมและมีหน้าเฉพาะของตน */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import GoodGovernance from "./pages/GoodGovernance";
import Liability from "./pages/Liability";
import OfficialInformation from "./pages/OfficialInformation";
import Secrecy from "./pages/Secrecy";


function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/good-governance"} component={GoodGovernance} />
      <Route path={"/liability"} component={Liability} />
      <Route path={"/official-information"} component={OfficialInformation} />
      <Route path={"/secrecy"} component={Secrecy} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  const routerBase = import.meta.env.PROD ? import.meta.env.BASE_URL.replace(/\/$/, "") : "";

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <WouterRouter base={routerBase}>
            <Router />
          </WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
