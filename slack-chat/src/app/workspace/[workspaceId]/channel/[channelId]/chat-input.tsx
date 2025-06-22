import { useCreateMessage } from "@/features/messages/api/user-create-message";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";

// This is how we dynamically loads the Editor component.
const Editor = dynamic(() => import('@/components/editor'), {ssr: false});

interface ChatInputProps {
  placeholder: string;
}

export const ChatInput = ({
  placeholder
}:ChatInputProps) => {

  // Once create succss, this states update --> triggers re-render and refresh the page.
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);


  //holds the reference to the Editor Component used below..
  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkSpaceId();
  const channelId = useChannelId();

  const {mutate: createMessage } = useCreateMessage();

  const handleSubmit = async ({
    body,
    image
  }: {body: string; image: File | null}) => { 
    try{
      setIsPending(true);
      await createMessage({
          workspaceId,
          channelId,
          body,
        }, {
          throwError: true
        });

        setEditorKey(prev => prev+1); // it just triggers a render, added as key prop --> clears the editor.
    } catch(error) {
      toast.error("Failed to send message")
    } finally {
      setIsPending(false);
    }  
  }

  return (
    <div className="px-5 w-full">
        <Editor
          key={editorKey} 
          variant='create' 
          onSubmit={handleSubmit}
          disabled={isPending}
          placeholder={placeholder}
          innerRef={editorRef}
        />
    </div>
  )
}
