import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Loading, Error } from "@/components/elements";
import { CreateComment, CommentFeed } from "@/components/create-project";

import { useQuery, gql } from "@apollo/client";

import { PostFragment } from "@/queries/fragments/PostFragment";
import { CommentFragment } from "@/queries/fragments/CommentFragment";
import { MirrorFragment } from "@/queries/fragments/MirrorFragment";

export const GET_PUBLICATION = gql`
  query (
    $request: PublicationQueryRequest!
    $requestRequest: ReactionFieldResolverRequest
  ) {
    publication(request: $request) {
      ... on Post {
        ...PostFragment
        reaction(request: $requestRequest)
      }
      ... on Comment {
        ...CommentFragment
        reaction(request: $requestRequest)
      }
      ... on Mirror {
        ...MirrorFragment
      }
    }
  }

  ${PostFragment}
  ${CommentFragment}
  ${MirrorFragment}
`;

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data, refetch } = useQuery(GET_PUBLICATION, {
    variables: {
      request: {
        publicationId: id,
      },
    },
  });

  if (loading) return <Loading />;
  if (error) return <Error />;
  if (!data.publication) return <Error message={"PUBLICATION DOESN'T EXIST"} />;
  const { publication } = data;

  console.log("publication", publication);

  return (
    <div>
      <h1>Project Page - {id}</h1>
      <div className="border p-4 m-4">
        <div className="flex justify-between">
          <div>appId : {publication.appId}</div>
          <div>pub # : {publication.id}</div>
        </div>
        <div className="flex my-4">
          <div>
            <img
              src={publication.metadata.image}
              alt={publication.metadata.name}
              className="h-16 rounded-full"
            />
          </div>
          <div className="px-4">
            <div>name: {publication.metadata.name}</div>
            <div>decription: {publication.metadata.description}</div>
          </div>
          <div className="pl-8">
            <div>created by: {publication.profile.handle}</div>
          </div>
        </div>
        <div>
          <div>
            Total in project -collected-{" "}
            {publication.stats.totalAmountOfCollects}
          </div>
          <div>
            Total posts -comments- {publication.stats.totalAmountOfComments}
          </div>
        </div>
      </div>
      <CreateComment publicationId={id as string} onRefetch={refetch} />
      <CommentFeed publicationId={id as string} />
    </div>
  );
};

export default ProjectPage;
