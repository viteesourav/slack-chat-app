import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

//Fetch function to get the channels..
export const get = query({
  args: {
    workspaceId: v.id("workSpaces"),
  },
  handler: async (ctx, args) => {
    //2 pre-Checks --> userId must be authentiated and that user must have a workspace associated with him in member table.

    //check if the current use is present or not ?
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    //check if members are not null...
    if (!members) {
      return [];
    }

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_workspace_id", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .collect();

    return channels;
  },
});

//Fetch function to get the channels..
export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id("workSpaces"),
  },
  handler: async (ctx, args) => {
    //check if the current use is present or not ?
    const userId = await getAuthUserId(ctx);

    //since we are creating, If user not present so throw new error..
    if (!userId) {
      throw new Error("unAuthorized");
    }

    //Check if the guy has atleast one workspace related to him..
    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    //check if members are not null and if present they, if member is not an admin.
    if (!members || members.role !== "admin") {
      throw new Error("unAuthorized");
    }

    //Just a parser that finds any space in the channel name and convert them to '-'
    const parsedName = args.name.replace(/\s+/g, "-").toLowerCase();

    //insert the channel details ...
    const channelId = await ctx.db.insert("channels", {
      name: parsedName,
      workspaceId: args.workspaceId,
    });

    return channelId;
  },
});

//Fetch function to get the channels Details by channelId
export const getById = query({
  args: {
    id: v.id("channels"),
  },
  handler: async (ctx, args) => {
    //check if the current use is present or not ?
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    const channel = await ctx.db.get(args.id);

    if (!channel) {
      return null;
    }

    //Check if this channel's workspace and current user is a part of..
    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", channel.workspaceId)
      )
      .unique();

    if (!members) {
      return null;
    }

    return channel;
  },
});

//Handles updating channel meta-data i.e from preferences..
export const updateChannel = mutation({
  args: {
    id: v.id("channels"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    //check if the current use is present or not ?
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("unAuthorized");
    }

    const channel = await ctx.db.get(args.id);

    if (!channel) {
      throw new Error("Invalid Channel");
    }

    //Check if this channel's workspace and current user is a part of..
    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", channel.workspaceId)
      )
      .unique();

    if (!members) {
      throw new Error("unAuthorized");
    }

    //update the workspace details... --> updates the name of the workspace..
    await ctx.db.patch(args.id, {
      name: args.name,
    });

    return args.id; //return back the workspaceId..
  },
});

//Handles removing channel
export const deleteChannel = mutation({
  args: {
    id: v.id("channels"),
  },
  handler: async (ctx, args) => {
    //check if the current use is present or not ?
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("unAuthorized");
    }

    const channel = await ctx.db.get(args.id);

    if (!channel) {
      throw new Error("Invalid Channel");
    }

    //Check if this channel's workspace and current user is a part of..
    const members = await ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", channel.workspaceId)
      )
      .unique();

    // If a non-Admin member try to delete the channel --> Should be auauthorized..
    if (!members || members.role !== "admin") {
      throw new Error("unAuthorized");
    }

    // Remove associated messages with the current Channel ...
    const [messages] = await Promise.all([
      ctx.db
        .query("messages")
        .withIndex("by_channel_id", (q) => q.eq("channelId", args.id))
        .collect(),
    ]);

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    //now remove the channel...
    await ctx.db.delete(args.id);

    return args.id; //return back the channelId..
  },
});
