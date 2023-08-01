import Calendar from "react-calendar";
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
  const onClickCancel = () => {
    setClassToggle(false);
  };
  const onClickCalendar = () => {
    setIsCalendar(!isCalendar);
  };

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
      refetchLecture();
      setClassToggle(false);
      setTeacherId("");
      setAddClassInfo("");
      setAddClassDate(dateToInput(date));
      setAddClassStart("");
      setAddClassEnd("");
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

    setCalendarDate(newDate);
    setIsCalendar(false);
  };

  const onChangeSearch = (event) => {
    setSearchWord(event.target.value);
  };
  const onClickSearch = () => {
    setPage(1);
    const newArray = [...data?.getLecturesByAcademyAndDate];
    setArray(
      newArray.filter((el) => {
        return el.students.some((ele) => ele.korName.includes(searchWord));
      })
    );
    setMaxPage(
      Array(
        Math.ceil(
          newArray.filter((el) => {
            return el.students.some((ele) => ele.korName.includes(searchWord));
          }).length / 20
        )
      ).fill(1)
    );
    setIdList(
      newArray
        .filter((el) => {
          return el.students.some((ele) => ele.korName.includes(searchWord));
        })
        .filter((_, ind) => {
          return ind < 20 && ind >= 0;
        })
        .map((el) => el.id)
    );
    setCheckList([]);
  };

  const onChangeRoutineCount = (e) => {
    setRoutineCount(Number(e.target.value));
  };
  const onKeyPress = (event) => {
    if (event.key === "Enter") {
      onClickSearch();
    }
  };
  const onClickBooks = (el, ele) => async () => {
    setSelectChild(el);
    setSelectLecture(ele);
    await refetchReservation({ studentId: Number(el.id) });
    // window.open("/" + router.query.branch + "/class/" + el.id, "_blank");
    setIsBook(true);
  };

  const onChangeAll = (e) => {
    setCheckList(e.target.checked ? IdList : []);
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

  const onClickAttendance = (status) => async () => {
    const newDate = new Date();
    const currentTime = `${newDate.getHours()}:${newDate.getMinutes()}:${newDate.getSeconds()}`;
    const currentCheckList = [...checkList];
    console.log(currentCheckList);

    for (const item of currentCheckList) {
      const lecture = lectures.find((lecture) => lecture.id === item.lectureId);
      const student = lecture.students.find(
        (student) => student.id === item.studentId
      );

      let attendanceStatus = status;
      let entryTime = null;
      let exitTime = null;
      console.log(lecture.startTime);
      if (status === "attendance") {
        entryTime = newDate;
        let entryDate = new Date(entryTime);
        let entryHours = entryDate.getHours();
        let entryMinutes = entryDate.getMinutes();

        let lectureTimeParts = lecture.startTime.split(":");
        let lectureHours = parseInt(lectureTimeParts[0]);
        let lectureMinutes = parseInt(lectureTimeParts[1]);

        if (
          entryHours > lectureHours ||
          (entryHours === lectureHours && entryMinutes > lectureMinutes)
        ) {
          attendanceStatus = "late";
        } else {
          attendanceStatus = "attendance";
        }
      } else if (status === "completed") {
        exitTime = newDate;
        console.log(exitTime);
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
      console.log(variables);
      try {
        await createAttendanceMutation({
          variables,
        });
        refetch();
      } catch (error) {
        // console.error("Failed to create attendance:", error);
        alert(error);
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

  const totalPages = Math.ceil(array.length / itemsPerPage);

  useEffect(() => {
    if (data === undefined) {
      return;
    }

    const contentsList = [];

    const startTime = Date.now();

    const alarmTimes = data?.getLecturesByAcademyAndDate
      .map((el) => {
        contentsList.push({ lecture: el, type: "start" });
        return new Date(el.date + " " + el.startTime) - startTime;
      })
      .filter((el) => el > 0); // 알림 시간(밀리초 단위로 설정)

    data?.getLecturesByAcademyAndDate.forEach((el) => {
      if (new Date(el.date + " " + el.endTime) - startTime > 0) {
        contentsList.push({ lecture: el, type: "end" });
        alarmTimes.push(new Date(el.date + " " + el.endTime) - startTime);
      }
    });

    // const endList = data?.getLecturesByAcademyAndDate.map((el) => {
    //   let bookingEndDate = new Date(el.date + " " + el.endTime);
    //   if (bookingEndDate - startTime > 0) {
    //     el.students.forEach((ele) => {
    //       return 1;
    //       // {
    //       //   name: ele.korName,
    //       //   status: "하원",
    //       //   time: dateToTime(bookingEndDate),
    //       // };
    //     });
    //   }
    // });

    const filterList = contentsList.filter((el) => {
      if (el.type === "start") {
        return (
          new Date(el.lecture.date + " " + el.lecture.startTime) - startTime > 0
        );
      } else {
        return (
          new Date(el.lecture.date + " " + el.lecture.endTime) - startTime > 0
        );
      }
    });

    console.log(alarmTimes, "times");

    const openNotification = (index) => {
      // 알림을 열고자 하는 코드를 작성합니다.
      // 예를 들어, 모달 컴포넌트를 열거나 상태를 변경하는 등의 동작을 수행합니다.
      console.log(filterList[index], index, "why");
      setAlarmContents(filterList[index]);
      setIsAlarm(true);
    };

    const animate = () => {
      const elapsedTime = Date.now() - startTime;

      alarmTimes.forEach((time) => {
        if (elapsedTime >= time) {
          openNotification(alarmTimes.indexOf(time));
          filterList.splice(alarmTimes.indexOf(time), 1);
          alarmTimes.splice(alarmTimes.indexOf(time), 1); // 알람 시간 배열에서 해당 시간 제거
          console.log(filterList, alarmTimes, "fl");
        }
      });

      if (alarmTimes.length > 0) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      // 컴포넌트가 unmount되면 알람 시간 배열 초기화
      alarmTimes.length = 0;
    };
  }, [data]);

  useEffect(() => {
    setTeacherId(
      userData?.allUsers.filter((el) => el.userCategory === "선생님")[0].id
    );
  }, [userData]);

  // console.log(teacherId, "data");

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
          <S.ClassSmallButton onClick={onClickAttendance("attendance")}>
            등원
          </S.ClassSmallButton>
          <S.ClassSmallButton onClick={onClickAttendance("absent")}>
            결석
          </S.ClassSmallButton>
          <S.ClassSmallButton onClick={onClickAttendance("completed")}>
            하원
          </S.ClassSmallButton>
          <S.ClassSmallButton onClick={onClickAttendance("makeup")}>
            보강
          </S.ClassSmallButton>
        </S.ClassMiddleTag>
        <S.ClassMiddleTag>
          <S.ClassInput
            type="text"
            onChange={onChangeSearch}
            onKeyPress={onKeyPress}
          ></S.ClassInput>
          <S.ClassSmallButton onClick={onClickSearch}>
            search
          </S.ClassSmallButton>
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
                <S.TableHead
                  //  style={
                  //     // (el.status.includes("결석") &&
                  //     //   dateCalculator(el.start, new Date())) ||
                  //     // (el.status.includes("등원") &&
                  //     //   dateCalculator(el.end, new Date()))
                  //     //   ? { width: "50%", color: "tomato" }
                  //     //   : { width: "50%" }
                  //   }
                  style={{ width: "50%" }}
                >
                  {student.korName}
                </S.TableHead>
                <S.TableHead style={{ width: "70%" }}>
                  {lecture.startTime.slice(0, 5)}
                </S.TableHead>
                <S.TableHead style={{ width: "70%" }}>
                  {lecture.endTime.slice(0, 5)}
                </S.TableHead>

                <S.TableHead style={{ width: "70%" }}>
                  {student.attendances.filter((el) => {
                    return el.lecture.id === lecture.id;
                  }).length === 0
                    ? "결석"
                    : student.attendances.filter((el) => {
                        return el.lecture.id === lecture.id;
                      })?.[0].status}
                </S.TableHead>
                <S.TableHead style={{ width: "70%" }}>
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
        <Modal open={classToggle} width={"55vw"} height={"50vh"} footer={null}>
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
                  el.id.includes(searchStudents) ||
                  el.profile.korName.includes(searchStudents)
                );
              })
              ?.map((el) => {
                return (
                  <S.ModalTag key={uuidv4()}>
                    <S.ModalHeadLeft style={{ width: "30%" }}>
                      {el?.id}
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
      {isAlarm &&
      alarmContents?.lecture.students.filter((el) => {
        return (
          (el.attendances.filter((ele) => {
            return ele.lecture.id === alarmContents.lecture.id;
          }).length === 0 &&
            alarmContents.type === "start") ||
          (el.attendances.filter((ele) => {
            return ele.lecture.id === alarmContents.lecture.id && ele.exitTime;
          }).length !== 0 &&
            alarmContents.type === "end")
        );
      }).length !== 0 ? (
        <Modal open={isAlarm} footer={null} closeIcon={null}>
          <S.AlarmDiv>
            {alarmContents.type === "start" ? "등원" : "하원"}
            시간:
            {alarmContents.type === "start"
              ? alarmContents.lecture.startTime.slice(0, 5)
              : alarmContents.lecture.endTime.slice(0, 5)}
          </S.AlarmDiv>
          {alarmContents?.lecture.students.map((el) => {
            if (
              (el.attendances.filter((ele) => {
                return ele.lecture.id === alarmContents.lecture.id;
              }).length === 0 &&
                alarmContents.type === "start") ||
              (el.attendances.filter((ele) => {
                console.log(ele, "ele");
                return (
                  ele.lecture.id === alarmContents.lecture.id && ele.exitTime
                );
              }).length !== 0 &&
                alarmContents.type === "end")
            )
              return <S.AlarmDiv>{el.korName}</S.AlarmDiv>;
          })}
          <S.AlarmButton
            onClick={() => {
              setIsAlarm(false);
            }}
          >
            닫기
          </S.AlarmButton>
        </Modal>
      ) : (
        <></>
      )}
      {isBook ? (
        <Modal open={isBook} footer={null} closeIcon={null} width={"80%"}>
          <S.ModalButtonBox>
            <S.ModalOkButton onClick={onClickTotalReturn}>
              일괄 반납
            </S.ModalOkButton>
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
            <S.ModalTag>점수 범위 선택</S.ModalTag>
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
                최소
                <S.InputInput
                  type="number"
                  onChange={(e) => {
                    setMinScore(e.target.value);
                  }}
                ></S.InputInput>
                최대
                <S.InputInput
                  type="number"
                  onChange={(e) => {
                    setMaxScore(e.target.value);
                  }}
                ></S.InputInput>
                <S.ModalAddButton onClick={onClickSearchBooks}>
                  검색
                </S.ModalAddButton>
              </div>
              <div>
                제목
                <S.InputInput
                  onChange={(e) => {
                    setBookWord(e.target.value);
                  }}
                ></S.InputInput>
              </div>
            </S.ModalButtonBox>
          </S.ModalWrapper>
          {bookData?.getBooksByBl.length === 0 || bookData === undefined ? (
            <></>
          ) : (
            <S.ModalTag>
              <S.ModalHeadLeft style={{ width: "10%" }}>체크</S.ModalHeadLeft>
              <S.ModalHeadLeft style={{ width: "50%" }}>제목</S.ModalHeadLeft>
              <S.ModalHeadMiddle style={{ width: "10%" }}>
                점수
              </S.ModalHeadMiddle>
              <S.ModalHeadRight style={{ width: "25%" }}>
                ar퀴즈
              </S.ModalHeadRight>
            </S.ModalTag>
          )}
          {bookData?.getBooksByBl
            .filter((ele) => {
              return ele.titleAr.toUpperCase().includes(bookWord.toUpperCase());
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
            })}
        </Modal>
      ) : (
        <></>
      )}
    </S.ClassWrapper>
  );
}
