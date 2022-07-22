import { gql } from "@apollo/client/core";

import { PostFragment } from "@/queries/lens/fragments/PostFragment";
import { CommentFragment } from "@/queries/lens/fragments/CommentFragment";
import { MirrorFragment } from "@/queries/lens/fragments/MirrorFragment";

export const GET_PUBLICATIONS = gql`
  query (
    $request: PublicationsQueryRequest!
    $requestRequest: ReactionFieldResolverRequest
  ) {
    publications(request: $request) {
      items {
        __typename
        ... on Post {
          ...PostFragment
          reaction(request: $requestRequest)
        }
        ... on Comment {
          ...CommentFragment
          reaction(request: $requestRequest)
        }
        ... on Mirror {
          ...MirrorFragment
          reaction(request: $requestRequest)
        }
      }
      pageInfo {
        next
        totalCount
      }
    }
  }
  ${PostFragment}
  ${CommentFragment}
  ${MirrorFragment}
`;
