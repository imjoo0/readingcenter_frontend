import * as S from "./books.style";
import {
  BookOutlined,
  DeleteOutlined,
  DownOutlined,
  UpOutlined,
  WarningTwoTone,
} from "@ant-design/icons";
import {
  addComma,
  arFrame,
  dateToInput,
  kplbnFrame,
  lexileFrame,
  longAuthor,
  longTitle,
  longWord,
} from "../../commons/library/library";
import { useEffect, useRef, useState } from "react";
import { Modal, Spin } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_BOOK,
  DELETE_BOOK,
  GET_BOOKS,
  GET_ME,
  UPDATE_BOOK_INVENTORY,
} from "./books.query";
import { useRouter } from "next/router";
import { css } from "@emotion/react";
import CheckToolTip from "@/src/commons/library/tooltipcheck";

export default function BookPage() {
  const router = useRouter();

  const [minBl, setMinBl] = useState(0);
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
  const [isAddBook, setIsAddBook] = useState(false);
  const [inputFile, setInputFile] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [inputPlace, setInputPlace] = useState([]);
  const fileInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [sortType, setSortType] = useState("arReverse");
  const [isBooks, setIsBooks] = useState(true);
  const [academyList, setAcademyList] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editList, setEditList] = useState([]);
  const [isAdd, setIsAdd] = useState(false);
  const [addAcademyId, setAddAcademyId] = useState("");
  const [addBoxNumber, setAddBoxNumber] = useState("");
  const [deleteBooks] = useMutation(DELETE_BOOK);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [arQuizNo, setArQuizNo] = useState("");
  const [isInfo, setIsInfo] = useState(false);
  const [infoPosition, setInfoPosition] = useState([0, 1]);
  const [info, setInfo] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [fNF, setFNF] = useState("");
  const [iL, setIL] = useState("");

  const { data, refetch, loading } = useQuery(GET_BOOKS, {
    variables: {
      minBl: 0,
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

  const [updateBooks] = useMutation(UPDATE_BOOK_INVENTORY);
  const [addBooks] = useMutation(ADD_BOOK);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 1) {
      alert("한 개의 파일만 드래그 해주십시요.");
      return;
    }
    const allowedFile = ["xlsx"];
    if (
      !allowedFile.includes(
        e.dataTransfer.files[0].name.split(".").pop().toLowerCase()
      )
    ) {
      alert("엑셀 파일을 올려주십시오.");
      return;
    }
    // const newFiles = ...e.dataTransfer.files;
    setInputFile(...e.dataTransfer.files);
  };

  const onClickAddList = () => {
    console.log(inputFile);
    setIsAddBook(false);
    setInputFile([]);
  };

  const onClickFileRef = () => {
    fileInputRef.current.click();
  };

  const onChangeAddBooks = (e) => {
    if (e.target.files.length === 0) {
      return;
    }
    const fileArray = Array.from(e.target.files);
    const allowedFile = ["xlsx"];

    if (
      !allowedFile.includes(fileArray[0].name.split(".").pop().toLowerCase())
    ) {
      alert("엑셀 파일을 올려주십시오.");
      return;
    }
    setInputFile(...fileArray);
  };

  const onClickAddBooks = async () => {
    // console.log(Number(selectBook.kplbn), Number(addAcademyId), addNumber);
    // return;
    try {
      const result = await addBooks({
        variables: {
          bookId: Number(selectBook.kplbn),
          academyId:
            academyList?.length > 0
              ? Number(addAcademyId)
              : Number(router.query.branch),
          boxNum: addBoxNumber,
        },
      });
      refetch();
      setDetailToggle(false);
      setInputPlace([]);
      setIsBooks(true);
      setIsAdd(false);
      if (academyList.length > 0) {
        setAddAcademyId(academyList[0].academyId);
      }
      setAddBoxNumber("");
    } catch {}
    alert("도서를 추가했습니다.");
  };

  const onClickDelete = (id) => () => {
    setIsDelete(true);
    setIsEdit(true);
    setDeleteId(id);
  };

  const onClickDeleteBook = async () => {
    // console.log(Number(deleteId));
    // return;
    try {
      await deleteBooks({ variables: { bookInvenId: Number(deleteId) } });
      setDeleteId("");
      setIsDelete(false);
      setIsEdit(false);
      refetch();
      setDetailToggle(false);
      setInputPlace([]);
      setIsBooks(true);
      setIsAdd(false);
      if (academyList.length > 0) {
        setAddAcademyId(academyList[0].academyId);
      }
      setAddBoxNumber("");
    } catch (err) {}
    alert("삭제에 성공했습니다.");
  };

  const onClickSelectBook = (el) => () => {
    setDetailToggle(true);
    setSelectBook(el);
    setEditList(
      el.books.map((ele) => {
        return {
          id: ele.id,
          boxNumber: ele.boxNumber,
          academyId: ele.academy.id,
          bookStatus: ele.bookStatus,
        };
      })
    );
  };

  const onChangeEdit = (type, index) => (e) => {
    console.log(e.target.value, type, index);
    const newEdit = [...editList];
    newEdit[index][type] = e.target.value;
    console.log(newEdit);
    setEditList(newEdit);
    setIsEdit(true);
  };

  const onClickCancelEdit = () => {
    setIsEdit(false);
    setIsDelete(false);
    setSelectBook(
      bookArray?.filter((el) => {
        return el.id === selectBook.id;
      })?.[0]
    );
    setSelectBook(
      bookArray?.filter((el) => {
        return el.id === selectBook.id;
      })?.[0]
    );
    setEditList(
      bookArray
        ?.filter((el) => {
          return el.id === selectBook.id;
        })?.[0]
        .books.map((ele) => {
          return {
            id: ele.id,
            boxNumber: ele.boxNumber,
            academyId: ele.academy.id,
            bookStatus: ele.bookStatus,
          };
        })
    );
  };

  const statusArray = ["정상", "파손", "분실"];

  const onClickOkEdit = () => {
    editList?.forEach(async (el, index) => {
      if (
        el.bookStatus === selectBook?.books?.[index]?.bookStatus &&
        Number(el.academyId) ===
          Number(selectBook?.books?.[index]?.academy?.id) &&
        el.boxNumber === selectBook?.books?.[index]?.boxNumber
      ) {
        return;
      } else {
        try {
          const result = await updateBooks({
            variables: {
              id: Number(el.id),
              academyId: Number(el.academyId),
              newBoxNumber: el.boxNumber,
              bookStatus: statusArray.indexOf(el.bookStatus),
            },
          });
          console.log(result);
          const newBookArray = [...bookArray];
          newBookArray[
            bookArray.findIndex((el) => {
              return el.id === selectBook.id;
            })
          ]?.books?.[index]?.academyId ===
            result?.data?.bookInventoryUpdate?.academy?.id;
          newBookArray[
            bookArray.findIndex((el) => {
              return el.id === selectBook.id;
            })
          ]?.books?.[index]?.bookStatus ===
            result?.data?.bookInventoryUpdate?.bookStatus;
          newBookArray[
            bookArray.findIndex((el) => {
              return el.id === selectBook.id;
            })
          ]?.books?.[index]?.boxNumber ===
            result?.data?.bookInventoryUpdate?.academy?.boxNumber;
          setBookArray(newBookArray);
          refetch();
        } catch (err) {
          console.log(err);
        }
        setDetailToggle(false);
        setInputPlace([]);
        setIsAdd(false);
        setIsBooks(true);
        if (academyList.length > 0) {
          setAddAcademyId(academyList[0].academyId);
        }
        setAddBoxNumber("");
      }
    });
    setIsEdit(false);
    alert("수정에 성공했습니다.");
  };

  useEffect(() => {
    if (userData?.me?.userCategory === "매니저") {
      setAcademyList(
        userData?.me?.profile?.academies?.map((el) => {
          return {
            academyId: Number(el.id),
            name: el.name,
            location: el.location,
          };
        })
      );
    }
  }, [userData]);

  // 정렬
  useEffect(() => {
    const newArray =
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
                  .includes(bookSearchWord.toUpperCase()) ||
                String(el?.kplbn)
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase())
              );
            })
            ?.filter((el) => {
              if (fNF === "") {
                return true;
              }
              return el.fnfStatus === fNF;
            })
            ?.filter((el) => {
              if (iL === "") {
                return true;
              }
              return el.ilStatus.slice(3) === iL;
            });
    if (sortType === "title") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            const nameA = a?.titleAr.toUpperCase();
            const nameB = b?.titleAr.toUpperCase();
            if (nameA < nameB) {
              return -1;
            } else if (nameA > nameB) {
              return 1;
            } else {
              return 0;
            }
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "titleReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            const nameA = a?.titleAr.toUpperCase();
            const nameB = b?.titleAr.toUpperCase();
            if (nameA < nameB) {
              return 1;
            } else if (nameA > nameB) {
              return -1;
            } else {
              return 0;
            }
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "author") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            const nameA = a?.authorAr.toUpperCase();
            const nameB = b?.authorAr.toUpperCase();
            if (nameA < nameB) {
              return -1;
            } else if (nameA > nameB) {
              return 1;
            } else {
              return 0;
            }
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "authorReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            const nameA = a?.authorAr.toUpperCase();
            const nameB = b?.authorAr.toUpperCase();
            if (nameA < nameB) {
              return 1;
            } else if (nameA > nameB) {
              return -1;
            } else {
              return 0;
            }
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "plbn") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return a?.kplbn - b?.kplbn;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "plbnReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return b?.kplbn - a?.kplbn;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "ar") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return (
              (a?.lexileLex ?? a?.lexileAr) - (b?.lexileLex ?? b?.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.lexileLex === null &&
              a?.lexileAr === null &&
              (b?.lexileLex !== null || b?.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.lexileLex === null &&
              b?.lexileAr === null &&
              (a?.lexileLex !== null || a?.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          ?.sort((a, b) => {
            return a?.wcAr - b?.wcAr;
          })
          ?.sort((a, b) => {
            return a?.bl - b?.bl;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "arReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return (
              (b?.lexileLex ?? b?.lexileAr) - (a?.lexileLex ?? a?.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.lexileLex === null &&
              a?.lexileAr === null &&
              (b?.lexileLex !== null || b?.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.lexileLex === null &&
              b?.lexileAr === null &&
              (a?.lexileLex !== null || a?.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          ?.sort((a, b) => {
            return b?.wcAr - a?.wcAr;
          })
          ?.sort((a, b) => {
            return b?.bl - a?.bl;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "lexile") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return a?.wcAr - b?.wcAr;
          })
          ?.sort((a, b) => {
            return a?.bl - b?.bl;
          })
          ?.sort((a, b) => {
            return (
              (a?.lexileLex ?? a?.lexileAr) - (b?.lexileLex ?? b?.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.lexileLex === null &&
              a?.lexileAr === null &&
              (b?.lexileLex !== null || b?.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.lexileLex === null &&
              b?.lexileAr === null &&
              (a?.lexileLex !== null || a?.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "lexileReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return b?.wcAr - a?.wcAr;
          })
          ?.sort((a, b) => {
            return b?.bl - a?.bl;
          })
          ?.sort((a, b) => {
            return (
              (b?.lexileLex ?? b?.lexileAr) - (a?.lexileLex ?? a?.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.lexileLex === null &&
              a?.lexileAr === null &&
              (b?.lexileLex !== null || b?.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.lexileLex === null &&
              b?.lexileAr === null &&
              (a?.lexileLex !== null || a?.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "wordCount") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return (
              (a?.lexileLex ?? a?.lexileAr) - (b?.lexileLex ?? b?.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.lexileLex === null &&
              a?.lexileAr === null &&
              (b?.lexileLex !== null || b?.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.lexileLex === null &&
              b?.lexileAr === null &&
              (a?.lexileLex !== null || a?.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          ?.sort((a, b) => {
            return a?.bl - b?.bl;
          })
          ?.sort((a, b) => {
            return a?.wcAr - b?.wcAr;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "wordCountReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return (
              (b?.lexileLex ?? b?.lexileAr) - (a?.lexileLex ?? a?.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.lexileLex === null &&
              a?.lexileAr === null &&
              (b?.lexileLex !== null || b?.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.lexileLex === null &&
              b?.lexileAr === null &&
              (a?.lexileLex !== null || a?.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          ?.sort((a, b) => {
            return b?.bl - a?.bl;
          })
          ?.sort((a, b) => {
            return b?.wcAr - a?.wcAr;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
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
              el?.authorAr
                .toUpperCase()
                .includes(bookSearchWord.toUpperCase()) ||
              String(el?.kplbn)
                .toUpperCase()
                .includes(bookSearchWord.toUpperCase())
            );
          })
          ?.filter((el) => {
            if (fNF === "") {
              return true;
            }
            return el.fnfStatus === fNF;
          })
          ?.filter((el) => {
            if (iL === "") {
              return true;
            }
            return el.ilStatus.slice(3) === iL;
          })?.length / 20
      )
    );
    setBookPage(1);
    setBookPageList(0);
  }, [data, bookSearchWord, minWc, maxWc, sortType, iL, fNF]);

  useEffect(() => {
    const newArray =
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
                  .includes(bookSearchWord.toUpperCase()) ||
                String(el?.kplbn)
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase())
              );
            })
            ?.filter((el) => {
              if (fNF === "") {
                return true;
              }
              return el.fnfStatus === fNF;
            })
            ?.filter((el) => {
              if (iL === "") {
                return true;
              }
              return el.ilStatus.slice(3) === iL;
            });
    if (sortType === "title") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            const nameA = a?.titleAr.toUpperCase();
            const nameB = b?.titleAr.toUpperCase();
            if (nameA < nameB) {
              return -1;
            } else if (nameA > nameB) {
              return 1;
            } else {
              return 0;
            }
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "titleReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            const nameA = a?.titleAr.toUpperCase();
            const nameB = b?.titleAr.toUpperCase();
            if (nameA < nameB) {
              return 1;
            } else if (nameA > nameB) {
              return -1;
            } else {
              return 0;
            }
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "author") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            const nameA = a?.authorAr.toUpperCase();
            const nameB = b?.authorAr.toUpperCase();
            if (nameA < nameB) {
              return -1;
            } else if (nameA > nameB) {
              return 1;
            } else {
              return 0;
            }
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "authorReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            const nameA = a?.authorAr.toUpperCase();
            const nameB = b?.authorAr.toUpperCase();
            if (nameA < nameB) {
              return 1;
            } else if (nameA > nameB) {
              return -1;
            } else {
              return 0;
            }
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "plbn") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return a?.kplbn - b?.kplbn;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "plbnReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return b?.kplbn - a?.kplbn;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "ar") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return (
              (a?.lexileLex ?? a?.lexileAr) - (b?.lexileLex ?? b?.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.lexileLex === null &&
              a?.lexileAr === null &&
              (b?.lexileLex !== null || b?.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.lexileLex === null &&
              b?.lexileAr === null &&
              (a?.lexileLex !== null || a?.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          ?.sort((a, b) => {
            return a?.wcAr - b?.wcAr;
          })
          ?.sort((a, b) => {
            return a?.bl - b?.bl;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "arReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return (
              (b?.lexileLex ?? b?.lexileAr) - (a?.lexileLex ?? a?.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.lexileLex === null &&
              a?.lexileAr === null &&
              (b?.lexileLex !== null || b?.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.lexileLex === null &&
              b?.lexileAr === null &&
              (a?.lexileLex !== null || a?.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          ?.sort((a, b) => {
            return b?.wcAr - a?.wcAr;
          })
          ?.sort((a, b) => {
            return b?.bl - a?.bl;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "lexile") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return a?.wcAr - b?.wcAr;
          })
          ?.sort((a, b) => {
            return a?.bl - b?.bl;
          })
          ?.sort((a, b) => {
            return (
              (a?.lexileLex ?? a?.lexileAr) - (b?.lexileLex ?? b?.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.lexileLex === null &&
              a?.lexileAr === null &&
              (b?.lexileLex !== null || b?.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.lexileLex === null &&
              b?.lexileAr === null &&
              (a?.lexileLex !== null || a?.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "lexileReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return b?.wcAr - a?.wcAr;
          })
          ?.sort((a, b) => {
            return b?.bl - a?.bl;
          })
          ?.sort((a, b) => {
            return (
              (b?.lexileLex ?? b?.lexileAr) - (a?.lexileLex ?? a?.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.lexileLex === null &&
              a?.lexileAr === null &&
              (b?.lexileLex !== null || b?.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.lexileLex === null &&
              b?.lexileAr === null &&
              (a?.lexileLex !== null || a?.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "wordCount") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return (
              (a?.lexileLex ?? a?.lexileAr) - (b?.lexileLex ?? b?.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.lexileLex === null &&
              a?.lexileAr === null &&
              (b?.lexileLex !== null || b?.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.lexileLex === null &&
              b?.lexileAr === null &&
              (a?.lexileLex !== null || a?.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          ?.sort((a, b) => {
            return a?.bl - b?.bl;
          })
          ?.sort((a, b) => {
            return a?.wcAr - b?.wcAr;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "wordCountReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return (
              (b?.lexileLex ?? b?.lexileAr) - (a?.lexileLex ?? a?.lexileAr)
            );
          })
          ?.sort((a, b) => {
            if (
              a?.lexileLex === null &&
              a?.lexileAr === null &&
              (b?.lexileLex !== null || b?.lexileAr !== null)
            ) {
              return 1;
            }
            if (
              b?.lexileLex === null &&
              b?.lexileAr === null &&
              (a?.lexileLex !== null || a?.lexileAr !== null)
            ) {
              return -1;
            }
            return 0;
          })
          ?.sort((a, b) => {
            return b?.bl - a?.bl;
          })
          ?.sort((a, b) => {
            return b?.wcAr - a?.wcAr;
          })
          // ?.filter((el, index) => {
          //   return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          // })
          ?.map((el) => {
            return el;
          })
      );
    }
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
              el?.authorAr
                .toUpperCase()
                .includes(bookSearchWord.toUpperCase()) ||
              String(el?.kplbn)
                .toUpperCase()
                .includes(bookSearchWord.toUpperCase())
            );
          })
          ?.filter((el) => {
            if (fNF === "") {
              return true;
            }
            return el.fnfStatus === fNF;
          })
          ?.filter((el) => {
            if (iL === "") {
              return true;
            }
            return el.ilStatus.slice(3) === iL;
          })?.length / 20
      )
    );
  }, [bookPage, bookSearchWord]);

  // const deleteFile = (fileName) => () => {
  //   setInputFile(
  //     inputFile.filter((el) => {
  //       return el.name !== fileName;
  //     })
  //   );
  // };

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

  const onChangeInputPlace = (index) => (e) => {
    const newArray = [...inputPlace];
    newArray[index].place = e.target.value;
    setInputPlace(newArray);
  };

  const onClickSortType = (type) => () => {
    setBookArray([]);
    setSortType(type);
  };

  useEffect(() => {
    if (academyList.length > 0) {
      setAddAcademyId(academyList[0].academyId);
    }
  }, [academyList]);

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
    <S.BooksWrapper>
      <div style={{ width: "90rem" }}>
        <S.BooksTitle>도서 관리</S.BooksTitle>
      </div>
      <S.SearchBox
      // style={{
      //   borderRadius: "0.25rem 0.25rem 0rem 0rem",
      //   background: "#F7F8FA",
      //   padding: "1.5rem",
      //   borderRadius: "9px",
      //   marginTop: "1.25rem",
      //   // width: "95%",
      // }}
      >
        <S.SearchTag
          style={{
            width: "90rem",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              color: "#000",
              fontSize: "15px",
              fontWeight: "bold",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>AR</div>
              <S.BookTagSmallInput
                type="number"
                step={0.1}
                min={0}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setMinBl("");
                    return;
                  }
                  if (Math.floor(Number(e.target.value) * 10) / 10 > maxBl) {
                    setMaxBl(Math.floor(Number(e.target.value) * 10) / 10);
                  }
                  setMinBl(Math.floor(Number(e.target.value) * 10) / 10);
                }}
                value={minBl}
                onKeyPress={async (e) => {
                  if (e.key === "Enter") {
                    onClickSearch();
                  }
                }}
                // defaultValue={minBl === 0 ? "" : minBl}
              ></S.BookTagSmallInput>
              <span style={{ fontWeight: 500 }}>~</span>
              <S.BookTagSmallInput
                type="number"
                step={0.1}
                min={0}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setMaxBl("");
                    return;
                  }
                  if (Math.floor(Number(e.target.value) * 10) / 10 < minBl) {
                    setMinBl(Math.floor(Number(e.target.value) * 10) / 10);
                  }
                  setMaxBl(Math.floor(Number(e.target.value) * 10) / 10);
                }}
                value={maxBl}
                onKeyPress={async (e) => {
                  if (e.key === "Enter") {
                    onClickSearch();
                  }
                }}
                defaultValue={maxBl}
              ></S.BookTagSmallInput>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                // marginLeft: "1.25rem",
                marginTop: "1.25rem",
              }}
            >
              <div>WC</div>
              <S.BookTagSmallInput
                min={0}
                type="number"
                // style={{ marginLeft: "10px", marginTop: "10px" }}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setMinWc(e.target.value);
                    return;
                  }
                  if (Math.floor(Number(e.target.value)) > maxWc) {
                    setMaxWc(Math.floor(Number(e.target.value)));
                  }
                  setMinWc(Math.floor(Number(e.target.value)));
                }}
                onKeyPress={async (e) => {
                  if (e.key === "Enter") {
                    onClickSearch();
                  }
                }}
                value={minWc}
              ></S.BookTagSmallInput>
              <span style={{ fontWeight: 500 }}>~</span>
              <S.BookTagSmallInput
                min={0}
                type="number"
                // style={{ marginLeft: "10px", marginTop: "10px" }}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setMaxWc(e.target.value);
                    return;
                  }
                  if (Math.floor(Number(e.target.value)) < minWc) {
                    setMinWc(Math.floor(Number(e.target.value)));
                  }
                  setMaxWc(Math.floor(Number(e.target.value)));
                }}
                onKeyPress={async (e) => {
                  if (e.key === "Enter") {
                    onClickSearch();
                  }
                }}
                value={maxWc}
              ></S.BookTagSmallInput>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              color: "#000",
              fontSize: "15px",
              fontWeight: "bold",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                // marginLeft: "1.25rem",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ marginRight: "1.5rem" }}>Lexile</div>
              <S.BookTagSmallInput
                type="number"
                style={{ marginLeft: "10px" }}
                value={minLex}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setMinLex(e.target.value);
                    return;
                  }
                  if (maxLex < Number(e.target.value)) {
                    setMaxLex(Number(e.target.value));
                  }
                  setMinLex(Number(e.target.value));
                }}
                onKeyPress={async (e) => {
                  if (e.key === "Enter") {
                    onClickSearch();
                  }
                }}
              ></S.BookTagSmallInput>
              ~
              <S.BookTagSmallInput
                type="number"
                style={{ marginLeft: "10px" }}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setMaxLex(e.target.value);
                    return;
                  }
                  if (minLex > Number(e.target.value)) {
                    setMinLex(Number(e.target.value));
                  }
                  setMaxLex(Number(e.target.value));
                }}
                onKeyPress={async (e) => {
                  if (e.key === "Enter") {
                    onClickSearch();
                  }
                }}
                value={maxLex}
                // onInput={maxLex.replace("-", "br")}
              ></S.BookTagSmallInput>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "1.25rem",
              }}
            >
              <div>AR Quiz No</div>
              <div style={{ fontWeight: 500, marginLeft: "1.25rem" }}>
                <span style={{ marginRight: "0.5rem" }}>#</span>
                <S.BookTagBigInput
                  min={1}
                  type="number"
                  style={{ marginLeft: "0" }}
                  onChange={(e) => {
                    setArQuizNo(e.target.value);
                  }}
                  onKeyPress={async (e) => {
                    if (e.key === "Enter") {
                      onClickSearch();
                    }
                  }}
                  defaultValue={arQuizNo}
                ></S.BookTagBigInput>
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              color: "#000",
              fontSize: "15px",
              fontWeight: "bold",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>F/NF</div>
              <S.InputSelect
                onChange={(e) => {
                  setFNF(e.target.value);
                  setBookArray([]);
                }}
                style={{
                  marginLeft: "1.25rem",
                  // marginTop: "10px",
                  // marginBottom: "1.87rem",
                }}
              >
                <option value={""} selected={fNF === ""}>
                  전체
                </option>
                <option value={"F"} selected={fNF === "F"}>
                  Fiction
                </option>
                <option value={"NF"} selected={fNF === "NF"}>
                  NonFiction
                </option>
              </S.InputSelect>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "0.5rem",
              }}
            >
              <div>IL</div>
              <S.InputSelect
                onChange={(e) => {
                  setIL(e.target.value);
                  setBookArray([]);
                }}
                style={{ marginLeft: "1.25rem", marginTop: "10px" }}
              >
                <option value={""} selected={iL === ""}>
                  전체
                </option>
                <option value={"LG"} selected={iL === "LG"}>
                  LG
                </option>
                <option value={"MG"} selected={iL === "MG"}>
                  MG
                </option>
                <option value={"MG+"} selected={iL === "MG+"}>
                  MG+
                </option>
                <option value={"UG"} selected={iL === "UG"}>
                  UG
                </option>
              </S.InputSelect>
            </div>
          </div>
          <S.ModalAddButton onClick={onClickSearch}>
            <svg
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "0.62rem" }}
            >
              <path
                d="M2.21875 6.96875C2.80208 7.55208 3.51042 7.84375 4.34375 7.84375C5.17708 7.84375 5.88542 7.55208 6.46875 6.96875C7.05208 6.38542 7.34375 5.67708 7.34375 4.84375C7.34375 4.01042 7.05208 3.30208 6.46875 2.71875C5.88542 2.13542 5.17708 1.84375 4.34375 1.84375C3.51042 1.84375 2.80208 2.13542 2.21875 2.71875C1.63542 3.30208 1.34375 4.01042 1.34375 4.84375C1.34375 5.67708 1.63542 6.38542 2.21875 6.96875ZM8.34375 7.84375L11.6562 11.1562L10.6562 12.1562L7.34375 8.84375V8.3125L7.15625 8.125C6.36458 8.8125 5.42708 9.15625 4.34375 9.15625C3.13542 9.15625 2.10417 8.73958 1.25 7.90625C0.416667 7.07292 0 6.05208 0 4.84375C0 3.63542 0.416667 2.61458 1.25 1.78125C2.10417 0.927083 3.13542 0.5 4.34375 0.5C5.55208 0.5 6.57292 0.927083 7.40625 1.78125C8.23958 2.61458 8.65625 3.63542 8.65625 4.84375C8.65625 5.28125 8.55208 5.78125 8.34375 6.34375C8.13542 6.88542 7.89583 7.32292 7.625 7.65625L7.8125 7.84375H8.34375Z"
                fill="white"
              />
            </svg>
            검색
          </S.ModalAddButton>
        </S.SearchTag>
      </S.SearchBox>
      {isLoading ? <Spin></Spin> : <></>}
      {isLoading ? (
        <></>
      ) : (
        <>
          <div
            style={{
              width: "90rem",
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
              alignItems: "center",
            }}
          >
            <S.CountNumber
              style={{
                display: "flex",
              }}
            >
              {(data?.getBooksByBl !== undefined &&
                data?.getBooksByBl?.filter((el) => {
                  return (
                    el?.titleAr
                      .toUpperCase()
                      .includes(bookSearchWord.toUpperCase()) ||
                    String(el?.books[0]?.isbn)
                      .toUpperCase()
                      .includes(bookSearchWord.toUpperCase()) ||
                    el?.authorAr
                      .toUpperCase()
                      .includes(bookSearchWord.toUpperCase()) ||
                    String(el?.kplbn)
                      .toUpperCase()
                      .includes(bookSearchWord.toUpperCase())
                  );
                }).length !== 0) ||
              undefined
                ? "검색결과 " +
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
                          .includes(bookSearchWord.toUpperCase()) ||
                        String(el?.kplbn)
                          .toUpperCase()
                          .includes(bookSearchWord.toUpperCase())
                      );
                    })
                    ?.filter((el) => {
                      if (fNF === "") {
                        return true;
                      }
                      return el.fnfStatus === fNF;
                    })
                    ?.filter((el) => {
                      if (iL === "") {
                        return true;
                      }
                      return el.ilStatus.slice(3) === iL;
                    }).length +
                  "권"
                : ""}
            </S.CountNumber>
            <S.SearchTag>
              <div>
                <S.SearchInput
                  type="text"
                  placeholder="     도서 제목, 바코드, 저자 등으로 검색해주세요."
                  onChange={(e) => {
                    setBookSearchWord(e.target.value);
                    setBookArray([]);
                  }}
                />
              </div>
            </S.SearchTag>
          </div>
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

          <div
            style={{
              width: "90rem",
              height: "45.81rem",
              overflow: "auto",
              marginBottom: "3rem",
            }}
          >
            <table style={{ borderCollapse: "collapse" }}>
              {bookArray.length === 0 ? (
                <></>
              ) : (
                <thead style={{ position: "sticky", top: -1, zIndex: 1 }}>
                  <tr>
                    <S.BookTableTh
                      style={{ width: "3.125rem" }}
                    ></S.BookTableTh>
                    <S.BookTableTh style={{ width: "6.4375rem" }}>
                      KPLBN{" "}
                      {sortType === "plbn" ? (
                        <svg
                          width="9"
                          height="13"
                          viewBox="0 0 9 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={onClickSortType("plbnReverse")}
                          style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                        >
                          <path
                            d="M2.56711 0.5L5.13423 3.15625H3.20134V7.84375H1.93289V3.15625H0L2.56711 0.5ZM7.06711 9.84375H9L6.43289 12.5L3.86577 9.84375H5.79866V5.15625H7.06711V9.84375Z"
                            fill="white"
                          />
                        </svg>
                      ) : (
                        // <UpOutlined  />
                        // <DownOutlined onClick={onClickSortType("plbn")} />
                        <svg
                          width="9"
                          height="13"
                          viewBox="0 0 9 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={onClickSortType("plbn")}
                          style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                        >
                          <path
                            d="M2.56711 0.5L5.13423 3.15625H3.20134V7.84375H1.93289V3.15625H0L2.56711 0.5ZM7.06711 9.84375H9L6.43289 12.5L3.86577 9.84375H5.79866V5.15625H7.06711V9.84375Z"
                            fill="white"
                          />
                        </svg>
                      )}
                    </S.BookTableTh>
                    <S.BookTableTh style={{ width: "25rem" }}>
                      도서 제목{" "}
                      {sortType === "title" ? (
                        // <UpOutlined onClick={onClickSortType("titleReverse")} />
                        <svg
                          width="9"
                          height="13"
                          viewBox="0 0 9 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={onClickSortType("titleReverse")}
                          style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                        >
                          <path
                            d="M2.56711 0.5L5.13423 3.15625H3.20134V7.84375H1.93289V3.15625H0L2.56711 0.5ZM7.06711 9.84375H9L6.43289 12.5L3.86577 9.84375H5.79866V5.15625H7.06711V9.84375Z"
                            fill="white"
                          />
                        </svg>
                      ) : (
                        <svg
                          width="9"
                          height="13"
                          viewBox="0 0 9 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={onClickSortType("title")}
                          style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                        >
                          <path
                            d="M2.56711 0.5L5.13423 3.15625H3.20134V7.84375H1.93289V3.15625H0L2.56711 0.5ZM7.06711 9.84375H9L6.43289 12.5L3.86577 9.84375H5.79866V5.15625H7.06711V9.84375Z"
                            fill="white"
                          />
                        </svg>
                        // <DownOutlined onClick={onClickSortType("title")} />
                      )}
                    </S.BookTableTh>
                    <S.BookTableTh style={{ width: "13.40rem" }}>
                      저자{" "}
                      {sortType === "author" ? (
                        // <UpOutlined
                        //   onClick={onClickSortType("authorReverse")}
                        // />
                        <svg
                          width="9"
                          height="13"
                          viewBox="0 0 9 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={onClickSortType("authorReverse")}
                          style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                        >
                          <path
                            d="M2.56711 0.5L5.13423 3.15625H3.20134V7.84375H1.93289V3.15625H0L2.56711 0.5ZM7.06711 9.84375H9L6.43289 12.5L3.86577 9.84375H5.79866V5.15625H7.06711V9.84375Z"
                            fill="white"
                          />
                        </svg>
                      ) : (
                        // <DownOutlined onClick={onClickSortType("author")} />
                        <svg
                          width="9"
                          height="13"
                          viewBox="0 0 9 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={onClickSortType("author")}
                          style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                        >
                          <path
                            d="M2.56711 0.5L5.13423 3.15625H3.20134V7.84375H1.93289V3.15625H0L2.56711 0.5ZM7.06711 9.84375H9L6.43289 12.5L3.86577 9.84375H5.79866V5.15625H7.06711V9.84375Z"
                            fill="white"
                          />
                        </svg>
                      )}
                    </S.BookTableTh>
                    <S.BookTableTh style={{ width: "3.4rem" }}>
                      F/NF
                    </S.BookTableTh>
                    <S.BookTableTh style={{ width: "6.81rem" }}>
                      AR QUIZ No.
                    </S.BookTableTh>
                    <S.BookTableTh style={{ width: "3.75rem" }}>
                      AR{" "}
                      {sortType === "ar" ? (
                        // <UpOutlined onClick={onClickSortType("arReverse")} />
                        <svg
                          width="9"
                          height="13"
                          viewBox="0 0 9 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={onClickSortType("arReverse")}
                          style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                        >
                          <path
                            d="M2.56711 0.5L5.13423 3.15625H3.20134V7.84375H1.93289V3.15625H0L2.56711 0.5ZM7.06711 9.84375H9L6.43289 12.5L3.86577 9.84375H5.79866V5.15625H7.06711V9.84375Z"
                            fill="white"
                          />
                        </svg>
                      ) : (
                        // <DownOutlined onClick={onClickSortType("ar")} />
                        <svg
                          width="9"
                          height="13"
                          viewBox="0 0 9 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={onClickSortType("ar")}
                          style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                        >
                          <path
                            d="M2.56711 0.5L5.13423 3.15625H3.20134V7.84375H1.93289V3.15625H0L2.56711 0.5ZM7.06711 9.84375H9L6.43289 12.5L3.86577 9.84375H5.79866V5.15625H7.06711V9.84375Z"
                            fill="white"
                          />
                        </svg>
                      )}
                    </S.BookTableTh>
                    <S.BookTableTh style={{ width: "5.06rem" }}>
                      Lexile{" "}
                      {sortType === "lexile" ? (
                        // <UpOutlined
                        //   onClick={onClickSortType("lexileReverse")}
                        // />
                        <svg
                          width="9"
                          height="13"
                          viewBox="0 0 9 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={onClickSortType("lexileReverse")}
                          style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                        >
                          <path
                            d="M2.56711 0.5L5.13423 3.15625H3.20134V7.84375H1.93289V3.15625H0L2.56711 0.5ZM7.06711 9.84375H9L6.43289 12.5L3.86577 9.84375H5.79866V5.15625H7.06711V9.84375Z"
                            fill="white"
                          />
                        </svg>
                      ) : (
                        // <DownOutlined onClick={onClickSortType("lexile")} />
                        <svg
                          width="9"
                          height="13"
                          viewBox="0 0 9 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={onClickSortType("lexile")}
                          style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                        >
                          <path
                            d="M2.56711 0.5L5.13423 3.15625H3.20134V7.84375H1.93289V3.15625H0L2.56711 0.5ZM7.06711 9.84375H9L6.43289 12.5L3.86577 9.84375H5.79866V5.15625H7.06711V9.84375Z"
                            fill="white"
                          />
                        </svg>
                      )}
                    </S.BookTableTh>
                    <S.BookTableTh style={{ width: "4.94rem" }}>
                      WC{" "}
                      {sortType === "wordCount" ? (
                        // <UpOutlined
                        //   onClick={onClickSortType("wordCountReverse")}
                        // />
                        <svg
                          width="9"
                          height="13"
                          viewBox="0 0 9 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={onClickSortType("wordCountReverse")}
                          style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                        >
                          <path
                            d="M2.56711 0.5L5.13423 3.15625H3.20134V7.84375H1.93289V3.15625H0L2.56711 0.5ZM7.06711 9.84375H9L6.43289 12.5L3.86577 9.84375H5.79866V5.15625H7.06711V9.84375Z"
                            fill="white"
                          />
                        </svg>
                      ) : (
                        // <DownOutlined onClick={onClickSortType("wordCount")} />
                        <svg
                          width="9"
                          height="13"
                          viewBox="0 0 9 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={onClickSortType("wordCount")}
                          style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                        >
                          <path
                            d="M2.56711 0.5L5.13423 3.15625H3.20134V7.84375H1.93289V3.15625H0L2.56711 0.5ZM7.06711 9.84375H9L6.43289 12.5L3.86577 9.84375H5.79866V5.15625H7.06711V9.84375Z"
                            fill="white"
                          />
                        </svg>
                      )}
                    </S.BookTableTh>
                    <S.BookTableTh style={{ width: "3.31rem" }}>
                      IL
                    </S.BookTableTh>
                    <S.BookTableTh style={{ width: "4.06rem" }}>
                      Litpro
                    </S.BookTableTh>
                    <S.BookTableTh style={{ width: "5.19rem" }}>
                      도서 권수
                    </S.BookTableTh>
                    <S.BookTableTh style={{ width: "4.94rem" }}>
                      상세 보기
                    </S.BookTableTh>
                  </tr>
                </thead>
              )}
              <tbody>
                {bookArray?.map((el, index) => {
                  return (
                    <tr>
                      <S.BookTableTd style={{ textAlign: "center" }}>
                        {index + 1}
                      </S.BookTableTd>
                      <S.BookTableTd>{kplbnFrame(el.kplbn)}</S.BookTableTd>
                      <S.BookTableTd
                        style={{
                          textAlign: "start",
                          width: "384px",
                          // display: "flex",
                          alignItems: "center",
                          height: "100%",
                          // border: "none",
                        }}
                      >
                        <CheckToolTip
                          text={el?.titleAr}
                          number={372}
                        ></CheckToolTip>
                      </S.BookTableTd>
                      {/* {el.titleAr.length <= 43 ? (
                        <S.BookTableTd>{longTitle(el.titleAr)}</S.BookTableTd>
                      ) : (
                        <S.BookTableTd
                          onMouseEnter={() => {
                            setIsInfo(true);
                            setInfoPosition([index, 1]);
                            setInfo(el.titleAr);
                          }}
                          onMouseLeave={() => {
                            setIsInfo(false);
                          }}
                          onTouchStart={() => {
                            setIsInfo(true);
                            setInfo(el.titleAr);
                          }}
                        >
                          {longTitle(el.titleAr)}
                        </S.BookTableTd>
                      )} */}
                      {/* {el.authorAr.length > 20 ? (
                        <S.BookTableTd
                          onMouseEnter={() => {
                            setIsInfo(true);
                            setInfo(el.authorAr);
                          }}
                          onMouseLeave={() => {
                            setIsInfo(false);
                          }}
                        >
                          {longAuthor(el.authorAr)}
                        </S.BookTableTd>
                      ) : (
                        <S.BookTableTd>{longAuthor(el.authorAr)}</S.BookTableTd>
                      )} */}
                      <S.BookTableTd style={{ textAlign: "start" }}>
                        <CheckToolTip
                          text={el?.authorAr}
                          number={200}
                        ></CheckToolTip>
                      </S.BookTableTd>
                      <S.BookTableTd>{el.fnfStatus}</S.BookTableTd>
                      <S.BookTableTd>{"#" + el.arQuiz}</S.BookTableTd>
                      <S.BookTableTd>{arFrame(el.bl)}</S.BookTableTd>
                      <S.BookTableTd>
                        {lexileFrame(el.lexileLex) ?? lexileFrame(el.lexileAr)}
                      </S.BookTableTd>
                      <S.BookTableTd>{addComma(el.wcAr)}</S.BookTableTd>
                      <S.BookTableTd>{el.ilStatus.slice(3, 5)}</S.BookTableTd>
                      <S.BookTableTd>
                        {el.litproStatus.slice(7, 8)}
                      </S.BookTableTd>
                      <S.BookTableTd>{el.books.length + "권"}</S.BookTableTd>
                      <S.BookTableTd>
                        <button
                          style={{
                            backgroundColor: "#fff",
                            border: "1px solid #C8C8C8",
                            borderRadius: "0.25rem",
                            width: "1.875rem",
                            height: "1.875rem",
                            marginLeft: "0.9rem",
                          }}
                        >
                          <svg
                            width="12"
                            height="13"
                            viewBox="0 0 12 13"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ cursor: "pointer", marginTop: "0.1rem" }}
                            onClick={onClickSelectBook(el)}
                          >
                            <path
                              d="M2.21875 6.96875C2.80208 7.55208 3.51042 7.84375 4.34375 7.84375C5.17708 7.84375 5.88542 7.55208 6.46875 6.96875C7.05208 6.38542 7.34375 5.67708 7.34375 4.84375C7.34375 4.01042 7.05208 3.30208 6.46875 2.71875C5.88542 2.13542 5.17708 1.84375 4.34375 1.84375C3.51042 1.84375 2.80208 2.13542 2.21875 2.71875C1.63542 3.30208 1.34375 4.01042 1.34375 4.84375C1.34375 5.67708 1.63542 6.38542 2.21875 6.96875ZM8.34375 7.84375L11.6562 11.1562L10.6562 12.1562L7.34375 8.84375V8.3125L7.15625 8.125C6.36458 8.8125 5.42708 9.15625 4.34375 9.15625C3.13542 9.15625 2.10417 8.73958 1.25 7.90625C0.416667 7.07292 0 6.05208 0 4.84375C0 3.63542 0.416667 2.61458 1.25 1.78125C2.10417 0.927083 3.13542 0.5 4.34375 0.5C5.55208 0.5 6.57292 0.927083 7.40625 1.78125C8.23958 2.61458 8.65625 3.63542 8.65625 4.84375C8.65625 5.28125 8.55208 5.78125 8.34375 6.34375C8.13542 6.88542 7.89583 7.32292 7.625 7.65625L7.8125 7.84375H8.34375Z"
                              fill="#858585"
                            />
                          </svg>
                        </button>
                      </S.BookTableTd>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {isInfo ? (
            <span
              style={{
                position: "fixed",
                left: mousePosition?.x,
                top: mousePosition?.y,
                backgroundColor: "#dedede",
                border: "2px solid #333333",
                borderRadius: "3px",
              }}
            >
              {info}
            </span>
          ) : (
            <></>
          )}
          {/* <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              marginBottom: "20px",
              width: "100%",
            }}
          >
            {data === undefined || data?.getBooksByBl.length === 0 ? (
              <></>
            ) : (
              <>
                <div
                  onClick={() => {
                    if (bookPage - 10 > 0) {
                      setBookPage(bookPage - 10);
                    }
                  }}
                >
                  {"<<"}
                </div>
                <div
                  onClick={() => {
                    if (bookPage > 1) {
                      setBookPage(bookPage - 1);
                    }
                  }}
                  style={{ margin: "0 8px" }}
                >
                  {"<"}
                </div>
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
                <div
                  onClick={() => {
                    if (bookPage < bookMaxPage) {
                      setBookPage(bookPage + 1);
                    }
                  }}
                  style={{ margin: "0 8px" }}
                >
                  {">"}
                </div>
                <div
                  onClick={() => {
                    if (bookPage + 10 < bookMaxPage) {
                      setBookPage(bookPage + 10);
                    }
                  }}
                >
                  {">>"}
                </div>
              </>
            )}
          </div> */}
        </>
      )}

      {/* <button
          onClick={() => {
            setIsAddBook(true);
          }}
        >
          도서 등록
        </button> */}
      {isAddBook ? (
        <Modal
          open={isAddBook}
          onCancel={() => {
            setIsAddBook(false);
            setInputFile([]);
          }}
          footer={null}
          closable={false}
        >
          <button onClick={onClickFileRef}>첨부</button>
          <div className="App">
            <div
              className={`drop-box ${dragging ? "dragging" : ""}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={{
                border: "1px solid #2d2d2d",
                width: "450px",
                height: "300px",
              }}
            >
              {/* {dragging ? "Drop here" : "Drag and drop files here"} */}
            </div>

            <div className="file-list" style={{ margin: "10px 0" }}>
              {/* <div>
                  {inputFile.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "450px",
                      }}
                    >
                      <div>{file.name}</div>
                      <DeleteOutlined onClick={deleteFile(file.name)} />
                    </div>
                  ))}
                </div> */}
              <div>{inputFile.name}</div>
            </div>
          </div>
          <input
            type="file"
            onChange={onChangeAddBooks}
            ref={fileInputRef}
            style={{ display: "none" }}
            multiple={false}
            // accept="application/vnd.ms-excel"
          ></input>
          <button onClick={onClickAddList}>등록</button>
          <button
            onClick={() => {
              setIsAddBook(false);
              setInputFile([]);
            }}
          >
            취소
          </button>
        </Modal>
      ) : (
        <></>
      )}
      {detailToggle ? (
        <Modal
          open={detailToggle}
          width={"70vw"}
          height={"50vh"}
          footer={null}
          closable={false}
          onCancel={() => {
            setDetailToggle(false);
            setInputPlace([]);
            setIsAdd(false);
            setIsBooks(true);
            setAddBoxNumber("");
            if (academyList.length > 0) {
              setAddAcademyId(academyList[0].academyId);
            }
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <S.BooksModalTitle
              style={{
                color: isBooks ? "#000000" : "#5F6268",
                borderBottom: isBooks ? "1px solid #000000" : "none",
                padding: "5px 20px",
              }}
              onClick={() => {
                setIsAdd(false);
                setIsBooks(true);
                if (academyList.length > 0) {
                  setAddAcademyId(academyList[0].academyId);
                }
                setAddBoxNumber("");
              }}
            >
              재고 정보
            </S.BooksModalTitle>
            <S.BooksModalTitle
              style={{
                marginRight: "30px",
                color: !isBooks ? "#000000" : "#5F6268",
                borderBottom: !isBooks ? "1px solid #000000" : "none",
                padding: "5px 20px",
              }}
              onClick={() => {
                setIsAdd(false);
                setIsBooks(false);
                if (academyList.length > 0) {
                  setAddAcademyId(academyList[0].academyId);
                }
                setAddBoxNumber("");
              }}
            >
              도서 정보
            </S.BooksModalTitle>
          </div>
          {isBooks ? (
            <>
              <table>
                <thead>
                  <tr>
                    <th>PLBN</th>
                    <th>보유 지점</th>
                    <th>박스 넘버</th>
                    <th>도서 상태</th>
                    {/* <th>바코드 값</th> */}
                    <th>최종 수정</th>
                    <th>삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {selectBook.books.map((el, index) => {
                    return (
                      <tr>
                        <td>{el.plbn}</td>
                        <td>
                          {academyList.length > 0 ? (
                            <select
                              onChange={onChangeEdit("academyId", index)}
                              value={editList[index].academyId}
                            >
                              {academyList.map((ele) => (
                                <option
                                  value={ele.academyId}
                                  selected={
                                    ele.academyId === Number(el.academy.id)
                                  }
                                >
                                  {ele.location}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <>{el.academy.location}</>
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            style={{}}
                            value={editList?.[index]?.boxNumber}
                            onChange={onChangeEdit("boxNumber", index)}
                          ></input>
                        </td>
                        <td>
                          <select
                            onChange={onChangeEdit("bookStatus", index)}
                            value={editList[index].bookStatus}
                          >
                            <option
                              value={"정상"}
                              selected={el.bookStatus === "정상"}
                            >
                              정상
                            </option>
                            <option
                              value={"파손"}
                              selected={el.bookStatus === "파손"}
                            >
                              파손
                            </option>
                            <option
                              value={"분실"}
                              selected={el.bookStatus === "분실"}
                            >
                              분실
                            </option>
                          </select>
                        </td>
                        <td>{el.updatetime.slice(0, 10)}</td>
                        <td>
                          <DeleteOutlined onClick={onClickDelete(el.id)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "20px",
                }}
              >
                <S.ModalCancelButton
                  style={{
                    width: "58px",
                    height: "34px",
                    backgroundColor: "#EBECEF",
                    color: "#333333",
                  }}
                  onClick={() => {
                    setIsAdd(true);
                  }}
                >
                  추가
                </S.ModalCancelButton>
              </div>
            </>
          ) : (
            <>
              <S.ModalWrapper>
                <S.ModalInputBox style={{ borderTop: "1px solid #dbdde1" }}>
                  <S.EditTitleFont>도서 제목</S.EditTitleFont>
                  <S.EditTagFont>{selectBook.titleAr}</S.EditTagFont>
                </S.ModalInputBox>
                <S.ModalInputBox>
                  <S.EditTitleFont>저자</S.EditTitleFont>

                  <S.EditTagFont>{selectBook.authorAr}</S.EditTagFont>
                </S.ModalInputBox>
                <S.ModalInputBox>
                  <S.EditTitleFont>KPLBN</S.EditTitleFont>
                  <S.EditTagFont>{kplbnFrame(selectBook.kplbn)}</S.EditTagFont>
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
                  <S.EditTitleFont>AR Quiz No.</S.EditTitleFont>
                  <S.EditTagFont>{"#" + selectBook.arQuiz}</S.EditTagFont>
                </S.ModalInputBox>
                <S.ModalInputBox>
                  <S.EditTitleFont>AR</S.EditTitleFont>
                  <S.EditTagFont>{arFrame(selectBook.bl)}</S.EditTagFont>
                </S.ModalInputBox>
                <S.ModalInputBox>
                  <S.EditTitleFont>AR Point</S.EditTitleFont>
                  <S.EditTagFont>{selectBook.arPts + " pts"}</S.EditTagFont>
                </S.ModalInputBox>
                <S.ModalInputBox>
                  <S.EditTitleFont>Lexile</S.EditTitleFont>
                  <S.EditTagFont>
                    {lexileFrame(selectBook.lexileLex) ??
                      lexileFrame(selectBook.lexileAr)}
                  </S.EditTagFont>
                </S.ModalInputBox>
                <S.ModalInputBox>
                  <S.EditTitleFont>WC</S.EditTitleFont>
                  <S.EditTagFont>{addComma(selectBook.wcAr)}</S.EditTagFont>
                </S.ModalInputBox>
              </S.ModalWrapper>
            </>
          )}

          {isAdd ? (
            <div style={{ width: "50%" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "20px 0",
                  alignItems: "center",
                }}
              >
                <div style={{ amily: "Spoqa Han Sans Neo", fontSize: "14px" }}>
                  지점
                </div>
                {academyList.length > 0 ? (
                  <select
                    onChange={(e) => {
                      setAddAcademyId(e.target.value);
                    }}
                    style={{
                      border: "1px solid #DBDDE1",
                      borderRadius: "8px",
                      width: "317px",
                      height: "44px",
                      fontFamily: "Spoqa Han Sans Neo",
                      fontSize: "14px",
                      paddingLeft: "10px",
                    }}
                  >
                    {academyList.map((ele) => (
                      <option value={ele.academyId}>{ele.location}</option>
                    ))}
                  </select>
                ) : (
                  <></>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ fontFamily: "Spoqa Han Sans Neo", fontSize: "14px" }}
                >
                  박스 넘버
                </div>
                <input
                  type="text"
                  value={addBoxNumber}
                  onChange={(e) => {
                    setAddBoxNumber(e.target.value);
                  }}
                  style={{
                    border: "1px solid #DBDDE1",
                    borderRadius: "8px",
                    width: "312px",
                    height: "44px",
                    fontFamily: "Spoqa Han Sans Neo",
                    fontSize: "14px",
                  }}
                ></input>
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: "20px",
                  justifyContent: "end",
                }}
              >
                <button
                  onClick={onClickAddBooks}
                  style={{
                    width: "140px",
                    height: "44px",
                    border: "1px solid #DBDDE1",
                    backgroundColor: "#F7F8FA",
                    borderRadius: "8px",
                    fontFamily: "Spoqa Han Sans Neo",
                    fontSize: "16px",
                    marginRight: "20px",
                  }}
                >
                  확인
                </button>
                <button
                  onClick={() => {
                    setIsAdd(false);
                    if (academyList.length > 0) {
                      setAddAcademyId(academyList[0].academyId);
                    }
                    setAddBoxNumber("");
                  }}
                  style={{
                    width: "140px",
                    height: "44px",
                    border: "1px solid #DBDDE1",
                    backgroundColor: "#F7F8FA",
                    borderRadius: "8px",
                    fontFamily: "Spoqa Han Sans Neo",
                    fontSize: "16px",
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <></>
          )}
          <S.ModalButtonBox>
            {isEdit ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "445px",
                  height: "56px",
                  borderRadius: "70px",
                  backgroundColor: "#000000",
                  justifyContent: "space-around",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  {" "}
                  <img
                    src="/warning.png"
                    style={{ width: "24px", height: "24px" }}
                  />
                  <div
                    style={{
                      marginRight: "50px",
                      color: "#ffffff",
                      fontSize: "17px",
                    }}
                  >
                    {"정말" + (isDelete ? "삭제" : "수정") + "하시겠습니까?"}
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      marginRight: "10px",
                      color: "#ffffff",
                      fontSize: "17px",
                    }}
                    onClick={isDelete ? onClickDeleteBook : onClickOkEdit}
                  >
                    예
                  </div>
                  <div
                    style={{ color: "#ffffff", fontSize: "17px" }}
                    onClick={onClickCancelEdit}
                  >
                    아니요
                  </div>
                </div>
              </div>
            ) : (
              <S.ModalCancelButton
                onClick={() => {
                  setDetailToggle(false);
                  setInputPlace([]);
                  setIsAdd(false);
                  setIsBooks(true);
                  setAddBoxNumber("");
                  if (academyList.length > 0) {
                    setAddAcademyId(academyList[0].academyId);
                  }
                }}
              >
                닫기
              </S.ModalCancelButton>
            )}
          </S.ModalButtonBox>
        </Modal>
      ) : (
        <></>
      )}
    </S.BooksWrapper>
  );
}
