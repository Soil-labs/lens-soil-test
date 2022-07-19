import { useQuery } from "@apollo/client";
import { GET_PUBLICATIONS } from "@/queries/publications/get-publications";
import { Loading, Error } from "@/components/elements";

interface CommentFeedProps {
  publicationId: string;
}

export const CommentFeed = ({ publicationId }: CommentFeedProps) => {
  const { loading, error, data } = useQuery(GET_PUBLICATIONS, {
    variables: {
      request: {
        commentsOf: publicationId,
      },
    },
  });

  if (loading) return <Loading />;
  if (error) return <Error />;
  //   console.log("data", data);
  return (
    <div>
      <div className="p-8">comment CommentFeed - pubId - {publicationId}</div>
      {data.publications.items.map((item: any, index: number) => (
        <div key={index} className="m-4 p-8 border rounded-lg">
          <div className="flex justify-between">
            <div>
              <div className="font-bold">{item.profile.handle}</div>
              <div>{item.metadata.content}</div>
            </div>
            <div>
              <div>{item.createdAt}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
