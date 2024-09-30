"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from 'react-icons/fc'
import { SignInFlow } from "../types"
import { useState } from "react"

import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react"

interface SignInCardProps {
    setLoginState: (state: SignInFlow) => void;
}

export const SignInCard = ({setLoginState}:SignInCardProps) => {
    const { signIn } = useAuthActions();  //from convexAuth...
    const[frmData, setFrmData] = useState<{email: string, password: string}>({
        email: '',
        password: ''
    });
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);
    const[errMsg, setErrMsg] = useState("");

    //Handles submit of the frm Data...
    const handleOnFrmSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
        evt.preventDefault();
        const {email, password} = frmData;
        setIsBtnDisabled(true);
        signIn('password', {email, password, flow: 'signIn'})
            .then(()=> {
                window.location.reload(); // ** This is extra to refresh the page **
            })
            .catch(() => {
                console.log('### Error While logging');
                setErrMsg("Either email or password is incorrect");
            })
            .finally(() => {
                setIsBtnDisabled(false);
            })
    }

    //Handles login using OAuth...
    const handleLoginWithOAuth = (value: 'github' | 'google') => {
        setIsBtnDisabled(true);
        signIn(value)
            .finally(() => setIsBtnDisabled(false));
    }

    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Login to Continue
                </CardTitle> 
                <CardDescription>
                    use your email or another service to continue
                </CardDescription>
            </CardHeader>
            {
                !!errMsg && (
                    <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-destructive text-sm mb-6">
                        <TriangleAlert className="size-4" />
                        <p>{errMsg}</p>
                    </div>
                )
            }
            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5" onSubmit={handleOnFrmSubmit}>
                    <Input
                    disabled={isBtnDisabled}
                    value={frmData.email}
                    name="email"
                    onChange={(evt) => setFrmData(prev => ({...prev, [evt.target.name]:evt.target.value}))}
                    placeholder="Email"
                    type="email"
                    required
                     />
                     <Input
                    disabled={isBtnDisabled}
                    value={frmData.password}
                    name="password"
                    onChange={(evt) => setFrmData(prev => ({...prev, [evt.target.name]:evt.target.value}))}
                    placeholder="Password"
                    type="password"
                    required
                     />
                    <Button
                        type='submit'
                        className="w-full"
                        size='lg'
                        disabled={isBtnDisabled}
                    >
                        Continue
                    </Button>
                </form>

                <Separator />

                <div className="flex flex-col gap-y-2.5">
                    <Button
                        variant='outline'
                        disabled={isBtnDisabled}
                        size='lg'
                        onClick={() => handleLoginWithOAuth('google')}
                        className="w-full relative"
                    >
                        <FcGoogle 
                            className="absolute size-5 left-2 top-3"
                        />
                        Continue with Google
                    </Button>
                    <Button
                        variant='outline'
                        disabled={isBtnDisabled}
                        size='lg'
                        onClick={() => handleLoginWithOAuth('github')}
                        className="w-full relative"
                    >
                        <FaGithub 
                            className="absolute size-5 left-2 top-3"
                        />
                        Continue with Github
                    </Button>
                </div>
            </CardContent>
            <CardFooter
                className="w-full px-0 pt-2.5"
            >
                <p className="text-xs text-muted-foreground">
                    Don&apos;t have an account ? 
                    <span 
                        className="text-sky-700 hover:underline cursor-pointer px-2"
                        onClick={() => setLoginState('signUp')}
                    >
                        Sign Up
                    </span>
                </p>
            </CardFooter>
        </Card>
    )
}