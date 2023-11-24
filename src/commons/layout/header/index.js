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
    // ["수업 목록", "classList"],
    ["학습 리포트", "report"],
    ["상담 관리", "consulting"],
  ];
  const router = useRouter();
  // const { data: myData } = useQuery(GET_ME);

  const { data: myData } = {
    data: {
      me: {
        id: "9",
        username: "gyeonggi_teacher",
        userCategory: "\uc120\uc0dd\ub2d8",
        profile: {
          id: 9,
          korName: "\uacbd\uae30\ud37c\ud50c",
          engName: "gyeonggiPurple",
          registerDate: "2023-08-01",
          birthDate: "1980-01-01",
          academy: {
            id: "2",
            name: "\ud37c\ud50c\uc544\uce74\ub370\ubbf8",
            location:
              "\uacbd\uae30 \uc6a9\uc778\uc2dc \uc218\uc9c0\uad6c \ud3ec\uc740\ub300\ub85c 536 \uc2e0\uc138\uacc4\ubc31\ud654\uc810\uacbd\uae30\uc810 8F",
            __typename: "AcademyType",
          },
          __typename: "TeacherType",
        },
        __typename: "UserType",
      },
    },
  };

  const onClickMenu = (address) => () => {
    // router.push("/" + router.query.branch + "/" + address);
    window.location.href =
      "https://readingcenter.purpleacademy.co.kr/" +
      router.query.branch +
      "/" +
      address;
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
