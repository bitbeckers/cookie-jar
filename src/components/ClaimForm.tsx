import { useState } from "react";

import { FormBuilder } from "@daohaus/form-builder";
import { APP_FORM } from "../legos/forms";
import { AppFieldLookup } from "../legos/fieldConfig";
import { ParMd } from "@daohaus/ui";
import { useTargets } from "../hooks/useTargets";

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
  const [txStatus, setTxStatus] = useState<StatusMsg | null>(null);
  const target = useTargets();

  if (!user || !cookieAddress || !target) return null;

  return (
    <>
      <FormBuilder
        form={APP_FORM.JARCLAIM}
        targetNetwork={target.CHAIN_ID}
        defaultValues={{
          receiver: user,
          user: user,
          targetAddress: cookieAddress,
          link: "",
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
          },
          onTxSuccess: () => {
            setTxStatus(StatusMsg.TxSuccess);
            onSuccess?.();
          },
        }}
      />
      <ParMd>{txStatus}</ParMd>
    </>
  );
};
