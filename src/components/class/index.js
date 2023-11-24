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
  lastCount,
  startDate,
  dateInputToDot,
  dateCalculateOnce,
  dateCalculateWeek,
  dateCalculateCount,
  dateInputToDay,
} from "../../commons/library/library";
import { Modal, Spin, Switch } from "antd";
import {
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
  GET_TEACHER,
} from "./class.query";
import Tooltip from "@/src/commons/library/tooltip";
import TooltipButton from "@/src/commons/library/buttonTooltip";
import CheckToolTip from "@/src/commons/library/tooltipcheck";
import CheckToolTipClass from "@/src/commons/library/tooltipcheckClass";

const week = ["월", "화", "수", "목", "금", "토", "일"];
const itemsPerPage = 20; // 페이지당 항목 수

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
  // 수정 부분
  const [isEdit, setIsEdit] = useState(false);
  const [editAcademy, setEditAcademy] = useState(Number(router.query.branch));
  const [editDate, setEditDate] = useState(dateToInput(date));
  const [editEndTime, setEditEndTime] = useState(dateToClockOneHour(date));
  const [editStartTime, setEditStartTime] = useState(dateToClock(date));
  const [editInfo, setEditInfo] = useState("");
  const [addRepeatCount, setAddRepeatCount] = useState(1);
  const [addRepeatInput, setAddRepeatInput] = useState([
    {
      isActive: true,
      id: "",
      index: 0,
      week: [-1],
      startTime: dateToClock(date),
      endTime: dateToClockOneHour(date),
      isAuto: false,
      isRepeat: "once",
      repeatsNum: 0,
      startDate: dateToInput(date),
      teacherId: "",
      about: "",
      isOne: false,
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
  const [manager, setManager] = useState("");
  const [classSortType, setClassSortType] = useState("default");

  // 수업 추가 통합 지점
  const onClickAddRepeatInput = (index) => () => {
    const newList = [...addRepeatInput];
    newList.push({
      isActive: true,
      id: "",
      index: index,
      week: [-1],
      startTime: dateToClock(date),
      endTime: dateToClockOneHour(date),
      isAuto: false,
      isRepeat: "once",
      repeatsNum: 0,
      startDate: dateToInput(date),
      teacherId: teacherData?.staffInAcademy
        ?.filter((el) => el?.user?.userCategory === "선생님")
        // .filter((el) => {
        //   return (
        //     Number(el.profile.academy.id) ===
        //     Number(router.query.branch)
        //   );
        // })
        ?.sort((a, b) => {
          if (Number(a.id) === Number(myData.me.id)) {
            return -1;
          } else if (Number(b.id) === Number(myData.me.id)) {
            return 1;
          } else {
            return Number(a.id) - Number(b.id);
          }
        })?.[0].id,
      about: "",
      isOne: false,
    });
    setAddRepeatInput(newList);
    setAddRepeatCount(addRepeatCount + 1);
    setSelectedAddListIndex(addRepeatInput.length);
  };
  // 일일 수업 변경 추가
  const onClickAddOneChangeList = (el, boolean) => () => {
    if (boolean) {
      if (
        lectureInfoData?.studentLectures
          ?.filter((ele) => {
            return ele?.lecture?.lectureInfo?.id === el.id;
          })
          ?.filter((ele) => {
            const newDate = new Date(ele.lecture.date);
            if (
              newDate.getDate() === calendarDate.getDate() &&
              newDate.getMonth() === calendarDate.getMonth() &&
              newDate.getFullYear() === calendarDate.getFullYear()
            ) {
              return true;
            }
            return newDate - calendarDate >= 0;
          }).length === 0
      ) {
        alert(
          dateToInput(calendarDate) +
            "(" +
            week[(calendarDate.getDay() + 6) % 7] +
            ")" +
            "이후로 변경 가능한 수업이 없습니다."
        );
        return;
      }
      const normal = lectureInfoData?.studentLectures
        ?.sort((a, b) => {
          const newADate = new Date(a?.lecture?.date);
          const newBDate = new Date(b?.lecture?.date);
          return newADate - newBDate;
        })
        ?.filter((el, i, callback) => {
          return (
            i ===
            callback.findIndex(
              (t) => t.lecture.lectureInfo.id === el.lecture.lectureInfo.id
            )
          );
        })?.[el.index];
      const newRepeatInput = [...addRepeatInput];
      const thisDate = new Date();
      newRepeatInput[el.index] = {
        isActive: true,
        id: normal?.lecture?.lectureInfo?.id,
        index: el.index,
        week: [...normal?.lecture?.lectureInfo.repeatDay].sort((a, b) => {
          return a - b;
        }),
        startTime: normal?.lecture?.startTime,
        endTime: normal?.lecture?.endTime,
        isAuto: normal?.lecture?.lectureInfo?.autoAdd,
        isRepeat: normal?.lecture?.lectureInfo?.repeatDay.includes(-1)
          ? "once"
          : normal?.lecture?.lectureInfo?.repeatTimes === null
          ? "routine"
          : "count",
        startDate: normal?.lecture?.date,
        teacherId: normal?.lecture?.teacher?.id,
        about: normal?.lecture?.lectureInfo?.about,
        repeatsNum: normal?.lecture?.lectureInfo?.repeatWeeks,
        oneChangeList: [],
        isDelete: false,
      };
      newRepeatInput[el.index].oneChangeList.push({
        branchId: Number(router.query.branch),
        teacherId: el.teacherId,
        date: dateToInput(calendarDate),
        lectureId: lectureInfoData?.studentLectures
          ?.filter((ele) => {
            return ele?.lecture?.lectureInfo?.id === el.id;
          })
          ?.filter((ele) => {
            const newDate = new Date(ele.lecture.date);
            if (
              newDate.getDate() === calendarDate.getDate() &&
              newDate.getMonth() === calendarDate.getMonth() &&
              newDate.getFullYear() === calendarDate.getFullYear()
            ) {
              return true;
            }
            return newDate - calendarDate >= 0;
          })?.[0]?.lecture?.id,
        startTime: dateToClock(thisDate),
        endTime: dateToClockOneHour(thisDate),
        about: el.about,
        studentId: addList[0],
      });
      newRepeatInput[el.index].isOne = boolean;
      setAddRepeatInput(newRepeatInput);
    } else {
      const newRepeatInput = [...addRepeatInput];
      newRepeatInput[el.index].oneChangeList = [];
      newRepeatInput[el.index].isOne = boolean;
      newRepeatInput[el.index].isActive = false;
      setAddRepeatInput(newRepeatInput);
    }
  };

  // 수업 수정 추가 지점
  const [isAll, setIsAll] = useState(false);
  const [isEditAuto, setIsEditAuto] = useState(false);
  const [isEditRepeat, setIsEditRepeat] = useState("once");
  const [editRepeatWeek, setEditRepeatWeek] = useState([]);
  const [editRepeatCount, setEditRepeatCount] = useState(0);
  const [standardDate, setStandardDate] = useState("");

  // 수업 보강 추가 지점
  const [isMakeUp, setIsMakeUp] = useState(false);
  const [makeUpDate, setMakeUpDate] = useState("");
  const [makeUpStart, setMakeUpStart] = useState();
  const [makeUpEnd, setMakeUpEnd] = useState();
  const [makeUpId, setMakeUpId] = useState();
  const [makeUpInfo, setMakeUpInfo] = useState("");
  const [makeUpTeacherId, setMakeUpTeacherId] = useState("");
  const [makeUpLectureId, setMakeUpLectureId] = useState("");
  const [makeUpStudentName, setMakeUpStudentName] = useState("");
  const [makeUpOrigin, setMakeUpOrigin] = useState("");
  const [absentDate, setAbsentDate] = useState("");
  const [absentTime, setAbsentTime] = useState("");

  const onClickOpenMakeUp = (sId, lId, el, startTime, endTime, date) => () => {
    setIsMakeUp(true);
    setTodayDate(new Date());
    setMakeUpId(sId);
    setMakeUpInfo("");
    setMakeUpStudentName(el.student.korName + " (" + el.student.engName + ")");
    setMakeUpOrigin(el.student.origin);
    setAbsentDate(date + " (" + dateInputToDay(date) + ")");
    setAbsentTime(
      startTime.slice(0, 2) +
        " : " +
        startTime.slice(3, 5) +
        " ~ " +
        endTime.slice(0, 2) +
        " : " +
        endTime.slice(3, 5)
    );
    setMakeUpTeacherId(
      teacherData?.staffInAcademy
        ?.filter((el) => el.user.userCategory === "선생님")
        ?.sort((a, b) => {
          if (Number(a.id) === Number(myData.me.id)) {
            return -1;
          } else if (Number(b.id) === Number(myData.me.id)) {
            return 1;
          } else {
            return Number(a.id) - Number(b.id);
          }
        })[0].id
    );
    setMakeUpLectureId(lId);
  };

  // 삭제 스테이트
  const [deleteDate, setDeleteDate] = useState(dateToInput(date));

  const { data: myData } = useQuery(GET_ME); //  getMe 수정 필수
  // const { data: myData } = {
  //   data: {
  //     me: {
  //       id: "9",
  //       username: "gyeonggi_teacher",
  //       userCategory: "\uc120\uc0dd\ub2d8",
  //       profile: {
  //         id: 9,
  //         korName: "\uacbd\uae30\ud37c\ud50c",
  //         engName: "gyeonggiPurple",
  //         registerDate: "2023-08-01",
  //         birthDate: "1980-01-01",
  //         academy: {
  //           id: "2",
  //           name: "\ud37c\ud50c\uc544\uce74\ub370\ubbf8",
  //           location:
  //             "\uacbd\uae30 \uc6a9\uc778\uc2dc \uc218\uc9c0\uad6c \ud3ec\uc740\ub300\ub85c 536 \uc2e0\uc138\uacc4\ubc31\ud654\uc810\uacbd\uae30\uc810 8F",
  //           __typename: "AcademyType",
  //         },
  //         __typename: "TeacherType",
  //       },
  //       __typename: "UserType",
  //     },
  //   },
  // };
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

  const { data: teacherData, refetch: refetchTeacher } = useQuery(GET_TEACHER, {
    variables: { academyId: Number(router.query.branch) },
  });

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

  // 유저 데이터 부분 수정 필요
  // const { data: userData } = useQuery(GET_USERS);
  // const { data: allLectureData, refetch: refetchList } = useQuery(
  //   GET_ALL_LECTURES,
  //   {
  //     variables: { academyId: Number(router.query.branch) },
  //   }
  // );
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
        year: Number(date.getFullYear()),
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
  const [selectedAddListIndex, setSelectedAddListIndex] = useState(0);
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
    setSelectedAddListIndex(0);
    setClassToggle(false);
    setSelectDates([]);
    setAddList([]);
    setStudentPage(0);
    setIsAuto(false);
    setAddRepeatInput([
      {
        isActive: true,
        id: "",
        index: 0,
        week: [-1],
        startTime: dateToClock(date),
        endTime: dateToClockOneHour(date),
        isAuto: false,
        isRepeat: "once",
        repeatsNum: 0,
        startDate: dateToInput(date),
        teacherId: teacherData?.staffInAcademy
          .filter((el) => el.user.userCategory === "선생님")
          // .filter((el) => {
          //   return (
          //     Number(el.profile.academy.id) === Number(router.query.branch)
          //   );
          // })
          ?.sort((a, b) => {
            if (Number(a.id) === Number(myData.me.id)) {
              return -1;
            } else if (Number(b.id) === Number(myData.me.id)) {
              return 1;
            } else {
              return Number(a.id) - Number(b.id);
            }
          })?.[0].id,
        about: "",
        isOne: false,
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

  // 수업 정렬 함수

  useEffect(() => {
    if (localStorage.getItem("classSortType") !== undefined) {
      setClassSortType(localStorage.getItem("classSortType"));
    }
  }, []);

  const onChangeClassSort = (e) => {
    setClassSortType(e.target.value);
    localStorage.setItem("classSortType", e.target.value);
    console.log(e.target.value);
  };

  useEffect(() => {
    const newList = [...addRepeatInput];
    newList.forEach((el) => {
      el.teacherId = teacherData?.staffInAcademy.filter(
        (el) => el?.user.userCategory === "선생님"
      )[0]?.id;
      // .filter((el) => {
      //   return (
      //     Number(el?.profile?.academy?.id) === Number(router.query.branch)
      //   );
      // })
    });
    setAddRepeatInput(newList);
  }, [teacherData]);

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
    setCheckList([]);
  }, [calendarDate]);

  useEffect(() => {
    setPage(1);
    // if (manager === "") {
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
          if (classSortType === "default") {
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
          } else if (classSortType === "startTime") {
            let timeA = new Date(`1970-01-01T${a.lecture.startTime}`);
            let timeB = new Date(`1970-01-01T${b.lecture.startTime}`);
            return timeA - timeB;
          } else if (classSortType === "endTime") {
            let timeA = new Date(`1970-01-01T${a.lecture.endTime}`);
            let timeB = new Date(`1970-01-01T${b.lecture.endTime}`);
            return timeA - timeB;
          } else if (classSortType === "name") {
            return a.student.korName.localeCompare(b.student.korName, "ko-KR");
          }
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
        ?.filter((el) => {
          if (manager === "") {
            return true;
          } else {
            return Number(el.lecture.teacher.id) === Number(manager);
          }
        })
    );
    // } else {
    //   let students = Array.isArray(
    //     studentListData?.getLecturesByAcademyAndDateStudents
    //   )
    //     ? [...studentListData?.getLecturesByAcademyAndDateStudents]
    //     : [];

    //   const start = (page - 1) * itemsPerPage;
    //   const end = start + itemsPerPage;

    //   setStudentArray(
    //     students
    //       .sort((a, b) =>
    //         a.student.korName.localeCompare(b.student.korName, "ko-KR")
    //       )
    //       .sort((a, b) => {
    //         let timeA = new Date(`1970-01-01T${a.lecture.startTime}`);
    //         let timeB = new Date(`1970-01-01T${b.lecture.startTime}`);
    //         if (
    //           a?.attendanceStatus?.statusDisplay === "하원" ||
    //           a?.attendanceStatus?.statusDisplay === "결석 (보강)" ||
    //           a?.attendanceStatus?.statusDisplay === "결석"
    //         ) {
    //           timeA = new Date(`1970-01-02T${a.lecture.startTime}`);
    //         }
    //         if (
    //           b?.attendanceStatus?.statusDisplay === "하원" ||
    //           b?.attendanceStatus?.statusDisplay === "결석 (보강)" ||
    //           b?.attendanceStatus?.statusDisplay === "결석"
    //         ) {
    //           timeB = new Date(`1970-01-02T${a.lecture.startTime}`);
    //         }
    //         return timeA - timeB;
    //       })
    //       ?.filter((el) => {
    //         return (
    //           el.student.korName.includes(searchWord) ||
    //           el.student.origin
    //             .toUpperCase()
    //             .includes(searchWord.toUpperCase()) ||
    //           el.student.engName
    //             .toUpperCase()
    //             .includes(searchWord.toUpperCase())
    //         );
    //       })
    //       ?.filter((el) => {
    //         return Number(el.lecture.teacher.id) === Number(manager);
    //       })
    //   );
    // }
  }, [studentListData, searchWord, manager, classSortType]);

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
      // const result = await createMakeup({
      //   variables: {
      //     date: makeUpDate,
      //     startTime: makeUpStart,
      //     endTime: makeUpEnd,
      //     lectureMemo: makeUpInfo,
      //     studentIds: [Number(makeUpId)],
      //     teacherId: Number(makeUpTeacherId),
      //     lectureId: Number(makeUpLectureId),
      //   },
      // });

      await createLecture({
        variables: {
          studentIds: [Number(makeUpId)],
          autoAdd: false,
          repeatDays: JSON.stringify({ repeat_days: [-1] }),
          teacherId: Number(makeUpTeacherId),
          repeatWeeks: 1,
          about:
            dateInputToDot(
              lectureInfoData?.studentLectures?.filter((el) => {
                return el.lecture.id === makeUpLectureId;
              })[0]?.lecture.date
            ) +
            " 보강" +
            makeUpInfo,
          lectureMemo: "",
          endTime: makeUpEnd,
          startTime: makeUpStart,
          date: makeUpDate,
          academyId: Number(makeUpLectureId),
          repeatTimes: null,
        },
      });
      alert(
        dateInputToDot(
          lectureInfoData?.studentLectures?.filter((el) => {
            return el.lecture.id === makeUpLectureId;
          })[0]?.lecture.date
        ) + "수업 보강을 생성했습니다."
      );
      setAddLectureId("");
      setStudentToggle(false);
      setAddList([]);
      setSelectDates([]);
      setSearchLecture(dateToInput(date));
      setSearchStudents("");
      // refetchLecture();
      // refetchList();
      refetchStudentList();
      refetchMonth();
      setIsMakeUp(false);
    } catch (err) {
      alert(err);
    }
    setClassToggle(false);
    setTeacherId(
      teacherData?.staffInAcademy
        ?.filter((el) => el.user.userCategory === "선생님")
        ?.sort((a, b) => {
          if (Number(a.id) === Number(myData.me.id)) {
            return -1;
          } else if (Number(b.id) === Number(myData.me.id)) {
            return 1;
          } else {
            return Number(a.id) - Number(b.id);
          }
        })?.[0].id
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

  const [open, setOpen] = useState(true);

  // useEffect(() => {
  //   setTimeout(() => {
  //     setOpen(true);
  //   }, 2700);
  // }, []);

  const onClickOk = async () => {
    // dateCalculateOnce("2023-11-09", "11:00:00", "13:00:00");
    // dateCalculateWeek("2023-11-09", "11:00:00", "13:00:00", [1, 2], 2);
    // dateCalculateCount("2023-11-09", "11:00:00", "13:00:00", [1, 2], 2);

    // 겹침 방지 테스트

    // const testCase = addRepeatInput.map((el) => {
    //   if (el.isRepeat === "once") {
    //     return dateCalculateOnce(el.startDate, el.startTime, el.endTime);
    //   }
    //   if (el.isRepeat === "count" && !el.isAuto) {
    //     return dateCalculateCount(
    //       el.startDate,
    //       el.startTime,
    //       el.endTime,
    //       el.week,
    //       el.repeatsNum
    //     );
    //   }
    //   if (el.isRepeat === "routine" && !el.isAuto) {
    //     return dateCalculateWeek(
    //       el.startDate,
    //       el.startTime,
    //       el.endTime,
    //       el.week,
    //       el.repeatsNum
    //     );
    //   }
    //   if (el.isAuto) {
    //     return dateCalculateOnce(el.startDate, el.startTime, el.endTime);
    //   }
    // });

    // console.log(testCase, "aaa");
    // return;
    let lastActive = 0;
    addRepeatInput.forEach((el, inputIndex) => {
      if (el?.isActive || el?.isDelete) {
        lastActive = inputIndex;
      }
    });
    console.log(lastActive);
    const alertArray = [];
    addList.forEach((ele) => {
      addRepeatInput.forEach(async (el, index) => {
        if (el?.id === "") {
          if (
            addRepeatInput[index].isRepeat === "count" &&
            Number(addRepeatInput[index].repeatsNum) <
              addRepeatInput[index].week.length
          ) {
            // alert(index + 1 + "번 수업의 반복 횟수가 반복 요일보다 적습니다.");
            alertArray.push(index + 1);
            return;
          }
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
                    : JSON.stringify({
                        repeat_days: addRepeatInput[index].week,
                      }),
                repeatWeeks:
                  addRepeatInput[index].isRepeat === "once" ||
                  addRepeatInput[index].isRepeat === "infinity"
                    ? 1
                    : Number(addRepeatInput[index].repeatsNum),
                autoAdd: addRepeatInput[index].isRepeat === "infinity",
                studentIds: [ele],
                repeatTimes:
                  addRepeatInput[index].isRepeat === "count"
                    ? Number(addRepeatInput[index].repeatsNum)
                    : null,
              },
            });
            if (index === lastActive) {
              setAddLectureId("");
              setStudentToggle(false);
              setAddList([]);
              setSelectDates([]);
              setSearchLecture(dateToInput(date));
              setSearchStudents("");
              // refetchList();
              refetchStudentList();
              refetchMonth();
              setStudentPage(0);
              setIsAuto(false);
              setClassToggle(false);
              setTeacherId(
                teacherData?.staffInAcademy
                  ?.filter((el) => el.user.userCategory === "선생님")
                  ?.sort((a, b) => {
                    if (Number(a.id) === Number(myData.me.id)) {
                      return -1;
                    } else if (Number(b.id) === Number(myData.me.id)) {
                      return 1;
                    } else {
                      return Number(a.id) - Number(b.id);
                    }
                  })?.[0].id
              );
              setAddClassInfo("");
              setAddClassDate(dateToInput(date));
              setAddClassStart(dateToClock(date));
              setAddClassEnd(dateToClockOneHour(date));
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          if (
            addRepeatInput[index].isRepeat === "count" &&
            Number(addRepeatInput[index].repeatsNum) <
              addRepeatInput[index].week.length
          ) {
            // alert(index + 1 + "번 수업의 반복 횟수가 반복 요일보다 적습니다.");
            alertArray.push(index + 1);
            return;
          }
          if (!el?.isDelete) {
            if (el?.isActive) {
              if (el?.isOne) {
                try {
                  await createLecture({
                    variables: {
                      academyId: Number(el?.oneChangeList?.[0]?.lectureId),
                      date: el?.oneChangeList?.[0]?.date,
                      startTime: el?.oneChangeList?.[0]?.startTime,
                      endTime: el?.oneChangeList?.[0]?.endTime,
                      lectureMemo: "",
                      about: el?.oneChangeList?.[0]?.about,
                      teacherId: el?.oneChangeList?.[0]?.teacherId,
                      repeatDays: JSON.stringify({ repeat_days: [-1] }),
                      repeatWeeks: 1,
                      autoAdd: false,
                      studentIds: [addList[0]],
                      repeatTimes: null,
                    },
                  });
                  await deleteLecture({
                    variables: {
                      id: Number(el?.oneChangeList?.[0]?.lectureId),
                    },
                  });
                  if (index === lastActive) {
                    // await refetchList();
                    await refetchStudentList();
                    await refetchMonth();
                    refetchMonth();
                    setIsEdit(false);
                    // setEditDate(dateToInput(date));
                    // setEditStartTime(dateToClock(date));
                    // setEditEndTime(dateToClockOneHour(date));
                    setEditInfo("");
                    setCheckList([]);
                    setEditAcademy(Number(router.query.branch));
                    setTeacherId(
                      teacherData?.staffInAcademy
                        ?.filter((el) => el.user.userCategory === "선생님")
                        ?.sort((a, b) => {
                          if (Number(a.id) === Number(myData.me.id)) {
                            return -1;
                          } else if (Number(b.id) === Number(myData.me.id)) {
                            return 1;
                          } else {
                            return Number(a.id) - Number(b.id);
                          }
                        })?.[0].id
                    );
                    if (alertArray.length !== 0) {
                      let alertContents = "";
                      alertArray.forEach((el, index) => {
                        if (index === alertArray.length - 1) {
                          alertContents = alertContents + el + "번 ";
                        } else {
                          alertContents = alertContents + el + "번, ";
                        }
                      });
                      alertContents =
                        alertContents +
                        "수업이 반복 횟수가 반복 요일보다 적습니다.";
                      alert(alertContents);
                      // setClassToggle(false);
                    } else {
                      alert("수업을 변경했습니다.");
                      // setClassToggle(false);
                    }
                  }
                } catch (err) {}
              } else {
                try {
                  await editLectureInfo({
                    variables: {
                      lectureInfoId: Number(el?.id),
                      date: el?.startDate,
                      about: el?.about,
                      repeatDays:
                        el.isRepeat !== "once"
                          ? JSON.stringify({ repeat_days: el?.week })
                          : JSON.stringify({ repeat_days: [-1] }),
                      repeatWeeks:
                        el.isRepeat === "once" || el.isRepeat === "infinity"
                          ? 1
                          : Number(el.repeatsNum),
                      autoAdd: el.isRepeat === "infinity",
                      studentIds: [Number(ele)],
                      startTime: el?.startTime,
                      endTime: el?.endTime,
                      academyId: Number(router.query.branch),
                      teacherId: Number(el?.teacherId),
                      repeatTimes:
                        el?.isRepeat === "count"
                          ? Number(el?.repeatsNum)
                          : null,
                    },
                  });
                  if (index === lastActive) {
                    // await refetchList();
                    await refetchStudentList();
                    await refetchMonth();
                    // refetchList();
                    refetchMonth();
                    setIsEdit(false);
                    // setEditDate(dateToInput(date));
                    // setEditStartTime(dateToClock(date));
                    // setEditEndTime(dateToClockOneHour(date));
                    setEditInfo("");
                    setCheckList([]);
                    setEditAcademy(Number(router.query.branch));
                    setTeacherId(
                      teacherData?.staffInAcademy
                        ?.filter((el) => el.user.userCategory === "선생님")
                        ?.sort((a, b) => {
                          if (Number(a.id) === Number(myData.me.id)) {
                            return -1;
                          } else if (Number(b.id) === Number(myData.me.id)) {
                            return 1;
                          } else {
                            return Number(a.id) - Number(b.id);
                          }
                        })?.[0].id
                    );
                    if (alertArray.length !== 0) {
                      let alertContents = "";
                      alertArray.forEach((el, index) => {
                        if (index === alertArray.length - 1) {
                          alertContents = alertContents + el + "번 ";
                        } else {
                          alertContents = alertContents + el + "번, ";
                        }
                      });
                      alertContents =
                        alertContents +
                        "수업이 반복 횟수가 반복 요일보다 적습니다.";
                      alert(alertContents);
                      // setClassToggle(false);
                    } else {
                      alert("수업을 변경했습니다.");
                      // setClassToggle(false);
                    }
                  }
                } catch (err) {}
              }
            }
          } else {
            try {
              const inputDate = lectureInfoData?.studentLectures
                ?.sort((a, b) => {
                  const newADate = new Date(a?.lecture?.date);
                  const newBDate = new Date(b?.lecture?.date);
                  return newADate - newBDate;
                })
                ?.filter((el, i, callback) => {
                  return (
                    i ===
                    callback.findIndex(
                      (t) =>
                        t.lecture.lectureInfo.id === el.lecture.lectureInfo.id
                    )
                  );
                })
                ?.filter((ele) => {
                  return Number(ele?.lecture.lectureInfo.id) === Number(el?.id);
                })?.[0]?.lecture?.date;
              await deleteLectureInfo({
                variables: {
                  id: el?.id,
                  date: inputDate,
                },
              });
              if (index === lastActive) {
                // await refetchList();
                await refetchStudentList();
                await refetchMonth();
                // refetchList();
                refetchMonth();
                setIsEdit(false);
                // setEditDate(dateToInput(date));
                // setEditStartTime(dateToClock(date));
                // setEditEndTime(dateToClockOneHour(date));
                setEditInfo("");
                setCheckList([]);
                setEditAcademy(Number(router.query.branch));
                setTeacherId(
                  teacherData?.staffInAcademy
                    ?.filter((el) => el.user.userCategory === "선생님")
                    ?.sort((a, b) => {
                      if (Number(a.id) === Number(myData.me.id)) {
                        return -1;
                      } else if (Number(b.id) === Number(myData.me.id)) {
                        return 1;
                      } else {
                        return Number(a.id) - Number(b.id);
                      }
                    })?.[0].id
                );
                if (alertArray.length !== 0) {
                  let alertContents = "";
                  alertArray.forEach((el, index) => {
                    if (index === alertArray.length - 1) {
                      alertContents = alertContents + el + "번 ";
                    } else {
                      alertContents = alertContents + el + "번, ";
                    }
                  });
                  alertContents =
                    alertContents +
                    "수업이 반복 횟수가 반복 요일보다 적습니다.";
                  alert(alertContents);
                  setClassToggle(false);
                } else {
                  alert("수업을 변경했습니다.");
                  setClassToggle(false);
                }
              }
            } catch {}
          }
        }
      });
    });

    // }
  };

  // const onClickPage = (pageNumber) => () => {
  //   setPage(pageNumber);
  //   let students = Array.isArray(
  //     studentListData?.getLecturesByAcademyAndDateStudents
  //   )
  //     ? [...studentListData?.getLecturesByAcademyAndDateStudents]
  //     : [];
  //   if (students.length !== 0) {
  //     const start = (pageNumber - 1) * itemsPerPage;
  //     const end = start + itemsPerPage;
  //     setStudentArray(
  //       students
  //         .sort((a, b) =>
  //           a.student.korName.localeCompare(b.student.korName, "ko-KR")
  //         )
  //         .sort((a, b) => {
  //           let timeA = new Date(`1970-01-01T${a.lecture.startTime}`);
  //           let timeB = new Date(`1970-01-01T${b.lecture.startTime}`);
  //           if (
  //             a?.attendanceStatus?.statusDisplay === "하원" ||
  //             a?.attendanceStatus?.statusDisplay === "결석 (보강)" ||
  //             a?.attendanceStatus?.statusDisplay === "결석"
  //           ) {
  //             timeA = new Date(`1970-01-02T${a.lecture.startTime}`);
  //           }
  //           if (
  //             b?.attendanceStatus?.statusDisplay === "하원" ||
  //             b?.attendanceStatus?.statusDisplay === "결석 (보강)" ||
  //             b?.attendanceStatus?.statusDisplay === "결석"
  //           ) {
  //             timeB = new Date(`1970-01-02T${a.lecture.startTime}`);
  //           }
  //           return timeA - timeB;
  //         })
  //         ?.filter((el) => {
  //           return (
  //             el.student.korName.includes(searchWord) ||
  //             el.student.origin
  //               .toUpperCase()
  //               .includes(searchWord.toUpperCase()) ||
  //             el.student.engName
  //               .toUpperCase()
  //               .includes(searchWord.toUpperCase())
  //           );
  //         })
  //         .slice(start, end)
  //     );
  //   } else {
  //     setStudentArray(students);
  //   }
  //   setCheckList([]);
  // };
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
        entryTime = new Date(lecture?.lecture?.date + " " + lateTime);
      } else if (status === "completed") {
        exitTime = new Date(lecture?.lecture?.date + " " + lateTime);
      } else if (status === "late") {
        entryTime = new Date(lecture?.lecture?.date + " " + lateTime);
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
  // const onClickAddStudents = async () => {
  //   try {
  //     const result = await addStudents({
  //       variables: {
  //         lectureId: Number(addLectureId),
  //         studentIds: addList,
  //       },
  //     });
  //     setAddLectureId("");
  //     setStudentToggle(false);
  //     setAddList([]);
  //     setSearchLecture(dateToInput(date));
  //     setSearchStudents("");
  //     refetchStudentList();
  //     refetchMonth();
  //     refetch();
  //     setStudentPage(0);
  //     alert("성공");
  //   } catch (err) {
  //     alert(err);
  //   }
  // };

  const onClickBookDelete = (id) => () => {
    const newSelects = selectBooks.filter((el) => el !== id);
    const newBookData = selectBookData.filter(
      (el) => Number(el.books[0].id) !== id
    );
    setSelectBooks(newSelects);
    setSelectBookData(newBookData);
  };

  // 수업 추가 수정 통합을 위해 수정
  const onClickStudents = (id, name, name2, origin) => async () => {
    const nId = Number(id);
    setSelectedAddListIndex(0);
    setAddRepeatInput([
      {
        isActive: true,
        id: "",
        index: 0,
        week: [-1],
        startTime: dateToClock(date),
        endTime: dateToClockOneHour(date),
        isAuto: false,
        isRepeat: "once",
        repeatsNum: 0,
        startDate: dateToInput(date),
        teacherId: "",
        about: "",
        isOne: false,
      },
    ]);
    try {
      const result = await refetchLectureInfo({ studentId: Number(id) });
      const newResult = [...result?.data?.studentLectures];
      newResult?.sort((a, b) => {
        const newADate = new Date(a?.lecture?.date);
        const newBDate = new Date(b?.lecture?.date);
        return newADate - newBDate;
      });
      const list = newResult?.filter((el, i, callback) => {
        return (
          i ===
          callback.findIndex(
            (t) => t.lecture.lectureInfo.id === el.lecture.lectureInfo.id
          )
        );
      });
      console.log(list, "list");
      const newInput = list.map((el, index) => {
        // 수업 목록
        const re = {
          isActive: false,
          id: el?.lecture?.lectureInfo?.id,
          index: index,
          week: [...el?.lecture?.lectureInfo.repeatDay].sort((a, b) => {
            return a - b;
          }),
          startTime: el?.lecture?.startTime,
          endTime: el?.lecture?.endTime,
          isAuto: el?.lecture?.lectureInfo?.autoAdd,
          isRepeat: el?.lecture?.lectureInfo?.repeatDay.includes(-1)
            ? "once"
            : el?.lecture?.lectureInfo?.autoAdd
            ? "infinity"
            : el?.lecture?.lectureInfo?.repeatTimes === null
            ? "routine"
            : "count",
          startDate: el?.lecture?.date,
          teacherId: el?.lecture?.teacher?.id,
          about: el?.lecture?.lectureInfo?.about,
          repeatsNum: el?.lecture?.lectureInfo?.repeatWeeks,
          oneChangeList: [],
          isDelete: false,
        };
        if (el?.lecture?.lectureInfo?.repeatTimes !== null) {
          re.repeatsNum = el?.lecture?.lectureInfo?.repeatTimes;
        }
        return re;
      });
      if (newInput?.length !== 0) {
        setAddRepeatInput(newInput);
      }
      console.log(newInput, "input");
    } catch (err) {
      console.log("error");
    }
    setAddListName({ korName: name, engName: name2, origin: origin });
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
      setTodayDate(new Date());
      setAddClassType("once");
      setAddRepeatInput([
        {
          isActive: true,
          id: "",
          index: 0,
          week: [-1],
          startTime: dateToClock(date),
          endTime: dateToClockOneHour(date),
          isAuto: false,
          isRepeat: "once",
          repeatsNum: 0,
          startDate: dateToInput(date),
          teacherId: Number(
            teacherData?.staffInAcademy
              .filter((el) => el.user.userCategory === "선생님")
              // .filter((el) => {
              //   return (
              //     Number(el.profile.academy.id) ===
              //     Number(router.query.branch)
              //   );
              // })
              ?.sort((a, b) => {
                if (Number(a.id) === Number(myData.me.id)) {
                  return -1;
                } else if (Number(b.id) === Number(myData.me.id)) {
                  return 1;
                } else {
                  return Number(a.id) - Number(b.id);
                }
              })?.[0]?.id
          ),
          about: "",
          isOne: false,
        },
      ]);
      await onClickStudents(
        checkList?.[0]?.studentId,
        studentData?.studentsInAcademy?.filter((el) => {
          return el.id === checkList?.[0]?.studentId;
        })?.[0]?.korName,
        studentData?.studentsInAcademy?.filter((el) => {
          return el.id === checkList?.[0]?.studentId;
        })?.[0]?.engName,
        studentData?.studentsInAcademy?.filter((el) => {
          return el.id === checkList?.[0]?.studentId;
        })?.[0]?.origin
      )();

      setClassToggle(true);
      // 여기서부터 원본
      // if (monthClassData !== undefined) {
      //   try {
      //     await refetchLectureInfo({
      //       studentId: Number(checkList[0].studentId),
      //     });
      //   } catch (err) {}
      //   setIsAll(false);
      //   setTodayDate(new Date());
      //   setIsEdit(true);
      //   const setting = monthClassData?.getLecturestudentsByAcademyAndMonth
      //     ?.filter((lecture) => {
      //       return (
      //         lecture.date ===
      //         calendarDate.getFullYear() +
      //           "-" +
      //           getMonthZero(calendarDate) +
      //           "-" +
      //           getDateZero(calendarDate)
      //       );
      //     })?.[0]
      //     ?.students?.filter((el) => {
      //       return Number(el.student.id) === checkList[0].studentId;
      //     })[0];
      //   setIsEditAuto(setting?.lecture?.lectureInfo.autoAdd);
      //   setIsEditRepeat(
      //     setting?.lecture?.lectureInfo.repeatDay.includes(-1)
      //       ? "once"
      //       : setting?.lecture?.lectureInfo.repeatTimes === null
      //       ? "routine"
      //       : "count"
      //   );
      //   setEditDate(setting?.lecture?.date);
      //   setStandardDate(setting?.lecture?.date);
      //   setEditStartTime(setting?.lecture?.startTime);
      //   setEditEndTime(setting?.lecture?.endTime);
      //   setEditInfo(setting?.lecture?.lectureInfo.about);
      //   if (!setting?.lecture?.lectureInfo.repeatDay.includes(-1)) {
      //     setEditRepeatWeek(setting?.lecture?.lectureInfo.repeatDay);
      //     setEditRepeatCount(setting?.lecture?.lectureInfo.repeatWeeks);
      //   } else {
      //     setEditRepeatCount(1);
      //     setEditRepeatWeek([]);
      //   }
      // }
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
    if (addList.length === 0 || addRepeatInput[ind].isOne) {
      return;
    }

    const newInput = [...addRepeatInput];
    const newDates = [...newInput[ind].week].filter((el) => {
      return el !== -1;
    });
    if (newDates.includes(index)) {
      newInput[ind].week = newDates.filter((el) => index !== el);
    } else {
      newDates.push(index);
      newInput[ind].week = newDates;
    }
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
  };

  const onChangeRepeatStartTime = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].startTime = e.target.value;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeRepeatEndTime = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].endTime = e.target.value;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeRepeatTeacherId = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].teacherId = e.target.value;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeRepeatDate = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].startDate = e.target.value;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeRepeatIsRepeat = (ind, value) => () => {
    const newInput = [...addRepeatInput];
    newInput[ind].isRepeat = value;
    newInput[ind].isAuto = false;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  // 자동 생성 원래 함수
  const onChangeRepeatIsAuto = (ind) => () => {
    const newInput = [...addRepeatInput];
    newInput[ind].isAuto = !newInput[ind].isAuto;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeRepeatAbout = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].about = e.target.value;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeRepeatCount = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].repeatsNum = e.target.value;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onClickAddRepeatDelete = (ind) => (e) => {
    e.stopPropagation();
    if (addRepeatInput.length !== 1) {
      const newInput = [...addRepeatInput];
      setAddRepeatInput(
        newInput.filter((_, index) => {
          return ind !== index;
        })
      );
    }
    if (ind <= selectedAddListIndex) {
      setSelectedAddListIndex(0);
    }
  };

  const onChangeOneId = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].oneChangeList[0].lectureId = e.target.value;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeOneDate = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].oneChangeList[0].date = e.target.value;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeOneAbout = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].oneChangeList[0].about = e.target.value;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onChangeOneStartTime = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].oneChangeList[0].startTime = e.target.value;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };
  const onChangeOneEndTime = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].oneChangeList[0].endTime = e.target.value;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };
  const onChangeOneBranch = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].oneChangeList[0].branchId = e.target.value;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };
  const onChangeOneTeacher = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].oneChangeList[0].teacherId = e.target.value;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onClickSelectRepeatInput = (ind) => () => {
    if (!addRepeatInput[ind]?.isDelete) {
      setSelectedAddListIndex(ind);
    }
  };

  const onClickDeleteRepeatInput = (ind) => () => {
    if (addRepeatInput[ind]?.id === "") {
      if (addRepeatInput.length !== 1) {
        const newInput = [...addRepeatInput];
        setAddRepeatInput(
          newInput.filter((_, index) => {
            return ind !== index;
          })
        );
      }
      if (ind <= selectedAddListIndex) {
        setSelectedAddListIndex(0);
      }
    } else {
      const newRepeatInput = [...addRepeatInput];
      newRepeatInput[ind].isDelete = !addRepeatInput[ind]?.isDelete;
      setAddRepeatInput(newRepeatInput);
      if (ind === selectedAddListIndex) {
        let minIndex = 0;
        for (let i = 0; i < addRepeatInput?.length; i++) {
          if (!addRepeatInput[i]?.isDelete) {
            minIndex = i;
            break;
          }
        }
        setSelectedAddListIndex(minIndex);
      }
    }
  };

  //수업 추가 반복 여기까지

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
    setManager("");
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
      if (
        isEditRepeat === "count" &&
        editRepeatWeek.length > Number(editRepeatCount)
      ) {
        alert("반복 횟수가 반복 요일보다 적습니다.");
        return;
      }
      try {
        await editLectureInfo({
          variables: {
            lectureInfoId: Number(checkList[0].lectureInfoId),
            date: editDate,
            about: editInfo,
            repeatDays:
              isEditRepeat !== "once"
                ? JSON.stringify({ repeat_days: editRepeatWeek })
                : JSON.stringify({ repeat_days: [-1] }),
            repeatWeeks: isEditRepeat !== "once" ? Number(editRepeatCount) : 1,
            autoAdd: isEditAuto,
            studentIds: [Number(checkList[0].studentId)],
            startTime: editStartTime,
            endTime: editEndTime,
            academyId: Number(editAcademy),
            teacherId: Number(teacherId),
            repeatTimes:
              isEditRepeat === "count" ? Number(editRepeatCount) : null,
          },
        });
        // await refetchList();
        await refetchStudentList();
        await refetchMonth();
        // refetchList();
        refetchMonth();
        setIsEdit(false);
        // setEditDate(dateToInput(date));
        // setEditStartTime(dateToClock(date));
        // setEditEndTime(dateToClockOneHour(date));
        setEditInfo("");
        setCheckList([]);
        setEditAcademy(Number(router.query.branch));
        setTeacherId(
          teacherData?.staffInAcademy
            ?.filter((el) => el.user.userCategory === "선생님")
            ?.sort((a, b) => {
              if (Number(a.id) === Number(myData.me.id)) {
                return -1;
              } else if (Number(b.id) === Number(myData.me.id)) {
                return 1;
              } else {
                return Number(a.id) - Number(b.id);
              }
            })?.[0].id
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
          // refetchList();
          refetchStudentList();
          refetchMonth();
          setIsEdit(false);
          // setEditDate(dateToInput(date));
          // setEditStartTime(dateToClock(date));
          // setEditEndTime(dateToClockOneHour(date));
          setEditInfo("");
          setCheckList([]);
          setEditAcademy(Number(router.query.branch));
          setTeacherId(
            teacherData?.staffInAcademy
              ?.filter((el) => el.user.userCategory === "선생님")
              ?.sort((a, b) => {
                if (Number(a.id) === Number(myData.me.id)) {
                  return -1;
                } else if (Number(b.id) === Number(myData.me.id)) {
                  return 1;
                } else {
                  return Number(a.id) - Number(b.id);
                }
              })?.[0].id
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
          ?.filter((el) => {
            return el.user.isActive;
          })
          .sort((a, b) => a.korName.localeCompare(b.korName, "ko-KR")),
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
          ?.filter((el) => {
            return el.user.isActive;
          })
          .sort((a, b) => a.korName.localeCompare(b.korName, "ko-KR"))
          ?.filter((el) => {
            return (
              el?.origin
                ?.toUpperCase()
                ?.includes(searchStudents.toUpperCase()) ||
              el?.korName?.includes(searchStudents)
            );
          })
      );
    }
  }, [searchStudents]);

  // const onClickStudentPage = (index) => () => {
  //   const start = index * itemsPerPage;
  //   const end = start + itemsPerPage;
  //   const newArray = [
  //     ...studentData?.studentsInAcademy
  //       .sort((a, b) => a.korName.localeCompare(b.korName, "ko-KR"))
  //       ?.filter((el) => {
  //         return (
  //           el?.origin?.toUpperCase()?.includes(searchStudents.toUpperCase()) ||
  //           el?.korName?.includes(searchStudents)
  //         );
  //       }),
  //   ];
  //   setAllStudent(newArray);
  //   setStudentPage(index);
  // };

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
    if (teacherData !== undefined && myData !== undefined) {
      setTeacherId(
        teacherData?.staffInAcademy
          ?.filter((el) => el.user.userCategory === "선생님")
          ?.sort((a, b) => {
            if (Number(a.id) === Number(myData.me.id)) {
              return -1;
            } else if (Number(b.id) === Number(myData.me.id)) {
              return 1;
            } else {
              return Number(a.id) - Number(b.id);
            }
          })?.[0]?.id
      );
    }
  }, [teacherData, myData]);

  useEffect(() => {
    setIsNotificationCustom(settingData?.academyInfo?.endNotificationCustom);
    setIntervalTime(settingData?.academyInfo?.notificationInterval);
  }, [settingData]);

  useEffect(() => {
    if (isViewTitle) {
      const handleMouseMove = (e) => {
        const x = e.clientX + 10;
        const y = e.clientY;
        setMousePosition({ x, y });
      };
      document.addEventListener("mousemove", handleMouseMove);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, [isViewTitle]);

  useEffect(() => {
    setEditAcademy(Number(router.query.branch));
  }, [myData]);

  //프레젠터 시작

  return (
    <>
      {open ? (
        <S.ClassWrapper>
          <style>{`
            table {
              border-collapse: separate;
              border-spacing: 0;
              border-radius: 0.125rem;
              border: 1px solid #DBDDE1;
              width: 100rem;
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

          <S.CalendarLine>
            <S.CalendarSpan
              style={
                !lookCalendar
                  ? {
                      borderBottom: "3px solid #791285",
                      color: "#791285",
                      fontWeight: 500,
                    }
                  : {}
              }
              onClick={() => {
                setLookCalendar(false);
              }}
            >
              출석 관리
            </S.CalendarSpan>
            <S.CalendarSpan
              style={
                lookCalendar
                  ? {
                      borderBottom: "3px solid #791285",
                      color: "#791285",
                      fontWeight: 500,
                    }
                  : {}
              }
              onClick={() => {
                setLookCalendar(true);
              }}
            >
              달력별 보기
            </S.CalendarSpan>
          </S.CalendarLine>

          {!lookCalendar ? (
            <>
              <S.ClassSubTitle>출석 관리</S.ClassSubTitle>
              <div
                style={{
                  display: "flex",
                  width: "90rem",
                  justifyContent: "flex-end",
                }}
              >
                <S.SettingButton
                  style={{ marginRight: "0.62rem" }}
                  onClick={() => {
                    setTodayDate(new Date());
                    setClassToggle(true);
                    setAddClassType("once");
                    setAddRepeatInput([
                      {
                        isActive: true,
                        id: "",
                        index: 0,
                        week: [-1],
                        startTime: dateToClock(date),
                        endTime: dateToClockOneHour(date),
                        isAuto: false,
                        isRepeat: "once",
                        repeatsNum: 0,
                        startDate: dateToInput(date),
                        teacherId: Number(
                          teacherData?.staffInAcademy
                            .filter((el) => el.user.userCategory === "선생님")
                            // .filter((el) => {
                            //   return (
                            //     Number(el.profile.academy.id) ===
                            //     Number(router.query.branch)
                            //   );
                            // })
                            ?.sort((a, b) => {
                              if (Number(a.id) === Number(myData.me.id)) {
                                return -1;
                              } else if (
                                Number(b.id) === Number(myData.me.id)
                              ) {
                                return 1;
                              } else {
                                return Number(a.id) - Number(b.id);
                              }
                            })?.[0]?.id
                        ),
                        about: "",
                        isOne: false,
                      },
                    ]);
                  }}
                >
                  <svg
                    width="10"
                    height="11"
                    viewBox="0 0 10 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: "0.25rem" }}
                  >
                    <path
                      d="M9.65625 6.15625H5.65625V10.1562H4.34375V6.15625H0.34375V4.84375H4.34375V0.84375H5.65625V4.84375H9.65625V6.15625Z"
                      fill="#333333"
                    />
                  </svg>
                  수업 추가
                </S.SettingButton>
                <S.SettingButton
                  onClick={() => {
                    setIsSetting(true);
                  }}
                >
                  <svg
                    width="14"
                    height="15"
                    viewBox="0 0 14 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: "0.25rem" }}
                  >
                    <path
                      d="M3.6875 11.4688C4.60417 12.3854 5.70833 12.8438 7 12.8438C8.29167 12.8438 9.38542 12.3854 10.2812 11.4688C11.1979 10.5521 11.6562 9.44792 11.6562 8.15625C11.6562 6.86458 11.1979 5.77083 10.2812 4.875C9.38542 3.95833 8.29167 3.5 7 3.5C5.70833 3.5 4.60417 3.95833 3.6875 4.875C2.79167 5.77083 2.34375 6.86458 2.34375 8.15625C2.34375 9.44792 2.79167 10.5521 3.6875 11.4688ZM2.75 3.9375C3.91667 2.75 5.33333 2.15625 7 2.15625C8.66667 2.15625 10.0833 2.75 11.25 3.9375C12.4167 5.10417 13 6.51042 13 8.15625C13 9.80208 12.4167 11.2188 11.25 12.4062C10.0833 13.5729 8.66667 14.1562 7 14.1562C5.33333 14.1562 3.91667 13.5729 2.75 12.4062C1.58333 11.2188 1 9.80208 1 8.15625C1 6.51042 1.58333 5.10417 2.75 3.9375ZM7.34375 4.84375V8.34375L10 9.90625L9.5 10.7188L6.34375 8.84375V4.84375H7.34375ZM4.25 1.75L1.1875 4.3125L0.34375 3.3125L3.40625 0.75L4.25 1.75ZM13.6562 3.3125L12.8125 4.34375L9.75 1.75L10.5938 0.75L13.6562 3.3125Z"
                      fill="#333333"
                    />
                  </svg>
                  알람 설정
                </S.SettingButton>
              </div>
              <S.ClassTopMenu>
                <S.DateBox>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <S.DateMoveButton onClick={onClickMoveDate(-1)}>
                      <svg
                        width="5"
                        height="10"
                        viewBox="0 0 5 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.67969 0.820312V9.17969L0.5 5L4.67969 0.820312Z"
                          fill="#858585"
                        />
                      </svg>
                    </S.DateMoveButton>
                    <S.ClassDate onClick={onClickCalendar}>
                      {dateToString(calendarDate) +
                        " (" +
                        dateInputToDay(dateToInput(calendarDate)) +
                        ")"}
                    </S.ClassDate>
                    <S.DateMoveButton onClick={onClickMoveDate(+1)}>
                      <svg
                        width="5"
                        height="10"
                        viewBox="0 0 5 10"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M0.320312 9.17969V0.820312L4.5 5L0.320312 9.17969Z"
                          fill="#858585"
                        />
                      </svg>
                    </S.DateMoveButton>
                  </div>

                  {isCalendar ? (
                    <div
                      style={{
                        position: "absolute",
                        zIndex: 50,
                        left: "44rem",
                        top:
                          myData?.me?.profile?.academies?.length > 0
                            ? "33.2rem"
                            : "33.2rem",
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "90rem",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                }}
              >
                {myData?.me?.profile?.academies?.length > 0 ? (
                  <div style={{ marginRight: "5rem" }}>
                    <S.SettingSpan>지점</S.SettingSpan>
                    <S.SettingSelect
                      onChange={onChangeAcademy}
                      // style={{
                      //   width: "200px",
                      //   height: "30px",
                      //   fontSize: "14px",
                      //   border: "1px solid #DBDDE1",
                      //   borderRadius: "8px",
                      //   fontFamily: "Spoqa Han Sans Neo",
                      //   paddingLeft: "10px",
                      // }}
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
                    </S.SettingSelect>
                  </div>
                ) : (
                  <></>
                )}
                {teacherData !== undefined && (
                  <div style={{ marginRight: "5rem" }}>
                    <S.SettingSpan>담당 선생님</S.SettingSpan>
                    <S.SettingSelect
                      onChange={(e) => {
                        setManager(e.target.value);
                      }}
                    >
                      <option value={""}>전체</option>
                      {teacherData?.staffInAcademy
                        ?.filter((el) => el.user.userCategory === "선생님")
                        ?.map((el) => {
                          return <option value={el?.id}>{el?.korName}</option>;
                        })}
                    </S.SettingSelect>
                  </div>
                )}
                <div>
                  <S.SettingSpan>수업 정렬</S.SettingSpan>
                  <S.SettingSelect onChange={onChangeClassSort}>
                    <option
                      selected={classSortType === "default"}
                      value={"default"}
                    >
                      기본 정렬
                    </option>
                    <option
                      selected={classSortType === "startTime"}
                      value={"startTime"}
                    >
                      시작 시간
                    </option>

                    <option
                      selected={classSortType === "endTime"}
                      value={"endTime"}
                    >
                      종료 시간
                    </option>
                    <option selected={classSortType === "name"} value={"name"}>
                      원생 이름
                    </option>
                  </S.SettingSelect>
                </div>
              </div>
              <S.ClassMiddleBox>
                <S.ClassMiddleTag>
                  <S.CountNumber style={{ marginRight: "2.5rem" }}>
                    {"전체 " + (studentArray?.length ?? 0) + "명"}
                  </S.CountNumber>
                  <S.ClassSmallRedButton
                    onClick={() => {
                      setTodayDate(new Date());
                      setIsAttendance(true);
                      setIsLate(false);
                      setIsComplete(false);
                    }}
                  >
                    <svg
                      width="12"
                      height="15"
                      viewBox="0 0 12 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginRight: "0.42rem" }}
                    >
                      <path
                        d="M2.34375 0.84375C1.96875 0.84375 1.64583 0.979167 1.375 1.25C1.125 1.5 1 1.80208 1 2.15625C1 2.53125 1.125 2.85417 1.375 3.125C1.64583 3.375 1.96875 3.5 2.34375 3.5C2.69792 3.5 3 3.375 3.25 3.125C3.52083 2.85417 3.65625 2.53125 3.65625 2.15625C3.65625 1.80208 3.52083 1.5 3.25 1.25C3 0.979167 2.69792 0.84375 2.34375 0.84375ZM8.34375 5.84375C8.34375 5.55208 8.4375 5.3125 8.625 5.125C8.8125 4.9375 9.05208 4.84375 9.34375 4.84375C9.61458 4.84375 9.84375 4.9375 10.0312 5.125C10.2396 5.3125 10.3438 5.55208 10.3438 5.84375C10.3438 6.11458 10.2396 6.35417 10.0312 6.5625C9.84375 6.75 9.61458 6.84375 9.34375 6.84375C9.05208 6.84375 8.8125 6.75 8.625 6.5625C8.4375 6.35417 8.34375 6.11458 8.34375 5.84375ZM10.3438 7.5C10.6146 7.5 10.8438 7.60417 11.0312 7.8125C11.2396 8 11.3438 8.22917 11.3438 8.5V10.8438H10.6562V14.1562H8V9.4375L7.5 10.1562H6.03125L4.34375 7.25V14.1562H1V9.5H0V5.5C0 5.125 0.125 4.8125 0.375 4.5625C0.645833 4.29167 0.96875 4.15625 1.34375 4.15625H3.34375C3.57292 4.15625 3.78125 4.21875 3.96875 4.34375C4.17708 4.46875 4.34375 4.63542 4.46875 4.84375L6.875 8.96875L7.46875 8.0625C7.57292 7.89583 7.70833 7.76042 7.875 7.65625C8.0625 7.55208 8.25 7.5 8.4375 7.5H10.3438Z"
                        fill="#1E9A2A"
                      />
                    </svg>
                    등원
                  </S.ClassSmallRedButton>

                  <S.ClassSmallRedButton
                    onClick={() => {
                      setTodayDate(new Date());
                      setIsAttendance(false);
                      setIsLate(true);
                      setIsComplete(false);
                    }}
                    style={{ marginLeft: "0.75rem" }}
                  >
                    <svg
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginRight: "0.42rem" }}
                    >
                      <path
                        d="M9.8125 10.3125L10.3438 9.4375L7.34375 7.625V4.15625H6.34375V8.15625L9.8125 10.3125ZM2.28125 2.8125C3.59375 1.5 5.16667 0.84375 7 0.84375C8.83333 0.84375 10.3958 1.5 11.6875 2.8125C13 4.10417 13.6562 5.66667 13.6562 7.5C13.6562 9.33333 13 10.9062 11.6875 12.2188C10.3958 13.5104 8.83333 14.1562 7 14.1562C5.16667 14.1562 3.59375 13.5104 2.28125 12.2188C0.989583 10.9062 0.34375 9.33333 0.34375 7.5C0.34375 5.66667 0.989583 4.10417 2.28125 2.8125Z"
                        fill="#EB760F"
                      />
                    </svg>
                    지각
                  </S.ClassSmallRedButton>
                  <S.ClassSmallRedButton
                    onClick={() => {
                      setTodayDate(new Date());
                      setIsAttendance(false);
                      setIsLate(false);
                      setIsComplete(true);
                    }}
                    style={{ marginLeft: "0.75rem" }}
                  >
                    <svg
                      width="14"
                      height="12"
                      viewBox="0 0 14 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginRight: "0.42rem" }}
                    >
                      <path
                        d="M5.65625 5.15625H8.34375C8.34375 4.80208 8.20833 4.5 7.9375 4.25C7.66667 3.97917 7.35417 3.84375 7 3.84375C6.64583 3.84375 6.33333 3.97917 6.0625 4.25C5.79167 4.5 5.65625 4.80208 5.65625 5.15625ZM11.6562 4.6875L13.6562 6.5H11.6562V11.8438H8.34375V7.84375H5.65625V11.8438H2.34375V6.5H0.34375L7 0.5L9.65625 2.90625V1.15625H11.6562V4.6875Z"
                        fill="#F9B200"
                      />
                    </svg>
                    하원
                  </S.ClassSmallRedButton>

                  <S.ClassSmallRedButton
                    onClick={() => {
                      setIsConfirm(true);
                      setConfirmState("결석");
                    }}
                    style={{ marginLeft: "0.75rem" }}
                  >
                    <svg
                      width="14"
                      height="15"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ marginRight: "0.42rem" }}
                    >
                      <path
                        d="M7 0.84375C7.91667 0.84375 8.77083 1.02083 9.5625 1.375C10.375 1.70833 11.0833 2.1875 11.6875 2.8125C12.3125 3.41667 12.7917 4.125 13.125 4.9375C13.4792 5.72917 13.6562 6.58333 13.6562 7.5C13.6562 8.41667 13.4792 9.28125 13.125 10.0938C12.7917 10.8854 12.3125 11.5938 11.6875 12.2188C11.0833 12.8229 10.375 13.3021 9.5625 13.6562C8.77083 13.9896 7.91667 14.1562 7 14.1562C6.08333 14.1562 5.21875 13.9896 4.40625 13.6562C3.61458 13.3021 2.90625 12.8229 2.28125 12.2188C1.67708 11.5938 1.19792 10.8854 0.84375 10.0938C0.510417 9.28125 0.34375 8.41667 0.34375 7.5C0.34375 6.58333 0.510417 5.72917 0.84375 4.9375C1.19792 4.125 1.67708 3.41667 2.28125 2.8125C2.90625 2.1875 3.61458 1.70833 4.40625 1.375C5.21875 1.02083 6.08333 0.84375 7 0.84375ZM10.3438 8.15625V6.84375H3.65625V8.15625H10.3438Z"
                        fill="#E91432"
                      />
                    </svg>
                    결석
                  </S.ClassSmallRedButton>
                </S.ClassMiddleTag>
                <S.ClassMiddleTag>
                  <S.ClassInput
                    type="text"
                    onChange={onChangeSearch}
                    placeholder="      원번 혹은 이름을 입력하세요."
                  ></S.ClassInput>
                </S.ClassMiddleTag>
              </S.ClassMiddleBox>
              {studentArray?.length !== 0 && (
                <div
                  style={{
                    height: studentArray.length > 16 ? "45rem" : "",
                    overflowY: studentArray.length > 16 ? "scroll" : "",
                    marginBottom: "0.67rem",
                  }}
                >
                  <table style={{ width: "90rem", borderCollapse: "collapse" }}>
                    <thead
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 5, // 스크롤 시 헤더가 다른 콘텐츠 위로 올라오도록 함
                      }}
                    >
                      <tr>
                        <S.ClassTh style={{ width: "2.25rem", padding: "2px" }}>
                          <input
                            type="checkbox"
                            style={{ width: "1rem", height: "1rem" }}
                            checked={
                              checkList.length !== 0 &&
                              studentArray.length === checkList.length
                            }
                            onChange={onChangeAllSelect}
                          ></input>
                        </S.ClassTh>
                        <S.ClassTh style={{ width: "6.37rem" }}>
                          원생 번호
                        </S.ClassTh>
                        <S.ClassTh style={{ width: "13.5rem" }} colSpan={3}>
                          원생 이름
                        </S.ClassTh>
                        <S.ClassTh style={{ width: "5.12rem" }}>
                          시작 시간
                        </S.ClassTh>
                        <S.ClassTh style={{ width: "5.12rem" }}>
                          종료 시간
                        </S.ClassTh>
                        <S.ClassTh style={{ width: "7.12rem" }}>
                          출결 상태
                        </S.ClassTh>
                        <S.ClassTh style={{ width: "5.12rem" }}>
                          등원 시간
                        </S.ClassTh>
                        <S.ClassTh style={{ width: "6.95rem" }}>
                          하원 시간
                        </S.ClassTh>
                        <S.ClassTh
                          onMouseEnter={() => {
                            setIsViewTitle(false);
                          }}
                          style={{ width: "19.5rem", maxWidth: "19.5rem" }}
                        >
                          강의 정보
                        </S.ClassTh>
                        <S.ClassTh style={{ width: "6.37rem" }}>
                          예약 도서
                        </S.ClassTh>
                        <S.ClassTh style={{ width: "6.37rem" }}>
                          수업 준비
                        </S.ClassTh>
                        <S.ClassTh style={{ width: "6.37rem" }}>
                          원생 메모
                        </S.ClassTh>
                      </tr>
                    </thead>
                    <tbody>
                      {studentArray?.map((el) => {
                        return (
                          <tr key={el.id || uuidv4()}>
                            <S.ClassTd
                              style={{ width: "20px", padding: "3px" }}
                            >
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
                                style={{ width: "1rem", height: "1rem" }}
                                checked={checkList.some((ele) => {
                                  return (
                                    Number(ele.studentId) ===
                                      Number(el.student.id) &&
                                    Number(ele.lectureId) ===
                                      Number(el.lecture.id)
                                  );
                                })}
                              ></input>
                            </S.ClassTd>
                            <S.ClassTd>{el.student.origin}</S.ClassTd>
                            <S.ClassTd
                              style={{
                                borderRight: "none",
                                textAlign: "end",
                                width: "6.8rem",
                                padding: 0,
                              }}
                            >
                              {el.student.korName}
                            </S.ClassTd>
                            <S.ClassTd
                              style={{
                                borderLeft: "none",
                                borderRight: "none",
                                padding: 0,
                                paddingRight: "5px",
                                width: "4.7rem",
                                maxWidth: "4.7rem",
                                textAlign: "start",
                                // overflow: "hidden",
                                // textOverflow: "ellipsis",
                              }}
                            >
                              {/* {"(" + el.student.engName + ")"} */}
                              <CheckToolTipClass
                                text={"(" + el.student.engName + ")"}
                                number={80}
                                korName={el?.student?.korName}
                              ></CheckToolTipClass>
                            </S.ClassTd>
                            <S.ClassTd
                              style={{
                                width: "2rem",
                                maxWidth: "2rem",
                                borderLeft: "none",
                                padding: "0",
                              }}
                            >
                              {" "}
                              <SearchOutlined
                                onClick={() => {
                                  localStorage.setItem(
                                    "academyDetailTab",
                                    "profile"
                                  );
                                  router.push(
                                    `/${router.query.branch}/academy/${el?.student?.id}`
                                  );
                                }}
                              />
                            </S.ClassTd>
                            <S.ClassTd
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
                            </S.ClassTd>
                            <S.ClassTd>
                              {timeToHour(el.lecture.endTime)}
                            </S.ClassTd>
                            <S.ClassTd>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {el?.attendanceStatus?.statusDisplay ===
                                  "등원" && (
                                  <svg
                                    width="12"
                                    height="15"
                                    viewBox="0 0 12 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ marginRight: "0.5rem" }}
                                  >
                                    <path
                                      d="M2.34375 0.84375C1.96875 0.84375 1.64583 0.979167 1.375 1.25C1.125 1.5 1 1.80208 1 2.15625C1 2.53125 1.125 2.85417 1.375 3.125C1.64583 3.375 1.96875 3.5 2.34375 3.5C2.69792 3.5 3 3.375 3.25 3.125C3.52083 2.85417 3.65625 2.53125 3.65625 2.15625C3.65625 1.80208 3.52083 1.5 3.25 1.25C3 0.979167 2.69792 0.84375 2.34375 0.84375ZM8.34375 5.84375C8.34375 5.55208 8.4375 5.3125 8.625 5.125C8.8125 4.9375 9.05208 4.84375 9.34375 4.84375C9.61458 4.84375 9.84375 4.9375 10.0312 5.125C10.2396 5.3125 10.3438 5.55208 10.3438 5.84375C10.3438 6.11458 10.2396 6.35417 10.0312 6.5625C9.84375 6.75 9.61458 6.84375 9.34375 6.84375C9.05208 6.84375 8.8125 6.75 8.625 6.5625C8.4375 6.35417 8.34375 6.11458 8.34375 5.84375ZM10.3438 7.5C10.6146 7.5 10.8438 7.60417 11.0312 7.8125C11.2396 8 11.3438 8.22917 11.3438 8.5V10.8438H10.6562V14.1562H8V9.4375L7.5 10.1562H6.03125L4.34375 7.25V14.1562H1V9.5H0V5.5C0 5.125 0.125 4.8125 0.375 4.5625C0.645833 4.29167 0.96875 4.15625 1.34375 4.15625H3.34375C3.57292 4.15625 3.78125 4.21875 3.96875 4.34375C4.17708 4.46875 4.34375 4.63542 4.46875 4.84375L6.875 8.96875L7.46875 8.0625C7.57292 7.89583 7.70833 7.76042 7.875 7.65625C8.0625 7.55208 8.25 7.5 8.4375 7.5H10.3438Z"
                                      fill="#1E9A2A"
                                    />
                                  </svg>
                                )}
                                {el?.attendanceStatus?.statusDisplay ===
                                  "지각" && (
                                  <svg
                                    width="14"
                                    height="15"
                                    viewBox="0 0 14 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ marginRight: "0.4rem" }}
                                  >
                                    <path
                                      d="M9.8125 10.3125L10.3438 9.4375L7.34375 7.625V4.15625H6.34375V8.15625L9.8125 10.3125ZM2.28125 2.8125C3.59375 1.5 5.16667 0.84375 7 0.84375C8.83333 0.84375 10.3958 1.5 11.6875 2.8125C13 4.10417 13.6562 5.66667 13.6562 7.5C13.6562 9.33333 13 10.9062 11.6875 12.2188C10.3958 13.5104 8.83333 14.1562 7 14.1562C5.16667 14.1562 3.59375 13.5104 2.28125 12.2188C0.989583 10.9062 0.34375 9.33333 0.34375 7.5C0.34375 5.66667 0.989583 4.10417 2.28125 2.8125Z"
                                      fill="#EB760F"
                                    />
                                  </svg>
                                )}
                                {el?.attendanceStatus?.statusDisplay ===
                                  "하원" && (
                                  <svg
                                    width="14"
                                    height="12"
                                    viewBox="0 0 14 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ marginRight: "0.4rem" }}
                                  >
                                    <path
                                      d="M5.65625 5.15625H8.34375C8.34375 4.80208 8.20833 4.5 7.9375 4.25C7.66667 3.97917 7.35417 3.84375 7 3.84375C6.64583 3.84375 6.33333 3.97917 6.0625 4.25C5.79167 4.5 5.65625 4.80208 5.65625 5.15625ZM11.6562 4.6875L13.6562 6.5H11.6562V11.8438H8.34375V7.84375H5.65625V11.8438H2.34375V6.5H0.34375L7 0.5L9.65625 2.90625V1.15625H11.6562V4.6875Z"
                                      fill="#F9B200"
                                    />
                                  </svg>
                                )}
                                {el?.attendanceStatus?.statusDisplay ===
                                  "결석" && (
                                  <svg
                                    width="14"
                                    height="15"
                                    viewBox="0 0 14 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    style={{ marginRight: "0.4rem" }}
                                  >
                                    <path
                                      d="M7 0.84375C7.91667 0.84375 8.77083 1.02083 9.5625 1.375C10.375 1.70833 11.0833 2.1875 11.6875 2.8125C12.3125 3.41667 12.7917 4.125 13.125 4.9375C13.4792 5.72917 13.6562 6.58333 13.6562 7.5C13.6562 8.41667 13.4792 9.28125 13.125 10.0938C12.7917 10.8854 12.3125 11.5938 11.6875 12.2188C11.0833 12.8229 10.375 13.3021 9.5625 13.6562C8.77083 13.9896 7.91667 14.1562 7 14.1562C6.08333 14.1562 5.21875 13.9896 4.40625 13.6562C3.61458 13.3021 2.90625 12.8229 2.28125 12.2188C1.67708 11.5938 1.19792 10.8854 0.84375 10.0938C0.510417 9.28125 0.34375 8.41667 0.34375 7.5C0.34375 6.58333 0.510417 5.72917 0.84375 4.9375C1.19792 4.125 1.67708 3.41667 2.28125 2.8125C2.90625 2.1875 3.61458 1.70833 4.40625 1.375C5.21875 1.02083 6.08333 0.84375 7 0.84375ZM10.3438 8.15625V6.84375H3.65625V8.15625H10.3438Z"
                                      fill="#E91432"
                                    />
                                  </svg>
                                )}
                                {el?.attendanceStatus?.statusDisplay ?? ""}
                                {el?.attendanceStatus?.statusDisplay ===
                                  "결석" && (
                                  <TooltipButton
                                    text={"보강 추가"}
                                    button={true}
                                  >
                                    <button
                                      style={{
                                        cursor: "pointer",
                                        padding: "2px",
                                        backgroundColor: "#fff",
                                        borderRadius: "0.25rem",
                                        border: "1px solid #c8c8c8",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginLeft: "3px",
                                      }}
                                      onClick={onClickOpenMakeUp(
                                        el.student.id,
                                        el.lecture.id,
                                        el,
                                        el.lecture.startTime,
                                        el.lecture.endTime,
                                        el.lecture.date
                                      )}
                                    >
                                      <svg
                                        width="19"
                                        height="18"
                                        viewBox="0 0 19 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M7.32031 5.67969H8.57031V10.0938L11.9297 12.0859L11.2656 13.1016L7.32031 10.6797V5.67969ZM13.9219 9H15.6016C15.6536 9.28646 15.6797 9.5599 15.6797 9.82031C15.6797 10.862 15.4844 11.8385 15.0938 12.75C14.7031 13.6615 14.1562 14.4688 13.4531 15.1719C12.776 15.849 11.9818 16.3828 11.0703 16.7734C10.1849 17.138 9.22135 17.3203 8.17969 17.3203C7.13802 17.3203 6.16146 17.138 5.25 16.7734C4.33854 16.3828 3.53125 15.849 2.82812 15.1719C2.15104 14.4688 1.61719 13.6615 1.22656 12.75C0.861979 11.8385 0.679688 10.862 0.679688 9.82031C0.679688 8.77865 0.861979 7.8151 1.22656 6.92969C1.61719 6.01823 2.15104 5.22396 2.82812 4.54688C3.53125 3.84375 4.33854 3.29688 5.25 2.90625C6.16146 2.51562 7.13802 2.32031 8.17969 2.32031C8.72656 2.32031 9.27344 2.38542 9.82031 2.51562V4.23438C9.29948 4.07812 8.7526 4 8.17969 4C7.34635 4 6.57812 4.15625 5.875 4.46875C5.17188 4.75521 4.54688 5.17188 4 5.71875C3.47917 6.23958 3.0625 6.85156 2.75 7.55469C2.46354 8.25781 2.32031 9.01302 2.32031 9.82031C2.32031 10.6536 2.46354 11.4219 2.75 12.125C3.0625 12.8281 3.47917 13.4531 4 14C4.54688 14.5208 5.17188 14.9375 5.875 15.25C6.57812 15.5365 7.34635 15.6797 8.17969 15.6797C8.98698 15.6797 9.74219 15.5365 10.4453 15.25C11.1484 14.9375 11.7604 14.5208 12.2812 14C12.8281 13.4531 13.2448 12.8281 13.5312 12.125C13.8438 11.4219 14 10.6536 14 9.82031C14 9.5599 13.974 9.28646 13.9219 9ZM15.6797 3.17969H18.1797V4.82031H15.6797V7.32031H14V4.82031H11.5V3.17969H14V0.679688H15.6797V3.17969Z"
                                          fill="#333333"
                                        />
                                      </svg>
                                    </button>
                                  </TooltipButton>
                                )}
                              </div>
                            </S.ClassTd>
                            <S.ClassTd>
                              {el?.attendanceStatus?.entryTime
                                ? timeToHour(
                                    dateToClock(
                                      dateToKoreanTime(
                                        el?.attendanceStatus?.entryTime
                                      )
                                    )
                                  )
                                : ""}
                            </S.ClassTd>
                            <S.ClassTd
                              onMouseEnter={() => {
                                setIsViewTitle(false);
                              }}
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
                                      dateToKoreanTime(
                                        el?.attendanceStatus?.exitTime
                                      )
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
                                  ) + " (예상)"
                                : timeToHour(el.lecture.endTime) + " (예상)"}
                            </S.ClassTd>
                            <S.ClassTd
                              onMouseEnter={() => {
                                if (el.lecture.lectureInfo.about.length > 25) {
                                  setIsViewTitle(true);
                                  setViewTitle(el.lecture.lectureInfo.about);
                                } else {
                                  setIsViewTitle(false);
                                }
                              }}
                              onMouseLeave={() => {
                                setIsViewTitle(false);
                              }}
                            >
                              {el.lecture.lectureMemo === "" ? (
                                <div>
                                  {longWord(el.lecture.lectureInfo.about)}
                                </div>
                              ) : (
                                <div>
                                  {longWord(el.lecture.lectureInfo.about)}
                                  {/* <div
                              style={{ fontSize: "0.7rem", color: "#ababab" }}
                            >
                              {"(" + longWord(el.lecture.lectureMemo) + ")"}
                            </div> */}
                                </div>
                              )}
                            </S.ClassTd>
                            <S.ClassTd
                              onMouseEnter={() => {
                                setIsViewTitle(false);
                              }}
                            >
                              {el.student.reservedBooksCount + "권"}
                            </S.ClassTd>
                            <S.ClassTd>
                              <S.AddModalIconButton
                                onClick={onClickBooks(el.student, el.lecture)}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14.6333 1.16667H3.96665C3.59999 1.16667 3.29999 1.46667 3.29999 1.83334V6.25C3.48332 6.2 3.69999 6.16667 3.89999 6.16667C4.03332 6.16667 4.16665 6.18334 4.29999 6.20001V2.16667H14.3V10.5H8.64999L7.69999 11.5H14.6333C15 11.5 15.3 11.2 15.3 10.8333V1.83334C15.3 1.46667 15 1.16667 14.6333 1.16667Z"
                                    fill="#333333"
                                  />
                                  <path
                                    d="M3.91668 9.66666C4.70001 9.66666 5.33334 9.03333 5.33334 8.24999C5.33334 7.46666 4.70001 6.83333 3.91668 6.83333C3.13334 6.83333 2.50001 7.46666 2.50001 8.24999C2.48334 9.03333 3.13334 9.66666 3.91668 9.66666Z"
                                    fill="#333333"
                                  />
                                  <path
                                    d="M9.36668 8.01666C9.15001 7.68333 8.71668 7.59999 8.38334 7.79999C8.31668 7.83333 8.28334 7.89999 8.25001 7.93333L5.81668 10.4667C5.58335 10.35 5.33334 10.25 5.08334 10.1667C4.70001 10.1 4.30001 10.0167 3.91668 10.0167C3.53335 10.0167 3.13335 10.0833 2.75001 10.2C2.18335 10.35 1.68335 10.6333 1.26668 10.9833C1.16668 11.0833 1.08335 11.2333 1.05001 11.3667L0.700012 14.8333H5.68334V14.8167L7.10001 11.1667L9.28335 8.86666C9.48335 8.66666 9.55001 8.28333 9.36668 8.01666Z"
                                    fill="#333333"
                                  />
                                  <rect
                                    x="6.33331"
                                    y="4.61777"
                                    width="6.97"
                                    height="1"
                                    fill="#333333"
                                  />
                                  <rect
                                    x="10.3033"
                                    y="7.09576"
                                    width="3"
                                    height="1"
                                    fill="#333333"
                                  />
                                </svg>
                              </S.AddModalIconButton>
                              {/* <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={onClickBooks(el.student, el.lecture)}
                            style={{ cursor: "pointer" }}
                          >
                            <path
                              d="M14.8203 4.82031V3.17969H6.5V4.82031H14.8203ZM11.5 11.5V9.82031H6.5V11.5H11.5ZM14.8203 8.17969V6.5H6.5V8.17969H14.8203ZM15.6797 0.679688C16.1224 0.679688 16.5 0.848958 16.8125 1.1875C17.151 1.5 17.3203 1.8776 17.3203 2.32031V12.3203C17.3203 12.763 17.151 13.1536 16.8125 13.4922C16.5 13.8307 16.1224 14 15.6797 14H5.67969C5.23698 14 4.84635 13.8307 4.50781 13.4922C4.16927 13.1536 4 12.763 4 12.3203V2.32031C4 1.8776 4.16927 1.5 4.50781 1.1875C4.84635 0.848958 5.23698 0.679688 5.67969 0.679688H15.6797ZM2.32031 4V15.6797H14V17.3203H2.32031C1.8776 17.3203 1.48698 17.1641 1.14844 16.8516C0.835938 16.513 0.679688 16.1224 0.679688 15.6797V4H2.32031Z"
                              fill="#333333"
                            />
                          </svg> */}

                              {/* <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        
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
                          </svg> */}
                            </S.ClassTd>

                            <S.ClassTd>
                              <S.AddModalIconButton
                                style={{ padding: "0.44rem" }}
                                onClick={onClickViewMemo(
                                  el.student.id,
                                  el.lecture.id
                                )}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M2 3.75758C2 2.78689 2.78689 2 3.75758 2H12.2424C13.2131 2 14 2.7869 14 3.75758V9.92218C14 10.3883 13.8148 10.8353 13.4852 11.165L11.165 13.4852C10.8353 13.8148 10.3883 14 9.92218 14H3.75758C2.7869 14 2 13.2131 2 12.2424V3.75758ZM3.75758 3.09091C3.38939 3.09091 3.09091 3.38939 3.09091 3.75758V12.2424C3.09091 12.6106 3.38938 12.9091 3.75758 12.9091H9.27273V11.0303C9.27273 10.0596 10.0596 9.27273 11.0303 9.27273H12.9091V3.75758C12.9091 3.38938 12.6106 3.09091 12.2424 3.09091H3.75758ZM12.742 10.3636H11.0303C10.6621 10.3636 10.3636 10.6621 10.3636 11.0303V12.742C10.3739 12.7329 10.3839 12.7235 10.3936 12.7138L12.7138 10.3936C12.7235 10.3839 12.7329 10.3739 12.742 10.3636ZM4.42424 4.9697C4.42424 4.66845 4.66845 4.42424 4.9697 4.42424H11.0303C11.3315 4.42424 11.5758 4.66845 11.5758 4.9697C11.5758 5.27094 11.3315 5.51515 11.0303 5.51515H4.9697C4.66845 5.51515 4.42424 5.27094 4.42424 4.9697ZM4.42424 7.39394C4.42424 7.09269 4.66845 6.84848 4.9697 6.84848H11.0303C11.3315 6.84848 11.5758 7.09269 11.5758 7.39394C11.5758 7.69519 11.3315 7.93939 11.0303 7.93939H4.9697C4.66845 7.93939 4.42424 7.69519 4.42424 7.39394ZM4.42424 9.81818C4.42424 9.51694 4.66845 9.27273 4.9697 9.27273H7.39394C7.69519 9.27273 7.93939 9.51694 7.93939 9.81818C7.93939 10.1194 7.69519 10.3636 7.39394 10.3636H4.9697C4.66845 10.3636 4.42424 10.1194 4.42424 9.81818Z"
                                    fill="#333333"
                                  />
                                </svg>
                              </S.AddModalIconButton>
                            </S.ClassTd>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <div style={{ display: "flex" }}>
                <S.ClassSmallBlackButton
                  onClick={onClickOpenEditModal} // 이게 원본
                  style={
                    checkList.length !== 1
                      ? {
                          color: "#c8c8c8",
                          background: "#fff",
                        }
                      : { color: "#333", background: "#fff" }
                  }
                >
                  <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: "0.62rem" }}
                  >
                    <path
                      d="M11.8125 3.1875L10.5938 4.40625L8.09375 1.90625L9.3125 0.6875C9.4375 0.5625 9.59375 0.5 9.78125 0.5C9.96875 0.5 10.125 0.5625 10.25 0.6875L11.8125 2.25C11.9375 2.375 12 2.53125 12 2.71875C12 2.90625 11.9375 3.0625 11.8125 3.1875ZM0 10L7.375 2.625L9.875 5.125L2.5 12.5H0V10Z"
                      fill={checkList.length !== 1 ? "#c8c8c8" : "#333"}
                    />
                  </svg>
                  수정
                </S.ClassSmallBlackButton>

                <S.ClassSmallBlackButton
                  onClick={() => {
                    setIsConfirm(true);
                    setConfirmState("삭제");
                    setTodayDate(new Date());
                    setIsAll(false);
                  }}
                  style={
                    checkList?.length === 0
                      ? {
                          marginLeft: "0.75rem",
                          backgroundColor: "#C8C8C8",
                          color: "#fff",
                        }
                      : {
                          marginLeft: "0.75rem",
                          color: "#fff",
                          backgroundColor: "#333",
                        }
                  }
                >
                  <svg
                    width="10"
                    height="13"
                    viewBox="0 0 10 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: "0.62rem" }}
                  >
                    <path
                      d="M9.65625 1.15625V2.5H0.34375V1.15625H2.65625L3.34375 0.5H6.65625L7.34375 1.15625H9.65625ZM1 11.1562V3.15625H9V11.1562C9 11.5104 8.86458 11.8229 8.59375 12.0938C8.32292 12.3646 8.01042 12.5 7.65625 12.5H2.34375C1.98958 12.5 1.67708 12.3646 1.40625 12.0938C1.13542 11.8229 1 11.5104 1 11.1562Z"
                      fill="white"
                    />
                  </svg>
                  삭제
                </S.ClassSmallBlackButton>
              </div>
              <div style={{ margin: "1rem 0" }}></div>
              {/* <S.PageContainer>
            {Array.from({ length: totalPages }, (_, i) => (
              <S.PageBox
                key={i}
                style={
                  i + 1 === page
                    ? { backgroundColor: "#333", color: "#eeeeee" }
                    : {}
                }
                // onClick={onClickPage(i + 1)}
              >
                {i + 1}
              </S.PageBox>
            ))}
          </S.PageContainer> */}
            </>
          ) : (
            //달력 시작
            <>
              <S.CalendarWrapper>
                {isViewMore ? (
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {/* <div style={{ display: "flex", alignItems: "center" }}>
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
                </div> */}

                    {/* <table style={{ display: "flex" }}>
                  <tbody>
                    <thead>
                      <tr>
                        <th>수업 시간</th>
                        <th>수업 설명</th>
                        <th>수업 반복 여부</th>
                        <th>수업 자동 추가 여부</th>
                        <th>반복 주</th>
                        <th>반복 요일</th>
                        <th>수업 인원 수정</th>
                        <th>원생</th>
                        <th>담당 선생님</th>
                        <th>담당 지점</th>
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
                </table> */}
                  </div>
                ) : (
                  <S.CalendarLeft>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        margin: "1rem 0",
                        width: "60rem",
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
                                  // onClick={() => {
                                  //   if (viewType === "class") {
                                  //     if (
                                  //       monthClassData?.getLecturestudentsByAcademyAndMonth?.filter(
                                  //         (lecture) => {
                                  //           return (
                                  //             lecture.date ===
                                  //             calendarDate.getFullYear() +
                                  //               "-" +
                                  //               getMonthZero(calendarDate) +
                                  //               "-" +
                                  //               getNumberZero(ele)
                                  //           );
                                  //         }
                                  //       )?.length > 0
                                  //     ) {
                                  //       setIsViewMore(true);
                                  //       setViewMorePosition([index1, index2]);
                                  //       // setViewDate("1");
                                  //       setViewModalList(
                                  //         monthClassData?.getLecturestudentsByAcademyAndMonth?.filter(
                                  //           (lecture) => {
                                  //             return (
                                  //               lecture.date ===
                                  //               calendarDate.getFullYear() +
                                  //                 "-" +
                                  //                 getMonthZero(calendarDate) +
                                  //                 "-" +
                                  //                 getNumberZero(ele)
                                  //             );
                                  //           }
                                  //         )
                                  //       );
                                  //     }
                                  //   }
                                  // }}
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
                                        {monthClassData?.getLecturestudentsByAcademyAndMonth?.filter(
                                          (el) => {
                                            return (
                                              el.date ===
                                              calendarDate.getFullYear() +
                                                "-" +
                                                getMonthZero(calendarDate) +
                                                "-" +
                                                getNumberZero(ele)
                                            );
                                          }
                                        )?.[0]?.students !== undefined &&
                                          "총 인원 : " +
                                            monthClassData?.getLecturestudentsByAcademyAndMonth?.filter(
                                              (el) => {
                                                return (
                                                  el.date ===
                                                  calendarDate.getFullYear() +
                                                    "-" +
                                                    getMonthZero(calendarDate) +
                                                    "-" +
                                                    getNumberZero(ele)
                                                );
                                              }
                                            )?.[0]?.students?.length}
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
                                        {monthClassData?.getLecturestudentsByAcademyAndMonth?.filter(
                                          (el) => {
                                            return (
                                              el.date ===
                                              calendarDate.getFullYear() +
                                                "-" +
                                                getMonthZero(calendarDate) +
                                                "-" +
                                                getNumberZero(ele)
                                            );
                                          }
                                        )?.[0] !== undefined &&
                                          "출석 인원 : " +
                                            monthClassData?.getLecturestudentsByAcademyAndMonth
                                              ?.filter((el) => {
                                                return (
                                                  el.date ===
                                                  calendarDate.getFullYear() +
                                                    "-" +
                                                    getMonthZero(calendarDate) +
                                                    "-" +
                                                    getNumberZero(ele)
                                                );
                                              })?.[0]
                                              ?.students?.filter((el) => {
                                                return el.attendanceStatus;
                                              }).length}
                                      </S.CalendarLecture>
                                      {/* <S.CalendarLecture
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
                                      ? monthClassData?.getLecturestudentsByAcademyAndMonth
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
                                          monthClassData?.getLecturestudentsByAcademyAndMonth
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
                                  </S.CalendarLecture> */}
                                      {/* <S.CalendarLecture
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
                                      ? monthClassData?.getLecturestudentsByAcademyAndMonth
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
                                          monthClassData?.getLecturestudentsByAcademyAndMonth
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
                                  </S.CalendarLecture> */}
                                    </>
                                  ) : monthClassData?.getLecturestudentsByAcademyAndMonth?.filter(
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
                                      {monthClassData?.getLecturestudentsByAcademyAndMonth
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
                                                {lecture?.lectureInfo.about ===
                                                ""
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
                                          (monthClassData?.getLecturestudentsByAcademyAndMonth?.filter(
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
                                      {monthClassData?.getLecturestudentsByAcademyAndMonth
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
                                    Number(router.query.branch) ===
                                    Number(el.id)
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
                                    onClick={async () => {
                                      setCheckList([
                                        {
                                          studentId: el.student.id,
                                          lectureId: el.lecture.id,
                                          lectureInfoId:
                                            el.lecture.lectureInfo.id,
                                        },
                                      ]);
                                      if (monthClassData !== undefined) {
                                        try {
                                          await refetchLectureInfo({
                                            studentId: Number(el.student.id),
                                          });
                                        } catch (err) {}
                                        setIsAll(false);
                                        setTodayDate(new Date());
                                        setIsEdit(true);
                                        const setting =
                                          monthClassData?.getLecturestudentsByAcademyAndMonth
                                            ?.filter((lecture) => {
                                              return (
                                                lecture.date ===
                                                calendarDate.getFullYear() +
                                                  "-" +
                                                  getMonthZero(calendarDate) +
                                                  "-" +
                                                  getDateZero(calendarDate)
                                              );
                                            })?.[0]
                                            ?.students?.filter((el) => {
                                              return (
                                                Number(el.student.id) ===
                                                Number(el.student.id)
                                              );
                                            })[0];
                                        setIsEditAuto(
                                          setting?.lecture?.lectureInfo.autoAdd
                                        );
                                        setIsEditRepeat(
                                          setting?.lecture?.lectureInfo.repeatDay.includes(
                                            -1
                                          )
                                            ? "once"
                                            : setting?.lecture?.lectureInfo
                                                .repeatTimes === null
                                            ? "routine"
                                            : "count"
                                        );
                                        setEditDate(setting?.lecture?.date);
                                        setStandardDate(setting?.lecture?.date);
                                        setEditStartTime(
                                          setting?.lecture?.startTime
                                        );
                                        setEditEndTime(
                                          setting?.lecture?.endTime
                                        );
                                        setEditInfo(
                                          setting?.lecture?.lectureInfo.about
                                        );
                                        if (
                                          !setting?.lecture?.lectureInfo.repeatDay.includes(
                                            -1
                                          )
                                        ) {
                                          setEditRepeatWeek(
                                            setting?.lecture?.lectureInfo
                                              .repeatDay
                                          );
                                          setEditRepeatCount(
                                            setting?.lecture?.lectureInfo
                                              .repeatWeeks
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
          {isViewTitle && (
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
          )}
          {/*  모달 시작 */}
          {classToggle ? (
            <Modal
              closable={false}
              open={classToggle}
              width={addList?.length === 0 ? "40.125rem" : "89.875rem"}
              height={"47rem"}
              keyboard={true}
              onCancel={onClickCancel}
              footer={null}
              style={{ content: { padding: 0 } }}
              // className="ant-modal-content"
            >
              <div
                style={{
                  fontSize: "1.25rem",
                  fontFamily: "Spoqa Han Sans Neo",
                  fontWeight: 500,
                }}
              >
                {addList?.length === 0 ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      marginRight: "0.44rem",
                    }}
                  >
                    <path
                      d="M12 6.84564H6.84564V12H5.15436V6.84564H0V5.15436H5.15436V0H6.84564V5.15436H12V6.84564Z"
                      fill="#791285"
                    />
                  </svg>
                ) : (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      marginRight: "0.44rem",
                    }}
                  >
                    <path
                      d="M11.8125 2.6875L10.5938 3.90625L8.09375 1.40625L9.3125 0.1875C9.4375 0.0625 9.59375 0 9.78125 0C9.96875 0 10.125 0.0625 10.25 0.1875L11.8125 1.75C11.9375 1.875 12 2.03125 12 2.21875C12 2.40625 11.9375 2.5625 11.8125 2.6875ZM0 9.5L7.375 2.125L9.875 4.625L2.5 12H0V9.5Z"
                      fill="#791285"
                    />
                  </svg>
                )}

                {addList?.length === 0 ? "수업 추가" : "수업 추가/수정"}
              </div>
              <div
                style={{
                  borderTop: "1px solid #DFE1E5",
                  // width: "89.875rem",
                  marginTop: "1.25rem",
                  marginBottom: "1.25rem",
                  // marginRight: "1.3rem",
                }}
              ></div>
              <S.ModalClassAddWrapper>
                <div style={{ width: "53rem", height: "43.5rem" }}>
                  {addList.length === 0 ? (
                    <>
                      <S.ModalInput
                        onChange={(e) => {
                          setSearchStudents(e.target.value);
                        }}
                        placeholder="      원번 혹은 이름을 입력하세요."
                      ></S.ModalInput>
                      <div
                        style={{
                          height: "38rem",
                          overflow: "scroll",
                          overflowX: "hidden",
                        }}
                      >
                        <table
                          style={{
                            // height: "33.625rem",
                            width: "37.125rem",
                            overflow: "scroll",
                            overflowX: "scroll",
                            borderCollapse: "collapse",
                          }}
                        >
                          <thead
                            style={{
                              position: "sticky",
                              top: 0,
                              zIndex: 0,
                            }}
                          >
                            <tr>
                              <S.AddModalTh
                                style={{
                                  width: "10.3125rem",
                                  textAlign: "center",
                                  background: "#791285",
                                }}
                              >
                                원생 번호
                              </S.AddModalTh>
                              <S.AddModalTh
                                colSpan={2}
                                style={{
                                  width: "16rem",
                                  textAlign: "center",
                                  background: "#791285",
                                }}
                              >
                                원생 이름
                              </S.AddModalTh>
                              <S.AddModalTh
                                style={{
                                  width: "9.69rem",
                                  textAlign: "center",
                                  background: "#791285",
                                }}
                              >
                                선택
                              </S.AddModalTh>
                            </tr>
                          </thead>
                          {/* 여기다가 필터 추가 lecture 정보로 */}
                          <tbody>
                            {allStudent?.map((el) => {
                              return (
                                <tr key={uuidv4()} style={{ margin: 0 }}>
                                  <S.AddModalTd
                                    style={{
                                      textAlign: "center",
                                    }}
                                  >
                                    {el?.origin}
                                  </S.AddModalTd>
                                  <S.AddModalTd
                                    style={{
                                      paddingRight: "2px",
                                      textAlign: "end",
                                      borderRight: "none",
                                      width: "8.5rem",
                                    }}
                                  >
                                    {`${el?.korName}`}
                                  </S.AddModalTd>
                                  <S.AddModalTd
                                    style={{
                                      textAlign: "start",
                                      borderLeft: "none",
                                    }}
                                  >
                                    {`(${el?.engName ?? ""})`}
                                  </S.AddModalTd>
                                  <S.AddModalTd
                                    style={{
                                      textAlign: "center",
                                    }}
                                  >
                                    <button
                                      onClick={onClickStudents(
                                        el?.id,
                                        el?.korName,
                                        el?.engName,
                                        el?.origin
                                      )}
                                      style={{
                                        cursor: "pointer",
                                        border: "none",
                                        background: "#fff",
                                        fontFamily: "Noto Sans KR",
                                        fontSize: "1rem",
                                        fontWeight: "500",
                                      }}
                                    >
                                      <svg
                                        width="12"
                                        height="10"
                                        viewBox="0 0 12 10"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M4 7.28125L11.0625 0.21875L12 1.15625L4 9.15625L0.28125 5.4375L1.21875 4.5L4 7.28125Z"
                                          fill="#333333"
                                        />
                                      </svg>
                                      {" 선택"}
                                    </button>
                                  </S.AddModalTd>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <>
                      <S.AddModalBackButton
                        style={{ marginTop: "1.25rem" }}
                        onClick={() => {
                          setAddList([]);
                        }}
                      >
                        <svg
                          width="12"
                          height="9"
                          viewBox="0 0 12 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{
                            marginBottom: "0.1rem",
                            marginRight: "1rem",
                          }}
                        >
                          <path
                            d="M12 3.84375V5.15625H2.5625L4.9375 7.5625L4 8.5L0 4.5L4 0.5L4.9375 1.4375L2.5625 3.84375H12Z"
                            fill="#791285"
                          />
                        </svg>
                        원생 선택
                      </S.AddModalBackButton>

                      {/* <S.AddModalTitle>
                    {`${addListName?.origin} ${addListName?.korName}(${
                      addListName?.engName
                    })의 수업(수정 전 ${
                      lectureInfoData?.studentLectures
                        ?.sort((a, b) => {
                          const newADate = new Date(a?.lecture?.date);
                          const newBDate = new Date(b?.lecture?.date);
                          return newADate - newBDate;
                        })
                        ?.filter((el, i, callback) => {
                          return (
                            i ===
                            callback.findIndex(
                              (t) =>
                                t.lecture.lectureInfo.id ===
                                el.lecture.lectureInfo.id
                            )
                          );
                        })?.length
                    }개)`}
                  </S.AddModalTitle>

                  <div
                    style={{
                      width: "53rem",
                      display: "flex",
                      alignItems: "flex-start",
                      height:
                        lectureInfoData?.studentLectures
                          ?.sort((a, b) => {
                            const newADate = new Date(a?.lecture?.date);
                            const newBDate = new Date(b?.lecture?.date);
                            return newADate - newBDate;
                          })
                          ?.filter((el, i, callback) => {
                            return (
                              i ===
                              callback.findIndex(
                                (t) =>
                                  t.lecture.lectureInfo.id ===
                                  el.lecture.lectureInfo.id
                              )
                            );
                          })?.length > 5
                          ? "15rem"
                          : "",
                      justifyContent: "flex-start",
                      overflowY:
                        lectureInfoData?.studentLectures
                          ?.sort((a, b) => {
                            const newADate = new Date(a?.lecture?.date);
                            const newBDate = new Date(b?.lecture?.date);
                            return newADate - newBDate;
                          })
                          ?.filter((el, i, callback) => {
                            return (
                              i ===
                              callback.findIndex(
                                (t) =>
                                  t.lecture.lectureInfo.id ===
                                  el.lecture.lectureInfo.id
                              )
                            );
                          })?.length > 5
                          ? "scroll"
                          : "hidden",
                    }}
                  >
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead style={{ position: "sticky", top: 0, zIndex: 0 }}>
                        <tr>
                          <S.AddModalTh
                            style={{
                              width: "4.19rem",
                              textAlign: "center",
                              background: "#791285",
                            }}
                          >
                            열 번호
                          </S.AddModalTh>
                          <S.AddModalTh
                            style={{
                              width: "11.87rem",
                              textAlign: "center",
                              background: "#791285",
                            }}
                          >
                            날짜
                          </S.AddModalTh>
                          <S.AddModalTh
                            style={{
                              width: "7.25rem",
                              textAlign: "center",
                              background: "#791285",
                            }}
                          >
                            수업 시간
                          </S.AddModalTh>
                          <S.AddModalTh
                            style={{
                              width: "12.625rem",
                              textAlign: "center",
                              background: "#791285",
                            }}
                          >
                            반복 요일
                          </S.AddModalTh>
                          <S.AddModalTh
                            style={{
                              width: "3.12rem",
                              textAlign: "center",
                              background: "#791285",
                            }}
                          >
                            반복
                          </S.AddModalTh>
                          <S.AddModalTh
                            style={{
                              width: "7.12rem",
                              textAlign: "center",
                              background: "#791285",
                            }}
                          >
                            강의 정보
                          </S.AddModalTh>
                          <S.AddModalTh
                            style={{
                              width: "5.75rem",
                              textAlign: "center",
                              background: "#791285",
                            }}
                          >
                            수정/삭제
                          </S.AddModalTh>
                        </tr>
                      </thead>
                      <tbody>
                        {lectureInfoData?.studentLectures
                          ?.sort((a, b) => {
                            const newADate = new Date(a?.lecture?.date);
                            const newBDate = new Date(b?.lecture?.date);
                            return newADate - newBDate;
                          })
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
                          ?.map((el, index) => {
                            return (
                              <tr>
                                <S.AddModalTd>{index + 1}</S.AddModalTd>
                                <S.AddModalTd>
                                  {el?.lecture?.lectureInfo?.repeatDay.includes(
                                    -1
                                  )
                                    ? dateInputToDot(el?.lecture?.date)
                                    : el?.lecture?.lectureInfo?.autoAdd
                                    ? dateInputToDot(
                                        startDate(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatDay
                                        )
                                      ) + " ~"
                                    : dateInputToDot(
                                        startDate(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatDay
                                        )
                                      ) +
                                      " ~ " +
                                      (el?.lecture?.lectureInfo?.repeatTimes ===
                                      null
                                        ? dateInputToDot(
                                            lastDate(
                                              el?.lecture?.date,
                                              el?.lecture?.lectureInfo
                                                ?.repeatWeeks,
                                              el?.lecture?.lectureInfo
                                                ?.repeatDay
                                            )
                                          )
                                        : dateInputToDot(
                                            lastCount(
                                              el?.lecture?.date,
                                              el?.lecture?.lectureInfo
                                                ?.repeatWeeks,
                                              el?.lecture?.lectureInfo
                                                ?.repeatDay
                                            )
                                          ))}
                                </S.AddModalTd>
                                <S.AddModalTd>
                                  {el?.lecture?.startTime.slice(0, 5) +
                                    " ~ " +
                                    el?.lecture?.endTime.slice(0, 5)}
                                </S.AddModalTd>
                                <S.AddModalTd>
                                  <div style={{ display: "flex" }}>
                                    {week?.map((_, weekIndex) => {
                                      return (
                                        <S.AddModalWeekBlock>
                                          {el?.lecture?.lectureInfo?.repeatDay?.includes(
                                            weekIndex
                                          )
                                            ? week[weekIndex]
                                            : ""}
                                        </S.AddModalWeekBlock>
                                      );
                                    })}
                                  </div>
                                </S.AddModalTd>
                                <S.AddModalTd>
                                  {el?.lecture?.lectureInfo?.repeatDay?.includes(
                                    -1
                                  )
                                    ? "없음"
                                    : el?.lecture?.lectureInfo?.repeatTimes ===
                                      null
                                    ? el?.lecture?.lectureInfo?.repeatWeeks +
                                      "주"
                                    : el?.lecture?.lectureInfo?.repeatTimes +
                                      "회"}
                                </S.AddModalTd>
                                <S.AddModalTdMaxWidth>
                                  {el?.lecture?.lectureInfo?.about}
                                </S.AddModalTdMaxWidth>
                                <S.AddModalTd>
                                  <S.AddModalIconButton
                                    onClick={onClickSelectRepeatInput(index)}
                                    style={{ marginRight: "0.63rem" }}
                                  >
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M11.8125 2.68848L10.5938 3.90723L8.09375 1.40723L9.3125 0.188477C9.4375 0.0634766 9.59375 0.000976562 9.78125 0.000976562C9.96875 0.000976562 10.125 0.0634766 10.25 0.188477L11.8125 1.75098C11.9375 1.87598 12 2.03223 12 2.21973C12 2.40723 11.9375 2.56348 11.8125 2.68848ZM0 9.50098L7.375 2.12598L9.875 4.62598L2.5 12.001H0V9.50098Z"
                                        fill="#333333"
                                      />
                                    </svg>
                                  </S.AddModalIconButton>
                                  <S.AddModalIconButton
                                    onClick={onClickDeleteRepeatInput(index)}
                                  >
                                    <svg
                                      width="10"
                                      height="12"
                                      viewBox="0 0 10 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M9.65625 0.657227V2.00098H0.34375V0.657227H2.65625L3.34375 0.000976562H6.65625L7.34375 0.657227H9.65625ZM1 10.6572V2.65723H9V10.6572C9 11.0114 8.86458 11.3239 8.59375 11.5947C8.32292 11.8656 8.01042 12.001 7.65625 12.001H2.34375C1.98958 12.001 1.67708 11.8656 1.40625 11.5947C1.13542 11.3239 1 11.0114 1 10.6572Z"
                                        fill="#333333"
                                      />
                                    </svg>
                                  </S.AddModalIconButton>
                                </S.AddModalTd>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div> */}
                      <S.AddModalTitle>
                        {`${addListName?.origin} ${addListName?.korName}(${addListName?.engName})의 수업`}
                        {/* 
                    <span style={{ color: "#F00" }}>
                      {`(수정 후 ${
                        addRepeatInput?.reduce((acc, cur) => {
                          if (cur?.isDelete) {
                            return acc;
                          } else {
                            return acc + 1;
                          }
                        }, 0) +
                        addRepeatInput?.reduce((acc, cur) => {
                          if (cur?.isOne && !cur?.isDelete) {
                            return acc + 1;
                          } else {
                            return acc;
                          }
                        }, 0)
                      }개)`}
                    </span> */}
                      </S.AddModalTitle>
                      <div
                        style={{
                          width: "53rem",
                          display: "flex",
                          alignItems: "flex-start",
                          height:
                            addRepeatInput?.length +
                              addRepeatInput?.filter((el) => el?.isOne)
                                ?.length >
                            12
                              ? "30rem"
                              : "",
                          justifyContent: "flex-start",
                          overflowY:
                            addRepeatInput?.length +
                              addRepeatInput?.filter((el) => el?.isOne)
                                ?.length >
                            12
                              ? "scroll"
                              : "hidden",
                        }}
                      >
                        <table
                          style={{ width: "100%", borderCollapse: "collapse" }}
                        >
                          <thead
                            style={{ position: "sticky", top: 0, zIndex: 0 }}
                          >
                            <tr>
                              <S.AddModalTh
                                style={{
                                  width: "4.19rem",
                                  textAlign: "center",
                                  background: "#791285",
                                }}
                              >
                                열 번호
                              </S.AddModalTh>
                              <S.AddModalTh
                                style={{
                                  width: "11.87rem",
                                  textAlign: "center",
                                  background: "#791285",
                                }}
                              >
                                날짜
                              </S.AddModalTh>
                              <S.AddModalTh
                                style={{
                                  width: "9rem",
                                  textAlign: "center",
                                  background: "#791285",
                                }}
                              >
                                수업 시간
                              </S.AddModalTh>
                              <S.AddModalTh
                                style={{
                                  width: "7.25rem",
                                  textAlign: "center",
                                  background: "#791285",
                                }}
                              >
                                반복 요일
                              </S.AddModalTh>
                              <S.AddModalTh
                                style={{
                                  width: "3.12rem",
                                  textAlign: "center",
                                  background: "#791285",
                                }}
                              >
                                반복
                              </S.AddModalTh>
                              <S.AddModalTh
                                style={{
                                  width: "7.25rem",
                                  textAlign: "center",
                                  background: "#791285",
                                }}
                              >
                                강의 정보
                              </S.AddModalTh>
                              <S.AddModalTh
                                style={{
                                  width: "5.75rem",
                                  textAlign: "center",
                                  background: "#791285",
                                }}
                              >
                                수정/삭제
                              </S.AddModalTh>
                            </tr>
                          </thead>
                          <tbody>
                            {addRepeatInput?.map((el, index) => {
                              return (
                                <>
                                  <tr>
                                    <S.AddModalTd
                                      style={{
                                        backgroundColor: el.isDelete
                                          ? "#EFEFEF"
                                          : el?.id === ""
                                          ? "#EFE"
                                          : el?.isActive
                                          ? "#Fee"
                                          : "",
                                        color:
                                          index === selectedAddListIndex
                                            ? "#791285"
                                            : "#333",
                                        opacity:
                                          index !== selectedAddListIndex &&
                                          el?.isDelete
                                            ? "50%"
                                            : "100%",
                                      }}
                                    >
                                      {index + 1}
                                    </S.AddModalTd>
                                    <S.AddModalTd
                                      style={{
                                        backgroundColor: el.isDelete
                                          ? "#EFEFEF"
                                          : el?.id === ""
                                          ? "#EFE"
                                          : el?.isActive
                                          ? "#Fee"
                                          : "",
                                        color:
                                          index === selectedAddListIndex
                                            ? "#791285"
                                            : "#333",
                                        opacity:
                                          index !== selectedAddListIndex &&
                                          el?.isDelete
                                            ? "50%"
                                            : "100%",
                                      }}
                                    >
                                      {el?.week?.includes(-1) ||
                                      el?.isRepeat === "once" ||
                                      el?.week?.length === 0
                                        ? dateInputToDot(el?.startDate)
                                        : el?.isRepeat === "infinity"
                                        ? dateInputToDot(
                                            startDate(el?.startDate, el?.week)
                                          ) + " ~"
                                        : dateInputToDot(
                                            startDate(el?.startDate, el?.week)
                                          ) +
                                          " ~ " +
                                          (el?.isRepeat === "routine"
                                            ? dateInputToDot(
                                                lastDate(
                                                  el?.startDate,
                                                  el?.repeatsNum,
                                                  el?.week
                                                )
                                              )
                                            : dateInputToDot(
                                                lastCount(
                                                  el?.startDate,
                                                  el?.repeatsNum,
                                                  el?.week
                                                )
                                              ))}
                                    </S.AddModalTd>
                                    <S.AddModalTd
                                      style={{
                                        backgroundColor: el.isDelete
                                          ? "#EFEFEF"
                                          : el?.id === ""
                                          ? "#EFE"
                                          : el?.isActive
                                          ? "#Fee"
                                          : "",
                                        color:
                                          index === selectedAddListIndex
                                            ? "#791285"
                                            : "#333",

                                        opacity:
                                          index !== selectedAddListIndex &&
                                          el?.isDelete
                                            ? "50%"
                                            : "100%",
                                      }}
                                    >
                                      {el?.startTime.slice(0, 5) +
                                        " ~ " +
                                        el?.endTime.slice(0, 5)}
                                    </S.AddModalTd>
                                    <S.AddModalTd
                                      style={{
                                        backgroundColor: el.isDelete
                                          ? "#EFEFEF"
                                          : el?.id === ""
                                          ? "#EFE"
                                          : el?.isActive
                                          ? "#Fee"
                                          : "",
                                        color:
                                          index === selectedAddListIndex
                                            ? "#791285"
                                            : "#333",
                                        opacity:
                                          index !== selectedAddListIndex &&
                                          el?.isDelete
                                            ? "50%"
                                            : "100%",
                                      }}
                                    >
                                      {/* {el?.week?.includes(-1)
                                    ? ""
                                    : el?.week
                                        // ?.sort((a, b) => {
                                        //   return Number(a) - Number(b);
                                        // })
                                        .map((ele) => {
                                          return week[ele];
                                        })} */}

                                      <div style={{ display: "flex" }}>
                                        {week?.map((_, weekIndex) => {
                                          if (el?.isRepeat !== "once") {
                                            return (
                                              <S.AddModalWeekBlock>
                                                {el?.week?.includes(weekIndex)
                                                  ? week[weekIndex]
                                                  : ""}
                                              </S.AddModalWeekBlock>
                                            );
                                          } else {
                                            return (
                                              <S.AddModalWeekBlock></S.AddModalWeekBlock>
                                            );
                                          }
                                        })}
                                      </div>
                                    </S.AddModalTd>
                                    <S.AddModalTdMaxWidth
                                      style={{
                                        backgroundColor: el.isDelete
                                          ? "#EFEFEF"
                                          : el?.id === ""
                                          ? "#EFE"
                                          : el?.isActive
                                          ? "#Fee"
                                          : "",
                                        color:
                                          index === selectedAddListIndex
                                            ? "#791285"
                                            : "#333",
                                        opacity:
                                          index !== selectedAddListIndex &&
                                          el?.isDelete
                                            ? "50%"
                                            : "100%",
                                      }}
                                    >
                                      {el?.isRepeat === "once"
                                        ? "없음"
                                        : el?.isRepeat === "infinity"
                                        ? "무한"
                                        : el?.isRepeat === "routine"
                                        ? el?.repeatsNum + "주"
                                        : el?.repeatsNum + "회"}
                                    </S.AddModalTdMaxWidth>
                                    <S.AddModalTdMaxWidth
                                      style={{
                                        backgroundColor: el.isDelete
                                          ? "#EFEFEF"
                                          : el?.id === ""
                                          ? "#EFE"
                                          : el?.isActive
                                          ? "#Fee"
                                          : "",
                                        color:
                                          index === selectedAddListIndex
                                            ? "#791285"
                                            : "#333",
                                        opacity:
                                          index !== selectedAddListIndex &&
                                          el?.isDelete
                                            ? "50%"
                                            : "100%",
                                      }}
                                    >
                                      {el?.about}
                                    </S.AddModalTdMaxWidth>
                                    <S.AddModalTd
                                      style={{
                                        backgroundColor: el.isDelete
                                          ? "#EFEFEF"
                                          : el?.id === ""
                                          ? "#EFE"
                                          : el?.isActive
                                          ? "#Fee"
                                          : "",
                                        color:
                                          index === selectedAddListIndex
                                            ? "#791285"
                                            : "#333",
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        <S.AddModalIconButton
                                          onClick={onClickSelectRepeatInput(
                                            index
                                          )}
                                          style={{ marginRight: "0.62rem" }}
                                        >
                                          <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            style={{
                                              opacity: el?.isDelete
                                                ? "50%"
                                                : "100%",
                                            }}
                                          >
                                            <path
                                              d="M11.8125 2.6875L10.5938 3.90625L8.09375 1.40625L9.3125 0.1875C9.4375 0.0625 9.59375 0 9.78125 0C9.96875 0 10.125 0.0625 10.25 0.1875L11.8125 1.75C11.9375 1.875 12 2.03125 12 2.21875C12 2.40625 11.9375 2.5625 11.8125 2.6875ZM0 9.5L7.375 2.125L9.875 4.625L2.5 12H0V9.5Z"
                                              fill="#333333"
                                            />
                                          </svg>
                                        </S.AddModalIconButton>
                                        {el?.isDelete ? (
                                          <S.AddModalIconButton
                                            onClick={onClickDeleteRepeatInput(
                                              index
                                            )}
                                          >
                                            <svg
                                              width="16"
                                              height="16"
                                              viewBox="0 0 16 16"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <g clip-path="url(#clip0_1573_11821)">
                                                <path
                                                  fill-rule="evenodd"
                                                  clip-rule="evenodd"
                                                  d="M5.31921 6.42803C5.46187 6.51029 5.56599 6.64582 5.60867 6.80482L6.06406 8.50134C6.15294 8.83242 5.95645 9.17283 5.6252 9.26165C5.29395 9.35048 4.95338 9.15409 4.8645 8.82301L4.57003 7.72597L3.47243 8.0203C3.14118 8.10912 2.80061 7.91273 2.71173 7.58165C2.62286 7.25057 2.81935 6.91017 3.1506 6.82134L4.84797 6.36617C5.00705 6.32352 5.17656 6.34577 5.31921 6.42803Z"
                                                  fill="#333333"
                                                />
                                                <path
                                                  fill-rule="evenodd"
                                                  clip-rule="evenodd"
                                                  d="M9.68109 10.4577C9.9236 10.7001 9.9236 11.0931 9.68109 11.3354L8.87821 12.1379L9.68109 12.9404C9.9236 13.1828 9.9236 13.5758 9.68109 13.8182C9.43857 14.0606 9.04538 14.0606 8.80287 13.8182L7.56089 12.5768C7.31838 12.3344 7.31838 11.9414 7.56089 11.699L8.80287 10.4577C9.04538 10.2153 9.43857 10.2153 9.68109 10.4577Z"
                                                  fill="#333333"
                                                />
                                                <path
                                                  fill-rule="evenodd"
                                                  clip-rule="evenodd"
                                                  d="M11.6074 4.66955C11.9387 4.75838 12.1352 5.09878 12.0463 5.42986L11.5909 7.12639C11.5482 7.28546 11.444 7.42104 11.3012 7.50329C11.1585 7.58554 10.9889 7.6077 10.8297 7.56491L9.13754 7.10974C8.80635 7.02066 8.61013 6.68011 8.69925 6.34909C8.78838 6.01808 9.12911 5.82195 9.46029 5.91103L10.5524 6.20478L10.8467 5.10819C10.9356 4.77711 11.2762 4.58072 11.6074 4.66955Z"
                                                  fill="#333333"
                                                />
                                                <path
                                                  fill-rule="evenodd"
                                                  clip-rule="evenodd"
                                                  d="M11.928 8.57434C12.2251 8.40307 12.6048 8.50494 12.7762 8.80187L13.8059 10.5861C13.8059 10.5862 13.806 10.5863 13.806 10.5863C13.9329 10.8061 13.9998 11.0553 14 11.309C14.0002 11.5627 13.9337 11.8121 13.8071 12.0321C13.6806 12.2522 13.4984 12.4351 13.2788 12.5625C13.0593 12.69 12.81 12.7576 12.5561 12.7585L12.5539 12.7585H8C7.65703 12.7585 7.37901 12.4806 7.37901 12.1378C7.37901 11.795 7.65703 11.5171 8 11.5171H12.5525C12.5885 11.5169 12.6238 11.5072 12.655 11.4891C12.6864 11.4709 12.7124 11.4448 12.7305 11.4134C12.7485 11.3819 12.758 11.3463 12.758 11.3101C12.758 11.2738 12.7484 11.2382 12.7303 11.2068L11.7003 9.42212C11.529 9.12518 11.6309 8.74562 11.928 8.57434Z"
                                                  fill="#333333"
                                                />
                                                <path
                                                  fill-rule="evenodd"
                                                  clip-rule="evenodd"
                                                  d="M7.27571 2.19471C7.49576 2.06717 7.74562 2 8 2C8.25437 2 8.50423 2.06717 8.72428 2.19471C8.94381 2.32195 9.1259 2.50477 9.25221 2.72474L11.5285 6.65458C11.7004 6.95124 11.5991 7.33097 11.3022 7.50272C11.0054 7.67447 10.6255 7.57321 10.4537 7.27655L8.17671 3.34558L8.17516 3.34289C8.1575 3.31204 8.132 3.2864 8.10124 3.26858C8.07048 3.25075 8.03555 3.24136 8 3.24136C7.96444 3.24136 7.92951 3.25075 7.89875 3.26858C7.86799 3.28641 7.84249 3.31204 7.82483 3.34289L7.82271 3.34656L6.78772 5.12584C6.61534 5.42219 6.23524 5.52275 5.93875 5.35046C5.64225 5.17816 5.54164 4.79826 5.71402 4.50191L6.74808 2.72421C6.87439 2.50448 7.05636 2.32185 7.27571 2.19471Z"
                                                  fill="#333333"
                                                />
                                                <path
                                                  fill-rule="evenodd"
                                                  clip-rule="evenodd"
                                                  d="M5.32003 6.42836C5.61684 6.60011 5.71815 6.97983 5.54631 7.27649L3.26972 11.2068C3.26968 11.2069 3.26964 11.207 3.2696 11.207C3.25154 11.2384 3.24202 11.2739 3.24198 11.3101C3.24195 11.3463 3.25145 11.382 3.26953 11.4134C3.28761 11.4448 3.31364 11.471 3.34501 11.4892C3.37616 11.5073 3.41149 11.5169 3.44751 11.5172H5.51604C5.859 11.5172 6.13703 11.795 6.13703 12.1378C6.13703 12.4806 5.859 12.7585 5.51604 12.7585H3.44606L3.44388 12.7585C3.18996 12.7576 2.94074 12.69 2.72118 12.5626C2.50161 12.4351 2.31942 12.2522 2.19285 12.0322C2.06628 11.8122 1.99978 11.5628 2 11.309C2.00023 11.0552 2.06717 10.8059 2.19413 10.5861L4.47147 6.65453C4.64331 6.35786 5.02322 6.25661 5.32003 6.42836Z"
                                                  fill="#333333"
                                                />
                                              </g>
                                              <defs>
                                                <clipPath id="clip0_1573_11821">
                                                  <rect
                                                    width="16"
                                                    height="16"
                                                    fill="white"
                                                  />
                                                </clipPath>
                                              </defs>
                                            </svg>
                                          </S.AddModalIconButton>
                                        ) : (
                                          <S.AddModalIconButton
                                            onClick={onClickDeleteRepeatInput(
                                              index
                                            )}
                                          >
                                            <svg
                                              width="10"
                                              height="12"
                                              viewBox="0 0 10 12"
                                              fill="none"
                                              xmlns="http://www.w3.org/2000/svg"
                                            >
                                              <path
                                                d="M9.65625 0.65625V2H0.34375V0.65625H2.65625L3.34375 0H6.65625L7.34375 0.65625H9.65625ZM1 10.6562V2.65625H9V10.6562C9 11.0104 8.86458 11.3229 8.59375 11.5938C8.32292 11.8646 8.01042 12 7.65625 12H2.34375C1.98958 12 1.67708 11.8646 1.40625 11.5938C1.13542 11.3229 1 11.0104 1 10.6562Z"
                                                fill="#333333"
                                              />
                                            </svg>
                                          </S.AddModalIconButton>
                                        )}
                                      </div>
                                    </S.AddModalTd>
                                  </tr>
                                  {el?.isOne && (
                                    <tr>
                                      <S.AddModalTd
                                        style={{
                                          backgroundColor: "#EFE",
                                          color:
                                            selectedAddListIndex === index
                                              ? "#791285"
                                              : "",
                                        }}
                                      >
                                        {el.index + 1 + "-1"}
                                      </S.AddModalTd>
                                      <S.AddModalTd
                                        style={{
                                          backgroundColor: "#EFE",
                                          color:
                                            selectedAddListIndex === index
                                              ? "#791285"
                                              : "",
                                        }}
                                      >
                                        {el.oneChangeList?.[0]?.date}
                                      </S.AddModalTd>
                                      <S.AddModalTd
                                        style={{
                                          backgroundColor: "#EFE",
                                          color:
                                            selectedAddListIndex === index
                                              ? "#791285"
                                              : "",
                                        }}
                                      >
                                        {el.oneChangeList?.[0]?.startTime?.slice(
                                          0,
                                          5
                                        ) +
                                          "~" +
                                          el.oneChangeList?.[0]?.endTime?.slice(
                                            0,
                                            5
                                          )}
                                      </S.AddModalTd>
                                      <S.AddModalTd
                                        style={{
                                          backgroundColor: "#EFE",
                                          color:
                                            selectedAddListIndex === index
                                              ? "#791285"
                                              : "",
                                        }}
                                      >
                                        <div style={{ display: "flex" }}>
                                          {week?.map((_) => {
                                            return (
                                              <S.AddModalWeekBlock></S.AddModalWeekBlock>
                                            );
                                          })}
                                        </div>
                                      </S.AddModalTd>
                                      <S.AddModalTd
                                        style={{
                                          backgroundColor: "#EFE",
                                          color:
                                            selectedAddListIndex === index
                                              ? "#791285"
                                              : "",
                                        }}
                                      >
                                        {"없음"}
                                      </S.AddModalTd>
                                      <S.AddModalTdMaxWidth
                                        style={{
                                          backgroundColor: "#EFE",
                                          color:
                                            selectedAddListIndex === index
                                              ? "#791285"
                                              : "",
                                        }}
                                      >
                                        {el?.oneChangeList?.[0]?.about}
                                      </S.AddModalTdMaxWidth>
                                      <S.AddModalTd
                                        style={{
                                          backgroundColor: "#EFE",
                                          color:
                                            selectedAddListIndex === index
                                              ? "#791285"
                                              : "",
                                        }}
                                      >
                                        <S.AddModalIconButton
                                          style={{ marginRight: "0.62rem" }}
                                          onClick={onClickSelectRepeatInput(
                                            index
                                          )}
                                        >
                                          <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M11.8125 2.68848L10.5938 3.90723L8.09375 1.40723L9.3125 0.188477C9.4375 0.0634766 9.59375 0.000976562 9.78125 0.000976562C9.96875 0.000976562 10.125 0.0634766 10.25 0.188477L11.8125 1.75098C11.9375 1.87598 12 2.03223 12 2.21973C12 2.40723 11.9375 2.56348 11.8125 2.68848ZM0 9.50098L7.375 2.12598L9.875 4.62598L2.5 12.001H0V9.50098Z"
                                              fill="#333333"
                                            />
                                          </svg>
                                        </S.AddModalIconButton>
                                        <S.AddModalIconButton
                                          onClick={onClickAddOneChangeList(
                                            el,
                                            false
                                          )}
                                        >
                                          <svg
                                            width="10"
                                            height="12"
                                            viewBox="0 0 10 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M9.65625 0.65625V2H0.34375V0.65625H2.65625L3.34375 0H6.65625L7.34375 0.65625H9.65625ZM1 10.6562V2.65625H9V10.6562C9 11.0104 8.86458 11.3229 8.59375 11.5938C8.32292 11.8646 8.01042 12 7.65625 12H2.34375C1.98958 12 1.67708 11.8646 1.40625 11.5938C1.13542 11.3229 1 11.0104 1 10.6562Z"
                                              fill="#333333"
                                            />
                                          </svg>
                                        </S.AddModalIconButton>
                                      </S.AddModalTd>
                                    </tr>
                                  )}
                                </>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "flex-end",
                          margin: "0.62rem 0",
                        }}
                      >
                        <S.SettingButton
                          onClick={onClickAddRepeatInput(addRepeatInput.length)}
                        >
                          <svg
                            width="10"
                            height="11"
                            viewBox="0 0 10 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                              cursor: "pointer",
                              marginRight: "0.62rem",
                            }}
                          >
                            <path
                              d="M9.65625 6.15625H5.65625V10.1562H4.34375V6.15625H0.34375V4.84375H4.34375V0.84375H5.65625V4.84375H9.65625V6.15625Z"
                              fill="#333333"
                            />
                          </svg>
                          수업 추가
                        </S.SettingButton>
                      </div>
                      <S.AddModalWarning>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2.69141 9.30859C3.62109 10.2201 4.72396 10.6758 6 10.6758C7.27604 10.6758 8.36979 10.2201 9.28125 9.30859C10.2109 8.37891 10.6758 7.27604 10.6758 6C10.6758 4.72396 10.2109 3.63021 9.28125 2.71875C8.36979 1.78906 7.27604 1.32422 6 1.32422C4.72396 1.32422 3.62109 1.78906 2.69141 2.71875C1.77995 3.63021 1.32422 4.72396 1.32422 6C1.32422 7.27604 1.77995 8.37891 2.69141 9.30859ZM1.87109 1.89844C3.01953 0.75 4.39583 0.175781 6 0.175781C7.60417 0.175781 8.97135 0.75 10.1016 1.89844C11.25 3.02865 11.8242 4.39583 11.8242 6C11.8242 7.60417 11.25 8.98047 10.1016 10.1289C8.97135 11.2591 7.60417 11.8242 6 11.8242C4.39583 11.8242 3.01953 11.2591 1.87109 10.1289C0.740885 8.98047 0.175781 7.60417 0.175781 6C0.175781 4.39583 0.740885 3.02865 1.87109 1.89844ZM5.42578 3.07422H6.57422V6.57422H5.42578V3.07422ZM5.42578 7.75H6.57422V8.92578H5.42578V7.75Z"
                            fill="#FF0000"
                          />
                        </svg>
                        저장 버튼을 누르지 않고 나갈 경우 지금까지 변경한 내용은
                        저장되지 않습니다.
                      </S.AddModalWarning>
                    </>
                  )}
                </div>
                {addList.length !== 0 && (
                  <div
                    style={{
                      borderRight: "1px solid #dfe1e5",
                      marginLeft: "1.25rem",
                    }}
                  ></div>
                )}
                {addList.length !== 0 && (
                  <div style={{ marginLeft: "1rem", marginTop: "1.25rem" }}>
                    {addList.length !== 0 && (
                      <div
                        style={{ display: "flex", alignItems: "flex-start" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            width: "26.9rem",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            borderBottom: "1px solid #dfe1e5",
                            overflowX:
                              addRepeatInput.length > 5 ? "scroll" : "hidden",
                            overflowY: "hidden",
                          }}
                        >
                          {addRepeatInput?.map((el, ind) => {
                            if (el?.isDelete) {
                              return <></>;
                            }
                            return (
                              <S.AddModalSelectBox
                                style={{
                                  color:
                                    selectedAddListIndex === ind
                                      ? "#ffffff"
                                      : "#858585",
                                  backgroundColor:
                                    selectedAddListIndex === ind
                                      ? "#791285"
                                      : "#F5F5F5",
                                }}
                                onClick={() => {
                                  if (
                                    addRepeatInput?.length > ind &&
                                    addList.length !== 0
                                  ) {
                                    setSelectedAddListIndex(ind);
                                  }
                                }}
                              >
                                {ind + 1}
                                {/* {el.id === "" && addRepeatInput.length > 1 && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={onClickAddRepeatDelete(ind)}
                            >
                              <path
                                d="M11.2383 1.81641L7.05469 6L11.2383 10.1836L10.1836 11.2383L6 7.05469L1.81641 11.2383L0.761719 10.1836L4.94531 6L0.761719 1.81641L1.81641 0.761719L6 4.94531L10.1836 0.761719L11.2383 1.81641Z"
                                fill="#82858B"
                              />
                            </svg>
                          )} */}
                              </S.AddModalSelectBox>
                            );
                          })}
                        </div>

                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={
                            addList.length > 0
                              ? onClickAddRepeatInput(addRepeatInput.length)
                              : () => {}
                          }
                          style={{
                            cursor: "pointer",
                            marginTop: "0.44rem",
                            marginLeft: "1.19rem",
                          }}
                        >
                          <rect
                            x="0.5"
                            y="0.5"
                            width="29"
                            height="29"
                            rx="3.5"
                            fill="white"
                          />
                          <rect
                            x="0.5"
                            y="0.5"
                            width="29"
                            height="29"
                            rx="3.5"
                            stroke="#C8C8C8"
                          />
                          <path
                            d="M21 15.8456H15.8456V21H14.1544V15.8456H9V14.1544H14.1544V9H15.8456V14.1544H21V15.8456Z"
                            fill="#333333"
                          />
                        </svg>
                      </div>
                    )}

                    {/* {Array(6)
                  .fill(0)
                  .map((el, ind) => {
                    return (
                      <S.AddModalSelectBox
                        style={{
                          border: selectedAddListIndex === ind ? "" : "none",
                          borderBottom:
                            selectedAddListIndex === ind
                              ? "none"
                              : "1px solid #dfe1e5",
                        }}
                        onClick={() => {
                          if (
                            addRepeatInput?.length > ind &&
                            addList.length !== 0
                          ) {
                            setSelectedAddListIndex(ind);
                          }
                        }}
                      >
                        {addRepeatInput?.length > ind
                          ? "수업 " + (ind + 1)
                          : ""}
                        {addRepeatInput.length > 1 &&
                          addRepeatInput?.length > ind && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={onClickAddRepeatDelete(ind)}
                            >
                              <path
                                d="M11.2383 1.81641L7.05469 6L11.2383 10.1836L10.1836 11.2383L6 7.05469L1.81641 11.2383L0.761719 10.1836L4.94531 6L0.761719 1.81641L1.81641 0.761719L6 4.94531L10.1836 0.761719L11.2383 1.81641Z"
                                fill="#82858B"
                              />
                            </svg>
                          )}
                        {addRepeatInput.length === ind &&
                          addList.length !== 0 && (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={() => {
                                const newList = [...addRepeatInput];
                                newList.push({
                                  week: [-1],
                                  startTime: dateToClock(date),
                                  endTime: dateToClockOneHour(date),
                                  isAuto: false,
                                  isRepeat: "once",
                                  repeatsNum: 0,
                                  startDate: dateToInput(date),
                                  teacherId: teacherData?.staffInAcademy
                                    ?.filter(
                                      (el) =>
                                        el?.user?.userCategory === "선생님"
                                    )
                                    // .filter((el) => {
                                    //   return (
                                    //     Number(el.profile.academy.id) ===
                                    //     Number(router.query.branch)
                                    //   );
                                    // })
                                    ?.sort((a, b) => {
                                      if (
                                        Number(a.id) === Number(myData.me.id)
                                      ) {
                                        return -1;
                                      } else if (
                                        Number(b.id) === Number(myData.me.id)
                                      ) {
                                        return 1;
                                      } else {
                                        return Number(a.id) - Number(b.id);
                                      }
                                    })?.[0].id,
                                  about: "",
                                });
                                setAddRepeatInput(newList);
                                setAddRepeatCount(addRepeatCount + 1);
                                setSelectedAddListIndex(addRepeatInput.length);
                              }}
                            >
                              <path
                                d="M9.65625 5.65625H5.65625V9.65625H4.34375V5.65625H0.34375V4.34375H4.34375V0.34375H5.65625V4.34375H9.65625V5.65625Z"
                                fill="#333333"
                              />
                            </svg>
                          )}
                      </S.AddModalSelectBox>
                    );
                  })} */}

                    {addRepeatInput.map((el, ind) => {
                      if (ind === selectedAddListIndex) {
                        return (
                          <div
                            style={{
                              width: "32rem",
                              height: "38rem",
                              // overflow: "none",
                              overflowY: "scroll",
                              overflowX: "hidden",
                            }}
                          >
                            {addList.length !== 0 &&
                              el?.oneChangeList !== undefined && (
                                <>
                                  <S.AddModalTagTitle
                                    style={{ marginBottom: "1.25rem" }}
                                  >
                                    변경 유형
                                  </S.AddModalTagTitle>
                                  <div
                                    style={{
                                      display: "flex",
                                      width: "20rem",
                                      justifyContent: "space-between",
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <S.AddRadioButton
                                        type="radio"
                                        name="isOne"
                                        checked={!el?.isOne}
                                        onClick={onClickAddOneChangeList(
                                          el,
                                          false
                                        )}
                                        style={{
                                          width: "1.25rem",
                                          height: "1.25rem",
                                        }}
                                      ></S.AddRadioButton>
                                      <span
                                        style={{
                                          color: !el?.isOne
                                            ? "#791285"
                                            : "#82858B",
                                          fontFamily: "Spoqa Han Sans Neo",
                                        }}
                                      >
                                        전체 변경
                                      </span>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        alignItems: "center",
                                      }}
                                    >
                                      <S.AddRadioButton
                                        type="radio"
                                        name="isOne"
                                        checked={el?.isOne}
                                        onClick={onClickAddOneChangeList(
                                          el,
                                          true
                                        )}
                                        style={{
                                          width: "1.25rem",
                                          height: "1.25rem",
                                        }}
                                      ></S.AddRadioButton>
                                      <span
                                        style={{
                                          color: el?.isOne
                                            ? "#791285"
                                            : "#82858B",
                                          fontFamily: "Spoqa Han Sans Neo",
                                        }}
                                      >
                                        단일 변경
                                      </span>
                                    </div>
                                  </div>
                                  {el.isOne && (
                                    <div>
                                      <S.AddModalTagTitle
                                        style={{ color: "#999" }}
                                      >
                                        {"변경 수업 정보 (열 번호 " +
                                          (ind + 1) +
                                          "-1)"}
                                      </S.AddModalTagTitle>
                                      <div style={{ display: "flex" }}>
                                        <div>
                                          <S.AddModalTagTitle>
                                            지정 날짜
                                          </S.AddModalTagTitle>
                                          <S.AddModalSelect
                                            onChange={onChangeOneId(ind)}
                                          >
                                            {lectureInfoData?.studentLectures
                                              ?.filter((ele) => {
                                                return (
                                                  ele?.lecture?.lectureInfo
                                                    ?.id === el?.id
                                                );
                                              })
                                              ?.filter((ele) => {
                                                const newDate = new Date(
                                                  ele.lecture.date
                                                );
                                                if (
                                                  newDate.getDate() ===
                                                    calendarDate.getDate() &&
                                                  newDate.getMonth() ===
                                                    calendarDate.getMonth() &&
                                                  newDate.getFullYear() ===
                                                    calendarDate.getFullYear()
                                                ) {
                                                  return true;
                                                }
                                                return (
                                                  newDate - calendarDate >= 0
                                                );
                                              })
                                              ?.map((ele) => {
                                                const newDate = new Date(
                                                  ele.lecture.date
                                                );
                                                return (
                                                  <option
                                                    selected={
                                                      Number(
                                                        ele?.lecture?.id
                                                      ) ===
                                                      Number(
                                                        el?.oneChangeList?.[0]
                                                          ?.lectureId
                                                      )
                                                    }
                                                    value={ele?.lecture?.id}
                                                  >
                                                    {ele?.lecture?.date +
                                                      "(" +
                                                      week[
                                                        (newDate.getDay() + 6) %
                                                          7
                                                      ] +
                                                      ")"}
                                                  </option>
                                                );
                                              })}
                                          </S.AddModalSelect>
                                        </div>
                                        <div>
                                          <S.AddModalTitle>
                                            변경 날짜
                                          </S.AddModalTitle>
                                          <S.AddModalInputDate
                                            onChange={onChangeOneDate(ind)}
                                            value={el?.oneChangeList?.[0]?.date}
                                            type="date"
                                          ></S.AddModalInputDate>
                                        </div>
                                      </div>
                                      <div style={{ display: "flex" }}>
                                        <div>
                                          <S.AddModalTitle>
                                            지점
                                          </S.AddModalTitle>
                                          {myData?.me?.profile?.academies
                                            ?.length > 0 ? (
                                            <S.AddModalSelect
                                              onChange={onChangeOneBranch(ind)}
                                            >
                                              {myData?.me?.profile?.academies?.map(
                                                (ele) => {
                                                  return (
                                                    <option
                                                      value={Number(ele.id)}
                                                      selected={
                                                        Number(
                                                          router.query.branch
                                                        ) ===
                                                        Number(
                                                          el?.oneChangeList?.[0]
                                                            ?.branchId
                                                        )
                                                      }
                                                    >
                                                      {ele.location}
                                                    </option>
                                                  );
                                                }
                                              )}
                                            </S.AddModalSelect>
                                          ) : (
                                            <S.AddModalSelect disabled={true}>
                                              <option
                                                value={Number(
                                                  router.query.branch
                                                )}
                                              >
                                                {
                                                  myData?.me?.profile?.academy
                                                    ?.name
                                                }
                                              </option>
                                            </S.AddModalSelect>
                                          )}
                                        </div>
                                        <div>
                                          <S.AddModalTitle>
                                            담당 선생님
                                          </S.AddModalTitle>
                                          <S.AddModalSelect
                                            onChange={onChangeOneTeacher(ind)}
                                          >
                                            {teacherData?.staffInAcademy
                                              ?.filter(
                                                (el) =>
                                                  el.user.userCategory ===
                                                  "선생님"
                                              )
                                              .map((ele) => {
                                                return (
                                                  <option
                                                    value={ele.id}
                                                    selected={
                                                      Number(ele.id) ===
                                                      Number(
                                                        el.oneChangeList?.[0]
                                                          ?.teacherId
                                                      )
                                                    }
                                                  >
                                                    {ele.korName}
                                                  </option>
                                                );
                                              })}
                                          </S.AddModalSelect>
                                        </div>
                                      </div>
                                      <div>
                                        <S.AddModalTitle>
                                          수업시간
                                        </S.AddModalTitle>
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <S.AddModalInputTime
                                            type="time"
                                            onChange={onChangeOneStartTime(ind)}
                                            value={
                                              el?.oneChangeList?.[0]?.startTime
                                            }
                                          ></S.AddModalInputTime>
                                          ~
                                          <S.AddModalInputTime
                                            type="time"
                                            onChange={onChangeOneEndTime(ind)}
                                            value={
                                              el?.oneChangeList?.[0]?.endTime
                                            }
                                          ></S.AddModalInputTime>
                                        </div>
                                      </div>
                                      <div>
                                        <S.AddModalTitle>메모</S.AddModalTitle>
                                        <S.AddModalTextArea
                                          onChange={onChangeOneAbout(ind)}
                                          value={el?.oneChangeList?.[0]?.about}
                                          placeholder={"메모를 입력해주세요."}
                                        ></S.AddModalTextArea>
                                      </div>
                                      <S.AddModalTagTitle
                                        style={{ color: "#999" }}
                                      >
                                        {"기존 수업 정보 (열 번호 " +
                                          (ind + 1) +
                                          ")"}
                                      </S.AddModalTagTitle>
                                    </div>
                                  )}
                                </>
                              )}
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "31rem",
                              }}
                            >
                              <div>
                                <S.AddModalTagTitle>
                                  변경 시작 날짜
                                </S.AddModalTagTitle>
                                <S.AddModalInputDate
                                  type="date"
                                  value={addRepeatInput[ind].startDate}
                                  disabled={addList.length === 0 || el.isOne}
                                  onChange={onChangeRepeatDate(ind)}
                                ></S.AddModalInputDate>
                              </div>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <div>
                                <S.AddModalTagTitle>지점</S.AddModalTagTitle>
                                {myData?.me?.profile?.academies?.length > 0 ? (
                                  <S.AddModalSelect onChange={(e) => {}}>
                                    {myData?.me?.profile?.academies?.map(
                                      (ele) => {
                                        return (
                                          <option
                                            value={Number(ele.id)}
                                            selected={
                                              Number(router.query.branch) ===
                                              Number(
                                                el?.oneChangeList?.[0]?.branchId
                                              )
                                            }
                                            disabled={true}
                                          >
                                            {ele.location}
                                          </option>
                                        );
                                      }
                                    )}
                                  </S.AddModalSelect>
                                ) : (
                                  <S.AddModalSelect disabled={true}>
                                    <option value={Number(router.query.branch)}>
                                      {myData?.me?.profile?.academy?.name}
                                    </option>
                                  </S.AddModalSelect>
                                )}
                              </div>
                              <div>
                                <S.AddModalTagTitle>
                                  담당 선생님
                                </S.AddModalTagTitle>
                                <S.AddModalSelect
                                  onChange={onChangeRepeatTeacherId(ind)}
                                  style={{
                                    backgroundColor:
                                      addList.length === 0 || el.isOne
                                        ? "#f1f1f1"
                                        : "",
                                  }}
                                  disabled={addList.length === 0 || el.isOne}
                                  // value={teacherId}
                                >
                                  {teacherData?.staffInAcademy
                                    ?.filter(
                                      (el) => el.user.userCategory === "선생님"
                                    )
                                    .map((el) => {
                                      return (
                                        <option
                                          key={uuidv4()}
                                          value={el.id}
                                          selected={
                                            Number(
                                              addRepeatInput[ind].teacherId
                                            ) === Number(el.id)
                                          }
                                        >
                                          {el.korName}
                                        </option>
                                      );
                                    })}
                                </S.AddModalSelect>
                              </div>
                            </div>
                            <S.AddModalTagTitle>반복</S.AddModalTagTitle>
                            <S.ModalRadioBox>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "2rem",
                                    // width: "13rem",
                                  }}
                                >
                                  <S.AddRadioButton
                                    type="radio"
                                    name={"type" + ind}
                                    value={"routine"}
                                    checked={
                                      addRepeatInput[ind].isRepeat === "routine"
                                    }
                                    style={{
                                      width: "1.25rem",
                                      height: "1.25rem",
                                      backgroundColor: "#791285",
                                    }}
                                    onClick={onChangeRepeatIsRepeat(
                                      ind,
                                      "routine"
                                    )}
                                    disabled={addList.length === 0 || el.isOne}
                                  ></S.AddRadioButton>
                                  <S.AddRadioTitle
                                    style={
                                      addRepeatInput[ind].isRepeat ===
                                        "routine" && addList.length !== 0
                                        ? { marginRight: "1rem" }
                                        : {
                                            color: "#cccccc",
                                            marginRight: "1rem",
                                          }
                                    }
                                  >
                                    주 반복
                                  </S.AddRadioTitle>
                                  <div
                                    style={{
                                      width: "3.4375rem",
                                      border: "1px solid #DBDDE1",
                                      borderRadius: "0.5rem",
                                      backgroundColor:
                                        addRepeatInput[ind].isAuto ||
                                        addList.length === 0 ||
                                        el.isOne
                                          ? "#f9f9f9"
                                          : "",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      onChange={onChangeRepeatCount(ind)}
                                      style={{
                                        borderRadius: "0.5rem",
                                        border: "0",
                                        width: "2.2rem",
                                        height: "2.6875rem",
                                        textAlign: "center",
                                        paddingLeft: "1rem",
                                      }}
                                      value={
                                        addRepeatInput[ind]?.isRepeat ===
                                        "routine"
                                          ? addRepeatInput[ind].repeatsNum
                                          : 0
                                      }
                                      disabled={
                                        addRepeatInput[ind].isAuto ||
                                        addList.length === 0 ||
                                        el.isOne ||
                                        addRepeatInput[ind]?.isRepeat !==
                                          "routine"
                                      }
                                    ></input>
                                  </div>
                                  <S.AddModalContent
                                    style={{ marginLeft: "0.62rem" }}
                                  >
                                    {"주"}
                                  </S.AddModalContent>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                  }}
                                >
                                  <S.AddRadioButton
                                    type="radio"
                                    name={"type" + ind}
                                    checked={
                                      addRepeatInput[ind].isRepeat ===
                                      "infinity"
                                    }
                                    value={"infinity"}
                                    onClick={onChangeRepeatIsRepeat(
                                      ind,
                                      "infinity"
                                    )}
                                    style={{
                                      width: "1.25rem",
                                      height: "1.25rem",
                                    }}
                                    disabled={addList.length === 0 || el.isOne}
                                  ></S.AddRadioButton>
                                  <S.AddRadioTitle
                                    style={
                                      addRepeatInput[ind].isRepeat ===
                                        "infinity" && addList.length !== 0
                                        ? {}
                                        : { color: "#cccccc" }
                                    }
                                  >
                                    무한 반복
                                  </S.AddRadioTitle>
                                </div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  marginLeft: "5.75rem",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginBottom: "2rem",
                                  }}
                                >
                                  <S.AddRadioButton
                                    type="radio"
                                    name={"type" + ind}
                                    value={"routine"}
                                    checked={
                                      addRepeatInput[ind].isRepeat === "count"
                                    }
                                    style={{
                                      width: "1.25rem",
                                      height: "1.25rem",
                                    }}
                                    onClick={onChangeRepeatIsRepeat(
                                      ind,
                                      "count"
                                    )}
                                    disabled={addList.length === 0 || el.isOne}
                                  ></S.AddRadioButton>
                                  <S.AddRadioTitle
                                    style={
                                      addRepeatInput[ind].isRepeat ===
                                        "count" && addList.length !== 0
                                        ? { marginRight: "1rem" }
                                        : {
                                            color: "#cccccc",
                                            marginRight: "1rem",
                                          }
                                    }
                                  >
                                    횟수 반복
                                  </S.AddRadioTitle>
                                  <div
                                    style={{
                                      width: "3.4375rem",
                                      border: "1px solid #DBDDE1",
                                      borderRadius: "0.5rem",
                                      backgroundColor:
                                        addRepeatInput[ind].isAuto ||
                                        addList.length === 0 ||
                                        el.isOne
                                          ? "#f9f9f9"
                                          : "",
                                    }}
                                  >
                                    <input
                                      type="number"
                                      onChange={onChangeRepeatCount(ind)}
                                      style={{
                                        borderRadius: "0.5rem",
                                        border: "0",
                                        width: "2.2rem",
                                        height: "2.6875rem",
                                        textAlign: "center",
                                        paddingLeft: "1rem",
                                      }}
                                      value={
                                        addRepeatInput[ind]?.isRepeat ===
                                        "count"
                                          ? addRepeatInput[ind].repeatsNum
                                          : 0
                                      }
                                      disabled={
                                        addRepeatInput[ind].isAuto ||
                                        addList.length === 0 ||
                                        el.isOne ||
                                        addRepeatInput[ind]?.isRepeat !==
                                          "count"
                                      }
                                    ></input>
                                  </div>
                                  <S.AddModalContent
                                    style={{ marginLeft: "0.62rem" }}
                                  >
                                    {"회"}
                                  </S.AddModalContent>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <S.AddRadioButton
                                    type="radio"
                                    name={"type" + ind}
                                    checked={
                                      addRepeatInput[ind].isRepeat === "once"
                                    }
                                    value={"once"}
                                    onClick={onChangeRepeatIsRepeat(
                                      ind,
                                      "once"
                                    )}
                                    style={{
                                      width: "1.25rem",
                                      height: "1.25rem",
                                    }}
                                    disabled={addList.length === 0 || el.isOne}
                                  ></S.AddRadioButton>
                                  <S.AddRadioTitle
                                    style={
                                      addRepeatInput[ind].isRepeat === "once" &&
                                      addList.length !== 0
                                        ? {}
                                        : { color: "#cccccc" }
                                    }
                                  >
                                    반복 없음
                                  </S.AddRadioTitle>
                                </div>
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
                                  {/* <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "0.7rem",
                                marginBottom: "1.25rem",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={addRepeatInput[ind].isAuto}
                                style={{
                                  width: "1rem",
                                  height: "1rem",
                                  marginRight: "0.62rem",
                                }}
                                onChange={onChangeRepeatIsAuto(ind)}
                                disabled={
                                  addRepeatInput[ind].isRepeat === "count" ||
                                  addList.length === 0 ||
                                  el.isOne
                                }
                              ></input>
                              <S.AddModalContent
                                style={{
                                  fontSize: "1rem",
                                  fontWeight: "400",
                                  fontStyle: "Noto Sans KR",
                                }}
                              >
                                자동 생성
                              </S.AddModalContent>
                            </div> */}
                                </div>

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    marginLeft: "0.6rem",
                                  }}
                                >
                                  {/* <div
                              style={{
                                width: "3.4375rem",
                                border: "1px solid #DBDDE1",
                                borderRadius: "0.5rem",
                                backgroundColor:
                                  addRepeatInput[ind].isAuto ||
                                  addList.length === 0 ||
                                  el.isOne
                                    ? "#f9f9f9"
                                    : "",
                              }}
                            >
                              <input
                                type="number"
                                onChange={onChangeRepeatCount(ind)}
                                style={{
                                  borderRadius: "0.5rem",
                                  border: "0",
                                  width: "2.2rem",
                                  height: "2.6875rem",
                                  textAlign: "center",
                                  paddingLeft: "1rem",
                                }}
                                value={addRepeatInput[ind].repeatsNum}
                                disabled={
                                  addRepeatInput[ind].isAuto ||
                                  addList.length === 0 ||
                                  el.isOne
                                }
                              ></input>
                            </div>
                            <S.AddModalContent
                              style={{ marginLeft: "0.62rem" }}
                            >
                              {addRepeatInput[ind].isRepeat === "count"
                                ? "회 동안"
                                : "주 동안"}
                            </S.AddModalContent> */}
                                  <S.ModalRoutineDates>
                                    {week.map((week, index) => {
                                      return (
                                        <S.ModalRoutineDate
                                          key={uuidv4()}
                                          onClick={onClickRepeatDates(
                                            ind,
                                            index
                                          )}
                                          style={
                                            addList.length === 0 || el.isOne
                                              ? { backgroundColor: "#f9f9f9" }
                                              : addRepeatInput[
                                                  ind
                                                ].week.includes(index)
                                              ? {
                                                  backgroundColor: "#791285",
                                                  color: "#eeeeee",
                                                }
                                              : {}
                                          }
                                        >
                                          {week}
                                        </S.ModalRoutineDate>
                                      );
                                    })}
                                  </S.ModalRoutineDates>
                                  <S.AddModalContent
                                    style={{ marginLeft: "0.62rem" }}
                                  >
                                    {" "}
                                    반복
                                  </S.AddModalContent>
                                </div>
                              </>
                            )}

                            <S.AddModalTagTitle>수업 시간</S.AddModalTagTitle>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "29.5rem",
                              }}
                            >
                              <S.AddModalTimeInput
                                type="time"
                                disabled={addList.length === 0 || el.isOne}
                                style={{ marginLeft: "0.66rem" }}
                                value={addRepeatInput[ind].startTime}
                                onChange={onChangeRepeatStartTime(ind)}
                              ></S.AddModalTimeInput>
                              ~
                              <S.AddModalTimeInput
                                type="time"
                                disabled={addList.length === 0 || el.isOne}
                                // defaultValue={dateToClockOneHour(date)}
                                value={addRepeatInput[ind].endTime}
                                onChange={onChangeRepeatEndTime(ind)}
                              ></S.AddModalTimeInput>
                            </div>
                            <S.ModalInputBox style={{ display: "block" }}>
                              <S.AddModalTagTitle>메모</S.AddModalTagTitle>

                              <S.AddModalTextArea
                                onChange={onChangeRepeatAbout(ind)}
                                style={{
                                  // width: "30.6rem",
                                  borderRadius: "0.5rem",
                                  border: "1px solid #DBDDE1",
                                }}
                                disabled={addList.length === 0 || el.isOne}
                                placeholder={"메모를 입력해주세요."}
                                value={addRepeatInput[ind].about}
                              ></S.AddModalTextArea>
                            </S.ModalInputBox>
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </S.ModalClassAddWrapper>
              <S.ModalButtonBox
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginTop: "0.87rem",
                  // backgroundColor: "#F4F4F8",
                }}
              >
                <S.AddModalOKButton
                  style={
                    addList.length === 0
                      ? {
                          borderRadius: "0.25rem",
                          border: "1px solid #791285",
                          cursor: "default",
                          opacity: 0.5,
                          background: "#791285",
                          color: "#FFF",
                        }
                      : {}
                  }
                  disabled={addList.length === 0}
                  onClick={onClickOk}
                >
                  저장
                </S.AddModalOKButton>
                <S.AddModalCancelButton
                  onClick={onClickCancel}
                  style={{ background: "#EBECEF", color: "#000" }}
                >
                  취소
                </S.AddModalCancelButton>
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
              width={"40.125rem"}
            >
              <S.MakeUpModalTitle>
                <svg
                  width="1rem"
                  height="1rem"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: "0.62rem" }}
                >
                  <path
                    d="M4.55357 3.80516H5.41071V6.723L7.71429 8.03991L7.25893 8.71127L4.55357 7.11033V3.80516ZM9.08036 6H10.2321C10.2679 6.18936 10.2857 6.37011 10.2857 6.54225C10.2857 7.23083 10.1518 7.87637 9.88393 8.47887C9.61607 9.08138 9.24107 9.61502 8.75893 10.0798C8.29464 10.5274 7.75 10.8803 7.125 11.1385C6.51786 11.3795 5.85714 11.5 5.14286 11.5C4.42857 11.5 3.75893 11.3795 3.13393 11.1385C2.50893 10.8803 1.95536 10.5274 1.47321 10.0798C1.00893 9.61502 0.642857 9.08138 0.375 8.47887C0.125 7.87637 0 7.23083 0 6.54225C0 5.85368 0.125 5.21674 0.375 4.63146C0.642857 4.02895 1.00893 3.50391 1.47321 3.05634C1.95536 2.59155 2.50893 2.23005 3.13393 1.97183C3.75893 1.71362 4.42857 1.58451 5.14286 1.58451C5.51786 1.58451 5.89286 1.62754 6.26786 1.71362V2.84977C5.91071 2.74648 5.53571 2.69484 5.14286 2.69484C4.57143 2.69484 4.04464 2.79812 3.5625 3.00469C3.08036 3.19405 2.65179 3.46948 2.27679 3.83099C1.91964 4.17527 1.63393 4.57981 1.41964 5.0446C1.22321 5.50939 1.125 6.00861 1.125 6.54225C1.125 7.09311 1.22321 7.60094 1.41964 8.06573C1.63393 8.53052 1.91964 8.94366 2.27679 9.30516C2.65179 9.64945 3.08036 9.92488 3.5625 10.1315C4.04464 10.3208 4.57143 10.4155 5.14286 10.4155C5.69643 10.4155 6.21429 10.3208 6.69643 10.1315C7.17857 9.92488 7.59821 9.64945 7.95536 9.30516C8.33036 8.94366 8.61607 8.53052 8.8125 8.06573C9.02679 7.60094 9.13393 7.09311 9.13393 6.54225C9.13393 6.37011 9.11607 6.18936 9.08036 6ZM10.2857 2.15258H12V3.23709H10.2857V4.88967H9.13393V3.23709H7.41964V2.15258H9.13393V0.5H10.2857V2.15258Z"
                    fill="#791285"
                  />
                </svg>
                보강 학습 추가
              </S.MakeUpModalTitle>
              <div
                style={{
                  width: "100%",
                  borderBottom: "1px solid #DFE1E5",
                  margin: "1.25rem 0",
                }}
              ></div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <S.MakeUpModalTagTitle>원생 번호</S.MakeUpModalTagTitle>
                  <S.MakeUpModalInput
                    value={makeUpOrigin}
                    disabled={true}
                  ></S.MakeUpModalInput>
                </div>
                <div>
                  <S.MakeUpModalTagTitle>원생 이름</S.MakeUpModalTagTitle>
                  <S.MakeUpModalInput
                    defaultValue={makeUpStudentName}
                    disabled={true}
                  ></S.MakeUpModalInput>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  borderBottom: "1px solid #DFE1E5",
                  margin: "1.25rem 0",
                }}
              ></div>
              <S.MakeUpModalSubTitle>결석한 수업</S.MakeUpModalSubTitle>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <S.MakeUpModalTagTitle>결석 날짜</S.MakeUpModalTagTitle>
                  <S.MakeUpModalInput
                    // type="date"
                    value={absentDate}
                    disabled={true}
                  ></S.MakeUpModalInput>
                </div>
                <div>
                  <S.MakeUpModalTagTitle>
                    시작 시간 ~ 종료 시간
                  </S.MakeUpModalTagTitle>
                  <S.MakeUpModalInput
                    value={absentTime}
                    disabled={true}
                  ></S.MakeUpModalInput>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  borderBottom: "1px solid #DFE1E5",
                  margin: "1.25rem 0",
                }}
              ></div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <S.MakeUpModalSubTitle>보강 수업</S.MakeUpModalSubTitle>
                <div
                  style={{
                    marginBottom: "1.25rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <S.MakeUpModalTagTitle>보강 날짜</S.MakeUpModalTagTitle>
                    <S.DateLabel>
                      <S.ModalBorderLess
                        style={{ width: "15rem" }}
                        type="date"
                        defaultValue={dateToInput(date)}
                        onChange={(event) => {
                          setMakeUpDate(event.target.value);
                        }}
                      ></S.ModalBorderLess>
                      <div style={{ position: "absolute", left: "9.5rem" }}>
                        {"(" + dateInputToDay(makeUpDate) + ")"}
                      </div>
                    </S.DateLabel>
                    {/* <S.MakeUpModalInput
                  type="date"
                  onChange={(e) => {
                    setMakeUpDate(e.target.value);
                  }}
                  value={makeUpDate}
                ></S.MakeUpModalInput> */}
                  </div>
                  <div>
                    <S.MakeUpModalTagTitle>담당 선생님</S.MakeUpModalTagTitle>
                    <select
                      onChange={(event) => {
                        setMakeUpTeacherId(event.target.value);
                      }}
                      value={makeUpTeacherId}
                      style={{
                        width: "16.525rem",
                        height: "2.6875rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #DFE1E5",
                        marginLeft: "0.62rem",
                        fontSize: "1rem",
                        fontFamily: "Spoqa Han Sans Neo",
                        paddingLeft: "0.62rem",
                      }}
                    >
                      {teacherData?.staffInAcademy
                        ?.filter((el) => el.user.userCategory === "선생님")
                        .map((el) => {
                          return (
                            <option key={uuidv4()} value={el.id}>
                              {el.korName}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                </div>
                <div>
                  <S.MakeUpModalTagTitle>수업 시간</S.MakeUpModalTagTitle>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1.25rem",
                    }}
                  >
                    <S.MakeUpModalInput
                      type="time"
                      onChange={(e) => {
                        setMakeUpStart(e.target.value);
                      }}
                      value={makeUpStart}
                    ></S.MakeUpModalInput>
                    ~
                    <S.MakeUpModalInput
                      type="time"
                      onChange={(e) => {
                        setMakeUpEnd(e.target.value);
                      }}
                      value={makeUpEnd}
                    ></S.MakeUpModalInput>
                  </div>
                </div>
                <div>
                  <S.MakeUpModalTagTitle>보강 설명</S.MakeUpModalTagTitle>
                  <S.MakeUpModalTextArea
                    type="text"
                    onChange={(e) => {
                      setMakeUpInfo(e.target.value);
                    }}
                    value={makeUpInfo}
                  ></S.MakeUpModalTextArea>
                </div>
                <div
                  style={{
                    width: "100%",
                    borderBottom: "1px solid #DFE1E5",
                    marginTop: "1.25rem",
                  }}
                ></div>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "0.87rem",
                  }}
                >
                  <S.MakeUpModalOKButton onClick={onClickMakeUpClass}>
                    저장
                  </S.MakeUpModalOKButton>
                  <S.MakeUpModalCancelButton
                    onClick={() => {
                      setIsMakeUp(false);
                    }}
                  >
                    취소
                  </S.MakeUpModalCancelButton>
                </div>
              </div>
            </Modal>
          )}
          {/* {studentToggle ? (
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
      )} */}
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
                      <table style={{ width: "100%" }}>
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
                      <table style={{ width: "100%" }}>
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
                                      (el) =>
                                        Number(el.id) === Number(student.id)
                                    )?.origin
                                  }
                                </td>
                                <td key={index}>
                                  {
                                    studentData?.studentsInAcademy?.find(
                                      (el) =>
                                        Number(el.id) === Number(student.id)
                                    )?.korName
                                  }
                                </td>
                                <td key={index}>
                                  {
                                    studentData?.studentsInAcademy?.find(
                                      (el) =>
                                        Number(el.id) === Number(student.id)
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
                    {reservationBookData?.studentReservedBooks?.map(
                      (el, index) => {
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
                              <button
                                onClick={onClickReturnBook(Number(el.id))}
                              >
                                반납
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    )}
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
                      color:
                        reserveType === "recommend" ? "#111111" : "#111111",
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
                                style={{
                                  marginLeft: "10px",
                                  marginTop: "10px",
                                }}
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
                                style={{
                                  marginLeft: "10px",
                                  marginTop: "10px",
                                }}
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
                                style={{
                                  marginLeft: "10px",
                                  marginTop: "10px",
                                }}
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
                                style={{
                                  marginLeft: "10px",
                                  marginTop: "10px",
                                }}
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
                                  style={{
                                    marginLeft: "10px",
                                    marginTop: "10px",
                                  }}
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
                                  style={{
                                    marginLeft: "10px",
                                    marginTop: "10px",
                                  }}
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
                                    <DownOutlined
                                      onClick={onClickSortType("ar")}
                                    />
                                  )}
                                </th>

                                <th style={{ width: "6.5%" }}>
                                  WC{" "}
                                  {sortType === "wordCount" ? (
                                    <UpOutlined
                                      onClick={onClickSortType(
                                        "wordCountReverse"
                                      )}
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
                                style={{
                                  marginLeft: "10px",
                                  marginTop: "10px",
                                }}
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
                          {fictionData?.getRecommendBooks?.[0]?.inventoryNum +
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
                            {fictionData?.getRecommendBooks?.map(
                              (el, index) => {
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
                              }
                            )}
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
                          추천 도서 패키지가 없습니다. 패키지를 새로
                          받아주십시오.
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
                          {nonFictionData?.getRecommendBooks?.[0]
                            ?.inventoryNum + "권"}
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
                            {nonFictionData?.getRecommendBooks?.map(
                              (el, index) => {
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
                              }
                            )}
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
                          추천 도서 패키지가 없습니다. 패키지를 새로
                          받아주십시오.
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
                    // nonFictionData !== undefined &&
                    // fictionData !== undefined &&
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
                    onClick={
                      isPeriod ? onClickConfirmPeriod : onClickConfirmRecord
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
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4rem",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontWeight: "600" }}>알람 소리</span>
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
                  <S.ModalOkButton onClick={onClickSetting}>
                    저장
                  </S.ModalOkButton>
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
                <table
                  style={{
                    width: "100%",
                    borderRight: "none",
                    borderLeft: "none",
                  }}
                >
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
              // onOk={onClickUpdateLecture}
              onCancel={() => {
                setIsEdit(false);
                // setEditDate(dateToInput(date));
                // setEditStartTime(dateToClock(date));
                // setEditEndTime(dateToClockOneHour(date));
                setEditInfo("");
                setEditAcademy(Number(router.query.branch));
                setIsAll(false);
                setTeacherId(
                  teacherData?.staffInAcademy
                    ?.filter((el) => el.user.userCategory === "선생님")
                    ?.sort((a, b) => {
                      if (Number(a.id) === Number(myData.me.id)) {
                        return -1;
                      } else if (Number(b.id) === Number(myData.me.id)) {
                        return 1;
                      } else {
                        return Number(a.id) - Number(b.id);
                      }
                    })?.[0].id
                );
              }}
              footer={null}
              closable={false}
              width={"60%"}
              keyboard={true}
            >
              <S.EditModalTitle>수업 수정</S.EditModalTitle>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ width: "48%" }}>
                  <S.EditModalTagTitle>원생 수업 목록</S.EditModalTagTitle>
                  {isAll ? (
                    <>
                      <div>수정 전</div>
                      <table style={{ width: "100%" }}>
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
                                    {el?.lecture?.lectureInfo?.repeatDay.includes(
                                      -1
                                    )
                                      ? el?.lecture?.date
                                      : el?.lecture?.lectureInfo?.autoAdd
                                      ? startDate(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatDay
                                        ) + "~"
                                      : startDate(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatDay
                                        ) +
                                        "~" +
                                        (el?.lecture?.lectureInfo
                                          ?.repeatTimes === null
                                          ? lastDate(
                                              el?.lecture?.date,
                                              el?.lecture?.lectureInfo
                                                ?.repeatWeeks,
                                              el?.lecture?.lectureInfo
                                                ?.repeatDay
                                            )
                                          : lastCount(
                                              el?.lecture?.date,
                                              el?.lecture?.lectureInfo
                                                ?.repeatTimes,
                                              el?.lecture?.lectureInfo
                                                ?.repeatDay
                                            ))}
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
                      <div>수정 후</div>
                      <table style={{ width: "100%" }}>
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
                              if (
                                Number(el?.lecture?.lectureInfo?.id) ===
                                Number(checkList[0].lectureInfoId)
                              ) {
                                return (
                                  <tr>
                                    <td
                                      style={{
                                        color:
                                          Number(
                                            el?.lecture?.lectureInfo?.id
                                          ) ===
                                          Number(checkList[0].lectureInfoId)
                                            ? "tomato"
                                            : "",
                                      }}
                                    >
                                      {lastDate(
                                        editDate,
                                        editRepeatCount,
                                        editRepeatWeek
                                      )
                                        ? isAll
                                          ? startDate(
                                              editDate,
                                              editRepeatWeek
                                            ) +
                                            (isEditRepeat === "once"
                                              ? ""
                                              : "~" +
                                                (isEditAuto
                                                  ? ""
                                                  : isEditRepeat === "routine"
                                                  ? lastDate(
                                                      editDate,
                                                      editRepeatCount,
                                                      editRepeatWeek
                                                    )
                                                  : lastCount(
                                                      editDate,
                                                      editRepeatCount,
                                                      editRepeatWeek
                                                    )))
                                          : ""
                                        : editDate}
                                    </td>
                                    <td>
                                      {editRepeatWeek.length === 0
                                        ? "없음"
                                        : editRepeatWeek
                                            ?.sort((a, b) => {
                                              return a - b;
                                            })
                                            .map((ele) => {
                                              return week[ele];
                                            })}
                                    </td>
                                    <td>
                                      {editStartTime.slice(0, 5) +
                                        "-" +
                                        editEndTime.slice(0, 5)}
                                    </td>
                                  </tr>
                                );
                              } else {
                                return (
                                  <tr>
                                    <td
                                      style={{
                                        color:
                                          Number(
                                            el?.lecture?.lectureInfo?.id
                                          ) ===
                                          Number(checkList[0].lectureInfoId)
                                            ? "tomato"
                                            : "",
                                      }}
                                    >
                                      {el?.lecture?.lectureInfo?.repeatDay.includes(
                                        -1
                                      )
                                        ? el?.lecture?.date
                                        : el?.lecture?.lectureInfo?.autoAdd
                                        ? startDate(
                                            el?.lecture?.date,
                                            el?.lecture?.lectureInfo?.repeatDay
                                          ) + "~"
                                        : startDate(
                                            el?.lecture?.date,
                                            el?.lecture?.lectureInfo?.repeatDay
                                          ) +
                                          "~" +
                                          (el?.lecture?.lectureInfo
                                            ?.repeatTimes === null
                                            ? lastDate(
                                                el?.lecture?.date,
                                                el?.lecture?.lectureInfo
                                                  ?.repeatWeeks,
                                                el?.lecture?.lectureInfo
                                                  ?.repeatDay
                                              )
                                            : lastCount(
                                                el?.lecture?.date,
                                                el?.lecture?.lectureInfo
                                                  ?.repeatTimes,
                                                el?.lecture?.lectureInfo
                                                  ?.repeatDay
                                              ))}
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
                              }
                            })}
                        </tbody>
                      </table>
                    </>
                  ) : (
                    <>
                      <div>수정 전</div>
                      <table style={{ width: "100%" }}>
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
                                    {el?.lecture?.lectureInfo?.repeatDay.includes(
                                      -1
                                    )
                                      ? el?.lecture?.date
                                      : el?.lecture?.lectureInfo?.autoAdd
                                      ? startDate(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatDay
                                        ) + "~"
                                      : startDate(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatDay
                                        ) +
                                        "~" +
                                        (el?.lecture?.lectureInfo
                                          ?.repeatTimes === null
                                          ? lastDate(
                                              el?.lecture?.date,
                                              el?.lecture?.lectureInfo
                                                ?.repeatWeeks,
                                              el?.lecture?.lectureInfo
                                                ?.repeatDay
                                            )
                                          : lastCount(
                                              el?.lecture?.date,
                                              el?.lecture?.lectureInfo
                                                ?.repeatTimes,
                                              el?.lecture?.lectureInfo
                                                ?.repeatDay
                                            ))}
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

                      <div>수정 후</div>
                      <table style={{ width: "100%" }}>
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
                                      ? startDate(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatDay
                                        ) + "~"
                                      : startDate(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatDay
                                        ) +
                                        "~" +
                                        (el?.lecture?.lectureInfo
                                          ?.repeatTimes === null
                                          ? lastDate(
                                              el?.lecture?.date,
                                              el?.lecture?.lectureInfo
                                                ?.repeatWeeks,
                                              el?.lecture?.lectureInfo
                                                ?.repeatDay
                                            )
                                          : lastCount(
                                              el?.lecture?.date,
                                              el?.lecture?.lectureInfo
                                                ?.repeatTimes,
                                              el?.lecture?.lectureInfo
                                                ?.repeatDay
                                            ))}
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
                          <tr>
                            <td style={{ color: "tomato" }}>{editDate}</td>
                            <td>없음</td>
                            <td>
                              {editStartTime.slice(0, 5) +
                                "-" +
                                editEndTime.slice(0, 5)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      {/* <table>
                    <thead>
                      <tr>
                        <th>날짜</th>
                        <th>시간</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lectureInfoData?.studentLectures
                        ?.filter((el) => {
                          const elDate = new Date(el.lecture.date);
                          const edDate = new Date(standardDate);
                          return elDate - edDate >= 0;
                        })
                        ?.sort((a, b) => {
                          const aDate = new Date(a.lecture.date);
                          const bDate = new Date(b.lecture.date);
                          return aDate - bDate;
                        })
                        ?.filter((_, index) => index < 7)
                        ?.map((el) => {
                          if (
                            Number(el.lecture.id) ===
                            Number(checkList[0].lectureId)
                          ) {
                            return (
                              <tr>
                                <td style={{ color: "tomato" }}>{editDate}</td>
                                <td>
                                  {editStartTime.slice(0, 5) +
                                    "-" +
                                    editEndTime.slice(0, 5)}
                                </td>
                              </tr>
                            );
                          } else {
                            return (
                              <tr>
                                <td>{el.lecture.date}</td>
                                <td>
                                  {el.lecture.startTime.slice(0, 5) +
                                    "-" +
                                    el.lecture.endTime.slice(0, 5)}
                                </td>
                              </tr>
                            );
                          }
                        })}
                    </tbody>
                  </table> */}
                    </>
                  )}
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
                        console.log(event.target.value);
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
                      {teacherData?.staffInAcademy
                        ?.filter((el) => el.user.userCategory === "선생님")
                        .map((el) => {
                          return (
                            <option
                              value={el.id}
                              selected={Number(teacherId) === Number(el.id)}
                            >
                              {el.korName}
                            </option>
                          );
                        })}
                    </select>
                  </S.EditModalTag>
                  <S.EditModalTag>
                    <S.EditModalTagTitle>수정 날짜</S.EditModalTagTitle>
                    <input
                      type="date"
                      // defaultValue={dateToInput(date)}
                      value={editDate}
                      onChange={(e) => {
                        setEditDate(e.target.value);
                      }}
                      // enter 키 적용

                      onKeyPress={(e) => {
                        console.log(e);
                        if (e.key === "Enter") {
                          onClickUpdateLecture();
                        }
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
                        <div>단일</div>
                        <input
                          type="radio"
                          name="editRepeat"
                          checked={isEditRepeat === "once"}
                          onChange={() => {
                            setIsEditRepeat("once");
                            setIsEditAuto(false);
                          }}
                          style={{
                            width: "20px",
                            height: "20px",
                          }}
                        ></input>
                        <div>반복</div>
                        <input
                          type="radio"
                          name="editRepeat"
                          checked={isEditRepeat === "routine"}
                          onChange={() => {
                            setIsEditRepeat("routine");
                          }}
                          style={{
                            width: "20px",
                            height: "20px",
                          }}
                        ></input>
                        <div>횟수</div>
                        <input
                          type="radio"
                          name="editRepeat"
                          checked={isEditRepeat === "count"}
                          onChange={() => {
                            setIsEditRepeat("count");
                            setIsEditAuto(false);
                          }}
                          style={{
                            width: "20px",
                            height: "20px",
                          }}
                        ></input>
                      </S.EditModalTag>
                      {isEditRepeat !== "once" && (
                        <>
                          <S.EditModalTag>
                            <S.EditModalTagTitle>
                              {isEditRepeat === "routine"
                                ? "반복 주"
                                : "반복 횟수"}
                            </S.EditModalTagTitle>
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
                              <span style={{ marginLeft: "1rem" }}>
                                자동 추가
                              </span>
                              <input
                                type="checkbox"
                                checked={isEditAuto}
                                onChange={() => {
                                  setIsEditAuto(!isEditAuto);
                                }}
                                disabled={!(isEditRepeat === "routine")}
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
                      value={editInfo}
                      style={{
                        width: "97%",
                        height: "5rem",
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
                        // setEditDate(dateToInput(date));
                        // setEditStartTime(dateToClock(date));
                        // setEditEndTime(dateToClockOneHour(date));
                        setEditInfo("");
                        setEditAcademy(Number(router.query.branch));
                        setTeacherId(
                          teacherData?.staffInAcademy
                            ?.filter((el) => el.user.userCategory === "선생님")
                            ?.sort((a, b) => {
                              if (Number(a.id) === Number(myData.me.id)) {
                                return -1;
                              } else if (
                                Number(b.id) === Number(myData.me.id)
                              ) {
                                return 1;
                              } else {
                                return Number(a.id) - Number(b.id);
                              }
                            })?.[0].id
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
      ) : (
        <></>
      )}
    </>
  );
}
