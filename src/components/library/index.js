import { useState } from "react";
import * as S from "./library.style";
import { useRouter } from "next/router";
import { dateToInput, longWord } from "@/src/commons/library/library";

export default function LibraryPage() {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [correct, setCorrect] = useState(true);
  const [viewAll, setViewAll] = useState(false);
  const [origin, setOrigin] = useState("");

  const onChangeSearch = (e) => {
    setSearchInput(e.target.value);
    setCorrect(true);
  };

  const onClickSearch = () => {
    // router.push("/" + router.query.branch + "/library/" + searchInput);
    setOrigin(searchInput);

    // setCorrect(false);
  };
  return (
    <>
      <S.LibraryWrapper>
        <S.LibraryTitle>도서 대여</S.LibraryTitle>

        <S.LibrarySearchTag>
          <S.LibrarySearchInput
            type="text"
            placeholder="       원번을 입력하세요"
            onChange={onChangeSearch}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                onClickSearch();
              }
            }}
          ></S.LibrarySearchInput>
          <S.LibrarySearchButton onClick={onClickSearch}>
            검색하기
          </S.LibrarySearchButton>
        </S.LibrarySearchTag>

        {correct ? (
          <></>
        ) : (
          <S.AlertMessage>일치하는 원생이 없습니다.</S.AlertMessage>
        )}

        {origin === "" ? (
          <></>
        ) : (
          <>
            <S.UserNameTitle style={{ marginTop: "30px" }}>
              {/* <S.IconWrapper>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => {
                    router.push("/" + router.query.branch + "/library");
                  }}
                >
                  <g id="Frame">
                    <path
                      id="Vector"
                      d="M35 20.0002H5M5 20.0002L19.1667 5.8335M5 20.0002L19.1667 34.1668"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                </svg>
              </S.IconWrapper> */}
              이바니
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <S.MiddleTitle
                  style={{
                    // marginTop: "5rem",
                    marginBottom: "1rem",
                  }}
                >
                  바코드 입력
                </S.MiddleTitle>
                <S.RendInputBox>
                  <S.RendInput
                    type="text"
                    placeholder="        바코드를 입력해주세요."
                  ></S.RendInput>
                  <S.RendButton>대여</S.RendButton>
                </S.RendInputBox>
              </div>
            </S.UserNameTitle>
            <table style={{ border: "none" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      border: "none",
                      width: "10rem",
                      height: "2.75rem",
                      borderTop: "1px solid #DBDDE1",
                    }}
                  >
                    원생 번호
                  </th>
                  <th
                    style={{
                      backgroundColor: "#ffffff",
                      border: "none",
                      borderTop: "1px solid #DBDDE1",
                    }}
                  >
                    {origin}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      background: "#F7F8FA",
                      border: "none",
                      width: "10rem",
                      height: "2.75rem",
                      borderTop: "1px solid #DBDDE1",
                      borderBottom: "1px solid #DBDDE1",
                    }}
                  >
                    대여 가능 여부
                  </td>
                  <td
                    style={{
                      border: "none",
                      borderTop: "1px solid #DBDDE1",
                      borderBottom: "1px solid #DBDDE1",
                    }}
                  >
                    가능
                  </td>
                </tr>
              </tbody>
            </table>
            <S.MiddleTitle
              style={{ marginTop: "2.5rem", marginBottom: "1rem" }}
            >
              도서 대여 이력
            </S.MiddleTitle>
            <style>{`
              table {
              border-collapse: separate;
              border-spacing: 0;
              border-radius: 0.125rem;
              border: 1px solid #DBDDE1;
              width: 100%;
            }
            thead{
              border-radius: 0.25rem 0.25rem 0rem 0rem;
              background: #F7F8FA;
            }
            th,
            td {
              border: 0.8px solid #DBDDE1;
              padding: 6px 1.5rem;
              font-size: 0.875rem;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
              text-align: left;
            }
            td {
              color: #333;
            }
            `}</style>
            <table>
              <thead>
                <tr>
                  <th>대출일</th>
                  <th>반납일</th>
                  <th>바코드</th>
                  <th>도서 제목</th>
                  <th>저자</th>
                  <th>위치</th>
                  <th>상태</th>
                  <th>도서 상세정보</th>
                </tr>
              </thead>
              <tbody>
                {["파손", "분실", "분실", "분실", "파손"]
                  .filter((_, index) => {
                    if (viewAll) {
                      return true;
                    } else {
                      return index < 3;
                    }
                  })
                  .map((el) => {
                    return (
                      <tr>
                        <td>00000-00-00</td>
                        <td>
                          {el === "파손" ? (
                            <S.ReturnButton>반납</S.ReturnButton>
                          ) : (
                            <div>0000-00-00</div>
                          )}
                        </td>
                        <td>000-0000-0000</td>
                        <td>{longWord("000000000000000000000000000000000")}</td>
                        <td>000000000000</td>
                        <td>제주연동캠퍼스</td>
                        <td>{el}</td>
                        <td>보기</td>
                      </tr>
                    );
                  })}
                <tr>
                  <td colSpan={8}>
                    {viewAll ? (
                      <div
                        onClick={() => {
                          setViewAll(false);
                        }}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        접기
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setViewAll(true);
                        }}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        전체보기
                      </div>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </S.LibraryWrapper>
    </>
  );
}
