import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
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

// Lens API endpoint
const httpLinkLens = new HttpLink({ uri: LENS_API_URL });

export const authLink = new ApolloLink((operation, forward) => {
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
  httpLinkSoil,
  authLink.concat(httpLinkLens)
);

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
  link: authLink.concat(httpLinkLens),
  // uri: LENS_API_URL,
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
