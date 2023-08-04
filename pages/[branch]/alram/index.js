import Calendar from "react-calendar";
import moment from "moment";
import * as S from "../../../src/components/class/class.style";
import "react-calendar/dist/Calendar.css";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import {
  dateToString,
  dateToTime,
  tileClassName,
  dateToInput,
  dateToKoreanTime,
  longWord,
  dateToClock,
  dateToClockOneHour,
} from "../../../src/commons/library/library";
import { Modal } from "antd";
import { BookOutlined, SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_CLASS,
  GET_CLASS,
  CREATE_ATTENDANCE,
  ADD_STUDENTS,
  GET_CLASSES,
  GET_ALL_STUDENTS,
  GET_BOOKS,
  RESERVATION_BOOKS,
  GET_RESERVATION_BOOKS,
  GET_USERS,
  DELETE_TOTAL_BOOKS,
  DELETE_BOOK,
  GET_ATTENDANCE,
  GET_STUDENTS_BY_DATE,
} from "../../../src/components/class/class.query";

const week = ["일", "월", "화", "수", "목", "금", "토"];
const itemsPerPage = 8; // 페이지당 항목 수

export default function ClassPage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [startTimes, setStartTimes] = useState([]);
  const [endTimes, setEndTimes] = useState([]);
  const [createLecture] = useMutation(CREATE_CLASS);
  const [addStudents] = useMutation(ADD_STUDENTS);
  const [reservationBooks] = useMutation(RESERVATION_BOOKS);
  const [deleteTotal] = useMutation(DELETE_TOTAL_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOK);
  const [bookArray, setBookArray] = useState([]);
  const [bookPage, setBookPage] = useState(1);
  const [bookMaxPage, setBookMaxPage] = useState(1);
  const [bookPageList, setBookPageList] = useState(0);
  const [bookSearchWord, setBookSearchWord] = useState("");
  const [isLate, setIsLate] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [lateTime, setLateTime] = useState(dateToClock(date));
  const [lateList, setLateList] = useState([]);
  const [alarmTime, setAlarmTime] = useState("");
  const [alarmType, setAlarmType] = useState("start");

  const { data: lectureData, refetch: refetchLecture } = useQuery(GET_CLASS, {
    variables: {
      academyId: 2,
      date: dateToInput(date),
    },
  });
  const { data: bookData, refetch: refetchBook } = useQuery(GET_BOOKS, {
    variables: {
      minBl: 0,
      maxBl: 0,
      academyId: 2,
      lectureDate: dateToInput(date),
    },
  });
  const [lectures, setLectures] = useState([]);
  const { data, refetch } = useQuery(GET_CLASSES, {
    variables: { academyId: 2 },
  });
  const { data: studentData } = useQuery(GET_ALL_STUDENTS);
  const { data: reservationBookData, refetch: refetchReservation } = useQuery(
    GET_RESERVATION_BOOKS,
    {
      variables: { studentId: 4 },
    }
  );
  const { data: userData } = useQuery(GET_USERS);
  const [createAttendanceMutation] = useMutation(CREATE_ATTENDANCE);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isCalendar, setIsCalendar] = useState(false);
  const [page, setPage] = useState(1);
  const [array, setArray] = useState([]); // initial value changed from undefined to []
  const [searchWord, setSearchWord] = useState("");
  const [classToggle, setClassToggle] = useState(false);
  const [studentToggle, setStudentToggle] = useState(false);
  const [checkList, setCheckList] = useState([]);
  const [selectChild, setSelectChild] = useState();
  const [selectLecture, setSelectLecture] = useState();
  const [IdList, setIdList] = useState([]);
  const [maxPage, setMaxPage] = useState([]);
  const [isAlarm, setIsAlarm] = useState(false);
  const [lateStudents, setLateStudents] = useState([]);
  const [addClassDate, setAddClassDate] = useState(dateToInput(date));
  const [addClassStart, setAddClassStart] = useState(dateToClock(date));
  const [addClassEnd, setAddClassEnd] = useState(dateToClockOneHour(date));
  const [addClassInfo, setAddClassInfo] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [addLectureId, setAddLectureId] = useState("");
  const [addList, setAddList] = useState([]);
  const [searchLecture, setSearchLecture] = useState(dateToInput(date));
  const [searchStudents, setSearchStudents] = useState("");
  const [isBook, setIsBook] = useState(false);
  const [maxScore, setMaxScore] = useState(0);
  const [minScore, setMinScore] = useState(0);
  const [bookWord, setBookWord] = useState("");
  const [bookList, setBookList] = useState([]);
  const [selectBooks, setSelectBooks] = useState([]);
  const [alarmContents, setAlarmContents] = useState();
  const [addClassType, setAddClassType] = useState("once");
  const [routineCount, setRoutineCount] = useState(0);
  const [searchDate, setSearchDate] = useState(new Date());
  const [selectDates, setSelectDates] = useState([]);
  const [selectBookData, setSelectBookData] = useState([]);
  const [searchType, setSearchType] = useState("korName");
  const [isConfirm, setIsConfirm] = useState(false);
  const [isAm, setIsAm] = useState(date.getHours() < 12);
  const onClickCancel = () => {
    setClassToggle(false);
  };
  const onClickCalendar = () => {
    setIsCalendar(!isCalendar);
  };
  const [minWc, setMinWc] = useState(0);
  const [maxWc, setMaxWc] = useState(100000000);
  const { data: attendanceData, refetch: refetchAttendance } = useQuery(
    GET_ATTENDANCE,
    {
      variables: {
        date: dateToInput(date),
        startTime: "17:35",
        academyId: 2,
        endtime: "",
      },
    }
  );
  const totalPages = Math.ceil(
    lectureData?.getLecturesByAcademyAndDate.length / itemsPerPage
  );

  useEffect(() => {
    let lectures = Array.isArray(lectureData?.getLecturesByAcademyAndDate)
      ? [...lectureData?.getLecturesByAcademyAndDate]
      : []; 
    lectures.sort((a, b) => {
      const dateA = new Date(`1970-01-01T${a.startTime}:00`);
      const dateB = new Date(`1970-01-01T${b.startTime}:00`);
      return dateA - dateB;
    });

    setLectures(lectures);

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    setArray(lectures.slice(start, end));

    lectures.forEach((lecture) => {
      lecture.students.forEach((student) => {
        checkAttendanceAndAlarm(lecture, student);
      });
    });
  }, [lectureData, page]);
  function checkAttendanceAndAlarm(lecture, student) {
    const now = new Date();

    const lectureStartTime = new Date(`1970-01-01T${lecture.startTime}:00`);
    if (
      now.getHours() === lectureStartTime.getHours() &&
      now.getMinutes() === lectureStartTime.getMinutes() &&
      !student.attendances.find((attendance) => attendance.status === "entry")
    ) {
      Modal.warning({
        title: `${student.korName} 학생이 아직 등원하지 않았습니다.`,
        content: `${lecture.startTime}에 시작하는 ${lecture.lectureInfo} 수업에 ${student.korName} 학생이 아직 등원하지 않았습니다.`,
      });
    }

    const lectureEndTime = new Date(`1970-01-01T${lecture.endTime}:00`);
    if (
      now == lectureEndTime &&
      !student.attendances.find((attendance) => attendance.status === "exit")
    ) {
      Modal.warning({
        title: `${student.korName} 학생이 아직 하원하지 않았습니다.`,
        content: `${lecture.endTime}에 끝나는 ${lecture.lectureInfo} 수업에 ${student.korName} 학생이 아직 하원하지 않았습니다.`,
      });
    }
  }
  const onClickOk = async () => {
    try {
      const result = await createLecture({
        variables: {
          academyId: 2,
          date: addClassDate,
          startTime: addClassStart,
          endTime: addClassEnd,
          lectureInfo: addClassInfo,
          teacherId: Number(teacherId),
          repeatDay: Number(routineCount),
        },
      });
      if (addList.length !== 0) {
        try {
          const data = await addStudents({
            variables: {
              lectureId: Number(result.data.createLecture.lecture.id),
              studentIds: addList,
            },
          });
          setAddLectureId("");
          setStudentToggle(false);
          setAddList([]);
          setSearchLecture(dateToInput(date));
          setSearchStudents("");
          refetchLecture();
          alert("성공");
        } catch (err) {
          alert(err);
        }
      }
      setClassToggle(false);
      setTeacherId(
        userData?.allUsers.filter((el) => el.userCategory === "선생님")[0].id
      );
      setAddClassInfo("");
      setAddClassDate(dateToInput(date));
      setAddClassStart(dateToClock(date));
      setAddClassEnd(dateToClockOneHour(date));
    } catch (err) {
      console.log(err);
    }
  };

  const onClickPage = (pageNumber) => () => {
    setPage(pageNumber);
  };

  const onClickDate = (value) => {
    const newDate = new Date(value);
    refetchLecture({
      date: dateToInput(newDate),
    });
    setSearchDate(new Date(value));
    newDate.setDate(newDate.getDate());
    setPage(1);
    setCalendarDate(newDate);
    setIsCalendar(false);
  };
  const onClickMoveDate = (number) => () => {
    const newDate = new Date(
      calendarDate.setDate(calendarDate.getDate() + number)
    );
    setCalendarDate(newDate);
    setIsCalendar(false);
    setPage(1);
    refetchLecture({
      date: dateToInput(newDate),
    });
  };

  const onChangeSearch = (event) => {
    setSearchWord(event.target.value);
  };

  const onChangeRoutineCount = (e) => {
    setRoutineCount(Number(e.target.value));
  };

  const onClickBooks = (el, ele) => async () => {
    setSelectChild(el);
    setSelectLecture(ele);
    await refetchReservation({ studentId: Number(el.id) });
    setIsBook(true);
  };

  const onChangeEach = (e, lectureId, studentId) => {
    if (e.target.checked) {
      setCheckList([...checkList, { lectureId, studentId }]);
    } else {
      setCheckList(
        checkList.filter(
          (item) => item.lectureId !== lectureId || item.studentId !== studentId
        )
      );
    }
  };

  const onChangeLectureId = (e) => {
    setAddLectureId(e.target.value);
  };

  const calculateTimes = (timeString) => {
    const timeMoment = moment(timeString, "HH:mm");
    return {
      hours: timeMoment.hours(),
      minutes: timeMoment.minutes(),
    };
  };
  const onClickAttendance = (status) => async () => {
    const newDate = moment();
    const currentCheckList = [...checkList];

    for (const item of currentCheckList) {
      const lecture = lectures.find((lecture) => lecture.id === item.lectureId);
      const student = lecture.students.find(
        (student) => student.id === item.studentId
      );

      let attendanceStatus = status;
      let entryTime = null;
      let exitTime = null;

      if (status === "attendance") {
        // entryTime = new Date(lecture.date + " " + lecture.startTime);
        entryTime = new Date(lecture.date + " " + lateTime);
      } else if (status === "completed") {
        exitTime = new Date(lecture.date + " " + lateTime);
      } else if (status === "late") {
        entryTime = new Date(lecture.date + " " + lateTime);
      }
      let variables = {
        lectureId: Number(lecture.id),
        studentId: student.id,
        statusInput: attendanceStatus,
      };

      if (entryTime) {
        variables.entryTime = entryTime;
      }
      if (exitTime) {
        variables.exitTime = exitTime;
      }

      try {
        await createAttendanceMutation({
          variables,
        });
        setCheckList([]);
      } catch (error) {
        alert(error);
      }
    }
    await refetchLecture();
    setLateTime(dateToClock(date));
  };

  const onClickAddStudents = async () => {
    try {
      const result = await addStudents({
        variables: {
          lectureId: Number(addLectureId),
          studentIds: addList,
        },
      });
      setAddLectureId("");
      setStudentToggle(false);
      setAddList([]);
      setSearchLecture(dateToInput(date));
      setSearchStudents("");

      refetch();
      alert("성공");
    } catch (err) {
      alert(err);
    }
  };

  const onClickBookDelete = (id) => () => {
    const newSelects = selectBooks.filter((el) => el !== id);
    const newBookData = selectBookData.filter(
      (el) => Number(el.books[0].id) !== id
    );
    setSelectBooks(newSelects);
    setSelectBookData(newBookData);
  };

  const onClickAddClass = () => {
    setClassToggle(true);
  };

  const onChangeAddClassStart = (e) => {
    setAddClassStart(e.target.value);
  };
  const onChangeAddClassEnd = (e) => {
    setAddClassEnd(e.target.value);
  };
  const onChangeAddClassInfo = (e) => {
    setAddClassInfo(e.target.value);
  };
  const onChangeAddClassType = (e) => {
    setAddClassType(e.target.value);
  };
  const onChangeTeacherId = (e) => {
    setTeacherId(e.target.value);
  };

  const onClickStudents = (id) => () => {
    const nId = Number(id);
    if (addList.includes(nId)) {
      const newList = [...addList];
      const filter = newList.filter((el) => {
        return el !== nId;
      });
      setAddList(filter);
    } else {
      const newList = [...addList];
      newList.push(nId);
      setAddList(newList);
    }
  };

  const onClickSearchBooks = async () => {
    const newDate = new Date(calendarDate);
    newDate.setDate(newDate.getDate() - 1);
    await refetchBook({
      minBl: Number(minScore),
      maxBl: Number(maxScore),
      academyId: 2,
      lectureDate: dateToInput(searchDate),
    });

    setBookList(bookData);
  };

  const onSelectBook = (book) => () => {
    if (!selectBooks.includes(Number(book.books[0].id))) {
      const newSelectBooks = [...selectBooks];
      const newBookData = [...selectBookData];
      newSelectBooks.push(Number(book.books[0].id));
      newBookData.push(book);
      setSelectBooks(newSelectBooks);
      setSelectBookData(newBookData);
    } else {
      const newSelectBooks = selectBooks.filter((el) => {
        return Number(book.books[0].id) !== el;
      });
      const newBookData = selectBookData.filter((el) => {
        return Number(el.books[0].id) !== Number(book.books[0].id);
      });
      setSelectBooks(newSelectBooks);
      setSelectBookData(newBookData);
    }
  };

  const onClickBookingBooks = (id, title) => async () => {
    if (
      reservationBookData?.studentReservedBooks?.filter((el) => {
        return title === el.booktitle;
      }).length === 0
    ) {
      try {
        const result = await reservationBooks({
          variables: {
            studentId: Number(selectChild.id),
            lectureId: Number(selectLecture.id),
            bookInventoryIds: [id],
          },
        });
        refetchLecture();
        refetchReservation();
      } catch (err) {
        alert(err);
      }
    }
  };

  const onClickDates = (index) => () => {
    const newDates = [...selectDates];
    if (newDates.includes(index)) {
      setSelectDates(newDates.filter((el) => index !== el));
    } else {
      newDates.push(index);
      setSelectDates(newDates);
    }
  };

  const onClickTotalReturn = async () => {
    try {
      await deleteTotal({ variables: { studentId: Number(selectChild.id) } });
      alert("반납 완료");
      setIsBook(false);
      refetchLecture();
    } catch (err) {
      alert(err);
    }
  };

  const onClickReturnBook = (id) => async () => {
    try {
      await deleteBook({ variables: { bookId: [Number(id)] } });
      refetchReservation();
      refetchLecture();
    } catch (err) {
      alert(err);
    }
  };

  const onChangeAllSelect = () => {
    if (
      array.reduce((acc, cur) => {
        return acc + cur.students.length;
      }, 0) === checkList.length
    ) {
      setCheckList([]);
    } else {
      const newCheckList = [];
      array.forEach((el) => {
        el.students.forEach((ele) => {
          newCheckList.push({
            lectureId: el.id,
            studentId: ele.id,
          });
        });
      });
      setCheckList(newCheckList);
    }
  };

  useEffect(() => {
    const newDate = new Date();
    if (lectureData && lectureData.getLecturesByAcademyAndDate) {
      const startTimesArray = lectureData.getLecturesByAcademyAndDate.map(
        (lecture) => lecture.startTime
      );
      setStartTimes(startTimesArray);
      const startTimesJSON = JSON.stringify(startTimesArray);
      localStorage.setItem("startTimes", startTimesJSON);
      const endTimesArray = lectureData.getLecturesByAcademyAndDate.map(
        (lecture) => lecture.endTime
      );
      setEndTimes(endTimesArray);
      const endTimesJSON = JSON.stringify(endTimesArray);
      localStorage.setItem("endTimes", endTimesJSON);
    }
  }, [lectureData]);
  function parseTime(timeString) {
    const [hour, minute, second] = timeString.split(":");
    const now = new Date();
    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      second
    );
  }
  function checkTargetTime() {
    const now = new Date();

    const startTimesStr = localStorage.getItem("startTimes");
    const endTimesStr = localStorage.getItem("endTimes");

    if (startTimesStr && endTimesStr) {
      const startTimes = JSON.parse(startTimesStr).map(parseTime);
      const endTimes = JSON.parse(endTimesStr).map(parseTime);
      startTimes.forEach(async (startTime) => {
        if (
          now.getHours() === startTime.getHours() &&
          now.getMinutes() === startTime.getMinutes()
        ) {
          const result = await refetchAttendance({
            startTime: dateToClock(startTime),
          });
          setLateList(result?.data?.getAttendance);
          setIsAlarm(true);
          setAlarmTime(dateToClock(startTime));
          setAlarmType("start");
        }
      });

      endTimes.forEach(async (endTime) => {
        if (
          now.getHours() === endTime.getHours() &&
          now.getMinutes() === endTime.getMinutes()
        ) {
          const result = await refetchAttendance({
            endtime: dateToClock(endTime),
            startTime: "",
          });
          setLateList(result?.data?.getAttendance);
          setIsAlarm(true);
          setAlarmTime(dateToClock(endTime));
          setAlarmType("end");
        }
      });
    }
  }
  useEffect(() => {
    setInterval(checkTargetTime, 60 * 1000);
  }, [refetch]);

  useEffect(() => {
    setBookArray(
      bookData === undefined
        ? []
        : bookData?.getBooksByBl
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
            ?.filter((el, index) => {
              return index < bookPage * 20 && index >= (bookPage - 1) * 20;
            })
            ?.map((el) => {
              return el;
            })
    );
    setBookMaxPage(
      Math.ceil(
        bookData?.getBooksByBl
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
          })?.length / 20
      )
    );
    setBookPage(1);
    setBookPageList(0);
  }, [bookData, bookSearchWord]);

  useEffect(() => {
    setBookArray(
      bookData === undefined
        ? []
        : bookData?.getBooksByBl
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
            ?.filter((el, index) => {
              return index < bookPage * 20 && index >= (bookPage - 1) * 20;
            })
            ?.map((el) => {
              return el;
            })
    );
    setBookMaxPage(
      Math.ceil(
        bookData?.getBooksByBl
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
          })?.length / 20
      )
    );
  }, [bookPage, bookSearchWord, minWc, maxWc]);

  useEffect(() => {
    setTeacherId(
      userData?.allUsers.filter((el) => el.userCategory === "선생님")[0].id
    );
  }, [userData]);

  console.log(
    new Date(
      date.setHours(isAm ? (date.getHours() + 12) % 24 : date.getHours())
    )
  );

  return (
    <S.ClassWrapper>
      <S.ClassTitle>수업 관리</S.ClassTitle>
      <S.ClassTitleLine></S.ClassTitleLine>
      <S.ClassTopMenu>
        <div>
          <div style={{ display: "flex" }}>
            <S.DateMoveButton onClick={onClickMoveDate(-1)}>
              {"<"}
            </S.DateMoveButton>
            <S.ClassDate onClick={onClickCalendar}>
              {dateToString(calendarDate)}
            </S.ClassDate>
            <S.DateMoveButton onClick={onClickMoveDate(+1)}>
              {">"}
            </S.DateMoveButton>
          </div>
          {isCalendar ? (
            <Calendar
              onChange={onClickDate}
              value={date}
              locale="en-US"
              tileClassName={tileClassName}
            ></Calendar>
          ) : (
            <></>
          )}
        </div>

        <div>
          <S.ClassButton
            onClick={() => {
              setStudentToggle(true);
            }}
          >
            수업 관리
          </S.ClassButton>

          <S.ClassButton
            onClick={() => {
              setClassToggle(true);
              setAddClassType("once");
            }}
          >
            수업 추가
          </S.ClassButton>
        </div>
      </S.ClassTopMenu>
      <S.ClassMiddleBox>
        <S.ClassMiddleTag>
          <S.CountNumber>
            {(lectureData?.getLecturesByAcademyAndDate.reduce((acc, cur) => {
              return acc + cur.students.length;
            }, 0) ?? 0) + "명"}
          </S.CountNumber>
          <S.ClassSmallGreenButton
            onClick={() => {
              setIsAttendance(true);
              setIsLate(false);
              setIsComplete(false);
            }}
          >
            등원
          </S.ClassSmallGreenButton>
          {isAttendance ? (
            <>
              <div
                style={{
                  display: "flex",
                }}
              >
                <span>{"등원 시간"}</span>
                <input
                  type="time"
                  onChange={(e) => {
                    setLateTime(e.target.value);
                  }}
                  defaultValue={dateToClock(date)}
                ></input>

                <button
                  onClick={() => {
                    onClickAttendance("attendance")();
                    setIsAttendance(false);
                  }}
                >
                  확인
                </button>
                <button
                  onClick={() => {
                    setIsAttendance(false);
                  }}
                >
                  취소
                </button>
              </div>
            </>
          ) : (
            <></>
          )}

          <S.ClassSmallRedButton
            onClick={() => {
              setIsConfirm(true);
            }}
          >
            결석
          </S.ClassSmallRedButton>
          <S.ClassSmallBlueButton
            onClick={() => {
              setIsAttendance(false);
              setIsLate(false);
              setIsComplete(true);
            }}
          >
            하원
          </S.ClassSmallBlueButton>
          {isComplete ? (
            <>
              <div
                style={{
                  display: "flex",
                }}
              >
                <span>{"하원 시간 "}</span>
                <input
                  type="time"
                  onChange={(e) => {
                    setLateTime(e.target.value);
                  }}
                  defaultValue={dateToClock(date)}
                ></input>
                <button
                  onClick={() => {
                    onClickAttendance("completed")();
                    setIsComplete(false);
                  }}
                >
                  확인
                </button>
                <button
                  onClick={() => {
                    setIsComplete(false);
                  }}
                >
                  취소
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
          <S.ClassSmallBlackButton
            onClick={() => {
              setIsAttendance(false);
              setIsLate(true);
              setIsComplete(false);
            }}
          >
            지각
          </S.ClassSmallBlackButton>

          {isLate ? (
            <>
              <div
                style={{
                  display: "flex",
                }}
              >
                <span>{"지각 시간 "}</span>
                <input
                  type="time"
                  onChange={(e) => {
                    setLateTime(e.target.value);
                  }}
                  defaultValue={dateToClock(date)}
                ></input>
                <button
                  onClick={() => {
                    onClickAttendance("late")();
                    setIsLate(false);
                  }}
                >
                  확인
                </button>
                <button
                  onClick={() => {
                    setIsLate(false);
                  }}
                >
                  취소
                </button>
              </div>
            </>
          ) : (
            <></>
          )}
        </S.ClassMiddleTag>
        <S.ClassMiddleTag>
          <S.ClassInput
            type="text"
            onChange={onChangeSearch}
            placeholder="원번 혹은 이름으로 검색해주세요."
          ></S.ClassInput>
        </S.ClassMiddleTag>
      </S.ClassMiddleBox>
      <S.Table>
        <S.TableHeaderRound>
          <S.TableHeadLeft style={{ width: "30%" }}>
            <input
              type="checkbox"
              style={{ width: "40px", height: "40px" }}
              checked={
                checkList.length !== 0 &&
                array.reduce((acc, cur) => {
                  return acc + cur.students.length;
                }, 0) === checkList.length
              }
              onChange={onChangeAllSelect}
            ></input>
          </S.TableHeadLeft>
          <S.TableHead style={{ width: "30%" }}>원생 번호</S.TableHead>
          <S.TableHead style={{ width: "60%" }}>원생명</S.TableHead>
          <S.TableHead style={{ width: "60%" }}>수업 시작</S.TableHead>
          <S.TableHead style={{ width: "60%" }}>수업 종료</S.TableHead>
          <S.TableHead style={{ width: "60%" }}>출결 상태</S.TableHead>
          <S.TableHead style={{ width: "60%" }}>등원 시간</S.TableHead>
          <S.TableHead style={{ width: "60%" }}>하원 시간</S.TableHead>
          <S.TableHead style={{ width: "120%" }}>강의 정보</S.TableHead>
          <S.TableHead style={{ width: "30%" }}>수업 준비</S.TableHead>
          <S.TableHead style={{ width: "30%" }}>예약 도서</S.TableHead>
          <S.TableHeadRight style={{ width: "30%" }}>
            원생 정보
          </S.TableHeadRight>
        </S.TableHeaderRound>
        {array?.map((lecture) => {
          return lecture?.students.map((student) => {
            if (
              student.korName.includes(searchWord) ||
              student.engName
                .toUpperCase()
                .includes(searchWord.toUpperCase()) ||
              student.origin.toUpperCase().includes(searchWord.toUpperCase())
            ) {
              return (
                <S.TableRound key={student.id}>
                  <S.TableHeadLeft style={{ width: "30%" }}>
                    <input
                      type="checkbox"
                      style={{ width: "20px", height: "20px" }}
                      onChange={(e) => onChangeEach(e, lecture.id, student.id)}
                      checked={checkList.some(
                        (item) =>
                          item.lectureId === lecture.id &&
                          item.studentId === student.id
                      )}
                    />
                  </S.TableHeadLeft>
                  <S.TableHead style={{ width: "30%" }}>
                    {student.origin}
                  </S.TableHead>
                  <S.TableHead style={{ width: "60%" }}>
                    {student.korName + "(" + student.engName + ")"}
                  </S.TableHead>
                  <S.TableHead style={{ width: "60%" }}>
                    {(lecture.startTime[0] === "0"
                      ? lecture.startTime.slice(1, 2)
                      : lecture.startTime.slice(0, 2)) +
                      "시 " +
                      lecture.startTime.slice(3, 5) +
                      "분"}
                  </S.TableHead>
                  <S.TableHead style={{ width: "60%" }}>
                    {(lecture.endTime[0] === "0"
                      ? lecture.endTime.slice(1, 2)
                      : lecture.endTime.slice(0, 2)) +
                      "시 " +
                      lecture.endTime.slice(3, 5) +
                      "분"}
                  </S.TableHead>

                  <S.TableHead style={{ width: "60%" }}>
                    {student.attendances.filter((el) => {
                      return el.lecture.id === lecture.id;
                    }).length === 0
                      ? ""
                      : student.attendances.filter((el) => {
                          return el.lecture.id === lecture.id;
                        })?.[0].statusDisplay}
                  </S.TableHead>
                  <S.TableHead style={{ width: "60%" }}>
                    {student.attendances.filter((el) => {
                      return el.lecture.id === lecture.id;
                    }).length === 0
                      ? ""
                      : student.attendances.filter((el) => {
                          return el.lecture.id === lecture.id;
                        })?.[0].entryTime !== null
                      ? dateToTime(
                          dateToKoreanTime(
                            student.attendances.filter((el) => {
                              return el.lecture.id === lecture.id;
                            })?.[0].entryTime
                          )
                        )
                      : ""}
                  </S.TableHead>
                  <S.TableHead style={{ width: "60%" }}>
                    {student.attendances.filter((el) => {
                      return el.lecture.id === lecture.id;
                    }).length === 0
                      ? ""
                      : student.attendances.filter((el) => {
                          return el.lecture.id === lecture.id;
                        })?.[0].exitTime !== null
                      ? dateToTime(
                          dateToKoreanTime(
                            student.attendances.filter((el) => {
                              return el.lecture.id === lecture.id;
                            })?.[0].exitTime
                          )
                        )
                      : ""}
                  </S.TableHead>
                  <S.TableHead style={{ width: "120%" }}>
                    {lecture.lectureInfo}
                  </S.TableHead>
                  <S.TableHead style={{ width: "30%" }}>
                    <BookOutlined
                      onClick={onClickBooks(student, lecture)}
                    ></BookOutlined>
                  </S.TableHead>
                  <S.TableHead style={{ width: "30%" }}>
                    {
                      lecture.bookReservations.filter((el) => {
                        return el.student.id === student.id;
                      }).length
                    }
                  </S.TableHead>
                  <S.TableHeadRight style={{ width: "30%" }}>
                    <SearchOutlined
                      onClick={() => {
                        window.open("/2/academy/" + student.id);
                      }}
                    />
                  </S.TableHeadRight>
                </S.TableRound>
              );
            }
          });
        })}
      </S.Table>
      <S.PageContainer>
        {Array.from({ length: totalPages }, (_, i) => (
          <S.PageBox
            key={i}
            style={
              i + 1 === page
                ? { backgroundColor: "purple", color: "#eeeeee" }
                : {}
            }
            onClick={onClickPage(i + 1)}
          >
            {i + 1}
          </S.PageBox>
        ))}
      </S.PageContainer>
      {classToggle ? (
        <Modal
          closable={false}
          open={classToggle}
          width={"55vw"}
          height={"50vh"}
          onCancel={() => {
            setClassToggle(false);
            setAddList([]);
          }}
          footer={null}
        >
          <S.ClassTitle>수업 추가</S.ClassTitle>
          <S.ClassTitleLine></S.ClassTitleLine>
          <S.ModalWrapper>
            <select
              onChange={(event) => {
                setTeacherId(event.target.value);
              }}
              value={teacherId}
            >
              {userData?.allUsers
                .filter((el) => el.userCategory === "선생님")
                .map((el) => {
                  return (
                    <option key={uuidv4()} value={el.profile.id}>
                      {el.profile.korName}
                    </option>
                  );
                })}
            </select>
            <S.ModalInputBox>
              <div>
                <div>수업 날짜</div>
              </div>
              {addClassType === "once" ? (
                <S.InputInput
                  type="date"
                  defaultValue={dateToInput(date)}
                  style={{ width: "50%" }}
                  onChange={(event) => {
                    setAddClassDate(event.target.value);
                  }}
                ></S.InputInput>
              ) : (
                <S.ModalRoutineInput>
                  <div>
                    <input
                      type="number"
                      onChange={onChangeRoutineCount}
                    ></input>
                    <span>주</span>
                  </div>
                  <S.ModalRoutineDates>
                    {week.map((el, index) => {
                      return (
                        <S.ModalRoutineDate
                          key={uuidv4()}
                          onClick={onClickDates(index)}
                          style={
                            selectDates.includes(index)
                              ? { backgroundColor: "purple", color: "#eeeeee" }
                              : {}
                          }
                        >
                          {el}
                        </S.ModalRoutineDate>
                      );
                    })}
                  </S.ModalRoutineDates>
                </S.ModalRoutineInput>
              )}
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>
                <div>수업 시간</div>
              </div>
              <S.TimeBox>
                <input
                  type="time"
                  style={{
                    width: "10vw",
                    fontSize: "17px",
                    border: "1px solid #dddddd",
                    paddingLeft: "12px",
                    borderRadius: "5px",
                  }}
                  defaultValue={dateToClock(date)}
                  onChange={(event) => {
                    setAddClassStart(event.target.value);
                  }}
                ></input>
                ~
                <input
                  type="time"
                  style={{
                    width: "10vw",
                    fontSize: "17px",
                    border: "1px solid #dddddd",
                    paddingLeft: "12px",
                    borderRadius: "5px",
                  }}
                  defaultValue={dateToClockOneHour(date)}
                  onChange={(event) => {
                    setAddClassEnd(event.target.value);
                  }}
                ></input>
              </S.TimeBox>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>
                <div>메모</div>
              </div>
              <S.ModalTextArea
                onChange={(event) => {
                  setAddClassInfo(event.target.value);
                }}
              ></S.ModalTextArea>
            </S.ModalInputBox>
          </S.ModalWrapper>
          <div>
            <span style={{ fontSize: "17px", marginRight: "5px" }}>원생</span>
            <S.InputInput
              onChange={(e) => {
                setSearchStudents(e.target.value);
              }}
              placeholder="원생 이름 혹은 번호"
            ></S.InputInput>
          </div>
          <S.ModalTable>
            <S.ModalTag>
              <S.ModalHeadLeft style={{ width: "30%" }}>원번</S.ModalHeadLeft>
              <S.ModalHeadMiddle style={{ width: "30%" }}>
                이름
              </S.ModalHeadMiddle>
              <S.ModalHeadRight style={{ width: "25%" }}>추가</S.ModalHeadRight>
            </S.ModalTag>
            {studentData?.allStudents
              ?.filter((el) => {
                return (
                  el.profile.origin
                    .toUpperCase()
                    .includes(searchStudents.toUpperCase()) ||
                  el.profile.korName.includes(searchStudents)
                );
              })
              ?.map((el) => {
                return (
                  <S.ModalTag key={uuidv4()}>
                    <S.ModalHeadLeft style={{ width: "30%" }}>
                      {el?.profile.origin}
                    </S.ModalHeadLeft>
                    <S.ModalHeadMiddle style={{ width: "30%" }}>
                      {el?.profile?.korName}
                    </S.ModalHeadMiddle>
                    <S.ModalHeadRight style={{ width: "25%" }}>
                      <input
                        type="checkbox"
                        onChange={onClickStudents(el?.id)}
                        checked={addList.includes(Number(el?.id))}
                      ></input>
                    </S.ModalHeadRight>
                  </S.ModalTag>
                );
              })}
          </S.ModalTable>
          <S.ModalButtonBox>
            <S.ModalCancelButton onClick={onClickCancel}>
              취소
            </S.ModalCancelButton>
            <S.ModalOkButton onClick={onClickOk}>저장</S.ModalOkButton>
          </S.ModalButtonBox>
        </Modal>
      ) : (
        <></>
      )}
      {studentToggle ? (
        <Modal
          closable={false}
          open={studentToggle}
          footer={null}
          width={"50vw"}
          onCancel={() => {
            setStudentToggle(false);
            setAddList([]);
            setAddLectureId("");
            setSearchLecture(dateToInput(date));
            setSearchStudents("");
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontSize: "17px", marginRight: "5px" }}>강의</span>
            <S.InputInput
              type="date"
              defaultValue={dateToInput(date)}
              onChange={(e) => {
                setSearchLecture(e.target.value);
              }}
            ></S.InputInput>
          </div>
          <S.ModalTable style={{ width: "100%" }}>
            {searchLecture !== "" ? (
              <S.ModalTag style={{ width: "100%" }}>
                <S.ModalHeadLeft
                  style={{ width: "10%", background: "#42444e", color: "#fff" }}
                >
                  강의번호
                </S.ModalHeadLeft>
                <S.ModalHeadMiddle
                  style={{ width: "20%", background: "#42444e", color: "#fff" }}
                >
                  날짜
                </S.ModalHeadMiddle>
                <S.ModalHeadMiddle
                  style={{ width: "20%", background: "#42444e", color: "#fff" }}
                >
                  강의시간
                </S.ModalHeadMiddle>
                <S.ModalHeadMiddle
                  style={{ width: "40%", background: "#42444e", color: "#fff" }}
                >
                  설명
                </S.ModalHeadMiddle>
                <S.ModalHeadRight
                  style={{ width: "10%", background: "#42444e", color: "#fff" }}
                >
                  추가
                </S.ModalHeadRight>
              </S.ModalTag>
            ) : (
              <></>
            )}
            {data?.allLectures
              ?.filter((el) => {
                return el.date === searchLecture;
              })
              ?.map((el) => {
                return (
                  <S.ModalTag key={uuidv4()}>
                    <S.ModalHeadLeft style={{ width: "10%" }}>
                      {el.id}
                    </S.ModalHeadLeft>
                    <S.ModalHeadMiddle style={{ width: "20%" }}>
                      {el.date}
                    </S.ModalHeadMiddle>

                    <S.ModalHeadMiddle style={{ width: "20%" }}>
                      {el.startTime.slice(0, 5) + "~" + el.endTime.slice(0, 5)}
                    </S.ModalHeadMiddle>
                    <S.ModalHeadMiddle style={{ width: "40%" }}>
                      {el.lectureInfo}
                    </S.ModalHeadMiddle>
                    <S.ModalHeadRight style={{ width: "10%" }}>
                      <input
                        type="radio"
                        name="addClass"
                        value={el.id}
                        checked={el.id === addLectureId}
                        onClick={onChangeLectureId}
                      ></input>
                    </S.ModalHeadRight>
                  </S.ModalTag>
                );
              })}
          </S.ModalTable>
          <div style={{ marginBottom: "10px", marginTop: "20px" }}>
            <span style={{ fontSize: "17px", marginRight: "5px" }}>원생</span>
            <S.InputInput
              onChange={(e) => {
                setSearchStudents(e.target.value);
              }}
              placeholder="원생 이름 혹은 번호"
            ></S.InputInput>
          </div>
          <S.ModalTable>
            <S.ModalTag>
              <S.ModalHeadLeft
                style={{ width: "35%", background: "#42444e", color: "#fff" }}
              >
                원번
              </S.ModalHeadLeft>
              <S.ModalHeadMiddle
                style={{ width: "35%", background: "#42444e", color: "#fff" }}
              >
                이름
              </S.ModalHeadMiddle>
              <S.ModalHeadRight
                style={{ width: "30%", background: "#42444e", color: "#fff" }}
              >
                추가
              </S.ModalHeadRight>
            </S.ModalTag>
            {studentData?.allStudents
              ?.filter((el) => {
                return (
                  el.profile.origin
                    .toUpperCase()
                    .includes(searchStudents.toUpperCase()) ||
                  el.profile.korName.includes(searchStudents)
                );
              })
              ?.map((el) => {
                return (
                  <S.ModalTag key={uuidv4()}>
                    <S.ModalHeadLeft style={{ width: "35%" }}>
                      {el?.profile.origin}
                    </S.ModalHeadLeft>
                    <S.ModalHeadMiddle style={{ width: "35%" }}>
                      {el?.profile?.korName}
                    </S.ModalHeadMiddle>
                    <S.ModalHeadRight style={{ width: "30%" }}>
                      <input
                        type="checkbox"
                        onChange={onClickStudents(el?.id)}
                        checked={addList.includes(Number(el?.id))}
                      ></input>
                    </S.ModalHeadRight>
                  </S.ModalTag>
                );
              })}
          </S.ModalTable>
          <S.ModalCancelButton
            onClick={() => {
              setStudentToggle(false);
              setAddList([]);
              setAddLectureId("");
              setSearchLecture(dateToInput(date));
              setSearchStudents("");
            }}
          >
            취소
          </S.ModalCancelButton>
          <S.ModalOkButton onClick={onClickAddStudents}>추가</S.ModalOkButton>
        </Modal>
      ) : (
        <></>
      )}
      {isAlarm && lateList?.length > 0 && (
        <Modal
          open={isAlarm}
          footer={null}
          closeIcon={null}
          width={"40%"}
          onCancel={() => {
            setIsAlarm(false);
          }}
        >
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
          <S.AlarmDiv style={{ fontSize: "25px" }}>
            {alarmType === "start" ? "등원" : "하원"} 확인 명단
          </S.AlarmDiv>
          <S.AlarmDiv style={{ fontSize: "25px" }}>
            {"예정 시간 : " + alarmTime}
          </S.AlarmDiv>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              alignItems: "flex-start",
            }}
          >
            <S.AlarmDiv>원생 리스트</S.AlarmDiv>
            <table>
              <thead>
                <tr>
                  <th>원번</th>
                  <th>이름</th>
                  <th>부모님 전화번호</th>
                </tr>
              </thead>
              <tbody>
                {lateList.map((student, index) => (
                  <tr>
                    <td key={index}>
                      {
                        studentData?.allStudents?.find(
                          (el) => el.id === student.id
                        )?.profile.origin
                      }
                    </td>
                    <td key={index}>
                      {
                        studentData?.allStudents?.find(
                          (el) => el.id === student.id
                        )?.profile.korName
                      }
                    </td>
                    <td key={index}>
                      {
                        studentData?.allStudents?.find(
                          (el) => el.id === student.id
                        )?.profile.pmobileno
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <S.AlarmButton
            style={{ marginTop: "30px" }}
            onClick={() => {
              setIsAlarm(false);
            }}
          >
            닫기
          </S.AlarmButton>
        </Modal>
      )}
      {isBook ? (
        <Modal
          open={isBook}
          footer={null}
          closeIcon={null}
          width={"80%"}
          onCancel={() => {
            setIsBook(false);
            refetchBook({ minBl: 0, maxBl: 0 });
            setSelectBookData([]);
            setSelectBooks([]);
          }}
        >
          <S.ModalButtonBox>
            <S.ModalReturnButton onClick={onClickTotalReturn}>
              일괄 반납
            </S.ModalReturnButton>
            <S.ModalCancelButton
              onClick={() => {
                setIsBook(false);
                refetchBook({ minBl: 0, maxBl: 0 });
                setSelectBookData([]);
                setSelectBooks([]);
              }}
            >
              취소
            </S.ModalCancelButton>
          </S.ModalButtonBox>
          <S.ModalTag>{selectChild.korName + " 도서 예약"}</S.ModalTag>
          <table>
            {reservationBookData?.studentReservedBooks.length === 0 ? (
              <></>
            ) : (
              <thead>
                <tr>
                  <th>도서 제목</th>
                  <th>저자</th>
                  <th>AR QUIZ No.</th>
                  <th>plbn</th>
                  <th>Lexile</th>
                  <th>Word Count</th>
                  <th>도서 위치</th>
                  <th>반납</th>
                </tr>
              </thead>
            )}
            <tbody>
              {reservationBookData?.studentReservedBooks?.map((el) => {
                return (
                  <tr>
                    <></>
                    <td>{longWord(el.booktitle)}</td>
                    <td>{el.book.authorAr}</td>
                    <td>{el.book.arQuiz}</td>
                    <td>{el.book.bl}</td>
                    <td>{el.book.lexileLex}</td>
                    <td>{el.book.wcAr}</td>
                    <td>{el.place === null ? "null" : el.place}</td>
                    <td>
                      <button onClick={onClickReturnBook(Number(el.id))}>
                        반납
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {selectBookData.length === 0 ? (
            <></>
          ) : (
            <>
              <S.ModalTag style={{ marginTop: "20px" }}>
                {"예약 예정 도서 리스트"}
              </S.ModalTag>
              <S.ModalTag>
                <S.ModalHeadLeft
                  style={{
                    width: "40%",
                    background: "#42444e",
                    color: "#fff",
                    textAlign: "left",
                    fontSize: "medium",
                  }}
                >
                  도서 제목
                </S.ModalHeadLeft>
                <S.ModalHeadMiddle
                  style={{
                    width: "30%",
                    background: "#42444e",
                    color: "#fff",
                    textAlign: "left",
                    fontSize: "medium",
                  }}
                >
                  AR
                </S.ModalHeadMiddle>

                <S.ModalHeadRight
                  style={{
                    width: "25%",
                    background: "#42444e",
                    color: "#fff",
                    textAlign: "left",
                    fontSize: "small",
                  }}
                >
                  AR QUIZ No.
                </S.ModalHeadRight>
                <S.ModalHeadRight
                  style={{
                    width: "25%",
                    background: "#42444e",
                    color: "#fff",
                    textAlign: "left",
                    fontSize: "small",
                  }}
                >
                  동작
                </S.ModalHeadRight>
              </S.ModalTag>
            </>
          )}
          {selectBookData?.map((el) => {
            return (
              <S.ModalTag key={uuidv4()}>
                <S.ModalHeadLeft style={{ width: "40%" }}>
                  {el.titleAr}
                </S.ModalHeadLeft>
                <S.ModalHeadMiddle style={{ width: "30%" }}>
                  {el.bl}
                </S.ModalHeadMiddle>
                <S.ModalHeadRight style={{ width: "25%" }}>
                  {el.arQuiz}
                </S.ModalHeadRight>
                <S.ModalHeadRight style={{ width: "25%" }}>
                  <S.ModalIcon
                    onClick={onClickBookDelete(Number(el.books[0].id))}
                  >
                    삭제
                  </S.ModalIcon>
                </S.ModalHeadRight>
              </S.ModalTag>
            );
          })}
          <S.ModalWrapper
            style={{
              border: "1px solid #dedede",
              padding: "15px",
              borderRadius: "9px",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            <S.ModalTag>도서 검색</S.ModalTag>
            <S.ModalButtonBox
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
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
                  <div>ar점수</div>
                  <div>
                    최소
                    <S.InputInput
                      type="number"
                      style={{ marginLeft: "10px", marginTop: "10px" }}
                      onChange={(e) => {
                        setMinScore(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          refetchBook({
                            minBl: Number(minScore),
                            maxBl: Number(maxScore),
                          });
                        }
                      }}
                    ></S.InputInput>
                  </div>
                  <div>
                    최대
                    <S.InputInput
                      type="number"
                      style={{ marginLeft: "10px", marginTop: "10px" }}
                      onChange={(e) => {
                        setMaxScore(e.target.value);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          refetchBook({
                            minBl: Number(minScore),
                            maxBl: Number(maxScore),
                          });
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
                  <div>Word Count</div>
                  <div>
                    최소
                    <S.InputInput
                      type="number"
                      style={{ marginLeft: "10px", marginTop: "10px" }}
                      onChange={(e) => {
                        setMinWc(Number(e.target.value));
                      }}
                    ></S.InputInput>
                  </div>
                  <div>
                    최대
                    <S.InputInput
                      type="number"
                      style={{ marginLeft: "10px", marginTop: "10px" }}
                      onChange={(e) => {
                        setMaxWc(
                          Number(
                            e.target.value === "" ? 100000000 : e.target.value
                          )
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
                      type="text"
                      style={{ marginLeft: "10px", marginTop: "10px" }}
                    ></S.InputInput>
                  </div>
                </div>
                <S.ModalAddButton onClick={onClickSearchBooks}>
                  검색
                </S.ModalAddButton>
              </div>
            </S.ModalButtonBox>
          </S.ModalWrapper>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "inline-block",
                textAlign: "right",
                fontWeight: "bold",
                width: "100%",
              }}
            >
              검색
              <S.InputInput
                style={{
                  marginLeft: "10px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
                onChange={(e) => {
                  setBookSearchWord(e.target.value);
                }}
              ></S.InputInput>
            </div>
          </div>
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
            {bookData?.getBooksByBl.length === 0 || bookData === undefined ? (
              <></>
            ) : (
              <thead>
                <tr>
                  <th>도서 제목</th>
                  <th>저자</th>
                  <th>AR QUIZ No.</th>
                  <th>AR</th>
                  <th>Lexile</th>
                  <th>Word Count</th>
                  <th>도서 위치</th>
                  <th>예약</th>
                </tr>
              </thead>
            )}
            <tbody>
              {bookArray
                ?.filter((el) => {
                  return (
                    reservationBookData?.studentReservedBooks.filter((ele) => {
                      return ele.titleAr === el.titleAr;
                    }).length === 0
                  );
                })
                ?.map((el) => {
                  return (
                    <tr>
                      <></>
                      <td>{longWord(el.titleAr)}</td>
                      <td>{el.authorAr}</td>
                      <td>{el.arQuiz}</td>
                      <td>{el.bl}</td>
                      <td>{el.lexileLex}</td>
                      <td>{el.wcAr}</td>
                      <td>
                        {el.books[0].place === null
                          ? "null"
                          : el.books[0].place}
                      </td>
                      <td>
                        <button
                          onClick={onClickBookingBooks(
                            Number(el.id),
                            el.titleAr
                          )}
                        >
                          예약
                        </button>
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
            }}
          >
            {bookData === undefined || bookData?.getBooksByBl.length === 0 ? (
              <></>
            ) : (
              <>
                <button
                  onClick={() => {
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
            {bookData === undefined || bookData?.getBooksByBl.length === 0 ? (
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
        </Modal>
      ) : (
        <></>
      )}
      {isConfirm ? (
        <Modal
          open={isConfirm}
          onCancel={() => {
            setIsConfirm(true);
          }}
          footer={null}
          closable={false}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                fontSize: "27px",
                marginBottom: "30px",
                width: "100%",
                fontWeight: "700",
              }}
            >
              정말 결석 처리를 하시겠습니까?
            </div>
            <div>
              <S.DeleteButton
                onClick={() => {
                  onClickAttendance("absent")();
                  setIsConfirm(false);
                }}
                style={{ backgroundColor: "purple", color: "#e1e1e1" }}
              >
                확인
              </S.DeleteButton>
              <S.DeleteButton
                onClick={() => {
                  setIsConfirm(false);
                }}
                style={{ backgroundColor: "#c2c2c2", color: "#1e1e1e" }}
              >
                취소
              </S.DeleteButton>
            </div>
          </div>
        </Modal>
      ) : (
        <></>
      )}
    </S.ClassWrapper>
  );
}
