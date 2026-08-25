"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Home,
  KeyRound,
  User,
  FileEdit,
  BookOpen,
  CircleDollarSign,
  Contact,
  Code,
  Calendar,
  Menu as MenuIcon
} from "lucide-react"

const menuItems = [
  { label: 'Home', icon: Home, href: '/' },
  { label: 'Login', icon: FileEdit, href: '/user/register' },
  { label: 'Info', icon: BookOpen, href: '/info' },
  { label: 'Brochure', icon: BookOpen, href: '#' },
  { label: 'Developers', icon: Code, href: '/developer' },
  { label: 'Contact', icon: Contact, href: '/contact' },
  { label: 'Events', icon: Calendar, href: '/events/register' },
  { label: 'Profile', icon: User, href: '/user/account' },
]

export default function Menu() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  return (
    <Drawer swipeDirection="right" direction="right" showSwipeHandle>
      <div className="fixed top-6 right-6 md:top-8 md:right-10 z-[100]">
        <DrawerTrigger render={
          <Button
            variant="secondary"
            className="bg-[#021020]/80 hover:bg-cyan-950/80 border border-cyan-400/50 hover:border-cyan-400 aria-expanded:bg-cyan-950/80 aria-expanded:text-cyan-300 text-cyan-400 rounded-md w-14 h-14 flex items-center justify-center transition-all backdrop-blur-sm shadow-none"
          >
            <MenuIcon className="w-8 h-8" />
          </Button>
        } />
      </div>
      <DrawerContent className="bg-black/80 backdrop-blur-xl border-l border-cyan-400/20 text-white p-6 shadow-[-10px_0_30px_rgba(0,255,255,0.05)] !flex-col">
        <DrawerHeader className="text-center md:text-left pt-6 pb-10">
          <DrawerTitle className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500 tracking-wider">
            SEMAPHORE
          </DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-2 max-w-sm mx-auto w-full overflow-y-auto max-h-[70vh] no-scrollbar">
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
        </div>
      </DrawerContent>
    </Drawer>
  )
}
