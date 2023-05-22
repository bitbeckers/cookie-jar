import { FieldValues } from "react-hook-form";
import { FormBuilder } from "@daohaus/form-builder";

import COOKIEJARTARGET_ABI from "../abis/cookieJarTarget.json";


import { APP_FORM } from "../legos/forms";
import { TARGET_DAO } from "../targetDao";
import { AppFieldLookup } from "../legos/fieldConfig";
import { useDHConnect } from "@daohaus/connect";
import { useMemo, useState } from "react";
import { ReactSetter, ZERO_ADDRESS, encodeValues, handleErrorMessage, isString } from "@daohaus/utils";
import { useParams } from "react-router-dom";
import { useCookieJar } from "../hooks/useCookieJar";
import { APP_CONTRACT } from "../legos/contract";
import { useTxBuilder } from "@daohaus/tx-builder";
import { useToast } from "@daohaus/ui";
import { StatusMsg } from "./ClaimButton";

export type SummonStates = "idle" | "loading" | "success" | "error";


export const ConfigForm = () => {

  const { cookieAddress, cookieChain } = useParams();
  const { address } = useDHConnect();
  const { fireTransaction } = useTxBuilder();

  const [summonState, setSummonState] = useState<SummonStates>("idle");
  const [txHash, setTxHash] = useState<string>("");
  const [daoAddress, setDaoAddress] = useState<string>("");
  const [errMsg, setErrMsg] = useState<string>("");

  const { defaultToast, errorToast, successToast } = useToast();
  const [isLoading2, setIsLoading] = useState(false);
  const [status, setStatus] = useState<null | StatusMsg>(null);


  const { isIdle, isLoading, error, data, hasClaimed, canClaim, refetch } =
    useCookieJar({
      cookieJarAddress: cookieAddress,
      userAddress: address,
      chainId: TARGET_DAO.CHAIN_ID, // todo: use cookieChain
    });

    console.log('***************', data);

    const defaultFields = useMemo(() => {
      if (address) {
        return {
          currentUser: address,
          targetSafe: data?.targetSafe,
          cookieToken: ZERO_ADDRESS,
          cookieAddress: cookieAddress,
        };
      }
    }, [address, cookieAddress, data]);
  
    if (!address || !data?.targetSafe) return null;

    const handleSubmit = async (formValues: FieldValues) => {
      console.log('********************))))))*************');
      
      // setConfig
      const encoded = encodeValues(
        ['uint256', 'uint256', 'address'],
        [formValues.periodLength, formValues.cookieAmount, formValues.cookieToken]
      );

      // if (isString(encoded)) {
      //   return encoded;
      // }
      
      

      const executed = await fireTransaction({
        tx: {
          id: "COOKIEJARTARGET",
          contract: {
            type: "static",
            contractName: "COOKIEJARTARGET",
            abi: COOKIEJARTARGET_ABI,
            targetAddress: formValues.targetSafe,
          },
          method: "executeCall",
          args: [
            {type: "static", value: formValues.cookieAddress},
            {type: "static", value: 0},
            {type: "static", value: encoded},
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

            
            }
          },
        }
      );
      console.log('executed', executed);
      
      // if (executed === undefined) {
      //   // setStatus
      //   return;
      // }
      return executed;
    }
    

  return (
    <>

        <FormBuilder
          form={APP_FORM.CONFIGJAR}
          targetNetwork={TARGET_DAO.CHAIN_ID}
          customFields={AppFieldLookup}
          defaultValues={defaultFields}
          onSubmit={(formValues) => {
            handleSubmit(formValues);
          }}
        />

    </>
  );
};


