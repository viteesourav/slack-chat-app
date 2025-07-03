import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
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

// Handles updating a particular member...
export const update = mutation({
  args: {
    id: v.id("members"),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    //fetch curr Loggedin user..
    const userId = await getAuthUserId(ctx);

    //if the no userId found..
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db.get(args.id);

    if (!member) {
      throw new Error("Membe not found");
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", member.workspaceId)
      )
      .unique();

    // If the loggedIn user doesn't exist as memeber or is not admin -> throw unAuthorized.
    if (!currentMember || currentMember.role !== "admin") {
      throw new Error("Unauthorized");
    }

    // update the role of the user...
    await ctx.db.patch(args.id, {
      role: args.role,
    });

    return args.id; // id of the member whose role we are upgrading..
  },
});

// Handles removing a particular member...
export const remove = mutation({
  args: {
    id: v.id("members"),
  },
  handler: async (ctx, args) => {
    //fetch curr Loggedin user..
    const userId = await getAuthUserId(ctx);

    //if the no userId found..
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const member = await ctx.db.get(args.id);

    if (!member) {
      throw new Error("Membe not found");
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", member.workspaceId)
      )
      .unique();

    // If the loggedIn user doesn't exist as memeber -> throw unAuthorized.
    if (!currentMember) {
      throw new Error("Unauthorized");
    }

    // cannot remove an admin member...
    if (member.role === "admin") {
      throw new Error("Admin cannot be removed");
    }

    // If your removing self and you are admin -> you cannot do that
    if (currentMember._id === args.id && currentMember.role === "admin") {
      throw new Error("Cannot remove yourself, You are an Admin");
    }

    // we need to remove all messages,reactions and conversations this member has created..
    const [messages, reactions, conversations] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("reactions")
        .withIndex("by_member_id", (q) => q.eq("memberId", member._id))
        .collect(),
      ctx.db
        .query("conversations")
        .filter((q) =>
          q.or(
            q.eq(q.field("memberOneId"), member._id),
            q.eq(q.field("memberTwoId"), member._id)
          )
        )
        .collect(),
    ]);

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    for (const react of reactions) {
      await ctx.db.delete(react._id);
    }

    for (const chat of conversations) {
      await ctx.db.delete(chat._id);
    }

    // update the role of the user...
    await ctx.db.delete(args.id);

    return args.id; // id of the member whose role we are upgrading..
  },
});
