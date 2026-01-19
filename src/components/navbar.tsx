"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, BarChart3, ShieldAlert, Package } from "lucide-react";
import { useAuth } from "@/lib/auth-context"; // <--- 1. Use the Global Auth
import { useCart } from "@/lib/cart-context"; // <--- 2. Use Cart Context for the badge

export default function Navbar() {
  const { user, role, isLoading } = useAuth(); // <--- Instant Data (No flickering)

  // 1. Loading State
  if (isLoading) {
    return (
      <nav className="border-b bg-white h-16 flex items-center px-4">
        <div className="container mx-auto animate-pulse flex items-center gap-4">
           <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
      </nav>
    );
  }

  // 2. Decide which navbar to show
  const isAdminTeam = role === "admin" || role === "head_admin";

  if (isAdminTeam) {
    return <AdminNavbar userEmail={user?.email} role={role!} />;
  }

  return <UserNavbar userEmail={user?.email} />;
}

// --- SUB-COMPONENT: ADMIN NAVBAR ---
function AdminNavbar({ userEmail, role }: { userEmail: string | undefined, role: string }) {
  const isHeadAdmin = role === "head_admin";

  return (
    <nav className="border-b bg-slate-900 text-white">
      <div className="flex h-16 items-center px-4 container mx-auto justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-bold text-xl tracking-tight text-red-400 flex items-center gap-2">
            Hotfixers 
            <span className={`text-white text-[10px] px-2 py-0.5 rounded uppercase ${isHeadAdmin ? "bg-red-600" : "bg-blue-600"}`}>
              {role.replace('_', ' ')}
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-slate-300">
            <Link href="/admin" className="hover:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Dashboard
            </Link>
            <Link href="/admin/products" className="hover:text-white flex items-center gap-2">
              <Package className="w-4 h-4" /> Inventory
            </Link>
            {isHeadAdmin && (
              <Link href="/admin/team" className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2 font-bold">
                <ShieldAlert className="w-4 h-4" /> Manage Team
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-400 hidden sm:inline-block">
             {userEmail}
          </span>
          <LogoutButton /> 
        </div>
      </div>
    </nav>
  );
}

// --- SUB-COMPONENT: USER NAVBAR ---
function UserNavbar({ userEmail }: { userEmail: string | undefined }) {
  const { items } = useCart(); // Get cart items to show the number
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 container mx-auto gap-8">
        <Link href="/" className="font-bold text-2xl tracking-tight text-blue-600 shrink-0">
          Hotfixers
        </Link>
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <Input 
            placeholder="Search for products..." 
            className="w-full pl-4 pr-10 rounded-full bg-gray-100 border-transparent focus:bg-white"
          />
          <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full rounded-r-full hover:bg-transparent">
            <Search className="w-5 h-5 text-gray-500" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 ml-auto shrink-0">
          {/* FIX: WRAPPED IN LINK AND ADDED BADGE */}
          <Button asChild variant="ghost" size="icon" className="relative text-gray-600">
            <Link href="/cart">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>

          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-700 leading-none">Account</span>
                <span className="text-[10px] text-gray-500">{userEmail}</span>
             </div>
             <LogoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}