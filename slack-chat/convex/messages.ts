// Handles all messages operation to Convex...

import { v } from "convex/values";
import { mutation, query, QueryCtx } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Doc, Id } from "./_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

//helper-methods

const populateUser = (ctx: QueryCtx, userId: Id<"users">) => {
  return ctx.db.get(userId);
};

const populateMember = (ctx: QueryCtx, memberId: Id<"members">) => {
  return ctx.db.get(memberId);
};

// This populates reactions for a particualr message.
const populateReactions = (ctx: QueryCtx, messageId: Id<"messages">) => {
  return ctx.db
    .query("reactions")
    .withIndex("by_message_id", (q) => q.eq("messageId", messageId))
    .collect();
};

// This function populate the whole thread including the replies for a particular member
const populateThread = async (ctx: QueryCtx, messageId: Id<"messages">) => {
  //Load all replies of a particular message.
  const messages = await ctx.db
    .query("messages")
    .withIndex("by_parentMessage_id", (q) => q.eq("parentMessageId", messageId))
    .collect();

  // If no replies present, Dont show any reply info..
  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timeStamp: 0,
    };
  }

  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

  //If lastMessage's Member is not present --> display some partial info
  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timeStamp: 0,
    };
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

  // a proper structure for the reply message meta-data..
  return {
    count: messages.length,
    image: lastMessageUser?.image, // shows the user's image.
    timeStamp: lastMessage._creationTime, //shows the last message's timestamp
  };
};

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

//Handles create New message.)
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
    });

    return messageId;
  },
});

//handles update of messages
export const update = mutation({
  args: {
    id: v.id("messages"),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx); //get's current user details

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.id);

    if (!message) {
      throw new Error("Message not found");
    }

    const member = await getMember(ctx, message.workspaceId, userId);

    // checks if the message belong to the current workspace member
    if (!member || member._id !== message.memberId) {
      throw new Error("UnAuthorized");
    }

    // Do a patch update for message...
    await ctx.db.patch(args.id, {
      body: args.body,
      updatedAt: Date.now(),
    });

    return args.id;
  },
});

//handles remove of a messages
export const remove = mutation({
  args: {
    id: v.id("messages"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx); //get's current user details

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const message = await ctx.db.get(args.id);

    if (!message) {
      throw new Error("Message not found");
    }

    const member = await getMember(ctx, message.workspaceId, userId);

    // checks if the message belong to the current workspace member
    if (!member || member._id !== message.memberId) {
      throw new Error("UnAuthorized");
    }

    // Do a patch update for message...
    await ctx.db.delete(args.id);

    return args.id;
  },
});

//Handles fetching messages based on channelId, conversationId, parentMessageId
export const get = query({
  args: {
    channelId: v.optional(v.id("channels")),
    conversationId: v.optional(v.id("conversations")),
    parentMessageId: v.optional(v.id("messages")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("Unauthorized");
    }

    //Handled Case: If this is a message reply in a 1:1 conversation
    let _converstationId = args.conversationId;

    if (!args.conversationId && !args.channelId && args.parentMessageId) {
      const parentMessage = await ctx.db.get(args.parentMessageId);

      if (!parentMessage) {
        throw new Error("Parent Message Id Not Found");
      }

      _converstationId = parentMessage.conversationId;
    }

    const results = ctx.db
      .query("messages")
      .withIndex("by_channel_id_parent_messageId_conversation_id", (q) =>
        q
          .eq("channelId", args.channelId)
          .eq("parentMessageId", args.parentMessageId)
          .eq("conversationId", _converstationId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    //Just result has no information about the member or is it a reply message or anything
    // We will update the result, with member and user detials.
    // NOTE: here, to use async-await inside a map, we wrap it in Promise.all [** IMP **]
    return {
      ...results,
      page: (
        await Promise.all(
          (await results).page.map(async (message) => {
            const member = await populateMember(ctx, message.memberId);
            const user = member ? await populateUser(ctx, member.userId) : null;

            // no user or no member, we cannot show the message.
            if (!member || !user) {
              return null;
            }

            const thread = await populateThread(ctx, message._id);

            //For message, we just store storageId --> we need to generate the url
            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;

            // normalize the reactions, to show count of each emoji and all members who reacted with the same emoji.
            const reactions = await populateReactions(ctx, message._id);
            const reactionsWithCounts = reactions.map((reaction) => {
              return {
                ...reaction,
                count: reactions.filter((r) => r.value === reaction.value)
                  .length,
              };
            });

            // defined a type of reactions we wanted, additionally, we added count and memberIds, -> how many unique reactions we have and who reacted them.
            const dedupedReactions = reactionsWithCounts.reduce(
              (acc, reaction) => {
                const exisitingReaction = acc.find(
                  (r) => r.value === reaction.value
                );
                // reaction already exist in acc --> update the unique memberIds
                if (exisitingReaction) {
                  exisitingReaction.memberIds = Array.from(
                    new Set([...exisitingReaction.memberIds, reaction.memberId])
                  );
                } else {
                  // a new reaction --> push in acc with membersIds including it's own memberId.
                  acc.push({ ...reaction, memberIds: [reaction.memberId] });
                }
                return acc;
              },
              [] as (Doc<"reactions"> & {
                count: number;
                memberIds: Id<"members">[];
              })[]
            );

            const reactionsWithoutMemberIdProperty = dedupedReactions.map(
              ({ memberId, ...rest }) => rest
            );

            // This is the final modified message object that we returrn after modifying all the data
            return {
              ...message,
              image,
              member,
              user,
              reactions: reactionsWithoutMemberIdProperty,
              threadCount: thread.count,
              threadImage: thread.image,
              threadTimestamp: thread.timeStamp,
            };
          })
        )
      ).filter(
        (message): message is NonNullable<typeof message> => message !== null
      ),
    };
  },
});
