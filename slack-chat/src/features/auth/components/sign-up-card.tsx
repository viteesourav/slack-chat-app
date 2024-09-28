import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from 'react-icons/fc'
import { SignInFlow } from "../types"
import { useState } from "react"

interface SignUpCardProps {
    setLoginState: (state: SignInFlow) => void;
}

export const SignUpCard = ({setLoginState}:SignUpCardProps) => {
    const[frmData, setFrmData] = useState<{email: string, password: string, confirmPassword: string}>({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const[isShowPassErrMsg, setIsShowPassErrMsg] = useState<boolean>(false);

    //function: checks the confirm pass logic...
    const checkCnfrmPass = (evt:any) => {
        // update the confirm Pass string in the state...
        setFrmData(prev => ({
            ...prev,
            confirmPassword: evt.target.value
        }))
        
        //use the evt.target.value to compare against the pass... [** NOTE: Dont use the state variable, as it will be available in the next re-render]
        if(frmData?.password && evt.target.value) {
            setIsShowPassErrMsg(frmData.password !== evt.target.value);
        }else {
            setIsShowPassErrMsg(false);
        }
    }

    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle>
                    Sign Up to Continue
                </CardTitle> 
                <CardDescription>
                    use your email or another service to continue
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 px-0 pb-0">
                <form className="space-y-2.5">
                    <Input
                    disabled={false}
                    value={frmData.email}
                    name="email"
                    onChange={(evt) => setFrmData(prev => ({...prev, [evt.target.name]:evt.target.value}))}
                    placeholder="Email"
                    type="email"
                    required
                     />
                     <Input
                    disabled={false}
                    value={frmData.password}
                    name="password"
                    onChange={(evt) => setFrmData(prev => ({...prev, [evt.target.name]:evt.target.value}))}
                    placeholder="Password"
                    type="password"
                    required
                     />
                     <div className="w-full flex flex-col space-y-1">
                        <Input
                        disabled={false}
                        value={frmData.confirmPassword}
                        name="confirmPassword"
                        onChange={checkCnfrmPass}
                        placeholder="Confirm Password"
                        type="password"
                        required
                        />
                        {isShowPassErrMsg && <span className="text-xs font-bold text-rose-500 px-1">The Password doesnot match</span>}
                     </div>
                    <Button
                        type='submit'
                        className="w-full"
                        size='lg'
                        disabled={false}
                    >
                        Continue
                    </Button>
                </form>

                <Separator />

                <div className="flex flex-col gap-y-2.5">
                    <Button
                        variant='outline'
                        disabled={false}
                        size='lg'
                        onClick={()=>{}}
                        className="w-full relative"
                    >
                        <FcGoogle 
                            className="absolute size-5 left-2 top-3"
                        />
                        Continue with Google
                    </Button>
                    <Button
                        variant='outline'
                        disabled={false}
                        size='lg'
                        onClick={()=>{}}
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
                    Already have an account ? 
                    <span 
                        className="text-sky-700 hover:underline cursor-pointer px-2"
                        onClick={() => setLoginState('signIn')}
                    >
                        Sign In
                    </span>
                </p>
            </CardFooter>
        </Card>
    )
}