import { useQuery } from "react-query";

import { ValidNetwork, Keychain } from "@daohaus/keychain-utils";

import { CookieJarCore } from "../abis";
import { CookieJar } from "../utils/cookieJarHandlers";
import { useEffect, useMemo, useState } from "react";
import { useIndexer } from "./useIndexer";
import { useDHConnect } from "@daohaus/connect";
import { createViemClient } from "@daohaus/utils";
import { Abi, getContract } from "viem";

// fetch user cookie claim data from the blockchain
const fetchUserClaim = async ({
  cookieJarAddress,
  userAddress,
  chainId,
  rpcs,
}: {
  cookieJarAddress: string | undefined | null;
  userAddress: string;
  chainId: ValidNetwork | undefined | null;
  rpcs?: Keychain;
}) => {
  if (!cookieJarAddress || !chainId) {
    throw new Error("No cookie jar address provided");
  }

  const client = createViemClient({
    chainId,
    rpcs,
  });

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
      client.readContract({
        ...contract,
        functionName: "lastClaimed",
        args: [userAddress],
      }),
      client.readContract({
        ...contract,
        functionName: "cookieAmount",
      }),
      client.readContract({
        ...contract,
        functionName: "periodLength",
      }),
      client.readContract({
        ...contract,
        functionName: "cookieToken",
      }),
      client.readContract({
        ...contract,
        functionName: "isAllowlist",
        args: [userAddress],
      }),
      client.readContract({
        ...contract,
        functionName: "owner",
      }),
      client.readContract({
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
export const useCookieJar = ({
  cookieJarId,
  rpcs,
}: {
  cookieJarId?: string;
  rpcs?: Keychain;
}) => {
  const { address, chainId } = useDHConnect();

  const { getJarById } = useIndexer();
  const [cookieJar, setCookieJar] = useState<Partial<CookieJar>>();

  const cookieJarAddress = cookieJar?.address;

  // Memoized function to fetch user claim data
  const fetchUserClaimMemoized = useMemo(() => {
    return () =>
      fetchUserClaim({
        cookieJarAddress: cookieJar?.address,
        userAddress: address?.toLowerCase() || "",
        chainId,
        rpcs,
      });
  }, [address, chainId, cookieJar?.address, rpcs]);

  const { data, ...rest } = useQuery(
    ["claimData", { address, cookieJarAddress }],
    fetchUserClaimMemoized,
    { enabled: !!address && !!cookieJarAddress, refetchInterval: 5000 }
  );

  // Memoized function to fetch cookie jar by ID
  const getJarByIdMemoized = useMemo(() => {
    return async () => {
      if (!cookieJarId) return;
      const jars = await getJarById(cookieJarId);

      if (!jars) return;
      setCookieJar(jars[0]);
    };
  }, [cookieJarId, getJarById]);

  useEffect(() => {
    const getCookieJar = async () => {
      if (!cookieJarId) return;
      await getJarByIdMemoized();
    };

    getCookieJar();
  }, [cookieJarId, getJarByIdMemoized]);

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
