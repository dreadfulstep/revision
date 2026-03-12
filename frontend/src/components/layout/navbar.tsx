import Link from "next/link";
import { Button } from "../ui/button";
import { Zap } from "lucide-react";
import { FaDiscord } from "react-icons/fa";

const Navbar = ({
  handleLogin,
  loading,
}: {
  handleLogin: () => void;
  loading: boolean;
}) => {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav className="w-full max-w-5xl flex items-center justify-between px-5 py-4 rounded-full border bg-background/80 backdrop-blur-md shadow-sm">
        <Link
          href="/"
          className="flex items-center gap-4 font-semibold text-lg text-foreground"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Zap size={24} className="text-primary-foreground" />
          </div>
          StudyBuddy
        </Link>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full hidden md:block text-sm text-muted-foreground hover:text-foreground cursor-pointer h-8"
            onClick={handleLogin}
            disabled={loading}
          >
            Sign in
          </Button>
          <Button
            size="sm"
            className="rounded-full text-sm h-8 gap-1.5 cursor-pointer"
            onClick={handleLogin}
            disabled={loading}
          >
            <FaDiscord size={13} />
            Get started
          </Button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
