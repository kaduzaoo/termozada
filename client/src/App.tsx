import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import GameMode from "./components/GameMode";

function AppRouter() {
  const [location] = useLocation();
  
  // Debug: log the current location
  if (typeof window !== 'undefined') {
    console.log('Current location:', location);
  }
  
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
  // Use the base path from Vite config
  const base = import.meta.env.BASE_URL;
  
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <Router base={base}>
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

