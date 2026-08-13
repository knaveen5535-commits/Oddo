import { LayoutDashboard, Calendar, PlusCircle, Globe, Sparkles, Compass, Wallet, Briefcase, Bell } from "lucide-react";

export interface MenuItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  match: (pathname: string) => boolean;
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const exact = (href: string) => (pathname: string) => pathname === href;
const prefix = (href: string) => (pathname: string) => pathname.startsWith(href);

export const menuGroups: MenuGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/", icon: <LayoutDashboard size={19} />, match: exact("/") },
    ],
  },
  {
    label: "Planning",
    items: [
      { label: "My Trips", href: "/trips", icon: <Calendar size={19} />, match: prefix("/trips") },
      { label: "Plan a Trip", href: "/trips/create", icon: <PlusCircle size={19} />, match: exact("/trips/create") },
    ],
  },
  {
    label: "Discover",
    items: [
      { label: "Explore Destinations", href: "/city-search", icon: <Globe size={19} />, match: exact("/city-search") },
      // { label: "Smart Search", href: "/smart-search", icon: <Sparkles size={19} />, match: exact("/smart-search") },
      // { label: "Activities", href: "/activity-search", icon: <Compass size={19} />, match: exact("/activity-search") },
    ],
  },
  {
    label: "Travel Toolkit",
    items: [
      { label: "Budget", href: "/budget", icon: <Wallet size={19} />, match: exact("/budget") },
      { label: "Packing List", href: "/packing-list", icon: <Briefcase size={19} />, match: exact("/packing-list") },
      { label: "Notifications", href: "/notifications", icon: <Bell size={19} />, match: exact("/notifications") },
    ],
  },
];
