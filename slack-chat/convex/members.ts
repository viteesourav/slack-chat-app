import { v } from "convex/values";
import { query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

//helper Method --> For data population from other tables...
//NOTE: as we mentioned the id type as of 'users' table --> ctx.db.get(id) --> will directly fetch the details from the users table.
const populateUser = (ctx: QueryCtx, id: Id<"users">) => {
  return ctx.db.get(id);
};

// fetch membe details by id..
export const getById = query({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const member = await ctx.db.get(args.id);

    if (!member) {
      return null;
    }

    // confirm if the current member is a part of member's workspace..
    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", member.workspaceId)
      )
      .unique();

    if (!currentMember) {
      return null;
    }

    //also gets user details for the member.
    const user = await populateUser(ctx, member.userId);

    if (!user) {
      return null;
    }

    return {
      ...member,
      user,
    };
  },
});

//fetch the currentMember based Loggedin User and workspaceId..
export const currentMember = query({
  args: {
    id: v.id("workSpaces"),
  },
  handler: async (ctx, args) => {
    //fetch curr Loggedin user..
    const userId = await getAuthUserId(ctx);

    //if the no userId found..
    if (!userId) {
      return null;
    }

    //make a call using the index and fetch the memberDetails..
    //Note: use 'unique' as the loggednInUser and the currentWorkspaceId must return just one row.
    return ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.id)
      )
      .unique();
  },
});

//Function to fetch all the members for the current workspace..
export const get = query({
  args: {
    workspaceId: v.id("workSpaces"),
  },
  handler: async (ctx, args) => {
    //fetch curr Loggedin user..
    const userId = await getAuthUserId(ctx);

    //if the no userId found..
    if (!userId) {
      return [];
    }

    //check if the user has at least one workspace with him in members table..
    //make a call using the index and fetch the memberDetails..
    //Note: use 'unique' as the loggednInUser and the currentWorkspaceId must return just one row.
    const isMemberPresent = ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!isMemberPresent) {
      return [];
    }

    //make call to fetch all the members related to this workspace..
    const data = await ctx.db
      .query("members")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    // For each members try to fetch it's linked userId details...
    const members = [];

    for (const member of data) {
      const user = await populateUser(ctx, member.userId);

      if (user) {
        members.push({
          ...member,
          user,
        });
      }
    }

    //Returns the members details along with it's respective userDetails..
    return members;
  },
});
