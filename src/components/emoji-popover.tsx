import React, { useState } from 'react';
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "./ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface EmojiPopoverProps {
    children: React.ReactNode;
    hint?:string;
    onEmojiSelect: (emoji:any) => void;
}


export const EmojiPopover = ({
    children,
    hint="Emoji",
    onEmojiSelect
}:EmojiPopoverProps) => {
    
    const[popoverOpen, setPopoverOpen] = useState(false);
    const[tooltipOpen, settooltipOpen] = useState(false);

    //handle on EmojiSelection..
    const onSelect = (emoji: any) => {
        console.log(emoji);
        onEmojiSelect(emoji);  //Put the selected Emoji data in the prop fun..
        setPopoverOpen(false); //close the popover.

        setTimeout(()=>{
            settooltipOpen(false); //close the tooltip
        }, 50);
    }

  
    // NOTE: Below we are using nested tooltip component inside a popover component. --> for the Emoji Popover component.
    // This handles the showing the Emoji popover, along with showing the tooltip when we hover.
    return (
        <TooltipProvider>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <Tooltip open={tooltipOpen} onOpenChange={settooltipOpen} delayDuration={50}>
                    <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                            {children}
                        </TooltipTrigger>
                    </PopoverTrigger>
                    <TooltipContent
                    side={'top'}
                    align={'center'}
                    className={'bg-black text-white border border-white/5'}
                    >
                        <p className='font-medium text-xs'>
                            {hint}
                        </p>
                    </TooltipContent>
                </Tooltip>
                <PopoverContent className='p-0 w-full border-none shadow-none'>
                    <Picker data={data} onEmojiSelect={onSelect} />
                </PopoverContent>
            </Popover>
        </TooltipProvider>
  )
}
