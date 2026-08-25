"use client"

import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Home,
  User,
  FileEdit,
  BookOpen,
  Contact,
  Code,
  Calendar,
  X,
  Menu as MenuIcon
} from "lucide-react"

const menuItems = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Login', icon: FileEdit, href: '/user/register' },
  { label: 'Brochure', icon: BookOpen, href: '#' },
  { label: 'Developers', icon: Code, href: '/developer' },
  { label: 'Contact', icon: Contact, href: '/contact' },
  { label: 'Events', icon: Calendar, href: '/events/register' },
  { label: 'Profile', icon: User, href: '/user/account' },
]

export default function Menu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  return (
    <Drawer
      showSwipeHandle={isMobile}
      swipeDirection={isMobile ? "down" : "right"}
    >
      <div className="fixed top-2 right-2 z-[100]">
        <DrawerTrigger render={
          <Button
            variant="secondary"
            className="bg-[#0d1424]/80 hover:bg-[#0d1424]/90 aria-expanded:bg-[#0d1424]/90 aria-expanded:text-white text-white rounded-md px-5 py-5 flex items-center gap-2 font-medium text-lg transition-colors border-none"
          >
            Menu
            <MenuIcon className="w-8  h-8 text-white" />
          </Button>
        } />
      </div>
      <DrawerContent className="bg-black/40 backdrop-blur border-white/10 text-white p-4">
        <DrawerHeader className="relative pt-2 pb-6 text-center">
          <DrawerTitle className="text-2xl font-bold text-white">Semaphore 2K26</DrawerTitle>
          {!isMobile && (
            <DrawerClose render={
              <Button
                variant="ghost"
                aria-label="Close menu"
                className="absolute top-0 right-0 h-9 w-9 rounded-md p-0 text-gray-300 hover:bg-white/10 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            } />
          )}
        </DrawerHeader>
        <nav className="flex min-h-0 flex-1 flex-col gap-2 w-full max-w-sm mx-auto overflow-y-auto no-scrollbar md:max-w-none">
          {menuItems.filter(item => !(isLoggedIn && item.label === 'Login')).map((item, index) => {
            const Icon = item.icon
            return (
              <a
                key={index}
                href={item.href}
                className="flex items-center gap-4 px-6 py-3.5 bg-[oklch(12.9%_0.042_264.695)] hover:bg-[oklch(27.7%_0.046_192.524)]  rounded-lg transition-colors duration-200"
              >
                <Icon className="w-5 h-5 text-gray-200" />
                <span className="font-semibold text-gray-100">{item.label}</span>
              </a>
            )
          })}
        </nav>
      </DrawerContent>
    </Drawer>
  )
}
