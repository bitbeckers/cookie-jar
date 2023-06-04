import { MintForm } from "../components/MintForm";
import { useDHConnect } from "@daohaus/connect";
import { SingleColumnLayout } from "@daohaus/ui";
import { NFTImage } from "../components/NFTImage";
import { useCookieNFT } from "../hooks/useCookieJarNFT";
import { useTargets } from "../hooks/useTargets";

export type FormStates = "idle" | "loading" | "success" | "error";

export const CreateNFTJar = () => {
  const { chainId, address } = useDHConnect();
  const target = useTargets();

  console.log("target", target);
  const { totalSupply } = useCookieNFT({
    nftAddress: target?.LIST_COOKIEJAR_6551_ADDRESS,
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
