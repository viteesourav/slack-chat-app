"use client";
import { 
    Avatar,
    AvatarFallback,
    AvatarImage
} from "@/components/ui/avatar";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "../api/use-current-user";
import { Loader, LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

export const UserButton = () => {

    const{ signOut } = useAuthActions();
    const { userDetails, isLoading } = useCurrentUser(); //Calling our custom hook..

    if(isLoading) {
        return (
            <Loader className="size-4 animate-spin text-muted-foreground" />
        )
    }

    if(!userDetails) {
        return null;
    }

    const {name, image} = userDetails;
    const avatarFallbackImg = name!.charAt(0).toLocaleUpperCase(); //name can be undefined or string, if undefined !. will handle it.

    //handle logOut Actions...
    const handleSignOut = () => {
        signOut()
            .then(() => {
            window.location.reload(); // This reloads the browser url...
            })
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="outine-node relative">
                <Avatar className="size-10 hover:opacity-75 transition">
                    <AvatarImage alt={name} src={image} />
                    <AvatarFallback className="bg-yellow-500 text-white font-bold text-xl">
                        {avatarFallbackImg}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="right" className="w-60">
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="size-4 mr-2" />
                    Log Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}