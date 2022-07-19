import { gql } from "@apollo/client";

import { ProfileFragmentLite } from "./ProfileFragmentLite";
import { PostFragment } from "./PostFragment";
import { CollectFragmentLite } from "./CollectFragmentLite";
import { MetadataFragment } from "./MetadataFragment";

export const CommentFragment = gql`
  fragment CommentFragment on Comment {
    id

    profile {
      ...ProfileFragmentLite
    }

    metadata {
      ...MetadataFragment
    }
    mainPost {
      ... on Post {
        ...PostFragment
      }
      ... on Mirror {
        id
        metadata {
          ...MetadataFragment
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
  ${PostFragment}
  ${CollectFragmentLite}
  ${MetadataFragment}
`;
