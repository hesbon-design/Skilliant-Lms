"use client";
import Link from "next/link";
import { MenuType } from "./index";
import { ChevronDown } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const Navigation = ({ data }: { data: MenuType[] }) => {
  const pathName = usePathname();
  return (
    <nav className="hidden xl:block">
      <ul className="flex items-center gap-1">
        {data.map(({ href, id, label, subMenu }) => {
          // Check if current path matches parent or any submenu item
          const isActive =
            pathName === href ||
            subMenu?.some((item) => pathName === item.href);

          return (
            <li key={id} className="group/dropdown relative">
              <Link
                href={href}
                className={cn(
                  "inline-flex items-center gap-x-1.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 hover:text-purple-600",
                  isActive ? "text-purple-600 font-semibold" : "text-gray-700",
                )}
              >
                <span>{label}</span>
                {subMenu?.length && (
                  <ChevronDown className="size-4 text-gray-400 transition-transform duration-200 group-hover/dropdown:rotate-180 group-hover/dropdown:text-purple-600" />
                )}
              </Link>
              {subMenu?.length && (
                <div className="absolute left-0 top-full pt-2 z-50 hidden group-hover/dropdown:block animate-in fade-in slide-in-from-top-1">
                  <ul className="min-w-60 rounded-2xl border border-gray-100 bg-white p-2 shadow-xl ring-1 ring-black/5">
                    {subMenu.map(({ href, id, label }) => (
                      <li key={id}>
                        <Link
                          href={href}
                          className={cn(
                            "flex items-center rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors hover:bg-purple-50 hover:text-purple-700",
                            pathName === href
                              ? "bg-purple-50 text-purple-700 font-semibold"
                              : "text-gray-700",
                          )}
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navigation;
