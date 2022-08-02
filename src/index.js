import { React } from "react";
import * as ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { RestLink } from "apollo-link-rest";
import App from "./App";
import "antd/dist/antd.css"; 

import fetch from "isomorphic-fetch";

// Set `RestLink` with your endpoint
const restLink = new RestLink({
  uri: "http://localhost:4001",
  customFetch: fetch,
  headers: {
    "Content-Type": "application/json",
  },
  typePatcher: {
    Todo: (data) => {
      console.log("tp", data);
      if (data.user != null) {
        data.user = { __typename: "User", ...data.user };
      }
      return data;
    },
  },
});
export const sharedCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        getTodo: {
          read(_, { args, toReference }) {
            console.log("Cache", args);
            return toReference({
              __typename: "Todo",
              id: args.id,
            });
          },
        },
        getUser: {
          read(_, { args, toReference }) {
            console.log("User Cache", args);
            return toReference({
              __typename: "User",
              id: args.id,
            });
          },
        },
      },
    },
  },
});
// Setup your client
export const RestClient = new ApolloClient({
  cache: sharedCache,
  link: restLink,
});

export const GraphqlClient = new ApolloClient({
  uri: "http://localhost:4000",
  cache: sharedCache,
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<App />);
