import Calendar from "react-calendar";
import moment from "moment";
import * as S from "./class.style";
import "react-calendar/dist/Calendar.css";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import {
  dateToString,
  dateToTime,
  tileClassName,
  dateToInput,
  dateToKoreanTime,
  longWord,
} from "../../commons/library/library";
import { Modal } from "antd";
import { BookOutlined } from "@ant-design/icons";
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
} from "./class.query";

const week = ["일", "월", "화", "수", "목", "금", "토"];
const itemsPerPage = 20; // 페이지당 항목 수

export default function ClassPage() {
  const router = useRouter();
  const [date] = useState(new Date());
  const [createLecture] = useMutation(CREATE_CLASS);
  const [addStudents] = useMutation(ADD_STUDENTS);
  // const [createAttendance] = useMutation(CREATE_ATTENDANCE);
  const [reservationBooks] = useMutation(RESERVATION_BOOKS);
  const [deleteTotal] = useMutation(DELETE_TOTAL_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOK);
  const [bookArray, setBookArray] = useState([]);
  const { data, refetch } = useQuery(GET_CLASS, {
    variables: {
      academyId: Number(router.query.branch),
      date: dateToInput(date),
    },
  });
  const { data: bookData, refetch: refetchBook } = useQuery(GET_BOOKS, {
    variables: {
      minBl: 0,
      maxBl: 0,
      academyId: Number(router.query.branch),
      lectureDate: dateToInput(date),
    },
  });

  const [lectures, setLectures] = useState([]);
  const { data: lectureData, refetch: refetchLecture } = useQuery(GET_CLASSES, {
    variables: { academyId: Number(router.query.branch) },
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
  const [addClassDate, setAddClassDate] = useState(dateToInput(date));
  const [addClassStart, setAddClassStart] = useState("");
  const [addClassEnd, setAddClassEnd] = useState("");
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
  const onClickCancel = () => {
    setClassToggle(false);
  };
  const onClickCalendar = () => {
    setIsCalendar(!isCalendar);
  };

  const totalPages = Math.ceil(
    // array.reduce((acc, cur) => {
    //   return acc + cur.students.length;
    // }, 0) / itemsPerPage
    array.reduce((acc, cur) => {
      return 1 + acc;
    }, 0) / itemsPerPage
  );

  useEffect(() => {
    if (data) {
      const lateStudents = data.getLecturesByAcademyAndDate.flatMap(
        (lecture) => {
          return lecture.students.filter((student) => {
            const attendance = student.attendances.find(
              (attendance) => attendance.lecture.id === lecture.id
            );
            if (
              attendance &&
              attendance.status !== "absent" &&
              attendance.status !== "makeup"
            ) {
              return (
                attendance.entryTime === null || attendance.exitTime === null
              );
            }
            return false;
          });
        }
      );
      localStorage.setItem("lateStudents", JSON.stringify(lateStudents));
    }
  }, [data]);

  useEffect(() => {
    let lectures = Array.isArray(data?.getLecturesByAcademyAndDate)
      ? [...data?.getLecturesByAcademyAndDate]
      : []; // 원본 배열을 복사

    // 시작 시간을 기준으로 정렬
    lectures.sort((a, b) => {
      const dateA = new Date(`1970-01-01T${a.startTime}:00`);
      const dateB = new Date(`1970-01-01T${b.startTime}:00`);
      return dateA - dateB;
    });

    setLectures(lectures);

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setArray(lectures.slice(start, end));
  }, [data, page]);

  const onClickOk = async () => {
    try {
      const result = await createLecture({
        variables: {
          academyId: Number(router.query.branch),
          date: addClassDate,
          startTime: addClassStart,
          endTime: addClassEnd,
          lectureInfo: addClassInfo,
          teacherId: Number(teacherId),
          repeatDay: Number(routineCount),
        },
      });
      console.log(result, "result");
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
          refetch();
          alert("성공");
        } catch (err) {
          alert(err);
        }
      }
      refetchLecture();
      setClassToggle(false);
      setTeacherId("");
      setAddClassInfo("");
      setAddClassDate(dateToInput(date));
      setAddClassStart("");
      setAddClassEnd("");

      if (data) {
        const lateStudents = data.getLecturesByAcademyAndDate.flatMap(
          (lecture) => {
            return lecture.students.filter((student) => {
              const attendance = student.attendances.find(
                (attendance) => attendance.lecture.id === lecture.id
              );
              if (
                attendance &&
                attendance.status !== "absent" &&
                attendance.status !== "makeup"
              ) {
                return (
                  attendance.entryTime === null || attendance.exitTime === null
                );
              }
              return false;
            });
          }
        );
        localStorage.setItem("lateStudents", JSON.stringify(lateStudents));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onClickPage = (pageNumber) => () => {
    setPage(pageNumber);
  };

  /* ??????? */
  const onClickDate = (value) => {
    const newDate = new Date(value);
    refetch({
      date: dateToInput(newDate),
    });
    setSearchDate(new Date(value));
    newDate.setDate(newDate.getDate());
    setPage(1);
    setCalendarDate(newDate);
    setIsCalendar(false);
  };

  // 여기도 검색시 바로 변화 데이터 아래 변하는 식으로 변경해주세요 + 원생 영어이름 engName도 같이 표시 / 원번origin 도 같이 표시 / 해당 내용으로 검색 가능하게 변경
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
    // window.open("/" + router.query.branch + "/class/" + el.id, "_blank");
    setIsBook(true);
  };

  // const onChangeAll = (e) => {
  //   setCheckList(e.target.checked ? IdList : []);
  // };

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
        entryTime = newDate.toDate();
        const entryTimes = calculateTimes(newDate.format("HH:mm:ss"));
        const lectureTimes = calculateTimes(lecture.startTime);
        console.log(entryTimes);
        console.log(lectureTimes);
        if (
          entryTimes.hours > lectureTimes.hours ||
          (entryTimes.hours === lectureTimes.hours &&
            entryTimes.minutes > lectureTimes.minutes)
        ) {
          attendanceStatus = "late";
        } else {
          attendanceStatus = "attendance";
        }
      } else if (status === "completed") {
        exitTime = newDate.toDate();
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
        await refetch();
        if (data) {
          const lateStudents = data.getLecturesByAcademyAndDate.flatMap(
            (lecture) => {
              return lecture.students.filter((student) => {
                const attendance = student.attendances.find(
                  (attendance) => attendance.lecture.id === lecture.id
                );
                if (
                  attendance &&
                  attendance.status !== "absent" &&
                  attendance.status !== "makeup"
                ) {
                  return (
                    attendance.entryTime === null ||
                    attendance.exitTime === null
                  );
                }
                return false;
              });
            }
          );
          localStorage.setItem("lateStudents", JSON.stringify(lateStudents));
        }
      } catch (error) {
        alert("Error occurred while creating attendance: " + error.message);
      }
    }
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
    console.log(newSelects, newBookData, "3");
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
    console.log(newDate);
    await refetchBook({
      minBl: Number(minScore),
      maxBl: Number(maxScore),
      academyId: Number(router.query.branch),
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
      console.log(newBookData);
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

  const onClickBookingBooks = async () => {
    try {
      const result = await reservationBooks({
        variables: {
          studentId: Number(selectChild.id),
          lectureId: Number(selectLecture.id),
          bookInventoryIds: selectBooks,
        },
      });
      refetchBook({ minBl: 0, maxBl: 0 });
      setIsBook(false);
      setSelectBooks([]);
      setSelectBookData([]);
      alert("예약 성공");
    } catch (err) {
      alert(err);
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
    console.log(newDates);
  };

  const onClickTotalReturn = async () => {
    try {
      await deleteTotal({ variables: { studentId: Number(selectChild.id) } });
      alert("반납 완료");
      setIsBook(false);
    } catch (err) {
      alert(err);
    }
  };

  const onClickReturnBook = (id) => async () => {
    try {
      await deleteBook({ variables: { bookId: [Number(id)] } });
      refetchReservation();
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    if (!data) {
      console.log("Data is not available yet");
      return;
    }

    const currentTime = Date.now();
    let lateStudents = JSON.parse(localStorage.getItem("lateStudents") || "[]");
    console.log("Current late students:", lateStudents);

    const alarmTimes = data.getLecturesByAcademyAndDate.flatMap((lecture) => {
      const startTime = new Date(
        lecture.date + "T" + lecture.startTime
      ).getTime();
      const endTime = new Date(lecture.date + "T" + lecture.endTime).getTime();
      return [startTime - currentTime, endTime - currentTime].filter(
        (time) => time > 0
      );
    });

    console.log("Alarm times:", alarmTimes);

    const updateLateStudents = (lecture, type) => {
      return lecture.students.filter((student) => {
        const attendance = student.attendances.find(
          (attendance) => attendance.lecture.id === lecture.id
        );
        if (
          attendance &&
          attendance.status !== "absent" &&
          attendance.status !== "makeup"
        ) {
          const time = new Date(
            attendance[type === "start" ? "entryTime" : "exitTime"]
          ).getTime();
          const lectureTime = new Date(
            lecture.date + "T" + lecture[type]
          ).getTime();
          return (
            currentTime >= lectureTime &&
            attendance[type === "start" ? "entryTime" : "exitTime"] === null
          );
        }
        return false;
      });
    };

    const openNotification = () => {
      const currentTime = Date.now();
      const item = data.getLecturesByAcademyAndDate.find((lecture) => {
        const startTime = new Date(
          lecture.date + "T" + lecture.startTime
        ).getTime();
        const endTime = new Date(
          lecture.date + "T" + lecture.endTime
        ).getTime();
        return (
          (currentTime >= startTime && currentTime < endTime) ||
          currentTime >= endTime
        );
      });

      if (!item) {
        console.log("No lecture found");
        return;
      }

      const type =
        currentTime >= new Date(item.date + "T" + item.startTime).getTime() &&
        currentTime < new Date(item.date + "T" + item.endTime).getTime()
          ? "start"
          : "end";
      console.log("Type:", type);
      lateStudents = updateLateStudents(item, type);

      if (lateStudents.length > 0) {
        const studentNames = lateStudents
          .map((student) => student.korName)
          .join(", ");
        console.log(
          `${studentNames} 학생이 아직 ${
            type === "start" ? "등원" : "하원"
          }하지 않았습니다.`
        );
      }

      localStorage.setItem("lateStudents", JSON.stringify(lateStudents));
    };

    const intervalId = setInterval(() => {
      if (alarmTimes.length === 0) {
        console.log("No more alarm times");
        return;
      }

      if (Date.now() - currentTime >= alarmTimes[0]) {
        console.log("Opening notification");
        openNotification();
        alarmTimes.shift();
      }
    }, 10 * 60 * 1000);

    console.log("Set interval:", intervalId);

    return () => {
      console.log("Clear interval:", intervalId);
      clearInterval(intervalId);
    };
  }, [data]);

  useEffect(() => {
    setTeacherId(
      userData?.allUsers.filter((el) => el.userCategory === "선생님")[0].id
    );
  }, [userData]);

  return (
    <S.ClassWrapper>
      <S.ClassTitle>수업 관리</S.ClassTitle>
      <S.ClassTitleLine></S.ClassTitleLine>
      <S.ClassTopMenu>
        <div>
          <S.ClassDate onClick={onClickCalendar}>
            {dateToString(calendarDate)}
          </S.ClassDate>
          {isCalendar ? (
            <Calendar
              // calendarType="gregory"
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
            {data?.getLecturesByAcademyAndDate.reduce((acc, cur) => {
              return acc + cur.students.length;
            }, 0) + "명"}
          </S.CountNumber>
          <S.ClassSmallGreenButton onClick={onClickAttendance("attendance")}>
            등원
          </S.ClassSmallGreenButton>
          <S.ClassSmallRedButton onClick={onClickAttendance("absent")}>
            결석
          </S.ClassSmallRedButton>
          <S.ClassSmallBlueButton onClick={onClickAttendance("completed")}>
            하원
          </S.ClassSmallBlueButton>
          <S.ClassSmallBlackButton onClick={onClickAttendance("makeup")}>
            보강
          </S.ClassSmallBlackButton>
        </S.ClassMiddleTag>
        <S.ClassMiddleTag>
          {/* <S.SearchSelect
            onChange={(e) => {
              setSearchType(e.target.value);
            }}
          >
            <option value={"korName"}>원생 이름</option>
            <option value={"engName"}>영어 이름</option>
            <option value={"origin"}>원생 번호</option>
          </S.SearchSelect> */}
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
            {/* <input
              type="checkbox"
              onChange={onChangeAll}
              checked={checkList.length === IdList?.length}
            /> */}
          </S.TableHeadLeft>
          <S.TableHead style={{ width: "30%" }}>원생 번호</S.TableHead>
          <S.TableHead style={{ width: "60%" }}>원생명</S.TableHead>
          <S.TableHead style={{ width: "60%" }}>수업 시작</S.TableHead>
          <S.TableHead style={{ width: "60%" }}>수업 종료</S.TableHead>
          <S.TableHead style={{ width: "60%" }}>출결 상태</S.TableHead>
          <S.TableHead style={{ width: "60%" }}>등원 시간</S.TableHead>
          <S.TableHead style={{ width: "60%" }}>하원 시간</S.TableHead>
          <S.TableHead style={{ width: "120%" }}>강의 정보</S.TableHead>
          {/* <S.TableHead style={{ width: "70%" }}>예약 도서</S.TableHead> */}
          <S.TableHeadRight style={{ width: "50%" }}>
            수업 준비
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
                  <S.TableHead
                    //  style={
                    //     // (el.status.includes("결석") &&
                    //     //   dateCalculator(el.start, new Date())) ||
                    //     // (el.status.includes("등원") &&
                    //     //   dateCalculator(el.end, new Date()))
                    //     //   ? { width: "50%", color: "tomato" }
                    //     //   : { width: "50%" }
                    //   }
                    style={{ width: "60%" }}
                  >
                    {student.korName + "(" + student.engName + ")"}
                  </S.TableHead>
                  <S.TableHead style={{ width: "60%" }}>
                    {lecture.startTime.slice(0, 5)}
                  </S.TableHead>
                  <S.TableHead style={{ width: "60%" }}>
                    {lecture.endTime.slice(0, 5)}
                  </S.TableHead>

                  <S.TableHead style={{ width: "60%" }}>
                    {student.attendances.filter((el) => {
                      return el.lecture.id === lecture.id;
                    }).length === 0
                      ? "결석"
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
                  <S.TableHeadRight style={{ width: "50%" }}>
                    <BookOutlined
                      onClick={onClickBooks(student, lecture)}
                    ></BookOutlined>
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
            <S.ModalRadioBox>
              <input
                type="radio"
                name="type"
                defaultChecked={true}
                value={"once"}
                onClick={() => setAddClassType("once")}
              ></input>
              <div>단일</div>
              <input
                type="radio"
                name="type"
                value={"routine"}
                onClick={() => setAddClassType("routine")}
              ></input>
              <div>반복</div>
            </S.ModalRadioBox>
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
                    console.log(event.target.value);
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
          <div>
            <span style={{ fontSize: "17px", marginRight: "5px" }}>강의</span>
            <S.InputInput
              type="date"
              defaultValue={dateToInput(date)}
              onChange={(e) => {
                setSearchLecture(e.target.value);
              }}
            ></S.InputInput>
          </div>
          <S.ModalTable>
            {searchLecture !== "" ? (
              <S.ModalTag>
                <S.ModalHeadLeft style={{ width: "10%" }}>
                  강의번호
                </S.ModalHeadLeft>
                <S.ModalHeadMiddle style={{ width: "15%" }}>
                  날짜
                </S.ModalHeadMiddle>
                <S.ModalHeadMiddle style={{ width: "15%" }}>
                  강의시간
                </S.ModalHeadMiddle>
                <S.ModalHeadMiddle style={{ width: "35%" }}>
                  설명
                </S.ModalHeadMiddle>
                <S.ModalHeadRight style={{ width: "10%" }}>
                  추가
                </S.ModalHeadRight>
              </S.ModalTag>
            ) : (
              <></>
            )}
            {lectureData?.allLectures
              ?.filter((el) => {
                return el.date === searchLecture;
              })
              ?.map((el) => {
                return (
                  <S.ModalTag key={uuidv4()}>
                    <S.ModalHeadLeft style={{ width: "10%" }}>
                      {el.id}
                    </S.ModalHeadLeft>
                    <S.ModalHeadMiddle style={{ width: "15%" }}>
                      {el.date}
                    </S.ModalHeadMiddle>

                    <S.ModalHeadMiddle style={{ width: "15%" }}>
                      {el.startTime.slice(0, 5) + "~" + el.endTime.slice(0, 5)}
                    </S.ModalHeadMiddle>
                    <S.ModalHeadMiddle style={{ width: "35%" }}>
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
      {isAlarm && lateStudents.length > 0 && (
        <Modal
          open={isAlarm}
          footer={null}
          closeIcon={null}
          width={"40%"}
          onCancel={() => {
            setIsAlarm(false);
          }}
        >
          <S.AlarmDiv style={{ fontSize: "25px" }}>등원 확인 명단</S.AlarmDiv>
          <S.AlarmDiv style={{ fontSize: "25px" }}>
            예정 시간:
            {lateStudents[0].lecture.startTime.slice(0, 5)}
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
            {lateStudents.map((student, index) => (
              <S.AlarmDiv key={index}>{"이름 : " + student.korName}</S.AlarmDiv>
            ))}
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
            <S.ModalOkButton onClick={onClickBookingBooks}>
              예약
            </S.ModalOkButton>
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

          {reservationBookData?.studentReservedBooks.length === 0 ? (
            <></>
          ) : (
            <>
              {" "}
              <S.ModalTag>{"예약된 도서"}</S.ModalTag>
              <S.ModalTag>
                <S.ModalHeadLeft style={{ width: "40%" }}>제목</S.ModalHeadLeft>
                <S.ModalHeadMiddle style={{ width: "30%" }}>
                  박스 넘버
                </S.ModalHeadMiddle>
                <S.ModalHeadRight style={{ width: "25%" }}>
                  반납
                </S.ModalHeadRight>
              </S.ModalTag>
            </>
          )}
          {reservationBookData?.studentReservedBooks.map((el) => {
            return (
              <S.ModalTag key={uuidv4()}>
                <S.ModalHeadLeft style={{ width: "40%" }}>
                  {el.booktitle}
                </S.ModalHeadLeft>
                <S.ModalHeadMiddle style={{ width: "30%" }}>
                  {el.boxNumber}
                </S.ModalHeadMiddle>
                <S.ModalHeadRight style={{ width: "25%" }}>
                  <button onClick={onClickReturnBook(el.id)}>반납</button>
                </S.ModalHeadRight>
              </S.ModalTag>
            );
          })}
          {selectBookData.length === 0 ? (
            <></>
          ) : (
            <>
              <S.ModalTag style={{ marginTop: "20px" }}>
                {"예약 예정 도서 리스트"}
              </S.ModalTag>
              <S.ModalTag>
                <S.ModalHeadLeft style={{ width: "40%" }}>제목</S.ModalHeadLeft>
                <S.ModalHeadMiddle style={{ width: "30%" }}>
                  ar점수
                </S.ModalHeadMiddle>

                <S.ModalHeadRight style={{ width: "25%" }}>
                  ar퀴즈
                </S.ModalHeadRight>
                <S.ModalHeadRight style={{ width: "25%" }}>
                  삭제
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
                }}
              >
                <div
                  style={{
                    border: "1px solid black",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div>ar점수</div>
                  <div>
                    최소
                    <S.InputInput
                      type="number"
                      onChange={(e) => {
                        setMinScore(e.target.value);
                      }}
                    ></S.InputInput>
                  </div>
                  <div>
                    최대
                    <S.InputInput
                      type="number"
                      onChange={(e) => {
                        setMaxScore(e.target.value);
                      }}
                    ></S.InputInput>
                  </div>
                </div>
                <div
                  style={{
                    border: "1px solid black",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div>Word Count</div>
                  <div>
                    최소
                    <S.InputInput type="number"></S.InputInput>
                  </div>
                  <div>
                    최대
                    <S.InputInput type="number"></S.InputInput>
                  </div>
                </div>
                <div
                  style={{
                    border: "1px solid black",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div>PLBN</div>
                  <div>
                    검색
                    <S.InputInput type="number"></S.InputInput>
                  </div>
                </div>
                <div
                  style={{
                    border: "1px solid black",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div>제목</div>
                  <div>
                    검색
                    <S.InputInput
                      onChange={(e) => {
                        setBookWord(e.target.value);
                      }}
                    ></S.InputInput>
                  </div>
                </div>
                <S.ModalAddButton onClick={onClickSearchBooks}>
                  검색
                </S.ModalAddButton>
              </div>
              {/* <div>
                제목
                <S.InputInput
                  onChange={(e) => {
                    setBookWord(e.target.value);
                  }}
                ></S.InputInput>
              </div> */}
            </S.ModalButtonBox>
          </S.ModalWrapper>
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
            {/* {bookData?.getBooksByBl
              .filter((ele) => {
                return ele.titleAr
                  .toUpperCase()
                  .includes(bookWord.toUpperCase());
              })
              .map((el) => {
                return (
                  <S.ModalTag key={uuidv4()}>
                    <S.ModalHeadLeft style={{ width: "10%" }}>
                      <input
                        type="checkbox"
                        checked={selectBooks.includes(Number(el.books[0].id))}
                        onChange={onSelectBook(el)}
                      ></input>
                    </S.ModalHeadLeft>
                    <S.ModalHeadLeft style={{ width: "50%" }}>
                      {longWord(el.titleAr)}
                    </S.ModalHeadLeft>
                    <S.ModalHeadMiddle style={{ width: "10%" }}>
                      {el.bl}
                    </S.ModalHeadMiddle>
                    <S.ModalHeadRight style={{ width: "25%" }}>
                      {el.arQuiz}
                    </S.ModalHeadRight>
                  </S.ModalTag>
                );
              })} */}
          </table>
        </Modal>
      ) : (
        <></>
      )}
    </S.ClassWrapper>
  );
}
