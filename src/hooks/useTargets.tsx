import { useDHConnect } from "@daohaus/connect";
import { ethers } from "ethers";
import { TARGETS } from "../targetDao";
export const useTargets = () => {
  // get provider and chainId
  const { provider, chainId } = useDHConnect();

  console.log(process.env.NODE_ENV);

  if (process.env.NODE_ENV === "dev") {
    console.log("Development mode.");
    return TARGETS["development"];
  }

  //check id ChainId is in CHAIN_IDs of TARGETS
  const target = Object.keys(TARGETS).find((t) => t === chainId);

  if (!target) {
    console.warn("Targets for chainId not found.");
    return undefined;
  }

  return TARGETS[chainId as keyof typeof TARGETS];
};
