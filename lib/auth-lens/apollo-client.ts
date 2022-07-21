import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import {
  getAuthenticationToken,
  getRefreshToken,
  setAuthenticationToken,
} from "./state";
import jwt_decode from "jwt-decode";

import { refreshAuth } from "@/queries/auth/refresh";
import { LENS_API_URL } from "./constants";

type decodedType = {
  exp: number;
  iat: number;
  id: string;
  role: string;
};
let decoded: decodedType;

// Soil API endpoint
const APIURL = "https://oasis-bot-test-deploy.herokuapp.com/graphql";
const httpLinkSoil = new HttpLink({ uri: APIURL });

const soilLink = new ApolloLink((operation, forward) => {
  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  // Call the next link in the middleware chain.
  return forward(operation);
});

// Lens API endpoint
const httpLinkLens = new HttpLink({ uri: LENS_API_URL });

const authLink = new ApolloLink((operation, forward) => {
  const token = getAuthenticationToken() as string;
  const refreshToken = getRefreshToken() as string;
  if (token) decoded = jwt_decode(token as string);

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      "x-access-token": token ? `Bearer ${token}` : "",
    },
  });

  if (token && decoded.exp < Date.now() / 1000) {
    refreshAuth(refreshToken).then((res: any) => {
      operation.setContext({
        headers: {
          "x-access-token": token
            ? `Bearer ${res.data.refresh.accessToken}`
            : "",
        },
      });
      setAuthenticationToken({ token: res.data.refresh });
    });
  }

  // Call the next link in the middleware chain.
  return forward(operation);
});

const directionalLink = new RetryLink().split(
  (operation) => operation.getContext().serviceName === "soilservice",
  soilLink.concat(httpLinkSoil),
  authLink.concat(httpLinkLens)
);

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) graphQLErrors.map(({ message }) => console.log(message));
});

const lensPagination = (keyArgs: any) => {
  return {
    keyArgs: [keyArgs],
    merge(existing: any, incoming: any) {
      if (!existing) {
        return incoming;
      }
      const existingItems = existing.items;
      const incomingItems = incoming.items;

      return {
        items: existingItems.concat(incomingItems),
        pageInfo: incoming.pageInfo,
      };
    },
  };
};

export const apolloClient = new ApolloClient({
  // link: directionalLink,
  link: from([errorLink, directionalLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          explorePublications: lensPagination(["request", ["sortCriteria"]]),
          publications: lensPagination([
            "request",
            ["profileId", "publicationTypes", "commentsOf"],
          ]),
          // followers: lensPagination(["request", ["profileId"]]),
          // following: lensPagination(["request", ["address"]]),
        },
      },
    },
  }),
});
