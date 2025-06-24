import Quill from 'quill';
import { useEffect, useRef, useState } from 'react';

interface RendererProps {
    value: string;
}

const Renderer = ({value}:RendererProps) => {
    const [isEmpty, setIsEmpty] = useState<boolean>(false);
    const rendererRef = useRef<HTMLDivElement>(null);

    // using Quill to show the message
    useEffect(()=>{
        if(!rendererRef.current) return;

        const container = rendererRef.current;
        const quill = new Quill(document.createElement("div"),{
            theme: "snow"
        });

        quill.enable(false); //this disables the quill editor space

        const contents = JSON.parse(value);
        quill.setContents(contents);

        const isEmpty = quill.getText().replace(/<(.|\n)*?>/g, '').trim().length === 0; // checks if the quill editor has no text
        setIsEmpty(isEmpty);

        container.innerHTML = quill.root.innerHTML;

        // properly clean the above quill methods..
        return () => {
            if(container) {
                container.innerHTML = "";
            }
        };
    },[value]);

    if(isEmpty) return null;

    return (
        <div ref={rendererRef} className='ql-editor ql-renderer' />
    )
};

export default Renderer;