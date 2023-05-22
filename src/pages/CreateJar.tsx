import { FormBuilder } from "@daohaus/form-builder";
import { MolochFields } from "@daohaus/moloch-v3-fields";

import { APP_FORM } from "../legos/forms";
import { Button, H2, SingleColumnLayout } from "@daohaus/ui";
import { StyledRouterLink } from "../components/Layout";

export const CreateJar = () => {
  // set up different pages and routes for these forms
  return (
    <>
      <SingleColumnLayout>
        <H2>Pick A Jar Type</H2>

        <StyledRouterLink to="/mint"><Button style={{ marginTop: "2rem", marginBottom: "2rem" }}>NFT</Button></StyledRouterLink>
        <Button disabled={true} style={{ marginTop: "2rem", marginBottom: "2rem" }}>ERC20(coming soon)</Button>
        <Button disabled={true} style={{ marginTop: "2rem", marginBottom: "2rem" }}>ERC721(coming soon)</Button>
        <Button disabled={true} style={{ marginTop: "2rem", marginBottom: "2rem" }}>Custom(coming soon)</Button>
      </SingleColumnLayout>
    </>
  );
};

