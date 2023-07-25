import axios from "axios";
import { GraphQLClient, gql } from "graphql-request";


// Axios를 사용하여 CSRF 토큰을 요청 헤더에 포함시키는 함수
// CSRF 토큰 설정을 위해 GET 요청 보내기
const getCSRFToken = async () => {
  axios.defaults.xsrfCookieName = 'csrftoken';
  axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN';  
  try {
    const response = await axios.get("http://127.0.0.1:8000/user/get_csrf_token/", { withCredentials: true });
    const csrftoken = response.data.csrftoken
    axios.defaults.headers.common['X-CSRFToken'] = csrftoken;
    return csrftoken;
  } catch (error) {
    console.error("Error while getting CSRF token:", error);
    throw error;
  }
};

// GraphQL 요청을 보내는 함수
export const refreshToken = async () => {
  try {
    const csrftoken = await getCSRFToken(); // CSRF 토큰을 얻습니다.
    // GraphQL 요청을 위한 클라이언트 생성
    const graphqlClient = new GraphQLClient('http://127.0.0.1:8000/graphql/', {
      headers: {
        "X-CSRFToken": csrftoken, // 요청 헤더에 CSRF 토큰을 포함시킵니다.
      },
    });
    // 토큰을 요청하기 위한 GraphQL Mutation 쿼리
    const REFRESH_TOKEN_QUERY = gql`
      mutation RefreshToken($refreshToken: String!) {
        refreshToken(refreshToken: $refreshToken) {
          accessToken
        }
      }
    `;

    // GraphQL 요청 실행
    const data = await graphqlClient.request(REFRESH_TOKEN_QUERY);
    console.log(data)
    // 응답 데이터에서 새로운 액세스 토큰 추출
    const newAccessToken = data.refreshToken.accessToken;
    return newAccessToken;
  } catch (err) {
    console.error("Error while refreshing token:", err);
    throw err;
  }
};
