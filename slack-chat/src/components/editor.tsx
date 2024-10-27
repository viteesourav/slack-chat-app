import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Quill, { type QuillOptions } from 'quill';
import { Delta, Op } from 'quill/core';
import { Button } from './ui/button';
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";
import { ImageIcon, Smile } from 'lucide-react';
import { Hint } from './hint';

import "quill/dist/quill.snow.css";
import { cn } from '@/lib/utils';


//this defines the type for the component Props..
type EditorValue = {
    image: File | null;
    body: string;
}

interface EditorProps {
    onSubmit: ({image, body}:EditorValue) => void;
    onCancel?: () => void;
    placeholder?:string;
    defaultValue?: Delta | Op[];
    disabled?: boolean;
    innerRef?: MutableRefObject<Quill | null>; 
    variant?: 'create' | 'update';
}

//Our own Custom Editor using Qill package.. 
const Editor = ({
    onSubmit,
    onCancel,
    placeholder = 'Write Something...',
    defaultValue = [],
    disabled=false,
    innerRef, 
    variant='create'
}:EditorProps) => {

    const[text, setText] = useState('');
    const[isToolbarVisible, setIsToolbarVisible] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);  //Ref to the div that will hold the editor

    //using Refs to keep track of the props Values --> 1. they dont need to be added to useEffect dependecy + If they change, no re-renders.
    //NOTE: we can call onSubmit inside useEffect, without adding in dependecy and re-renders.
    const submitRef = useRef(onSubmit);
    const placeholderRef = useRef(placeholder);
    const quillRef = useRef<Quill | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const disabledRef = useRef(disabled);

    //New Hook used --> Fires just before the screen repaints.. --> Resets all the hooks before the screen loads..
    useLayoutEffect(()=> {
        submitRef.current = onSubmit;
        placeholderRef.current = placeholder;
        defaultValueRef.current = defaultValue;
        disabledRef.current = disabled;
    });

    //Initialize the Quill Editor and add it to the div ref..
    useEffect(() => {
        
        if(!containerRef.current) return;

        const container = containerRef.current;
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement("div"),
        );

        const options: QuillOptions = {
            theme: 'snow',
            placeholder: placeholderRef.current,
            modules:{
                toolbar: [
                    ["bold", "italic", "strike"],
                    ["link"],
                    [{list:"ordered"}, {list:"bullet"}]
                ],
                keyboard:{
                    bindings: {
                        enter: {
                            key: "Enter",  //Enter Key code
                            handler: () => {
                                //TODO: submit the form, as user hits Enter..
                                return; //prevents default quill behaviour
                            }
                        },
                        shift_enter: {
                            key:"Enter",
                            shiftKey: true, //detects if shift key is pressed with Enter
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, "\n"); //adds a new line character on shift + enter
                            }
                        },
                    }
                }
            }
        };

        const quill = new Quill(editorContainer, options);
        
        //This makes the quill accessable to Everyone outside the useEffect..
        quillRef.current = quill;
        quillRef.current.focus(); //focus the editor immediatly once you land the page.

        //this passed means, the parent want to control the quill in the current page..
        if(innerRef) {
            innerRef.current = quill; //Allows the innerRef passed from parent also to control the ref..
        }

        //handle state change based on qill contents...
        quill.setContents(defaultValueRef.current); //sets the default value to the quill
        setText(quill.getText()); //update the default value in the state function...

        //add a listner to the quill editor --> update the text as it changes..
        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText());
        })

        //When we unMount this editor component... --> clean it up..
        return () => {
            quill.off(Quill.events.TEXT_CHANGE); //turn off the listner

            //Clean the container..
            if(container) {
                container.innerHTML = "";
            }

            //clean the reference to the qill editior if it exists..
            if(quillRef.current) {
                quillRef.current = null;
            }
            if(innerRef?.current) {
                innerRef.current = null;
            }
        }
    }, [innerRef]);

    //based on text state variable --> If the Editor has content or not..
    //NOTE: The regex protects --> against any tags, just spaces or empty new line in the editor..
    const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length === 0; //checks if there is any message added in editor .. 

    //Handles the hide toolbar functionality ..
    const toggelToolbar = () => {
        setIsToolbarVisible(prev => !prev);  //updates the state variable..
        
        //IF the toolbase is visible --> toggle, either adds if not there or remove if it's there the hidden class property.
        const toolbarElement = containerRef.current?.querySelector('.ql-toolbar');
        if(toolbarElement) {
            toolbarElement.classList.toggle('hidden');
        }
    }
  return (
    <div className="flex flex-col">
        <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
            
            {/* The qill Editor container */}
            <div ref={containerRef} className='h-full ql-custom' />

            {/* Holds the Editor Footer icons and Buttons */}
            <div className='flex px-2 pb-2 z-[5]'>
                <Hint label={isToolbarVisible ? 'hide formatting' : 'show formatting'} align='center' side='top'>
                    <Button
                        disabled={disabled}
                        variant={'ghost'}
                        size={'iconSm'}
                        onClick={toggelToolbar}
                    >
                        <PiTextAa className='size-4' />
                    </Button>
                </Hint>
                <Hint label="Emoji" align='center' side='top'>
                    <Button
                        disabled={disabled}
                        variant={'ghost'}
                        size={'iconSm'}
                        onClick={()=>{}}
                    >
                        <Smile className='size-4' />
                    </Button>
                </Hint>
                {variant === 'create' && (
                    <Hint label="Image" align='center' side='top'>
                        <Button
                            disabled={disabled}
                            variant={'ghost'}
                            size={'iconSm'}
                            onClick={()=>{}}
                        >
                            <ImageIcon className='size-4' />
                        </Button>
                    </Hint>
                )}
                {variant === 'update' && (
                    <div className='ml-auto flex items-center gap-x-2'>
                        <Button
                            variant={'outline'}
                            size={'sm'}
                            disabled={disabled}
                            onClick={()=>{}}
                        >
                            Cancel
                        </Button>
                        <Button
                            className='bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
                            size={'sm'}
                            disabled={disabled || isEmpty}
                            onClick={()=>{}}
                        >
                            Save
                        </Button>
                    </div>
                )}
                {/* NOTE: Here disabled is a prop and isEmpty is taken from state --> Both supports re-render. NEver use disabledRef as it updates but wont trigger re-render */}
                {variant === 'create' && (
                    <Button
                        disabled={disabled || isEmpty}
                        variant={'default'}
                        onClick={() => {}}
                        size={'iconSm'}
                        // className='ml-auto bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
                        className={
                            cn('ml-auto', 
                                isEmpty ? 'bg-white text-muted-foreground'
                                        : ' bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
                            )
                        }
                    >
                        <MdSend className='mx-auto size-4' />
                    </Button>
                )}
            </div>
        </div>
        <div className='p-2 text-[10px] text-muted-foreground flex justify-end'>
            <p>
                <strong>Shift + Enter</strong> to add a new line
            </p>
        </div>
    </div>
  )
}

export default Editor;
