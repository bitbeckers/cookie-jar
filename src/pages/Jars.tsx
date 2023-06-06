import { H2, SingleColumnLayout } from "@daohaus/ui";
import { HausAnimated } from "../components/HausAnimated";

import { JarCard } from "../components/JarCard";
import { useIndexer } from "../hooks/useIndexer";
import { useQuery } from "react-query";

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

      {!data && !isLoading && <H2>No Jars found</H2>}

      {data &&
        data.length > 0 &&
        data.map((jar) => <JarCard record={jar} key={jar.id} />)}
    </SingleColumnLayout>
  );
};
