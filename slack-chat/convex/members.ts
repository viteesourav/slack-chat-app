import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

//fetch the currentMember based Loggedin User and workspaceId..
export const currentMember = query({
    args: {
        id: v.id("workSpaces")
    },
    handler: async (ctx, args) => {

        //fetch curr Loggedin user..
        const userId = await getAuthUserId(ctx);

        //if the no userId found..
        if(!userId) {
            return null;
        }

        //make a call using the index and fetch the memberDetails..
        //Note: use 'unique' as the loggednInUser and the currentWorkspaceId must return just one row.
        return ctx.db
            .query('members')
            .withIndex('by_user_id_workspace_id', q=>(
                q.eq('userId', userId).eq('workspaceId', args.id)
            ))
            .unique();
    }
});