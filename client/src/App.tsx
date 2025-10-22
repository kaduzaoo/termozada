import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import GameMode from "./components/GameMode";

function AppRouter() {
  return (
    <Switch>
      <Route path={"/"} component={GameMode} />
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
  // Get the base path from the script tag or use Vite's BASE_URL
  const getBasePath = () => {
    // Try to get from meta tag first
    const metaBase = document.querySelector('meta[name="base"]')?.getAttribute('content');
    if (metaBase) return metaBase;
    
    // Fall back to import.meta.env.BASE_URL
    return import.meta.env.BASE_URL || '/';
  };

  const basePath = getBasePath();

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <Router base={basePath}>
          <TooltipProvider>
            <Toaster />
            <AppRouter />
          </TooltipProvider>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

