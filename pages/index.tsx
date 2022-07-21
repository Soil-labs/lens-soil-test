import Head from "next/head";

import { useQuery, gql } from "@apollo/client";
export const FIND_MEMBERS = gql`
  query ($fields: findMembersInput) {
    findMembers(fields: $fields) {
      _id
    }
  }
`;

export default function Home() {
  const { data } = useQuery(FIND_MEMBERS, {
    variables: {
      fields: {},
    },
    context: { serviceName: "soilservice" },
  });

  console.log("data", data);
  return (
    <div className={""}>
      <Head>
        <title>Soil</title>
        <meta name="description" content="Soil" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="text-center mt-16">
          <h1 className="text-2xl text-gray-700 font-bold">
            Soil - Landing Page
          </h1>
        </div>
      </main>
    </div>
  );
}
