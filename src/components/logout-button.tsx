"use client";

import { signout } from "@/app/actions";
import { Button } from "@/components/ui/button";
// We removed the import from lucide-react to keep it simple and dependency-free

export function LogoutButton() {
  return (
    <Button 
      variant="destructive" 
      onClick={() => signout()} 
      className="flex items-center gap-2"
    >
      <LogOutIcon className="w-4 h-4" />
      Sign Out
    </Button>
  );
}

// Renamed this to LogOutIcon to stop the error
function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" x2="9" y1="12" y2="12"/>
    </svg>
  );
}