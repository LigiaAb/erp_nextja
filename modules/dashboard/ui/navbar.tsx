import Logo from "@/components/custom/Logo";
import NavbarContent from "./navbarContent";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { buildLoggedLinkHref } from "@/lib/logs/serverLinkLogger";

export function AppNavbar() {
  const dashboardHref = buildLoggedLinkHref({
    to: "/dashboard",
    buttonId: "navbar-logo-dashboard",
    module: "dashboard/ui/navbar",
    label: "Logo Dashboard",
    fileName: "logbotones.log",
  });

  return (
    <header className="flex items-center pl-2 pr-4 h-14 bg-primary text-primary-foreground grow px-6 top-0 fixed w-full ">
      {/* Logo */}
      <SidebarTrigger className="overflow-hidden bg-transparent h-8 w-8 [&_svg]:h-6! [&_svg]:w-6!" />
      <Link href={dashboardHref}>
        <Logo className="w-60 ml-10" />
      </Link>
      {/* Navigation Menu */}
      {/* <div className="ml-10" /> */}
      {/* <SidebarTrigger /> */}
      <NavbarContent />
      {/* Icons / Profile */}
      <div className="ml-auto flex items-center space-x-4">{/* botones extra */}</div>
    </header>
  );
}
