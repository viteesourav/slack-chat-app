import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Returns all possible workspaces from db...
//need to fetch all the workspace, where he is a member of...
export const getAllWorkspaces = query({
    args: {},
    handler: async (ctx) => {

        const userId = await getAuthUserId(ctx);

        if(!userId) {
            return [];  //no userId --> Return empty List of workspaces..
        }

        //find all members where this user is a part-of...
        const members = await ctx.db.query('members')
                                    .withIndex('by_user_id', q => q.eq("userId", userId))
                                    .collect();

        //Now get all the workspaceIds and then fetch details of each one of them...
        const workspaceIdList = members.map(member => member.workspaceId);

        const workspaceList = [];
        for(const id of workspaceIdList) {
            const workspaceData = await ctx.db.get(id);
            if(workspaceData) {
                workspaceList.push(workspaceData);
            }
        }

        return workspaceList;
    }
})

//Logic to generate random alpha-numeric JoinCode...
//we are generating 6 random digits, --> generating random arr indexes, 
//eg of using .from method to generate all elements of array as 0: Arrays.from({length:6}, ( ) => 0) -> [0, 0, 0, 0, 0, 0]
const generateCode = () => {
    return Array.from(
        {length:6}, () => (
            "0123456789abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random()*36)]
        )
    ).join('');
}

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
        const joinCode = generateCode();

        // this returns a new Id, that we will return when we create a new workspace...
        const workspaceId =  await ctx.db.insert('workSpaces', {
            name: args.name,
            userId,
            joinCode,
        })

        //Once workspace is created, add a record in the member table --> role as Admin...
        await ctx.db.insert("members", {
            userId,
            workspaceId,
            role:'admin'
        });

        //once Workspace is created, add a Channel too...
        await ctx.db.insert('channels', {
            name: 'general',
            workspaceId,
        })

        return workspaceId;
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

        //Check if the current user and workspace Id is present in the members table..
        const member = await ctx.db
            .query('members')
            .withIndex('by_user_id_workspace_id', q => (
                q.eq('userId',userId).eq('workspaceId', args.id) 
            ))
            .unique();

        //If no such members found, return no-workspace-details i.e null.    
        if(!member) {
            return null;
        }

        return await ctx.db.get(args.id); //Fetch Workspace details based on the workspaceId.
    }
})


//Handles updating workspace meta-data i.e from preferences..
export const updateWorkspace = mutation({
    args: {
        id: v.id('workSpaces'),
        name: v.string()
    },
    handler: async (ctx, args) => {

        //check if the current use is present or not ?
        const userId = await getAuthUserId(ctx);
        if(!userId) {
            throw new Error("Unauthorized");
        }

        //Check if the current user and workspace Id is present in the members table..
        const member = await ctx.db
            .query('members')
            .withIndex('by_user_id_workspace_id', q => (
                q.eq('userId',userId).eq('workspaceId', args.id) 
            ))
            .unique();

        //If no such members found or the member found who is not 'admin' --> return null...   
        if(!member || member.role !== 'admin') {
            throw new Error('Unauthorized');
        }

        //update the workspace details... --> updates the name of the workspace..
        await ctx.db.patch(args.id, {
            name: args.name
        })

        return args.id;  //return back the workspaceId..
    }
})


//Handles removing workspace i.e  from preferences..
export const deleteWorkspace = mutation({
    args: {
        id: v.id('workSpaces')
    },
    handler: async (ctx, args) => {

        //check if the current use is present or not ?
        const userId = await getAuthUserId(ctx);
        if(!userId) {
            throw new Error("Unauthorized");
        }

        //Check if the current user and workspace Id is present in the members table..
        const member = await ctx.db
            .query('members')
            .withIndex('by_user_id_workspace_id', q => (
                q.eq('userId',userId).eq('workspaceId', args.id) 
            ))
            .unique();

        //If no such members found or the member found who is not 'admin' --> return null...   
        if(!member || member.role !== 'admin') {
            throw new Error('Unauthorized');
        }
        
        //When a workspace is deleted --> all members associated with that worksapce also needs to go..
        const[members] = await Promise.all([
            ctx.db.query('members')
                .withIndex('by_workspace_id', q => q.eq('workspaceId', args.id))
                .collect(),
        ]);
        
        //iterate the members list and remove them from the 'members' table.
        for(const member of members) {
            await ctx.db.delete(member._id);
        }


        //now remove the workspace...
        await ctx.db.delete(args.id);


        return args.id;  //return back the workspaceId..
    }
})

//Method updates the existing Workspace, Info with a new Join Code...
export const newJoinCode = mutation({
    args: {
        workspaceId: v.id('workSpaces')
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);  //get the current LoggedIn user...

        if(!userId) {
            throw new Error("Unauthorized");
        }

         //Check if the current user and workspace Id is present in the members table..
         const member = await ctx.db
                                .query('members')
                                .withIndex('by_user_id_workspace_id', q => (
                                    q.eq('userId',userId).eq('workspaceId', args.workspaceId) 
                                ))
                                .unique();

        //If no such members found, return no-workspace-details i.e null.    
        if(!member) {
            throw new Error('Unauthorized');
        }

        const joinCode = generateCode();

        await ctx.db.patch(args.workspaceId, {
            joinCode
        });

        return args.workspaceId;
    }
})