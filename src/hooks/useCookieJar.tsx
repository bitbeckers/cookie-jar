import { useQuery } from "react-query";

import { ValidNetwork } from "@daohaus/keychain-utils";

import { CookieJarCore } from "../abis";
import { useIndexer } from "./useIndexer";
import { useDHConnect } from "@daohaus/connect";
import { Abi, PublicClient } from "viem";
import { db } from "../utils/indexer/db";
import { useLiveQuery } from "dexie-react-hooks";

// fetch user cookie claim data from the blockchain
const fetchUserClaim = async ({
  cookieJarAddress,
  userAddress,
  chainId,
  publicClient,
}: {
  cookieJarAddress: string | undefined | null;
  userAddress: string;
  chainId: ValidNetwork | undefined | null;
  publicClient: PublicClient;
}) => {
  if (!cookieJarAddress || !chainId) {
    throw new Error("No cookie jar address provided");
  }

  console.log("FETCHING USER CLAIM");

  const contract = {
    address: cookieJarAddress as `0x${string}`,
    abi: CookieJarCore as Abi,
  };

  try {
    const [
      lastClaimed,
      claimAmt,
      claimPeriod,
      cookieToken,
      isMember,
      target,
      canClaim,
    ] = await Promise.all([
      publicClient.readContract({
        ...contract,
        functionName: "claims",
        args: [userAddress],
      }),
      publicClient.readContract({
        ...contract,
        functionName: "cookieAmount",
      }),
      publicClient.readContract({
        ...contract,
        functionName: "periodLength",
      }),
      publicClient.readContract({
        ...contract,
        functionName: "cookieToken",
      }),
      publicClient.readContract({
        ...contract,
        functionName: "isAllowList",
        args: [userAddress],
      }),
      publicClient.readContract({
        ...contract,
        functionName: "owner",
      }),
      publicClient.readContract({
        ...contract,
        functionName: "canClaim",
        args: [userAddress],
      }),
    ]);

    return {
      lastClaimed: lastClaimed as bigint,
      claimAmt: claimAmt as bigint,
      claimPeriod: claimPeriod as bigint,
      cookieToken: cookieToken as string,
      target: target as string,
      canClaim: canClaim as boolean,
      isMember: isMember as boolean,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.message as string);
  }
};

// custom hook to fetch and return user claim data
export const useCookieJar = ({ cookieJarId }: { cookieJarId: string }) => {
  const { address, chainId } = useDHConnect();
  const { client } = useIndexer();

  const cookieJar = useLiveQuery(() => db.cookieJars.get(cookieJarId));

  console.log("COOKIE JAR", cookieJar);

  const { data, ...rest } = useQuery(
    ["claimData", { address }],
    () =>
      fetchUserClaim({
        cookieJarAddress: cookieJar?.address,
        userAddress: address?.toLowerCase() || "",
        chainId,
        publicClient: client!,
      }),
    {
      enabled: !!address && !!cookieJar && !!chainId && !!client,
      refetchInterval: 5000,
    }
  );

  // determine if user has claimed cookies before
  const hasClaimed = data?.lastClaimed && Number(data.lastClaimed) > 0;
  // determine if user can claim based on last claim time and claim period
  const canClaim = data?.canClaim || !hasClaimed;
  const isMember = data?.canClaim;

  // return user claim data along with helper variables and the query status
  return {
    cookieJar,
    data,
    hasClaimed,
    canClaim,
    isMember,
    ...rest,
  };
};
