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
            onSuccess(id) {
                // console.log('##New Workspace is created:', data);
                router.push(`/workspace/${id}`); // using .push --> allows the use to goBack..
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