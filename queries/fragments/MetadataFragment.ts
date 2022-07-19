import { gql } from "@apollo/client";

export const MetadataFragment = gql`
  fragment MetadataFragment on MetadataOutput {
    name
    description
    content
    image
    cover {
      original {
        url
        mimeType
      }
    }
    media {
      original {
        url
        mimeType
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }
`;
