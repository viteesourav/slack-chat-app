import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkSpaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";

// This is how we dynamically loads the Editor component.
const Editor = dynamic(() => import('@/components/editor'), {ssr: false});

interface ChatInputProps {
  placeholder: string;
}

type CreateMessageValues = {
  workspaceId: Id<"workSpaces">;
  channelId: Id<"channels">;
  body: string;
  image?: Id<"_storage"> | undefined;
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
  const {
    mutate: generateUploadUrl
  } = useGenerateUploadUrl();

  const handleSubmit = async ({
    body,
    image
  }: {body: string; image: File | null}) => { 
    try{
      setIsPending(true);
      editorRef?.current?.enable(false);
      const values: CreateMessageValues = {
        workspaceId,
        channelId,
        body,
        image: undefined,
      }

      //check if image is aadded in Editor.
      // upload the image to convex _storage --> get the storageId --> put it in create Message Payload.
      if(image) {
        const url = await generateUploadUrl({}, {
          throwError: true
        });

        if(!url) {
          throw new Error('Url not Found');
        }

        const result = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": image.type,
          },
          body: image,
        })

        if(!result.ok) {
          throw new Error('Failed to upload image');
        }

        const { storageId } = await result.json();  // get's the image's storageId

        values.image = storageId;
      }

      await createMessage(values, {
          throwError: true
        });

        setEditorKey(prev => prev+1); // it just triggers a render, added as key prop --> clears the editor.
    } catch(error) {
      toast.error("Failed to send message")
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
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
