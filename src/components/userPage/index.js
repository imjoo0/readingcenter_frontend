import gql from "graphql-tag";
import * as S from "./userPage.style";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { accessTokenState, refreshTokenState } from "@/src/commons/stores";

const GET_BRANCHES = gql`
  query Operations {
    me {
      username
      email
      userCategory
      studentProfile {
        korName
        engName
        gender
        mobileno
        registerDate
        birthYear
        origin
        pmobileno
        academies {
          id
          branchName
          location
          name
        }
      }
      teacherProfile {
        korName
        engName
        gender
        mobileno
        registerDate
        birthYear
        academy {
          id
          branchName
          location
          name
        }
      }
      managerProfile {
        korName
        engName
        gender
        mobileno
        registerDate
        birthYear
        academies {
          id
          branchName
          location
          name
        }
      }
    }
  }
`;

export default function AcademyListPage() {
  const { data } = useQuery(GET_BRANCHES);
  console.log(data);
  const router = useRouter();
  const onClickAcademy = (id) => () => {
    router.push(`/${id}/class/`);
  };
  const [accessToken] = useRecoilState(accessTokenState);
  console.log(accessToken);

  return (
    <>
      <S.UserContainer>
        <S.UserMain>유저 정보</S.UserMain>

        <S.UserInfo>{`직책 : ${data?.me.userCategory}`}</S.UserInfo>
        <S.UserInfo>{`e-mail : ${data?.me.email}`}</S.UserInfo>
        <S.UserInfo>{`ID : ${data?.me.username}`}</S.UserInfo>
        <S.UserInfo>
          {"이름 : " +
            (data?.me.studentProfile?.korName ??
              data?.me.teacherProfile?.korName ??
              data?.me?.managerProfile?.korName) +
            "(" +
            (data?.me.studentProfile?.engName ??
              data?.me.teacherProfile?.engName ??
              data?.me?.managerProfile?.engName) +
            ")"}
        </S.UserInfo>
      </S.UserContainer>
      <S.Table>
        <S.TableHeaderRound>
          <S.TableHeadLeft style={{ width: "50%" }}>지점 지역</S.TableHeadLeft>
          <S.TableHead style={{ width: "100%" }}>학원 위치</S.TableHead>
          <S.TableHead style={{ width: "100%" }}>이름</S.TableHead>
          <S.TableHead style={{ width: "30%" }}>원생 추가</S.TableHead>
          <S.TableHeadRight style={{ width: "30%" }}>
            상세 관리
          </S.TableHeadRight>
        </S.TableHeaderRound>
        {data?.me?.managerProfile?.academies?.map((el) => {
          return (
            <S.TableRound key={uuidv4()}>
              <S.TableHeadLeft style={{ width: "50%" }}>
                {el.branchName}
              </S.TableHeadLeft>
              <S.TableHead style={{ width: "100%" }}>{el.location}</S.TableHead>
              <S.TableHead style={{ width: "100%" }}>{el.name}</S.TableHead>
              <S.TableHead style={{ width: "30%" }}>
                <S.LinkButton>+</S.LinkButton>
              </S.TableHead>
              <S.TableHeadRight style={{ width: "30%" }}>
                <S.LinkButton onClick={onClickAcademy(el.id)}>
                  링크
                </S.LinkButton>
              </S.TableHeadRight>
            </S.TableRound>
          );
        })}
      </S.Table>
    </>
  );
}
