import { useQuery } from "react-query";
import { useDHConnect } from "@daohaus/connect";

export const usePoster = ({
  userAddress,
  cookieAddress,
}: {
  userAddress: string | undefined | null;
  cookieAddress: string | undefined | null;
}) => {
  const { publicClient } = useDHConnect();

  // event NewPost(address indexed user, string content, string indexed tag);
  const { data, ...rest } = useQuery(
    ["posterData", { cookieAddress }],
    () =>
      publicClient?.getLogs({
        address: "0x000000000000cd17345801aa8147b8d3950260ff",
        event: {
          name: "NewPost",
          inputs: [
            { type: "address", indexed: true, name: "user" },
            { type: "string", indexed: false, name: "content" },
            { type: "string", indexed: true, name: "tag" },
          ],
          type: "event",
        },
        args: {
          user: cookieAddress as `0x${string}`,
        },
      }),
    { enabled: !!userAddress }
  );
  console.log("data", data);

  // Parse the events data and extract the relevant information
  const parsed = data?.map((record: any) => {
    try {
      return JSON.parse(record.args[1]);
    } catch (error) {
      console.log(error);
      return record.args[1];
    }
  });

  // Group the parsed records by user and count the number of records for each user
  const addCount = parsed?.map((record: any) => {
    const count = parsed.filter((parsed) => record.user === parsed.user).length;
    return { user: record.user, count };
  });

  // Sort the addCount array by count and filter out duplicate user entries
  const leaderBoard = addCount
    ?.filter((v, i, a) => a.findIndex((v2) => v2.user === v.user) === i)
    .sort((a, b) => b.count - a.count);

  return {
    records: data,
    parsed: parsed?.reverse(),
    leaderBoard,
    ...rest,
  };
};
