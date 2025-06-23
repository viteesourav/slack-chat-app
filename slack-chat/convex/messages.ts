// Handles all messages operation to Convex...

import { v } from "convex/values";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

//helper-method: to fetch members based on curr workspace and userId.
const getMember = async (
  ctx: QueryCtx,
  workspaceId: Id<"workSpaces">,
  userId: Id<"users">
) => {
  return ctx.db
    .query("members")
    .withIndex("by_user_id_workspace_id", (q) =>
      q.eq("userId", userId).eq("workspaceId", workspaceId)
    )
    .unique();
};

//Handles create message..
export const create = mutation({
  args: {
    body: v.string(),
    image: v.optional(v.id("_storage")),
    workspaceId: v.id("workSpaces"),
    channelId: v.optional(v.id("channels")),
    parentMessageId: v.optional(v.id("messages")),
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx); //get's current user details

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // fetch member details..
    const member = await getMember(ctx, args.workspaceId, userId);

    if (!member) {
      throw new Error("Unauthorized");
    }

    //handle conversations..
    let _converstationId = args.conversationId; // by default, get the conversation id from args

    //Handled Case: If this is a message reply in a 1:1 conversation..
    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new Error("Parent Message Id not found");
      }

      _converstationId = parentMessage.conversationId; //This we found the conversationId from parentMessage.
    }

    //insert the new message in db...
    const messageId = await ctx.db.insert("messages", {
      memberId: member._id,
      body: args.body,
      image: args.image,
      channelId: args.channelId,
      workspaceId: args.workspaceId,
      parentMessageId: args.parentMessageId,
      conversationId: _converstationId,
      updatedAt: Date.now(), // gives epoch time in number
    });

    return messageId;
  },
});
