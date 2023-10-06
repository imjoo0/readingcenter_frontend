import { useRouter } from "next/router";
import * as S from "./header.style";
import { v4 as uuidv4 } from "uuid";
import { gql, useQuery } from "@apollo/client";
import { useEffect } from "react";

const GET_ME = gql`
  query {
    me {
      id
      username
      userCategory
      profile {
        ... on StudentType {
          id
          korName
          engName
          registerDate
          origin
          pmobileno
          birthDate
          academies {
            id
            name
            location
          }
        }
        ... on TeacherType {
          id
          korName
          engName
          registerDate
          birthDate
          academy {
            id
            name
            location
          }
        }
        ... on ManagerType {
          id
          korName
          engName
          registerDate
          birthDate
          academies {
            id
            name
            location
          }
        }
      }
    }
  }
`;

export default function Header() {
  const menuList = [
    // ["유저 페이지", "userPage"],
    ["원생 관리", "academy"],
    ["수업 관리", "class"],
    ["도서 관리", "books"],
    ["수업 목록", "classList"],
    ["학습 리포트", "report"],
    ["도서 대여", "library"],
  ];
  const router = useRouter();
  const { data: myData } = useQuery(GET_ME);

  const onClickMenu = (address) => () => {
    if (address === "userPage") {
      router.push("/userPage");
    } else {
      router.push("/" + router.query.branch + "/" + address);
    }
  };

  useEffect(() => {
    if ((router !== undefined || router !== null) && myData !== undefined) {
      if (
        myData?.me?.profile?.academies?.findIndex((el) => {
          return el.id === router.query.branch;
        }) < 0
      ) {
        const routerArray = router.asPath.split(router.query.branch);
        const afterString = routerArray
          .reduce((acc, cur) => {
            return acc + cur;
          }, "")
          .slice(1);
        alert("담당 지점이 아닙니다.");
        router.push("/" + myData?.me?.profile?.academies[0].id + afterString);
      }
    }
    if (myData?.me?.profile?.academy !== undefined) {
      if (myData?.me?.profile?.academy?.id !== router.query.branch) {
        const routerArray = router.asPath.split(router.query.branch);
        const afterString = routerArray
          .reduce((acc, cur) => {
            return acc + cur;
          }, "")
          .slice(1);
        alert("담당 지점이 아닙니다.");
        router.push("/" + myData?.me?.profile?.academy.id + afterString);
      }
    }
  }, [myData]);

  useEffect(() => {
    if (myData) {
      if (myData?.me === null) {
        alert("로그인을 해주십시오.");
        router.push("/");
      }
    }
  }, [myData]);

  return (
    <S.HeaderWrapper>
      <S.MenuDiv>
        <S.logoHorizentalImage></S.logoHorizentalImage>
        {menuList.map((el) => {
          return (
            <S.HeaderTag
              key={uuidv4()}
              style={
                router.asPath.split("/")[
                  router.asPath.split("/").length - 1
                ] === el[1]
                  ? { color: "#000" }
                  : {}
              }
              onClick={onClickMenu(el[1])}
            >
              <S.HeaderText>{el[0]}</S.HeaderText>
            </S.HeaderTag>
          );
        })}
      </S.MenuDiv>
      <S.logout
        onClick={() => {
          router.push("/");
        }}
      >
        로그아웃
      </S.logout>
    </S.HeaderWrapper>
  );
}
