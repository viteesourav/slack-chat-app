'use client';

import React, { useEffect, useMemo } from 'react'
import Image from 'next/image';
import { useWorkSpaceId } from '@/hooks/use-workspace-id';
import VerificationInput from 'react-verification-input'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useGetByIdWorkspaceInfo } from '@/features/workspaces/api/use-getById-workspace-Info';
import { Id } from '../../../../convex/_generated/dataModel';
import { Loader } from 'lucide-react';
import { useJoinWorkspace } from '@/features/workspaces/api/use-join-workspace';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface JoinPageProps {
  params: {
    workspaceId:Id<'workSpaces'>;
  }
}

//Shows the Page for Joining a Workspace... [use Props params to extract the path param here..]
const JoinPage = ({params}:JoinPageProps) => {

  const router = useRouter();
  const {workspaceId} = params; //Take the path param workspaceId value ..

  //Fetch basic Info on the workspace..
  const{data: workspaceInfo, isLoading} = useGetByIdWorkspaceInfo({
    id:workspaceId
  });

  //handle the case if the currenLoggedin user is already a member of the workspace...
  const isMember = useMemo(()=> workspaceInfo?.isMember, [workspaceInfo?.isMember]);

  //watch isMember, router, workspaceId, --> If any change --> See if isMember exist --> redirect to the workspace Page.
  useEffect(()=>{
    if(isMember) {
      router.push(`/workspace/${workspaceId}`);
    }
  },[isMember, router, workspaceId])


  //hook that joins a member to workspace..
  const{mutate, isPending} = useJoinWorkspace();

  //handles onComplete of all 6 boxes...
  const handleOnComplete = (value: string) => {
    mutate({
      workspaceId,
      joinCode:value
    },{
      onSuccess: (id)=> {
        router.push(`/workspace/${id}`);
        toast.success('Successfully joined the workspace');
      },
      onError: () => {
        toast.error('Failed to join the workspace');
      }
    })
  }

  if(isLoading) {
    return (
      <div className='h-full flex items-center justify-center'>
        <Loader className='size-10 animate-spin text-muted-foreground' />
      </div>
    )
  }

  return (
    <div className='h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md'>
        <Image src='/panda.png' alt='Logo' width={80} height={80} />
        <div className='flex flex-col gap-y-4 items-center justify-center max-w-md'>
          <div className='flex flex-col gap-y-2 items-center justify-center'>
            <h1 className='text-2xl font-semibold'>
              Join {workspaceInfo?.name}
            </h1>
            <p className='text-md text-muted-foreground'>
              Enter the Join Code
            </p>
          </div>
          <VerificationInput 
            length={6}
            onComplete={handleOnComplete}
            classNames={{
              container: cn('flex gap-x-2', isPending && 'opacity-50 cursor-not-allowed'),
              character: 'uppercase h-auto rounded-md border border-gray-300 flex items-center justify-center text-lg font-medium text-gray-500',
              characterInactive: "bg-muted",
              characterSelected: "bg-white text-black",
              characterFilled: "bg-white text-black",
            }}
            autoFocus
          />
        </div>
        <div className='flex gap-x-4'>
          {/* asChild attribute here makes the Button behave as the child it holds i.e the Link tag */}
            <Button size='lg' variant='outline' asChild>
              <Link href='/'>
                Back to Home
              </Link>
            </Button>
        </div>
    </div>
  )
}

export default JoinPage;