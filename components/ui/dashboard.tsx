"use client";

import { archivoBlack } from "./fonts";

import { Button } from "./button";

import { IconLogout } from "@tabler/icons-react";

export default function Dashboard({
  userRole,
  userName,
  handleSignOut,
  children,
}: {
  userRole: string;
  userName: string;
  handleSignOut: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-screen h-screen bg-gradient-to-r from-emerald-400 to-cyan-400 flex flex-col items-center p-3 gap-y-3">
      <nav className="w-11/12 p-3 rounded-2xl bg-white/30 backdrop-blur-md shadow-md">
        <div className="flex justify-between items-center">
          <h1 className={`${archivoBlack.className}`}>{userName}</h1>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <IconLogout></IconLogout>
            Sign out
          </Button>
        </div>
      </nav>

      <h1>{`Welcome to ${userRole} Dashboard`}</h1>

      {children}
    </div>
  );
}
