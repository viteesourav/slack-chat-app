import { useQueryState } from "nuqs";

// The state tracks the parentMessageId Query params in url..
//http://localhost:3000/parentMessageId=[whatever the below state holds]
export const useParentMessageId = () => {
  return useQueryState("parentMessageId");
};
