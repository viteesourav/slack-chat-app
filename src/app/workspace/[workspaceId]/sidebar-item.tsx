import { Button } from "@/components/ui/button";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { IconType } from "react-icons/lib";
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from "@/lib/utils";

//creating my own custom Button variant with differnt styles useCase... Ref: components/ui/button.tsx from shadcn.
//@parm1 --> the defualt variant style...
//@parm2 --> You define the variants needed and the default variant..
const sidebarItemVariants = cva(
    "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
    {
        variants: {
            variant: {
                default: "text-[#f9edffcc]",
                active: "text-[#481349] bg-white/90 hover:bg-white/90",
            }
        },
        defaultVariants: {
            variant: 'default',
        }
    }
)

interface SidebarItemProps {
    label: string;
    id: string;
    icon: LucideIcon | IconType;
    variant?: VariantProps<typeof sidebarItemVariants>["variant"];
}

// This component handles Showing Channels and other information on the sidebar...
// id --> belongs to a particular channel Id --> Use to naviagate to a particular channel.
export const SidebarItem = ({
    label,
    id,
    icon: Icon,
    variant
}:SidebarItemProps) => {

    const workspaceId = useWorkSpaceId();  //fetches the curr workspaceId 

  return (
    <Button
        variant='transparent'
        size='sm'
        className={cn(sidebarItemVariants({variant:variant}))}
        asChild
    >
        <Link href={`/workspace/${workspaceId}/channel/${id}`}>
            <Icon
                className="size-3.5 mr-1 shrink-0"
            />
            <span
                className="text-sm truncate"
            >{label}</span>
        </Link>
    </Button>
  )
}
