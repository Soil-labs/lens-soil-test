import { gql } from "@apollo/client";

export const Erc20FieldsFragment = gql`
  fragment Erc20Fields on Erc20 {
    name
    symbol
    decimals
    address
  }
`;
