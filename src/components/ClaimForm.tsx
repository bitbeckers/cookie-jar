import { useState } from "react";

import { Button, ParMd } from "@daohaus/ui";
import { useTxBuilder } from "@daohaus/tx-builder";

import { APP_TX } from "../legos/tx";
import { TARGET_DAO } from "../targetDao";
import { TXLego } from "@daohaus/utils";
import { FormBuilder } from "@daohaus/form-builder";
import { APP_FORM } from "../legos/forms";
import { AppFieldLookup } from "../legos/fieldConfig";

export enum StatusMsg {
  Compile = "Compiling Transaction Data",
  Request = "Requesting Signature",
  Await = "Transaction Submitted",
  TxErr = "Transaction Error",
  TxSuccess = "Transaction Success",
  PollStart = "Syncing TX (Subgraph)",
  PollSuccess = "Success: TX Confirmed!",
  PollError = "Sync Error (Subgraph)",
}

export const ClaimForm = ({
  onError,
  onSuccess,
  user,
  cookieAddress,
}: {
  onError?: () => void;
  onSuccess?: () => void;
  user: string | undefined;
  cookieAddress: string | undefined;
}) => {
  const { fireTransaction } = useTxBuilder();
  const [txStatus, setTxStatus] = useState<StatusMsg | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <FormBuilder
        form={APP_FORM.JARCLAIM}
        targetNetwork={TARGET_DAO.CHAIN_ID}
        defaultValues={{
          receiver: user,
          user: user,
          targetAddress: cookieAddress,
        }}
        customFields={AppFieldLookup}
        lifeCycleFns={{
          onRequestSign: () => {
            setTxStatus(StatusMsg.Request);
          },
          onTxHash: () => {
            setTxStatus(StatusMsg.Await);
          },
          onTxError: () => {
            setTxStatus(StatusMsg.TxErr);
            onError?.();
            setIsLoading(false);
          },
          onTxSuccess: () => {
            setTxStatus(StatusMsg.TxSuccess);
            onSuccess?.();
            setIsLoading(false);
          },
        }}
      />
      <ParMd>{txStatus}</ParMd>
    </>
  );
};
