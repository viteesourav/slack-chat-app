import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// If 2 users already have a conversatione -> fetch it or create a new conversation
export const createOrGet = mutation({
  args: {
    memberId: v.id("members"),
    workspaceId: v.id("workSpaces"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // current loggedin Member for that workspace.
    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_user_id_workspace_id", (q) =>
        q.eq("userId", userId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    // member with whom we are trying to have conversation...
    const otherMember = await ctx.db.get(args.memberId);

    if (!currentMember || !otherMember) {
      throw new Error("Member not found");
    }

    //If converstaion already exist.. [ we dont know who started the conversation -> so both checks needed while filtering]
    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("memberOneId"), currentMember._id),
            q.eq(q.field("memberTwoId"), otherMember._id)
          ),
          q.and(
            q.eq(q.field("memberOneId"), otherMember._id),
            q.eq(q.field("memberTwoId"), currentMember._id)
          )
        )
      )
      .unique();

    if (existingConversation) {
      return existingConversation._id;
    }

    //If conversation not exists --> Create a new one
    const conversationId = await ctx.db.insert("conversations", {
      workspaceId: args.workspaceId,
      memberOneId: currentMember._id,
      memberTwoId: otherMember._id,
    });

    return conversationId;
  },
});
