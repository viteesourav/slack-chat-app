import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

//Fetch function to get the channels..
export const get = query({
    args: {
        workspaceId: v.id('workSpaces')
    },
    handler: async (ctx,args) => {

        //2 pre-Checks --> userId must be authentiated and that user must have a workspace associated with him in member table.

        //check if the current use is present or not ?
        const userId = await getAuthUserId(ctx);
        if(!userId) {
            return [];
        }

        const members = await ctx.db
                                .query('members')
                                .withIndex('by_user_id_workspace_id', q=> q.eq('userId', userId).eq('workspaceId', args.workspaceId))
                                .unique();

        //check if members are not null...
        if(!members) {
            return [];
        }

        const channels = await ctx.db
                                .query('channels')
                                .withIndex('by_workspace_id',q => q.eq('workspaceId', args.workspaceId))
                                .collect();

        return channels;

    }
})