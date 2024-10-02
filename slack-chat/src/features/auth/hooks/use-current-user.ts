//A custom hook to bring details of the current loggedin User...

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

export const useCurrentUser = () => {

    //fetch the current userDetails using api --> look for the file --> Call the exported method.
    const userDetails = useQuery(api.users.current);

    const isLoading = userDetails === undefined; //When data is loading, it will be undefined..

    return { userDetails, isLoading };

}