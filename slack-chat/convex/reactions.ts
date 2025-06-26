import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { mutation, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

//fetch members based on curr workspace and userId.
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

// toggels a reaction on a particular message.
export const toggle = mutation({
  args: {
    messageId: v.id("messages"),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.messageId);

    if (!message) {
      throw new Error("Message not found");
    }

    const member = await getMember(ctx, message.workspaceId, userId);

    if (!member) {
      throw new Error("Member not found");
    }

    // Note: we are not using withIndex() below because it doesn't work well with "value" [emoji]
    const exisitingMessageReactionFromUser = await ctx.db
      .query("reactions")
      .filter((q) =>
        q.and(
          q.eq(q.field("messageId"), args.messageId),
          q.eq(q.field("memberId"), member._id),
          q.eq(q.field("value"), args.value)
        )
      )
      .first();

    // If the reaction exisits delete that..
    if (exisitingMessageReactionFromUser) {
      await ctx.db.delete(exisitingMessageReactionFromUser._id);

      return exisitingMessageReactionFromUser._id;
    } else {
      // reaction doesnot exist, insert it..
      const newReactionId = await ctx.db.insert("reactions", {
        workspaceId: message.workspaceId,
        memberId: member._id,
        messageId: args.messageId,
        value: args.value,
      });

      return newReactionId;
    }
  },
});
