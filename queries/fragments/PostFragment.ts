import { gql } from "@apollo/client";

import { ProfileFragmentLite } from "./ProfileFragmentLite";
import { CollectFragmentLite } from "./CollectFragmentLite";
import { MetadataFragment } from "./MetadataFragment";

export const PostFragment = gql`
  fragment PostFragment on Post {
    id

    profile {
      ...ProfileFragmentLite
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
    hidden
    appId
  }
  ${ProfileFragmentLite}
  ${MetadataFragment}
  ${CollectFragmentLite}
`;
