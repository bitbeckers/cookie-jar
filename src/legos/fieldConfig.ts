import { CoreFieldLookup } from "@daohaus/form-builder";
import { FieldLegoBase, FormLegoBase } from "@daohaus/utils";

import { CSTextarea } from "../components/customFields/csTextArea";

export const AppFieldLookup = {
  ...CoreFieldLookup,
  cstextarea: CSTextarea,
};

export type CustomFieldLego = FieldLegoBase<typeof AppFieldLookup>;
export type CustomFormLego = FormLegoBase<typeof AppFieldLookup>;
