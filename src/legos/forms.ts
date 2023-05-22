
import { CustomFormLego } from "./fieldConfig";
import { APP_FIELD } from "./fields";
import { APP_TX } from "./tx";
import { TXLego } from "@daohaus/utils";


export const APP_FORM: Record<string, CustomFormLego> = {

  CREATEJAR: {
    id: "CREATEJAR",
    title: "Mint Jar (coming soon)",
    subtitle: "Own the utility",
    description: "A cookie jar is a jar that holds cookies.",
    requiredFields: { title: true },
    log: true,
    tx: APP_TX.CREATENFTJAR as TXLego,
    fields: [
      APP_FIELD.RECEIVER,
      APP_FIELD.COOKIE_PERIOD,
      APP_FIELD.COOKIE_TOKEN,
      APP_FIELD.COOKIE_AMOUNT,
      {...APP_FIELD.CSTEXTAREA, id:'allowList', label: 'Allow List'},
    ],
  },
  
};
