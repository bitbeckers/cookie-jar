import { FormBuilder, StatusMsg } from "@daohaus/form-builder";
import { FieldValues } from "react-hook-form";
import { ethers } from 'ethers';

import { APP_FORM } from "../legos/forms";
import { useToast } from "@daohaus/ui";
import { TARGET_DAO } from "../targetDao";
import { useTxBuilder } from "@daohaus/tx-builder";
import { useDHConnect } from "@daohaus/connect";
import { useState } from "react";
import { ReactSetter, handleErrorMessage } from "@daohaus/utils";
import { FormStates } from "../pages/CreateNftJar";
import { CONTRACT } from "@daohaus/moloch-v3-legos";

type FormProps = {
  setFormState: ReactSetter<FormStates>;
  setTxHash: ReactSetter<string>;
  setAddress: ReactSetter<string>;
  setErrMsg: ReactSetter<string>;
};

export const MintForm = ({
  setFormState,
  setTxHash,
  setAddress,
  setErrMsg,
}: FormProps) => {
    const { fireTransaction } = useTxBuilder();
  const { provider, address } = useDHConnect();
  const { defaultToast, errorToast, successToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<null | StatusMsg>(null);

  const handleSubmit = async (formValues: FieldValues) => {
    {
      {
        setIsLoading(true);
        setTxHash("");
        setStatus(StatusMsg.Compile);

        const executed = await fireTransaction({
          tx: {
            id: "",
            contract: CONTRACT.NFT,
            method: "",
            staticArgs: [],
          },
          lifeCycleFns: {
            onRequestSign() {
              setStatus(StatusMsg.Request);
            },
            onTxHash(txHash) {
              setTxHash(txHash);
              setStatus(StatusMsg.Await);
            },
            onTxError(error) {
              setStatus(StatusMsg.TxErr);
              const errMsg = handleErrorMessage({
                error,
                fallback: "Could not decode error message",
              });
              setIsLoading(false);
              errorToast({ title: StatusMsg.TxErr, description: errMsg });
            },
            onTxSuccess(...args) {
              console.log("args", args);

              const tx1 = args[0].logs.find(
                (item) =>
                  item.topics.indexOf(
                    "todo"
                  ) > -1
              );
              const daoHexString = tx1?.topics[1] && tx1.topics[1].indexOf("0x") > -1 ? tx1?.topics[1] : "0x" + tx1?.topics[1];

              const nftAddress = ethers.utils.hexStripZeros(daoHexString);
              setStatus(StatusMsg.TxSuccess);
              if (nftAddress) {
                successToast({
                  title: 'NFT Summoned',
                  description: 'Your NFT has been minted!',
                });
                setFormState('success');
                setAddress(nftAddress);
              }
            },
          },
        });
        if (executed === undefined) {
          setStatus(StatusMsg.NoContext);
          return;
        }
        return executed;
      }
    }
  };
  // set up different pages and routes for these forms
  return (
    <>

        <FormBuilder
          form={APP_FORM.CREATEJAR}
          targetNetwork={TARGET_DAO.CHAIN_ID}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        />

    </>
  );
};


