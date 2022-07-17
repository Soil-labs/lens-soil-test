import { gql } from "@apollo/client";

export const CollectFragmentFull = gql`
  fragment CollectFragmentFull on CollectModule {
    collectModule {
      ... on FreeCollectModuleSettings {
        __typename
        type
        contractAddress
        followerOnly
      }
      ... on FeeCollectModuleSettings {
        __typename
        type
        amount {
          value
          asset {
            address
            symbol
            decimals
            name
          }
        }
        contractAddress
        followerOnly
        recipient
        referralFee
      }
      ... on LimitedFeeCollectModuleSettings {
        __typename
        type
        amount {
          value
          asset {
            address
            symbol
            decimals
            name
          }
        }
        collectLimit
        contractAddress
        followerOnly
        recipient
        referralFee
      }
      ... on LimitedTimedFeeCollectModuleSettings {
        __typename
        type
        amount {
          value
          asset {
            address
            symbol
            decimals
            name
          }
        }
        collectLimit
        contractAddress
        endTimestamp
        followerOnly
        recipient
        referralFee
      }
      ... on TimedFeeCollectModuleSettings {
        __typename
        type
        amount {
          value
          asset {
            address
            symbol
            name
            decimals
          }
        }
        referralFee
        recipient
        followerOnly
        endTimestamp
        contractAddress
      }
      ... on RevertCollectModuleSettings {
        __typename
        type
        contractAddress
      }
    }
  }
`;
