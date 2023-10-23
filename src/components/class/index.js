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
  kplbnFrame,
  arFrame,
  lexileFrame,
  addComma,
  customAlarm,
  getMonthInfo,
  getMonthZero,
  getNumberZero,
  longAuthor,
  shortWord,
  longTitle,
  getDateZero,
  lastDate,
} from "../../commons/library/library";
import { Modal, Spin, Switch } from "antd";
import {
  CloseOutlined,
  DownOutlined,
  SearchOutlined,
  SettingOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_CLASS,
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
  GET_ACADEMY_SETTING,
  EDIT_ACADEMY_SETTING,
  GET_CUSTOM_ATTENDANCE,
  GET_MEMO,
  CREATE_MEMO,
  GET_ME,
  UPDATE_LECTURE,
  GET_MONTH_CLASS,
  GET_FICTION_RECOMMEND,
  GET_NONFICTION_RECOMMEND,
  CHANGE_RECOMMEND_BY_PERIOD,
  CHANGE_RECOMMEND_BY_RECORD,
  GET_READING_RECORD,
  GET_PACKAGE_DATE,
  EDIT_LECTURE_INFO,
  RESERVATION_BARCODE,
  BARCODE_CHECK,
  DELETE_LECTURE,
  DELETE_LECTURE_INFO,
  GET_LECTURE_INFO,
} from "./class.query";
import { TableClassListBody } from "@/src/commons/library/table";
import { el } from "date-fns/locale";

const week = ["월", "화", "수", "목", "금", "토", "일"];
const itemsPerPage = 20; // 페이지당 항목 수

const dummyData = [
  {
    repeatWeeks: [0, 2, 4],
    date: "2023-10-01",
    startTime: "15:20",
    endTime: "16:40",
  },
  {
    repeatWeeks: [-1],
    date: "2023-10-17",
    startTime: "13:20",
    endTime: "14:40",
  },
  {
    repeatWeeks: [-1],
    date: "2023-10-21",
    startTime: "14:20",
    endTime: "15:40",
  },
];

export default function ClassPage() {
  const router = useRouter();
  const [date, setTodayDate] = useState(new Date());
  const [bookArray, setBookArray] = useState([]);
  const [bookPage, setBookPage] = useState(1);
  const [bookMaxPage, setBookMaxPage] = useState(1);
  const [bookPageList, setBookPageList] = useState(0);
  const [bookSearchWord, setBookSearchWord] = useState("");
  const [isLate, setIsLate] = useState(false);
  const [isAttendance, setIsAttendance] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editAcademy, setEditAcademy] = useState(Number(router.query.branch));
  const [editDate, setEditDate] = useState(dateToInput(date));
  const [editEndTime, setEditEndTime] = useState(dateToClockOneHour(date));
  const [editStartTime, setEditStartTime] = useState(dateToClock(date));
  const [editInfo, setEditInfo] = useState("");
  const [addRepeatCount, setAddRepeatCount] = useState(1);
  const [addRepeatInput, setAddRepeatInput] = useState([
    {
      week: [],
      startTime: dateToClock(date),
      endTime: dateToClockOneHour(date),
      isAuto: false,
      isRepeat: "once",
      repeatsNum: 0,
      startDate: dateToInput(date),
      teacherId: "",
      about: "",
    },
  ]);
  const [lateTime, setLateTime] = useState(dateToClock(date));
  const [startList, setStartList] = useState([]);
  const [endList, setEndList] = useState([]);
  const [lateList, setLateList] = useState([]);
  const [alarmTime, setAlarmTime] = useState("");
  const [alarmType, setAlarmType] = useState("start");
  const [checkDate, setCheckDate] = useState(new Date());
  const [isInfo, setIsInfo] = useState(false);
  const [info, setInfo] = useState("");
  const [isSound, setIsSound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  const [intervalTime, setIntervalTime] = useState(0);
  const [isNotificationCustom, setIsNotificationCustom] = useState(false);
  const [isAuto, setIsAuto] = useState(false);
  const [isMemo, setIsMemo] = useState(false);
  const [memoStudent, setMemoStudent] = useState("");
  const [memoLecture, setMemoLecture] = useState("");
  const [memoContents, setMemoContents] = useState();
  const [memoText, setMemoText] = useState("");
  const [reserveType, setReserveType] = useState("recommend");
  const [barcode, setBarcode] = useState("");
  const [confirmReserve, setConfirmReserve] = useState(false);
  const [viewType, setViewType] = useState("student");
  const [isViewMore, setIsViewMore] = useState(false);
  const [viewMorePosition, setViewMorePosition] = useState([0, 0]);
  const [viewModalList, setViewModalList] = useState([]);
  const [viewTitle, setViewTitle] = useState("");
  const [isViewTitle, setIsViewTitle] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [fNf, setFNf] = useState("0");
  const [isPeriod, setIsPeriod] = useState(true);
  const [isChange, setIsChange] = useState(false);
  const [searchReading, setSearchReading] = useState("");
  const [readingList, setReadingList] = useState([]);
  const [isAlert, setIsAlert] = useState(false);
  const [isDup, setIsDup] = useState(false);

  // 수업 수정 추가 지점
  const [isAll, setIsAll] = useState(false);
  const [isEditAuto, setIsEditAuto] = useState(false);
  const [isEditRepeat, setIsEditRepeat] = useState(false);
  const [editRepeatWeek, setEditRepeatWeek] = useState([]);
  const [editRepeatCount, setEditRepeatCount] = useState(0);

  // 수업 보강 추가 지점
  const [isMakeUp, setIsMakeUp] = useState(false);
  const [makeUpDate, setMakeUpDate] = useState("");
  const [makeUpStart, setMakeUpStart] = useState();
  const [makeUpEnd, setMakeUpEnd] = useState();
  const [makeUpId, setMakeUpId] = useState();
  const [makeUpInfo, setMakeUpInfo] = useState("");
  const [makeUpTeacherId, setMakeUpTeacherId] = useState("");
  const [makeUpLectureId, setMakeUpLectureId] = useState("");

  const onClickOpenMakeUp = (sId, lId) => () => {
    setIsMakeUp(true);
    setTodayDate(new Date());
    setMakeUpId(sId);
    setMakeUpInfo("");
    setMakeUpTeacherId(
      userData?.allUsers
        .filter((el) => el.userCategory === "선생님")
        .filter((el) => {
          return Number(el.profile.academy.id) === Number(router.query.branch);
        })[0].id
    );
    console.log(
      userData?.allUsers
        .filter((el) => el.userCategory === "선생님")
        .filter((el) => {
          return Number(el.profile.academy.id) === Number(router.query.branch);
        })[0].id
    );
    setMakeUpLectureId(lId);
  };

  // 삭제 스테이트
  const [deleteDate, setDeleteDate] = useState(dateToInput(date));

  const { data: myData } = useQuery(GET_ME);
  const { data: fictionData, refetch: refetchFiction } = useQuery(
    GET_FICTION_RECOMMEND,
    {
      variables: {
        studentId: 22,
        academyId: Number(router.query.branch),
        fNf: "1",
        isSelected: true,
      },
    }
  );
  const { data: nonFictionData, refetch: refetchNonFiction } = useQuery(
    GET_FICTION_RECOMMEND,
    {
      variables: {
        studentId: 22,
        academyId: Number(router.query.branch),
        fNf: "2",
        isSelected: true,
      },
    }
  );

  const { data: lectureInfoData, refetch: refetchLectureInfo } = useQuery(
    GET_LECTURE_INFO,
    { variables: { academyIds: [Number(router.query.branch)], studentId: 10 } }
  );

  const { data: packageData, refetch: refetchPackage } = useQuery(
    GET_PACKAGE_DATE,
    { variables: { studentId: 0, fNf: "1" } }
  );

  const { data: recordingData, refetch: refetchRecord } = useQuery(
    GET_READING_RECORD,
    { variables: { studentId: 0 } }
  );

  const [changeRecommendPeriod] = useMutation(CHANGE_RECOMMEND_BY_PERIOD);
  const [changeRecommendRecord] = useMutation(CHANGE_RECOMMEND_BY_RECORD);
  const [deleteLecture] = useMutation(DELETE_LECTURE);
  const [deleteLectureInfo] = useMutation(DELETE_LECTURE_INFO);

  const { data: bookData, refetch: refetchBook } = useQuery(GET_BOOKS, {
    variables: {
      minBl: 0,
      maxBl: 0,
      academyIds: [Number(router.query.branch)],
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
  const { data: allLectureData, refetch: refetchList } = useQuery(
    GET_ALL_LECTURES,
    {
      variables: { academyId: Number(router.query.branch) },
    }
  );
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
  const { data: settingData, refetch: refetchSetting } = useQuery(
    GET_ACADEMY_SETTING,
    { variables: { academyId: Number(router.query.branch) } }
  );

  const { data: memoData, refetch: refetchMemo } = useQuery(GET_MEMO, {
    variables: {
      academyId: Number(router.query.branch),
      studentId: Number(10),
    },
  });

  const { data: monthClassData, refetch: refetchMonth } = useQuery(
    GET_MONTH_CLASS,
    {
      variables: {
        academyId: Number(router.query.branch),
        month: Number(date.getMonth() + 1),
      },
    }
  );
  const { data: readingCheckData, refetch: refetchCheck } = useQuery(
    BARCODE_CHECK,
    { variables: { studentId: 10, plbn: "" } }
  );

  const [createLecture] = useMutation(CREATE_CLASS);
  const [addStudents] = useMutation(ADD_STUDENTS);
  const [reservationBooks] = useMutation(RESERVATION_BOOKS);
  const [deleteTotal] = useMutation(DELETE_TOTAL_BOOKS);
  const [deleteBook] = useMutation(DELETE_BOOK);
  const [createMakeup] = useMutation(CREATE_MAKE_UP);
  const [updateSetting] = useMutation(EDIT_ACADEMY_SETTING);
  const [createAttendanceMutation] = useMutation(CREATE_ATTENDANCE);
  const [deleteStudentFromLecture] = useMutation(DELETE_STUDENT_FROM_LECTURE);
  const [editMemo] = useMutation(CREATE_MEMO);
  const [updateLecture] = useMutation(UPDATE_LECTURE);
  const [editLectureInfo] = useMutation(EDIT_LECTURE_INFO);
  const [reservationBarcode] = useMutation(RESERVATION_BARCODE);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarArray, setCalendarArray] = useState([]);
  const [isCalendar, setIsCalendar] = useState(false);
  const [lookCalendar, setLookCalendar] = useState(false);
  const [page, setPage] = useState(1);
  const [studentArray, setStudentArray] = useState([]);
  // const [array, setArray] = useState([]); // initial value changed from undefined to []
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
  const [addListName, setAddListName] = useState("");
  const [searchLecture, setSearchLecture] = useState(dateToInput(date));
  const [searchStudents, setSearchStudents] = useState("");
  const [isBook, setIsBook] = useState(false);
  const [maxScore, setMaxScore] = useState("");
  const [minScore, setMinScore] = useState(0);
  // const [bookList, setBookList] = useState([]);
  const [selectBooks, setSelectBooks] = useState([]);
  const [addClassType, setAddClassType] = useState("once");
  const [routineCount, setRoutineCount] = useState(0);
  const [searchDate, setSearchDate] = useState(new Date());
  const [selectDates, setSelectDates] = useState([]);
  const [selectBookData, setSelectBookData] = useState([]);
  const [isConfirm, setIsConfirm] = useState(false);
  const [intervalArray, setIntervalArray] = useState([]);
  const [allStudent, setAllStudent] = useState([]);
  const [studentPage, setStudentPage] = useState(0);
  const [studentMaxPage, setStudentMaxPage] = useState(0);
  const [confirmState, setConfirmState] = useState("");
  const [sortType, setSortType] = useState("ar");
  const [viewLecture, setViewLecture] = useState("");
  const [viewStartTime, setViewStartTime] = useState("");
  const [viewEndTime, setViewEndTime] = useState("");
  const [viewDate, setViewDate] = useState("");
  const [viewRepeat, setViewRepeat] = useState(false);
  const [viewAuto, setViewAuto] = useState(false);
  const [viewWeek, setViewWeek] = useState([]);

  //원생 기준 State들

  const onClickCancel = () => {
    setClassToggle(false);
    setSelectDates([]);
    setAddList([]);
    setStudentPage(0);
    setIsAuto(false);
    setAddRepeatInput([
      {
        week: [],
        startTime: dateToClock(date),
        endTime: dateToClockOneHour(date),
        isAuto: false,
        isRepeat: "once",
        repeatsNum: 0,
        startDate: dateToInput(date),
        teacherId: userData?.allUsers
          .filter((el) => el.userCategory === "선생님")
          .filter((el) => {
            return (
              Number(el.profile.academy.id) === Number(router.query.branch)
            );
          })[0].id,
        about: "",
      },
    ]);
  };
  const onClickCalendar = () => {
    setIsCalendar(!isCalendar);
  };
  const [minWc, setMinWc] = useState("");
  const [maxWc, setMaxWc] = useState("");
  const [minLex, setMinLex] = useState("");
  const [maxLex, setMaxLex] = useState("");
  const { refetch: refetchAttendance } = useQuery(GET_ATTENDANCE, {
    variables: {
      date: dateToInput(date),
      startTime: "17:35",
      academyId: 2,
      endtime: "",
    },
  });

  const { refetch: refetchCustomAttendance } = useQuery(GET_CUSTOM_ATTENDANCE, {
    variables: {
      academyId: 2,
      date: dateToInput(date),
      entryTime: "22:59",
      endTime: "23:59",
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
    const newList = [...addRepeatInput];
    newList.forEach((el) => {
      el.teacherId = userData?.allUsers
        .filter((el) => el.userCategory === "선생님")
        .filter((el) => {
          return (
            Number(el?.profile?.academy?.id) === Number(router.query.branch)
          );
        })[0].id;
    });
    console.log(newList);
    setAddRepeatInput(newList);
  }, [userData]);

  useEffect(() => {
    setLateTime(dateToClock(date));
    // setEditStartTime(dateToClock(date));
    // setEditEndTime(dateToClockOneHour(date));
    setAddClassStart(dateToClock(date));
    setAddClassEnd(dateToClockOneHour(date));
    const newList = [...addRepeatInput];
    newList.forEach((el) => {
      el.startTime = dateToClock(date);
      el.endTime = dateToClockOneHour(date);
    });
    setAddRepeatInput(newList);
    setDeleteDate(dateToInput(date));
    setMakeUpDate(dateToInput(date));
    setMakeUpStart(dateToClock(date));
    setMakeUpEnd(dateToClockOneHour(date));
  }, [date]);

  useEffect(() => {
    const { startDay, endDate, weekNumber } = getMonthInfo(
      Number(calendarDate.getFullYear()),
      Number(calendarDate.getMonth() + 1)
    );
    const calendar = [];
    let nowDate = 0;
    let nowDay = 0;

    for (let i = 0; i < weekNumber; i++) {
      const nowWeek = [];
      for (let j = 0; j < 7; j++) {
        if (startDay <= nowDay && nowDate < endDate) {
          nowDate++;
          nowWeek.push(nowDate);
        } else if (startDay > nowDay) {
          nowWeek.push(nowDay - startDay);
        } else {
          nowDate++;
          nowWeek.push(nowDate);
        }
        nowDay++;
      }
      calendar.push(nowWeek);
    }
    setCalendarArray(calendar);
  }, [calendarDate]);

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
    // try {
    //   await createAttendanceMutation({
    //     variables: {
    //       lectureId: Number(makeUpLectureId),
    //       studentId: Number(makeUpId),
    //       statusInput: "makeup",
    //     },
    //   });
    // } catch (err) {
    //   alert(err);
    // }
    try {
      const result = await createMakeup({
        variables: {
          date: makeUpDate,
          startTime: makeUpStart,
          endTime: makeUpEnd,
          lectureMemo: makeUpInfo,
          studentIds: [Number(makeUpId)],
          teacherId: Number(makeUpTeacherId),
          lectureId: Number(makeUpLectureId),
        },
      });
      setAddLectureId("");
      setStudentToggle(false);
      setAddList([]);
      setSelectDates([]);
      setSearchLecture(dateToInput(date));
      setSearchStudents("");
      // refetchLecture();
      refetchList();
      refetchStudentList();
      refetchMonth();
      setIsMakeUp(false);
    } catch (err) {
      alert(err);
    }
    setClassToggle(false);
    setTeacherId(
      userData?.allUsers
        .filter((el) => el.userCategory === "선생님")
        .filter((el) => {
          return Number(el.profile.academy.id) === Number(router.query.branch);
        })[0].id
    );
    setAddClassInfo("");
    setAddClassDate(dateToInput(date));
    setAddClassStart(dateToClock(date));
    setAddClassEnd(dateToClockOneHour(date));
  };

  const onClickViewMemo = (studentId, lectureId) => async () => {
    setMemoLecture(lectureId);
    setMemoStudent(studentId);
    const result = await refetchMemo({ studentId });
    result?.data?.getStudentLectureHistory?.filter((el) => {
      return Number(el.lecture.id) === lectureId;
    });
    setMemoContents(
      result?.data?.getStudentLectureHistory?.filter((el) => {
        return Number(el.lecture.id) === Number(lectureId);
      })?.[0]
    );
    console.log(result);
    setIsMemo(true);
  };

  const onClickEditMemo = async () => {
    try {
      await editMemo({
        variables: {
          lectureId: Number(memoLecture),
          studentId: Number(memoStudent),
          memo: memoText,
        },
      });
      refetchMemo();
      alert("수정 성공했습니다.");
    } catch (err) {
      console.log(err);
    }
  };

  const onClickMoveMemo = (int) => () => {
    const index = memoData?.getStudentLectureHistory?.findIndex((el) => {
      return Number(el.lecture.id) === Number(memoLecture);
    });
    if (index === -1) {
      if (int === -1) {
        setMemoContents(
          memoData?.getStudentLectureHistory?.[
            memoData?.getStudentLectureHistory?.length - 1
          ]
        );
        setMemoLecture(
          memoData?.getStudentLectureHistory?.[
            memoData?.getStudentLectureHistory?.length - 1
          ]?.lecture?.id
        );
        setMemoText(
          memoData?.getStudentLectureHistory?.[
            memoData?.getStudentLectureHistory?.length - 1
          ]?.memo ?? ""
        );
      }
      return;
    }

    if (int + index >= memoData?.getStudentLectureHistory.length) {
      alert("마지막 페이지입니다.");
    }
    if (int + index < 0) {
      alert("첫 페이지입니다.");
    }

    if (
      int + index >= 0 &&
      int + index < memoData?.getStudentLectureHistory.length
    ) {
      setMemoContents(memoData?.getStudentLectureHistory?.[index + int]);
      setMemoLecture(
        memoData?.getStudentLectureHistory?.[index + int]?.lecture?.id
      );
      setMemoText(
        memoData?.getStudentLectureHistory?.[index + int]?.memo ?? ""
      );
    }
  };

  const onClickOk = async () => {
    addRepeatInput.map((el) => {
      console.log(
        el.startDate,
        el.startTime,
        el.endTime,
        el.about,
        Number(el.teacherId)
      );
    });

    addList.forEach((ele) => {
      addRepeatInput.forEach(async (el, index) => {
        try {
          await createLecture({
            variables: {
              academyId: Number(router.query.branch),
              date: el.startDate,
              startTime: addRepeatInput[index].startTime,
              endTime: addRepeatInput[index].endTime,
              lectureMemo: "",
              about: addRepeatInput[index].about,
              teacherId: Number(addRepeatInput[index].teacherId),
              repeatDays:
                addRepeatInput[index].isRepeat === "once"
                  ? JSON.stringify({ repeat_days: [-1] })
                  : JSON.stringify({ repeat_days: addRepeatInput[index].week }),
              repeatWeeks:
                addRepeatInput[index].isRepeat === "once" ||
                addRepeatInput[index].isAuto
                  ? 1
                  : Number(addRepeatInput[index].repeatsNum),
              autoAdd: addRepeatInput[index].isAuto,
              studentIds: [ele],
            },
          });
          setAddLectureId("");
          setStudentToggle(false);
          setAddList([]);
          setSelectDates([]);
          setSearchLecture(dateToInput(date));
          setSearchStudents("");
          refetchList();
          refetchStudentList();
          refetchMonth();
          setStudentPage(0);
          setIsAuto(false);
          setClassToggle(false);
          setTeacherId(
            userData?.allUsers
              .filter((el) => el.userCategory === "선생님")
              .filter((el) => {
                return (
                  Number(el.profile.academy.id) === Number(router.query.branch)
                );
              })[0].id
          );
          setAddClassInfo("");
          setAddClassDate(dateToInput(date));
          setAddClassStart(dateToClock(date));
          setAddClassEnd(dateToClockOneHour(date));
        } catch (err) {
          console.log(err);
        }
      });
    });

    // }
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
    // refetchLecture({
    //   date: dateToInput(newDate),
    // });
    refetchCount();
    setSearchDate(new Date(value));
    newDate.setDate(newDate.getDate());
    setPage(1);
    setCalendarDate(newDate);

    setIsCalendar(false);
    refetchStudentList({ date: dateToInput(newDate) });
    refetchMonth({ month: Number(newDate.getMonth() + 1) });
  };
  const onClickMoveDate = (number) => () => {
    const newDate = new Date(
      calendarDate.setDate(calendarDate.getDate() + number)
    );
    // newDate.setDate(calendarDate.getDate() + number);
    setCalendarDate(newDate);

    setIsCalendar(false);
    setPage(1);
    // refetchLecture({
    //   date: dateToInput(newDate),
    // });
    refetchCount();
    refetchStudentList({ date: dateToInput(newDate) });
    refetchMonth({ month: Number(newDate.getMonth() + 1) });
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
    try {
      await refetchFiction({ studentId: Number(el.id), isSelected: true });
    } catch (err) {}
    try {
      await refetchNonFiction({ studentId: Number(el.id), isSelected: true });
    } catch (err) {}
    await refetchReservation({ studentId: Number(el.id) });
    refetchRecord({ studentId: Number(el.id) });
    setIsBook(true);
  };

  const onChangeEach = (e, lectureId, studentId, lectureInfoId) => {
    if (e.target.checked) {
      setCheckList([
        ...checkList,
        {
          lectureId,
          studentId: Number(studentId),
          lectureInfoId: lectureInfoId,
        },
      ]);
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

  const onClickSetting = async () => {
    try {
      await updateSetting({
        variables: {
          academyId: Number(router.query.branch),
          notificationInterval: intervalTime,
          endNotificationCustom: isNotificationCustom,
        },
      });
      setIsSetting(false);
      refetchSetting();
      alert("설정이 저장되었습니다.");
    } catch (err) {
      console.log(err);
    }
  };

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
        lectureId: Number(lecture?.lecture?.id),
        studentId: Number(lecture?.student?.id),
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
        // alert(error);
      }
    }
    await refetch();
    await refetchStudentList();
    await refetchMonth();
    setLateTime(dateToClock(date));
  };
  const onClickDelete = () => async () => {
    const currentCheckList = [...checkList];
    // let student_ids = []
    // let lectureId;
    if (!isAll) {
      for (const item of currentCheckList) {
        try {
          await deleteLecture({ variables: { id: item.lectureId } });
        } catch (err) {}
        // const lecture = studentArray.find(
        //   (el) =>
        //     Number(el.lecture.id) === Number(item.lectureId) &&
        //     Number(el.student.id) === Number(item.studentId)
        // );
        // // student_ids.push(Number(lecture.student.id))
        // // lectureId = Number(lecture.lecture.id);
        // let variables = {
        //   lectureId: Number(lecture.lecture.id),
        //   studentIds: [Number(lecture.student.id)],
        // };
        // try {
        //   await deleteStudentFromLecture({
        //     variables,
        //   });
        //   setCheckList([]);
        // } catch (error) {
        //   console.error(error);
        //   alert(error.message);
        // }
      }
      setCheckList([]);
      await refetch();
      await refetchStudentList();
      await refetchMonth();
    } else {
      for (const item of currentCheckList) {
        try {
          await deleteLectureInfo({
            variables: { id: item.lectureInfoId, date: deleteDate },
          });
        } catch (err) {}
      }
      setDeleteDate(dateToInput(date));
      setCheckList([]);
      await refetch();
      await refetchStudentList();
      await refetchMonth();
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
      refetchStudentList();
      refetchMonth();
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

  const onClickStudents = (id, name) => async () => {
    const nId = Number(id);
    try {
      await refetchLectureInfo({ studentId: Number(id) });
    } catch (err) {}
    setAddListName(name);
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
    if (
      minScore === "" &&
      maxScore === "" &&
      minWc === "" &&
      maxWc === "" &&
      minLex === "" &&
      maxLex === ""
    ) {
      return;
    }
    setIsLoading(true);
    const newDate = new Date(calendarDate);
    newDate.setDate(newDate.getDate() - 1);
    const variables = {
      academyIds: [Number(router.query.branch)],
      lectureDate: dateToInput(searchDate),
      studentId: Number(selectChild.id),
    };
    variables.minBl = Number(minScore);
    variables.maxBl = Number(maxScore);
    variables.minLex = Number(minLex);
    variables.maxLex = Number(maxLex);
    variables.minWc = Number(minWc);
    variables.maxWc = Number(maxWc);
    variables.arQn = null;
    if (maxScore === "" || maxScore === 0) {
      variables.maxBl = null;
    }
    if (maxLex === "" || maxLex === 0) {
      variables.maxLex = null;
    }
    if (maxWc === "" || maxWc === 0) {
      variables.maxWc = null;
    }
    try {
      await refetchBook(variables);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };

  const onClickConfirmRecord = async () => {
    if (readingList.length < 10) {
      setIsAlert(true);
    } else {
      try {
        await changeRecommendRecord({
          variables: {
            studentId: Number(selectChild.id),
            academyId: Number(router.query.branch),
            fNf: fNf,
            bookRecordIds: readingList,
          },
        });
        setIsChange(false);
        refetchFiction({ isSelected: true });
        refetchNonFiction({ isSelected: true });
        setReadingList([]);
        setSearchReading("");
      } catch (err) {
        alert(err);
        setIsChange(false);
        setReadingList([]);
        setSearchReading("");
      }
    }
  };

  const onClickAlertRecord = async () => {
    try {
      await changeRecommendRecord({
        variables: {
          studentId: Number(selectChild.id),
          academyId: Number(router.query.branch),
          fNf: fNf,
          bookRecordIds: readingList,
        },
      });
      setIsChange(false);
      refetchFiction({ isSelected: true });
      refetchNonFiction({ isSelected: true });
      setReadingList([]);
      setSearchReading("");
      setIsAlert(false);
    } catch (err) {
      alert(err);
      setIsChange(false);
      setReadingList([]);
      setSearchReading("");
      setIsAlert(false);
    }
  };

  const onClickChangePeriod = (fnf) => async () => {
    setFNf(fnf);
    setIsChange(true);
    setIsPeriod(true);
    try {
      const result = await refetchPackage({
        studentId: Number(selectChild.id),
        fNf: fnf,
      });
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  const onClickConfirmPeriod = async () => {
    try {
      await changeRecommendPeriod({
        variables: {
          studentId: Number(selectChild.id),
          academyId: Number(router.query.branch),
          fNf: fNf,
        },
      });
      setIsChange(false);
      refetchFiction({ isSelected: true });
      refetchNonFiction({ isSelected: true });
    } catch (err) {
      alert(err);
      setIsChange(false);
    }
  };

  const onClickFetch = (fnf) => async () => {
    if (fnf === "1") {
      try {
        await refetchFiction({ isSelected: false });
      } catch (err) {}
    }
    if (fnf === "2") {
      try {
        await refetchNonFiction({ isSelected: false });
      } catch (err) {}
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
        // refetchLecture();
        refetch();
        refetchStudentList();
        refetchMonth();
        refetchReservation();
        refetchFiction({ isSelected: true });
        refetchNonFiction({ isSelected: true });
        refetchCount();
      } catch (err) {
        alert(err);
      }
    }
  };

  const onClickBarcode = async () => {
    console.log(Number(selectChild.id), Number(selectLecture.id), barcode);

    const editBarcode = barcode
      .toUpperCase()
      .replaceAll(" ", "")
      .replaceAll("ㅖ", "P")
      .replaceAll("ㅔ", "P")
      .replaceAll("ㄷ", "E")
      .replaceAll("ㄸ", "E");

    try {
      const result = await refetchCheck({
        studentId: Number(selectChild.id),
        plbn: editBarcode,
      });
      if (result?.data?.studentPlbnRecord) {
        setIsDup(true);
      } else {
        try {
          await reservationBarcode({
            variables: {
              studentId: Number(selectChild.id),
              lectureId: Number(selectLecture.id),
              plbn: editBarcode,
            },
          });
          refetch();
          refetchStudentList();
          refetchMonth();
          refetchReservation();
          refetchFiction({ isSelected: true });
          refetchNonFiction({ isSelected: true });
          refetchCount();
          setBarcode("");
        } catch (err) {}
      }
    } catch (err) {}
  };

  const onClickConfirmBarcode = async () => {
    const editBarcode = barcode
      .toUpperCase()
      .replaceAll(" ", "")
      .replaceAll("ㅖ", "P")
      .replaceAll("ㅔ", "P")
      .replaceAll("ㄷ", "E")
      .replaceAll("ㄸ", "E");

    try {
      await reservationBarcode({
        variables: {
          studentId: Number(selectChild.id),
          lectureId: Number(selectLecture.id),
          plbn: editBarcode,
        },
      });
      refetch();
      refetchStudentList();
      refetchMonth();
      refetchReservation();
      refetchFiction({ isSelected: true });
      refetchNonFiction({ isSelected: true });
      refetchCount();
      setBarcode("");
      setIsDup(false);
    } catch (err) {}
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

  const onClickOpenEditModal = async () => {
    if (checkList.length === 1) {
      console.log(checkList);
      if (monthClassData !== undefined) {
        try {
          await refetchLectureInfo({
            studentId: Number(checkList[0].studentId),
          });
        } catch (err) {}
        setIsAll(false);
        setTodayDate(new Date());
        setIsEdit(true);
        const setting = monthClassData?.getLecturesByAcademyAndMonth
          ?.filter((lecture) => {
            return (
              lecture.date ===
              calendarDate.getFullYear() +
                "-" +
                getMonthZero(calendarDate) +
                "-" +
                getDateZero(calendarDate)
            );
          })
          .filter((el) => {
            return el.lectureInfo.id === checkList[0].lectureInfoId;
          })[0];
        setIsEditAuto(setting?.lectureInfo.autoAdd);
        setIsEditRepeat(!setting?.lectureInfo.repeatDay.includes(-1));
        setEditStartTime(setting?.startTime);
        setEditEndTime(setting?.endTime);
        if (!setting?.lectureInfo.repeatDay.includes(-1)) {
          setEditRepeatWeek(setting?.lectureInfo.repeatDay);
          setEditRepeatCount(setting?.lectureInfo.repeatWeeks);
        } else {
          setEditRepeatCount(1);
          setEditRepeatWeek([]);
        }
      }
    } else {
      alert("수업 수정은 원생 한 명 체크해주시기 바랍니다.");
    }
  };

  const onClickEditDates = (index) => () => {
    const newDates = [...editRepeatWeek];
    if (newDates.includes(index)) {
      setEditRepeatWeek(newDates.filter((el) => index !== el));
    } else {
      newDates.push(index);
      setEditRepeatWeek(newDates);
    }
  };

  // 수업 반복 추가 커스텀 지점
  const onClickRepeatDates = (ind, index) => () => {
    const newInput = [...addRepeatInput];
    const newDates = [...newInput[ind].week];
    if (newDates.includes(index)) {
      newInput[ind].week = newDates.filter((el) => index !== el);
    } else {
      newDates.push(index);
      newInput[ind].week = newDates;
    }
    console.log(newInput);
    setAddRepeatInput(newInput);
  };

  const onChangeRepeatStartTime = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].startTime = e.target.value;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeRepeatEndTime = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].endTime = e.target.value;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeRepeatTeacherId = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].teacherId = e.target.value;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeRepeatDate = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].startDate = e.target.value;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeRepeatIsRepeat = (ind, value) => () => {
    const newInput = [...addRepeatInput];
    newInput[ind].isRepeat = value;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeRepeatIsAuto = (ind) => () => {
    const newInput = [...addRepeatInput];
    newInput[ind].isAuto = !newInput[ind].isAuto;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeRepeatAbout = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].about = e.target.value;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeRepeatCount = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].repeatsNum = e.target.value;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onClickAddRepeatDelete = (ind) => () => {
    if (addRepeatInput.length !== 1) {
      const newInput = [...addRepeatInput];
      setAddRepeatInput(
        newInput.filter((_, index) => {
          return ind !== index;
        })
      );
    }
  };

  //여기까지

  const onClickViewDates = (index) => () => {
    const newDates = [...viewWeek];
    if (newDates.includes(index)) {
      setViewWeek(newDates.filter((el) => index !== el));
    } else {
      newDates.push(index);
      setViewWeek(newDates);
    }
  };

  const onChangeAcademy = (e) => {
    router.push("/" + e.target.value + "/class");
  };

  const onClickTotalReturn = async () => {
    try {
      await deleteTotal({ variables: { studentId: Number(selectChild.id) } });
      alert("반납 완료");
      setIsBook(false);
      setBookSearchWord("");
      // refetchLecture();
      refetchCount();
      refetchStudentList();
      refetchMonth();
      setReserveType("recommend");
    } catch (err) {
      alert(err);
    }
  };

  const onClickReturnBook = (id) => async () => {
    try {
      await deleteBook({ variables: { bookId: [Number(id)] } });
      refetchReservation();
      refetchCount();
      // refetchLecture();
      refetchStudentList();
      refetchMonth();
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

  // 수업 전체 수정
  const onClickUpdateLecture = async () => {
    if (isAll) {
      console.log(
        Number(checkList[0].lectureInfoId),
        editDate,
        editInfo,
        isEditRepeat,
        editRepeatWeek,
        editRepeatCount,
        isEditAuto,
        [checkList[0].studentId]
      );
      try {
        await editLectureInfo({
          variables: {
            lectureInfoId: Number(checkList[0].lectureInfoId),
            date: editDate,
            about: editInfo,
            repeatDays: isEditRepeat
              ? JSON.stringify({ repeat_days: editRepeatWeek })
              : JSON.stringify({ repeat_days: [-1] }),
            repeatWeeks: isEditRepeat ? Number(editRepeatCount) : 1,
            autoAdd: isEditAuto,
            studentIds: [Number(checkList[0].studentId)],
            startTime: editStartTime,
            endTime: editEndTime,
            academyId: Number(editAcademy),
            teacherId: Number(teacherId),
          },
        });
        await refetchList();
        await refetchStudentList();
        await refetchMonth();
        refetchList();
        refetchStudentList();
        refetchMonth();
        setIsEdit(false);
        setEditDate(dateToInput(date));
        // setEditStartTime(dateToClock(date));
        // setEditEndTime(dateToClockOneHour(date));
        setEditInfo("");
        setCheckList([]);
        setEditAcademy(Number(router.query.branch));
        setTeacherId(
          userData?.allUsers
            .filter((el) => el.userCategory === "선생님")
            .filter((el) => {
              return (
                Number(el.profile.academy.id) === Number(router.query.branch)
              );
            })[0].id
        );
      } catch (err) {}
    } else {
      const newList = [...checkList];
      const updateList = {};

      newList.forEach((el) => {
        const key = el.lectureId;
        if (!updateList[key]) {
          updateList[key] = { lectureId: key, studentIds: [] };
        }
        updateList[key].studentIds.push(Number(el.studentId));
      });
      const updateArray = Object.values(updateList);
      console.log(updateArray);

      updateArray.map(async (el) => {
        try {
          const result = await updateLecture({
            variables: {
              lectureId: Number(el.lectureId),
              date: editDate,
              studentIds: el.studentIds,
              startTime: editStartTime,
              endTime: editEndTime,
              academyId: editAcademy,
              teacherId: Number(teacherId),
            },
          });
          // refetchLecture();
          refetchList();
          refetchStudentList();
          refetchMonth();
          setIsEdit(false);
          setEditDate(dateToInput(date));
          // setEditStartTime(dateToClock(date));
          // setEditEndTime(dateToClockOneHour(date));
          setEditInfo("");
          setCheckList([]);
          setEditAcademy(Number(router.query.branch));
          setTeacherId(
            userData?.allUsers
              .filter((el) => el.userCategory === "선생님")
              .filter((el) => {
                return (
                  Number(el.profile.academy.id) === Number(router.query.branch)
                );
              })[0].id
          );
        } catch (err) {
          console.log(err);
        }
      });
    }
  };

  useEffect(() => {
    setMemoText(
      memoData?.getStudentLectureHistory?.filter(
        (el) => Number(el.lecture.id) === Number(memoLecture)
      )?.[0]?.memo
    );
  }, [memoData, memoLecture]);

  useEffect(() => {
    if (data && data.allLectures && settingData) {
      const startTimesArray = data?.allLectures
        ?.filter((el) => {
          return el.date == dateToInput(date);
        })
        .map((lecture) => lecture.startTime);
      // setStartTimes(startTimesArray);
      const startTimesJSON = JSON.stringify(startTimesArray);
      localStorage.setItem("startTimes", startTimesJSON);
      const endTimesArray = data?.allLectures
        ?.filter((el) => {
          return el.date == dateToInput(date);
        })
        // endTime 리스트 수정 지점
        // ?.filter((el)=>{
        //   return el.students?.filter
        // })
        .map((lecture) => lecture.endTime);
      // setEndTimes(endTimesArray);
      const endTimesJSON = JSON.stringify(endTimesArray);
      localStorage.setItem("endTimes", endTimesJSON);
      console.log(data.allLectures);
    }
  }, [data, settingData]);

  useEffect(() => {
    if (studentListData && settingData && data) {
      if (settingData?.academyInfo?.endNotificationCustom) {
        const lateTimesArray =
          studentListData?.getLecturesByAcademyAndDateStudents
            ?.map((el) => {
              let hours =
                Number(el.lecture.endTime.slice(0, 2)) -
                Number(el.lecture.startTime.slice(0, 2));
              let mins =
                Number(el.lecture.endTime.slice(3, 5)) -
                Number(el.lecture.startTime.slice(3, 5));

              if (mins < 0) {
                hours--;
                mins = mins + 60;
              }
              let lateTime;
              const entryDate = new Date(el?.attendanceStatus?.entryTime);
              entryDate.setHours(
                entryDate.getHours() + hours,
                entryDate.getMinutes() + mins,
                0
              );
              if (entryDate.getHours() < 10 && entryDate.getMinutes() < 10) {
                lateTime =
                  "0" + entryDate.getHours() + ":0" + entryDate.getMinutes();
              }
              if (entryDate.getHours() >= 10 && entryDate.getMinutes() < 10) {
                lateTime = entryDate.getHours() + ":0" + entryDate.getMinutes();
              }
              if (entryDate.getHours() < 10 && entryDate.getMinutes() >= 10) {
                lateTime =
                  "0" + entryDate.getHours() + ":" + entryDate.getMinutes();
              }
              if (entryDate.getHours() >= 10 && entryDate.getMinutes() >= 10) {
                lateTime = entryDate.getHours() + ":" + entryDate.getMinutes();
              }
              if (el?.attendanceStatus !== null) {
                return {
                  lateTime: lateTime,
                  endTime: el.lecture.endTime,
                  entryTime: el.attendanceStatus.entryTime,
                };
              }
            })
            .filter((el) => {
              return el !== undefined;
            });
        const uniqueLateTimesMap = new Map();
        for (const obj of lateTimesArray) {
          uniqueLateTimesMap.set(obj.lateTime, obj);
        }
        const uniqueLateTimesArray = Array.from(uniqueLateTimesMap.values());

        const lateTimesJSON = JSON.stringify(uniqueLateTimesArray);
        localStorage.setItem("lateTimes", lateTimesJSON);
      }
    }
  }, [studentListData, data, settingData]);

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
  const onClickSortType = (type) => () => {
    setSortType(type);
  };
  const checkTargetTime = (time, isCustom) => () => {
    const now = new Date();
    setCheckDate(now);
    // startTimes와 endTimes 배열을 로컬 스토리지에서 가져오기
    setStartList([]);
    setLateList([]);
    setEndList([]);

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
            60 * startTime.getHours() + startTime.getMinutes() - time
        ) {
          // 원하는 동작 실행 (예: 알림 표시, WebSocket 메시지 전송 등)
          try {
            const result = await refetchAttendance({
              startTime: dateToClock(startTime),
              academyId: Number(router.query.branch),
            });
            setStartList(result?.data?.getAttendance);
            setIsAlarm(true);
            setAlarmTime(dateToClock(startTime));
            setAlarmType("start");
            if (result?.data?.getAttendance?.length !== 0 && isSound) {
              alarmSound = true;
              const audio = new Audio("/2.mp3");
              audio.play();
            }
          } catch {}
        }
      });
      // 수정 지점
      if (!isCustom) {
        endTimes.forEach(async (endTime) => {
          if (
            (now.getHours() === endTime.getHours() &&
              now.getMinutes() === endTime.getMinutes()) ||
            now.getHours() * 60 + now.getMinutes() ===
              60 * endTime.getHours() + endTime.getMinutes() - time
          ) {
            // 원하는 동작 실행 (예: 알림 표시, WebSocket 메시지 전송 등)
            try {
              const result = await refetchAttendance({
                endtime: dateToClock(endTime),
                startTime: "",
                academyId: Number(router.query.branch),
              });
              setEndList(result?.data?.getAttendance);
              setIsAlarm(true);
              setAlarmTime(dateToClock(endTime));
              setAlarmType("end");
              if (result?.data?.getAttendance !== null && isSound) {
                alarmSound = true;
                const audio = new Audio("/2.mp3");
                audio.play();
              }
            } catch {}
          }
        });
      }

      if (isCustom) {
        const lateTimesStr = localStorage.getItem("lateTimes");
        if (lateTimesStr && router.query.branch !== undefined) {
          const lateTimes = JSON.parse(lateTimesStr);
          lateTimes.forEach(async (lateTime) => {
            if (
              (now.getHours() === Number(lateTime.lateTime.slice(0, 2)) &&
                now.getMinutes() === Number(lateTime.lateTime.slice(3, 5))) ||
              now.getHours() * 60 + now.getMinutes() ===
                Number(lateTime.lateTime.slice(0, 2)) * 60 +
                  Number(lateTime.lateTime.slice(3, 5)) -
                  time
            ) {
              try {
                const result = await refetchCustomAttendance({
                  academyId: Number(router.query.branch),
                  endTime: lateTime.endTime + ".000000",
                  entryTime:
                    lateTime.entryTime.slice(0, 10) +
                    " " +
                    lateTime.entryTime.slice(11, 18) +
                    ".000000",
                });
                setAlarmType("end");
                setLateList(result?.data?.getCustomattendance);
                setIsAlarm(true);
                setAlarmTime(lateTime.lateTime);
                if (result?.data?.getCustomattendance !== null && isSound) {
                  alarmSound = true;
                  const audio = new Audio("/2.mp3");
                  audio.play();
                }
              } catch (err) {
                console.log(err);
              }
            }
          });
        }
      }
    }
  };

  useEffect(() => {
    intervalArray.forEach((el) => {
      clearInterval(el);
    });
    if (settingData !== undefined) {
      const intervalA = setInterval(
        checkTargetTime(
          settingData?.academyInfo?.notificationInterval,
          settingData?.academyInfo?.endNotificationCustom
        ),
        60 * 1000
      );
      const newInterval = [...intervalArray];
      newInterval.push(intervalA);
      setIntervalArray(newInterval);
      return () => clearInterval(intervalA);
    }
  }, [studentData, isSound, settingData]); // refetch

  useEffect(() => {
    const newArray =
      bookData === undefined
        ? []
        : bookData?.getBooksByBl?.filter((el) => {
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "ar") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return a?.bl - b?.bl;
          })
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "arReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return b?.bl - a?.bl;
          })
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "lexile") {
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "lexileReverse") {
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "wordCount") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return a?.wcAr - b?.wcAr;
          })
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "wordCountReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return b?.wcAr - a?.wcAr;
          })
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
          ?.map((el) => {
            return el;
          })
      );
    }
    // setBookArray(
    //   newArray
    //     ?.filter((el, index) => {
    //       return (
    //         index < bookPage * itemsPerPage &&
    //         index >= (bookPage - 1) * itemsPerPage
    //       );
    //     })
    //     ?.map((el) => {
    //       return el;
    //     })
    // );
    setBookMaxPage(
      Math.ceil(
        bookData?.getBooksByBl?.filter((el) => {
          return (
            el?.titleAr.toUpperCase().includes(bookSearchWord.toUpperCase()) ||
            String(el?.books[0]?.isbn)
              .toUpperCase()
              .includes(bookSearchWord.toUpperCase()) ||
            el?.authorAr.toUpperCase().includes(bookSearchWord.toUpperCase()) ||
            String(el?.kplbn)
              .toUpperCase()
              .includes(bookSearchWord.toUpperCase())
          );
        })?.length / itemsPerPage
      )
    );
    setBookPage(1);
    setBookPageList(0);
  }, [bookData, bookSearchWord, sortType]);

  useEffect(() => {
    const newArray =
      bookData === undefined
        ? []
        : bookData?.getBooksByBl?.filter((el) => {
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "ar") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return a?.bl - b?.bl;
          })
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "arReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return b?.bl - a?.bl;
          })
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "lexile") {
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "lexileReverse") {
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
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "wordCount") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return a?.wcAr - b?.wcAr;
          })
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
          ?.map((el) => {
            return el;
          })
      );
    }
    if (sortType === "wordCountReverse") {
      setBookArray(
        newArray
          ?.sort((a, b) => {
            return b?.wcAr - a?.wcAr;
          })
          ?.filter((el, index) => {
            return index < bookPage * 20 && index >= (bookPage - 1) * 20;
          })
          ?.map((el) => {
            return el;
          })
      );
    }
    setBookMaxPage(
      Math.ceil(
        bookData?.getBooksByBl?.filter((el) => {
          return (
            el?.titleAr.toUpperCase().includes(bookSearchWord.toUpperCase()) ||
            String(el?.books[0]?.isbn)
              .toUpperCase()
              .includes(bookSearchWord.toUpperCase()) ||
            el?.authorAr.toUpperCase().includes(bookSearchWord.toUpperCase()) ||
            String(el?.kplbn)
              .toUpperCase()
              .includes(bookSearchWord.toUpperCase())
          );
        })?.length / itemsPerPage
      )
    );
  }, [bookPage, bookSearchWord, minWc, maxWc, sortType]);

  useEffect(() => {
    setTeacherId(
      userData?.allUsers
        .filter((el) => el.userCategory === "선생님")
        .filter((el) => {
          return Number(el.profile.academy.id) === Number(router.query.branch);
        })?.[0]?.id
    );
  }, [userData]);

  useEffect(() => {
    setIsNotificationCustom(settingData?.academyInfo?.endNotificationCustom);
    setIntervalTime(settingData?.academyInfo?.notificationInterval);
  }, [settingData]);

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

  useEffect(() => {
    setEditAcademy(Number(router.query.branch));
  }, [myData]);

  //프레젠터 시작
  // console.log(monthClassData);

  return (
    <S.ClassWrapper>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {myData?.me?.profile?.academies?.length > 0 ? (
          <select
            onChange={onChangeAcademy}
            style={{
              width: "200px",
              height: "30px",
              fontSize: "14px",
              border: "1px solid #DBDDE1",
              borderRadius: "8px",
              fontFamily: "Spoqa Han Sans Neo",
              paddingLeft: "10px",
            }}
          >
            {myData?.me?.profile?.academies?.map((el) => {
              return (
                <option
                  value={Number(el.id)}
                  selected={Number(router.query.branch) === Number(el.id)}
                >
                  {el.location}
                </option>
              );
            })}
          </select>
        ) : (
          <></>
        )}
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
      <S.TitleWrapper>
        <S.ClassTitle>수업 관리</S.ClassTitle>
        <S.ClassTopMenu>
          <S.DateBox>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
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
              <div
                style={{
                  position: "absolute",
                  zIndex: 50,
                  left: "88.2rem",
                  top:
                    myData?.me?.profile?.academies?.length > 0
                      ? "16.2rem"
                      : "14.3rem",
                }}
              >
                <Calendar
                  onChange={onClickDate}
                  value={date}
                  locale="en-US"
                  tileClassName={tileClassName}
                ></Calendar>
              </div>
            ) : (
              <></>
            )}
          </S.DateBox>
        </S.ClassTopMenu>
      </S.TitleWrapper>
      <S.CalendarLine>
        <S.CalendarSpan
          style={!lookCalendar ? { borderBottom: "1px solid #000000" } : {}}
          onClick={() => {
            setLookCalendar(false);
          }}
        >
          출석 관리
        </S.CalendarSpan>
        <S.CalendarSpan
          style={lookCalendar ? { borderBottom: "1px solid #000000" } : {}}
          onClick={() => {
            setLookCalendar(true);
          }}
        >
          달력별 보기
        </S.CalendarSpan>
      </S.CalendarLine>

      {!lookCalendar ? (
        <>
          <S.ClassMiddleBox>
            <S.ClassMiddleTag>
              <S.CountNumber style={{ marginRight: "1.37rem" }}>
                {"전체 " +
                  (studentListData?.getLecturesByAcademyAndDateStudents
                    ?.length ?? 0) +
                  "명"}
              </S.CountNumber>
              <S.ClassSmallGreenButton
                onClick={() => {
                  setTodayDate(new Date());
                  setIsAttendance(true);
                  setIsLate(false);
                  setIsComplete(false);
                }}
                style={{ border: "1px solid #017D73" }}
              >
                등원
                {/* <div
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    background: "#017D73",
                    marginLeft: "0.37rem",
                    borderRadius: "5rem",
                  }}
                ></div> */}
              </S.ClassSmallGreenButton>

              <S.ClassSmallRedButton
                onClick={() => {
                  setIsConfirm(true);
                  setConfirmState("결석");
                }}
                style={{ marginLeft: "0.75rem", border: "1px solid #BD271E" }}
              >
                결석
                {/* <div
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    background: "#BD271E",
                    marginLeft: "0.37rem",
                    borderRadius: "5rem",
                  }}
                ></div> */}
              </S.ClassSmallRedButton>
              <S.ClassSmallBlueButton
                onClick={() => {
                  setTodayDate(new Date());
                  setIsAttendance(false);
                  setIsLate(false);
                  setIsComplete(true);
                }}
                style={{ marginLeft: "0.75rem", border: "1px solid #333" }}
              >
                하원
                {/* <div
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    background: "#333",
                    marginLeft: "0.37rem",
                    borderRadius: "5rem",
                  }}
                ></div> */}
              </S.ClassSmallBlueButton>

              <S.ClassSmallBlackButton
                onClick={() => {
                  setTodayDate(new Date());
                  setIsAttendance(false);
                  setIsLate(true);
                  setIsComplete(false);
                }}
                style={{ marginLeft: "0.75rem", border: "1px solid #F5A700" }}
              >
                지각
                {/* <div
                  style={{
                    width: "0.5rem",
                    height: "0.5rem",
                    background: "#F5A700",
                    marginLeft: "0.37rem",
                    borderRadius: "5rem",
                  }}
                ></div> */}
              </S.ClassSmallBlackButton>

              <S.ClassSmallBlackButton
                onClick={onClickOpenEditModal}
                style={{ marginLeft: "0.75rem", border: "1px solid purple" }}
              >
                수정
              </S.ClassSmallBlackButton>

              <S.ClassSmallBlackButton
                onClick={() => {
                  setIsConfirm(true);
                  setConfirmState("삭제");
                  setTodayDate(new Date());
                  setIsAll(false);
                }}
                style={{ marginLeft: "0.75rem", border: "1px solid #333" }}
              >
                삭제
              </S.ClassSmallBlackButton>
            </S.ClassMiddleTag>
            <S.ClassMiddleTag>
              <S.ClassInput
                type="text"
                onChange={onChangeSearch}
                placeholder="     원번 혹은 이름을 입력하세요."
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
                  setTodayDate(new Date());
                  setClassToggle(true);
                  setAddClassType("once");
                  setAddRepeatInput([
                    {
                      week: [],
                      startTime: dateToClock(date),
                      endTime: dateToClockOneHour(date),
                      isAuto: false,
                      isRepeat: "once",
                      repeatsNum: 0,
                      startDate: dateToInput(date),
                      teacherId: Number(
                        userData?.allUsers
                          .filter((el) => el.userCategory === "선생님")
                          .filter((el) => {
                            return (
                              Number(el.profile.academy.id) ===
                              Number(router.query.branch)
                            );
                          })[0].id
                      ),
                      about: "",
                    },
                  ]);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  style={{ marginRight: "0.25rem" }}
                >
                  <path
                    d="M5 10H10M10 10H15M10 10V5M10 10V15"
                    stroke="#81858C"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                수업 추가
              </S.ClassButton>
              <SettingOutlined
                onClick={() => {
                  setIsSetting(true);
                }}
                style={{ fontSize: "25px", marginLeft: "15px" }}
              ></SettingOutlined>
              <S.SwitchDiv>
                <S.SwitchFont>알람</S.SwitchFont>
                <Switch
                  defaultChecked={false}
                  onChange={(checked) => {
                    setIsSound(checked);
                  }}
                  style={{ marginLeft: "1rem" }}
                ></Switch>
              </S.SwitchDiv>
            </S.ClassMiddleTag>
          </S.ClassMiddleBox>
          <table>
            <thead>
              <tr>
                <th style={{ width: "20px", padding: "3px" }}>
                  <input
                    type="checkbox"
                    style={{ width: "20px", height: "20px" }}
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
                <th>원생 메모</th>
                <th>원생 정보</th>
              </tr>
            </thead>
            <tbody>
              {studentArray?.map((el) => {
                return (
                  <tr key={el.id || uuidv4()}>
                    <td style={{ width: "20px", padding: "3px" }}>
                      <input
                        type="checkbox"
                        onChange={(e) =>
                          onChangeEach(
                            e,
                            el.lecture.id,
                            el.student.id,
                            el.lecture.lectureInfo.id
                          )
                        }
                        style={{ width: "20px", height: "20px" }}
                        checked={checkList.some((ele) => {
                          return (
                            Number(ele.studentId) === Number(el.student.id) &&
                            Number(ele.lectureId) === Number(el.lecture.id)
                          );
                        })}
                      ></input>
                    </td>
                    <td>{el.student.origin}</td>
                    <td>
                      {el.student.korName + "(" + el.student.engName + ")"}
                    </td>
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
                          : { color: "tomato" }
                      }
                    >
                      {timeToHour(el.lecture.startTime)}
                    </td>
                    <td>{timeToHour(el.lecture.endTime)}</td>
                    <td>
                      {el?.attendanceStatus?.statusDisplay ?? ""}
                      {el?.attendanceStatus?.statusDisplay === "결석" && (
                        // 여기서부터 보강
                        <button
                          onClick={onClickOpenMakeUp(
                            el.student.id,
                            el.lecture.id
                          )}
                        >
                          보강
                        </button>
                      )}
                    </td>
                    <td>
                      {el?.attendanceStatus?.entryTime
                        ? timeToHour(
                            dateToClock(
                              dateToKoreanTime(el?.attendanceStatus?.entryTime)
                            )
                          )
                        : ""}
                    </td>
                    <td
                      style={
                        checkDate.getHours() * 60 +
                          checkDate.getMinutes() -
                          customAlarm(
                            el?.attendanceStatus?.entryTime,
                            el.lecture.startTime,
                            el.lecture.endTime
                          )?.getHours() *
                            60 -
                          customAlarm(
                            el?.attendanceStatus?.entryTime,
                            el.lecture.startTime,
                            el.lecture.endTime
                          )?.getMinutes() <
                          0 ||
                        el?.attendanceStatus?.exitTime !== null ||
                        ["결석 (보강)", "결석"].includes(
                          el?.attendanceStatus?.statusDisplay
                        )
                          ? {}
                          : { color: "tomato" }
                      }
                    >
                      {["결석 (보강)", "결석"].includes(
                        el?.attendanceStatus?.statusDisplay
                      )
                        ? ""
                        : el?.attendanceStatus?.exitTime
                        ? timeToHour(
                            dateToClock(
                              dateToKoreanTime(el?.attendanceStatus?.exitTime)
                            )
                          )
                        : isNotificationCustom
                        ? timeToHour(
                            dateToClock(
                              customAlarm(
                                el?.attendanceStatus?.entryTime,
                                el.lecture.startTime,
                                el.lecture.endTime
                              )
                            ) ?? el.lecture.endTime
                          ) + "(예상)"
                        : timeToHour(el.lecture.endTime) + "(예상)"}
                    </td>
                    <td
                    // onMouseEnter={() => {
                    //   setIsViewTitle(true);
                    //   setViewTitle(el.lecture.lectureInfo.about);
                    // }}
                    // onMouseLeave={() => {
                    //   setIsViewTitle(false);
                    // }}
                    >
                      {el.lecture.lectureMemo === "" ? (
                        <div>{longWord(el.lecture.lectureInfo.about)}</div>
                      ) : (
                        <div>
                          {longWord(el.lecture.lectureInfo.about)}
                          <div style={{ fontSize: "0.7rem", color: "#ababab" }}>
                            {"(" + longWord(el.lecture.lectureMemo) + ")"}
                          </div>
                        </div>
                      )}
                    </td>
                    <td>
                      <div>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={onClickBooks(el.student, el.lecture)}
                          style={{ cursor: "pointer" }}
                        >
                          <path
                            d="M5 19.5V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H18.4C18.5591 3 18.7117 3.06321 18.8243 3.17574C18.9368 3.28826 19 3.44087 19 3.6V21H6.5M9 7H15M6.5 15H19M6.5 18H19"
                            stroke="#81858C"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M6.5 15C5.5 15 5 15.672 5 16.5C5 17.328 5.5 18 6.5 18C5.5 18 5 18.672 5 19.5C5 20.328 5.5 21 6.5 21"
                            stroke="#81858C"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </td>
                    <td>{el.student.reservedBooksCount + "권"}</td>
                    <td>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={onClickViewMemo(el.student.id, el.lecture.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <path
                          d="M7.08337 3.33334H5.00004C4.55801 3.33334 4.13409 3.50894 3.82153 3.8215C3.50897 4.13406 3.33337 4.55798 3.33337 5.00001V16.6667C3.33337 17.1087 3.50897 17.5326 3.82153 17.8452C4.13409 18.1577 4.55801 18.3333 5.00004 18.3333H15C15.4421 18.3333 15.866 18.1577 16.1786 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V5.00001C16.6667 4.55798 16.4911 4.13406 16.1786 3.8215C15.866 3.50894 15.4421 3.33334 15 3.33334H12.9167"
                          stroke="#81858C"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M6.66663 5.33334V3.75001C6.66663 3.6395 6.71052 3.53352 6.78866 3.45538C6.8668 3.37724 6.97279 3.33334 7.08329 3.33334C7.31329 3.33334 7.50329 3.14668 7.54329 2.92001C7.66663 2.21001 8.14496 0.833344 9.99996 0.833344C11.855 0.833344 12.3333 2.21001 12.4566 2.92001C12.4966 3.14668 12.6866 3.33334 12.9166 3.33334C13.0271 3.33334 13.1331 3.37724 13.2113 3.45538C13.2894 3.53352 13.3333 3.6395 13.3333 3.75001V5.33334C13.3333 5.46595 13.2806 5.59313 13.1868 5.6869C13.0931 5.78066 12.9659 5.83334 12.8333 5.83334H7.16663C7.03402 5.83334 6.90684 5.78066 6.81307 5.6869C6.7193 5.59313 6.66663 5.46595 6.66663 5.33334Z"
                          stroke="#81858C"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </td>
                    <td>
                      <SearchOutlined
                        onClick={() => {
                          window.open(
                            "/" +
                              router.query.branch +
                              "/academy/" +
                              el.student.id
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
                    ? { backgroundColor: "#333", color: "#eeeeee" }
                    : {}
                }
                onClick={onClickPage(i + 1)}
              >
                {i + 1}
              </S.PageBox>
            ))}
          </S.PageContainer>
        </>
      ) : (
        //달력 시작
        <>
          <S.CalendarWrapper>
            {isViewMore ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => {
                      setIsViewMore(false);
                    }}
                    cursor={"pointer"}
                  >
                    <path
                      d="M35 19.9999H5M5 19.9999L19.1667 5.83325M5 19.9999L19.1667 34.1666"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <S.CalendarRightTitle>수업 목록</S.CalendarRightTitle>
                </div>

                <table style={{ display: "flex" }}>
                  <tbody>
                    <thead>
                      <tr>
                        <th>수업 시간</th>
                        <th>수업 설명</th>
                        <th>수업 반복 여부</th>
                        <th>수업 자동 추가 여부</th>
                        <th>반복 주</th>
                        <th>반복 요일</th>
                        {/* <th>수업 인원 수정</th> */}
                        <th>원생</th>
                        <th>담당 선생님</th>
                        {/* <th>담당 지점</th> */}
                        <th>수정</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewModalList?.map((el) => {
                        return (
                          <TableClassListBody
                            el={el}
                            allStudent={studentData?.studentsInAcademy}
                            // academies={
                            //   myData?.me?.profile?.academies?.length > 0
                            //     ? myData?.me?.profile?.academies
                            //     : []
                            // }
                            teachers={userData?.allUsers
                              .filter((el) => el.userCategory === "선생님")
                              .filter((el) => {
                                return (
                                  Number(el.profile.academy.id) ===
                                  Number(router.query.branch)
                                );
                              })}
                            editLectureInfo={editLectureInfo}
                            refetchList={refetchList}
                            refetchStudentList={refetchStudentList}
                            refetchMonth={refetchMonth}
                          ></TableClassListBody>
                        );
                      })}
                    </tbody>
                  </tbody>
                </table>
              </div>
            ) : (
              <S.CalendarLeft>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    margin: "1rem 0",
                    width: "100%",
                  }}
                >
                  <div>
                    <span>
                      {calendarDate.getFullYear() +
                        "년 " +
                        (calendarDate.getMonth() + 1) +
                        "월"}
                    </span>
                  </div>
                  {/* <S.CalendarLeftSelect
                    onChange={(e) => {
                      setViewType(e.target.value);
                      setViewLecture("");
                      setViewDate("");
                      setIsViewMore(false);
                    }}
                    value={viewType}
                  >
                    <option value={"student"}>원생 기준</option>
                    <option value={"class"}>수업 기준</option>
                  </S.CalendarLeftSelect> */}
                </div>
                <div style={{ marginBottom: "5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      borderTop: "0.4px solid #DBDDE1",
                      borderBottom: "0.4px solid #DBDDE1",
                    }}
                  >
                    {week.map((_, index) => {
                      return (
                        <div
                          style={{
                            width: "7rem",
                            height: "2.75rem",
                            color: index === 0 ? "tomato" : "black",
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: "2rem",
                            backgroundColor: "#F7F8FA",
                          }}
                        >
                          {week[(index + 6) % 7]}
                        </div>
                      );
                    })}
                  </div>
                  {calendarArray.map((el, index1) => {
                    return (
                      <div style={{ display: "flex" }}>
                        {el.map((ele, index2) => {
                          return (
                            <div
                              style={{
                                width: "7rem",
                                height: "9.5rem",
                                borderBottom: "0.4px solid #DBDDE1",
                                color:
                                  ele < 1 ||
                                  ele >
                                    new Date(
                                      calendarDate.getFullYear(),
                                      calendarDate.getMonth() + 1,
                                      0
                                    ).getDate()
                                    ? "gray"
                                    : "black",
                                backgroundColor:
                                  calendarDate.getDate() === ele
                                    ? "#F7F8FA"
                                    : "",
                                paddingLeft: "2rem",
                                paddingTop: "0.5rem",
                                display: "flex",
                                flexDirection: "column",
                              }}
                              onClick={() => {
                                if (viewType === "class") {
                                  if (
                                    monthClassData?.getLecturesByAcademyAndMonth?.filter(
                                      (lecture) => {
                                        return (
                                          lecture.date ===
                                          calendarDate.getFullYear() +
                                            "-" +
                                            getMonthZero(calendarDate) +
                                            "-" +
                                            getNumberZero(ele)
                                        );
                                      }
                                    )?.length > 0
                                  ) {
                                    setIsViewMore(true);
                                    setViewMorePosition([index1, index2]);
                                    // setViewDate("1");
                                    setViewModalList(
                                      monthClassData?.getLecturesByAcademyAndMonth?.filter(
                                        (lecture) => {
                                          return (
                                            lecture.date ===
                                            calendarDate.getFullYear() +
                                              "-" +
                                              getMonthZero(calendarDate) +
                                              "-" +
                                              getNumberZero(ele)
                                          );
                                        }
                                      )
                                    );
                                  }
                                }
                                console.log(
                                  monthClassData?.getLecturesByAcademyAndMonth?.filter(
                                    (lecture) => {
                                      return (
                                        lecture.date ===
                                        calendarDate.getFullYear() +
                                          "-" +
                                          getMonthZero(calendarDate) +
                                          "-" +
                                          getNumberZero(ele)
                                      );
                                    }
                                  )
                                );
                              }}
                            >
                              <div>
                                {ele < 1
                                  ? ele +
                                    new Date(
                                      calendarDate.getFullYear(),
                                      calendarDate.getMonth(),
                                      0
                                    ).getDate() +
                                    1
                                  : ele >
                                    new Date(
                                      calendarDate.getFullYear(),
                                      calendarDate.getMonth() + 1,
                                      0
                                    ).getDate()
                                  ? ele -
                                    new Date(
                                      calendarDate.getFullYear(),
                                      calendarDate.getMonth() + 1,
                                      0
                                    ).getDate()
                                  : ele}
                              </div>

                              {viewType === "student" ? (
                                <>
                                  <S.CalendarLecture
                                    onClick={() => {
                                      setViewDate(
                                        calendarDate.getFullYear() +
                                          "-" +
                                          getMonthZero(calendarDate) +
                                          "-" +
                                          getNumberZero(ele)
                                      );
                                      const newDate = new Date(
                                        calendarDate.getFullYear() +
                                          "-" +
                                          getMonthZero(calendarDate) +
                                          "-" +
                                          getNumberZero(ele)
                                      );
                                      refetchStudentList({
                                        date: dateToInput(newDate),
                                      });
                                      setCheckList([]);
                                      setCalendarDate(newDate);
                                    }}
                                  >
                                    {monthClassData !== undefined
                                      ? monthClassData?.getLecturesByAcademyAndMonth
                                          ?.filter((lecture) => {
                                            return (
                                              lecture.date ===
                                              calendarDate.getFullYear() +
                                                "-" +
                                                getMonthZero(calendarDate) +
                                                "-" +
                                                getNumberZero(ele)
                                            );
                                          })
                                          ?.reduce((acc, cur) => {
                                            return acc + cur.students.length;
                                          }, 0) === 0 || undefined
                                        ? ""
                                        : "총 인원 : " +
                                          monthClassData?.getLecturesByAcademyAndMonth
                                            ?.filter((lecture) => {
                                              return (
                                                lecture.date ===
                                                calendarDate.getFullYear() +
                                                  "-" +
                                                  getMonthZero(calendarDate) +
                                                  "-" +
                                                  getNumberZero(ele)
                                              );
                                            })
                                            ?.reduce((acc, cur) => {
                                              return acc + cur.students.length;
                                            }, 0) +
                                          "명"
                                      : ""}
                                  </S.CalendarLecture>
                                  <S.CalendarLecture
                                    onClick={() => {
                                      setViewDate(
                                        calendarDate.getFullYear() +
                                          "-" +
                                          getMonthZero(calendarDate) +
                                          "-" +
                                          getNumberZero(ele)
                                      );
                                      const newDate = new Date(
                                        calendarDate.getFullYear() +
                                          "-" +
                                          getMonthZero(calendarDate) +
                                          "-" +
                                          getNumberZero(ele)
                                      );
                                      refetchStudentList({
                                        date: dateToInput(newDate),
                                      });
                                      setCheckList([]);
                                      setCalendarDate(newDate);
                                    }}
                                  >
                                    {monthClassData !== undefined
                                      ? monthClassData?.getLecturesByAcademyAndMonth
                                          ?.filter((lecture) => {
                                            return (
                                              lecture.date ===
                                              calendarDate.getFullYear() +
                                                "-" +
                                                getMonthZero(calendarDate) +
                                                "-" +
                                                getNumberZero(ele)
                                            );
                                          })
                                          ?.reduce((acc, cur) => {
                                            return acc + cur.students.length;
                                          }, 0) === 0 || undefined
                                        ? ""
                                        : "출석 인원 : " +
                                          monthClassData?.getLecturesByAcademyAndMonth
                                            ?.filter((lecture) => {
                                              return (
                                                lecture.date ===
                                                calendarDate.getFullYear() +
                                                  "-" +
                                                  getMonthZero(calendarDate) +
                                                  "-" +
                                                  getNumberZero(ele)
                                              );
                                            })
                                            ?.reduce((acc, cur) => {
                                              let count = cur.students.filter(
                                                (el) => {
                                                  return (
                                                    el.attendances.filter(
                                                      (ele) => {
                                                        return (
                                                          Number(
                                                            ele?.lecture?.id
                                                          ) === Number(cur?.id)
                                                        );
                                                      }
                                                    ).length !== 0
                                                  );
                                                }
                                              ).length;

                                              return acc + count;
                                            }, 0) +
                                          "명"
                                      : ""}
                                  </S.CalendarLecture>
                                </>
                              ) : monthClassData?.getLecturesByAcademyAndMonth?.filter(
                                  (lecture) => {
                                    return (
                                      lecture.date ===
                                      calendarDate.getFullYear() +
                                        "-" +
                                        getMonthZero(calendarDate) +
                                        "-" +
                                        getNumberZero(ele)
                                    );
                                  }
                                ).length > 2 ? (
                                <>
                                  {monthClassData?.getLecturesByAcademyAndMonth
                                    ?.filter((lecture) => {
                                      return (
                                        lecture.date ===
                                        calendarDate.getFullYear() +
                                          "-" +
                                          getMonthZero(calendarDate) +
                                          "-" +
                                          getNumberZero(ele)
                                      );
                                    })
                                    .map((lecture, index) => {
                                      if (index < 2) {
                                        return (
                                          <S.CalendarLecture
                                          // onClick={() => {
                                          //   setViewLecture(lecture);
                                          //   setViewDate(lecture?.date);
                                          //   setViewEndTime(lecture?.endTime);
                                          //   setViewStartTime(
                                          //     lecture?.startTime
                                          //   );
                                          //   setViewAuto(
                                          //     lecture?.lectureInfo?.autoAdd
                                          //   );
                                          //   if (
                                          //     lecture?.lectureInfo?.repeatDay?.includes(
                                          //       -1
                                          //     )
                                          //   ) {
                                          //     setViewRepeat(false);
                                          //   } else {
                                          //     setViewRepeat(true);
                                          //   }
                                          //   if (
                                          //     lecture?.lectureInfo?.repeatDay?.includes(
                                          //       -1
                                          //     )
                                          //   ) {
                                          //     setViewWeek([]);
                                          //   } else {
                                          //     setViewWeek(
                                          //       lecture?.lectureInfo?.repeatDay
                                          //     );
                                          //   }
                                          // }}
                                          >
                                            {lecture?.lectureInfo.about === ""
                                              ? ele + "일 강의"
                                              : lecture?.lectureInfo.about}
                                          </S.CalendarLecture>
                                        );
                                      } else {
                                        return <></>;
                                      }
                                    })}
                                  <S.CalendarLecture>
                                    {"+ " +
                                      (monthClassData?.getLecturesByAcademyAndMonth?.filter(
                                        (lecture) => {
                                          return (
                                            lecture.date ===
                                            calendarDate.getFullYear() +
                                              "-" +
                                              getMonthZero(calendarDate) +
                                              "-" +
                                              getNumberZero(ele)
                                          );
                                        }
                                      ).length -
                                        2)}
                                  </S.CalendarLecture>
                                </>
                              ) : (
                                <>
                                  {monthClassData?.getLecturesByAcademyAndMonth
                                    ?.filter((lecture) => {
                                      return (
                                        lecture.date ===
                                        calendarDate.getFullYear() +
                                          "-" +
                                          getMonthZero(calendarDate) +
                                          "-" +
                                          getNumberZero(ele)
                                      );
                                    })
                                    .map((lecture, index) => {
                                      return (
                                        <S.CalendarLecture
                                        // onClick={() => {
                                        //   setViewLecture(lecture);
                                        //   setViewDate(lecture?.date);
                                        //   setViewEndTime(lecture?.endTime);
                                        //   setViewStartTime(lecture?.startTime);
                                        //   setViewAuto(
                                        //     lecture?.lectureInfo?.autoAdd
                                        //   );
                                        //   if (
                                        //     lecture?.lectureInfo?.repeatDay?.includes(
                                        //       -1
                                        //     )
                                        //   ) {
                                        //     setViewRepeat(false);
                                        //   } else {
                                        //     setViewRepeat(true);
                                        //   }
                                        //   if (
                                        //     lecture?.lectureInfo?.repeatDay?.includes(
                                        //       -1
                                        //     )
                                        //   ) {
                                        //     setViewWeek([]);
                                        //   } else {
                                        //     setViewWeek(
                                        //       lecture?.lectureInfo?.repeatDay
                                        //     );
                                        //   }
                                        //   console.log(
                                        //     lecture?.lectureInfo?.repeatDay
                                        //   );
                                        // }}
                                        >
                                          {lecture?.lectureInfo.about === ""
                                            ? ele + "일 강의"
                                            : lecture?.lectureInfo.about}
                                        </S.CalendarLecture>
                                      );
                                    })}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </S.CalendarLeft>
            )}

            <S.CalendarRight>
              {viewDate === "" ? (
                <></>
              ) : viewType === "class" ? (
                <>
                  <S.CalendarRightTitle>수업 정보</S.CalendarRightTitle>
                  {myData?.me?.profile?.academies?.length > 0 ? (
                    <>
                      <S.CalendarRightDiv>지점</S.CalendarRightDiv>
                      <S.CalendarRightSelect
                        onChange={(e) => {
                          setEditAcademy(Number(e.target.value));
                        }}
                        style={{
                          borderRadius: "0.5rem",
                          border: "1px solid #DBDDE1",
                          width: "100%",
                          padding: "0.5rem 0.5rem",
                          paddingLeft: "10px",
                          fontFamily: "Spoqa Han Sans Neo",
                        }}
                      >
                        {myData?.me?.profile?.academies?.map((el) => {
                          return (
                            <option
                              value={Number(el.id)}
                              selected={
                                Number(router.query.branch) === Number(el.id)
                              }
                            >
                              {el.location}
                            </option>
                          );
                        })}
                      </S.CalendarRightSelect>
                    </>
                  ) : (
                    <></>
                  )}

                  <S.CalendarRightDiv>수업 반복</S.CalendarRightDiv>
                  <S.CalendarRightDiv>
                    <input
                      type="radio"
                      checked={!viewRepeat}
                      name="lectureType"
                      onChange={() => {
                        setViewRepeat(false);
                      }}
                    ></input>
                    <span>단일</span>
                    <input
                      type="radio"
                      name="lectureType"
                      checked={viewRepeat}
                      onChange={() => {
                        setViewRepeat(true);
                      }}
                    ></input>
                    <span>반복</span>
                  </S.CalendarRightDiv>

                  {viewRepeat ? (
                    <>
                      <S.CalendarRightDiv>자동 생성</S.CalendarRightDiv>
                      <input
                        type="checkBox"
                        style={{ width: "20px", height: "20px" }}
                        checked={viewAuto}
                        onChange={() => {
                          setViewAuto(!viewAuto);
                        }}
                      ></input>
                      <S.CalendarRightDiv>반복 요일</S.CalendarRightDiv>
                      <S.ModalRoutineDates>
                        {week.map((el, index) => {
                          return (
                            <>
                              <S.ModalRoutineDate
                                key={uuidv4()}
                                onClick={onClickViewDates(index)}
                                style={
                                  viewWeek.includes(index)
                                    ? {
                                        backgroundColor: "#333",
                                        color: "#eeeeee",
                                      }
                                    : {}
                                }
                              >
                                {el}
                              </S.ModalRoutineDate>
                            </>
                          );
                        })}
                      </S.ModalRoutineDates>
                    </>
                  ) : (
                    <></>
                  )}
                  <S.CalendarRightDiv>수업 날짜</S.CalendarRightDiv>
                  <S.CalendarRightInput
                    type="date"
                    value={viewDate}
                    onChange={(e) => {
                      setViewDate(e.target.value);
                    }}
                  ></S.CalendarRightInput>
                  <S.CalendarRightDiv>수업 시간</S.CalendarRightDiv>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "19.5rem",
                    }}
                  >
                    <S.CalendarRightInputTime
                      type="time"
                      value={viewStartTime}
                      onChange={(e) => {
                        setViewStartTime(e.target.value);
                      }}
                    ></S.CalendarRightInputTime>
                    ~
                    <S.CalendarRightInputTime
                      type="time"
                      value={viewEndTime}
                      onChange={(e) => {
                        setViewEndTime(e.target.value);
                      }}
                    ></S.CalendarRightInputTime>
                  </div>
                  <S.CalendarRightDiv>수업 정보</S.CalendarRightDiv>
                  <S.CalendarRightTextarea
                    value={viewLecture?.lectureInfo.about}
                  ></S.CalendarRightTextarea>

                  <div
                    style={{
                      marginTop: "2rem",
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <button
                      style={{
                        borderRadius: "0.5rem",
                        border: "none",
                        backgroundColor: "#EBECEF",
                        padding: "0.75rem 1.5rem",
                        color: "#333",
                        fontFamily: "Spoqa Han Sans Neo",
                        fontSize: "1rem",
                        fontStyle: "normal",
                        fontWeight: "500",
                        lineHeight: "normal",
                        marginRight: "2rem",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        setViewLecture("");
                      }}
                    >
                      취소
                    </button>
                    <button
                      style={{
                        borderRadius: "0.5rem",
                        border: "none",
                        backgroundColor: "#333",
                        padding: "0.75rem 1.5rem",
                        color: "#ffffff",
                        fontFamily: "Spoqa Han Sans Neo",
                        fontSize: "1rem",
                        fontStyle: "normal",
                        fontWeight: "500",
                        lineHeight: "normal",
                        cursor: "pointer",
                      }}
                    >
                      저장
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* 달력형 수업 수정 */}
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "flex-end",
                      alignItems: "center",
                    }}
                  >
                    <S.CalendarRightTitle style={{ width: "80%" }}>
                      {calendarDate.getFullYear() +
                        "년 " +
                        (1 + calendarDate.getMonth()) +
                        "월 " +
                        calendarDate.getDate() +
                        "일"}
                    </S.CalendarRightTitle>
                    {/* <S.ModalCancelButton
                      onClick={onClickOpenEditModal}
                      style={{
                        backgroundColor: "#ddd",
                        color: "#333",
                        margin: "1rem",
                      }}
                    >
                      수정
                    </S.ModalCancelButton> */}
                  </div>
                  <table style={{ width: "35rem" }}>
                    <thead>
                      <tr>
                        {/* <th style={{ width: "20px", padding: "3px" }}>
                          <input
                            type="checkbox"
                            style={{ width: "20px", height: "20px" }}
                            checked={
                              checkList.length !== 0 &&
                              studentArray.length === checkList.length
                            }
                            onChange={onChangeAllSelect}
                          ></input>
                        </th> */}
                        <th>원생명</th>
                        <th>시작 시간</th>
                        <th>종료 시간</th>
                        <th>강의 정보</th>
                        <th>수정</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentArray?.map((el) => {
                        return (
                          <tr key={el.id || uuidv4()}>
                            {/* <td style={{ width: "20px", padding: "3px" }}>
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  onChangeEach(
                                    e,
                                    el.lecture.id,
                                    el.student.id,
                                    el.lecture.lectureInfo.id
                                  )
                                }
                                style={{ width: "20px", height: "20px" }}
                                checked={checkList.some((ele) => {
                                  return (
                                    Number(ele.studentId) ===
                                      Number(el.student.id) &&
                                    Number(ele.lectureId) ===
                                      Number(el.lecture.id)
                                  );
                                })}
                              ></input>
                            </td> */}
                            <td>{el.student.korName}</td>
                            <td
                              style={
                                date.getDate() !== calendarDate.getDate() ||
                                checkDate.getHours() * 60 +
                                  checkDate.getMinutes() -
                                  Number(el.lecture.startTime.slice(0, 2)) *
                                    60 -
                                  Number(el.lecture.startTime.slice(3, 5)) <
                                  0 ||
                                el?.attendanceStatus !== null
                                  ? {}
                                  : { color: "tomato" }
                              }
                            >
                              {timeToHour(el.lecture.startTime)}
                            </td>
                            <td>{timeToHour(el.lecture.endTime)}</td>
                            <td
                            // onMouseEnter={() => {
                            //   setIsViewTitle(true);
                            //   setViewTitle(el.lecture.lectureInfo.about);
                            // }}
                            // onMouseLeave={() => {
                            //   setIsViewTitle(false);
                            // }}
                            >
                              {el.lecture.lectureMemo === ""
                                ? shortWord(el.lecture.lectureInfo.about)
                                : shortWord(el.lecture.lectureMemo)}
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  setCheckList([
                                    {
                                      studentId: el.student.id,
                                      lectureId: el.lecture.id,
                                      lectureInfoId: el.lecture.lectureInfo.id,
                                    },
                                  ]);
                                  if (monthClassData !== undefined) {
                                    setIsAll(false);
                                    setTodayDate(new Date());
                                    setIsEdit(true);
                                    const setting =
                                      monthClassData?.getLecturesByAcademyAndMonth
                                        ?.filter((lecture) => {
                                          return (
                                            lecture.date ===
                                            calendarDate.getFullYear() +
                                              "-" +
                                              getMonthZero(calendarDate) +
                                              "-" +
                                              getDateZero(calendarDate)
                                          );
                                        })
                                        .filter((ele) => {
                                          return (
                                            Number(ele.lectureInfo.id) ===
                                            Number(el.lecture.lectureInfo.id)
                                          );
                                        })[0];
                                    setIsEditAuto(setting?.lectureInfo.autoAdd);
                                    setIsEditRepeat(
                                      !setting?.lectureInfo.repeatDay.includes(
                                        -1
                                      )
                                    );
                                    setEditStartTime(setting?.startTime);
                                    setEditEndTime(setting?.endTime);
                                    if (
                                      !setting?.lectureInfo.repeatDay.includes(
                                        -1
                                      )
                                    ) {
                                      setEditRepeatWeek(
                                        setting?.lectureInfo.repeatDay
                                      );
                                      setEditRepeatCount(
                                        setting?.lectureInfo.repeatWeeks
                                      );
                                    } else {
                                      setEditRepeatCount(1);
                                      setEditRepeatWeek([]);
                                    }
                                  }
                                }}
                              >
                                수정
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              )}
            </S.CalendarRight>
          </S.CalendarWrapper>
          {/* {isViewMore ? (
            <div
              style={{
                backgroundColor: "#ffffff",
                width: "11.125rem",
                borderRadius: "0.5rem",
                position: "absolute",
                top: 26.2 + viewMorePosition[0] * 10 + "rem",
                left: 10 + viewMorePosition[1] * 11.125 + "rem",
                boxShadow: "0px 0px 16px 0px rgba(129, 133, 140, 0.30)",
                padding: "1rem 0 1rem 1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignContent: "flex-start",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginRight: "1rem",
                  }}
                >
                  <CloseOutlined
                    onClick={() => {
                      setIsViewMore(false);
                    }}
                  />
                </div>
                {viewModalList.map((el, index) => {
                  if (index === 0) {
                    return (
                      <>
                        <div
                          style={{
                            fontFamily: "Spoqa Han Sans Neo",
                            fontSize: "0.875rem",
                            fontStyle: "normal",
                            fontWeight: 400,
                            marginBottom: "0.3rem",
                          }}
                        >
                          {Number(el.date[8]) * 10 + Number(el.date[9])}
                        </div>

                        <S.CalendarLecture
                          onClick={() => {
                            setViewLecture(el);
                            setViewDate(el?.date);
                            setViewEndTime(el?.endTime);
                            setViewStartTime(el?.startTime);
                            setIsViewMore(false);
                          }}
                        >
                          {el.lectureInfo.about === ""
                            ? Number(el.date[8]) * 10 +
                              Number(el.date[9]) +
                              "일 강의"
                            : el.lectureInfo.about}
                        </S.CalendarLecture>
                      </>
                    );
                  }
                  return (
                    <S.CalendarLecture
                      onClick={() => {
                        setViewLecture(el);
                        setViewDate(el?.date);
                        setViewEndTime(el?.endTime);
                        setViewStartTime(el?.startTime);
                        setIsViewMore(false);
                      }}
                    >
                      {el.lectureInfo.about === ""
                        ? Number(el.date[8]) * 10 +
                          Number(el.date[9]) +
                          "일 강의"
                        : el.lectureInfo.about}
                    </S.CalendarLecture>
                  );
                })}
              </div>
            </div>
          ) : (
            <></>
          )} */}
        </>
      )}

      {/*  모달 시작 */}
      {classToggle ? (
        <Modal
          closable={false}
          open={classToggle}
          width={"55vw"}
          height={"50vh"}
          onCancel={() => {
            setClassToggle(false);
            setAddList([]);
            setSelectDates([]);
            setStudentPage(0);
            setIsAuto(false);
            setAddRepeatInput([
              {
                week: [],
                startTime: dateToClock(date),
                endTime: dateToClockOneHour(date),
                isAuto: false,
                isRepeat: "once",
                repeatsNum: 0,
                startDate: dateToInput(date),
                teacherId: userData?.allUsers
                  .filter((el) => el.userCategory === "선생님")
                  .filter((el) => {
                    return (
                      Number(el.profile.academy.id) ===
                      Number(router.query.branch)
                    );
                  })[0].id,
                about: "",
              },
            ]);
          }}
          footer={null}
        >
          <S.ClassTitle>{"수업 추가"}</S.ClassTitle>
          <S.ModalClassAddWrapper>
            <div style={{ width: "50%" }}>
              <div>
                <div
                  style={{
                    marginRight: "5px",
                    fontSize: "0.875rem",
                    fontStyle: "normal",
                    fontWeight: "500",
                    marginBottom: "0.75rem",
                  }}
                >
                  원생 목록
                </div>
                <S.InputInput
                  onChange={(e) => {
                    setSearchStudents(e.target.value);
                  }}
                  style={{
                    borderRadius: "0.5rem",
                    border: "1px solid #DBDDE1",
                    padding: "0.81rem 1.25rem",
                    width: "80%",
                  }}
                  placeholder="원번 혹은 이름을 입력하세요."
                ></S.InputInput>
              </div>{" "}
              {addList.length === 0 ? (
                <>
                  <S.ModalTable
                    style={{
                      height: "40rem",
                      overflow: "scroll",
                      // overflow: "hidden",
                    }}
                  >
                    <S.ModalTag style={{ position: "sticky" }}>
                      <S.ModalHeadLeft
                        style={{
                          width: "30%",
                          color: "#000",
                          background: "#F7F8FA",
                          height: "2.75rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        원번
                      </S.ModalHeadLeft>
                      <S.ModalHeadMiddle
                        style={{
                          width: "30%",
                          color: "#000",
                          background: "#F7F8FA",
                          height: "2.75rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        이름
                      </S.ModalHeadMiddle>
                      <S.ModalHeadRight
                        style={{
                          width: "25%",
                          color: "#000",
                          background: "#F7F8FA",
                          height: "2.75rem",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        추가
                      </S.ModalHeadRight>
                    </S.ModalTag>
                    {/* 여기다가 필터 추가 lecture 정보로 */}
                    {allStudent?.map((el) => {
                      return (
                        <S.ModalTag key={uuidv4()} style={{ margin: 0 }}>
                          <S.ModalHeadLeft
                            style={{
                              width: "30%",
                              height: "2.75rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {el?.origin}
                          </S.ModalHeadLeft>
                          <S.ModalHeadMiddle
                            style={{
                              width: "30%",
                              height: "2.75rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {el?.korName}
                          </S.ModalHeadMiddle>
                          <S.ModalHeadRight
                            style={{
                              width: "25%",
                              height: "2.75rem",
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            {/* <input
                        style={{ width: "20px", height: "20px" }}
                        type="checkbox"
                        onChange={onClickStudents(el?.id)}
                        checked={addList.includes(Number(el?.id))}
                      ></input> */}
                            <button
                              onClick={onClickStudents(el?.id, el?.korName)}
                            >
                              선택
                            </button>
                          </S.ModalHeadRight>
                        </S.ModalTag>
                      );
                    })}
                  </S.ModalTable>
                  <S.PageContainer
                    style={{ marginBottom: "20px", justifyContent: "center" }}
                  >
                    {Array.from({ length: studentMaxPage }, (_, i) => (
                      <S.PageBox
                        key={i}
                        style={
                          i === studentPage
                            ? { backgroundColor: "#333", color: "#eeeeee" }
                            : {}
                        }
                        onClick={onClickStudentPage(i)}
                      >
                        {i + 1}
                      </S.PageBox>
                    ))}
                  </S.PageContainer>
                </>
              ) : (
                <>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <S.EditModalTagTitle>
                      {addListName + " 수업 목록"}
                    </S.EditModalTagTitle>
                    <button
                      onClick={() => {
                        setAddList([]);
                      }}
                    >
                      취소
                    </button>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>날짜</th>
                        <th>반복 요일</th>
                        <th>수업 시간</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lectureInfoData?.studentLectures
                        ?.filter((el, i, callback) => {
                          return (
                            i ===
                            callback.findIndex(
                              (t) =>
                                t.lecture.lectureInfo.id ===
                                el.lecture.lectureInfo.id
                            )
                          );
                        })
                        ?.map((el) => {
                          return (
                            <tr>
                              <td>
                                {el?.lecture?.lectureInfo?.repeatDay.includes(
                                  -1
                                )
                                  ? el?.lecture?.date
                                  : el?.lecture?.lectureInfo?.autoAdd
                                  ? el?.lecture?.date + "~"
                                  : el?.lecture?.date +
                                    "~" +
                                    lastDate(
                                      el?.lecture?.date,
                                      el?.lecture?.lectureInfo?.repeatWeeks,
                                      el?.lecture?.lectureInfo?.repeatDay?.[
                                        el?.lecture?.lectureInfo?.repeatDay
                                          ?.length - 1
                                      ]
                                    )}
                              </td>
                              <td>
                                {el?.lecture?.lectureInfo?.repeatDay.includes(
                                  -1
                                )
                                  ? "없음"
                                  : el?.lecture?.lectureInfo?.repeatDay
                                      ?.sort((a, b) => {
                                        return a - b;
                                      })
                                      .map((ele) => {
                                        return week[ele];
                                      })}
                              </td>
                              <td>
                                {el?.lecture?.startTime.slice(0, 5) +
                                  "-" +
                                  el?.lecture?.endTime.slice(0, 5)}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </>
              )}
            </div>
            <S.ModalTable style={{ width: "48%", display: "block" }}>
              <div
                style={{
                  marginBottom: "1rem",
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  style={{ marginTop: "1rem" }}
                  onClick={() => {
                    const newList = [...addRepeatInput];
                    newList.push({
                      week: [],
                      startTime: dateToClock(date),
                      endTime: dateToClockOneHour(date),
                      isAuto: false,
                      isRepeat: "once",
                      repeatsNum: 0,
                      startDate: dateToInput(date),
                      teacherId: userData?.allUsers
                        .filter((el) => el.userCategory === "선생님")
                        .filter((el) => {
                          return (
                            Number(el.profile.academy.id) ===
                            Number(router.query.branch)
                          );
                        })[0].id,
                      about: "",
                    });
                    setAddRepeatInput(newList);
                    setAddRepeatCount(addRepeatCount + 1);
                  }}
                >
                  +
                </button>
              </div>
              {addRepeatInput.map((_, ind) => {
                return (
                  <>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button onClick={onClickAddRepeatDelete(ind)}>X</button>
                    </div>

                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#000",
                        marginBottom: "0.75rem",
                      }}
                    >
                      담당 선생님
                    </div>
                    <select
                      onChange={onChangeRepeatTeacherId(ind)}
                      style={{
                        borderRadius: "0.5rem",
                        border: "1px solid #DBDDE1",
                        width: "100%",
                        padding: "0.81rem 1.5rem",
                      }}
                      // value={teacherId}
                    >
                      {userData?.allUsers
                        .filter((el) => el.userCategory === "선생님")
                        .filter((el) => {
                          return (
                            Number(el.profile.academy.id) ===
                            Number(router.query.branch)
                          );
                        })
                        .filter((el) => {
                          console.log(el);
                          return true;
                        })
                        .map((el) => {
                          return (
                            <option
                              key={uuidv4()}
                              value={el.profile.id}
                              selected={
                                Number(addRepeatInput[ind].teacherId) ===
                                Number(el.profile.id)
                              }
                            >
                              {el.profile.korName}
                            </option>
                          );
                        })}
                    </select>
                    <div style={{ marginTop: "1.87rem" }}>수업 날짜</div>
                    <S.InputInput
                      type="date"
                      // defaultValue={dateToInput(date)}
                      value={addRepeatInput[ind].startDate}
                      style={{
                        width: "88%",
                        height: "2.75rem",
                        padding: "0 1.5rem",
                      }}
                      onChange={onChangeRepeatDate(ind)}
                    ></S.InputInput>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#000",
                        marginBottom: "0.75rem",
                        marginTop: "1.25rem",
                      }}
                    >
                      수업 방식
                    </div>

                    <S.ModalRadioBox>
                      <input
                        type="radio"
                        name={"type" + ind}
                        checked={addRepeatInput[ind].isRepeat === "once"}
                        value={"once"}
                        onClick={onChangeRepeatIsRepeat(ind, "once")}
                        style={{ width: "1.25rem", height: "1.25rem" }}
                      ></input>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          paddingLeft: "0.5rem",
                        }}
                      >
                        단일
                      </div>
                      <input
                        type="radio"
                        name={"type" + ind}
                        value={"routine"}
                        checked={addRepeatInput[ind].isRepeat !== "once"}
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          marginLeft: "1.5rem",
                        }}
                        onClick={onChangeRepeatIsRepeat(ind, "routine")}
                      ></input>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          paddingLeft: "0.5rem",
                        }}
                      >
                        반복
                      </div>
                      <input
                        type="radio"
                        name={"type" + ind}
                        value={"routine"}
                        checked={addRepeatInput[ind].isRepeat === "count"}
                        style={{
                          width: "1.25rem",
                          height: "1.25rem",
                          marginLeft: "1.5rem",
                        }}
                        onClick={onChangeRepeatIsRepeat(ind, "count")}
                      ></input>
                      <div
                        style={{
                          fontSize: "0.875rem",
                          paddingLeft: "0.5rem",
                        }}
                      >
                        횟수
                      </div>
                    </S.ModalRadioBox>
                    {addRepeatInput[ind].isRepeat === "once" ? (
                      <></>
                    ) : (
                      <>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "1.87rem",
                          }}
                        >
                          <div
                            style={{
                              width: "70%",
                              border: "1px solid #DBDDE1",
                              borderRadius: "0.5rem",
                              backgroundColor: addRepeatInput[ind].isAuto
                                ? "#dddddd"
                                : "",
                            }}
                          >
                            <input
                              type="number"
                              onChange={onChangeRepeatCount(ind)}
                              style={{
                                paddingLeft: "5%",
                                paddingTop: "0.81rem",
                                paddingBottom: "0.81rem",
                                border: "0",
                                width: "85%",
                              }}
                              value={addRepeatInput[ind].repeatsNum}
                              disabled={addRepeatInput[ind].isAuto}
                            ></input>
                            <span>
                              {addRepeatInput[ind].isRepeat === "count"
                                ? "회"
                                : "주"}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              marginLeft: "20px",
                            }}
                          >
                            <span>자동 생성</span>
                            <input
                              type="checkbox"
                              checked={addRepeatInput[ind].isAuto}
                              style={{ width: "20px", height: "20px" }}
                              onChange={onChangeRepeatIsAuto(ind)}
                              disabled={
                                addRepeatInput[ind].isRepeat === "count"
                              }
                            ></input>
                          </div>
                        </div>
                        <S.ModalRoutineInput>
                          <S.ModalRoutineDates>
                            {week.map((el, index) => {
                              return (
                                <S.ModalRoutineDate
                                  key={uuidv4()}
                                  onClick={onClickRepeatDates(ind, index)}
                                  style={
                                    addRepeatInput[ind].week.includes(index)
                                      ? {
                                          backgroundColor: "#333",
                                          color: "#eeeeee",
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
                      </>
                    )}

                    <div
                      style={{
                        marginTop: "1.25rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      수업 시간
                    </div>
                    <S.TimeBox style={{ width: "100%" }}>
                      <input
                        type="time"
                        style={{
                          width: "40%",
                          fontSize: "17px",
                          border: "1px solid #dddddd",
                          paddingLeft: "12px",
                          borderRadius: "5px",
                          height: "2.75rem",
                        }}
                        // defaultValue={dateToClock(date)}
                        value={addRepeatInput[ind].startTime}
                        onChange={onChangeRepeatStartTime(ind)}
                      ></input>
                      ~
                      <input
                        type="time"
                        style={{
                          width: "40%",
                          fontSize: "17px",
                          border: "1px solid #dddddd",
                          paddingLeft: "12px",
                          borderRadius: "5px",
                          height: "2.75rem",
                        }}
                        // defaultValue={dateToClockOneHour(date)}
                        value={addRepeatInput[ind].endTime}
                        onChange={onChangeRepeatEndTime(ind)}
                      ></input>
                    </S.TimeBox>
                    <S.ModalInputBox style={{ display: "block" }}>
                      <div>
                        <div
                          style={{
                            marginTop: "1.25rem",
                            marginBottom: "0.75rem",
                          }}
                        >
                          메모
                        </div>
                      </div>
                      <S.ModalTextArea
                        onChange={onChangeRepeatAbout(ind)}
                        style={{
                          width: "100%",
                          borderRadius: "0.5rem",
                          border: "1px solid #DBDDE1",
                        }}
                        value={addRepeatInput[ind].about}
                      ></S.ModalTextArea>
                    </S.ModalInputBox>
                  </>
                );
              })}

              {/* {addClassType === "once" ? (
                <>
                  <div
                    style={{ marginTop: "1.25rem", marginBottom: "0.75rem" }}
                  >
                    수업 시간
                  </div>
                  <S.TimeBox style={{ width: "100%" }}>
                    <input
                      type="time"
                      style={{
                        width: "40%",
                        fontSize: "17px",
                        border: "1px solid #dddddd",
                        paddingLeft: "12px",
                        borderRadius: "5px",
                        height: "2.75rem",
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
                        width: "40%",
                        fontSize: "17px",
                        border: "1px solid #dddddd",
                        paddingLeft: "12px",
                        borderRadius: "5px",
                        height: "2.75rem",
                      }}
                      defaultValue={dateToClockOneHour(date)}
                      onChange={(event) => {
                        setAddClassEnd(event.target.value);
                      }}
                    ></input>
                  </S.TimeBox>
                </>
              ) : (
                <>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "1.87rem",
                    }}
                  >
                    <div
                      style={{
                        width: "70%",
                        border: "1px solid #DBDDE1",
                        borderRadius: "0.5rem",
                        backgroundColor: isAuto ? "#dddddd" : "",
                      }}
                    >
                      <input
                        type="number"
                        onChange={onChangeRoutineCount}
                        style={{
                          paddingLeft: "5%",
                          paddingTop: "0.81rem",
                          paddingBottom: "0.81rem",
                          border: "0",
                          width: "85%",
                        }}
                        disabled={isAuto}
                      ></input>
                      <span>주</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "20px",
                      }}
                    >
                      <span>자동 생성</span>
                      <input
                        type="checkbox"
                        checked={isAuto}
                        onChange={() => {
                          setIsAuto((prev) => {
                            return !prev;
                          });
                        }}
                      ></input>
                    </div>
                  </div>
                </>
              )} */}
            </S.ModalTable>
          </S.ModalClassAddWrapper>
          <S.ModalButtonBox style={{ width: "100%", justifyContent: "center" }}>
            <S.ModalCancelButton
              onClick={onClickCancel}
              style={{ background: "#EBECEF", color: "#000" }}
            >
              취소
            </S.ModalCancelButton>
            <S.ModalOkButton onClick={onClickOk}>저장</S.ModalOkButton>
          </S.ModalButtonBox>
        </Modal>
      ) : (
        <></>
      )}
      {isMakeUp && (
        <Modal
          open={isMakeUp}
          footer={null}
          closable={false}
          onCancel={() => {
            setIsMakeUp(false);
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>
              담당 선생님
              <select
                onChange={(event) => {
                  setMakeUpTeacherId(event.target.value);
                }}
                value={makeUpTeacherId}
              >
                {userData?.allUsers
                  .filter((el) => el.userCategory === "선생님")
                  .filter((el) => {
                    return (
                      Number(el.profile.academy.id) ===
                      Number(router.query.branch)
                    );
                  })
                  .map((el) => {
                    return (
                      <option key={uuidv4()} value={el.profile.id}>
                        {el.profile.korName}
                      </option>
                    );
                  })}
              </select>
            </div>
            <div>
              수정 날짜
              <input
                type="date"
                onChange={(e) => {
                  setMakeUpDate(e.target.value);
                }}
                value={makeUpDate}
              ></input>
            </div>
            <div>
              수업 시간
              <input
                type="time"
                onChange={(e) => {
                  setMakeUpStart(e.target.value);
                }}
                value={makeUpStart}
              ></input>
              -
              <input
                type="time"
                onChange={(e) => {
                  setMakeUpEnd(e.target.value);
                }}
                value={makeUpEnd}
              ></input>
            </div>
            <div>
              보강 설명
              <input
                type="text"
                onChange={(e) => {
                  setMakeUpInfo(e.target.value);
                }}
                value={makeUpInfo}
              ></input>
            </div>
            <div>
              <button
                onClick={() => {
                  setIsMakeUp(false);
                }}
              >
                취소
              </button>
              <button onClick={onClickMakeUpClass}>보강</button>
            </div>
          </div>
        </Modal>
      )}
      {studentToggle ? (
        <Modal
          closable={false}
          open={studentToggle}
          footer={null}
          width={"55vw"}
          onCancel={() => {
            setStudentToggle(false);
            setAddList([]);
            setAddLectureId("");
            setSearchLecture(dateToInput(date));
            setSearchStudents("");
            setStudentPage(0);
          }}
        >
          <S.ModalTitle style={{ marginBottom: "2rem" }}>
            수업 관리
          </S.ModalTitle>
          <div style={{ marginBottom: "10px" }}>
            <S.InputInput
              type="date"
              defaultValue={dateToInput(date)}
              onChange={(e) => {
                setSearchLecture(e.target.value);
              }}
              style={{ padding: "0.81rem 1.5rem" }}
            ></S.InputInput>
          </div>
          <S.ModalTable style={{ width: "100%", marginTop: "0" }}>
            {searchLecture !== "" ? (
              <S.ModalTag
                style={{
                  width: "100%",
                  color: "#000",
                  borderRadius: "0.25rem 0.25rem 0rem 0rem",
                  background: "#F7F8FA",
                }}
              >
                <S.ModalHeadLeft
                  style={{
                    width: "10%",
                    height: "2.75rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  강의번호
                </S.ModalHeadLeft>
                <S.ModalHeadMiddle
                  style={{
                    width: "20%",
                    height: "2.75rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  날짜
                </S.ModalHeadMiddle>
                <S.ModalHeadMiddle
                  style={{
                    width: "20%",
                    height: "2.75rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  강의시간
                </S.ModalHeadMiddle>
                <S.ModalHeadMiddle
                  style={{
                    width: "40%",
                    height: "2.75rem",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  강의 설명
                </S.ModalHeadMiddle>
                <S.ModalHeadRight
                  style={{
                    width: "10%",
                    height: "2.75rem",
                    display: "flex",
                    alignItems: "center",
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
                  <S.ModalTag key={uuidv4()} style={{ margin: "0" }}>
                    <S.ModalHeadLeft
                      style={{
                        width: "10%",
                        height: "2.75rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {el.id}
                    </S.ModalHeadLeft>
                    <S.ModalHeadMiddle
                      style={{
                        width: "20%",
                        height: "2.75rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {el.date}
                    </S.ModalHeadMiddle>

                    <S.ModalHeadMiddle
                      style={{
                        width: "20%",
                        height: "2.75rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {el.startTime.slice(0, 5) + "~" + el.endTime.slice(0, 5)}
                    </S.ModalHeadMiddle>
                    <S.ModalHeadMiddle
                      style={{
                        width: "40%",
                        height: "2.75rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {longWord(el.lectureInfo.about)}
                    </S.ModalHeadMiddle>
                    <S.ModalHeadRight
                      style={{
                        width: "10%",
                        height: "2.75rem",
                        display: "flex",
                        alignItems: "center",
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
          <div style={{ marginBottom: "10px", marginTop: "20px" }}>
            <S.InputInput
              onChange={(e) => {
                setSearchStudents(e.target.value);
              }}
              style={{
                borderRadius: "0.5rem",
                border: "1px solid #DBDDE1",
                padding: "0.81rem 1.25rem",
              }}
              placeholder="원번 혹은 이름을 입력하세요."
            ></S.InputInput>
          </div>
          <S.ModalTable>
            <S.ModalTag
              style={{
                margin: "0",
                color: "#000",
                borderRadius: "0.25rem 0.25rem 0rem 0rem",
                background: "#F7F8FA",
              }}
            >
              <S.ModalHeadLeft
                style={{
                  width: "35%",
                  height: "2.75rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                원번
              </S.ModalHeadLeft>
              <S.ModalHeadMiddle
                style={{
                  width: "35%",
                  height: "2.75rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                이름
              </S.ModalHeadMiddle>
              <S.ModalHeadRight
                style={{
                  width: "30%",
                  height: "2.75rem",
                  display: "flex",
                  alignItems: "center",
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
                  <S.ModalTag key={uuidv4()} style={{ margin: "0" }}>
                    <S.ModalHeadLeft
                      style={{
                        width: "35%",
                        height: "2.75rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {el?.origin}
                    </S.ModalHeadLeft>
                    <S.ModalHeadMiddle
                      style={{
                        width: "35%",
                        height: "2.75rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {el?.korName}
                    </S.ModalHeadMiddle>
                    <S.ModalHeadRight
                      style={{
                        width: "30%",
                        height: "2.75rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <input
                        style={{ width: "20px", height: "20px" }}
                        type="checkbox"
                        onChange={onClickStudents(el?.id, el?.korName)}
                        checked={addList.includes(Number(el?.id))}
                      ></input>
                    </S.ModalHeadRight>
                  </S.ModalTag>
                );
              })}
          </S.ModalTable>
          <S.PageContainer
            style={{ marginBottom: "20px", justifyContent: "center" }}
          >
            {Array.from({ length: studentMaxPage }, (_, i) => (
              <S.PageBox
                key={i}
                style={
                  i === studentPage
                    ? { backgroundColor: "#333", color: "#eeeeee" }
                    : {}
                }
                onClick={onClickStudentPage(i)}
              >
                {i + 1}
              </S.PageBox>
            ))}
          </S.PageContainer>
          <div
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <S.ModalCancelButton
              onClick={() => {
                setStudentToggle(false);
                setAddList([]);
                setAddLectureId("");
                setSearchLecture(dateToInput(date));
                setSearchStudents("");
                setStudentPage(0);
              }}
              style={{ background: "#EBECEF", color: "#000" }}
            >
              취소
            </S.ModalCancelButton>
            <S.ModalOkButton onClick={onClickAddStudents}>추가</S.ModalOkButton>
          </div>
        </Modal>
      ) : (
        <></>
      )}
      {isAlarm &&
        (lateList?.length > 0 ||
          startList?.length > 0 ||
          endList?.length > 0) && (
          <Modal
            open={isAlarm}
            footer={null}
            closeIcon={null}
            width={"40%"}
            onCancel={() => {
              setIsAlarm(false);
            }}
          >
            <S.AlarmDiv style={{ fontSize: "25px" }}>
              등/하원 확인 명단
            </S.AlarmDiv>
            {startList?.length > 0 ? (
              <>
                <S.AlarmDiv style={{ fontSize: "25px" }}>
                  {"등원 예정 시간 : " + alarmTime}
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
                      {startList.map((student, index) => (
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
              </>
            ) : (
              <></>
            )}
            {lateList?.length > 0 || endList?.length > 0 ? (
              <>
                <S.AlarmDiv style={{ fontSize: "25px", marginTop: "30px" }}>
                  {"하원 예정 시간 : " + alarmTime}
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
                      {endList.map((student, index) => (
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
                      {lateList
                        ?.filter((el) => {
                          return (
                            endList?.findIndex((ele) => {
                              return Number(ele?.id) === Number(el?.id);
                            }) < 0
                          );
                        })
                        ?.map((student, index) => (
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
              </>
            ) : (
              <></>
            )}
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
          width={"95rem"}
          onCancel={() => {
            setIsBook(false);
            refetchBook({ minBl: 0, maxBl: 0, arQn: null });
            setSelectBookData([]);
            setSelectBooks([]);
            setReserveType("recommend");
            setBarcode("");
          }}
        >
          <div style={{ overflowX: "scroll" }}>
            <S.ModalTitle
              style={{ fontWeight: 600, fontFamily: "Spoqa Han Sans Neo" }}
            >
              {selectChild.origin +
                " - " +
                selectChild.korName +
                " 도서 예약 (" +
                reservationBookData?.studentReservedBooks.length +
                "권 예약 중)"}
            </S.ModalTitle>

            <S.ModalButtonBox>
              <S.ModalCancelButton
                onClick={() => {
                  setIsBook(false);
                  refetchBook({ minBl: 0, maxBl: 0, arQn: null });
                  setBookSearchWord("");
                  setReserveType("recommend");
                  setBarcode("");
                }}
              >
                취소
              </S.ModalCancelButton>
              <S.ModalReturnButton onClick={onClickTotalReturn}>
                일괄 반납
              </S.ModalReturnButton>
            </S.ModalButtonBox>
            <table style={{ width: "92rem" }}>
              {reservationBookData?.studentReservedBooks.length === 0 ? (
                <></>
              ) : (
                <thead style={{ height: "2.75rem" }}>
                  <tr>
                    <th style={{ width: "2rem" }}>No.</th>
                    <th style={{ width: "6rem" }}>박스 넘버</th>
                    <th style={{ width: "6rem" }}>PLBN</th>
                    <th style={{ width: "13rem" }}>도서 제목</th>
                    <th style={{ width: "9rem" }}>저자</th>
                    <th style={{ width: "6rem" }}>AR QUIZ No.</th>
                    <th style={{ width: "1.8rem" }}>F/NF</th>
                    <th style={{ width: "1.8rem" }}>AR</th>
                    <th style={{ width: "2.5rem" }}>WC</th>
                    <th style={{ width: "2rem" }}>IL</th>
                    <th style={{ width: "2.5rem" }}>Lexile</th>
                    <th style={{ width: "3rem" }}>반납</th>
                  </tr>
                </thead>
              )}
              <tbody>
                {reservationBookData?.studentReservedBooks?.map((el, index) => {
                  return (
                    <tr style={{ height: "2.75rem" }}>
                      <td>{index + 1}</td>
                      <td>{el.boxNumber}</td>
                      <td>{el.plbn}</td>
                      {el.booktitle.length > 25 ? (
                        <td
                          onMouseEnter={() => {
                            setIsViewTitle(true);
                            setViewTitle(el?.booktitle);
                          }}
                          onMouseLeave={() => {
                            setIsViewTitle(false);
                          }}
                        >
                          {longWord(el.booktitle)}
                        </td>
                      ) : (
                        <td>{longWord(el.booktitle)}</td>
                      )}
                      {el.book.authorAr.length > 15 ? (
                        <td
                          onMouseEnter={() => {
                            setIsViewTitle(true);
                            setViewTitle(el.book.authorAr);
                          }}
                          onMouseLeave={() => {
                            setIsViewTitle(false);
                          }}
                        >
                          {longAuthor(el.book.authorAr)}
                        </td>
                      ) : (
                        <td>{longAuthor(el.book.authorAr)}</td>
                      )}
                      {/* <td>{longAuthor(el.book.authorAr)}</td> */}
                      <td>{"#" + el.book.arQuiz}</td>
                      <td>{el.book.fnfStatus}</td>
                      <td>{arFrame(el.book.bl)}</td>
                      <td>{el.book.wcAr}</td>
                      <td>{el.book.ilStatus.slice(3, 5)}</td>
                      <td>
                        {(el.book.lexileLex > 0
                          ? el.book.lexileLex + "L"
                          : "B" + -1 * el.book.lexileLex + "L") ||
                          el.book.lexileAr}
                      </td>

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
            <S.ModalTag>
              <S.ModalTagHover
                onClick={() => {
                  setReserveType("recommend");
                  refetchBook({ arQn: null });
                }}
                style={{
                  backgroundColor:
                    reserveType === "recommend" ? "#FABF8F" : "#dddddd",
                  color: reserveType === "recommend" ? "#111111" : "#111111",
                  padding: "1rem",
                  borderRadius: "10px",
                  // textDecoration: reserveType === "recommend" ? "underline" : "",
                }}
              >
                추천 도서
              </S.ModalTagHover>
              <S.ModalTagHover
                onClick={() => {
                  setReserveType("search");
                  refetchBook({ arQn: null });
                }}
                style={{
                  backgroundColor:
                    reserveType === "search" ? "#FABF8F" : "#dddddd",
                  color: reserveType === "search" ? "#111111" : "#111111",
                  padding: "1rem",
                  borderRadius: "10px",
                }}
              >
                도서 검색
              </S.ModalTagHover>
              <S.ModalTagHover
                onClick={() => {
                  setReserveType("barcode");
                }}
                style={{
                  backgroundColor:
                    reserveType === "barcode" ? "#FABF8F" : "#dddddd",
                  color: reserveType === "barcode" ? "#111111" : "#111111",
                  padding: "1rem",
                  borderRadius: "10px",
                }}
              >
                바코드
              </S.ModalTagHover>
            </S.ModalTag>
            {reserveType === "search" && (
              <>
                <S.ModalWrapper
                  style={{
                    borderRadius: "0.25rem 0.25rem 0rem 0rem",
                    background: "#F7F8FA",
                    padding: "1.5rem",
                    borderRadius: "9px",
                    marginTop: "1.25rem",
                  }}
                >
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
                          display: "flex",
                          color: "#000",
                          fontSize: "15px",
                          fontWeight: "bold",
                          flexDirection: "column",
                          marginRight: "1.87rem",
                        }}
                      >
                        <div>AR 점수</div>
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
                                onClickSearchBooks();
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
                                onClickSearchBooks();
                              }
                            }}
                          ></S.InputInput>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          color: "#000",
                          fontSize: "15px",
                          fontWeight: "bold",
                          flexDirection: "column",
                          marginRight: "1.87rem",
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
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                onClickSearchBooks();
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
                              setMaxWc(
                                Number(
                                  e.target.value === ""
                                    ? 100000000
                                    : e.target.value
                                )
                              );
                            }}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                onClickSearchBooks();
                              }
                            }}
                          ></S.InputInput>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          color: "#000",
                          fontSize: "15px",
                          fontWeight: "bold",
                          flexDirection: "column",
                          float: "left",
                          height: "100px",
                          marginRight: "1.87rem",
                        }}
                      >
                        <div>Lexile 점수</div>
                        <div>
                          <div>
                            최소
                            <S.InputInput
                              type="number"
                              style={{ marginLeft: "10px", marginTop: "10px" }}
                              onChange={(e) => {
                                setMinLex(Number(e.target.value));
                              }}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  onClickSearchBooks();
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
                                setMaxLex(Number(e.target.value));
                              }}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  onClickSearchBooks();
                                }
                              }}
                            ></S.InputInput>
                          </div>
                        </div>
                      </div>
                      <S.ModalAddButton
                        onClick={onClickSearchBooks}
                        style={{
                          borderRadius: "0.5rem",
                          background: "#333",
                          height: "2.75rem",
                        }}
                      >
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
                      width: "92rem",
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
                {isLoading ? <Spin></Spin> : <></>}
                {isLoading ? (
                  <></>
                ) : (
                  <>
                    <table style={{ width: "92rem" }}>
                      {bookData?.getBooksByBl.length === 0 ||
                      bookData === undefined ? (
                        <></>
                      ) : (
                        <thead style={{ height: "2.75rem" }}>
                          <tr>
                            <th style={{ width: "6%" }}>No.</th>
                            <th style={{ width: "10%" }}>박스 넘버</th>
                            <th style={{ width: "10.5%" }}>
                              PLBN{" "}
                              {sortType === "plbn" ? (
                                <UpOutlined
                                  onClick={onClickSortType("plbnReverse")}
                                />
                              ) : (
                                <DownOutlined
                                  onClick={onClickSortType("plbn")}
                                />
                              )}
                            </th>
                            <th style={{ width: "15%" }}>
                              도서 제목{" "}
                              {sortType === "title" ? (
                                <UpOutlined
                                  onClick={onClickSortType("titleReverse")}
                                />
                              ) : (
                                <DownOutlined
                                  onClick={onClickSortType("title")}
                                />
                              )}
                            </th>
                            <th style={{ width: "13%" }}>
                              저자{" "}
                              {sortType === "author" ? (
                                <UpOutlined
                                  onClick={onClickSortType("authorReverse")}
                                />
                              ) : (
                                <DownOutlined
                                  onClick={onClickSortType("author")}
                                />
                              )}
                            </th>
                            <th style={{ width: "9%" }}>AR QUIZ No.</th>
                            <th style={{ width: "3%" }}>F/NF</th>
                            <th style={{ width: "6%" }}>
                              AR{" "}
                              {sortType === "ar" ? (
                                <UpOutlined
                                  onClick={onClickSortType("arReverse")}
                                />
                              ) : (
                                <DownOutlined onClick={onClickSortType("ar")} />
                              )}
                            </th>

                            <th style={{ width: "6.5%" }}>
                              WC{" "}
                              {sortType === "wordCount" ? (
                                <UpOutlined
                                  onClick={onClickSortType("wordCountReverse")}
                                />
                              ) : (
                                <DownOutlined
                                  onClick={onClickSortType("wordCount")}
                                />
                              )}
                            </th>
                            <th style={{ width: "3%" }}>IL</th>
                            <th style={{ width: "7.2%" }}>
                              Lexile{" "}
                              {sortType === "lexile" ? (
                                <UpOutlined
                                  onClick={onClickSortType("lexileReverse")}
                                />
                              ) : (
                                <DownOutlined
                                  onClick={onClickSortType("lexile")}
                                />
                              )}
                            </th>
                            <th style={{ width: "6.4%" }}>예약</th>
                          </tr>
                        </thead>
                      )}
                      <tbody>
                        {bookArray
                          ?.filter((el) => {
                            return (
                              reservationBookData?.studentReservedBooks.filter(
                                (ele) => {
                                  return ele.titleAr === el.titleAr;
                                }
                              ).length === 0
                            );
                          })
                          ?.map((el, index) => {
                            return (
                              <tr style={{ height: "2.75rem" }}>
                                <td>{(bookPage - 1) * 20 + index + 1}</td>
                                <td>{el.books?.[0].boxNumber}</td>
                                {/* <td>{kplbnFrame(el.kplbn)}</td> */}
                                <td>{el.books?.[0].plbn}</td>
                                {el.titleAr?.length > 25 ? (
                                  <td
                                    onMouseEnter={() => {
                                      setIsViewTitle(true);
                                      setViewTitle(el?.titleAr);
                                    }}
                                    onMouseLeave={() => {
                                      setIsViewTitle(false);
                                    }}
                                  >
                                    {longWord(el.titleAr)}
                                  </td>
                                ) : (
                                  <td>{longWord(el.titleAr)}</td>
                                )}
                                {el.authorAr.length > 15 ? (
                                  <td
                                    onMouseEnter={() => {
                                      setIsViewTitle(true);
                                      setViewTitle(el?.authorAr);
                                    }}
                                    onMouseLeave={() => {
                                      setIsViewTitle(false);
                                    }}
                                  >
                                    {longAuthor(el.authorAr)}
                                  </td>
                                ) : (
                                  <td>{longAuthor(el.authorAr)}</td>
                                )}
                                <td>{"#" + el.arQuiz}</td>
                                <td>{el.fnfStatus}</td>
                                <td>{arFrame(el.bl)}</td>

                                <td>{addComma(el.wcAr)}</td>
                                <th>{el?.ilStatus.slice(3, 5)}</th>
                                <td>
                                  {el.lexileLex === null
                                    ? lexileFrame(el.lexileAr)
                                    : lexileFrame(el.lexileLex)}
                                </td>
                                <td>
                                  <button
                                    onClick={onClickBookingBooks(
                                      Number(el?.books?.[0]?.id),
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
                  </>
                )}
                {isLoading ? (
                  <></>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    {bookData === undefined ||
                    bookData?.getBooksByBl.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <S.MoveIcon
                          onClick={() => {
                            if (bookPage - 10 > 0) {
                              setBookPage(bookPage - 10);
                            }
                          }}
                        >
                          {"<<"}
                        </S.MoveIcon>
                        <S.MoveIcon
                          onClick={() => {
                            if (bookPage > 1) {
                              setBookPage(bookPage - 1);
                            }
                          }}
                          style={{ margin: "0 8px" }}
                        >
                          {"<"}
                        </S.MoveIcon>
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
                            <S.NumberIcon
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
                            </S.NumberIcon>
                            {bookPage < bookMaxPage - 3 &&
                            bookPage === index - 1 ? (
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

                    {bookData === undefined ||
                    bookData?.getBooksByBl.length === 0 ? (
                      <></>
                    ) : (
                      <>
                        <S.MoveIcon
                          onClick={() => {
                            if (bookPage < bookMaxPage) {
                              setBookPage(bookPage + 1);
                            }
                          }}
                          style={{ margin: "0 8px" }}
                        >
                          {">"}
                        </S.MoveIcon>
                        <S.MoveIcon
                          onClick={() => {
                            if (bookPage + 10 < bookMaxPage) {
                              setBookPage(bookPage + 10);
                            }
                          }}
                        >
                          {">>"}
                        </S.MoveIcon>
                      </>
                    )}
                  </div>
                )}
              </>
            )}
            {reserveType === "barcode" && (
              <>
                <S.ModalWrapper
                  style={{
                    borderRadius: "0.25rem 0.25rem 0rem 0rem",
                    background: "#F7F8FA",
                    padding: "1.5rem",
                    borderRadius: "9px",
                    marginTop: "1.25rem",
                  }}
                >
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
                          display: "flex",
                          color: "#000",
                          fontSize: "15px",
                          fontWeight: "bold",
                          flexDirection: "column",
                          marginRight: "1.87rem",
                        }}
                      >
                        <div>PLBN</div>
                        <div>
                          <S.InputInput
                            type="text"
                            style={{ marginLeft: "10px", marginTop: "10px" }}
                            onChange={(e) => {
                              setBarcode(e.target.value);
                            }}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                onClickBarcode();
                              }
                            }}
                            value={barcode}
                          ></S.InputInput>
                        </div>
                      </div>
                      <S.ModalAddButton
                        onClick={onClickBarcode}
                        style={{
                          borderRadius: "0.5rem",
                          background: "#333",
                          height: "2.75rem",
                        }}
                      >
                        예약
                      </S.ModalAddButton>
                    </div>
                  </S.ModalButtonBox>
                </S.ModalWrapper>
              </>
            )}
            {reserveType === "recommend" && (
              <>
                {fictionData?.getRecommendBooks?.length !== 0 ? (
                  <>
                    <div
                      style={{
                        fontFamily: "Spoqa Han Sans Neo",
                        fontSize: "2rem",
                        fontWeight: 500,
                        margin: "1rem 0",
                      }}
                    >
                      Fiction 남은 도서{" "}
                      {fictionData?.getRecommendBooks?.[0]?.inventoryNum + "권"}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        width: "93rem",
                        justifyContent: "flex-end",
                      }}
                    >
                      <S.ModalCancelButton
                        style={{
                          backgroundColor: "#ddd",
                          color: "#333",
                          margin: "1rem",
                          padding: "1.3rem",
                        }}
                        onClick={onClickChangePeriod("1")}
                      >
                        F-package
                      </S.ModalCancelButton>
                      <S.ModalCancelButton
                        style={{
                          backgroundColor: "#ddd",
                          color: "#333",
                          margin: "1rem",
                          padding: "1.3rem",
                        }}
                        onClick={onClickFetch("1")}
                      >
                        F-list
                      </S.ModalCancelButton>
                    </div>
                    <table style={{ width: "92rem" }}>
                      <thead>
                        <tr>
                          <th style={{ width: "2rem" }}>No.</th>
                          <th style={{ width: "6rem" }}>박스 넘버</th>
                          <th style={{ width: "6rem" }}>PLBN</th>
                          <th style={{ width: "13rem" }}>도서 제목</th>
                          <th style={{ width: "9rem" }}>저자</th>
                          <th style={{ width: "6rem" }}>AR QUIZ No.</th>
                          <th style={{ width: "1.8rem" }}>F/NF</th>
                          <th style={{ width: "1.8rem" }}>AR</th>
                          <th style={{ width: "2.5rem" }}>WC</th>
                          <th style={{ width: "2rem" }}>IL</th>
                          <th style={{ width: "2.5rem" }}>Lexile</th>
                          <th style={{ width: "3rem" }}>예약</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fictionData?.getRecommendBooks?.map((el, index) => {
                          return (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{el.boxNumber}</td>
                              <td>{el.plbn}</td>
                              {el.booktitle.length > 25 ? (
                                <td
                                  onMouseEnter={() => {
                                    setIsViewTitle(true);
                                    setViewTitle(el?.booktitle);
                                  }}
                                  onMouseLeave={() => {
                                    setIsViewTitle(false);
                                  }}
                                >
                                  {longWord(el.booktitle)}
                                </td>
                              ) : (
                                <td>{longWord(el.booktitle)}</td>
                              )}
                              {el.book.authorAr.length > 15 ? (
                                <td
                                  onMouseEnter={() => {
                                    setIsViewTitle(true);
                                    setViewTitle(el.book.authorAr);
                                  }}
                                  onMouseLeave={() => {
                                    setIsViewTitle(false);
                                  }}
                                >
                                  {longAuthor(el.book.authorAr)}
                                </td>
                              ) : (
                                <td>{longAuthor(el.book.authorAr)}</td>
                              )}
                              {/* <td>{longAuthor(el.book.authorAr)}</td> */}
                              <td>{"#" + el.book.arQuiz}</td>
                              <td>{el.book.fnfStatus}</td>
                              <td>{arFrame(el.book.bl)}</td>
                              <td>{el.book.wcAr || el.book.wcLex}</td>
                              <td>{el.book.ilStatus.slice(3, 5)}</td>
                              <td>
                                {(el.book.lexileLex > 0
                                  ? el.book.lexileLex + "L"
                                  : "B" + el.book.lexileLex * -1 + "L") ||
                                  (el.book.lexileAr > 0
                                    ? el.book.lexileAr + "L"
                                    : "B" + el.book.lexileAr * -1 + "L")}
                              </td>

                              {/* <td>{el.book.litproStatus}</td> */}
                              <td>
                                <button
                                  onClick={onClickBookingBooks(
                                    el.id,
                                    el.booktitle
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
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        fontFamily: "Spoqa Han Sans Neo",
                        fontSize: "2rem",
                        fontWeight: 500,
                        margin: "1rem 0",
                      }}
                    >
                      추천 도서 패키지가 없습니다. 패키지를 새로 받아주십시오.
                    </div>
                    <S.ModalCancelButton
                      style={{
                        backgroundColor: "#ddd",
                        color: "#333",
                        margin: "1rem",
                        padding: "1.3rem",
                      }}
                      onClick={onClickChangePeriod("1")}
                    >
                      F-package
                    </S.ModalCancelButton>
                  </>
                )}
                {nonFictionData?.getRecommendBooks?.length !== 0 ? (
                  <>
                    {" "}
                    <div
                      style={{
                        fontFamily: "Spoqa Han Sans Neo",
                        fontSize: "2rem",
                        fontWeight: 500,
                        margin: "1rem 0",
                      }}
                    >
                      NonFiction 남은 도서{" "}
                      {nonFictionData?.getRecommendBooks?.[0]?.inventoryNum +
                        "권"}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        width: "93rem",
                        justifyContent: "flex-end",
                      }}
                    >
                      <S.ModalCancelButton
                        style={{
                          backgroundColor: "#ddd",
                          color: "#333",
                          margin: "1rem",
                          padding: "1.3rem",
                        }}
                        onClick={onClickChangePeriod("2")}
                      >
                        NF-package
                      </S.ModalCancelButton>
                      <S.ModalCancelButton
                        style={{
                          backgroundColor: "#ddd",
                          color: "#333",
                          margin: "1rem",
                          padding: "1.3rem",
                        }}
                        onClick={onClickFetch("2")}
                      >
                        NF-list
                      </S.ModalCancelButton>
                    </div>
                    <table style={{ width: "92rem" }}>
                      <thead>
                        <tr>
                          <th style={{ width: "2rem" }}>No.</th>
                          <th style={{ width: "6rem" }}>박스 넘버</th>
                          <th style={{ width: "6rem" }}>PLBN</th>
                          <th style={{ width: "13rem" }}>도서 제목</th>
                          <th style={{ width: "9rem" }}>저자</th>
                          <th style={{ width: "6rem" }}>AR QUIZ No.</th>
                          <th style={{ width: "1.8rem" }}>F/NF</th>
                          <th style={{ width: "1.8rem" }}>AR</th>
                          <th style={{ width: "2.5rem" }}>WC</th>
                          <th style={{ width: "2rem" }}>IL</th>
                          <th style={{ width: "2.5rem" }}>Lexile</th>
                          <th style={{ width: "3rem" }}>예약</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nonFictionData?.getRecommendBooks?.map((el, index) => {
                          return (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{el.boxNumber}</td>
                              <td>{el.plbn}</td>
                              {el.booktitle.length > 25 ? (
                                <td
                                  onMouseEnter={() => {
                                    setIsViewTitle(true);
                                    setViewTitle(el?.booktitle);
                                  }}
                                  onMouseLeave={() => {
                                    setIsViewTitle(false);
                                  }}
                                >
                                  {longWord(el.booktitle)}
                                </td>
                              ) : (
                                <td>{longWord(el.booktitle)}</td>
                              )}
                              {el.book.authorAr.length > 15 ? (
                                <td
                                  onMouseEnter={() => {
                                    setIsViewTitle(true);
                                    setViewTitle(el.book.authorAr);
                                  }}
                                  onMouseLeave={() => {
                                    setIsViewTitle(false);
                                  }}
                                >
                                  {longAuthor(el.book.authorAr)}
                                </td>
                              ) : (
                                <td>{longAuthor(el.book.authorAr)}</td>
                              )}
                              {/* <td>{longAuthor(el.book.authorAr)}</td> */}
                              <td>{"#" + el.book.arQuiz}</td>
                              <td>{el.book.fnfStatus}</td>
                              <td>{arFrame(el.book.bl)}</td>
                              <td>{el.book.wcAr || el.book.wcLex}</td>
                              <td>{el.book.ilStatus.slice(3, 5)}</td>
                              <td>
                                {(el.book.lexileLex > 0
                                  ? el.book.lexileLex + "L"
                                  : "B" + el.book.lexileLex * -1 + "L") ||
                                  (el.book.lexileAr > 0
                                    ? el.book.lexileAr + "L"
                                    : "B" + el.book.lexileAr * -1 + "L")}
                              </td>

                              {/* <td>{el.book.litproStatus}</td> */}
                              <td>
                                <button
                                  onClick={onClickBookingBooks(
                                    el.id,
                                    el.booktitle
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
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        fontFamily: "Spoqa Han Sans Neo",
                        fontSize: "2rem",
                        fontWeight: 500,
                        margin: "1rem 0",
                      }}
                    >
                      추천 도서 패키지가 없습니다. 패키지를 새로 받아주십시오.
                    </div>
                    <S.ModalCancelButton
                      style={{
                        backgroundColor: "#ddd",
                        color: "#333",
                        margin: "1rem",
                        padding: "1.3rem",
                      }}
                      onClick={onClickChangePeriod("2")}
                    >
                      NF-package
                    </S.ModalCancelButton>
                  </>
                )}
              </>
            )}
            {isViewTitle ? (
              <span
                style={{
                  position: "fixed",
                  left: mousePosition.x,
                  top: mousePosition.y,
                  backgroundColor: "#dedede",
                  border: "2px solid #333333",
                  borderRadius: "3px",
                  zIndex: 99999,
                }}
              >
                {viewTitle}
              </span>
            ) : (
              <></>
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "3rem 3rem",
            }}
          >
            <div
              style={{
                color: "#000",
                fontSize: "2.125rem",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "2.5rem",
                marginBottom: "1.5rem",
              }}
            >
              {confirmState + " 처리 하시겠습니까?"}
            </div>
            <div style={{ marginBottom: "3.5rem" }}>
              {confirmState === "결석"
                ? "원생의 출결 상태를 결석으로 변경합니다."
                : "원생을 해당 일자/수업에서 삭제합니다."}
            </div>
            {confirmState === "삭제" && (
              <>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                    justifyContent: "flex-start",
                  }}
                >
                  <div>
                    <span>현재 수업</span>
                    <input
                      type="radio"
                      name="isAll"
                      checked={!isAll}
                      onClick={() => {
                        setIsAll(false);
                      }}
                    ></input>
                  </div>
                  <div>
                    <span> 전체 수업</span>
                    <input
                      type="radio"
                      name="isAll"
                      checked={isAll}
                      onClick={() => {
                        setIsAll(true);
                      }}
                    ></input>
                  </div>
                </div>
                {isAll && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>삭제 시작일</span>
                    <input
                      type="date"
                      style={{
                        width: "57%",
                        height: "2rem",
                        fontSize: "14px",
                        border: "1px solid #DBDDE1",
                        borderRadius: "8px",
                        fontFamily: "Spoqa Han Sans Neo",
                        paddingLeft: "10px",
                      }}
                      value={deleteDate}
                      onChange={(e) => {
                        setDeleteDate(e.target.value);
                      }}
                    ></input>
                  </div>
                )}
              </>
            )}
            <div>
              <S.DeleteButton
                onClick={() => {
                  setIsConfirm(false);
                }}
                style={{
                  backgroundColor: "background: #EBECEF;",
                  color: "#1e1e1e",
                  height: "2.75rem",
                }}
              >
                취소
              </S.DeleteButton>
              <S.DeleteButton
                onClick={
                  confirmState === "삭제"
                    ? () => {
                        onClickDelete()();
                        setIsConfirm(false);
                      }
                    : () => {
                        onClickAttendance("absent")();
                        setIsConfirm(false);
                      }
                }
                style={{
                  backgroundColor: "#333",
                  color: "#FFF",
                  height: "2.75rem",
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
      {isChange ? (
        <Modal
          open={isChange}
          onCancel={() => {
            setIsChange(false);
          }}
          footer={null}
          closable={false}
          width={"80%"}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "3rem 3rem",
            }}
          >
            <div
              style={{
                color: "#000",
                fontSize: "2.125rem",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "2.5rem",
                marginBottom: "1.5rem",
                fontFamily: "Spoqa Han Sans Neo",
              }}
            >
              {"패키지를 변경 하시겠습니까?"}
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "flex-start",
              }}
            >
              <div
                style={{
                  textDecoration: isPeriod ? "underline" : "",
                  fontSize: "1.3rem",
                  fontFamily: "Spoqa Han Sans Neo",
                  marginRight: "1rem",
                }}
                onClick={() => {
                  setIsPeriod(true);
                }}
              >
                기간 재설정
              </div>

              <div
                style={{
                  textDecoration: isPeriod ? "" : "underline",
                  fontSize: "1.3rem",
                  fontFamily: "Spoqa Han Sans Neo",
                }}
                onClick={() => {
                  setIsPeriod(false);
                  setReadingList(
                    recordingData?.studentBookRecord
                      ?.filter((el) => {
                        // console.log(
                        //   el?.arDate,
                        //   packageData?.studentBookRecordWithPkg?.createdAt
                        // );
                        const ar =
                          Number(el?.arDate?.slice(0, 4)) * 10000 +
                          Number(el?.arDate?.slice(5, 7)) * 100 +
                          Number(el?.arDate?.slice(8, 10));
                        const created =
                          Number(
                            packageData?.studentBookRecordWithPkg?.bookPkg?.createdAt?.slice(
                              0,
                              4
                            )
                          ) *
                            10000 +
                          Number(
                            packageData?.studentBookRecordWithPkg?.bookPkg?.createdAt?.slice(
                              5,
                              7
                            )
                          ) *
                            100 +
                          Number(
                            packageData?.studentBookRecordWithPkg?.bookPkg?.createdAt?.slice(
                              8,
                              10
                            )
                          );

                        if (created > ar) {
                          return false;
                        } else {
                          console.log(true);
                          return true;
                        }
                      })
                      .map((el) => el.id)
                  );
                }}
              >
                기록 재설정
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
                fontFamily: "Spoqa Han Sans Neo",
                fontSize: "1.2rem",
                fontWeight: 500,
              }}
            >
              {packageData?.studentBookRecordWithPkg?.bookPkg?.createdAt !==
                undefined &&
                "최근 패키지 변경일 : " +
                  packageData?.studentBookRecordWithPkg?.bookPkg?.createdAt}
            </div>
            {!isPeriod && (
              <div style={{ width: "100%", margin: "1rem 0" }}>
                <span
                  style={{
                    fontSize: "1rem",
                    fontFamily: "Spoqa Han Sans Neo",
                  }}
                >
                  검색
                </span>
                <input
                  style={{
                    fontSize: "1rem",
                    marginLeft: "0.5rem",
                    padding: "0.5rem",
                    border: "1px solid #dddddd",
                    borderRadius: "5px",
                  }}
                  onChange={(e) => {
                    setSearchReading(e.target.value);
                  }}
                  placeholder="도서 제목을 입력해주세요."
                ></input>
              </div>
            )}

            {!isPeriod && (
              <S.ModalTable
                style={{
                  width: "100%",
                  height: "38rem",
                  overflow: "scroll",
                }}
              >
                <table style={{ fontFamily: "Spoqa Han Sans Neo" }}>
                  <thead>
                    <th width="2rem">
                      <input
                        type="checkbox"
                        style={{ width: "20px", height: "20px" }}
                        checked={
                          recordingData?.studentBookRecord
                            ?.filter((el) => {
                              if (fNf === "1") {
                                return el.book.fnfStatus === "F";
                              } else {
                                return el.book.fnfStatus === "NF";
                              }
                            })
                            ?.filter((el) => {
                              return el?.book?.titleAr
                                .toLowerCase()
                                .includes(searchReading.toLowerCase());
                            }).length === readingList.length
                        }
                        onChange={() => {
                          if (
                            recordingData?.studentBookRecord
                              ?.filter((el) => {
                                if (fNf === "1") {
                                  return el.book.fnfStatus === "F";
                                } else {
                                  return el.book.fnfStatus === "NF";
                                }
                              })
                              ?.filter((el) => {
                                return el?.book?.titleAr
                                  .toLowerCase()
                                  .includes(searchReading.toLowerCase());
                              }).length === readingList.length
                          ) {
                            setReadingList([]);
                          } else {
                            setReadingList(
                              recordingData?.studentBookRecord
                                ?.filter((el) => {
                                  if (fNf === "1") {
                                    return el.book.fnfStatus === "F";
                                  } else {
                                    return el.book.fnfStatus === "NF";
                                  }
                                })
                                ?.filter((ele) => {
                                  return ele?.book?.titleAr
                                    .toLowerCase()
                                    .includes(searchReading.toLowerCase());
                                })
                                ?.map((ele) => ele.id)
                            );
                          }
                        }}
                      ></input>
                    </th>
                    <th>날짜</th>
                    <th>도서 제목</th>
                    <th>저자</th>
                    <th>AR Quiz</th>
                    <th>AR</th>
                    <th>WC</th>
                    <th>정답률</th>
                  </thead>
                  <tbody>
                    {recordingData?.studentBookRecord
                      ?.filter((el) => {
                        if (fNf === "1") {
                          return el.book.fnfStatus === "F";
                        } else {
                          return el.book.fnfStatus === "NF";
                        }
                      })
                      ?.filter((el) => {
                        return el?.book?.titleAr
                          .toLowerCase()
                          .includes(searchReading.toLowerCase());
                      })
                      ?.map((el) => {
                        return (
                          <tr>
                            <td>
                              <input
                                type="checkbox"
                                style={{ width: "20px", height: "20px" }}
                                checked={readingList.includes(el.id)}
                                onChange={() => {
                                  if (readingList.includes(el.id)) {
                                    const newList = [...readingList];
                                    setReadingList(
                                      newList.filter((ele) => ele !== el.id)
                                    );
                                  } else {
                                    const newList = [...readingList];
                                    newList.push(el.id);
                                    setReadingList(newList);
                                  }
                                }}
                              ></input>
                            </td>
                            <td>{el.arDate}</td>
                            <td>{el.book.titleAr}</td>
                            <td>{longTitle(el.book.authorAr)}</td>
                            <td>{"#" + el.book.arQuiz}</td>
                            <td>{arFrame(el.book.bl)}</td>
                            <td>{addComma(el.book.wcAr)}</td>
                            <td>{el.arCorrect + "%"}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </S.ModalTable>
            )}

            <div style={{ marginTop: "1rem" }}>
              <S.DeleteButton
                onClick={() => {
                  setIsChange(false);
                }}
                style={{
                  backgroundColor: "background: #EBECEF;",
                  color: "#1e1e1e",
                  height: "2.75rem",
                }}
              >
                취소
              </S.DeleteButton>
              <S.DeleteButton
                onClick={isPeriod ? onClickConfirmPeriod : onClickConfirmRecord}
                style={{
                  backgroundColor: "#333",
                  color: "#FFF",
                  height: "2.75rem",
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
      {isAlert && (
        <Modal
          open={isAlert}
          onCancel={() => {
            isAlert(false);
          }}
          width={"40rem"}
          footer={null}
          closable={false}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "3rem 3rem",
            }}
          >
            <div
              style={{
                color: "#000",
                fontSize: "2.125rem",
                fontStyle: "normal",
                fontWeight: 500,
                lineHeight: "2.5rem",
                marginBottom: "1.5rem",
                fontFamily: "Spoqa Han Sans Neo",
              }}
            >
              {"패키지를 재설정하시겠습니까?"}
            </div>
            <div
              style={{
                marginBottom: "3.5rem",
                fontFamily: "Spoqa Han Sans Neo",
              }}
            >
              {"리스트의 책 권수가 10권 이하입니다."}
            </div>
            <div>
              <S.DeleteButton
                onClick={() => {
                  setIsAlert(false);
                }}
                style={{
                  backgroundColor: "background: #EBECEF;",
                  color: "#1e1e1e",
                  height: "2.75rem",
                }}
              >
                취소
              </S.DeleteButton>
              <S.DeleteButton
                onClick={onClickAlertRecord}
                style={{
                  backgroundColor: "#333",
                  color: "#FFF",
                  height: "2.75rem",
                }}
              >
                확인
              </S.DeleteButton>
            </div>
          </div>
        </Modal>
      )}
      {/* <Modal
        open={isInfo}
        onCancel={() => {
          setIsInfo(false);
        }}
        closable={false}
        footer={null}
      >
        <S.lectureModalInfo>{"수업 정보: " + info}</S.lectureModalInfo>
      </Modal> */}
      {isSetting ? (
        <Modal
          open={isSetting}
          closable={false}
          footer={null}
          onCancel={() => {
            setIsSetting(false);
            setIsNotificationCustom(
              settingData?.academyInfo?.endNotificationCustom
            );
            setIntervalTime(settingData?.academyInfo?.notificationInterval);
          }}
          width={"35%"}
        >
          <div>
            <S.ModalTitle style={{ marginBottom: "2rem" }}>
              알람 설정
            </S.ModalTitle>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "3rem",
              }}
            >
              <span style={{ fontWeight: "600" }}>
                등/하원 이전 알람 시간 설정
              </span>
              <div
                style={{
                  width: "33.5%",
                  border: "1px solid #DBDDE1",
                  borderRadius: "0.5rem",
                }}
              >
                <input
                  type="number"
                  defaultValue={intervalTime}
                  onChange={(e) => {
                    setIntervalTime(Number(e.target.value));
                  }}
                  style={{
                    paddingLeft: "5%",
                    paddingTop: "0.81rem",
                    paddingBottom: "0.81rem",
                    border: "none",
                    width: "75%",
                  }}
                ></input>
                <span>분</span>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4rem",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: "600" }}>알람 시간 기준</span>
              <div
                style={{
                  width: "30%",
                  border: "1px solid #DBDDE1",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-around",
                  padding: "0.81rem",
                }}
              >
                {/* <span
                  style={{
                    paddingTop: "0.81rem",
                    paddingBottom: "0.81rem",
                  }}
                >
                  {isNotificationCustom ? "하원 시간 기준" : "수업 시간 기준"}
                </span>
                <Switch
                  defaultChecked={isNotificationCustom}
                  onChange={(checked) => {
                    setIsNotificationCustom(checked);
                  }}
                ></Switch> */}
                <span>하원 시간</span>
                <input
                  type="radio"
                  name="setting"
                  checked={isNotificationCustom}
                  onChange={() => {
                    setIsNotificationCustom(true);
                  }}
                ></input>
                <span>수업 시간</span>
                <input
                  type="radio"
                  name="setting"
                  checked={!isNotificationCustom}
                  onChange={() => {
                    setIsNotificationCustom(false);
                  }}
                ></input>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <S.ModalCancelButton
                onClick={() => {
                  setIsSetting(false);
                  setIsNotificationCustom(
                    settingData?.academyInfo?.endNotificationCustom
                  );
                  setIntervalTime(
                    settingData?.academyInfo?.notificationInterval
                  );
                }}
                style={{ background: "#EBECEF", color: "#000" }}
              >
                취소
              </S.ModalCancelButton>
              <S.ModalOkButton onClick={onClickSetting}>저장</S.ModalOkButton>
            </div>
          </div>
        </Modal>
      ) : (
        <></>
      )}
      {isMemo ? (
        <Modal
          closable={false}
          footer={null}
          open={isMemo}
          onCancel={() => {
            setIsMemo(false);
          }}
          width={"980px"}
          height={"580px"}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "95%",
              marginLeft: "2.5%",
            }}
          >
            <div
              style={{
                fontSize: "34px",
                fontFamily: "Spoqa Han Sans Neo",
                fontWeight: "500",
                marginBottom: "30px",
              }}
            >
              {
                studentData?.studentsInAcademy?.filter((el) => {
                  return memoStudent === el.id;
                })?.[0]?.korName
              }{" "}
              강의 메모
            </div>
            <table style={{ borderRight: "none", borderLeft: "none" }}>
              <tbody>
                <tr>
                  <th
                    style={{
                      fontSize: "14",
                      fontFamily: "Spoqa Han Sans Neo",
                      display: "flex",
                      alignItems: "center",
                      borderRight: "none",
                      borderLeft: "none",
                      borderBottom: "none",
                      backgroundColor: "#F7F8FA",
                      height: "40px",
                    }}
                  >
                    작성자
                  </th>
                  <td
                    style={{
                      fontFamily: "Spoqa Han Sans Neo",
                      fontWeight: "400",
                      borderRight: "none",
                      borderLeft: "none",
                      borderBottom: "none",
                      height: "40px",
                    }}
                  >
                    {memoContents?.lecture?.teacher?.korName}
                  </td>
                </tr>
                <tr>
                  <th
                    style={{
                      fontSize: "14",
                      fontFamily: "Spoqa Han Sans Neo",
                      display: "flex",
                      alignItems: "center",
                      borderRight: "none",
                      borderLeft: "none",
                      borderBottom: "none",
                      backgroundColor: "#F7F8FA",
                      height: "40px",
                    }}
                  >
                    수업 날짜
                  </th>
                  <td
                    style={{
                      borderRight: "none",
                      borderLeft: "none",
                      borderBottom: "none",
                      height: "40px",
                    }}
                  >
                    {memoContents?.lecture?.date}
                  </td>
                </tr>
                <tr>
                  <th
                    style={{
                      fontSize: "14",
                      fontFamily: "Spoqa Han Sans Neo",
                      display: "flex",
                      alignItems: "center",
                      borderRight: "none",
                      borderLeft: "none",
                      borderBottom: "none",
                      backgroundColor: "#F7F8FA",
                      height: "40px",
                    }}
                  >
                    강의 정보
                  </th>
                  <td
                    style={{
                      borderRight: "none",
                      borderLeft: "none",
                      borderBottom: "none",
                      height: "40px",
                    }}
                  >
                    {memoContents?.lecture?.lectureInfo?.about}
                  </td>
                </tr>
                <tr
                  style={{
                    height: "220px",
                  }}
                >
                  <th
                    style={{
                      height: "220px",
                      fontSize: "14px",
                      fontFamily: "Spoqa Han Sans Neo",
                      display: "flex",
                      alignItems: "flex-start",
                      borderRight: "none",
                      borderLeft: "none",
                      backgroundColor: "#F7F8FA",
                    }}
                  >
                    원생 메모
                  </th>
                  <td style={{ borderRight: "none", borderLeft: "none" }}>
                    <textarea
                      type="text"
                      value={
                        memoContents?.lecture?.id
                          ? memoText
                          : "출석 체크를 먼저 해주시기 바랍니다."
                      }
                      onChange={(e) => {
                        setMemoText(e.target.value);
                      }}
                      disabled={memoContents?.lecture?.id === undefined}
                      style={{
                        width: "100%",
                        border: "none",
                        height: "200px",
                        fontFamily: "Spoqa Han Sans Neo",
                      }}
                    ></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginTop: "30px",
              }}
            >
              <div style={{ display: "flex" }}>
                <S.ClassButton onClick={onClickMoveMemo(-1)}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.75 9L2.25 9M2.25 9L8.625 15.375M2.25 9L8.625 2.625"
                      stroke="#333333"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  이전 메모
                </S.ClassButton>
                <S.ClassButton onClick={onClickMoveMemo(1)}>
                  다음 메모
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.25 9H15.75M15.75 9L9.375 2.625M15.75 9L9.375 15.375"
                      stroke="#333333"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </S.ClassButton>
              </div>
              <div>
                <S.ModalOkButton onClick={onClickEditMemo}>
                  수정
                </S.ModalOkButton>
                <S.ModalCancelButton
                  onClick={() => {
                    setIsMemo(false);
                  }}
                  style={{ background: "#EBECEF", color: "#000" }}
                >
                  닫기
                </S.ModalCancelButton>
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        <></>
      )}
      {isAttendance || isLate || isComplete ? (
        <Modal
          open={isAttendance || isLate || isComplete}
          closable={false}
          footer={null}
          onCancel={() => {
            setIsAttendance(false);
            setIsLate(false);
            setIsComplete(false);
          }}
        >
          {isAttendance ? (
            <>
              <S.ModalTitle style={{ marginBottom: "20px" }}>
                등원 시간
              </S.ModalTitle>
              <div
                style={{
                  display: "flex",
                }}
              >
                <S.ClassSmallTimeInput
                  type="time"
                  onChange={(e) => {
                    setLateTime(e.target.value);
                  }}
                  value={lateTime}
                ></S.ClassSmallTimeInput>

                <S.ClassSmallTimeBtn
                  onClick={() => {
                    onClickAttendance("attendance")();
                    setIsAttendance(false);
                  }}
                  style={{ backgroundColor: "#333333", color: "#FFFFFF" }}
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
          {isComplete ? (
            <>
              <S.ModalTitle style={{ marginBottom: "20px" }}>
                하원 시간
              </S.ModalTitle>
              <div
                style={{
                  display: "flex",
                }}
              >
                <S.ClassSmallTimeInput
                  type="time"
                  onChange={(e) => {
                    setLateTime(e.target.value);
                  }}
                  value={lateTime}
                ></S.ClassSmallTimeInput>
                <S.ClassSmallTimeBtn
                  onClick={() => {
                    onClickAttendance("completed")();
                    setIsComplete(false);
                  }}
                  style={{ backgroundColor: "#333333", color: "#FFFFFF" }}
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
          {isLate ? (
            <>
              <S.ModalTitle style={{ marginBottom: "20px" }}>
                지각 시간
              </S.ModalTitle>
              <div
                style={{
                  display: "flex",
                }}
              >
                <S.ClassSmallTimeInput
                  type="time"
                  onChange={(e) => {
                    setLateTime(e.target.value);
                  }}
                  value={lateTime}
                ></S.ClassSmallTimeInput>
                <S.ClassSmallTimeBtn
                  onClick={() => {
                    onClickAttendance("late")();
                    setIsLate(false);
                  }}
                  style={{ backgroundColor: "#333333", color: "#FFFFFF" }}
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
        </Modal>
      ) : (
        <></>
      )}
      {confirmReserve ? (
        <Modal
          open={confirmReserve}
          onCancel={() => {
            setConfirmReserve(false);
          }}
          closable={false}
          footer={null}
        >
          {bookArray?.length === 0 ? (
            <div>{"없는 도서입니다."}</div>
          ) : (
            <>
              <div>{bookArray?.[0]?.titleAr}</div>
              <table>
                <thead>
                  <tr>
                    <th>PLBN</th>
                    <th>예약</th>
                  </tr>
                </thead>
                <tbody>
                  {bookArray?.[0]?.books?.map((el) => {
                    return (
                      <tr>
                        <td>{el.plbn}</td>
                        <td>
                          <button
                            onClick={onClickBookingBooks(
                              bookArray?.[0]?.books?.[0]?.id,
                              bookArray?.[0]?.titleAr
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
            </>
          )}
        </Modal>
      ) : (
        <></>
      )}

      {isEdit ? (
        <Modal
          open={isEdit}
          onCancel={() => {
            setIsEdit(false);
            setEditDate(dateToInput(date));
            // setEditStartTime(dateToClock(date));
            // setEditEndTime(dateToClockOneHour(date));
            setEditInfo("");
            setEditAcademy(Number(router.query.branch));
            setIsAll(false);
            setTeacherId(
              userData?.allUsers
                .filter((el) => el.userCategory === "선생님")
                .filter((el) => {
                  return (
                    Number(el.profile.academy.id) ===
                    Number(router.query.branch)
                  );
                })[0].id
            );
          }}
          footer={null}
          closable={false}
          width={"60%"}
        >
          <S.EditModalTitle>수업 수정</S.EditModalTitle>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: "48%" }}>
              <S.EditModalTagTitle>원생 수업 목록</S.EditModalTagTitle>
              <table>
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>반복 요일</th>
                    <th>수업 시간</th>
                  </tr>
                </thead>
                <tbody>
                  {lectureInfoData?.studentLectures
                    ?.filter((el, i, callback) => {
                      return (
                        i ===
                        callback.findIndex(
                          (t) =>
                            t.lecture.lectureInfo.id ===
                            el.lecture.lectureInfo.id
                        )
                      );
                    })
                    ?.map((el) => {
                      return (
                        <tr>
                          <td
                            style={{
                              color:
                                Number(el?.lecture?.lectureInfo?.id) ===
                                Number(checkList[0].lectureInfoId)
                                  ? "tomato"
                                  : "",
                            }}
                          >
                            {el?.lecture?.lectureInfo?.repeatDay.includes(-1)
                              ? el?.lecture?.date
                              : el?.lecture?.lectureInfo?.autoAdd
                              ? el?.lecture?.date + "~"
                              : el?.lecture?.date +
                                "~" +
                                lastDate(
                                  el?.lecture?.date,
                                  el?.lecture?.lectureInfo?.repeatWeeks,
                                  el?.lecture?.lectureInfo?.repeatDay?.[
                                    el?.lecture?.lectureInfo?.repeatDay
                                      ?.length - 1
                                  ]
                                )}
                          </td>
                          <td>
                            {el?.lecture?.lectureInfo?.repeatDay.includes(-1)
                              ? "없음"
                              : el?.lecture?.lectureInfo?.repeatDay
                                  ?.sort((a, b) => {
                                    return a - b;
                                  })
                                  .map((ele) => {
                                    return week[ele];
                                  })}
                          </td>
                          <td>
                            {el?.lecture?.startTime.slice(0, 5) +
                              "-" +
                              el?.lecture?.endTime.slice(0, 5)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <div style={{ width: "48%" }}>
              <S.EditModalTag>
                <S.EditModalTagTitle>수정 범위</S.EditModalTagTitle>
                <div style={{ display: "flex" }}>
                  <S.EditModalTagTitle>현재 수업</S.EditModalTagTitle>
                  <input
                    type="radio"
                    name="isAll"
                    checked={!isAll}
                    onChange={() => {
                      setIsAll(false);
                    }}
                  ></input>
                  <S.EditModalTagTitle>수업 전체</S.EditModalTagTitle>
                  <input
                    type="radio"
                    name="isAll"
                    checked={isAll}
                    onChange={() => {
                      setIsAll(true);
                    }}
                  ></input>
                </div>
              </S.EditModalTag>

              <S.EditModalTag>
                {myData?.me?.profile?.academies?.length > 0 ? (
                  <>
                    <S.EditModalTagTitle>담당 지점</S.EditModalTagTitle>
                    <select
                      onChange={(e) => {
                        setEditAcademy(Number(e.target.value));
                      }}
                      style={{
                        borderRadius: "0.5rem",
                        border: "1px solid #DBDDE1",
                        width: "100%",
                        padding: "0.5rem 0.5rem",
                        paddingLeft: "10px",
                        fontFamily: "Spoqa Han Sans Neo",
                      }}
                    >
                      {myData?.me?.profile?.academies?.map((el) => {
                        return (
                          <option
                            value={Number(el.id)}
                            selected={
                              Number(router.query.branch) === Number(el.id)
                            }
                          >
                            {el.location}
                          </option>
                        );
                      })}
                    </select>
                  </>
                ) : (
                  <></>
                )}
              </S.EditModalTag>
              <S.EditModalTag>
                <S.EditModalTagTitle>담당 선생님</S.EditModalTagTitle>
                <select
                  onChange={(event) => {
                    setTeacherId(event.target.value);
                  }}
                  style={{
                    borderRadius: "0.5rem",
                    border: "1px solid #DBDDE1",
                    width: "100%",
                    padding: "0.5rem 0.5rem",
                    fontFamily: "Spoqa Han Sans Neo",
                  }}
                  value={teacherId}
                >
                  {userData?.allUsers
                    .filter((el) => el.userCategory === "선생님")
                    .filter((el) => {
                      return (
                        Number(el.profile.academy.id) ===
                        Number(router.query.branch)
                      );
                    })
                    .map((el) => {
                      return (
                        <option key={uuidv4()} value={el.profile.id}>
                          {el.profile.korName}
                        </option>
                      );
                    })}
                </select>
              </S.EditModalTag>
              <S.EditModalTag>
                <S.EditModalTagTitle>수정 날짜</S.EditModalTagTitle>
                <input
                  type="date"
                  defaultValue={dateToInput(date)}
                  onChange={(e) => {
                    setEditDate(e.target.value);
                  }}
                  style={{
                    width: "97%",
                    height: "2rem",
                    fontSize: "14px",
                    border: "1px solid #DBDDE1",
                    borderRadius: "8px",
                    fontFamily: "Spoqa Han Sans Neo",
                    paddingLeft: "10px",
                  }}
                ></input>
              </S.EditModalTag>
              <S.EditModalTag>
                <S.EditModalTagTitle>수업 시간</S.EditModalTagTitle>
                <S.EditModalTimeTag>
                  <input
                    type="time"
                    value={editStartTime}
                    onChange={(e) => {
                      setEditStartTime(e.target.value);
                    }}
                    style={{
                      width: "40%",
                      height: "2rem",
                      fontSize: "14px",
                      border: "1px solid #DBDDE1",
                      borderRadius: "8px",
                      fontFamily: "Spoqa Han Sans Neo",
                      paddingLeft: "10px",
                    }}
                  ></input>
                  <span>-</span>
                  <input
                    type="time"
                    value={editEndTime}
                    onChange={(e) => {
                      setEditEndTime(e.target.value);
                    }}
                    style={{
                      width: "40%",
                      height: "2rem",
                      fontSize: "14px",
                      border: "1px solid #DBDDE1",
                      borderRadius: "8px",
                      fontFamily: "Spoqa Han Sans Neo",
                      paddingLeft: "10px",
                    }}
                  ></input>
                </S.EditModalTimeTag>
              </S.EditModalTag>

              {isAll && (
                <>
                  <S.EditModalTag>
                    <S.EditModalTagTitle>수업 반복</S.EditModalTagTitle>
                    <input
                      type="checkbox"
                      checked={isEditRepeat}
                      onChange={() => {
                        setIsEditRepeat(!isEditRepeat);
                      }}
                      style={{
                        width: "20px",
                        height: "20px",
                      }}
                    ></input>
                  </S.EditModalTag>
                  {isEditRepeat && (
                    <>
                      <S.EditModalTag>
                        <S.EditModalTagTitle>반복 주</S.EditModalTagTitle>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <input
                            type="number"
                            style={{
                              width: "70%",
                              height: "2rem",
                              fontSize: "14px",
                              border: "1px solid #DBDDE1",
                              borderRadius: "8px",
                              fontFamily: "Spoqa Han Sans Neo",
                              paddingLeft: "10px",
                              backgroundColor: isEditAuto ? "#dddddd" : "",
                            }}
                            disabled={isEditAuto}
                            onChange={(e) => {
                              setEditRepeatCount(e.target.value);
                            }}
                            value={editRepeatCount}
                          ></input>
                          <span style={{ marginLeft: "1rem" }}>자동 추가</span>
                          <input
                            type="checkbox"
                            checked={isEditAuto}
                            onChange={() => {
                              setIsEditAuto(!isEditAuto);
                            }}
                            style={{
                              width: "20px",
                              height: "20px",
                            }}
                          ></input>
                        </div>
                      </S.EditModalTag>
                      <S.EditModalTag>
                        <S.EditModalTagTitle>반복 요일</S.EditModalTagTitle>
                        <S.ModalRoutineDates>
                          {week.map((el, index) => {
                            return (
                              <>
                                <S.ModalRoutineDate
                                  key={uuidv4()}
                                  onClick={onClickEditDates(index)}
                                  style={
                                    editRepeatWeek.includes(index)
                                      ? {
                                          backgroundColor: "#333",
                                          color: "#eeeeee",
                                        }
                                      : {}
                                  }
                                >
                                  {el}
                                </S.ModalRoutineDate>
                              </>
                            );
                          })}
                        </S.ModalRoutineDates>
                      </S.EditModalTag>
                    </>
                  )}
                </>
              )}

              <S.EditModalTag>
                <S.EditModalTagTitle>수업 정보</S.EditModalTagTitle>
                <S.EditTextArea
                  disabled={!isAll}
                  onChange={(e) => {
                    setEditInfo(e.target.value);
                  }}
                  style={{
                    width: "97%",
                    height: "10rem",
                    fontSize: "14px",
                    border: "1px solid #DBDDE1",
                    borderRadius: "8px",
                    fontFamily: "Spoqa Han Sans Neo",
                    paddingLeft: "10px",
                  }}
                ></S.EditTextArea>
              </S.EditModalTag>

              <S.EditModalButtonContainer>
                <S.EditModalCancelButton
                  onClick={() => {
                    setIsEdit(false);
                    setEditDate(dateToInput(date));
                    // setEditStartTime(dateToClock(date));
                    // setEditEndTime(dateToClockOneHour(date));
                    setEditInfo("");
                    setEditAcademy(Number(router.query.branch));
                    setTeacherId(
                      userData?.allUsers
                        .filter((el) => el.userCategory === "선생님")
                        .filter((el) => {
                          return (
                            Number(el.profile.academy.id) ===
                            Number(router.query.branch)
                          );
                        })[0].id
                    );
                  }}
                >
                  취소
                </S.EditModalCancelButton>
                <S.EditModalOKButton onClick={onClickUpdateLecture}>
                  저장
                </S.EditModalOKButton>
              </S.EditModalButtonContainer>
            </div>
          </div>
        </Modal>
      ) : (
        <></>
      )}
      {isDup && (
        <Modal
          open={isDup}
          footer={null}
          closable={false}
          onCancel={() => {
            setIsDup(false);
            setBarcode("");
          }}
        >
          <div
            style={{
              fontFamily: "Spoqa Han Sans Neo",
              fontSize: "1.5rem",
              fontWeight: 500,
            }}
          >
            이미 읽은 도서입니다. 정말 예약하시겠습니까?
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <button
              onClick={() => {
                setIsDup(false);
                setBarcode("");
              }}
              style={{
                borderRadius: "0.5rem",
                background: "#333",
                height: "2.75rem",
                border: "none",
                color: "#ffffff",
                width: "5rem",
                cursor: "pointer",
                marginRight: "1rem",
                fontFamily: "Spoqa Han Sans Neo",
                fontSize: "1.2rem",
                fontWeight: "500",
              }}
            >
              취소
            </button>
            <button
              style={{
                borderRadius: "0.5rem",
                background: "#dddddd",
                height: "2.75rem",
                border: "none",
                width: "5rem",
                cursor: "pointer",
                fontFamily: "Spoqa Han Sans Neo",
                fontSize: "1.2rem",
                fontWeight: "500",
              }}
              onClick={onClickConfirmBarcode}
            >
              확인
            </button>
          </div>
        </Modal>
      )}
    </S.ClassWrapper>
  );
}
