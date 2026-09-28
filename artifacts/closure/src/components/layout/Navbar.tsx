import { Link } from "wouter";
import { useAuth } from "@workspace/replit-auth-web";
import { trackEvent } from "@/lib/analytics";

export function Navbar() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 bg-background/80 backdrop-blur-sm border-b border-border/40">
      <Link href="/" className="font-serif text-xl tracking-wide text-foreground">
        Closure
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/my-boxes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          My Archive
        </Link>
        {!isLoading && !isAuthenticated && (
          <button
            onClick={() => { trackEvent("sign_in_clicked", { location: "navigation" }); login(); }}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign in
          </button>
        )}
        {!isLoading && isAuthenticated && (
          <button
            onClick={logout}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Sign out
          </button>
        )}
        <Link href="/create" className="text-sm font-medium px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors shadow-sm">
          Begin Ritual
        </Link>
      </div>
    </nav>
  );
}
