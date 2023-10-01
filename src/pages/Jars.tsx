import styled from "styled-components";

import {
  Card,
  H2,
  H3,
  ParMd,
  SingleColumnLayout,
  Spinner,
  widthQuery,
} from "@daohaus/ui";
import { HausAnimated } from "../components/HausAnimated";

import { JarCard } from "../components/JarCard";
import { useIndexer } from "../hooks/useIndexer";
import { useQuery } from "react-query";
import { useDHConnect } from "@daohaus/connect";
import { StyledRouterLink } from "../components/Layout";

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
  const { getJars } = useIndexer();

  const { data, isLoading } = useQuery({
    queryKey: "jars",
    queryFn: () => getJars(),
    refetchInterval: 5000,
  });

  return (
    <SingleColumnLayout>
      <H2>Jars</H2>
      <LinkBox>
        <StyledRouterLink to="/create">Create New 🫙</StyledRouterLink>
      </LinkBox>

      {(!data || isLoading) && <Spinner />}

      {(!isLoading && !data) ||
        (data && data.length == 0 && (
          <>
            <H3 style={{ marginBottom: "2.4rem" }}>No Jars found</H3>
            <ParMd style={{ marginBottom: "2.4rem" }}>
              No Jars found on this network. Create a new one!
            </ParMd>
          </>
        ))}

      {data && !isLoading && data.length > 0 && (
        <JarContainer>
          {data.map((jar) => (
            <JarCard record={jar} key={jar.id} />
          ))}
        </JarContainer>
      )}
    </SingleColumnLayout>
  );
};
