import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = { name: string};  //workspace name will come as input.. 
type ResponseType = Id<'workSpaces'> | null; //Since we know, we will get a workspace id when we create a new workspace or null

//NOTE: Whenever we create mutation -> data must be passed as params to below func..
// type Options --> holds the types of possible values that might come as options...
type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
    throwError?: boolean;
};

// This is a cutsom powerful convex-mutation method, that handles creation of new workspace by invoking the api, also handles the response...
export const useCreateWorkspace = () => {
    //defining some state to handle the state of the api call...
    const[data, setData] = useState<ResponseType>(null);
    const[error, setError] = useState<Error | null>(null);
    
    // NOTE: "pending" state helps to identify loading time, till data is fetched...
    // const[isPending, setIsPending] = useState(false); 
    // const[isSuccess, setIsSuccess] = useState(false);
    // const[isError, setIsError] = useState(false);
    // const[isSettled, setIsSettled] = useState(false);

    //Since we are using so many api states, and only one state we get at a time, So btter comprise them in a single state..
    const[apiState, setApiState] = useState<"pending" | "success" | "error" | "settled" | null>(null);

    //better way to handle the states...
    const isPending = useMemo(() => apiState === "pending", [apiState]);
    const isSuccess = useMemo(() => apiState === "success", [apiState]);
    const isError = useMemo(() => apiState === "error", [apiState]);
    const isSettled = useMemo(() => apiState === "settled", [apiState]);
    
    const mutation = useMutation(api.workspaces.createWorkspace); 

    const mutate = useCallback(async (values:RequestType, options: Options)=>{
        try {
            //resetting the state...
            setData(null);
            setError(null);
            // setIsSuccess(false);
            // setIsError(false);
            // setIsSettled(false);

            // setIsPending(true);

            setApiState('pending');

            const response = await mutation(values);
            
            setApiState('success'); 
            
            options?.onSuccess?.(response);  //Passing the response as param to onSuccess.
            return response;
        } catch(error) {
            setApiState('error');
            options?.onError?.(error as Error);
            
            //Only if, in option we getting throwError, then only we throw the error... 
            // --> Can be handled with try-catch block where we will calling this method...
            if(options?.throwError) {
                throw error;
            }
        } finally {
            // setIsPending(false);
            // setIsSettled(true);
            setApiState('settled');
            options?.onSettled?.();
        }
    }, [mutation]);

    return {
        mutate,
        data,
        apiState,
        isPending,
        isSuccess,
        isError,
        isSettled,
        error
    }
}