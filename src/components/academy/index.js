import { useRouter } from "next/router";
import * as S from "./academy.style";
import { SearchOutlined, FormOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { gql, useQuery } from "@apollo/client";
import { dateChange } from "@/src/commons/library/library";

const GET_STUDENTS = gql`
  query studentsInAcademy($academyId: Int!) {
    studentsInAcademy(academyId: $academyId) {
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
        name
      }
    }
  }
`;

export default function AcademyPage() {
  const router = useRouter();
  const { data } = useQuery(GET_STUDENTS, {
    variables: { academyId: Number(router.query.branch) },
  });
  console.log(data, router.query);
  const [array, setArray] = useState(data?.studentsInAcademy);
  const [searchWord, setSearchWord] = useState("");

  const onChangeSearchWord = (event) => {
    setSearchWord(event.target.value);
  };

  const onClickSearch = () => {
    const newArray = [...data?.studentsInAcademy];
    setArray(
      newArray.filter((el) => {
        return (
          el.korName.includes(searchWord) || el.origin.includes(searchWord)
        );
      })
    );
  };

  const onKeyPress = (event) => {
    if (event.key === "Enter") {
      onClickSearch();
    }
  };

  useEffect(() => {
    setArray(data?.studentsInAcademy);
  }, [data]);

  return (
    <>
      <S.AcademyWrapper>
        <S.AcademyTitle>원생 관리</S.AcademyTitle>
        <S.AcademyTitleLine></S.AcademyTitleLine>
        <S.SearchBox>
          <S.SearchTitle>원생 검색</S.SearchTitle>
          <S.SearchTag>
            <S.SearchInput
              type="text"
              placeholder="원번 혹은 이름을 입력하세요"
              onChange={onChangeSearchWord}
              onKeyPress={onKeyPress}
            />
            <S.SearchButton onClick={onClickSearch}>검색</S.SearchButton>
          </S.SearchTag>
        </S.SearchBox>

        <S.CountNumber>{"총 " + array?.length + "명"}</S.CountNumber>

        <S.Table>
          <S.TableHeaderRound>
            <S.TableHeadLeft style={{ width: "40%" }}>원번</S.TableHeadLeft>
            <S.TableHead style={{ width: "40%" }}>원생명</S.TableHead>
            <S.TableHead style={{ width: "40%" }}>연령</S.TableHead>
            <S.TableHead style={{ width: "50%" }}>등록일</S.TableHead>
            <S.TableHead style={{ width: "100%" }}>연락처</S.TableHead>
            <S.TableHead style={{ width: "30%" }}>성별</S.TableHead>
            <S.TableHeadRight style={{ width: "50%" }}>
              상세 보기
            </S.TableHeadRight>
          </S.TableHeaderRound>
          {array?.map((el) => {
            return (
              <S.TableRound key={uuidv4()}>
                <S.TableHeadLeft style={{ width: "40%" }}>
                  {el.origin}
                </S.TableHeadLeft>
                <S.TableHead style={{ width: "40%" }}>{el.korName}</S.TableHead>
                <S.TableHead style={{ width: "40%" }}>
                  {el.birthYear + "년"}
                </S.TableHead>
                <S.TableHead style={{ width: "50%" }}>
                  {dateChange(el.registerDate)}
                </S.TableHead>
                <S.TableHead style={{ width: "100%" }}>
                  <span>{"학생 : " + el.mobileno}</span>
                  <span>{"학부모 : " + el.pmobileno}</span>
                </S.TableHead>
                <S.TableHead style={{ width: "30%" }}>
                  {el.gender === "M" ? "남" : "여"}
                </S.TableHead>
                <S.TableHeadRight style={{ width: "50%" }}>
                  <SearchOutlined
                    onClick={() => {
                      window.open(
                        "/" + router.query.branch + "/academy/" + el.origin,
                        "_blank"
                      );
                    }}
                  ></SearchOutlined>
                </S.TableHeadRight>
              </S.TableRound>
            );
          })}
        </S.Table>
      </S.AcademyWrapper>
    </>
  );
}
