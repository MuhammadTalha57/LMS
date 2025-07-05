"use client";

import { archivoBlack, bebasNeue } from "./fonts";

import { Button } from "./button";

import { IconLogout, IconArrowNarrowLeft } from "@tabler/icons-react";
import { useRouter, usePathname } from "next/navigation";

export default function Dashboard({
  userRole,
  userName,
  handleSignOut,
  backBtnHidden = false,
  children,
}: {
  userRole: string;
  userName: string;
  handleSignOut: () => void;
  backBtnHidden: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="min-w-screen min-h-screen bg-gradient-to-r from-emerald-400 to-cyan-400 flex flex-col items-center p-3 gap-y-3">
      <nav className="w-11/12 p-3 rounded-2xl bg-white/30 backdrop-blur-md shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.back();
              }}
              hidden={backBtnHidden}
            >
              <IconArrowNarrowLeft></IconArrowNarrowLeft>
            </Button>
            <h1 className={`${archivoBlack.className}`}>{userName}</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <IconLogout></IconLogout>
            Sign out
          </Button>
        </div>
      </nav>
      {children}
    </div>
  );
}
