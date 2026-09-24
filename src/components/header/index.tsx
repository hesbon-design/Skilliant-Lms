import { Logo } from "@/lib/icons";
import Link from "next/link";
import Navigation from "./navigation";
import MobileNavigation from "./mobileNavigation";
import HeaderExtraInfo from "./headerExtraInfo";

export type MenuType = {
  id: number;
  label: string;
  href: string;
  subMenu?: {
    id: number;
    label: string;
    href: string;
  }[];
};
const menuList: MenuType[] = [
  {
    id: 1,
    label: "Home",
    href: "/",
  },
  {
    id: 2,
    label: "Courses",
    href: "/courses",
  },
  {
    id: 3,
    label: "About",
    href: "/about",
  },
  {
    id: 4,
    label: "Blog",
    href: "/blog",
  },
  {
    id: 5,
    label: "Contact",
    href: "/contact",
  },
];

const Header = () => {
  return (
    <header className="sticky top-0 left-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md py-3 transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-8 xl:gap-10">
            <Link href={"/"} className="inline-flex items-center shrink-0 py-1" title="Skillsaint Home">
              <Logo className="text-purple-600 max-sm:w-28" />
            </Link>
            <Navigation data={menuList} />
          </div>
          <div className="flex items-center gap-4">
            <HeaderExtraInfo />
            <MobileNavigation data={menuList} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
