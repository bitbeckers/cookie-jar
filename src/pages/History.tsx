import {
  BiColumnLayout,
  Card,
  ParMd,
  SingleColumnLayout,
  widthQuery,
} from "@daohaus/ui";

import { HistoryCard } from "../components/HistoryCard";
import { LeaderBoardCard } from "../components/LeaderBoardCard";
import { useParams } from "react-router-dom";
import { useIndexer } from "../hooks/useIndexer";
import { useMemo } from "react";
import { groupBy } from "lodash";
import { useQuery } from "react-query";
import { BigNumber } from "ethers";
import styled from "styled-components";
import { StyledRouterLink } from "../components/Layout";

const CardContainer = styled(Card)`
  padding: 3rem;
  width: 100%;
  border: none;
  margin-bottom: 3rem;
  @media ${widthQuery.lg} {
    max-width: 100%;
    min-width: 0;
  }
`;

export const History = () => {
  const { cookieJarId } = useParams();
  const { getCookiesByJarId } = useIndexer();

  const { data: cookies, isLoading } = useQuery({
    queryKey: ["cookies", cookieJarId],
    queryFn: () => getCookiesByJarId(cookieJarId || ""),
    enabled: !!cookieJarId,
    refetchInterval: 3000,
  });

  const leaderBoardCards = useMemo(() => {
    if (!cookies) return [];

    const groupedCookies = groupBy(cookies, "cookieMonster");

    const leaderboard = Object.entries(groupedCookies)
      .map(([monster, monsterCookies]) => ({
        user: monster,
        count: monsterCookies.reduce(
          (acc, cookie) => acc.add(cookie.amount || "0"),
          BigNumber.from(0)
        ),
      }))
      .sort((a, b) => (b.count.lt(a.count) ? -1 : 1));
    console.log("Leaderboard", leaderboard);

    return leaderboard.map((record, idx) => (
      <LeaderBoardCard record={record} key={idx} />
    ));
  }, [cookies, isLoading]);

  console.log({ cookies });

  return (
    <SingleColumnLayout>
      {!cookies && <ParMd style={{ marginBottom: "1rem" }}>Loading...</ParMd>}

      <BiColumnLayout
        left={
          <SingleColumnLayout>
            <ParMd style={{ marginBottom: "1rem" }}>
              History (newer first)
            </ParMd>
            <CardContainer>
              {cookies &&
                cookies.map((record, idx) => (
                  <HistoryCard record={record} key={idx} />
                ))}
            </CardContainer>
          </SingleColumnLayout>
        }
        right={
          <SingleColumnLayout>
            <ParMd style={{ marginBottom: "1rem" }}>Leader Board</ParMd>
            <CardContainer>{leaderBoardCards}</CardContainer>
          </SingleColumnLayout>
        }
        subtitle={
          cookies && cookies.length === 0
            ? "No cookie history yet."
            : "Your dashboard for information about your cookie jar"
        }
        title="History and Stats"
      />
      <StyledRouterLink to={`/claims/${cookieJarId || ""}`}>
        New Claim
      </StyledRouterLink>
    </SingleColumnLayout>
  );
};
