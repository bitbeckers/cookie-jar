import { FormBuilder } from "@daohaus/form-builder";


import { APP_FORM } from "../legos/forms";
import { TARGET_DAO } from "../targetDao";
import { AppFieldLookup } from "../legos/fieldConfig";
import { useDHConnect } from "@daohaus/connect";
import { useMemo } from "react";
import { ZERO_ADDRESS } from "@daohaus/utils";


export const ManageForm = () => {
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

  // TODO: override lifecycle methods to add custom logic
  
  return (
    <>

        <FormBuilder
          form={APP_FORM.MANAGEJAR}
          targetNetwork={TARGET_DAO.CHAIN_ID}
          customFields={AppFieldLookup}
          defaultValues={defaultFields}
        />

    </>
  );
};


