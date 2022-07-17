import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { LensLogin } from "@/components/lens";
import { Loading, Error } from "@/components/elements";
import { CreateProject } from "@/components/create-project";

import { useQuery, gql } from "@apollo/client";
import { ProfileFragmentFull } from "@/queries/fragments/ProfileFragmentFull";

export const GET_PROFILES = gql`
  query ($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        ...ProfileFragmentFull
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
  ${ProfileFragmentFull}
`;

const ProjectListPage: NextPage = () => {
  const { address } = useAccount();
  const { data, loading, error } = useQuery(GET_PROFILES, {
    variables: {
      request: { ownedBy: address },
    },
  });

  if (loading) return <Loading />;
  if (error) return <Error />;

  console.log(data);

  return (
    <div>
      <div className="flex justify-between p-4">
        <ConnectButton />
        <LensLogin />
      </div>

      <h1>Project List Page</h1>
      <CreateProject />
    </div>
  );
};

export default ProjectListPage;
