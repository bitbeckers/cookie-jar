import { useQuery } from "react-query";

import { createContract } from "@daohaus/tx-builder";
import { ValidNetwork, Keychain } from "@daohaus/keychain-utils";

import CookieNftAbi from "../abis/cookieNft.json";
import { ZERO_ADDRESS } from "@daohaus/utils";

// fetch user cookie claim data from the blockchain
const fetchNFT = async ({
  nftAddress,
  userAddress,
  chainId,
  rpcs,
}: {
  nftAddress: string | undefined | null;
  userAddress: string;
  chainId: ValidNetwork | undefined | null;
  rpcs?: Keychain;
}) => {
  if (!nftAddress || !chainId) {
    throw new Error("No cookie jar address provided");
  }
  const nftContract = createContract({
    address: nftAddress,
    abi: CookieNftAbi,
    chainId,
    rpcs,
  });

  // TODO: check if sold out
  // const cap = await nftContract.cap();

  try {
    const filter = nftContract.filters.Transfer(ZERO_ADDRESS, null);
    const events = await nftContract.queryFilter(filter);
    console.log("factory events", events);
    return {
      events,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.message as string);
  }
};

export const useCookieNFT = ({
  nftAddress,
  userAddress,
  chainId,
  rpcs,
}: {
  nftAddress: string | undefined | null;
  userAddress: string | undefined | null;
  chainId: ValidNetwork | undefined | null;
  rpcs?: Keychain;
}) => {
  const { data, ...rest } = useQuery(
    ["nftData", { userAddress }],
    () =>
      fetchNFT({
        nftAddress,
        userAddress: userAddress as string,
        chainId,
        rpcs,
      }),
    { enabled: !!userAddress }
  );

  const totalSupply = data?.events.length;

  return {
    data,
    totalSupply,
    ...rest,
  };
};
