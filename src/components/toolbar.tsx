import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import EmojiPicker from "@emoji-mart/react";
import { EmojiPopover } from "./emoji-popover";

interface ToolbarProps {
    isAuthor: boolean;
    isPending: boolean;
    handleEdit: () => void;
    handleThread: () => void;
    handleDelete: () => void;
    handleReaction: (value: string) => void;
    hideThreadButton?: boolean;
}

// This component is handles toolbar on messages
export const Toolbar = ({
    isAuthor,
    isPending,
    handleEdit,
    handleDelete,
    handleReaction,
    handleThread,
    hideThreadButton,
}:ToolbarProps) => {
    return (
        <div className="absolute top-0 right-5">
            <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
                <EmojiPopover 
                    hint="Add reaction"
                    onEmojiSelect={(emoji) => handleReaction(emoji.native)}
                >
                    <Button
                        variant={"ghost"}
                        size={"iconSm"}
                        disabled={isPending}
                    >
                        <Smile className="size-4" />
                    </Button>
                </EmojiPopover>
                {!hideThreadButton && (
                    <Hint label="Reply in thread">
                        <Button
                            variant={"ghost"}
                            size={"iconSm"}
                            disabled={isPending}
                            onClick={handleThread}
                        >
                            <MessageSquareTextIcon className="size-4" />
                        </Button>
                    </Hint>
                )}
                {isAuthor && (
                    <>
                        <Hint label="Edit message">
                            <Button
                                variant={"ghost"}
                                size={"iconSm"}
                                disabled={isPending}
                                onClick={handleEdit}
                                >
                                <Pencil className="size-4" />
                            </Button>
                        </Hint>
                        <Hint label="Delete message">
                            <Button
                                variant={"ghost"}
                                size={"iconSm"}
                                disabled={isPending}
                                onClick={handleDelete}
                                >
                                <Trash className="size-4" />
                            </Button>
                        </Hint>
                    </>
                )}
            </div>
        </div>
    )
};