"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingCart, Bell, Package, BarChart3, Users, Settings, ShieldAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client"; // Ensure you have this client helper

export default function Navbar({ userEmail }: { userEmail: string | undefined }) {
  const [role, setRole] = useState("user");

  // Fetch the real role from the database on mount
  useEffect(() => {
    async function fetchRole() {
      const supabase = createClient();
      
      // 1. Get the current user ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 2. Fetch their role from the 'profiles' table
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
          //.single();
        
        if (data) setRole(data.role);
      }
    }
    fetchRole();
  }, []);

  // Check if they are part of the admin team
  const isAdminTeam = role === "admin" || role === "head_admin";

  if (isAdminTeam) {
    return <AdminNavbar userEmail={userEmail} role={role} />;
  }

  return <UserNavbar userEmail={userEmail} />;
}

// --- SUB-COMPONENT: ADMIN NAVBAR (Dark Mode) ---
function AdminNavbar({ userEmail, role }: { userEmail: string | undefined, role: string }) {
  const isHeadAdmin = role === "head_admin";

  return (
    <nav className="border-b bg-slate-900 text-white">
      <div className="flex h-16 items-center px-4 container mx-auto justify-between">
        <div className="flex items-center gap-6">
          <Link href="/admin" className="font-bold text-xl tracking-tight text-red-400 flex items-center gap-2">
            Hotfixers 
            {/* Show badge for role */}
            <span className={`text-white text-[10px] px-2 py-0.5 rounded uppercase ${isHeadAdmin ? "bg-red-600" : "bg-blue-600"}`}>
              {role.replace('_', ' ')}
            </span>
          </Link>
          
          {/* Admin Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 text-sm font-medium text-slate-300">
            <Link href="/admin" className="hover:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4" /> Dashboard
            </Link>
            <Link href="/admin/products" className="hover:text-white flex items-center gap-2">
              <Package className="w-4 h-4" /> Inventory
            </Link>
            
            {/* HEAD ADMIN ONLY: Manage Team Link */}
            {isHeadAdmin && (
              <Link href="/admin/team" className="text-yellow-400 hover:text-yellow-300 flex items-center gap-2 font-bold">
                <ShieldAlert className="w-4 h-4" /> Manage Team
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
             <span className="text-xs text-slate-400 hidden sm:inline-block">
               {userEmail}
             </span>
          </div>
          <LogoutButton /> 
        </div>
      </div>
    </nav>
  );
}

// --- SUB-COMPONENT: CUSTOMER NAVBAR (Shopee/Lazada Style) ---
function UserNavbar({ userEmail }: { userEmail: string | undefined }) {
  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 container mx-auto gap-8">
        
        {/* Logo */}
        <Link href="/" className="font-bold text-2xl tracking-tight text-blue-600 shrink-0">
          Hotfixers
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl relative">
          <Input 
            placeholder="Search for products, brands and more..." 
            className="w-full pl-4 pr-10 rounded-full bg-gray-100 border-transparent focus:bg-white transition-all"
          />
          <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full rounded-r-full hover:bg-transparent">
            <Search className="w-5 h-5 text-gray-500" />
          </Button>
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <Button variant="ghost" size="icon" className="relative text-gray-600">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          <Button variant="ghost" size="icon" className="relative text-gray-600">
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
              3
            </span>
          </Button>

          <div className="h-6 w-px bg-gray-200 mx-2 hidden sm:block"></div>
          
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-700 leading-none">My Account</span>
                <span className="text-[10px] text-gray-500">{userEmail}</span>
             </div>
             <LogoutButton />
          </div>
        </div>
      </div>
      
      {/* Categories Sub-nav */}
      <div className="border-t py-2 bg-gray-50 hidden md:block">
        <div className="container mx-auto px-4 flex gap-6 text-sm text-gray-600">
          <Link href="#" className="hover:text-blue-600 font-medium">Daily Discover</Link>
          <Link href="#" className="hover:text-blue-600">Electronics</Link>
          <Link href="#" className="hover:text-blue-600">Fashion</Link>
          <Link href="#" className="hover:text-blue-600">Home & Living</Link>
          <Link href="#" className="hover:text-blue-600 ml-auto flex items-center gap-1 text-red-600 font-medium">
             Flash Deals
          </Link>
        </div>
      </div>
    </nav>
  );
}