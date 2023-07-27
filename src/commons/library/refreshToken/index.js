import { GraphQLClient, gql } from "graphql-request";

// GraphQL 요청을 보내는 함수
export const refreshToken = async (refreshToken) => {
  // refreshToken 인자 추가
  if (refreshToken !== undefined) {
    try {
      // GraphQL 요청을 위한 클라이언트 생성
      const graphqlClient = new GraphQLClient("http://readingcenter.purpleacademy.co.kr:8000/graphql/");

      // 토큰을 요청하기 위한 GraphQL Mutation 쿼리
      const REFRESH_TOKEN_QUERY = gql`
        mutation RefreshToken($refreshToken: String!) {
          refreshToken(refreshToken: $refreshToken) {
            accessToken
            refreshToken
          }
        }
      `;

      // GraphQL 요청 실행
      const data = await graphqlClient.request(REFRESH_TOKEN_QUERY, {
        refreshToken: refreshToken ?? "",
      }); // refreshToken 인자 전달

      // 응답 데이터에서 새로운 액세스 토큰 추출
      const newAccessToken = data.refreshToken.accessToken;
      const newRefreshToken = data.refreshToken.refreshToken;
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (err) {
      console.error("Error while refreshing token:", err);
      throw err;
    }
  }
};
