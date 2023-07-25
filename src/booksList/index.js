import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as S from "./booksList.style";

const ChildrenData = [
  {
    name: "철수",
    start: new Date(2023, 6, 20, 18, 16),
    end: new Date(2023, 6, 20, 18, 17),
    classTime: 120,
    status: "결석",
    arrivalTime: "",
    memo: "",
    bookingBooks: 5,
    id: 1,
  },
  {
    name: "영희",
    start: new Date(2023, 6, 20, 18, 0),
    end: new Date(2023, 6, 20, 18, 16),
    classTime: 120,
    status: "등원",
    arrivalTime: "13:58",
    memo: "",
    bookingBooks: 0,
    id: 2,
  },
  {
    name: "짱구",
    start: new Date(2023, 6, 20, 15, 45),
    end: new Date(2023, 6, 20, 15, 55),
    classTime: 90,
    status: "지각, 하원",
    arrivalTime: "10:03",
    memo: "",
    bookingBooks: 1,
    id: 3,
  },
  {
    name: "장미",
    start: new Date(2023, 6, 20, 17, 0),
    end: new Date(2023, 6, 20, 17, 5),
    classTime: 90,
    status: "결석",
    arrivalTime: "",
    memo: "",
    bookingBooks: 0,
    id: 4,
  },
  {
    name: "맹구",
    start: new Date(2023, 6, 20, 15, 43),
    end: new Date(2023, 6, 20, 15, 45),
    classTime: 60,
    status: "결석",
    arrivalTime: "",
    memo: "",
    bookingBooks: 0,
    id: 5,
  },
];

const BookData = [
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
];

export default function BookListPage() {
  const router = useRouter();
  const [id, setId] = useState(router.query.id);
  useEffect(() => {
    setId(router.query.id);
  }, [router]);
  return (
    <>
      {ChildrenData.map((el) => {
        return String(el.id) === id ? <S.NameTag>{el.name}</S.NameTag> : <></>;
      })}
      <S.BooksBox>
        <S.BooksTag>예약 도서</S.BooksTag>
        <S.BooksTag>
          <S.TableElement
            style={{ width: "100%", backgroundColor: "purple", color: "white" }}
          >
            이름
          </S.TableElement>
          <S.TableElement
            style={{ width: "70%", backgroundColor: "purple", color: "white" }}
          >
            저자
          </S.TableElement>
          <S.TableElement
            style={{ width: "70%", backgroundColor: "purple", color: "white" }}
          >
            바코드
          </S.TableElement>
          <S.TableElement
            style={{ width: "70%", backgroundColor: "purple", color: "white" }}
          >
            Word Count
          </S.TableElement>
          <S.TableElement
            style={{ width: "70%", backgroundColor: "purple", color: "white" }}
          >
            lexile
          </S.TableElement>
        </S.BooksTag>
        {BookData.map((el) => {
          return (
            <S.BooksTag>
              <S.TableElement style={{ width: "100%" }}>
                {el.name}
              </S.TableElement>
              <S.TableElement style={{ width: "70%" }}>
                {el.author}
              </S.TableElement>
              <S.TableElement style={{ width: "70%" }}>
                {el.barcode}
              </S.TableElement>
              <S.TableElement style={{ width: "70%" }}>{el.wc}</S.TableElement>
              <S.TableElement style={{ width: "70%" }}>
                {el.lexile}
              </S.TableElement>
            </S.BooksTag>
          );
        })}
      </S.BooksBox>
      <S.BooksBox>
        <S.BooksTag>추천 도서</S.BooksTag>
        <S.BooksTag>
          <S.TableElement
            style={{ width: "100%", backgroundColor: "purple", color: "white" }}
          >
            이름
          </S.TableElement>
          <S.TableElement
            style={{ width: "70%", backgroundColor: "purple", color: "white" }}
          >
            저자
          </S.TableElement>
          <S.TableElement
            style={{ width: "70%", backgroundColor: "purple", color: "white" }}
          >
            바코드
          </S.TableElement>
          <S.TableElement
            style={{ width: "70%", backgroundColor: "purple", color: "white" }}
          >
            Word Count
          </S.TableElement>
          <S.TableElement
            style={{ width: "70%", backgroundColor: "purple", color: "white" }}
          >
            lexile
          </S.TableElement>
        </S.BooksTag>
        {BookData.map((el) => {
          return (
            <S.BooksTag>
              <S.TableElement style={{ width: "100%" }}>
                {el.name}
              </S.TableElement>
              <S.TableElement style={{ width: "70%" }}>
                {el.author}
              </S.TableElement>
              <S.TableElement style={{ width: "70%" }}>
                {el.barcode}
              </S.TableElement>
              <S.TableElement style={{ width: "70%" }}>{el.wc}</S.TableElement>
              <S.TableElement style={{ width: "70%" }}>
                {el.lexile}
              </S.TableElement>
            </S.BooksTag>
          );
        })}
      </S.BooksBox>
    </>
  );
}
