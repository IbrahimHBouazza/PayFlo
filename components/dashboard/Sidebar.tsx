"use client";

import * as React from "react";
import { PanelLeft, Settings, Home, FileText, Users, BarChart3, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUser } from "@clerk/nextjs";

const SIDEBAR_WIDTH = "16rem";

const Sidebar = () => {
  const { user } = useUser();

  const menuItems = [
    { name: "Dashboard", icon: <Home size={20} />, link: "/dashboard" },
    { name: "Invoices", icon: <FileText size={20} />, link: "/invoices" },
    { name: "Clients", icon: <Users size={20} />, link: "/clients" },
    { name: "Reports", icon: <BarChart3 size={20} />, link: "/reports" },
  ];

  return (
    <aside className="bg-gray-1200 text-white h-screen p-4 flex flex-col fixed left-0 w-64"
>
      {/* Profile Section */}
      <div className="flex items-center space-x-3 p-4">
        <img src={user?.imageUrl || "/default-avatar.png"} alt="Profile" className="w-10 h-10 rounded-full" />
        <div>
          <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-gray-400">{user?.publicMetadata?.company as string || "Your Company"}</p>
        </div>
      </div>

      <Separator className="my-4 bg-gray-700" />

      {/* Navigation Links */}
      <nav className="flex-1">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={item.link}
            className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 rounded-md transition"
          >
            {item.icon}
            <span>{item.name}</span>
          </a>
        ))}
      </nav>

      <Separator className="my-4 bg-gray-700" />

      {/* Settings & Logout */}
      <div className="mt-auto">
        <a href="/settings" className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 rounded-md transition">
          <Settings size={20} />
          <span>Settings</span>
        </a>
        <a href="/" className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-800 rounded-md transition">
          <LogOut size={20} />
          <span>Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
