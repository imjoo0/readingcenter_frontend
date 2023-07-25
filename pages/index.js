import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  useEffect(() => {
    // Check if the user is already logged in
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      setIsLoggedIn(true);
    }
  }, []);


  return (
    <>
      {isLoggedIn ? (
        <AcademyPage /> // 로그인 상태이면 Academy 페이지를 보여줍니다.
      ) : (
        <LoginPage /> // 로그인 상태가 아니면 Login 페이지를 보여줍니다.
      )}
    </>
  );
}
