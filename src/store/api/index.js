import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import gql from "graphql-tag";

const httpLink = new HttpLink({
  uri: "https://react.eogresources.com/graphql"
});

const wsLink = new WebSocketLink({
  uri: `ws://react.eogresources.com/graphql`,
  options: {
    reconnect: true
  }
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache,
  link
});

const fetchMetrics = async () => {
  const { data, ...rest } = await client.query({
    query: gql`
      {
        getMetrics
      }
    `
  });
  return { data, ...rest };
};

const subscribeMetricsData = async () => {
  const subscription = await client.subscribe({
    query: gql`
      subscription {
        newMeasurement {
          at
          unit
          value
          metric
        }
      }
    `
  });
  return subscription;
};

export default { fetchMetrics, subscribeMetricsData };
