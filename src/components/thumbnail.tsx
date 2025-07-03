/* eslint-disable @next/next/no-img-element */

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {XIcon} from "lucide-react";

interface ThumbnailProps {
    url: string | null | undefined;
}

export const Thumbnail = ({
    url
}:ThumbnailProps) => {
    
    if(!url) return null;

    // NOTE: When Image clicked, we will use dialog to enlarge the whole-image.
    return (
        <Dialog>
            <DialogTrigger>
                <div className="relative overflow-hidden max-w-[360px] border border-lg my-2 cursor-zoom-in">
                    <img
                        src={url}
                        alt="Message image"
                        className="rounded-md object-cover size-full"
                    />
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] border-none bg-opacity-100 p-0 shadow-none">
                <img
                    src={url}
                    alt="Message image"
                    className="rounded-md object-cover size-full"
                />
            </DialogContent>    
        </Dialog>
    );
}