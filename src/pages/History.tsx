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
import { groupBy } from "lodash";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../utils/indexer";
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

  const cookies = useLiveQuery(
    () => db.cookies.where("jarUid").equals(cookieJarId!).toArray(),
    [cookieJarId]
  );

  const groupedCookies = groupBy(cookies, "cookieMonster");

  const leaderboard = Object.entries(groupedCookies)
    .map(([monster, monsterCookies]) => ({
      user: monster,
      count: monsterCookies.reduce((acc, cookie) => acc + cookie.amount, 0n),
    }))
    .sort((a, b) => (b.count > a.count ? -1 : 1));

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
            <CardContainer>
              {leaderboard.map((record, idx) => (
                <LeaderBoardCard record={record} key={idx} />
              ))}
            </CardContainer>
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
