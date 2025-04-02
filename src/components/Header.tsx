
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary rounded-full h-8 w-8 flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-white"
            >
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M16 16c-1.1.9-2.4 1.5-4 1.5s-2.9-.6-4-1.5" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Mama Mia Cancer Predictor</h1>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </a>
          <Button variant="outline" size="sm">
            Documentation
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
