import { useMutation } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { useCallback, useMemo, useState } from "react";
import { Id } from "../../../../convex/_generated/dataModel";

type RequestType = {
    body: string,
    image?: Id<"_storage">,
    workspaceId: Id<"workSpaces">,
    channelId?: Id<"channels">,
    parentMessageId?: Id<"messages">,
    //TODO: add conversationalId

};  //input Props
type ResponseType = Id<"messages"> | null; // messageId resp 

// resp status Options type
type Options = {
    onSuccess?: (data: ResponseType) => void;
    onError?: (error: Error) => void;
    onSettled?: () => void;
    throwError?: boolean;
};

// handles new message API services.
export const useCreateMessage = () => {

    const[data, setData] = useState<ResponseType>(null);
    const[error, setError] = useState<Error | null>(null);

    // initial Api state -> null
    const[apiState, setApiState] = useState<"pending" | "success" | "error" | "settled" | null>(null);

    //watch API state, update apiStatus
    const isPending = useMemo(() => apiState === "pending", [apiState]);
    const isSuccess = useMemo(() => apiState === "success", [apiState]);
    const isError = useMemo(() => apiState === "error", [apiState]);
    const isSettled = useMemo(() => apiState === "settled", [apiState]);
    
    const mutation = useMutation(api.messages.create); 

    const mutate = useCallback(async (values:RequestType, options?: Options)=>{
        try {
           
            setData(null);
            setError(null);

            setApiState('pending');

            const response = await mutation(values);
            
            setApiState('success'); 
            
            options?.onSuccess?.(response); 
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