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
  })
});
 
export default schema;