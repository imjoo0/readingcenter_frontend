import { useRef, useState } from "react";
import * as S from "./libraryDetail.style";
import { dateToInput, longWord } from "@/src/commons/library/library";
import { BookOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useQuery } from "@apollo/client";
import { GET_BOOKS, GET_ME } from "./librararyDetail.query";

export default function LibraryDetailPage() {
  const router = useRouter();
  const [viewAll, setViewAll] = useState(false);
  const [minBl, setMinBl] = useState("");
  const [maxBl, setMaxBl] = useState("");
  const [date, setDate] = useState(new Date());
  const [bookArray, setBookArray] = useState([]);
  const [bookPage, setBookPage] = useState(1);
  const [bookMaxPage, setBookMaxPage] = useState(1);
  const [bookPageList, setBookPageList] = useState(0);
  const [bookSearchWord, setBookSearchWord] = useState("");
  const [detailToggle, setDetailToggle] = useState(false);
  const [selectBook, setSelectBook] = useState();
  const [minWc, setMinWc] = useState("");
  const [maxWc, setMaxWc] = useState("");
  const [minLex, setMinLex] = useState("");
  const [maxLex, setMaxLex] = useState("");
  const [inputPlbn, setInputPlbn] = useState("");
  const [isAddBook, setIsAddBook] = useState(false);
  const [inputFile, setInputFile] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [inputPlace, setInputPlace] = useState([]);
  const fileInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [sortType, setSortType] = useState("ar");
  const [isBooks, setIsBooks] = useState(true);
  const [academyList, setAcademyList] = useState([]);
  const [arQuizNo, setArQuizNo] = useState("");

  const { data, refetch, loading } = useQuery(GET_BOOKS, {
    variables: {
      minBl: 0,
      maxBl: 0,
      academyIds: [Number(router.query.branch)],
      lectureDate: dateToInput(date),
    },
    onCompleted: () => {
      setIsLoading(false); // 쿼리 완료 시 로딩 상태 변경
    },
    onError: () => {
      setIsLoading(false); // 에러 시 로딩 상태 변경
    },
  });

  const { data: userData } = useQuery(GET_ME);

  const onClickSearch = async () => {
    if (
      minBl === "" &&
      maxBl === "" &&
      minWc === "" &&
      maxWc === "" &&
      minLex === "" &&
      maxLex === "" &&
      arQuizNo === ""
    ) {
      return;
    }
    setIsLoading(true);
    const variables = {
      academyIds: [Number(router.query.branch)],
      lectureDate: dateToInput(date),
    };
    if (academyList.length > 0) {
      variables.academyIds = academyList.map((el) => el.academyId);
    }
    // if (minBl !== "") {
    variables.minBl = Number(minBl);
    // }
    // if (maxBl !== "") {
    variables.maxBl = Number(maxBl);
    // }

    // if (minLex !== "") {
    variables.minLex = Number(minLex);
    // }
    // if (maxLex !== "") {
    variables.maxLex = Number(maxLex);
    // }
    // if (minWc !== "") {
    variables.minWc = Number(minWc);
    // }
    // if (maxWc !== "") {
    variables.maxWc = Number(maxWc);
    // }
    // if (arQuizNo !== "") {
    variables.arQn = Number(arQuizNo);
    // }
    if (minBl === "" || minBl === 0) {
      variables.minBl = null;
    }
    if (minLex === "" || minLex === 0) {
      variables.maxLex = null;
    }
    if (minWc === "" || minWc === 0) {
      variables.maxWc = null;
    }
    if (maxBl === "" || maxBl === 0) {
      variables.maxBl = null;
    }
    if (maxLex === "" || maxLex === 0) {
      variables.maxLex = null;
    }
    if (maxWc === "" || maxWc === 0) {
      variables.maxWc = null;
    }
    if (arQuizNo === "") {
      variables.arQn = null;
    }

    try {
      await refetch(variables);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <S.LibraryWrapper>
        <S.UserNameTitle>
          <S.IconWrapper>
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
          </S.IconWrapper>
          이바니
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
                P000000
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
        <S.MiddleTitle style={{ marginTop: "2.5rem", marginBottom: "1rem" }}>
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
        <S.MiddleTitle style={{ marginTop: "5rem", marginBottom: "1rem" }}>
          바코드 입력
        </S.MiddleTitle>
        <S.RendInputBox>
          <S.RendInput
            type="text"
            placeholder="        바코드를 입력해주세요."
          ></S.RendInput>
          <S.RendButton>대여</S.RendButton>
        </S.RendInputBox>
      </S.LibraryWrapper>
    </>
  );
}
