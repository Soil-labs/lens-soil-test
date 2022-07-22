import { gql } from "@apollo/client";

export const CollectFragmentLite = gql`
  fragment CollectFragmentLite on CollectModule {
    ... on FreeCollectModuleSettings {
      __typename
      type
    }
    ... on FeeCollectModuleSettings {
      __typename
      type
      amount {
        value
        asset {
          address
          symbol
        }
      }
    }
    ... on LimitedFeeCollectModuleSettings {
      __typename
      type
      amount {
        value
        asset {
          address
          symbol
        }
      }
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      __typename
      type
      amount {
        value
        asset {
          address
          symbol
        }
      }
    }
    ... on TimedFeeCollectModuleSettings {
      __typename
      type
      amount {
        value
        asset {
          address
          symbol
        }
      }
    }
    ... on RevertCollectModuleSettings {
      __typename
      type
    }
  }
`;
