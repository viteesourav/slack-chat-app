import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef } from "react";

// This is how we dynamically loads the Editor component.
const Editor = dynamic(() => import('@/components/editor'), {ssr: false});

interface ChatInputProps {
  placeholder: string;
}

export const ChatInput = ({
  placeholder
}:ChatInputProps) => {

  //holds the reference to the Editor Component used below..
  const editorRef = useRef<Quill | null>(null);

  return (
    <div className="px-5 w-full">
        <Editor 
          variant='create' 
          onSubmit={()=>{}}
          disabled={false}
          placeholder={placeholder}
          innerRef={editorRef}
        />
    </div>
  )
}
