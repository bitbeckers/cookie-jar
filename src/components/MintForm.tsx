import React, { useMemo, useState } from "react";

import { FormBuilder, StatusMsg } from "@daohaus/form-builder";

import { APP_FORM } from "../legos/forms";
import { AppFieldLookup } from "../legos/fieldConfig";
import { useDHConnect } from "@daohaus/connect";
import { ZERO_ADDRESS } from "@daohaus/utils";
import { SuccessText } from "@daohaus/ui";
import { useTargets } from "../hooks/useTargets";
import {
  TransactionReceipt,
  getEventSelector,
  hexToBigInt,
} from "viem";

type Minted = {
  account: string;
  cookieJar: string;
  tokenId: bigint;
};

export const MintForm = () => {
  const { address } = useDHConnect();
  const target = useTargets();
  const [txStatus, setTxStatus] = useState<StatusMsg | null>(null);
  const [minted, setMinted] = useState<Minted | null>(null);

  const defaultFields = useMemo(() => {
    if (address) {
      return {
        receiver: address,
        cookieToken: ZERO_ADDRESS,
        donationToken: ZERO_ADDRESS,
        proposalOffering: "0",
      };
    }
  }, [address]);

  if (!address) return null;

  const onSuccess = async (txReceipt: TransactionReceipt) => {
    const abi = [
      "event AccountCreated(address account, address indexed cookieJar, uint256 indexed tokenId)",
    ];

    const selector = getEventSelector(
      "AccountCreated(address account, address indexed cookieJar, uint256 indexed tokenId)"
    );

    const log = txReceipt.logs?.find((log) => log.topics[0] === selector);

    if (!log) return;

    setMinted({
      account: log.topics[1] || "Account not found",
      cookieJar: log.topics[2] || "CookieJar implementation not found",
      tokenId: hexToBigInt(log.data),
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
          },
          onTxSuccess: (args) => {
            setTxStatus(StatusMsg.TxSuccess);
            onSuccess?.(args);
          },
        }}
      />
      {txStatus == StatusMsg.TxSuccess && (
        <SuccessText>
          This is a Success!
          <br />
          Your tokenId is {minted?.tokenId.toString()}
          <br />
          Your cookieJar is {minted?.cookieJar}
          <br />
          Your account is (send funds to) {minted?.account}
        </SuccessText>
      )}
    </>
  );
};
