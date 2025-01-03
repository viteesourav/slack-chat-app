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
});
 
export default schema;