import { useEffect } from "react"; 
import { useRouter } from "next/router";
import { useState } from "react";
import * as S from "./loginPage.style";
import { useMutation, gql } from "@apollo/client";

const BACKEND_URL = 'http://127.0.0.1:8000/user/graphql/'

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
    }
  }
`;
export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [loginMutation] = useMutation(LOGIN_MUTATION);

  useEffect(() => {
    // Check if the user is already logged in
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);


  const onChangeId = (e) => {
    const inputValue = e.target.value;
    setUsername(inputValue);
  };

  const onChangePassword = (e) => {
    const inputValue = e.target.value;
    setPassword(inputValue);
  };

  const login = async () => {
    try {
      const response = await loginMutation({
        variables: {
          username: username,
          password: password,
        },
      });

      const accessToken = response.data.accessToken;

      // 로그인 성공 시, 받아온 액세스 토큰을 로컬 스토리지에 저장
      localStorage.setItem("accessToken", accessToken);
      setIsLoggedIn(true);
      // 여기서 로직 추가: 로그인 성공 후, 다른 페이지로 이동 또는 UI 업데이트 등
      router.push("/academy");
    } catch (error) {
      console.error("로그인 오류:", error);
    }
  };

  const onClickLogin = () => {
    // Check if running on the client side (not during SSR)
    if (typeof window !== "undefined") {
      login();
    }
  };
  return (
    <S.Wrapper>
      <S.LoginBox>
        <S.LoginBoxLeft></S.LoginBoxLeft>

        <S.LoginBoxRight>
          <S.LoginTitle>Sign in</S.LoginTitle>
          <S.LoginLine></S.LoginLine>
          <S.InputTag>
            <S.LoginInputTitle>ID</S.LoginInputTitle>
            <S.LoginInput type="text" onChange={onChangeId} />
          </S.InputTag>
          <S.InputTag>
            <S.LoginInputTitle>PW</S.LoginInputTitle>
            <S.LoginInput type="password" onChange={onChangePassword} />
          </S.InputTag>
          <S.LoginButton onClick={onClickLogin}>Sign in</S.LoginButton>
        </S.LoginBoxRight>
      </S.LoginBox>
    </S.Wrapper>
  );
}
