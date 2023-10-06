import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  fromPromise,
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { useEffect } from "react";
import { onError } from "@apollo/client/link/error";
import { refreshToken } from "../library/refreshToken";
import { useRecoilState, useRecoilValueLoadable } from "recoil"; // useRecoilState를 추가로 임포트

import { accessTokenState, refreshTokenState } from "../stores";

const GLOBAL_STATE = new InMemoryCache();

export default function ApolloSetting(props) {
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const getRecoilToken = useRecoilValueLoadable(refreshTokenState);

  useEffect(() => {
    // const result = localStorage.getItem("accessToken")
    // setAccessToken(result ?? "")
    // getRecoilToken.toPromise().then((newAccessToken) => {
    //   setAccessToken(newAccessToken ?? "");
    // });
    if (localStorage.getItem("accessToken")) {
      setAccessToken(localStorage.getItem("accessToken") || "");
    }
  }, []);

  const errorLink = onError(({ graphQLErrors, operation, forward }) => {
    if (typeof graphQLErrors !== "undefined") {
      for (const err of graphQLErrors) {
        if (err?.extensions?.code === "UNAUTHENTICATED") {
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
    uri: "http://readingcenter.purpleacademy.co.kr:8000/graphql/",
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: "include",
  });

  const client = new ApolloClient({
    link: ApolloLink.from([errorLink, uploadLink]),
    cache: GLOBAL_STATE,
    // onError: ({ networkError }) => {
    //   if (networkError && networkError.statusCode === 200) {
    //     // HTTP 상태 코드가 200인 경우 여기서 처리합니다.
    //     console.error("HTTP Status Code 200 with GraphQL Error");
    //   }
    // },
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "network-only",
      },
      query: {
        fetchPolicy: "network-only",
      },
    },
  });

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
