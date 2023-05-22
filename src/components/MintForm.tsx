import { FormBuilder, StatusMsg } from "@daohaus/form-builder";
import { FieldValues } from "react-hook-form";
import { ethers } from 'ethers';
import { CONTRACT_KEYCHAINS, ValidNetwork } from '@daohaus/keychain-utils';

import { APP_FORM } from "../legos/forms";
import { useToast } from "@daohaus/ui";
import { TARGET_DAO } from "../targetDao";
import { AppFieldLookup } from "../legos/fieldConfig";
import { useDHConnect } from "@daohaus/connect";
import { useMemo } from "react";
import { ZERO_ADDRESS } from "@daohaus/utils";


export const MintForm = () => {
  const { address } = useDHConnect();
  

  const defaultFields = useMemo(() => {
    if (address) {
      return {
        receiver: address,
        cookieToken: ZERO_ADDRESS
      };
    }
  }, [address]);

  if (!address) return null;
  
  return (
    <>

        <FormBuilder
          form={APP_FORM.CREATEJAR}
          targetNetwork={TARGET_DAO.CHAIN_ID}
          customFields={AppFieldLookup}
          defaultValues={defaultFields}
        />

    </>
  );
};


