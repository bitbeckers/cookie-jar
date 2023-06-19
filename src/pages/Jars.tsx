import styled from "styled-components";

import { H2, H3, ParMd, SingleColumnLayout } from "@daohaus/ui";
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

      {!data && isLoading && <HausAnimated />}

      {!data && !isLoading && (
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

      {data &&
        !isLoading &&
        data.length > 0 &&
        data.map((jar) => <JarCard record={jar} key={jar.id} />)}
    </SingleColumnLayout>
  );
};
