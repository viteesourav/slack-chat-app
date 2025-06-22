import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel"
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


//creating my own custom Button variant with differnt styles useCase... Ref: components/ui/button.tsx from shadcn.
//@parm1 --> the defualt variant style...
//@parm2 --> You define the variants needed and the default variant..
const userItemVariants = cva(
    "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
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

interface UserItemProps {
    id: Id<'members'>;
    label?:string;
    image?:string;
    variant?:VariantProps<typeof userItemVariants>['variant'];
}

//This Components renders the Members Tags on the Sidebar...
export const UserItem = ({
    id,
    label = "Member",
    image,
    variant
}:UserItemProps) => {

    const workspaceId = useWorkSpaceId(); //fetch the current workspaceId..
    const avatarFallback = label.charAt(0).toUpperCase();

  return (
    // Pass the variant props properly in the className using cn --> class Merger by shadcn.
    <Button
        variant='transparent'
        className={cn(userItemVariants({variant:variant}))}
        size='sm'
        asChild
        onClick={(evt)=>{
            evt.stopPropagation();
            console.info('###Icon Cliked');
        }}
    >
        {/* <Link href={`/workspace/${workspaceId}/members/${id}`}> --> This link here does't Work. */} 
        <Link href={``}>
            <Avatar className="size-5 rounded-md mr-1">
                <AvatarImage src={image} className="rounded-md" />
                <AvatarFallback className="rounded-md bg-sky-400 text-white">
                    {avatarFallback}
                </AvatarFallback>
            </Avatar>
            <span className="text-xs font-semibold truncate">{label}</span>
        </Link>
    </Button>
  )
}
