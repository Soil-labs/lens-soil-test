// import { gql } from "@apollo/client/core";
import { gql } from "@apollo/client";

export const VERIFY = gql`
  query ($request: VerifyRequest!) {
    verify(request: $request)
  }
`;
