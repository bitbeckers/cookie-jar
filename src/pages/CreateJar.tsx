import { Button, H2, SingleColumnLayout } from "@daohaus/ui";
import { StyledRouterLink } from "../components/Layout";
import styled from "styled-components";

export const CreateJar = () => {
  // set up different pages and routes for these forms
  return (
    <>
      <SingleColumnLayout>
        <H2>Pick A Jar Type</H2>

        <StyledRouterLink to="/mint">
          <Button style={{ marginTop: "2rem", marginBottom: "2rem" }}>
            NFT
          </Button>
        </StyledRouterLink>
        <StyledRouterLink to="/mintZodiac">
          <Button style={{ marginTop: "2rem", marginBottom: "2rem" }}>
            Add to current safe
          </Button>
        </StyledRouterLink>
      </SingleColumnLayout>
    </>
  );
};
