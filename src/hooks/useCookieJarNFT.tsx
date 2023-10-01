import { useQuery } from "react-query";

import { ValidNetwork } from "@daohaus/keychain-utils";

import { ZERO_ADDRESS } from "@daohaus/utils";
import { useDHConnect } from "@daohaus/connect";

export const useCookieNFT = ({
  nftAddress,
  userAddress,
  chainId,
}: {
  nftAddress: string | undefined | null;
  userAddress: string | undefined | null;
  chainId: ValidNetwork | undefined | null;
}) => {
  const { publicClient } = useDHConnect();

  if (!nftAddress || !chainId) {
    throw new Error("No cookie jar address provided");
  }

  const { data, ...rest } = useQuery(
    ["nftData", { userAddress }],
    () =>
      publicClient?.getLogs({
        address: nftAddress as `0x${string}`,
        event: {
          name: "Transfer",
          inputs: [
            { type: "address", indexed: true, name: "from" },
            { type: "address", indexed: true, name: "to" },
            { type: "uint256", indexed: false, name: "value" },
          ],
          type: "event",
        },
        args: {
          from: ZERO_ADDRESS as `0x${string}`,
        },
      }),
    { enabled: !!userAddress }
  );

  const totalSupply = data?.length;

  return {
    data,
    totalSupply,
    ...rest,
  };
};
