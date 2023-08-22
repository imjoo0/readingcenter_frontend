import Calendar from "react-calendar";
import moment from "moment";
import * as S from "./class.style";
import "react-calendar/dist/Calendar.css";
import { v4 as uuidv4 } from "uuid";
import React, { useEffect, useState } from "react";
import {
  dateToString,
  tileClassName,
  dateToInput,
  dateToKoreanTime,
  longWord,
  dateToClock,
  dateToClockOneHour,
  timeToHour,
} from "../../commons/library/library";
import { Modal, Switch } from "antd";
import { BookOutlined, SearchOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_CLASS,
  GET_CLASS,
  CREATE_ATTENDANCE,
  DELETE_STUDENT_FROM_LECTURE,
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
  GET_ALL_LECTURES,
  GET_BOOK_COUNT,
  GET_STUDENTS_BY_DATE,
  CREATE_MAKE_UP,
} from "./class.query";

const week = ["월", "화", "수", "목", "금", "토", "일"];
const itemsPerPage = 20; // 페이지당 항목 수

export default function ClassPage() {
  const router = useRouter();
  const [date, setTodayDate] = useState(new Date());
  const [startTimes, setStartTimes] = useState([]);
  const [endTimes, setEndTimes] = useState([]);
  const [createLecture] = useMutation(CREATE_CLASS);
  const [addStudents] = useMutation(ADD_STUDENTS);
  const [reservationBooks] = useMutation(RESERVATION_BOOKS);
  const [deleteTotal] = useMutation(DELETE_TOTAL_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOK);
  const [createMakeup] = useMutation(CREATE_MAKE_UP);
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
  const [checkDate, setCheckDate] = useState(new Date());
  const [isInfo, setIsInfo] = useState(false);
  const [info, setInfo] = useState("");
  const [isSound, setIsSound] = useState(false);

  const { data: lectureData, refetch: refetchLecture } = useQuery(GET_CLASS, {
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
  const { data, refetch } = useQuery(GET_CLASSES, {
    variables: { academyId: Number(router.query.branch) },
  });
  const { data: reservationBookData, refetch: refetchReservation } = useQuery(
    GET_RESERVATION_BOOKS,
    {
      variables: { studentId: 4 },
    }
  );
  const { data: userData } = useQuery(GET_USERS);
  const { refetch: refetchList } = useQuery(GET_ALL_LECTURES, {
    variables: { academyId: Number(router.query.branch) },
  });
  const { data: studentListData, refetch: refetchStudentList } = useQuery(
    GET_STUDENTS_BY_DATE,
    {
      variables: {
        academyId: Number(router.query.branch),
        date: dateToInput(date),
      },
    }
  );
  const { data: studentData } = useQuery(GET_ALL_STUDENTS, {
    variables: {
      academyId: Number(router.query.branch),
    },
  });
  const [createAttendanceMutation] = useMutation(CREATE_ATTENDANCE);
  const [deleteStudentFromLecture] = useMutation(DELETE_STUDENT_FROM_LECTURE);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isCalendar, setIsCalendar] = useState(false);
  const [page, setPage] = useState(1);
  const [studentArray, setStudentArray] = useState([]);
  const [array, setArray] = useState([]); // initial value changed from undefined to []
  const [searchWord, setSearchWord] = useState("");
  const [classToggle, setClassToggle] = useState(false);
  const [studentToggle, setStudentToggle] = useState(false);
  const [checkList, setCheckList] = useState([]);
  const [selectChild, setSelectChild] = useState();
  const [selectLecture, setSelectLecture] = useState();
  const [isAlarm, setIsAlarm] = useState(false);
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
  const [bookList, setBookList] = useState([]);
  const [selectBooks, setSelectBooks] = useState([]);
  const [addClassType, setAddClassType] = useState("once");
  const [routineCount, setRoutineCount] = useState(0);
  const [searchDate, setSearchDate] = useState(new Date());
  const [selectDates, setSelectDates] = useState([]);
  const [selectBookData, setSelectBookData] = useState([]);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isAm, setIsAm] = useState(date.getHours() < 12);
  const [isMakeUp, setIsMakeUp] = useState(false);
  const [intervalArray, setIntervalArray] = useState([]);
  const [allStudent, setAllStudent] = useState([]);
  const [studentPage, setStudentPage] = useState(0);
  const [studentMaxPage, setStudentMaxPage] = useState(0);
  const [confirmState, setConfirmState] = useState("");
  const onClickCancel = () => {
    setClassToggle(false);
    setSelectDates([]);
    setAddList([]);
    setStudentPage(0);
  };
  const onClickCalendar = () => {
    setIsCalendar(!isCalendar);
  };
  const [minWc, setMinWc] = useState(0);
  const [maxWc, setMaxWc] = useState(100000000);
  const [inputPlbn, setInputPlbn] = useState("");
  const { refetch: refetchAttendance } = useQuery(GET_ATTENDANCE, {
    variables: {
      date: dateToInput(date),
      startTime: "17:35",
      academyId: 2,
      endtime: "",
    },
  });

  const { data: bookCountData, refetch: refetchCount } = useQuery(
    GET_BOOK_COUNT,
    {
      variables: {
        academyId: Number(router.query.branch),
      },
    }
  );
  const totalPages = Math.ceil(
    (studentListData?.getLecturesByAcademyAndDateStudents?.filter((el) => {
      return (
        el.student.korName.includes(searchWord) ||
        el.student.origin.toUpperCase().includes(searchWord.toUpperCase()) ||
        el.student.engName.toUpperCase().includes(searchWord.toUpperCase())
      );
    })?.length ?? 1) / itemsPerPage
  );

  useEffect(() => {
    setPage(1);
    let students = Array.isArray(
      studentListData?.getLecturesByAcademyAndDateStudents
    )
      ? [...studentListData?.getLecturesByAcademyAndDateStudents]
      : [];

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setStudentArray(
      students
        .sort((a, b) =>
          a.student.korName.localeCompare(b.student.korName, "ko-KR")
        )
        .sort((a, b) => {
          let timeA = new Date(`1970-01-01T${a.lecture.startTime}`);
          let timeB = new Date(`1970-01-01T${b.lecture.startTime}`);
          if (
            a?.attendanceStatus?.statusDisplay === "하원" ||
            a?.attendanceStatus?.statusDisplay === "결석 (보강)" ||
            a?.attendanceStatus?.statusDisplay === "결석"
          ) {
            timeA = new Date(`1970-01-02T${a.lecture.startTime}`);
          }
          if (
            b?.attendanceStatus?.statusDisplay === "하원" ||
            b?.attendanceStatus?.statusDisplay === "결석 (보강)" ||
            b?.attendanceStatus?.statusDisplay === "결석"
          ) {
            timeB = new Date(`1970-01-02T${a.lecture.startTime}`);
          }
          return timeA - timeB;
        })
        ?.filter((el) => {
          return (
            el.student.korName.includes(searchWord) ||
            el.student.origin
              .toUpperCase()
              .includes(searchWord.toUpperCase()) ||
            el.student.engName.toUpperCase().includes(searchWord.toUpperCase())
          );
        })
        ?.slice(start, end)
    );
  }, [studentListData, searchWord]);
  const onClickMakeUpClass = async () => {
    try {
      await onClickAttendance("makeup")();
    } catch (err) {
      alert(err);
    }
    try {
      const result = await createMakeup({
        variables: {
          academyId: Number(router.query.branch),
          date: addClassDate,
          startTime: addClassStart,
          endTime: addClassEnd,
          lectureInfo: addClassInfo,
          studentIds: checkList.map((el) => {
            return Number(el.studentId);
          }),
          teacherId: Number(teacherId),
          repeatDays: addClassType === "once" ? [-1] : selectDates,
          repeatWeeks: addClassType === "once" ? 1 : routineCount,
        },
      });
      setAddLectureId("");
      setStudentToggle(false);
      setAddList([]);
      setSelectDates([]);
      setSearchLecture(dateToInput(date));
      setSearchStudents("");
      refetchLecture();
      refetchList();
      refetchStudentList();
    } catch (err) {
      alert(err);
    }
    setClassToggle(false);
    setTeacherId(
      userData?.allUsers.filter((el) => el.userCategory === "선생님")[0].id
    );
    setAddClassInfo("");
    setAddClassDate(dateToInput(date));
    setAddClassStart(dateToClock(date));
    setAddClassEnd(dateToClockOneHour(date));
  };
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
          repeatDays: addClassType === "once" ? [-1] : selectDates,
          repeatWeeks: addClassType === "once" ? 1 : routineCount,
        },
      });
      if (addList.length !== 0) {
        result?.data?.createLecture?.lectureIds.forEach(async (el) => {
          try {
            const data = await addStudents({
              variables: {
                lectureId: Number(el),
                studentIds: addList,
              },
            });
            setAddLectureId("");
            setStudentToggle(false);
            setAddList([]);
            setSelectDates([]);
            setSearchLecture(dateToInput(date));
            setSearchStudents("");
            refetchLecture();
            refetchList();
            refetchStudentList();
            setStudentPage(0);
          } catch (err) {
            alert(err);
          }
        });
        alert("성공");
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
    let students = Array.isArray(
      studentListData?.getLecturesByAcademyAndDateStudents
    )
      ? [...studentListData?.getLecturesByAcademyAndDateStudents]
      : [];
    if (students.length !== 0) {
      const start = (pageNumber - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      setStudentArray(
        students
          .sort((a, b) =>
            a.student.korName.localeCompare(b.student.korName, "ko-KR")
          )
          .sort((a, b) => {
            let timeA = new Date(`1970-01-01T${a.lecture.startTime}`);
            let timeB = new Date(`1970-01-01T${b.lecture.startTime}`);
            if (
              a?.attendanceStatus?.statusDisplay === "하원" ||
              a?.attendanceStatus?.statusDisplay === "결석 (보강)" ||
              a?.attendanceStatus?.statusDisplay === "결석"
            ) {
              timeA = new Date(`1970-01-02T${a.lecture.startTime}`);
            }
            if (
              b?.attendanceStatus?.statusDisplay === "하원" ||
              b?.attendanceStatus?.statusDisplay === "결석 (보강)" ||
              b?.attendanceStatus?.statusDisplay === "결석"
            ) {
              timeB = new Date(`1970-01-02T${a.lecture.startTime}`);
            }
            return timeA - timeB;
          })
          ?.filter((el) => {
            return (
              el.student.korName.includes(searchWord) ||
              el.student.origin
                .toUpperCase()
                .includes(searchWord.toUpperCase()) ||
              el.student.engName
                .toUpperCase()
                .includes(searchWord.toUpperCase())
            );
          })
          .slice(start, end)
      );
    } else {
      setStudentArray(students);
    }
    setCheckList([]);
  };
  const onClickDate = (value) => {
    const newDate = new Date(value);
    refetchLecture({
      date: dateToInput(newDate),
    });
    refetchCount();
    setSearchDate(new Date(value));
    newDate.setDate(newDate.getDate());
    setPage(1);
    setCalendarDate(newDate);
    setIsCalendar(false);
    refetchStudentList({ date: dateToInput(newDate) });
  };
  const onClickMoveDate = (number) => () => {
    const newDate = new Date(
      calendarDate.setDate(calendarDate.getDate() + number)
    );
    // newDate.setDate(calendarDate.getDate() + number);
    setCalendarDate(newDate);
    setIsCalendar(false);
    setPage(1);
    refetchLecture({
      date: dateToInput(newDate),
    });
    refetchCount();
    refetchStudentList({ date: dateToInput(newDate) });
  };

  // 여기도 검색시 바로 변화 데이터 아래 변하는 식으로 변경해주세요 + 원생 영어이름 engName도 같이 표시 / 원번origin 도 같이 표시 / 해당 내용으로 검색 가능하게 변경
  const onChangeSearch = (event) => {
    setSearchWord(event.target.value);
    setPage(1);
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
      setCheckList([...checkList, { lectureId, studentId: Number(studentId) }]);
    } else {
      setCheckList(
        checkList.filter(
          (item) =>
            item.lectureId !== lectureId || item.studentId !== Number(studentId)
        )
      );
    }
  };

  const onChangeLectureId = (e) => {
    setAddLectureId(e.target.value);
  };

  // const calculateTimes = (timeString) => {
  //   const timeMoment = moment(timeString, "HH:mm");
  //   return {
  //     hours: timeMoment.hours(),
  //     minutes: timeMoment.minutes(),
  //   };
  // };
  const onClickAttendance = (status) => async () => {
    const newDate = moment();
    const currentCheckList = [...checkList];

    for (const item of currentCheckList) {
      const lecture = studentArray.find(
        (el) =>
          Number(el.lecture.id) === Number(item.lectureId) &&
          Number(el.student.id) === Number(item.studentId)
      );

      let attendanceStatus = status;
      let entryTime = null;
      let exitTime = null;

      if (status === "attendance") {
        // entryTime = new Date(lecture.date + " " + lecture.startTime);
        entryTime = new Date(lecture.lecture.date + " " + lateTime);
      } else if (status === "completed") {
        exitTime = new Date(lecture.lecture.date + " " + lateTime);
      } else if (status === "late") {
        entryTime = new Date(lecture.lecture.date + " " + lateTime);
      }
      let variables = {
        lectureId: Number(lecture.lecture.id),
        studentId: Number(lecture.student.id),
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
    await refetch();
    await refetchStudentList();
    setLateTime(dateToClock(date));
  };
  const onClickDelete = () => async () => {
    const currentCheckList = [...checkList];
    // let student_ids = []
    // let lectureId;
    for (const item of currentCheckList) {
      const lecture = studentArray.find(
        (el) =>
          Number(el.lecture.id) === Number(item.lectureId) &&
          Number(el.student.id) === Number(item.studentId)
      );
      // student_ids.push(Number(lecture.student.id))
      // lectureId = Number(lecture.lecture.id);
      let variables = {
        lectureId: Number(lecture.lecture.id),
        studentIds: [Number(lecture.student.id)],
      };
      try {
        await deleteStudentFromLecture({
          variables,
        });
        setCheckList([]);
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    }
    // setCheckList([]);
    await refetch();
    await refetchStudentList();
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
      refetchStudentList();
      refetch();
      setStudentPage(0);
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
      academyId: Number(router.query.branch),
      lectureDate: dateToInput(searchDate),
    });

    setBookList(bookData);
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
        refetch();
        refetchStudentList();
        refetchReservation();
        refetchCount();
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
      setBookSearchWord("");
      refetchLecture();
      refetchCount();
      refetchStudentList();
    } catch (err) {
      alert(err);
    }
  };

  const onClickReturnBook = (id) => async () => {
    try {
      await deleteBook({ variables: { bookId: [Number(id)] } });
      refetchReservation();
      refetchCount();
      refetchLecture();
      refetchStudentList();
    } catch (err) {
      alert(err);
    }
  };

  const onChangeAllSelect = () => {
    if (studentArray.length === checkList.length) {
      setCheckList([]);
    } else {
      const newCheckList = [];
      studentArray.forEach((el) => {
        newCheckList.push({
          studentId: Number(el.student.id),
          lectureId: el.lecture.id,
        });
      });
      setCheckList(newCheckList);
    }
  };

  useEffect(() => {
    const newDate = new Date();
    if (data && data.allLectures) {
      const startTimesArray = data?.allLectures
        ?.filter((el) => {
          return el.date == dateToInput(date);
        })
        .map((lecture) => lecture.startTime);
      setStartTimes(startTimesArray);
      const startTimesJSON = JSON.stringify(startTimesArray);
      localStorage.setItem("startTimes", startTimesJSON);
      const endTimesArray = data?.allLectures
        ?.filter((el) => {
          return el.date == dateToInput(date);
        })
        .map((lecture) => lecture.endTime);
      setEndTimes(endTimesArray);
      const endTimesJSON = JSON.stringify(endTimesArray);
      localStorage.setItem("endTimes", endTimesJSON);
    }
  }, [data]);

  useEffect(() => {
    if (studentData !== undefined) {
      const start = studentPage * itemsPerPage;
      const end = start + itemsPerPage;
      setStudentMaxPage(
        Math.ceil(studentData?.studentsInAcademy?.length / itemsPerPage)
      );
      const newArray = [
        ...studentData?.studentsInAcademy
          .sort((a, b) => a.korName.localeCompare(b.korName, "ko-KR"))
          .slice(start, end),
      ];
      setAllStudent(newArray);
    }
  }, [studentData, classToggle, studentToggle]);

  useEffect(() => {
    if (studentData !== undefined) {
      setStudentMaxPage(
        Math.ceil(
          studentData?.studentsInAcademy?.filter((el) => {
            return (
              el?.origin
                ?.toUpperCase()
                ?.includes(searchStudents.toUpperCase()) ||
              el?.korName?.includes(searchStudents)
            );
          })?.length / itemsPerPage
        )
      );
      const newArray = [...studentData?.studentsInAcademy];
      setStudentPage(0);
      setAllStudent(
        newArray
          .sort((a, b) => a.korName.localeCompare(b.korName, "ko-KR"))
          ?.filter((el) => {
            return (
              el?.origin
                ?.toUpperCase()
                ?.includes(searchStudents.toUpperCase()) ||
              el?.korName?.includes(searchStudents)
            );
          })
          .slice(0, itemsPerPage)
      );
    }
  }, [searchStudents]);

  const onClickStudentPage = (index) => () => {
    const start = index * itemsPerPage;
    const end = start + itemsPerPage;
    const newArray = [
      ...studentData?.studentsInAcademy
        .sort((a, b) => a.korName.localeCompare(b.korName, "ko-KR"))
        ?.filter((el) => {
          return (
            el?.origin?.toUpperCase()?.includes(searchStudents.toUpperCase()) ||
            el?.korName?.includes(searchStudents)
          );
        })
        .slice(start, end),
    ];
    setAllStudent(newArray);
    setStudentPage(index);
  };

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
  const checkTargetTime = () => () => {
    const now = new Date();
    setCheckDate(now);
    // startTimes와 endTimes 배열을 로컬 스토리지에서 가져오기

    const startTimesStr = localStorage.getItem("startTimes");
    const endTimesStr = localStorage.getItem("endTimes");
    if (startTimesStr && endTimesStr && router.query.branch !== undefined) {
      const startTimes = JSON.parse(startTimesStr).map(parseTime);
      const endTimes = JSON.parse(endTimesStr).map(parseTime);

      // 시작 시간과 종료 시간 비교하여 원하는 동작 수행
      startTimes.forEach(async (startTime) => {
        if (
          (now.getHours() === startTime.getHours() &&
            now.getMinutes() === startTime.getMinutes()) ||
          60 * now.getHours() + now.getMinutes() ===
            60 * startTime.getHours() + startTime.getMinutes() + 5
        ) {
          // 원하는 동작 실행 (예: 알림 표시, WebSocket 메시지 전송 등)
          try {
            const result = await refetchAttendance({
              startTime: dateToClock(startTime),
              academyId: Number(router.query.branch),
            });
            setLateList(result?.data?.getAttendance);
            setIsAlarm(true);
            setAlarmTime(dateToClock(startTime));
            setAlarmType("start");
            if (result?.data?.getAttendance?.length !== 0 && isSound) {
              const audio = new Audio("/2.mp3");
              audio.play();
            }
          } catch {}
        }
      });

      endTimes.forEach(async (endTime) => {
        if (
          (now.getHours() === endTime.getHours() &&
            now.getMinutes() === endTime.getMinutes()) ||
          now.getHours() * 60 + now.getMinutes() ===
            60 * endTime.getHours() + endTime.getMinutes() - 5
        ) {
          // 원하는 동작 실행 (예: 알림 표시, WebSocket 메시지 전송 등)
          try {
            const result = await refetchAttendance({
              endtime: dateToClock(endTime),
              startTime: "",
              academyId: Number(router.query.branch),
            });
            setLateList(result?.data?.getAttendance);
            setIsAlarm(true);
            setAlarmTime(dateToClock(endTime));
            setAlarmType("end");
            if (result?.data?.getAttendance !== null && isSound) {
              const audio = new Audio("/2.mp3");
              audio.play();
            }
          } catch {}
        }
      });
    }
  };

  useEffect(() => {
    // if (router.query.branch !== undefined) {
    intervalArray.forEach((el) => {
      clearInterval(el);
    });
    const intervalA = setInterval(checkTargetTime(), 60 * 1000);
    const newInterval = [...intervalArray];
    newInterval.push(intervalA);
    setIntervalArray(newInterval);
    // }
    return () => clearInterval(intervalA);
  }, [studentData, isSound]); // refetch

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
            ?.filter((el) => {
              return String(el?.kplbn)
                .toUpperCase()
                .includes(inputPlbn.toUpperCase());
            })
            ?.filter((el, index) => {
              return (
                index < bookPage * itemsPerPage &&
                index >= (bookPage - 1) * itemsPerPage
              );
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
          })
          ?.filter((el) => {
            return String(el?.kplbn)
              .toUpperCase()
              .includes(inputPlbn.toUpperCase());
          })?.length / itemsPerPage
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
            ?.filter((el) => {
              return String(el?.kplbn)
                .toUpperCase()
                .includes(inputPlbn.toUpperCase());
            })
            ?.filter((el, index) => {
              return (
                index < bookPage * itemsPerPage &&
                index >= (bookPage - 1) * itemsPerPage
              );
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
          })
          ?.filter((el) => {
            return String(el?.kplbn)
              .toUpperCase()
              .includes(inputPlbn.toUpperCase());
          })?.length / itemsPerPage
      )
    );
  }, [bookPage, bookSearchWord, minWc, maxWc, inputPlbn]);

  useEffect(() => {
    setTeacherId(
      userData?.allUsers.filter((el) => el.userCategory === "선생님")[0].id
    );
  }, [userData]);

  return (
		<S.ClassWrapper>
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
			<S.ClassTitle>수업 관리</S.ClassTitle>

			<S.ClassTopMenu>
				<S.DateBox>
					<S.DateMoveButton onClick={onClickMoveDate(-1)}>
						{'<'}
					</S.DateMoveButton>
					<S.ClassDate onClick={onClickCalendar}>
						{dateToString(calendarDate)}
					</S.ClassDate>
					<S.DateMoveButton onClick={onClickMoveDate(+1)}>
						{'>'}
					</S.DateMoveButton>
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
				</S.DateBox>
			</S.ClassTopMenu>

			<S.ClassMiddleBox>
				<S.ClassMiddleTag>
					<S.CountNumber style={{ marginRight: '1.37rem' }}>
						{'전체 ' +
							(studentListData?.getLecturesByAcademyAndDateStudents?.length ??
								0) +
							'명'}
					</S.CountNumber>
					<S.ClassSmallGreenButton
						onClick={() => {
							setIsAttendance(true);
							setIsLate(false);
							setIsComplete(false);
						}}
					>
						등원
						<div
							style={{
								width: '0.5rem',
								height: '0.5rem',
								background: '#017D73',
								marginLeft: '0.37rem',
								borderRadius: '5rem',
							}}
						></div>
					</S.ClassSmallGreenButton>
					{isAttendance ? (
						<>
							<div
								style={{
									display: 'flex',
								}}
							>
								<S.ClassSmallTimeInput
									type="time"
									onChange={(e) => {
										setLateTime(e.target.value);
									}}
									defaultValue={dateToClock(date)}
								></S.ClassSmallTimeInput>

								<S.ClassSmallTimeBtn
									onClick={() => {
										onClickAttendance('attendance')();
										setIsAttendance(false);
									}}
								>
									확인
								</S.ClassSmallTimeBtn>
								<S.ClassSmallTimeBtn
									onClick={() => {
										setIsAttendance(false);
									}}
								>
									취소
								</S.ClassSmallTimeBtn>
							</div>
						</>
					) : (
						<></>
					)}

					<S.ClassSmallRedButton
						onClick={() => {
							setIsConfirm(true);
							setConfirmState('결석');
						}}
						style={{ marginLeft: '0.75rem' }}
					>
						결석
						<div
							style={{
								width: '0.5rem',
								height: '0.5rem',
								background: '#BD271E',
								marginLeft: '0.37rem',
								borderRadius: '5rem',
							}}
						></div>
					</S.ClassSmallRedButton>
					<S.ClassSmallBlueButton
						onClick={() => {
							setIsAttendance(false);
							setIsLate(false);
							setIsComplete(true);
						}}
						style={{ marginLeft: '0.75rem' }}
					>
						하원
						<div
							style={{
								width: '0.5rem',
								height: '0.5rem',
								background: '#333',
								marginLeft: '0.37rem',
								borderRadius: '5rem',
							}}
						></div>
					</S.ClassSmallBlueButton>
					{isComplete ? (
						<>
							<div
								style={{
									display: 'flex',
								}}
							>
								<S.ClassSmallTimeInput
									type="time"
									onChange={(e) => {
										setLateTime(e.target.value);
									}}
									defaultValue={dateToClock(date)}
								></S.ClassSmallTimeInput>
								<S.ClassSmallTimeBtn
									onClick={() => {
										onClickAttendance('completed')();
										setIsComplete(false);
									}}
								>
									확인
								</S.ClassSmallTimeBtn>
								<S.ClassSmallTimeBtn
									onClick={() => {
										setIsComplete(false);
									}}
								>
									취소
								</S.ClassSmallTimeBtn>
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
						style={{ marginLeft: '0.75rem' }}
					>
						지각
						<div
							style={{
								width: '0.5rem',
								height: '0.5rem',
								background: '#F5A700',
								marginLeft: '0.37rem',
								borderRadius: '5rem',
							}}
						></div>
					</S.ClassSmallBlackButton>
					{isLate ? (
						<>
							<div
								style={{
									display: 'flex',
								}}
							>
								<S.ClassSmallTimeInput
									type="time"
									onChange={(e) => {
										setLateTime(e.target.value);
									}}
									defaultValue={dateToClock(date)}
								></S.ClassSmallTimeInput>
								<S.ClassSmallTimeBtn
									onClick={() => {
										onClickAttendance('late')();
										setIsLate(false);
									}}
								>
									확인
								</S.ClassSmallTimeBtn>
								<S.ClassSmallTimeBtn
									onClick={() => {
										setIsLate(false);
									}}
								>
									취소
								</S.ClassSmallTimeBtn>
							</div>
						</>
					) : (
						<></>
					)}
					<S.ClassSmallBlackButton
						onClick={() => {
							setIsConfirm(true);
							setConfirmState('삭제');
						}}
						style={{ marginLeft: '0.75rem' }}
					>
						삭제
						<div
							style={{
								width: '0.5rem',
								height: '0.5rem',
								background: 'purple',
								marginLeft: '0.37rem',
								borderRadius: '5rem',
							}}
						></div>
					</S.ClassSmallBlackButton>
				</S.ClassMiddleTag>
				<S.ClassMiddleTag>
					<S.ClassInput
						type="text"
						onChange={onChangeSearch}
						placeholder="       원번 혹은 이름을 입력하세요."
					></S.ClassInput>

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
							setAddClassType('once');
							setIsMakeUp(false);
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 20 20"
							fill="none"
							style={{ marginRight: '0.25rem' }}
						>
							<path
								d="M5 10H10M10 10H15M10 10V5M10 10V15"
								stroke="#81858C"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						수업 추가
					</S.ClassButton>
					<S.SwitchDiv>
						<S.SwitchFont>알람</S.SwitchFont>
						<Switch
							defaultChecked={false}
							onChange={(checked) => {
								setIsSound(checked);
							}}
							style={{ marginLeft: '1rem' }}
						></Switch>
					</S.SwitchDiv>
				</S.ClassMiddleTag>
			</S.ClassMiddleBox>
			<table>
				<thead>
					<tr>
						<th>
							<input
								type="checkbox"
								style={{ width: '20px', height: '20px' }}
								checked={
									checkList.length !== 0 &&
									studentArray.length === checkList.length
								}
								onChange={onChangeAllSelect}
							></input>
						</th>
						<th>원생 번호</th>
						<th>원생명</th>
						<th>시작 시간</th>
						<th>종료 시간</th>
						<th>출결 상태</th>
						<th>등원 시간</th>
						<th>하원 시간</th>
						<th>강의 정보</th>
						<th>수업 준비</th>
						<th>예약 도서</th>
						<th>원생 정보</th>
					</tr>
				</thead>
				<tbody>
					{studentArray?.map((el) => {
						return (
							<tr key={el.id || uuidv4()}>
								<td>
									<input
										type="checkbox"
										onChange={(e) =>
											onChangeEach(e, el.lecture.id, el.student.id)
										}
										checked={checkList.some((ele) => {
											return (
												Number(ele.studentId) === Number(el.student.id) &&
												Number(ele.lectureId) === Number(el.lecture.id)
											);
										})}
									></input>
								</td>
								<td>{el.student.origin}</td>
								<td>{el.student.korName + '(' + el.student.engName + ')'}</td>
								<td
									style={
										date.getDate() !== calendarDate.getDate() ||
										checkDate.getHours() * 60 +
											checkDate.getMinutes() -
											Number(el.lecture.startTime.slice(0, 2)) * 60 -
											Number(el.lecture.startTime.slice(3, 5)) <
											0 ||
										el?.attendanceStatus !== null
											? {}
											: { color: 'tomato' }
									}
								>
									{timeToHour(el.lecture.startTime)}
								</td>
								<td
									style={
										checkDate.getHours() * 60 +
											checkDate.getMinutes() -
											Number(el.lecture.endTime.slice(0, 2)) * 60 -
											Number(el.lecture.endTime.slice(3, 5)) <
											0 ||
										el?.attendanceStatus?.exitTime !== null ||
										['결석 (보강)', '결석'].includes(
											el?.attendanceStatus?.statusDisplay
										)
											? {}
											: { color: 'tomato' }
									}
								>
									{timeToHour(el.lecture.endTime)}
								</td>
								<td>{el?.attendanceStatus?.statusDisplay ?? ''}</td>
								<td>
									{el?.attendanceStatus?.entryTime
										? timeToHour(
												dateToClock(
													dateToKoreanTime(el?.attendanceStatus?.entryTime)
												)
										  )
										: ''}
								</td>
								<td>
									{el?.attendanceStatus?.exitTime
										? timeToHour(
												dateToClock(
													dateToKoreanTime(el?.attendanceStatus?.exitTime)
												)
										  )
										: ''}
								</td>
								<td>
									{el.lecture.lectureInfo.length > 25 ? (
										<S.lectureInfo
											onClick={() => {
												setIsInfo(true);
												setInfo(el.lecture.lectureInfo);
											}}
										>
											{longWord(el.lecture.lectureInfo)}
										</S.lectureInfo>
									) : (
										el.lecture.lectureInfo
									)}
								</td>
								<td>
									<BookOutlined
										onClick={onClickBooks(el.student, el.lecture)}
									></BookOutlined>
								</td>
								<td>{el.student.reservedBooksCount + '권'}</td>
								<td>
									<SearchOutlined
										onClick={() => {
											window.open(
												'/' + router.query.branch + '/academy/' + el.student.id
											);
										}}
									/>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>

			<S.PageContainer>
				{Array.from({ length: totalPages }, (_, i) => (
					<S.PageBox
						key={i}
						style={
							i + 1 === page
								? { backgroundColor: 'purple', color: '#eeeeee' }
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
					width={'55vw'}
					height={'50vh'}
					onCancel={() => {
						setClassToggle(false);
						setAddList([]);
						setSelectDates([]);
						setStudentPage(0);
					}}
					footer={null}
				>
					<S.ClassTitle>{isMakeUp ? '수업 보강' : '수업 추가'}</S.ClassTitle>
					<S.ModalClassAddWrapper>
						<S.ModalWrapper style={{ width: '48%', display: 'block' }}>
							<div
								style={{
									fontSize: '0.875rem',
									color: '#000',
									marginBottom: '0.75rem',
								}}
							>
								지점
							</div>
							<select
								onChange={(event) => {
									setTeacherId(event.target.value);
								}}
								style={{
									borderRadius: '0.5rem',
									border: '1px solid #DBDDE1',
									width: '100%',
									padding: '0.81rem 1.5rem',
								}}
								value={teacherId}
							>
								{userData?.allUsers
									.filter((el) => el.userCategory === '선생님')
									.map((el) => {
										return (
											<option key={uuidv4()} value={el.profile.id}>
												{el.profile.korName}
											</option>
										);
									})}
							</select>
							<div
								style={{
									fontSize: '0.875rem',
									color: '#000',
									marginBottom: '0.75rem',
									marginTop: '1.25rem',
								}}
							>
								수업 방식
							</div>
							{isMakeUp ? (
								<></>
							) : (
								<S.ModalRadioBox>
									<input
										type="radio"
										name="type"
										defaultChecked={true}
										value={'once'}
										onClick={() => setAddClassType('once')}
										style={{ width: '1.25rem', height: '1.25rem' }}
									></input>
									<div style={{ fontSize: '0.875rem', paddingLeft: '0.5rem' }}>
										단일
									</div>
									<input
										type="radio"
										name="type"
										value={'routine'}
										style={{
											width: '1.25rem',
											height: '1.25rem',
											marginLeft: '1.5rem',
										}}
										onClick={() => setAddClassType('routine')}
									></input>
									<div style={{ fontSize: '0.875rem', paddingLeft: '0.5rem' }}>
										반복
									</div>
								</S.ModalRadioBox>
							)}
							{addClassType === 'once' ? (
								<></>
							) : (
								<S.ModalRoutineInput>
									<div
										style={{
											marginTop: '1.87rem',
											width: '100%',
											border: '1px solid #DBDDE1',
											borderRadius: '0.5rem',
										}}
									>
										<input
											type="number"
											onChange={onChangeRoutineCount}
											style={{
												paddingLeft: '5%',
												paddingTop: '0.81rem',
												paddingBottom: '0.81rem',
												border: '0',
												width: '85%',
											}}
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
															? {
																	backgroundColor: '#333',
																	color: '#eeeeee',
															  }
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
							<div>
								<div style={{ marginTop: '1.87rem' }}>수업 날짜</div>
							</div>
							<S.InputInput
								type="date"
								defaultValue={dateToInput(date)}
								style={{ width: '88%', height: '2.75rem', padding: '0 1.5rem' }}
								onChange={(event) => {
									setAddClassDate(event.target.value);
								}}
							></S.InputInput>
							<div>
								<div style={{ marginTop: '1.25rem', marginBottom: '0.75rem' }}>
									수업 시간
								</div>
							</div>
							<S.TimeBox style={{ width: '100%' }}>
								<input
									type="time"
									style={{
										width: '40%',
										fontSize: '17px',
										border: '1px solid #dddddd',
										paddingLeft: '12px',
										borderRadius: '5px',
										height: '2.75rem',
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
										width: '40%',
										fontSize: '17px',
										border: '1px solid #dddddd',
										paddingLeft: '12px',
										borderRadius: '5px',
										height: '2.75rem',
									}}
									defaultValue={dateToClockOneHour(date)}
									onChange={(event) => {
										setAddClassEnd(event.target.value);
									}}
								></input>
							</S.TimeBox>
							<S.ModalInputBox style={{ display: 'block' }}>
								<div>
									<div
										style={{ marginTop: '1.25rem', marginBottom: '0.75rem' }}
									>
										메모
									</div>
								</div>
								<S.ModalTextArea
									onChange={(event) => {
										setAddClassInfo(event.target.value);
									}}
									style={{
										width: '100%',
										borderRadius: '0.5rem',
										border: '1px solid #DBDDE1',
									}}
								></S.ModalTextArea>
							</S.ModalInputBox>
						</S.ModalWrapper>

						{isMakeUp ? (
							<></>
						) : (
							<div style={{ width: '50%' }}>
								<div>
									<div
										style={{
											marginRight: '5px',
											fontSize: '0.875rem',
											fontStyle: 'normal',
											fontWeight: '500',
											marginBottom: '0.75rem',
										}}
									>
										원생 목록
									</div>
									<S.InputInput
										onChange={(e) => {
											setSearchStudents(e.target.value);
										}}
										style={{
											borderRadius: '0.5rem',
											border: '1px solid #DBDDE1',
											padding: '0.81rem 1.25rem',
											width: '80%',
										}}
										placeholder="원번 혹은 이름을 입력하세요."
									></S.InputInput>
								</div>{' '}
								<S.ModalTable style={{ height: '40rem', overflow: 'scroll' }}>
									<S.ModalTag style={{ position: 'sticky' }}>
										<S.ModalHeadLeft
											style={{
												width: '30%',
												color: '#000',
												background: '#F7F8FA',
												height: '2.75rem',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											원번
										</S.ModalHeadLeft>
										<S.ModalHeadMiddle
											style={{
												width: '30%',
												color: '#000',
												background: '#F7F8FA',
												height: '2.75rem',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											이름
										</S.ModalHeadMiddle>
										<S.ModalHeadRight
											style={{
												width: '25%',
												color: '#000',
												background: '#F7F8FA',
												height: '2.75rem',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											추가
										</S.ModalHeadRight>
									</S.ModalTag>
									{allStudent?.map((el) => {
										return (
											<S.ModalTag key={uuidv4()} style={{ margin: 0 }}>
												<S.ModalHeadLeft
													style={{
														width: '30%',
														height: '2.75rem',
														display: 'flex',
														alignItems: 'center',
													}}
												>
													{el?.origin}
												</S.ModalHeadLeft>
												<S.ModalHeadMiddle
													style={{
														width: '30%',
														height: '2.75rem',
														display: 'flex',
														alignItems: 'center',
													}}
												>
													{el?.korName}
												</S.ModalHeadMiddle>
												<S.ModalHeadRight
													style={{
														width: '25%',
														height: '2.75rem',
														display: 'flex',
														alignItems: 'center',
													}}
												>
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
								<S.PageContainer
									style={{ marginBottom: '20px', justifyContent: 'center' }}
								>
									{Array.from({ length: studentMaxPage }, (_, i) => (
										<S.PageBox
											key={i}
											style={
												i === studentPage
													? { backgroundColor: '#333', color: '#eeeeee' }
													: {}
											}
											onClick={onClickStudentPage(i)}
										>
											{i + 1}
										</S.PageBox>
									))}
								</S.PageContainer>
							</div>
						)}
					</S.ModalClassAddWrapper>
					<S.ModalButtonBox style={{ width: '100%', justifyContent: 'center' }}>
						<S.ModalCancelButton
							onClick={onClickCancel}
							style={{ background: '#EBECEF', color: '#000' }}
						>
							취소
						</S.ModalCancelButton>
						<S.ModalOkButton
							onClick={isMakeUp ? onClickMakeUpClass : onClickOk}
						>
							저장
						</S.ModalOkButton>
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
					width={'50vw'}
					onCancel={() => {
						setStudentToggle(false);
						setAddList([]);
						setAddLectureId('');
						setSearchLecture(dateToInput(date));
						setSearchStudents('');
						setStudentPage(0);
					}}
				>
					<S.ModalTitle style={{ marginBottom: '2rem' }}>
						수업 관리
					</S.ModalTitle>
					<div style={{ marginBottom: '10px' }}>
						<S.InputInput
							type="date"
							defaultValue={dateToInput(date)}
							onChange={(e) => {
								setSearchLecture(e.target.value);
							}}
							style={{ padding: '0.81rem 1.5rem' }}
						></S.InputInput>
					</div>
					<S.ModalTable style={{ width: '100%', marginTop: '0' }}>
						{searchLecture !== '' ? (
							<S.ModalTag
								style={{
									width: '100%',
									color: '#000',
									borderRadius: '0.25rem 0.25rem 0rem 0rem',
									background: '#F7F8FA',
								}}
							>
								<S.ModalHeadLeft
									style={{
										width: '10%',
										height: '2.75rem',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									강의번호
								</S.ModalHeadLeft>
								<S.ModalHeadMiddle
									style={{
										width: '20%',
										height: '2.75rem',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									날짜
								</S.ModalHeadMiddle>
								<S.ModalHeadMiddle
									style={{
										width: '20%',
										height: '2.75rem',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									강의시간
								</S.ModalHeadMiddle>
								<S.ModalHeadMiddle
									style={{
										width: '40%',
										height: '2.75rem',
										display: 'flex',
										alignItems: 'center',
									}}
								>
									강의 설명
								</S.ModalHeadMiddle>
								<S.ModalHeadRight
									style={{
										width: '10%',
										height: '2.75rem',
										display: 'flex',
										alignItems: 'center',
									}}
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
									<S.ModalTag key={uuidv4()} style={{ margin: '0' }}>
										<S.ModalHeadLeft
											style={{
												width: '10%',
												height: '2.75rem',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											{el.id}
										</S.ModalHeadLeft>
										<S.ModalHeadMiddle
											style={{
												width: '20%',
												height: '2.75rem',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											{el.date}
										</S.ModalHeadMiddle>

										<S.ModalHeadMiddle
											style={{
												width: '20%',
												height: '2.75rem',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											{el.startTime.slice(0, 5) + '~' + el.endTime.slice(0, 5)}
										</S.ModalHeadMiddle>
										<S.ModalHeadMiddle
											style={{
												width: '40%',
												height: '2.75rem',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											{longWord(el.lectureInfo)}
										</S.ModalHeadMiddle>
										<S.ModalHeadRight
											style={{
												width: '10%',
												height: '2.75rem',
												display: 'flex',
												alignItems: 'center',
											}}
										>
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
					<div style={{ marginBottom: '10px', marginTop: '20px' }}>
						<S.InputInput
							onChange={(e) => {
								setSearchStudents(e.target.value);
							}}
							style={{
								borderRadius: '0.5rem',
								border: '1px solid #DBDDE1',
								padding: '0.81rem 1.25rem',
							}}
							placeholder="원번 혹은 이름을 입력하세요."
						></S.InputInput>
					</div>
					<S.ModalTable>
						<S.ModalTag
							style={{
								margin: '0',
								color: '#000',
								borderRadius: '0.25rem 0.25rem 0rem 0rem',
								background: '#F7F8FA',
							}}
						>
							<S.ModalHeadLeft
								style={{
									width: '35%',
									height: '2.75rem',
									display: 'flex',
									alignItems: 'center',
								}}
							>
								원번
							</S.ModalHeadLeft>
							<S.ModalHeadMiddle
								style={{
									width: '35%',
									height: '2.75rem',
									display: 'flex',
									alignItems: 'center',
								}}
							>
								이름
							</S.ModalHeadMiddle>
							<S.ModalHeadRight
								style={{
									width: '30%',
									height: '2.75rem',
									display: 'flex',
									alignItems: 'center',
								}}
							>
								추가
							</S.ModalHeadRight>
						</S.ModalTag>
						{allStudent
							?.filter((el) => {
								return (
									el.origin
										.toUpperCase()
										.includes(searchStudents.toUpperCase()) ||
									el.korName.includes(searchStudents)
								);
							})
							?.map((el) => {
								return (
									<S.ModalTag key={uuidv4()} style={{ margin: '0' }}>
										<S.ModalHeadLeft
											style={{
												width: '35%',
												height: '2.75rem',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											{el?.origin}
										</S.ModalHeadLeft>
										<S.ModalHeadMiddle
											style={{
												width: '35%',
												height: '2.75rem',
												display: 'flex',
												alignItems: 'center',
											}}
										>
											{el?.korName}
										</S.ModalHeadMiddle>
										<S.ModalHeadRight
											style={{
												width: '30%',
												height: '2.75rem',
												display: 'flex',
												alignItems: 'center',
											}}
										>
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
					<S.PageContainer
						style={{ marginBottom: '20px', justifyContent: 'center' }}
					>
						{Array.from({ length: studentMaxPage }, (_, i) => (
							<S.PageBox
								key={i}
								style={
									i === studentPage
										? { backgroundColor: '#333', color: '#eeeeee' }
										: {}
								}
								onClick={onClickStudentPage(i)}
							>
								{i + 1}
							</S.PageBox>
						))}
					</S.PageContainer>
					<div
						style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
					>
						<S.ModalCancelButton
							onClick={() => {
								setStudentToggle(false);
								setAddList([]);
								setAddLectureId('');
								setSearchLecture(dateToInput(date));
								setSearchStudents('');
								setStudentPage(0);
							}}
							style={{ background: '#EBECEF', color: '#000' }}
						>
							취소
						</S.ModalCancelButton>
						<S.ModalOkButton onClick={onClickAddStudents}>추가</S.ModalOkButton>
					</div>
				</Modal>
			) : (
				<></>
			)}
			{isAlarm && lateList?.length > 0 && (
				<Modal
					open={isAlarm}
					footer={null}
					closeIcon={null}
					width={'40%'}
					onCancel={() => {
						setIsAlarm(false);
					}}
				>
					<S.AlarmDiv style={{ fontSize: '25px' }}>
						{alarmType === 'start' ? '등원' : '하원'} 확인 명단
					</S.AlarmDiv>
					<S.AlarmDiv style={{ fontSize: '25px' }}>
						{'예정 시간 : ' + alarmTime}
					</S.AlarmDiv>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'flex-start',
							alignItems: 'flex-start',
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
												studentData?.studentsInAcademy?.find(
													(el) => Number(el.id) === Number(student.id)
												)?.origin
											}
										</td>
										<td key={index}>
											{
												studentData?.studentsInAcademy?.find(
													(el) => Number(el.id) === Number(student.id)
												)?.korName
											}
										</td>
										<td key={index}>
											{
												studentData?.studentsInAcademy?.find(
													(el) => Number(el.id) === Number(student.id)
												)?.pmobileno
											}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<S.AlarmButton
						style={{ marginTop: '30px' }}
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
					width={'80%'}
					onCancel={() => {
						setIsBook(false);
						refetchBook({ minBl: 0, maxBl: 0 });
						setSelectBookData([]);
						setSelectBooks([]);
					}}
				>
					<S.ModalTitle>
						{'수업준비 - ' + selectChild.korName + ' 도서 예약'}
					</S.ModalTitle>
					<S.ModalButtonBox>
						<S.ModalReturnButton onClick={onClickTotalReturn}>
							일괄 반납
						</S.ModalReturnButton>
						<S.ModalCancelButton
							onClick={() => {
								setIsBook(false);
								refetchBook({ minBl: 0, maxBl: 0 });
								setBookSearchWord('');
							}}
						>
							취소
						</S.ModalCancelButton>
					</S.ModalButtonBox>

					<table>
						{reservationBookData?.studentReservedBooks.length === 0 ? (
							<></>
						) : (
							<thead style={{ height: '2.75rem' }}>
								<tr>
									<th>도서 제목</th>
									<th>저자</th>
									<th>AR QUIZ No.</th>
									<th>AR점수</th>
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
									<tr style={{ height: '2.75rem' }}>
										<></>
										<td>{longWord(el.booktitle)}</td>
										<td>{el.book.authorAr}</td>
										<td>{el.book.arQuiz}</td>
										<td>{el.book.bl}</td>
										<td>
											{el.book.lexileLex ? el.book.lexileAr : el.book.lexileLex}
										</td>
										<td>{el.book.wcAr}</td>
										<td>{el.place === null ? 'null' : el.place}</td>
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
							<S.ModalTag style={{ marginTop: '20px' }}>
								{'예약 예정 도서 리스트'}
							</S.ModalTag>
							<S.ModalTag>
								<S.ModalHeadLeft
									style={{
										width: '40%',
										background: '#42444e',
										color: '#fff',
										textAlign: 'left',
										fontSize: 'medium',
									}}
								>
									도서 제목
								</S.ModalHeadLeft>
								<S.ModalHeadMiddle
									style={{
										width: '30%',
										background: '#42444e',
										color: '#fff',
										textAlign: 'left',
										fontSize: 'medium',
									}}
								>
									AR
								</S.ModalHeadMiddle>

								<S.ModalHeadRight
									style={{
										width: '25%',
										background: '#42444e',
										color: '#fff',
										textAlign: 'left',
										fontSize: 'small',
									}}
								>
									AR QUIZ No.
								</S.ModalHeadRight>
								<S.ModalHeadRight
									style={{
										width: '25%',
										background: '#42444e',
										color: '#fff',
										textAlign: 'left',
										fontSize: 'small',
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
								<S.ModalHeadLeft style={{ width: '40%' }}>
									{el.titleAr}
								</S.ModalHeadLeft>
								<S.ModalHeadMiddle style={{ width: '30%' }}>
									{el.bl}
								</S.ModalHeadMiddle>
								<S.ModalHeadRight style={{ width: '25%' }}>
									{el.arQuiz}
								</S.ModalHeadRight>
								<S.ModalHeadRight style={{ width: '25%' }}>
									<S.ModalIcon
										onClick={onClickBookDelete(Number(el.books[0].id))}
									>
										삭제
									</S.ModalIcon>
								</S.ModalHeadRight>
							</S.ModalTag>
						);
					})}
					<S.ModalTag>도서 검색</S.ModalTag>
					<S.ModalWrapper
						style={{
							borderRadius: '0.25rem 0.25rem 0rem 0rem',
							background: '#F7F8FA',
							padding: '1.5rem',
							borderRadius: '9px',
							marginTop: '1.25rem',
						}}
					>
						<S.ModalButtonBox
							style={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'flex-start',
								alignItems: 'flex-start',
							}}
						>
							<div
								style={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
								}}
							>
								<div
									style={{
										display: 'flex',
										color: '#000',
										fontSize: '15px',
										fontWeight: 'bold',
										flexDirection: 'column',
										marginRight: '1.87rem',
									}}
								>
									<div>AR 점수</div>
									<div>
										최소
										<S.InputInput
											type="number"
											style={{ marginLeft: '10px', marginTop: '10px' }}
											onChange={(e) => {
												setMinScore(e.target.value);
											}}
											onKeyPress={(e) => {
												if (e.key === 'Enter') {
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
											style={{ marginLeft: '10px', marginTop: '10px' }}
											onChange={(e) => {
												setMaxScore(e.target.value);
											}}
											onKeyPress={(e) => {
												if (e.key === 'Enter') {
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
										display: 'flex',
										color: '#000',
										fontSize: '15px',
										fontWeight: 'bold',
										flexDirection: 'column',
										marginRight: '1.87rem',
									}}
								>
									<div>Word Count</div>
									<div>
										최소
										<S.InputInput
											type="number"
											style={{ marginLeft: '10px', marginTop: '10px' }}
											onChange={(e) => {
												setMinWc(Number(e.target.value));
											}}
										></S.InputInput>
									</div>
									<div>
										최대
										<S.InputInput
											type="number"
											style={{ marginLeft: '10px', marginTop: '10px' }}
											onChange={(e) => {
												setMaxWc(
													Number(
														e.target.value === '' ? 100000000 : e.target.value
													)
												);
											}}
										></S.InputInput>
									</div>
								</div>
								<div
									style={{
										display: 'flex',
										color: '#000',
										fontSize: '15px',
										fontWeight: 'bold',
										flexDirection: 'column',
										float: 'left',
										height: '100px',
										marginRight: '1.87rem',
									}}
								>
									<div>PLBN</div>
									<div>
										검색
										<S.InputInput
											type="text"
											style={{ marginLeft: '10px', marginTop: '10px' }}
											onChange={(e) => {
												setInputPlbn(e.target.value);
											}}
										></S.InputInput>
									</div>
								</div>
								<S.ModalAddButton
									onClick={onClickSearchBooks}
									style={{
										borderRadius: '0.5rem',
										background: '#333',
										height: '2.75rem',
									}}
								>
									검색
								</S.ModalAddButton>
							</div>
						</S.ModalButtonBox>
					</S.ModalWrapper>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
						}}
					>
						<div
							style={{
								display: 'inline-block',
								textAlign: 'right',
								fontWeight: 'bold',
								width: '100%',
							}}
						>
							검색
							<S.InputInput
								style={{
									marginLeft: '10px',
									marginTop: '10px',
									marginBottom: '10px',
								}}
								onChange={(e) => {
									setBookSearchWord(e.target.value);
								}}
							></S.InputInput>
						</div>
					</div>

					<table>
						{bookData?.getBooksByBl.length === 0 || bookData === undefined ? (
							<></>
						) : (
							<thead style={{ height: '2.75rem' }}>
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
										<tr style={{ height: '2.75rem' }}>
											<></>
											<td>{longWord(el.titleAr)}</td>
											<td>{el.authorAr}</td>
											<td>{el.arQuiz}</td>
											<td>{el.bl}</td>
											<td>
												{el.lexileLex === null ? el.lexileAr : el.lexileLex}
											</td>
											<td>{el.wcAr}</td>
											<td>
												{el.books[0].place === null
													? 'null'
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
							display: 'flex',
							justifyContent: 'center',
							marginTop: '20px',
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
									{'<<'}
								</button>
								<button
									onClick={() => {
										if (bookPage > 1) {
											setBookPage(bookPage - 1);
										}
									}}
								>
									{'<'}
								</button>
							</>
						)}
						{Array.from({ length: bookMaxPage }).map((_, index) => {
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
													width: '17px',
													color: 'black',
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
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
															width: '27px',
															color: 'white',
															backgroundColor: 'purple',
															border: '1px solid black',
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
													  }
													: {
															width: '27px',
															color: 'black',
															border: '1px solid black',
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
													  }
											}
										>
											{index + 1}
										</span>
										{bookPage < bookMaxPage - 3 && bookPage === index - 1 ? (
											<span
												style={{
													width: '17px',
													color: 'black',
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
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
									{'>'}
								</button>
								<button
									onClick={() => {
										if (bookPage + 10 < bookMaxPage) {
											setBookPage(bookPage + 10);
										}
									}}
								>
									{'>>'}
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
						setIsConfirm(false);
					}}
					footer={null}
					closable={false}
				>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							padding: '3rem 3rem',
						}}
					>
						<div
							style={{
								color: '#000',
								fontSize: '2.125rem',
								fontStyle: 'normal',
								fontWeight: 500,
								lineHeight: '2.5rem',
								marginBottom: '1.5rem',
							}}
						>
							{confirmState + ' 처리 하시겠습니까?'}
						</div>
						<div style={{ marginBottom: '3.5rem' }}>
							{confirmState === '결석'
								? '원생의 출결 상태를 결석으로 변경합니다.'
								: '원생을 해당 일자/수업에서 삭제합니다.'}
						</div>
						<div>
							<S.DeleteButton
								onClick={() => {
									setIsConfirm(false);
								}}
								style={{
									backgroundColor: 'background: #EBECEF;',
									color: '#1e1e1e',
									height: '2.75rem',
								}}
							>
								취소
							</S.DeleteButton>
							<S.DeleteButton
								onClick={
									confirmState === '삭제'
										? () => {
												onClickDelete()();
												setIsConfirm(false);
										  }
										: () => {
												onClickAttendance('absent')();
												setIsConfirm(false);
										  }
								}
								style={{
									backgroundColor: '#333',
									color: '#FFF',
									height: '2.75rem',
								}}
							>
								확인
							</S.DeleteButton>
						</div>
					</div>
				</Modal>
			) : (
				<></>
			)}
			<Modal
				open={isInfo}
				onCancel={() => {
					setIsInfo(false);
				}}
				closable={false}
				footer={null}
			>
				<S.lectureModalInfo>{'수업 정보: ' + info}</S.lectureModalInfo>
			</Modal>
		</S.ClassWrapper>
	);
}
