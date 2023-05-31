
import { MintForm } from "../components/MintForm";
import { useDHConnect } from "@daohaus/connect";
import { SingleColumnLayout } from "@daohaus/ui";
import { NFTImage } from "../components/NFTImage";

export type FormStates = "idle" | "loading" | "success" | "error";

export const CreateNFTJar = () => {
    const { provider, chainId, address } = useDHConnect();

  return (
    <>
      <SingleColumnLayout>
        <NFTImage tokenId={"1"} />
        <MintForm />
      </SingleColumnLayout>
    </>
  );
};


