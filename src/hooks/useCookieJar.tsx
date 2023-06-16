import { useQuery } from "react-query";

import { createContract } from "@daohaus/tx-builder";
import { ValidNetwork, Keychain } from "@daohaus/keychain-utils";
import { nowInSeconds } from "@daohaus/utils";

import CookieJarAbi from "../abis/CookieJarCore.json";
import { CookieJar } from "../utils/cookieJarHandlers";
import { useEffect, useMemo, useState } from "react";
import { useIndexer } from "./useIndexer";
import { useDHConnect } from "@daohaus/connect";
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
  const cookieContract = createContract({
    address: cookieJarAddress,
    abi: CookieJarAbi,
    chainId,
    rpcs,
  });

  try {
    const lastClaimed = await cookieContract.claims(userAddress); // get last claimed timestamp for user
    const claimAmt = await cookieContract.cookieAmount(); // get amount of cookie token to claim
    const claimPeriod = await cookieContract.periodLength(); // get the period length for claims
    const cookieToken = await cookieContract.cookieToken(); // get the cookie token address

    const target = await cookieContract.owner(); // get the target safe address
    const canClaim = await cookieContract.canClaim(userAddress); // todo: check if user is on isAllowList(userAddress)

    return {
      lastClaimed: lastClaimed.toString() as string,
      claimAmt: claimAmt.toString() as string,
      claimPeriod: claimPeriod.toString() as string,
      cookieToken: cookieToken.toString() as string,
      target: target.toString() as string,
      canClaim: canClaim as boolean,
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
  const { address, chainId, isConnected } = useDHConnect();

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
  // const isMember = data?.canClaim;

  // return user claim data along with helper variables and the query status
  return {
    cookieJar,
    data,
    hasClaimed,
    canClaim,
    // isMember,
    ...rest,
  };
};
