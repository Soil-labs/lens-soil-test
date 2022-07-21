import { useContext } from "react";
import { UserContext } from "@/components/layout";
import { useQuery } from "@apollo/client";
import { GET_PUBLICATIONS } from "@/queries/publications/get-publications";
import { Loading, Error } from "@/components/elements";
import { PostReaction } from "@/components/create-project";

interface CommentFeedProps {
  publicationId: string;
}

export const CommentFeed = ({ publicationId }: CommentFeedProps) => {
  const { currentUser } = useContext(UserContext);

  const { loading, error, data } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        commentsOf: publicationId,
      },
      context: { serviceName: "lensservice" },
      requestRequest: { profileId: currentUser?.id },
    },
  });

  if (loading) return <Loading />;
  if (error) return <Error />;
  //   console.log("data", data);
  return (
    <div>
      {data.publications.items.map((item: any, index: number) => (
        <div key={index} className="m-4 p-8 border rounded-lg">
          <div className="flex justify-between">
            <div>
              <div className="font-bold">{item.profile.handle}</div>
              <div>{item.metadata.content}</div>
            </div>
            <div>
              <div>pub # : {item.id}</div>
            </div>
          </div>
          <PostReaction publication={item} />
        </div>
      ))}
    </div>
  );
};
