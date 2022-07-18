import { gql } from "@apollo/client";

import { MediaFieldsFragment } from "./MediaFieldsFragment";

export const ProfileFragmentLite = gql`
  fragment ProfileFragmentLite on Profile {
    id
    handle
    name
    bio
    ownedBy
    isFollowing
    isFollowedByMe
    picture {
      ... on MediaSet {
        original {
          ...MediaFieldsFragment
        }
      }
      ... on NftImage {
        tokenId
        uri
        verified
      }
    }
  }
  ${MediaFieldsFragment}
`;
