import * as S from "./books.style";
import { BookOutlined } from "@ant-design/icons";
import { addComma, longWord } from "../../commons/library/library";
import { useState } from "react";
import { Modal } from "antd";
import { v4 as uuidv4 } from "uuid";

export default function BookPage() {
  const [selectedBook, setSelectedBook] = useState({});
  const [detailToggle, setDetailToggle] = useState(false);
  const [searchWord, setSearchWord] = useState("");
  const [searchType, setSearchType] = useState("name");

  const [array, setArray] = useState([
    {
      name: "The Cloud Kingdom",
      barcode: "PE201039901",
      ISBN: "978133807177",
      author: "Kartrina Charman",
      ARQuizNum: "505157",
      AR: 3.4,
      lexile: "600L",
      wc: 6061,
      position: "C34-03-014",
      AR_IL: "LG",
    },
    {
      name: "The Cloud Kingdom",
      barcode: "PE201039902",
      ISBN: "978133807177",
      author: "Kartrina Charman",
      ARQuizNum: "505157",
      AR: 3.4,
      lexile: "600L",
      wc: 6061,
      position: "C34-03-015",
      AR_IL: "LG",
    },
    {
      name: "#01:Dinosaurs before dark(Magic.............)",
      barcode: "PE2000001705",
      ISBN: "9781338224283",
      author: "Mary Pope Osborne",
      ARQuizNum: "6311",
      AR: 2.6,
      lexile: "510L",
      wc: 4750,
      position: "C26-01-015",
      AR_IL: "LG",
    },
  ]);

  const onChangeSearchType = (event) => {
    setSearchType(event.target.value);
  };
  const onChangeSearch = (event) => {
    setSearchWord(event.target.value);
  };

  const onClickBooks = (el) => () => {
    setSelectedBook(el);
    setDetailToggle(true);
  };
  const onClickOk = () => {
    setDetailToggle(false);
  };
  const onClickCancel = () => {
    setDetailToggle(false);
  };

  return (
    <S.BooksWrapper>
      <S.BooksTitle>도서 관리</S.BooksTitle>
      <S.BooksTitleLine></S.BooksTitleLine>
      <S.SearchBox>
        <S.SearchTitle>도서 검색</S.SearchTitle>
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
              onChange={onChangeSearch}
            />
          </div>
        </S.SearchTag>
      </S.SearchBox>
      <S.CountNumber>{"총 " + array.length + "권"}</S.CountNumber>
      <S.Table>
        <S.TableHeaderRound>
          <S.TableHeadLeft>바코드</S.TableHeadLeft>
          <S.TableHead>ISBN</S.TableHead>
          <S.TableHead>도서 제목</S.TableHead>
          <S.TableHead>저자</S.TableHead>
          <S.TableHead>AR Quiz No.</S.TableHead>
          <S.TableHead>AR</S.TableHead>
          <S.TableHead>Lexile</S.TableHead>
          <S.TableHead style={{ width: "85%" }}>Word Count</S.TableHead>
          <S.TableHead style={{ width: "85%" }}>도서 위치</S.TableHead>
          <S.TableHeadRight style={{ width: "70%" }}>
            상세 보기
          </S.TableHeadRight>
        </S.TableHeaderRound>

        {array
          .filter((el) => {
            return el[searchType]
              .toUpperCase()
              .includes(searchWord.toUpperCase());
          })
          .map((el) => {
            return (
              <S.TableRound key={uuidv4()}>
                <S.TableHeadLeft>{el.barcode}</S.TableHeadLeft>
                <S.TableHead>{el.ISBN}</S.TableHead>
                <S.TableHead>{longWord(el.name)}</S.TableHead>
                <S.TableHead>{el.author}</S.TableHead>
                <S.TableHead>{el.ARQuizNum}</S.TableHead>
                <S.TableHead>{el.AR}</S.TableHead>
                <S.TableHead>{el.lexile}</S.TableHead>
                <S.TableHead style={{ width: "85%" }}>
                  {addComma(el.wc)}
                </S.TableHead>
                <S.TableHead style={{ width: "85%" }}>
                  {el.position}
                </S.TableHead>
                <S.TableHeadRight style={{ width: "70%" }}>
                  <BookOutlined onClick={onClickBooks(el)} />
                </S.TableHeadRight>
              </S.TableRound>
            );
          })}
      </S.Table>
      {detailToggle ? (
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
      )}
    </S.BooksWrapper>
  );
}
