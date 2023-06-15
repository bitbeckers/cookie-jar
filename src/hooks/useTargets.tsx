import { useDHConnect } from "@daohaus/connect";
import { TARGETS } from "../targetDao";
export const useTargets = () => {
  const { chainId } = useDHConnect();

  if (process.env.NODE_ENV === "development") {
    return TARGETS["development"];
  }

  const target = Object.keys(TARGETS).find((t) => t === chainId);

  if (!target) {
    console.warn("Targets for chainId not found.");
    return undefined;
  }

  return TARGETS[chainId as keyof typeof TARGETS];
};
