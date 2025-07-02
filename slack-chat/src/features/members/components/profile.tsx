import { Button } from "@/components/ui/button";
import { Id } from "../../../../convex/_generated/dataModel";
import { useGetByIdMember } from "../api/use-getById-member";
import {
  AlertTriangle,
  ChevronDownIcon,
  Loader,
  MailIcon,
  XIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useUpdateMember } from "../api/use-update-member";
import { useRemoveMember } from "../api/use-remove-member";
import { useCurrentMember } from "../api/use-current-member";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import { useUserConfirmation } from "@/hooks/use-user-confirm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProfileProps {
  memberId: Id<"members">;
  onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
  const router = useRouter();
  const workspaceId = useWorkSpaceId();

  // confirm dialog before updating, leaving and removing...
  // const [UpdateDialog, confirmUpdate] = useUserConfirmation(
  //   "Update Member Role",
  //   "Are you sure you want to update Member's role ?"
  // );
  // const [LeaveDialog, confirmLeave] = useUserConfirmation(
  //   "Leave Workspace",
  //   "Are you sure you want to leave the workspace ?"
  // );
  // const [RemoveDialog, confirmRemove] = useUserConfirmation(
  //   "Remove Member",
  //   "Are you sure you want to remove this member ?"
  // );

  // get details of the current Member... [helps us to check if he is Admin or not]
  const { data: member, isLoading: isMemberLoading } = useGetByIdMember({
    id: memberId,
  });

  const { data: currentMember, isLoading: isCurrentMemberLoading } =
    useCurrentMember({
      id: workspaceId,
    });
  const { mutate: updateMember, isPending: isMemberUpdating } =
    useUpdateMember();
  const { mutate: removeMember, isPending: isMemberRemoving } =
    useRemoveMember();

  // handles remove a member...
  const onRemove = async () => {
    // const ok = await confirmRemove();

    // if (!ok) return;

    removeMember(
      {
        id: memberId,
      },
      {
        onSuccess: () => {
          toast.success("Member removed successfully");
          onClose(); // closes the profile view
        },
        onError: () => {
          toast.error("Failed to remove member");
        },
      }
    );
  };

  // handle levaing the workspace ...
  const onLeave = async () => {
    // const ok = await confirmLeave();

    // if (!ok) return;
    removeMember(
      {
        id: memberId,
      },
      {
        onSuccess: () => {
          router.replace("/"); //route the user to home-page
          toast.success("You left the workspace");
          onClose(); // closes the profile view
        },
        onError: () => {
          toast.error("Failed to leave the workspace");
        },
      }
    );
  };

  // handle updating member role change...
  const onUpdate = async (role: "admin" | "member") => {
    // const ok = await confirmUpdate();

    // if (!ok) return;

    updateMember(
      {
        id: memberId,
        role,
      },
      {
        onSuccess: () => {
          toast.success("Roles chnaged successfully");
          onClose(); // closes the profile view
        },
        onError: () => {
          toast.error("Failed to change the role");
        },
      }
    );
  };

  // show loading message screen...
  if (isMemberLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold"> Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  // If no member Found...
  if (!member) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold"> Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-10 text-red-500/50" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  const avatarFallback = member?.user.name?.charAt(0).toUpperCase() ?? "M";

  return (
    <>
      {/* <UpdateDialog /> */}
      {/* <RemoveDialog />
      <LeaveDialog /> */}
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold"> Profile</p>
          <Button onClick={onClose} size="iconSm" variant="ghost">
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center p-2">
          <Avatar className="max-w-[256px] max-h-[256px] size-full">
            <AvatarImage src={member?.user?.image} />
            <AvatarFallback className="aspect-square text-6xl font-semibold">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col items-center p-4">
          <p className="text-2xl font-bold">{member.user.name}</p>
          {currentMember?.role === "admin" &&
          currentMember?._id !== memberId ? (
            // This means we are admin and looking at someone's profile... -> He can remove that member.
            <div className="flex items-center gap-2 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"outline"} className="w-full capitalize">
                    {member.role} <ChevronDownIcon className="size-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuRadioGroup
                    value={member.role}
                    onValueChange={(role) =>
                      onUpdate(role as "admin" | "member")
                    }
                  >
                    <DropdownMenuRadioItem value="admin">
                      Admin
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="member">
                      Member
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant={"outline"} className="w-full" onClick={onRemove}>
                Remove
              </Button>
            </div>
          ) : currentMember?._id === memberId &&
            currentMember?.role !== "admin" ? (
            // This means we are looking at our profile, but we are not admin.. --> He can leave the chat.
            <div className="mt-4">
              <Button variant={"outline"} className="w-full" onClick={onLeave}>
                Leave
              </Button>
            </div>
          ) : null}
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm hover:underline text-[#1264a3]"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
