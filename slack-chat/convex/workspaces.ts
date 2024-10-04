import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Returns all possible workspaces from db...
export const getAllWorkspaces = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query('workSpaces').collect();
    }
})

//create new workspace...
export const createWorkspace = mutation({
    args:{
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);  //get the current LoggedIn user...

        if(!userId) {
            throw new Error("Unauthorized");
        }

        //TODO: create a join method to generate joinCode....
        const joinCode = "123456";

        // this returns a new Id, that we will return when we create a new workspace...
        return await ctx.db.insert('workSpaces', {
            name: args.name,
            userId,
            joinCode,
        })
    }
});

//Method to fetch WorkSpace Details by loggedIn User...
export const getById = query({
    args: {
        id: v.id("workSpaces")
    },
    handler: async (ctx, args) => {

        //check if the current use is present or not ?
        const userId = await getAuthUserId(ctx);
        if(!userId) {
            throw new Error("Unauthorized");
        }

        return await ctx.db.get(args.id); //Fetch Workspace details based on the workspaceId.
    }
})