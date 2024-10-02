import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const current = query({
    args: {},
    handler: async (ctx) => {
       //fetch the loggedin userId details... 
        const userId = await getAuthUserId(ctx);

       //If userId doesnot exist...
       if(userId === null) {
        return null;
       }

       return await ctx.db.get(userId);
    }
})