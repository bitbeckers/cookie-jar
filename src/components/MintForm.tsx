import { FormBuilder, StatusMsg } from "@daohaus/form-builder";
import { FieldValues } from "react-hook-form";
import { ethers } from 'ethers';
import { CONTRACT_KEYCHAINS, ValidNetwork } from '@daohaus/keychain-utils';

import { APP_FORM } from "../legos/forms";
import { useToast } from "@daohaus/ui";
import { TARGET_DAO } from "../targetDao";
import { AppFieldLookup } from "../legos/fieldConfig";


export const MintForm = () => {

  
  return (
    <>

        <FormBuilder
          form={APP_FORM.CREATEJAR}
          targetNetwork={TARGET_DAO.CHAIN_ID}
          customFields={AppFieldLookup}
        />

    </>
  );
};


