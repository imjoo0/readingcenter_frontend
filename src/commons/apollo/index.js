import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  fromPromise,
} from "@apollo/client";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import { accessTokenState, refreshTokenState } from "../stores";
import { useEffect } from "react";
import { createUploadLink } from "apollo-upload-client";
import { onError } from "@apollo/client/link/error";
import { refreshToken } from "../library/refreshToken";

const GLOBAL_STATE = new InMemoryCache();

export default function ApolloSetting(props) {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const getRecoilToken = useRecoilValueLoadable(refreshTokenState);

  useEffect(() => {
    // const result = localStorage.getItem("accessToken")
    // setAccessToken(result ?? "")
    getRecoilToken.toPromise().then((newAccessToken) => {
      setAccessToken(newAccessToken ?? "");
    });
  }, []);

  const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (typeof graphQLErrors !== "undefined") {
      for (const err of graphQLErrors) {
        if (err.extensions.code === "UNAUTHENTICATED") {
          return fromPromise(
            refreshToken().then((newAccessToken) => {
              setAccessToken(newAccessToken ?? "");
              operation.setContext({
                headers: {
                  ...operation.getContext().headers,
                  Authorization: `Bearer ${newAccessToken ?? ""}`,
                },
              });
            })
          ).flatMap(() => forward(operation));
        }
      }
    }
  });

  const uploadLink = createUploadLink({
    uri: "https://countries.trevorblades.com",
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  const client = new ApolloClient({
    link: ApolloLink.from([uploadLink]),
    cache: GLOBAL_STATE,
  });

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
