
import { MintForm } from "../components/MintForm";
import { useDHConnect } from "@daohaus/connect";
import { SingleColumnLayout } from "@daohaus/ui";
import { NFTImage } from "../components/NFTImage";
import { TARGET_DAO } from "../targetDao";
import { useCookieNFT } from "../hooks/useCookieJarNFT";

export type FormStates = "idle" | "loading" | "success" | "error";

export const CreateNFTJar = () => {
    const { provider, chainId, address } = useDHConnect();
    const { data, totalSupply } = useCookieNFT({
        nftAddress: TARGET_DAO.NFT_ADDRESS,
        userAddress: address,
        chainId,
    });
  

  return (
    <>
      <SingleColumnLayout>
        <NFTImage tokenId={((totalSupply || 0) + 1).toString() || "1"} />
        <MintForm />
      </SingleColumnLayout>
    </>
  );
};


