import styled from "styled-components";

import {
  Button,
  Card,
  H2,
  H3,
  ParMd,
  SingleColumnLayout,
  Spinner,
  widthQuery,
} from "@daohaus/ui";

import { JarCard } from "../components/JarCard";
import { StyledRouterLink } from "../components/Layout";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../utils/indexer";
import { useDHConnect } from "@daohaus/connect";

const LinkBox = styled.div`
  display: flex;
  width: 50%;
  justify-content: center;
`;

const JarContainer = styled(Card)`
  padding: 3rem;
  width: 100%;
  border: none;
  margin-bottom: 3rem;
  @media ${widthQuery.lg} {
    max-width: 100%;
    min-width: 0;
  }
`;

export const Jars = () => {
  const { chainId } = useDHConnect();
  const cookieJars = useLiveQuery(() =>
    db.cookieJars.where({ chainId: Number(chainId) }).toArray()
  );

  return (
    <SingleColumnLayout>
      <H2>Jars</H2>
      <StyledRouterLink to="/create">
        <Button>Create New 🫙 </Button>
      </StyledRouterLink>

      {!cookieJars && <Spinner />}

      {cookieJars && cookieJars.length === 0 && (
        <>
          <H3 style={{ marginBottom: "2.4rem" }}>No Jars found</H3>
          <ParMd style={{ marginBottom: "2.4rem" }}>
            No Jars found on this network. Create a new one!
          </ParMd>
        </>
      )}

      {cookieJars && cookieJars.length > 0 && (
        <JarContainer>
          {cookieJars.map((jar) => (
            <JarCard record={jar} key={jar.jarUid} />
          ))}
        </JarContainer>
      )}
    </SingleColumnLayout>
  );
};
