import { FieldValues } from "react-hook-form";
import { FormBuilder } from "@daohaus/form-builder";

import COOKIEJARTARGET_ABI from "../abis/cookieJarTarget.json";
import COOKIEJAR_CORE_ABI from "../abis/CookieJarCore.json";

import { APP_FORM } from "../legos/forms";
import { AppFieldLookup } from "../legos/fieldConfig";
import { useDHConnect } from "@daohaus/connect";
import { useMemo, useState } from "react";
import {
  ZERO_ADDRESS,
  encodeFunction,
  handleErrorMessage,
} from "@daohaus/utils";
import { useParams } from "react-router-dom";
import { useCookieJar } from "../hooks/useCookieJar";
import { useTxBuilder } from "@daohaus/tx-builder";
import { useToast } from "@daohaus/ui";
import { StatusMsg } from "./ClaimForm";
import { useTargets } from "../hooks/useTargets";

export type SummonStates = "idle" | "loading" | "success" | "error";

export const ConfigForm = () => {
  const { cookieJarId } = useParams();
  const { address } = useDHConnect();
  const { fireTransaction } = useTxBuilder();
  const target = useTargets();

  const [txHash, setTxHash] = useState<string>("");

  const { errorToast } = useToast();
  const [isLoading2, setIsLoading] = useState(false);
  const [status, setStatus] = useState<null | StatusMsg>(null);

  if (!target) return null;

  const { cookieJar, data } = useCookieJar({
    cookieJarId: cookieJarId,
  });

  console.log("***************", data);

  const defaultFields = useMemo(() => {
    if (address) {
      return {
        currentUser: address,
        target: data?.target,
        cookieToken: ZERO_ADDRESS,
        cookieAddress: cookieJar?.address,
      };
    }
  }, [address, cookieJar, data]);

  if (!address || !data?.target) return null;

  const handleSubmit = async (formValues: FieldValues) => {
    console.log(
      "*****----------**********",
      formValues.cookiePeriod,
      formValues.cookieAmount,
      formValues.cookieToken
    );

    // setConfig
    const encodedFunction = encodeFunction(COOKIEJAR_CORE_ABI, "setConfig", [
      formValues.cookiePeriod,
      formValues.cookieAmount,
      formValues.cookieToken,
    ]);

    console.log("encoded function", encodedFunction);

    const executed = await fireTransaction({
      tx: {
        id: "COOKIEJARTARGET",
        contract: {
          type: "static",
          contractName: "COOKIEJARTARGET",
          abi: COOKIEJARTARGET_ABI,
          targetAddress: formValues.target,
        },
        method: "executeCall",
        args: [
          { type: "static", value: formValues.cookieAddress },
          { type: "static", value: 0 },
          { type: "static", value: encodedFunction },
        ],
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
        },
      },
    });
    console.log("executed", executed);

    // if (executed === undefined) {
    //   // setStatus
    //   return;
    // }
    return executed;
  };

  return (
    <>
      <FormBuilder
        form={APP_FORM.CONFIGJAR}
        targetNetwork={target.CHAIN_ID}
        customFields={AppFieldLookup}
        defaultValues={defaultFields}
        onSubmit={(formValues) => {
          handleSubmit(formValues);
        }}
      />
    </>
  );
};
