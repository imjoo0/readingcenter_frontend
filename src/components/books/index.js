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
              return el?.titleAr.includes(bookSearchWord);
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
        data?.getBooksByBl?.filter((el) => {
          return el?.titleAr.includes(bookSearchWord);
        })?.length / 20
      )
    );
    setBookPage(1);
    setBookPageList(0);
  }, [data, bookSearchWord]);

  useEffect(() => {
    setBookArray(
      data === undefined
        ? []
        : data?.getBooksByBl
            ?.filter((el) => {
              return el?.titleAr
                .toUpperCase()
                .includes(bookSearchWord.toUpperCase());
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
        data?.getBooksByBl?.filter((el) => {
          return el?.titleAr
            .toUpperCase()
            .includes(bookSearchWord.toUpperCase());
        })?.length / 20
      )
    );
  }, [bookPage, bookSearchWord]);
  console.log(data, "data");

  return (
    <S.BooksWrapper>
      <S.BooksTitle>도서 관리</S.BooksTitle>
      <S.BooksTitleLine></S.BooksTitleLine>
      <S.SearchBox>
        <S.SearchTitle>도서 검색</S.SearchTitle>
        <S.SearchTag
          style={{
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          <S.SearchTitle></S.SearchTitle>
          <div>
            <span>최소 AR 점수</span>
            <S.SearchInput
              type="number"
              onChange={(e) => {
                setMinBl(Number(e.target.value));
              }}
            ></S.SearchInput>
          </div>
          <div>
            <span>최대 AR 점수</span>
            <S.SearchInput
              type="number"
              onChange={(e) => {
                setMaxBl(Number(e.target.value));
              }}
            ></S.SearchInput>
          </div>
          <button
            onClick={() => {
              refetch({ minBl, maxBl });
            }}
          >
            검색
          </button>
        </S.SearchTag>
        <S.SearchTag>
          <div>
            <S.SearchSelect onChange={onChangeSearchType}>
              <option value={"name"}>도서 제목</option>
              <option value={"barcode"}>바코드</option>
              <option value={"author"}>저자</option>
              <option value={"ISBN"}>ISBN</option>
            </S.SearchSelect>
            <S.SearchInput
              type="text"
              placeholder=" 도서 제목, 바코드, 저자, isbn 중 선택하여 검색해주세요."
              onChange={(e) => {
                setBookSearchWord(e.target.value);
              }}
            />
          </div>
        </S.SearchTag>
      </S.SearchBox>
      <S.CountNumber>
        {"총 " +
          data?.getBooksByBl?.filter((el) => {
            return el?.titleAr
              .toUpperCase()
              .includes(bookSearchWord.toUpperCase());
          }).length +
          "권"}
      </S.CountNumber>

      <table>
        {bookArray.length === 0 ? (
          <></>
        ) : (
          <thead>
            <tr>
              <th>도서 제목</th>
              <th>저자</th>
              <th>AR QUIZ No.</th>
              <th>AR</th>
              <th>Lexile</th>
              <th>도서 위치</th>
              <th>상세 보기</th>
            </tr>
          </thead>
        )}
        <tbody>
          {bookArray?.map((el) => {
            return (
              <tr>
                <></>
                <td>{longWord(el.titleAr)}</td>
                <td>{el.authorAr}</td>
                <td>{el.arQuiz}</td>
                <td>{el.bl}</td>
                <td>{el.lexileLex}</td>
                <td>
                  {el.books[0].place === null ? "null" : el.books[0].place}
                </td>
                <td>
                  <BookOutlined />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ display: "flex" }}>
        <span
          onClick={() => {
            console.log(bookPageList);
            if (bookPageList > 0) {
              setBookPageList(bookPageList - 1);
              setBookPage((bookPageList - 1) * 10 + 1);
            }
          }}
        >
          {"<"}
        </span>
        {Array.from({ length: bookMaxPage })
          .filter((_, index) => {
            return (
              index + 1 > bookPageList * 10 &&
              index + 1 <= (bookPageList + 1) * 10
            );
          })
          .map((_, index) => {
            return (
              <span
                onClick={() => {
                  setBookPage(index + 1 + bookPageList * 10);
                }}
                style={
                  index + 1 + bookPageList * 10 === bookPage
                    ? {
                        width: "17px",
                        color: "white",
                        backgroundColor: "purple",
                        border: "1px solid black",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }
                    : {
                        width: "17px",
                        color: "black",
                        border: "1px solid black",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }
                }
              >
                {index + 1 + 10 * bookPageList}
              </span>
            );
          })}
        <span
          onClick={() => {
            console.log(bookPageList);
            if ((bookPageList + 1) * 10 < bookMaxPage) {
              setBookPageList(bookPageList + 1);
              setBookPage((bookPageList + 1) * 10 + 1);
            }
          }}
        >
          {">"}
        </span>
      </div>
      {/* {detailToggle ? (
        <Modal
          open={detailToggle}
          width={"55vw"}
          height={"50vh"}
          footer={null}
          closable={false}
        >
          <S.BooksTitle>도서 정보</S.BooksTitle>
          <S.BooksTitle></S.BooksTitle>
          <S.ModalWrapper>
            <S.ModalInputBox>
              <div>바코드</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectedBook.barcode}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>도서 제목</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectedBook.name}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>저자</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectedBook.author}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>ISBN</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectedBook.ISBN}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>F/NF</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={"Fiction"}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>AR Quiz No.</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectedBook.ARQuizNum}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>AR</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectedBook.AR}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>AR IL</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectedBook.AR_IL}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>Lexile</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectedBook.lexile}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>Word Count</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectedBook.wc}
              ></S.InputInput>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>도서 위치</div>
              <S.InputInput
                type="text"
                style={{ width: "80%" }}
                defaultValue={selectedBook.position}
              ></S.InputInput>
            </S.ModalInputBox>
          </S.ModalWrapper>
          <S.ModalButtonBox>
            <S.ModalCancelButton onClick={onClickCancel}>
              취소
            </S.ModalCancelButton>
            <S.ModalOkButton onClick={onClickOk}>확인</S.ModalOkButton>
          </S.ModalButtonBox>
        </Modal>
      ) : (
        <></>
      )} */}
    </S.BooksWrapper>
  );
}
