import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { PenLine, LogOut } from "lucide-react";

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-heading text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          Inkwell
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button asChild variant="default" size="sm">
                <Link to="/create">
                  <PenLine className="mr-2 h-4 w-4" />
                  Write
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild variant="default" size="sm">
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
