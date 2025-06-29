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
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-20 mr-2">
          <AvatarImage src={image} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <p className="text-5xl font-bold">{name}</p>
      </div>
      <p className="font-normal text-slate-800 mb-4">
        Start a Conversation with <strong> {name} </strong>
      </p>
    </div>
  );
};
