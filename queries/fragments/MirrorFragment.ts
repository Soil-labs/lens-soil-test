import { gql } from "@apollo/client";

import { ProfileFragmentLite } from "./ProfileFragmentLite";
import { PostFragment } from "./PostFragment";
import { MediaFieldsFragment } from "./MediaFieldsFragment";
import { CollectFragmentLite } from "./CollectFragmentLite";

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
  ${MediaFieldsFragment}
  ${CollectFragmentLite}
`;
