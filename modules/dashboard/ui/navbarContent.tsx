"use client";

import { Button } from "@/components/ui/button";
import { runClientLogoutFlow } from "@/lib/auth/clientLogout";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import ChangeTheme from "@/components/custom/ChangeTheme";
import { LogOut, Minus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "@/store/auth/authSlice";
import { selectCurrentModuloName } from "@/store/navigation/navigationSlice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DynamicIcon from "@/components/custom/DynamicIcon";
import ContextDialog from "./contextDialog";
import type { AppDispatch } from "@/store";

const NavbarContent = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const userAuth = useSelector(selectAuth);
  const pathname = usePathname();
  const modulo = useSelector(selectCurrentModuloName);
  const esDev = process.env.NODE_ENV === "development";

  async function handleLogout(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.preventDefault();
    await runClientLogoutFlow({
      dispatch,
      router,
      redirectTo: "/login",
      pathname,
    });
  }

  return (
    <>
      <div className="px-3" />
      <Minus className="desktop" />
      <div className="px-3" />
      <h1 className="desktop">{modulo || "Inicio"}</h1>
      <div className="grow" />
      <div className="grow" />
      {esDev && (
        <div className="desktop">
          <span className="sm:hidden">XSM (Below 640px)</span>
          <span className="hidden sm:inline md:hidden">SM (640px+)</span>
          <span className="hidden md:inline lg:hidden">MD (768px+)</span>
          <span className="hidden lg:inline xl:hidden">LG (1024px+)</span>
          <span className="hidden xl:inline 2xl:hidden">XL (1280px+)</span>
          <span className="hidden 2xl:inline">2XL (1536px+)</span>
        </div>
      )}

      <div className="desktop">
        <ContextDialog />
      </div>
      <Tooltip>
        <TooltipTrigger asChild className="desktop">
          <Button variant="ghost" size="icon" className={""} onClick={() => {}}>
            <DynamicIcon name="home" className="size-7" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Regresar a mi inicio</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild className={"desktop"}>
          <Button variant="ghost" size="icon" onClick={() => {}}>
            <DynamicIcon name="help-circle" className="size-7" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Ayuda</TooltipContent>
      </Tooltip>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* <Button variant="outline">Open</Button> */}
          <Avatar>
            <AvatarImage src={`https://ui-avatars.com/api/?name=${userAuth?.nombre ?? ""}&bold=true&background=0B2967&color=fff&bold=true`} />
            <AvatarFallback>{userAuth?.nombre?.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem disabled>Perfil</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <ChangeTheme text />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut className="text-white" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default NavbarContent;
