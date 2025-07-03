import { usePathname } from "next/navigation"
import { UserButton } from "@/features/auth/components/user-button"
import { WorkspaceSwitcher } from "./workspace-switcher"
import { SidebarButton } from "./sidebar-button"
import { Home, MessagesSquare, Bell, MoreHorizontal } from "lucide-react"

export const Sidebar = () => {
    const urlPathName = usePathname();  //brings the current path-name...
    
    return (
        <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4">
            <WorkspaceSwitcher />

            {/* Sidebar buttons */}
            <SidebarButton icon={Home} label="Home" isActive={urlPathName.includes('/workspace')} />
            <SidebarButton icon={MessagesSquare} label="Messages" />
            <SidebarButton icon={Bell} label="Notifications" />
            <SidebarButton icon={MoreHorizontal} label="More" />
            
            {/* This postion the profile btn at the bottom of the sideBar */}
            <div className="flex flex-col justify-center items-center gap-y-1 mt-auto">
                <UserButton />
            </div>
        </aside>
    )
}