import { CoreFieldLookup } from "@daohaus/form-builder";
import { FieldLegoBase, FormLegoBase } from "@daohaus/utils";

import { CSTextarea } from "../components/customFields/csTextArea";
import { PeriodLength } from "../components/customFields/periodLength";
import { MolochFields } from "@daohaus/moloch-v3-fields";

export const AppFieldLookup = {
  ...MolochFields,
  periodLength: PeriodLength,
  cstextarea: CSTextarea,
};

export type CustomFieldLego = FieldLegoBase<typeof AppFieldLookup>;
export type CustomFormLego = FormLegoBase<typeof AppFieldLookup>;
