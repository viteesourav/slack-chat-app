import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React, { useState } from 'react'

// this hooks handles Confirmation For user, before performing any action.
export const useUserConfirmation = (
    title: string,
    message: string,
):[() => JSX.Element, () => Promise<unknown>] => {

    //A state --> that either holds a promise or null..
    const[promise, setPromise] = useState<{ resolve:(value: boolean) => void} | null>(null);

    //set the state with resolve object and store it in the resolve function in component state 
    // --> this opens the Modal Window as the state is now not null..
    const confirm = () => new Promise((resolve, reject) => {
        setPromise({resolve});
    });

    //set the state with null...
    const close = () => {
        setPromise(null);
    }

    //Based on the btn Clicked --> We will either put true or false in the promise.resolve.

    //For cancel btn click --> Set the state as null..
    const handleCancel = () => {
        promise?.resolve(false); //this resolves the saved promise function with false. --> return the resp from confirm() above as promise is not resolved.
        close(); //It re-sets the promise state to null i.e close the popup.
    }

    //for Confirm btn click --> set the state as promise resolved with true.
    const handleConfirm = () => {
        promise?.resolve(true);
        close();
    }

    //This shows the dialog modal component for the user to Confirm.
    const ConfirmDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {message}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className='pt-2'>
                    <Button 
                        variant='outline'
                        onClick={handleCancel}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );


    return[ConfirmDialog, confirm];
}
