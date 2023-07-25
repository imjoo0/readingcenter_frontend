import { useRouter } from "next/router";
import * as S from "./academy.style";
import { SearchOutlined, FormOutlined } from "@ant-design/icons";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const data = [
  {
    id: "P01",
    name: "철수",
    birthDayYear: 2013,
    registerDate: "2023년 5월 3일",
    status: "재원 중",
    phone: "010-0000-0000",
    parentsPhone: "010-0000-0000",
  },
  {
    id: "P02",
    name: "영희",
    birthDayYear: 2012,
    registerDate: "2023년 5월 2일",
    status: "재원 중",
    phone: "010-0000-0000",
    parentsPhone: "010-0000-0000",
  },
];

export default function AcademyPage() {
  const [array, setArray] = useState(data);
  const [searchWord, setSearchWord] = useState("");

  const onChangeSearchWord = (event) => {
    setSearchWord(event.target.value);
  };

  const onClickSearch = () => {
    const newArray = [...data];
    setArray(
      newArray.filter((el) => {
        return el.name.includes(searchWord) || el.id.includes(searchWord);
      })
    );
  };

  const onKeyPress = (event) => {
    if (event.key === "Enter") {
      onClickSearch();
    }
  };

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

        <S.CountNumber>{"총 " + array.length + "명"}</S.CountNumber>

        <S.Table>
          <S.TableHeaderRound>
            <S.TableHeadLeft style={{ width: "40%" }}>원번</S.TableHeadLeft>
            <S.TableHead style={{ width: "40%" }}>원생명</S.TableHead>
            <S.TableHead style={{ width: "40%" }}>연령</S.TableHead>
            <S.TableHead style={{ width: "50%" }}>등록일</S.TableHead>
            <S.TableHead style={{ width: "100%" }}>연락처</S.TableHead>
            <S.TableHead style={{ width: "30%" }}>재원 여부</S.TableHead>
            <S.TableHeadRight style={{ width: "50%" }}>
              상세 보기
            </S.TableHeadRight>
          </S.TableHeaderRound>
          {array.map((el) => {
            return (
              <S.TableRound key={uuidv4()}>
                <S.TableHeadLeft style={{ width: "40%" }}>
                  {el.id}
                </S.TableHeadLeft>
                <S.TableHead style={{ width: "40%" }}>{el.name}</S.TableHead>
                <S.TableHead style={{ width: "40%" }}>
                  {el.birthDayYear + "년"}
                </S.TableHead>
                <S.TableHead style={{ width: "50%" }}>
                  {el.registerDate}
                </S.TableHead>
                <S.TableHead style={{ width: "100%" }}>
                  <span>{"학생 : " + el.phone}</span>
                  <span>{"학부모 : " + el.parentsPhone}</span>
                </S.TableHead>
                <S.TableHead style={{ width: "30%" }}>{el.status}</S.TableHead>
                <S.TableHeadRight style={{ width: "50%" }}>
                  <SearchOutlined
                    onClick={() => {
                      window.open("/academy/" + el.id, "_blank");
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
