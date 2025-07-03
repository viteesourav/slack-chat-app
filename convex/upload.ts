import { mutation } from "./_generated/server";

// Returns url for the uploaded items from convex storage -> we store images there..
export const generateUploadUrl = mutation((ctx) => {
    return ctx.storage.generateUploadUrl();
})