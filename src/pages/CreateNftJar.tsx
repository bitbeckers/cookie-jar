
import { MintForm } from "../components/MintForm";
import { useDHConnect } from "@daohaus/connect";
import { SingleColumnLayout } from "@daohaus/ui";
import { useState } from "react";

export type FormStates = "idle" | "loading" | "success" | "error";

export const CreateNFTJar = () => {
    const { provider, chainId } = useDHConnect();

    const [formState, setFormState] = useState<FormStates>("idle");
    const [txHash, setTxHash] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [errMsg, setErrMsg] = useState<string>("");
  return (
    <>
      <SingleColumnLayout>
        <MintForm 
        setFormState={setFormState}
        setTxHash={setTxHash}
        setAddress={setAddress}
        setErrMsg={setErrMsg}
        />
      </SingleColumnLayout>
    </>
  );
};


