import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";
import * as S from "./loginPage.style";
import { useMutation, gql } from "@apollo/client";
import { useRecoilState, useSetRecoilState } from "recoil";
import { accessTokenState, refreshTokenState } from "src/commons/stores"; // accessTokenState import

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      accessToken
      refreshToken
    }
  }
`;

export default function LoginPageComponent() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const setAccessToken = useSetRecoilState(accessTokenState);
  const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenState);
  const [loginMutation] = useMutation(LOGIN_MUTATION);

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
      const accessToken = response.data.login.accessToken;
      const refreshToken = response.data.login.refreshToken;
      const user = response.data.login.user;

      // 로그인 성공 시, 받아온 액세스 토큰을 Recoil state에 저장
      setAccessToken(accessToken);
      // setRefreshToken(refreshToken);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      router.push("/2/class");
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인에 실패했습니다.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      login();
    }
  };

  const onClickLogin = async () => {
    await login();
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
            <S.LoginInput
              type="text"
              onChange={onChangeId}
              onKeyPress={handleKeyPress}
            />
          </S.InputTag>
          <S.InputTag>
            <S.LoginInputTitle>PW</S.LoginInputTitle>
            <S.LoginInput
              type="password"
              onChange={onChangePassword}
              onKeyPress={handleKeyPress}
            />
          </S.InputTag>
          <S.LoginButton onClick={onClickLogin}>Sign in</S.LoginButton>
        </S.LoginBoxRight>
      </S.LoginBox>
    </S.Wrapper>
  );
}
