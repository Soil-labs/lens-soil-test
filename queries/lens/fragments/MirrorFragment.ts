import { gql } from "@apollo/client";

import { ProfileFragmentLite } from "./ProfileFragmentLite";
import { PostFragment } from "./PostFragment";
import { CollectFragmentLite } from "./CollectFragmentLite";
import { MetadataFragment } from "./MetadataFragment";

export const MirrorFragment = gql`
  fragment MirrorFragment on Mirror {
    id

    profile {
      ...ProfileFragmentLite
    }
    mirrorOf {
      ... on Post {
        ...PostFragment
        profile {
          ...ProfileFragmentLite
        }
      }
      ... on Comment {
        id
        mainPost {
          ... on Post {
            id
          }
        }
        profile {
          ...ProfileFragmentLite
        }
      }
    }
    metadata {
      ...MetadataFragment
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
  }
  ${ProfileFragmentLite}
  ${PostFragment}
  ${CollectFragmentLite}
  ${MetadataFragment}
`;
