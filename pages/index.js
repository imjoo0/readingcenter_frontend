import { useRecoilValue } from "recoil";
import { accessTokenState } from "src/commons/stores"; // accessTokenState를 가져오기
import LoginPage from "@/pages/login";

export default function Home() {
  // const accessToken = useRecoilValue(accessTokenState);
  // const isLoggedIn = Boolean(accessToken); // accessToken이 존재하면 true, 그렇지 않으면 false

  return (
    <>
      {/* {isLoggedIn ? (
        <AcademyPage /> // 로그인 상태이면 Academy 페이지를 보여줍니다.
      ) : ( */}
      <LoginPage />
      {/* )} */}
    </>
  );
}
