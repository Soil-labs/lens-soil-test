import { useContext, useState } from "react";
import { UserContext } from "@/components/layout";
import { useMutation, gql } from "@apollo/client";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const ADD_REACTION = gql`
  mutation ($request: ReactionRequest!) {
    addReaction(request: $request)
  }
`;

export const REMOVE_REACTION = gql`
  mutation ($request: ReactionRequest!) {
    removeReaction(request: $request)
  }
`;

export const PostReaction = ({ publication }: any) => {
  const { currentUser } = useContext(UserContext);
  const { id, stats, reaction } = publication;

  const [upVotes, setUpVotes] = useState(stats.totalUpvotes);
  const [userUpVote, setUserUpVote] = useState(reaction === "UPVOTE");

  const [downVotes, setDownVotes] = useState(stats.totalDownvotes);
  const [userDownVote, setUserDownVote] = useState(reaction === "DOWNVOTE");

  const [addReaction, {}] = useMutation(ADD_REACTION, {});

  const [removeReaction, {}] = useMutation(REMOVE_REACTION, {});

  //   console.log("currentUser", currentUser);

  const upVoteRequest = {
    variables: {
      request: {
        profileId: currentUser?.id,
        reaction: "UPVOTE",
        publicationId: id,
      },
    },
    context: { serviceName: "lensservice" },
  };

  const downVoteRequest = {
    variables: {
      request: {
        profileId: currentUser?.id,
        reaction: "DOWNVOTE",
        publicationId: id,
      },
    },
    context: { serviceName: "lensservice" },
  };

  return (
    <div className="flex font-medium text-gray-600">
      <div className="flex mx-2 cursor-pointer">
        {upVotes}{" "}
        <button
          className={classNames(
            userUpVote ? " text-green-700" : "hover:text-gray-700",
            "ml-2"
          )}
          onClick={() => {
            if (currentUser) {
              if (!userUpVote) {
                addReaction(upVoteRequest);
                setUpVotes(upVotes + 1);
                setUserUpVote(true);
                if (userDownVote) {
                  setDownVotes(downVotes - 1);
                  setUserDownVote(false);
                }
              } else {
                removeReaction(upVoteRequest);
                setUpVotes(upVotes - 1);
                setUserUpVote(false);
              }
            }
          }}
        >
          <UpVote />
        </button>
      </div>
      <div className="flex mx-2 hover:text-stone-700 cursor-pointer">
        {downVotes}{" "}
        <button
          className={classNames(
            userDownVote ? " text-red-700" : "hover:text-gray-700",
            "ml-2 mt-1"
          )}
          onClick={() => {
            if (currentUser) {
              if (!userDownVote) {
                addReaction(downVoteRequest);
                setDownVotes(downVotes + 1);
                setUserDownVote(true);
                if (userUpVote) {
                  setUpVotes(upVotes - 1);
                  setUserUpVote(false);
                }
              } else {
                removeReaction(downVoteRequest);
                setDownVotes(downVotes - 1);
                setUserDownVote(false);
              }
            }
          }}
        >
          <DownVote />
        </button>
      </div>
    </div>
  );
};

const UpVote = () => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 32 32"
      fill="currentColor"
    >
      <path d="M16 1l-15 15h9v16h12v-16h9z"></path>
    </svg>
  );
};

const DownVote = () => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 32 32"
      fill="currentColor"
    >
      <path d="M16 31l15-15h-9v-16h-12v16h-9z"></path>
    </svg>
  );
};
