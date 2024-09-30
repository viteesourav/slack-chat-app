"use client";

import React from 'react'
import { Button } from '@/components/ui/button';
import { useAuthActions } from "@convex-dev/auth/react";

export default function Home() {
  const { signOut } = useAuthActions();

  const handleSignOut = () => {
    signOut()
      .then(() => {
        window.location.reload(); // This reloads the browser url...
      })
    
  }

  return (
    <div>
      This is App Landing Page
      <div>
        <Button 
          onClick={handleSignOut}
        >
          LogOut
        </Button>
      </div>
    </div>
  );
}
