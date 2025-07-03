import { atom, useAtom } from "jotai";

const modalState = atom(false);

// This handles the Popup for creating new Channel ...
export const useCreateChannelModal = () => {
    return useAtom(modalState);
}