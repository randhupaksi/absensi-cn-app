import {
  ChartColumn,
  ClipboardCheck,
  LayoutDashboard,
  Shield,
  Users,
} from "lucide-react";

export const dashboardNavigation = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    active: true,
  },
  {
    label: "Data Absensi",
    href: "/dashboard",
    icon: ClipboardCheck,
    active: false,
  },
  {
    label: "Monitoring BK",
    href: "/dashboard",
    icon: Shield,
    active: false,
  },
  {
    label: "Data Siswa",
    href: "/dashboard",
    icon: Users,
    active: false,
  },
  {
    label: "Rekap",
    href: "/dashboard",
    icon: ChartColumn,
    active: false,
  },
];
