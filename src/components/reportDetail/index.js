import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { STUDENT_RECORD, GET_STUDENT } from "./reportDetail.query";
import {
  addComma,
  arFrame,
  lexileFrame,
  longAuthor,
  longTitle,
  longWord,
} from "@/src/commons/library/library";
import * as S from "./reportDetail.style";
import { useEffect, useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Modal } from "antd";

export default function ReportDetailPage() {
  const router = useRouter();
  const { data: recordData } = useQuery(STUDENT_RECORD, {
    variables: { studentId: Number(router.query.id) },
  });
  const { data: studentData } = useQuery(GET_STUDENT, {
    variables: {
      userId: Number(router.query.id),
      academyId: Number(router.query.branch),
    },
  });
  const [sortedRecord, setSortedRecord] = useState([]);
  const [sortType, setSortType] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [maxPage, setMaxPage] = useState(0);
  const [arStart, setArStart] = useState("");
  const [arEnd, setArEnd] = useState("");
  const [lexileStart, setLexileStart] = useState("");
  const [lexileEnd, setLexileEnd] = useState("");
  const [search, setSearch] = useState("");
  const [title, setTitle] = useState("");
  const [viewTitle, setViewTitle] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const pages = 20;

  useEffect(() => {
    setMaxPage(
      Math.ceil(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })?.length / pages
      )
    );
    if (sortType === "title") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const nameA = a?.book?.titleAr.toUpperCase();
            const nameB = b?.book?.titleAr.toUpperCase();
            if (nameA < nameB) {
              return -1;
            } else if (nameA > nameB) {
              return 1;
            } else {
              return 0;
            }
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "titleReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const nameA = a?.book?.titleAr.toUpperCase();
            const nameB = b?.book?.titleAr.toUpperCase();
            if (nameA < nameB) {
              return 1;
            } else if (nameA > nameB) {
              return -1;
            } else {
              return 0;
            }
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "ar") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.book?.bl);
            const arB = Number(b?.book?.bl);
            return arA - arB;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "arReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.book?.bl);
            const arB = Number(b?.book?.bl);
            return arB - arA;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
      )?.map((el) => el);
    } else if (sortType === "lexile") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            return (
              (a?.book.lexileLex ?? a?.book.lexileAr) -
              (b?.book.lexileLex ?? b?.book.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.book.lexileLex === null &&
              a?.book.lexileAr === null &&
              (b?.book.lexileLex !== null || b?.book.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.book.lexileLex === null &&
              b?.book.lexileAr === null &&
              (a?.book.lexileLex !== null || a?.book.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => {
            return el;
          })
      );
    } else if (sortType === "lexileReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            return (
              (b?.book.lexileLex ?? b?.book.lexileAr) -
              (a?.book.lexileLex ?? a?.book.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.book.lexileLex === null &&
              a?.book.lexileAr === null &&
              (b?.book.lexileLex !== null || b?.book.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.book.lexileLex === null &&
              b?.book.lexileAr === null &&
              (a?.book.lexileLex !== null || a?.book.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => {
            return el;
          })
          ?.map((el) => el)
      );
    } else if (sortType === "wc") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.book?.wcAr);
            const arB = Number(b?.book?.wcAr);
            return arA - arB;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "wcReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.book?.wcAr);
            const arB = Number(b?.book?.wcAr);
            return arB - arA;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
      )?.map((el) => el);
    } else if (sortType === "arCorrect") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.arCorrect);
            const arB = Number(b?.arCorrect);
            return arA - arB;
          })
          ?.sort((a, b) => {
            if (a?.arCorrect === null && b?.arCorrect !== null) {
              return 1;
            }
            if (b?.arCorrect === null && a?.arCorrect !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "arCorrectReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.arCorrect);
            const arB = Number(b?.arCorrect);
            return arB - arA;
          })
          ?.sort((a, b) => {
            if (a?.arCorrect === null && b?.arCorrect !== null) {
              return 1;
            }
            if (b?.arCorrect === null && a?.arCorrect !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
      )?.map((el) => el);
    } else if (sortType === "litCorrect") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.litCorrect);
            const arB = Number(b?.litCorrect);
            return arA - arB;
          })
          ?.sort((a, b) => {
            if (a?.litCorrect === null && b?.litCorrect !== null) {
              return 1;
            }
            if (b?.litCorrect === null && a?.litCorrect !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "litCorrectReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.litCorrect);
            const arB = Number(b?.litCorrect);
            return arB - arA;
          })
          ?.sort((a, b) => {
            if (a?.litCorrect === null && b?.litCorrect !== null) {
              return 1;
            }
            if (b?.litCorrect === null && a?.litCorrect !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
      )?.map((el) => el);
    } else if (sortType === "arDate") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = new Date(a?.arDate);
            const arB = new Date(b?.arDate);
            return arA - arB;
          })
          ?.sort((a, b) => {
            if (a?.arDate === null && b?.arDate !== null) {
              return 1;
            }
            if (b?.arDate === null && a?.arDate !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "arDateReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = new Date(a?.arDate);
            const arB = new Date(b?.arDate);
            return arB - arA;
          })
          ?.sort((a, b) => {
            if (a?.arDate === null && b?.arDate !== null) {
              return 1;
            }
            if (b?.arDate === null && a?.arDate !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
      )?.map((el) => el);
    } else if (sortType === "litDate") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = new Date(a?.litDate);
            const arB = new Date(b?.litDate);
            return arA - arB;
          })
          ?.sort((a, b) => {
            if (a?.litDate === null && b?.litDate !== null) {
              return 1;
            }
            if (b?.litDate === null && a?.litDate !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "litDateReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = new Date(a?.litDate);
            const arB = new Date(b?.litDate);
            return arB - arA;
          })
          ?.sort((a, b) => {
            if (a?.litDate === null && b?.litDate !== null) {
              return 1;
            }
            if (b?.litDate === null && a?.litDate !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
      )?.map((el) => el);
    } else {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = new Date(a?.arDate);
            const arB = new Date(b?.arDate);
            const litA = new Date(a?.litDate);
            const litB = new Date(b?.litDate);
            let conA;
            let conB;
            if (arA - litA > 0) {
              conA = arA;
            } else {
              conA = litA;
            }
            if (arB - litB > 0) {
              conB = arB;
            } else {
              conB = litB;
            }
            return conB - conA;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    }
  }, [recordData, sortType, pageNumber]);

  useEffect(() => {
    setMaxPage(
      Math.ceil(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })?.length / pages
      )
    );
    if (sortType === "title") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const nameA = a?.book?.titleAr.toUpperCase();
            const nameB = b?.book?.titleAr.toUpperCase();
            if (nameA < nameB) {
              return -1;
            } else if (nameA > nameB) {
              return 1;
            } else {
              return 0;
            }
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "titleReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const nameA = a?.book?.titleAr.toUpperCase();
            const nameB = b?.book?.titleAr.toUpperCase();
            if (nameA < nameB) {
              return 1;
            } else if (nameA > nameB) {
              return -1;
            } else {
              return 0;
            }
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "ar") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.book?.bl);
            const arB = Number(b?.book?.bl);
            return arA - arB;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "arReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.book?.bl);
            const arB = Number(b?.book?.bl);
            return arB - arA;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
      )?.map((el) => el);
    } else if (sortType === "lexile") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            return (
              (a?.book.lexileLex ?? a?.book.lexileAr) -
              (b?.book.lexileLex ?? b?.book.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.book.lexileLex === null &&
              a?.book.lexileAr === null &&
              (b?.book.lexileLex !== null || b?.book.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.book.lexileLex === null &&
              b?.book.lexileAr === null &&
              (a?.book.lexileLex !== null || a?.book.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => {
            return el;
          })
      );
    } else if (sortType === "lexileReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            return (
              (b?.book.lexileLex ?? b?.book.lexileAr) -
              (a?.book.lexileLex ?? a?.book.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.book.lexileLex === null &&
              a?.book.lexileAr === null &&
              (b?.book.lexileLex !== null || b?.book.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.book.lexileLex === null &&
              b?.book.lexileAr === null &&
              (a?.book.lexileLex !== null || a?.book.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => {
            return el;
          })
          ?.map((el) => el)
      );
    } else if (sortType === "wc") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.book?.wcAr);
            const arB = Number(b?.book?.wcAr);
            return arA - arB;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "wcReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.book?.wcAr);
            const arB = Number(b?.book?.wcAr);
            return arB - arA;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
      )?.map((el) => el);
    } else if (sortType === "arCorrect") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.arCorrect);
            const arB = Number(b?.arCorrect);
            return arA - arB;
          })
          ?.sort((a, b) => {
            if (a?.arCorrect === null && b?.arCorrect !== null) {
              return 1;
            }
            if (b?.arCorrect === null && a?.arCorrect !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "arCorrectReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.arCorrect);
            const arB = Number(b?.arCorrect);
            return arB - arA;
          })
          ?.sort((a, b) => {
            if (a?.arCorrect === null && b?.arCorrect !== null) {
              return 1;
            }
            if (b?.arCorrect === null && a?.arCorrect !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
      )?.map((el) => el);
    } else if (sortType === "litCorrect") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.litCorrect);
            const arB = Number(b?.litCorrect);
            return arA - arB;
          })
          ?.sort((a, b) => {
            if (a?.litCorrect === null && b?.litCorrect !== null) {
              return 1;
            }
            if (b?.litCorrect === null && a?.litCorrect !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "litCorrectReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = Number(a?.litCorrect);
            const arB = Number(b?.litCorrect);
            return arB - arA;
          })
          ?.sort((a, b) => {
            if (a?.litCorrect === null && b?.litCorrect !== null) {
              return 1;
            }
            if (b?.litCorrect === null && a?.litCorrect !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
      )?.map((el) => el);
    } else if (sortType === "arDate") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = new Date(a?.arDate);
            const arB = new Date(b?.arDate);
            return arA - arB;
          })
          ?.sort((a, b) => {
            if (a?.arDate === null && b?.arDate !== null) {
              return 1;
            }
            if (b?.arDate === null && a?.arDate !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "arDateReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = new Date(a?.arDate);
            const arB = new Date(b?.litDate);
            return arB - arA;
          })
          ?.sort((a, b) => {
            if (a?.arDate === null && b?.arDate !== null) {
              return 1;
            }
            if (b?.arDate === null && a?.arDate !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
      )?.map((el) => el);
    } else if (sortType === "litDate") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = new Date(a?.litDate);
            const arB = new Date(b?.litDate);
            return arA - arB;
          })
          ?.sort((a, b) => {
            if (a?.litDate === null && b?.litDate !== null) {
              return 1;
            }
            if (b?.litDate === null && a?.litDate !== null) {
              return -1;
            }
            return 0;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    } else if (sortType === "litDateReverse") {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = new Date(
              Date(a?.litDate) - Date(a?.arDate) > 0 ? a?.litDate : a?.arDate
            );
            const arB = new Date(
              Date(b?.litDate) - Date(b?.arDate) > 0 ? b?.litDate : b?.arDate
            );
            return arA - arB;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
      )?.map((el) => el);
    } else {
      setSortedRecord(
        recordData?.studentBookRecord
          ?.filter((el) => {
            const start = new Date(arStart);
            const elDate = new Date(el?.arDate);
            if (arStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(arEnd);
            const elDate = new Date(el?.arDate);
            if (arEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const start = new Date(lexileStart);
            const elDate = new Date(el?.litDate);
            if (lexileStart !== "" && elDate - start < 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            const end = new Date(lexileEnd);
            const elDate = new Date(el?.litDate);
            if (lexileEnd !== "" && elDate - end > 0) {
              return false;
            } else {
              return true;
            }
          })
          ?.filter((el) => {
            return (
              el?.book?.titleAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              el?.book?.authorAr
                ?.toUpperCase()
                ?.includes(search.toUpperCase()) ||
              String(el?.book?.arQuiz)?.includes(search)
            );
          })
          ?.sort((a, b) => {
            const arA = new Date(a?.arDate);
            const arB = new Date(b?.arDate);
            const litA = new Date(a?.litDate);
            const litB = new Date(b?.litDate);
            let conA;
            let conB;
            if (arA - litA > 0) {
              conA = arA;
            } else {
              conA = litA;
            }
            if (arB - litB > 0) {
              conB = arB;
            } else {
              conB = litB;
            }
            return conB - conA;
          })
          ?.filter((_, index) => {
            return (
              index >= pages * pageNumber && (pageNumber + 1) * pages > index
            );
          })
          ?.map((el) => el)
      );
    }
  }, [arEnd, arStart, lexileEnd, lexileStart, search]);

  const onClickSortType = (type) => () => {
    setSortType(type);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = e.clientX + 10;
      const y = e.clientY;
      setMousePosition({ x, y });
    };
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <S.PageWrapper>
      <S.ReportDetailTitle>
        {studentData?.userDetails?.profile?.korName +
          "(" +
          studentData?.userDetails?.profile?.engName +
          ")" +
          " 읽은 도서 목록"}
      </S.ReportDetailTitle>
      <S.ReportFilterBox>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "30rem",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div style={{ fontSize: "15px" }}>AR 퀴즈 날짜</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #333333",
              borderRadius: "10px",
              padding: "5px",
              width: "22rem",
            }}
          >
            <div>
              시작일 :
              <input
                type="date"
                max={"2100-12-31"}
                onChange={(e) => {
                  setArStart(e.target.value);
                }}
                style={{
                  border: "none",
                  fontFamily: "Spoqa Han Sans Neo",
                  fontSize: "15px",
                }}
              ></input>
            </div>
            <div>
              종료일 :
              <input
                type="date"
                onChange={(e) => {
                  setArEnd(e.target.value);
                }}
                style={{
                  border: "none",
                  fontFamily: "Spoqa Han Sans Neo",
                  fontSize: "15px",
                }}
                max={"2100-12-31"}
              ></input>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "30rem",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div style={{ fontSize: "15px" }}>Lexile 퀴즈 날짜</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #333333",
              borderRadius: "10px",
              padding: "5px",
              width: "22rem",
            }}
          >
            <div>
              시작일 :
              <input
                type="date"
                max={"2100-12-31"}
                onChange={(e) => {
                  setLexileStart(e.target.value);
                }}
                style={{
                  border: "none",
                  fontFamily: "Spoqa Han Sans Neo",
                  fontSize: "15px",
                }}
              ></input>
            </div>
            <div>
              종료일 :
              <input
                type="date"
                onChange={(e) => {
                  setLexileEnd(e.target.value);
                }}
                style={{
                  border: "none",
                  fontFamily: "Spoqa Han Sans Neo",
                  fontSize: "15px",
                }}
                max={"2100-12-31"}
              ></input>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "30rem",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div style={{ fontSize: "15px" }}>검색</div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "1px solid #333333",
              borderRadius: "10px",
              padding: "5px",
              width: "22rem",
            }}
          >
            <div>
              <input
                type="text"
                max={"2100-12-31"}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                style={{
                  border: "none",
                  fontFamily: "Spoqa Han Sans Neo",
                  fontSize: "15px",
                  width: "20rem",
                }}
              ></input>
            </div>
          </div>
        </div>
      </S.ReportFilterBox>
      <style>{`
              table {
              border-collapse: separate;
              border-spacing: 0;
              border-radius: 0.125rem;
              border: 1px solid #DBDDE1;
              width: 100%;
              margin-bottom:2.5rem;
            }
            thead{
              border-radius: 0.25rem 0.25rem 0rem 0rem;
              background: #F7F8FA;
            }
            th{
              border: 0.8px solid #DBDDE1;
              padding: 6px 1.5rem;
              font-size: 0.875rem;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
              text-align: center;
            }
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
            <th rowSpan={2}>
              제목{" "}
              {sortType === "title" ? (
                <UpOutlined onClick={onClickSortType("titleReverse")} />
              ) : (
                <DownOutlined onClick={onClickSortType("title")} />
              )}
            </th>
            <th style={{ width: "10rem" }} rowSpan={2}>
              저자
            </th>
            <th style={{ width: "3.6rem" }} rowSpan={2}>
              AR Quiz{" "}
            </th>

            <th style={{ width: "2.3rem" }} rowSpan={2}>
              AR{" "}
              {sortType === "ar" ? (
                <UpOutlined onClick={onClickSortType("arReverse")} />
              ) : (
                <DownOutlined onClick={onClickSortType("ar")} />
              )}
            </th>
            <th style={{ width: "3.5rem" }} rowSpan={2}>
              Lexile{" "}
              {sortType === "lexile" ? (
                <UpOutlined onClick={onClickSortType("lexileReverse")} />
              ) : (
                <DownOutlined onClick={onClickSortType("lexile")} />
              )}
            </th>
            <th rowSpan={2} style={{ width: "3.5rem" }}>
              WC
              {sortType === "wc" ? (
                <UpOutlined onClick={onClickSortType("wcReverse")} />
              ) : (
                <DownOutlined onClick={onClickSortType("wc")} />
              )}
            </th>
            <th colSpan={2}>정답률 </th>
            <th colSpan={2}>날짜</th>
          </tr>
          <tr>
            <th style={{ width: "3.3rem" }}>
              AR
              {sortType === "arCorrect" ? (
                <UpOutlined onClick={onClickSortType("arCorrectReverse")} />
              ) : (
                <DownOutlined onClick={onClickSortType("arCorrect")} />
              )}
            </th>
            <th style={{ width: "3.3rem" }}>
              Lexile
              {sortType === "litCorrect" ? (
                <UpOutlined onClick={onClickSortType("litCorrectReverse")} />
              ) : (
                <DownOutlined onClick={onClickSortType("litCorrect")} />
              )}
            </th>
            <th style={{ width: "5rem" }}>
              {" "}
              AR{" "}
              {sortType === "arDate" ? (
                <UpOutlined onClick={onClickSortType("arDateReverse")} />
              ) : (
                <DownOutlined onClick={onClickSortType("arDate")} />
              )}
            </th>
            <th style={{ width: "5rem" }}>
              Lexile{" "}
              {sortType === "litDate" ? (
                <UpOutlined onClick={onClickSortType("litDateReverse")} />
              ) : (
                <DownOutlined onClick={onClickSortType("litDate")} />
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedRecord?.map((el) => {
            return (
              <tr>
                {el?.book?.titleAr.length > 40 ? (
                  <td
                    onMouseEnter={() => {
                      setViewTitle(true);
                      setTitle(el?.book.titleAr);
                    }}
                    onMouseLeave={() => {
                      setViewTitle(false);
                    }}
                  >
                    {longTitle(el.book.titleAr)}
                  </td>
                ) : (
                  <td>{el.book.titleAr}</td>
                )}
                {el?.book?.authorAr?.length > 15 ? (
                  <td
                    onMouseEnter={() => {
                      setViewTitle(true);
                      setTitle(el?.book.authorAr);
                    }}
                    onMouseLeave={() => {
                      setViewTitle(false);
                    }}
                  >
                    {longAuthor(el.book.authorAr)}
                  </td>
                ) : (
                  <td>{longAuthor(el.book.authorAr)}</td>
                )}
                <td>{"#" + el.book.arQuiz}</td>
                <td>{arFrame(el.book.bl)}</td>
                <td>
                  {lexileFrame(el.book.lexileLex) ??
                    lexileFrame(el.book.lexileAr)}
                </td>
                <td>{addComma(el.book.wcAr)}</td>
                <td>{el.arCorrect ? el.arCorrect + "%" : ""}</td>
                <td>{el.litCorrect !== null ? el.litCorrect + "%" : ""}</td>
                <td>{el.arDate}</td>
                <td>{el.litDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {viewTitle ? (
        <span
          style={{
            position: "fixed",
            left: mousePosition.x,
            top: mousePosition.y,
            backgroundColor: "#dedede",
            border: "2px solid #333333",
            borderRadius: "3px",
          }}
        >
          {title}
        </span>
      ) : (
        <></>
      )}
      <div style={{ display: "flex", marginBottom: "20px" }}>
        {Array.from({ length: maxPage }).map((_, index) => {
          if (
            index === 0 ||
            index === maxPage - 1 ||
            (index + 2 >= pageNumber && index - 2 <= pageNumber)
          ) {
            return (
              <>
                {pageNumber > 3 && pageNumber === index + 2 ? (
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
                    setPageNumber(index);
                  }}
                  style={
                    index === pageNumber
                      ? {
                          width: "27px",
                          color: "white",
                          backgroundColor: "#333",
                          // border: "1px solid black",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "5px",
                        }
                      : {
                          width: "27px",
                          color: "black",
                          // border: "1px solid black",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          borderRadius: "5px",
                        }
                  }
                >
                  {index + 1}
                </span>
                {pageNumber < maxPage - 4 && pageNumber === index - 2 ? (
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
      </div>
      {/* <Modal
        open={viewTitle}
        footer={null}
        closable={false}
        onCancel={() => {
          setViewTitle(false);
        }}
      >
        <div style={{ fontFamily: "Spoqa Han Sans Neo" }}>{title}</div>
      </Modal> */}
    </S.PageWrapper>
  );
}
