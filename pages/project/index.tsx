import type { NextPage } from "next";
import { useRouter } from "next/router";
import { CreateProject } from "@/components/lens/project";

import { useQuery, gql } from "@apollo/client";
import { PostFragment } from "@/queries/lens/fragments/PostFragment";

export const EXPLORE_PUBLICATIONS = gql`
  query ($request: ExplorePublicationRequest!) {
    explorePublications(request: $request) {
      items {
        __typename
        ... on Post {
          ...PostFragment
        }
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${PostFragment}
`;

const ProjectListPage: NextPage = () => {
  const router = useRouter();
  const { data, fetchMore } = useQuery(EXPLORE_PUBLICATIONS, {
    variables: {
      request: {
        sources: [`test project`],
        sortCriteria: "LATEST",
        publicationTypes: ["POST"],
        limit: 10,
      },
    },
    context: { serviceName: "lensservice" },
  });

  // console.log(data);

  return (
    <div>
      <div className="p-8">
        <CreateProject />
      </div>
      <div className="p-8 border">
        {data?.explorePublications?.items?.map((item: any, index: number) => (
          <button
            key={index}
            className="my-2 p-4 border rounded-md w-full hover:bg-blue-200 text-gray-700 font-medium"
            onClick={() => router.push(`/project/${item.id}`)}
          >
            <div className="flex justify-between">
              <div>appId : {item.appId}</div>
              <div>pub # : {item.id}</div>
            </div>
            <div className="flex my-4">
              <div>
                <img
                  src={item.metadata.image}
                  alt={item.metadata.name}
                  className="h-16"
                />
              </div>
              <div className="px-4">
                <div>name: {item.metadata.name}</div>
                <div>decription: {item.metadata.description}</div>
              </div>
              <div className="pl-8">
                <div>created by: {item.profile.handle}</div>
              </div>
              <div className="pl-8">
                <div>Joined : {item.stats.totalAmountOfCollects}</div>
                <div>Posts on : {item.stats.totalAmountOfComments}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProjectListPage;
