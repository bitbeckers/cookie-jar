import styled from "styled-components";

import { H2, H3, ParMd, SingleColumnLayout } from "@daohaus/ui";
import { HausAnimated } from "../components/HausAnimated";

import { JarCard } from "../components/JarCard";
import { StyledRouterLink } from "../components/Layout";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../utils/indexer";

const LinkBox = styled.div`
  display: flex;
  width: 50%;
  justify-content: center;
`;

export const Jars = () => {
  const cookieJars = useLiveQuery(() => db.cookieJars.toArray());

  return (
    <SingleColumnLayout>
      <H2>Jars</H2>

      {!cookieJars && <HausAnimated />}

      {cookieJars && cookieJars.length === 0 && (
        <>
          <H3 style={{ marginBottom: "2.4rem" }}>No Jars found</H3>
          <ParMd style={{ marginBottom: "2.4rem" }}>
            No Jars found on this network. Create a new one!
          </ParMd>

          <LinkBox>
            <StyledRouterLink to="/create">Create New</StyledRouterLink>
          </LinkBox>
        </>
      )}

      {cookieJars && cookieJars.length > 0 && (
        <>
          {cookieJars.map((jar) => (
            <JarCard record={jar} key={jar.jarUid} />
          ))}

          <LinkBox>
            <StyledRouterLink to="/create">Create New</StyledRouterLink>
          </LinkBox>
        </>
      )}
    </SingleColumnLayout>
  );
};
