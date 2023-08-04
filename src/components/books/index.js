import * as S from "./books.style";
import { BookOutlined } from "@ant-design/icons";
import { addComma, dateToInput, longWord } from "../../commons/library/library";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@apollo/client";
import { GET_BOOKS } from "./books.query";
import { useRouter } from "next/router";

export default function BookPage() {
  const router = useRouter();

  const [searchType, setSearchType] = useState("name");
  const [minBl, setMinBl] = useState(0);
  const [maxBl, setMaxBl] = useState(0);
  const [date, setDate] = useState(new Date());
  const [bookArray, setBookArray] = useState([]);
  const [bookPage, setBookPage] = useState(1);
  const [bookMaxPage, setBookMaxPage] = useState(1);
  const [bookPageList, setBookPageList] = useState(0);
  const [bookSearchWord, setBookSearchWord] = useState("");
  const [detailToggle, setDetailToggle] = useState(false);
  const [selectBook, setSelectBook] = useState();
  const [minWc, setMinWc] = useState(0);
  const [maxWc, setMaxWc] = useState(100000000);
  const [inputPlbn, setInputPlbn] = useState("");
  const { data, refetch } = useQuery(GET_BOOKS, {
    variables: {
      minBl: 0,
      maxBl: 0,
      academyId: Number(router.query.branch),
      lectureDate: dateToInput(date),
    },
  });

  const onChangeSearchType = (event) => {
    setSearchType(event.target.value);
  };

  // useEffect(() => {
  //   refetch();
  // }, [minBl, maxBl]);

  useEffect(() => {
    setBookArray(
      data === undefined
        ? []
        : data?.getBooksByBl
            ?.filter((el) => {
              return (
                el?.titleAr
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase()) ||
                String(el?.books[0]?.isbn)
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase()) ||
                el?.authorAr
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase())
              );
            })
            ?.filter((el) => {
              return Number(el?.wcAr) >= minWc && Number(el?.wcAr) <= maxWc;
            })
            ?.filter((el) => {
              return String(el?.kplbn)
                .toUpperCase()
                .includes(inputPlbn.toUpperCase());
            })
            ?.filter((el, index) => {
              return index < bookPage * 20 && index >= (bookPage - 1) * 20;
            })
            ?.map((el) => {
              return el;
            })
    );
    setBookMaxPage(
      Math.ceil(
        data?.getBooksByBl
          ?.filter((el) => {
            return (
              el?.titleAr
                .toUpperCase()
                .includes(bookSearchWord.toUpperCase()) ||
              String(el?.books[0]?.isbn)
                .toUpperCase()
                .includes(bookSearchWord.toUpperCase()) ||
              el?.authorAr.toUpperCase().includes(bookSearchWord.toUpperCase())
            );
          })
          ?.filter((el) => {
            return Number(el?.wcAr) >= minWc && Number(el?.wcAr) <= maxWc;
          })
          ?.filter((el) => {
            return String(el?.kplbn)
              .toUpperCase()
              .includes(inputPlbn.toUpperCase());
          })?.length / 20
      )
    );
    setBookPage(1);
    setBookPageList(0);
  }, [data, bookSearchWord, minWc, maxWc]);

  useEffect(() => {
    setBookArray(
      data === undefined
        ? []
        : data?.getBooksByBl
            ?.filter((el) => {
              return (
                el?.titleAr
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase()) ||
                String(el?.books[0]?.isbn)
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase()) ||
                el?.authorAr
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase())
              );
            })
            ?.filter((el) => {
              return Number(el?.wcAr) >= minWc && Number(el?.wcAr) <= maxWc;
            })
            ?.filter((el) => {
              return String(el?.kplbn)
                .toUpperCase()
                .includes(inputPlbn.toUpperCase());
            })
            ?.filter((el, index) => {
              return index < bookPage * 20 && index >= (bookPage - 1) * 20;
            })
            ?.map((el) => {
              return el;
            })
    );
    setBookMaxPage(
      Math.ceil(
        data?.getBooksByBl
          ?.filter((el) => {
            return (
              el?.titleAr
                .toUpperCase()
                .includes(bookSearchWord.toUpperCase()) ||
              String(el?.books[0]?.isbn)
                .toUpperCase()
                .includes(bookSearchWord.toUpperCase()) ||
              el?.authorAr.toUpperCase().includes(bookSearchWord.toUpperCase())
            );
          })
          ?.filter((el) => {
            return String(el?.kplbn)
              .toUpperCase()
              .includes(inputPlbn.toUpperCase());
          })
          ?.filter((el) => {
            return Number(el?.wcAr) >= minWc && Number(el?.wcAr) <= maxWc;
          })?.length / 20
      )
    );
  }, [bookPage, bookSearchWord, minWc, maxWc, inputPlbn]);
  console.log(minWc, data, "data");

  return (
    <S.BooksWrapper>
      <S.BooksTitle>도서 관리</S.BooksTitle>
      <S.BooksTitleLine></S.BooksTitleLine>
      <S.SearchBox style={{ width: "95%", paddingRight: "20px" }}>
        <S.SearchTitle>도서 검색</S.SearchTitle>
        <S.SearchTag
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
              padding: "20px",
              display: "flex",
              height: "100px",
              backgroundColor: "#5AB0FF",
              color: "white",
              fontSize: "15px",
              fontWeight: "bold",
              borderRadius: "20px",
              flexDirection: "column",
            }}
          >
            <div style={{ marginBottom: "5px" }}>AR 점수</div>
            <div style={{ marginBottom: "5px" }}>
              <span>최소</span>
              <S.InputInput
                style={{ marginLeft: "10px", marginTop: "10px" }}
                type="number"
                onChange={(e) => {
                  setMinBl(Number(e.target.value));
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    refetch({ minBl, maxBl });
                  }
                }}
              ></S.InputInput>
            </div>
            <div style={{ marginBottom: "5px" }}>
              <span>최대</span>
              <S.InputInput
                style={{ marginLeft: "10px", marginTop: "10px" }}
                type="number"
                onChange={(e) => {
                  setMaxBl(Number(e.target.value));
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    refetch({ minBl, maxBl });
                  }
                }}
              ></S.InputInput>
            </div>
          </div>
          <div
            style={{
              boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
              padding: "20px",
              display: "flex",
              height: "100px",
              backgroundColor: "#FEA910",
              color: "white",
              fontSize: "15px",
              fontWeight: "bold",
              borderRadius: "20px",
              flexDirection: "column",
              margin: "0 0 0 15px",
            }}
          >
            <div style={{ marginBottom: "5px" }}>Word Count</div>
            <div style={{ marginBottom: "5px" }}>
              <span>최소</span>
              <S.InputInput
                type="number"
                style={{ marginLeft: "10px", marginTop: "10px" }}
                onChange={(e) => {
                  setMinWc(Number(e.target.value));
                }}
              ></S.InputInput>
            </div>
            <div>
              <span>최대</span>
              <S.InputInput
                type="number"
                style={{ marginLeft: "10px", marginTop: "10px" }}
                onChange={(e) => {
                  setMaxWc(
                    Number(e.target.value === "" ? 100000000 : e.target.value)
                  );
                }}
              ></S.InputInput>
            </div>
          </div>
          <div
            style={{
              boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.2)",
              padding: "20px",
              display: "flex",
              height: "100px",
              backgroundColor: "#772481",
              color: "white",
              fontSize: "15px",
              fontWeight: "bold",
              borderRadius: "20px",
              flexDirection: "column",
              margin: "0 0 0 15px",
            }}
          >
            <div>PLBN</div>
            <div>
              검색
              <S.InputInput
                type="number"
                style={{ marginLeft: "10px", marginTop: "10px" }}
                onChange={(e) => {
                  setInputPlbn(e.target.value);
                }}
              ></S.InputInput>
            </div>
          </div>
          <S.ModalAddButton
            onClick={() => {
              refetch({ minBl, maxBl });
            }}
            style={{ width: "50px", position: "absolute", right: "150px" }}
          >
            검색
          </S.ModalAddButton>
        </S.SearchTag>
        <S.SearchTag style={{ marginTop: "30px" }}>
          <div>
            <S.SearchInput
              type="text"
              placeholder="도서 제목, 바코드, 저자 등으로 검색해주세요."
              onChange={(e) => {
                setBookSearchWord(e.target.value);
              }}
            />
          </div>
        </S.SearchTag>
      </S.SearchBox>
      <S.CountNumber
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: "10px",
        }}
      >
        {(data !== undefined &&
          data?.getBooksByBl
            ?.filter((el) => {
              return (
                el?.titleAr
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase()) ||
                String(el?.books[0]?.isbn)
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase()) ||
                el?.authorAr
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase())
              );
            })
            ?.filter((el) => {
              return Number(el?.wcAr) >= minWc && Number(el?.wcAr) <= maxWc;
            }).length) !== 0 || undefined
          ? data?.getBooksByBl
              ?.filter((el) => {
                return (
                  el?.titleAr
                    .toUpperCase()
                    .includes(bookSearchWord.toUpperCase()) ||
                  String(el?.books[0]?.isbn)
                    .toUpperCase()
                    .includes(bookSearchWord.toUpperCase()) ||
                  el?.authorAr
                    .toUpperCase()
                    .includes(bookSearchWord.toUpperCase())
                );
              })
              ?.filter((el) => {
                return Number(el?.wcAr) >= minWc && Number(el?.wcAr) <= maxWc;
              })
              ?.filter((el) => {
                return String(el?.kplbn)
                  .toUpperCase()
                  .includes(inputPlbn.toUpperCase());
              }).length + "권"
          : ""}
      </S.CountNumber>
      <style>{`
            table {
              border-collapse: separate;
              border-spacing: 0;
              width: 100%;
            }
            th,
            td {
              padding: 6px 15px;
            }
            th {
              background: #42444e;
              color: #fff;
              text-align: left;
            }
            tr:first-child th:first-child {
              border-top-left-radius: 6px;
            }
            tr:first-child th:last-child {
              border-top-right-radius: 6px;
            }
            td {
              border-right: 1px solid #c6c9cc;
              border-bottom: 1px solid #c6c9cc;
            }
            td:first-child {
              border-left: 1px solid #c6c9cc;
            }
            tr:nth-child(even) td {
              background: #eaeaed;
            }
            tr:last-child td:first-child {
              border-bottom-left-radius: 6px;
            }
            tr:last-child td:last-child {
              border-bottom-right-radius: 6px;
            }
          `}</style>
      <table>
        {bookArray.length === 0 ? (
          <></>
        ) : (
          <thead>
            <tr>
              <th>바코드</th>
              <th>도서 제목</th>
              <th>저자</th>
              <th>AR QUIZ No.</th>
              <th>AR</th>
              <th>Lexile</th>
              <th>Word Count</th>
              <th>도서 위치</th>
              <th>상세 보기</th>
            </tr>
          </thead>
        )}
        <tbody>
          {bookArray?.map((el) => {
            return (
              <tr>
                <td>{el.books[0].isbn}</td>
                <td>{longWord(el.titleAr)}</td>
                <td>{el.authorAr}</td>
                <td>{el.arQuiz}</td>
                <td>{el.bl}</td>
                <td>{el.lexileLex ?? el.lexileAr}</td>
                <td>{el.wcAr}</td>
                <td>
                  {el.books[0].place === null ? "null" : el.books[0].place}
                </td>
                <td>
                  <BookOutlined
                    onClick={() => {
                      setDetailToggle(true);
                      setSelectBook(el);
                    }}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          width: "100%",
        }}
      >
        {data === undefined || data?.getBooksByBl.length === 0 ? (
          <></>
        ) : (
          <>
            <button
              onClick={() => {
                console.log(bookPageList);
                if (bookPage - 10 > 0) {
                  setBookPage(bookPage - 10);
                }
              }}
            >
              {"<<"}
            </button>
            <button
              onClick={() => {
                if (bookPage > 1) {
                  setBookPage(bookPage - 1);
                }
              }}
            >
              {"<"}
            </button>
          </>
        )}
        {Array.from({ length: bookMaxPage })
          // .filter((_, index) => {
          //   return (
          //     index === 0 ||
          //     index === bookMaxPage ||
          //     (index >= bookPage && index <= bookPage + 1)
          //   );
          // })
          .map((_, index) => {
            if (
              index === 0 ||
              index === bookMaxPage - 1 ||
              (index + 3 >= bookPage && index - 1 <= bookPage)
            ) {
              return (
                <>
                  {bookPage > 4 && bookPage === index + 3 ? (
                    <span
                      style={{
                        width: "17px",
                        color: "black",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      ...
                    </span>
                  ) : (
                    <></>
                  )}
                  <span
                    onClick={() => {
                      setBookPage(index + 1);
                    }}
                    style={
                      index + 1 + bookPageList * 10 === bookPage
                        ? {
                            width: "27px",
                            color: "white",
                            backgroundColor: "purple",
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }
                        : {
                            width: "27px",
                            color: "black",
                            border: "1px solid black",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }
                    }
                  >
                    {index + 1}
                  </span>
                  {bookPage < bookMaxPage - 3 && bookPage === index - 1 ? (
                    <span
                      style={{
                        width: "17px",
                        color: "black",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      ...
                    </span>
                  ) : (
                    <></>
                  )}
                </>
              );
            }
          })}
        {data === undefined || data?.getBooksByBl.length === 0 ? (
          <></>
        ) : (
          <>
            <button
              onClick={() => {
                if (bookPage < bookMaxPage) {
                  setBookPage(bookPage + 1);
                }
              }}
            >
              {">"}
            </button>
            <button
              onClick={() => {
                console.log(bookPageList);
                if (bookPage + 10 < bookMaxPage) {
                  setBookPage(bookPage + 10);
                }
              }}
            >
              {">>"}
            </button>
          </>
        )}
      </div>
      {detailToggle ? (
        <Modal
          open={detailToggle}
          width={"55vw"}
          height={"50vh"}
          footer={null}
          closable={false}
          onCancel={() => {
            setDetailToggle(false);
          }}
        >
          <S.BooksTitle>도서 정보</S.BooksTitle>
          <S.BooksTitle></S.BooksTitle>
          <S.ModalWrapper>
            <S.ModalInputBox>
              <div>도서 제목</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectBook.titleAr}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>저자</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectBook.authorAr}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>바코드</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectBook.books[0].isbn}
              ></S.InputInput>
            </S.ModalInputBox>
            {/* <S.ModalInputBox>
              <div>F/NF</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={"Fiction"}
              ></S.InputInput>
            </S.ModalInputBox> */}
            <S.ModalInputBox>
              <div>AR Quiz No.</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectBook.arQuiz}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>AR</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectBook.bl}
              ></S.InputInput>
            </S.ModalInputBox>

            <S.ModalInputBox>
              <div>Lexile</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectBook.lexileLex ?? selectBook.lexileAr}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>Word Count</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectBook.wcAr}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>도서 위치</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectBook.books[0].place ?? "null"}
              ></S.InputInput>
            </S.ModalInputBox>
          </S.ModalWrapper>
          {/* <S.ModalButtonBox>
            <S.ModalCancelButton onClick={onClickCancel}>
              취소
            </S.ModalCancelButton>
            <S.ModalOkButton onClick={onClickOk}>확인</S.ModalOkButton>
          </S.ModalButtonBox> */}
        </Modal>
      ) : (
        <></>
      )}
    </S.BooksWrapper>
  );
}
