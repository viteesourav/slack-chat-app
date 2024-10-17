"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCreateWorkspaceModal } from "../store/use-create-workspace-modal"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateWorkspaceModal = () => {
    
    const [name, setName] = useState("");
    const router = useRouter();
    const[open, setOpen] = useCreateWorkspaceModal(); //from the global-store-state using jotai... 
    const{ mutate, data, apiState, isPending } = useCreateWorkspace(); //handles the create workspace api..

    //handle closing the modal...
    const handleCloseModal = () => {
        setOpen(false);
        //TODO: Clear form... 
        setName("");
    }

    //handle frm submission and calling workspace creation api...
    const handleSubmit = async(evt:React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        mutate({
            name
        },{
            onSuccess:(id) => {
                // console.log('##New Workspace is created:', data);
                /*
                    Problem: using .push --> allows the use to goBack.. **Navigating but all click events are not working** 
                    Workaround Soln --> 
                   // don't use router.push, rather use window.location.assign(`/workspace/${id}`) --> navigates and reload the screen.
                    Real Problem -> We were using dropDown + Dialog from shadcn --> Once Dialog closes the Click events were removed.
                    Solution --> In the Dropdown menu --> add a property called "modal" as false. Ref -> workspace-switcher.tsx [holds the dropDown from where this modal will be triggered]
                */
                router.push(`/workspace/${id}`);
                handleCloseModal(); //close the create-workspace-modal..
                toast.success('Workspace Created successfully');
            }
        })

    }

    return (
        <Dialog open={open} onOpenChange={handleCloseModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a Workspace</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <Input
                        disabled={isPending}
                        value={name}
                        onChange={(evt:React.ChangeEvent<HTMLInputElement>) => {setName(evt.target.value)}}
                        required
                        autoFocus={true}
                        minLength={3}
                        placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                    />
                    <div className="flex justify-end">
                        <Button 
                            disabled={isPending} 
                            type="submit" 
                        > 
                            Create 
                        </Button>
                    </div>
                </form>
            </DialogContent>     
        </Dialog>
    )
}