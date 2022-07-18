import { gql } from "@apollo/client";

import { ProfileFragmentLite } from "./ProfileFragmentLite";
import { MediaFieldsFragment } from "./MediaFieldsFragment";
import { CollectFragmentLite } from "./CollectFragmentLite";

export const PostFragment = gql`
  fragment PostFragment on Post {
    id

    profile {
      ...ProfileFragmentLite
    }

    metadata {
      name
      description
      content
      image
      attributes {
        displayType
        traitType
        value
      }
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
    hidden
    appId
  }
  ${ProfileFragmentLite}
  ${MediaFieldsFragment}
  ${CollectFragmentLite}
`;
