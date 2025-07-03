import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ConversationHeroProps {
  name?: string;
  image?: string;
}

// This shows a channel hero for the messages for each channel
export const ConversationHero = ({
  name = "Member",
  image,
}: ConversationHeroProps) => {
  const avatarFallback = name.charAt(0).toUpperCase();

  return (
    <div className="mt-[88px] mx-5 mb-2">
      <div className="flex gap-x-1 mb-2">
        <Avatar className="size-20 mr-2">
          <AvatarImage src={image} />
          <AvatarFallback className="text-5xl font-semibold">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-end">
          <p className="text-5xl font-bold">{name}</p>
        </div>
      </div>
      <p className="text-lg font-normal text-muted-foreground mb-4">
        Start a Conversation here...
      </p>
    </div>
  );
};
