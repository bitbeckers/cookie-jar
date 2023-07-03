import React, { useMemo, useState } from "react";
import { ethers } from "ethers";

import { FormBuilder, StatusMsg } from "@daohaus/form-builder";

import { APP_FORM } from "../legos/forms";
import { AppFieldLookup } from "../legos/fieldConfig";
import { useDHConnect } from "@daohaus/connect";
import { ZERO_ADDRESS } from "@daohaus/utils";
import { TransactionReceipt } from "@ethersproject/abstract-provider";
import { SuccessText } from "@daohaus/ui";
import { useTargets } from "../hooks/useTargets";

type Minted = {
  account: string;
  cookieJar: string;
  tokenId: string;
};

export const MintForm = () => {
  const { address, provider } = useDHConnect();
  const target = useTargets();
  const [txStatus, setTxStatus] = useState<StatusMsg | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [minted, setMinted] = useState<Minted | null>(null);

  const defaultFields = useMemo(() => {
    if (address) {
      return {
        receiver: address,
        cookieToken: ZERO_ADDRESS,
        donationToken: ZERO_ADDRESS,
        donationAmount: "0",
      };
    }
  }, [address]);

  if (!address) return null;

  const onSuccess = async (args: TransactionReceipt) => {
    // TODO: filter account created instead of magic number 10
    const abi = [
      "event AccountCreated(address account, address indexed cookieJar, uint256 indexed tokenId)",
    ];
    const contract = new ethers.Contract(args.to, abi, provider);

    // doesn't work, may need a indexed value
    // const filter = contract.filters.AccountCreated();

    console.log("args", args);
    console.log("log 11", args.logs?.[10]?.topics?.[2]);
    const parsed = contract.interface.parseLog(args.logs?.[10]);
    console.log("parse log 11", parsed);
    setMinted({
      account: parsed.args.account,
      cookieJar: parsed.args.cookieJar,
      tokenId: parsed.args.tokenId.toString(),
    });
  };

  return (
    <>
      <FormBuilder
        form={APP_FORM.CREATEJAR}
        targetNetwork={target?.CHAIN_ID}
        customFields={AppFieldLookup}
        defaultValues={defaultFields}
        lifeCycleFns={{
          onRequestSign: () => {
            setTxStatus(StatusMsg.Request);
          },
          onTxHash: () => {
            setTxStatus(StatusMsg.Await);
          },
          onTxError: () => {
            setTxStatus(StatusMsg.TxErr);
            // onError?.();
            setIsLoading(false);
          },
          onTxSuccess: (args) => {
            setTxStatus(StatusMsg.TxSuccess);
            onSuccess?.(args);
            setIsLoading(false);
          },
        }}
      />
      {txStatus == StatusMsg.TxSuccess && (
        <SuccessText>
          This is a Success!
          <br />
          Your tokenId is {minted?.tokenId}
          <br />
          Your cookieJar is {minted?.cookieJar}
          <br />
          Your account is (send funds to) {minted?.account}
        </SuccessText>
      )}
    </>
  );
};
