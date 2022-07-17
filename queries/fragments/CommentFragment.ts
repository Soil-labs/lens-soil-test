import { gql } from "@apollo/client";

import { ProfileFragmentLite } from "./ProfileFragmentLite";
import { PostPostFragment } from "./PostFragment";
import { MediaFieldsFragment } from "./MediaFieldsFragment";
import { CollectFragmentLite } from "./CollectFragmentLite";

export const PostCommentFragment = gql`
  fragment PostCommentFragment on Comment {
    id

    profile {
      ...ProfileFragmentLite
    }

    metadata {
      name
      description
      content
      image
      media {
        original {
          ...MediaFieldsFragment
        }
      }
    }
    mainPost {
      ... on Post {
        ...PostPostFragment
      }
      ... on Mirror {
        id
        metadata {
          name
          description
          content
          image
          media {
            original {
              ...MediaFieldsFragment
            }
          }
        }
        profile {
          ...ProfileFragmentLite
        }
      }
    }
    commentOn {
      ... on Post {
        id
        profile {
          handle
        }
      }
      ... on Comment {
        id
        profile {
          handle
        }
      }
      ... on Mirror {
        id
        profile {
          handle
        }
      }
    }

    stats {
      totalAmountOfMirrors
      totalAmountOfCollects
      totalAmountOfComments
      totalDownvotes
      totalUpvotes
    }
    collectModule {
      ...CollectFragmentLite
    }

    createdAt
    appId
  }
  ${ProfileFragmentLite}
  ${PostPostFragment}
  ${MediaFieldsFragment}
  ${CollectFragmentLite}
`;
