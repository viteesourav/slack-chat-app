import {format} from "date-fns";

interface ChannelHeroProps {
    name: string;
    creationTime: number;
}

// This shows a channel hero for the messages for each channel
export const ChannelHero = ({
    name,
    creationTime
}:ChannelHeroProps) => {
    return (
        <div className="mt-[88px] mx-5 mb-4">
            <p className="text-2xl font-bold flex items-center mb-2">
                # {name}
            </p>
            <p className="font-normal text-slate-800 mb-4">
                This channel was created on {format(creationTime, "MMM do, yyyy")}. This is the very begining of the <strong>{name}</strong>
            </p>
        </div>

    )
};