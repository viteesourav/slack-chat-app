"use client";

import React, { useEffect, useMemo } from 'react'
import { UserButton } from '@/features/auth/components/user-button';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

export default function Home() {

  const [open, setOpen] = useCreateWorkspaceModal(); //global-state using jotai to handle modal.
  const router = useRouter(); //For Page Naviagtion...
  
  const {data, isLoading} = useGetWorkspaces(); //call to custom-hook... 
  //Processing bigData --> Good to use useMemo hook from React...
  const workspaceId = useMemo(()=>(data?.[0]?._id), [data]);

  //Logically --> till I am fetching workspaces, dont do anything --> isLoading will be true.
  //Once I fetch, If workspace exist, Go to that Or else, Open a modal for user to create a new workspace.
  useEffect(()=>{
    if(isLoading) return;
    if(workspaceId) {
      console.log('Redirected to the WorkSpace');
      router.replace(`/workspace/${workspaceId}`); //using .replace --> Wont allow the user to go back.. NOTE: .push --> allows the user to goBack.
    } else {
      console.log('Open creation Modal');
      if(!open) {
        setOpen(true);
      }
    }
  }, [workspaceId, isLoading, open, setOpen]);

  // Just show a loader in the center of the page...
  return (
    <div className='h-full flex justify-center items-center'>
      <Loader className='size-10 animate-spin text-muted-foreground' />
    </div>
  );
}
