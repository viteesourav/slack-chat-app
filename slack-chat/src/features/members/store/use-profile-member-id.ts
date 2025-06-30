import { useQueryState } from "nuqs";

// The state tracks the profileMemberId Query params in url..
//http://localhost:3000/profileMemberId=[whatever the below state holds]
export const useProfileMemberId = () => {
  return useQueryState("profileMemberId");
};
