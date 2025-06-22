import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  ...authTables,
  // Your other tables...
  workSpaces: defineTable({
    name: v.string(),
    userId: v.id("users"),
    joinCode: v.string()
  }),
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workSpaces"),
    role: v.union(v.literal("admin"), v.literal("member"))
  })
    .index("by_user_id", ["userId"])
    .index("by_workspace_id", ["workspaceId"])
    .index("by_user_id_workspace_id", ["userId","workspaceId"]),
  channels: defineTable({
    name: v.string(),
    workspaceId: v.id("workSpaces")
  })
    .index("by_workspace_id", ["workspaceId"]),
  messages: defineTable({
    body: v.string(),
    image: v.optional(v.id("_storage")),
    memberId: v.id("members"),
    workspaceId: v.id("workSpaces"), // directly to a person, not a part of any channel.
    channelId: v.optional(v.id("channels")),  // not all messages through channels mandatorily
    parentMessageId: v.optional(v.id("messages")), // reply to another message.
    updatedAt: v.number()
    // TODO: Add Convertional Id...
  })
});
 
export default schema;