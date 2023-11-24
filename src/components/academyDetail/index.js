import { EditOutlined, FormOutlined } from "@ant-design/icons";
import * as S from "./academyDetail.style";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { DatePicker, Modal, Select, Switch, TimePicker } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_MEMO,
  CREATE_ATTENDANCE,
  CREATE_MAKE_UP,
  CREATE_MEMO,
  EDIT_STUDENT,
  GET_MEMO,
  GET_STUDENT,
  GET_STUDENTS_BY_DATE,
  GET_USERS,
  STOP_ACADEMY,
  GET_ME,
  UPDATE_LECTURE,
  CREATE_ACADEMY_TO_USER,
  EDIT_ACADEMY_LIST,
  GET_CONSULTING,
  CREATE_CONSULTING,
  DELETE_CONSULTING,
  UPDATE_CONSULTING,
  EDIT_USER,
  GET_LECTURE_INFO,
  GET_TEACHER,
  EDIT_LECTURE_INFO,
  GET_ALL_STUDENTS,
  CREATE_CLASS,
  DELETE_LECTURE,
  DELETE_LECTURE_INFO,
} from "./academyDetail.query";
import {
  calculateLectureDate,
  dateInputToDay,
  dateInputToDays,
  dateInputToDot,
  dateInputToNumber,
  dateToClock,
  dateToClockOneHour,
  dateToInput,
  lastCount,
  lastDate,
  startDate,
} from "@/src/commons/library/library";
import { ConsultingTable } from "@/src/commons/library/academyDetailTable";
import { set } from "date-fns";
import moment from "moment";

const addressList = ["gmail.com", "naver.com", "daum.net"];
const firstPhone = [
  "010",
  "011",
  "016",
  "02",
  "031",
  "041",
  "042",
  "043",
  "044",
  "051",
  "052",
  "053",
  "054",
  "055",
  "061",
  "062",
  "063",
  "064",
  "",
];
const week = ["월", "화", "수", "목", "금", "토", "일"];
const lecturePage = 15;

export default function AcademyDetailPage() {
  const router = useRouter();
  const { data, refetch } = useQuery(GET_STUDENT, {
    variables: {
      userId: Number(router.query.id),
      academyId: Number(router.query.branch),
    },
  });
  const { refetch: refetchStudents } = useQuery(GET_STUDENTS_BY_DATE);
  const { data: userData, refetch: refetchUsers } = useQuery(GET_USERS);
  // const { data: myData } = useQuery(GET_ME); 수정 필수
  const { data: myData } = {
    data: {
      me: {
        id: "9",
        username: "gyeonggi_teacher",
        userCategory: "\uc120\uc0dd\ub2d8",
        profile: {
          id: 9,
          korName: "\uacbd\uae30\ud37c\ud50c",
          engName: "gyeonggiPurple",
          registerDate: "2023-08-01",
          birthDate: "1980-01-01",
          academy: {
            id: "2",
            name: "\ud37c\ud50c\uc544\uce74\ub370\ubbf8",
            location:
              "\uacbd\uae30 \uc6a9\uc778\uc2dc \uc218\uc9c0\uad6c \ud3ec\uc740\ub300\ub85c 536 \uc2e0\uc138\uacc4\ubc31\ud654\uc810\uacbd\uae30\uc810 8F",
            __typename: "AcademyType",
          },
          __typename: "TeacherType",
        },
        __typename: "UserType",
      },
    },
  };
  const { data: consultingData, refetch: refetchConsulting } = useQuery(
    GET_CONSULTING,
    {
      variables: {
        studentId: Number(router.query.id),
        userId: Number(myData?.me?.id),
      },
    }
  );
  const [createLecture] = useMutation(CREATE_CLASS);
  const [createAttendance] = useMutation(CREATE_ATTENDANCE);
  const [editStudent] = useMutation(EDIT_STUDENT);
  const [editUser] = useMutation(EDIT_USER);
  const [addMemo] = useMutation(ADD_MEMO);
  const [createMakeUp] = useMutation(CREATE_MAKE_UP);
  const [editLectureMemo] = useMutation(CREATE_MEMO);
  const [stopAcademy] = useMutation(STOP_ACADEMY);
  const [updateLecture] = useMutation(UPDATE_LECTURE);
  const [addAcademyUser] = useMutation(CREATE_ACADEMY_TO_USER);
  const [deleteLecture] = useMutation(DELETE_LECTURE);
  const [deleteLectureInfo] = useMutation(DELETE_LECTURE_INFO);
  const [editUserAcademy] = useMutation(EDIT_ACADEMY_LIST);
  const [createConsulting] = useMutation(CREATE_CONSULTING);
  const [deleteConsulting] = useMutation(DELETE_CONSULTING);
  const [updateConsulting] = useMutation(UPDATE_CONSULTING);
  const [editEngName, setEditEngName] = useState("");
  const [editBirthDay, setEditBirthDay] = useState("");
  const [editMobileNumber1, setEditMobileNumber1] = useState("");
  const [editMobileNumber2, setEditMobileNumber2] = useState("");
  const [editMobileNumber3, setEditMobileNumber3] = useState("");
  const [isEditMobileNumber, setIsEditMobileNumber] = useState(false);
  const [editPMobileNumber1, setEditPMobileNumber1] = useState("");
  const [editPMobileNumber2, setEditPMobileNumber2] = useState("");
  const [editPMobileNumber3, setEditPMobileNumber3] = useState("");
  const [isEditPMobileNumber, setIsEditPMobileNumber] = useState(false);
  const [editGender, setEditGender] = useState("");
  const [editEmail1, setEditEmail1] = useState("");
  const [editEmail2, setEditEmail2] = useState("");
  const [editMemo, setEditMemo] = useState("");
  const [editRegisterDate, setEditRegisterDate] = useState("");
  const [classToggle, setClassToggle] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [selectDates, setSelectDates] = useState([]);
  const [routineCount, setRoutineCount] = useState(0);
  const [teacherId, setTeacherId] = useState(0);
  const [date, setTodayDate] = useState(new Date());
  const [addClassStart, setAddClassStart] = useState(dateToClock(date));
  const [addClassEnd, setAddClassEnd] = useState(dateToClockOneHour(date));
  const [addClassDate, setAddClassDate] = useState(dateToInput(date));
  const [addClassInfo, setAddClassInfo] = useState("");
  const [makeUpLectureId, setMakeUpLectureId] = useState("");
  const [selectId, setSelectId] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [isMemo, setIsMemo] = useState(false);
  const [memoStudent, setMemoStudent] = useState("");
  const [memoLecture, setMemoLecture] = useState("");
  const [memoContents, setMemoContents] = useState();
  const [memoText, setMemoText] = useState("");
  const [lecturePageNum, setLecturePageNum] = useState(0);
  const [lectureMaxNum, setLectureMaxNum] = useState(0);
  const [viewType, setViewType] = useState("profile");
  const [stopToggle, setStopToggle] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [options, setOptions] = useState([]);
  const [consultingPage, setConsultingPage] = useState(0);
  const [maxConsultingPage, setMaxConsultingPage] = useState(0);
  const [absentDate, setAbsentDate] = useState("");
  const [absentTime, setAbsentTime] = useState("");
  const [deleteDate, setDeleteDate] = useState(dateToInput(new Date()));
  const mobileNumber2 = useRef();
  const mobileNumber3 = useRef();
  const pMobileNumber2 = useRef();
  const pMobileNumber3 = useRef();
  const [selectIndex, setSelectIndex] = useState(-1);
  const { data: studentData } = useQuery(GET_ALL_STUDENTS, {
    variables: { academyId: Number(router.query.branch) },
  });

  // 페이지 벗어날 때 경고문
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    setConsultingTeacherId(myData.me.id);
  }, [myData]);
  useEffect(() => {
    setIsActive(data?.userDetails?.isActive);
    // console.log(data?.userDetails?.profile?.pmobileno.split("-"), "보호자");
    // console.log(
    //   firstPhone.includes(data?.userDetails?.profile?.mobileno.split("-")),
    //   "원생"
    // );
    if (
      firstPhone.includes(data?.userDetails?.profile?.pmobileno.split("-")[0])
    ) {
      setIsEditPMobileNumber(false);
    } else {
      setIsEditPMobileNumber(true);
    }
    if (
      firstPhone.includes(data?.userDetails?.profile?.mobileno.split("-")[0])
    ) {
      setIsEditMobileNumber(false);
    } else {
      setIsEditMobileNumber(true);
    }
  }, [data]);

  useEffect(() => {
    // 예시: 사용자가 어떤 입력 필드를 수정한 경우
    const checkUnsavedChanges = () => {
      // 변경 사항이 있다면
      setHasUnsavedChanges(true);
    };

    // 여기에서 페이지 이동 전에 변경 사항을 확인하는 이벤트 리스너를 등록합니다.
    window.addEventListener("beforeunload", checkUnsavedChanges);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 해제합니다.
    return () => {
      window.removeEventListener("beforeunload", checkUnsavedChanges);
    };
  }, []);

  useEffect(() => {
    // 페이지 이동 이벤트를 감지하여 사용자에게 경고 메시지를 표시합니다.
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        const confirmationMessage =
          "변경 내용이 저장되지 않을 수 있습니다. 저장하지 않고 이동하시겠습니까?";
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.onbeforeunload = handleBeforeUnload;

    return () => {
      window.onbeforeunload = null;
    };
  }, [hasUnsavedChanges]);

  // 수업 수정 부분
  const [editLectureInfo] = useMutation(EDIT_LECTURE_INFO);
  const { data: lectureInfoData, refetch: refetchLectureInfo } = useQuery(
    GET_LECTURE_INFO,
    {
      variables: {
        academyIds: [Number(router.query.branch)],
        studentId: Number(router.query.id),
      },
    }
  );
  const { data: teacherData, refetch: refetchTeacher } = useQuery(GET_TEACHER, {
    variables: { academyId: Number(router.query.branch) },
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editLectureId, setEditLectureId] = useState("");
  const [editLectureInfoId, setEditLectureInfoId] = useState("");
  const [editAcademy, setEditAcademy] = useState(Number(router.query.branch));
  const [editDate, setEditDate] = useState(dateToInput(date));
  const [editEndTime, setEditEndTime] = useState(dateToClockOneHour(date));
  const [editStartTime, setEditStartTime] = useState(dateToClock(date));
  const [editInfo, setEditInfo] = useState("");
  const [isAll, setIsAll] = useState(false);
  const [isEditAuto, setIsEditAuto] = useState(false);
  const [isEditRepeat, setIsEditRepeat] = useState("once");
  const [editRepeatWeek, setEditRepeatWeek] = useState([]);
  const [editRepeatCount, setEditRepeatCount] = useState(0);
  const [standardDate, setStandardDate] = useState("");

  const onClickOpenEditModal = () => {
    setTodayDate(new Date());
    const list = [...lectureInfoData?.studentLectures];
    const newAddRepeatInput = list
      ?.sort((a, b) => {
        const newADate = new Date(a?.lecture?.date);
        const newBDate = new Date(b?.lecture?.date);
        return newADate - newBDate;
      })
      .filter((el, i, callback) => {
        return (
          i ===
          callback.findIndex(
            (t) => t.lecture.lectureInfo.id === el.lecture.lectureInfo.id
          )
        );
      })
      ?.map((el, index) => {
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
    setAddRepeatInput(newAddRepeatInput);
    setIsEdit(true);
  };

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
            lectureInfoId: Number(editLectureInfoId),
            date: editDate,
            about: editInfo,
            repeatDays:
              isEditRepeat !== "once"
                ? JSON.stringify({ repeat_days: editRepeatWeek })
                : JSON.stringify({ repeat_days: [-1] }),
            repeatWeeks: isEditRepeat !== "once" ? Number(editRepeatCount) : 1,
            autoAdd: isEditAuto,
            studentIds: [Number(router.query.id)],
            startTime: editStartTime,
            endTime: editEndTime,
            academyId: Number(editAcademy),
            teacherId: Number(teacherId),
            repeatTimes:
              isEditRepeat === "count" ? Number(editRepeatCount) : null,
          },
        });
        refetch();
        refetchLectureInfo();
        setIsEdit(false);
        setEditInfo("");
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
      try {
        await updateLecture({
          variables: {
            lectureId: Number(editLectureId),
            date: editDate,
            studentIds: Number(router.query.id),
            startTime: editStartTime,
            endTime: editEndTime,
            academyId: editAcademy,
            teacherId: Number(teacherId),
          },
        });
      } catch (err) {
        console.log(err);
      }
      refetch();
      refetchLectureInfo();
      setIsEdit(false);
      setEditInfo("");
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
    }
  };

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
    // setAddRepeatCount(addRepeatCount + 1);
    setSelectedAddListIndex(addRepeatInput.length);
  };

  //수업 변경 변수, 함수들
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
  const [selectedAddListIndex, setSelectedAddListIndex] = useState(0);

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

  const onChangeRepeatDate = (ind) => (e) => {
    const newInput = [...addRepeatInput];
    newInput[ind].startDate = e.target.value;
    newInput[ind].isActive = true;
    setAddRepeatInput(newInput);
    console.log(newInput);
  };

  const onClickRepeatDates = (ind, index) => () => {
    if (addRepeatInput[ind].isOne) {
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

  const onChangeRepeatIsRepeat = (ind, value) => () => {
    const newInput = [...addRepeatInput];
    newInput[ind].isRepeat = value;
    newInput[ind].isAuto = false;
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

  const onClickAddOneChangeList = (el, boolean) => () => {
    if (boolean) {
      if (
        lectureInfoData?.studentLectures
          ?.filter((ele) => {
            return ele?.lecture?.lectureInfo?.id === el.id;
          })
          ?.filter((ele) => {
            const newDate = new Date(ele.lecture.date);
            const calendarDate = new Date(listDate);
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
        const calendarDate = new Date(listDate);
        alert(
          listDate +
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
        date: listDate,
        lectureId: lectureInfoData?.studentLectures
          ?.filter((ele) => {
            return ele?.lecture?.lectureInfo?.id === el.id;
          })
          ?.filter((ele) => {
            const newDate = new Date(ele.lecture.date);
            const calendarDate = new Date(listDate);
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
        studentId: Number(router.query.id),
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

  const [lectureId, setLectureId] = useState(0);
  const [branches, setBranches] = useState([]);
  const [listDate, setListDate] = useState(
    calculateLectureDate(dateToInput(new Date()))[0]
  );
  const [endListDate, setEndListDate] = useState(
    calculateLectureDate(dateToInput(new Date()))[1]
  );

  // const startDate = moment(listDate, "YYYY-MM-DD");
  // const endDate = moment(endListDate, "YYYY-MM-DD");

  // RangePicker의 defaultValue로 배열을 전달합니다.
  // const defaultDateRange = [startDate, endDate];
  // const [startEndDate, setStartEndDate] = useState([
  //   // new Date(listDate),
  //   // new Date(endListDate),
  //   // moment(calculateLectureDate(dateToInput(new Date()))[0], "YYYY-MM-DD"),
  //   // moment(calculateLectureDate(dateToInput(new Date()))[1], "YYYY-MM-DD"),
  // ]);
  // useEffect(()=>{
  //   const startMoment = moment()
  //   setStartEndDate(listDate)
  // },[])
  // console.log("end", calculateLectureDate(dateToInput(new Date())));
  const [isTyped, setIsTyped] = useState(false);
  const [lectureList, setLectureList] = useState([]);
  const [consultingList, setConsultingList] = useState([]);
  // 상담 state
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultingTitle, setConsultingTitle] = useState("");
  const [consultingContents, setConsultingContents] = useState("");
  const [consultingDate, setConsultingDate] = useState(dateToInput(date));
  const [consultingTeacherId, setConsultingTeacherId] = useState("");
  const [isDelete, setIsDelete] = useState(false);
  const [isConsultingEdit, setIsConsultingEdit] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContents, setEditContents] = useState("");
  const [consultingEditDate, setConsultingEditDate] = useState(
    dateToInput(new Date())
  );

  const onClickOpenDeleteModal = (id, index) => () => {
    setIsDelete(true);
    setSelectId(id);
    setSelectIndex(index);
  };

  const onClickOpenEditConsultingModal = (el) => () => {
    setIsConsultingEdit(true);
    setSelectId(el.id);
    setEditContents(el.contents);
    setEditTitle(el.title);
    setConsultingEditDate(el.createdAt);
  };

  const onClickConSultingDelete = async () => {
    try {
      await deleteConsulting({ variables: { consultingId: Number(selectId) } });
      refetchConsulting();
      setSelectId("");
      setIsDelete(false);
      alert("상담을 삭제했습니다.");
    } catch (err) {}
  };

  const onClickConSultingEdit = async () => {
    try {
      await updateConsulting({
        variables: {
          title: editTitle,
          consultingId: Number(selectId),
          contents: editContents,
          writerId: Number(consultingTeacherId),
          createdAt: editDate,
        },
      });
      refetchConsulting();
      setSelectId("");
      setIsConsultingEdit(false);
      alert("상담을 수정했습니다.");
    } catch (err) {}
  };

  const { data: memoData, refetch: refetchMemo } = useQuery(GET_MEMO, {
    variables: {
      academyId: Number(router.query.branch),
      studentId: Number(10),
    },
  });

  const onClickRouter = (address) => () => {
    if (
      hasUnsavedChanges &&
      !window.confirm("변경 사항이 있습니다. 정말로 이동하시겠습니까?")
    ) {
      // 사용자가 확인을 누르지 않으면 페이지 이동을 취소합니다.
      return;
    }
    router.push("/" + address);
  };
  const onClickClassToggle = (el) => () => {
    console.log(el.id, el?.date);
    setMakeUpLectureId(el.id);
    setAbsentDate(el?.date + " (" + dateInputToDay(el?.date) + ")");
    setAbsentTime(
      el?.startTime?.slice(0, 2) +
        " : " +
        el?.startTime?.slice(3, 5) +
        " ~ " +
        el?.endTime?.slice(0, 2) +
        " : " +
        el?.endTime?.slice(3, 5)
    );
    setClassToggle(true);
  };

  const onClickOk = async () => {
    let lastActive = -1;
    addRepeatInput.forEach((el, inputIndex) => {
      if (el?.isActive || el?.isDelete) {
        lastActive = inputIndex;
      }
    });
    console.log(lastActive);
    const alertArray = [];
    if (lastActive === -1) {
      alert("변경 사항이 없습니다.");
      return;
    }

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
              studentIds: [Number(router.query.id)],
              repeatTimes:
                addRepeatInput[index].isRepeat === "count"
                  ? Number(addRepeatInput[index].repeatsNum)
                  : null,
            },
          });
          if (index === lastActive) {
            // setAddLectureId("");
            setIsEdit(false);
            setSelectDates([]);
            setIsEdit(false);
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
          (addRepeatInput[index].isRepeat === "count" &&
            Number(addRepeatInput[index].repeatsNum) <
              addRepeatInput[index].week.length) ||
          addRepeatInput[index].week.length === 0
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
                    studentIds: [Number(router.query.id)],
                    repeatTimes: null,
                  },
                });
                await deleteLecture({
                  variables: {
                    id: Number(el?.oneChangeList?.[0]?.lectureId),
                  },
                });
                if (index === lastActive) {
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
                    studentIds: [Number(router.query.id)],
                    startTime: el?.startTime,
                    endTime: el?.endTime,
                    academyId: Number(router.query.branch),
                    teacherId: Number(el?.teacherId),
                    repeatTimes:
                      el?.isRepeat === "count" ? Number(el?.repeatsNum) : null,
                  },
                });
                if (index === lastActive) {
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
                  alertContents + "수업이 반복 횟수가 반복 요일보다 적습니다.";
                alert(alertContents);
                setIsEdit(false);
              } else {
                alert("수업을 변경했습니다.");
                setIsEdit(false);
              }
            }
          } catch {}
        }
      }
    });
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
    setIsMemo(true);
  };

  const onClickCancel = () => {
    setSelectedAddListIndex(0);
    setIsEdit(false);
    setSelectDates([]);
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

  const onClickCancelMakeUp = () => {
    setClassToggle(false);
  };

  // 상당 정보 useEffect

  useEffect(() => {
    if (consultingData === undefined) {
      setConsultingList([]);
      setConsultingPage(0);
      setMaxConsultingPage(0);
    } else {
      consultingData?.getConsulting?.sort((a, b) => {
        const aDate = new Date(a.createdAt);
        const bDate = new Date(b.createdAt);
        return bDate - aDate;
      });
      setConsultingList(consultingData?.getConsulting);
      setConsultingPage(0);
      setMaxConsultingPage(
        Math.ceil(consultingData?.getConsulting?.length / 12)
      );
    }
  }, [consultingData]);

  useEffect(() => {
    if (data) {
      setLecturePageNum(0);
      // const [mondayDate, sunDayDate] = calculateLectureDate(listDate);
      // console.log(mondayDate, sunDayDate, "계산");
      const newLectureList = data?.userDetails?.profile?.lectures?.filter(
        (el) => {
          const start = new Date(listDate);
          const end = new Date(endListDate);
          const k = new Date(el.date);
          return k - start >= 0 && end - k >= 0;
        }
      );
      setLectureMaxNum(
        Math.ceil(
          data?.userDetails?.profile?.lectures?.filter((el) => {
            const start = new Date(listDate);
            const end = new Date(endListDate);
            const k = new Date(el.date);
            return k - start >= 0 && end - k >= 0;
          }).length / lecturePage
        )
      );
      setLectureList(newLectureList);

      // ?.filter((el, index) => {
      //   return index < 20;
      // })
    }
  }, [data, listDate, endListDate]);

  useEffect(() => {
    setBranches(
      data?.userDetails?.profile?.academies?.map((el) => {
        return el.id;
      })
    );
  }, [data]);

  useEffect(() => {
    if (localStorage.getItem("academyDetailTab")) {
      setViewType(localStorage.getItem("academyDetailTab"));
    }
  }, []);

  const onClickCheck = async () => {
    // setIsCheck(true);
    try {
      await stopAcademy({ variables: { userId: Number(router.query.id) } });
      if (data?.userDetails?.isActive) {
        data?.userDetails?.profile?.lectures
          ?.filter((el, i, callback) => {
            return (
              i ===
              callback.findIndex((t) => t.lectureInfo.id === el.lectureInfo.id)
            );
          })
          ?.forEach(async (el) => {
            try {
              await deleteLectureInfo({
                variables: { id: Number(el.lectureInfo.id), date: deleteDate },
              });
              await refetch();
            } catch (err) {}
          });
        if (data?.userDetails?.profile?.lectures?.length === 0) {
          refetch();
        }
        alert("휴원 처리가 완료됐습니다.");
      } else {
        refetch();
        alert("재원 처리가 완료됐습니다.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onClickAddBranchList = (id) => () => {
    setHasUnsavedChanges(true);
    const newBranches = [...branches];
    if (branches.includes(id)) {
      setBranches(
        newBranches.filter((el) => {
          return el !== id;
        })
      );
    } else {
      newBranches.push(id);
      setBranches(newBranches);
    }
  };

  const onClickDates = (index) => () => {
    if (selectDates.includes(index)) {
      const newDates = [...selectDates];
      const newD = newDates.filter((el) => el !== index);
      setSelectDates(newD);
    } else {
      setSelectDates([...selectDates, index]);
    }
  };
  const onChangeRoutineCount = (e) => {
    const { value } = e.target;
    const onlyNumber = value.replace(/[^0-9]/g, "");
    setRoutineCount(Number(onlyNumber));
  };

  const onClickMakeUpClass = async () => {
    try {
      await createAttendance({
        variables: {
          lectureId: Number(makeUpLectureId),
          studentId: Number(router.query.id),
          statusInput: "makeup",
        },
      });
    } catch (err) {}
    try {
      // await createMakeUp({
      //   variables: {
      //     lectureId: Number(makeUpLectureId),
      //     date: addClassDate,
      //     startTime: addClassStart,
      //     endTime: addClassEnd,
      //     lectureInfo:
      //       dateInputToDot(
      //         lectureInfoData?.studentLectures?.filter((el) => {
      //           return el.lecture.id === makeUpLectureId;
      //         })[0]?.lecture.date
      //       ) +
      //       " 보강" +
      //       addClassInfo,
      //     teacherId: Number(teacherId),
      //     studentIds: [Number(router.query.id)],
      //   },
      // });
      await createLecture({
        variables: {
          studentIds: [Number(router.query.id)],
          autoAdd: false,
          repeatDays: JSON.stringify({ repeat_days: [-1] }),
          teacherId: Number(teacherId),
          repeatWeeks: 1,
          about:
            dateInputToDot(
              lectureInfoData?.studentLectures?.filter((el) => {
                return el.lecture.id === makeUpLectureId;
              })[0]?.lecture.date
            ) +
            " 보강" +
            addClassInfo,
          lectureMemo: "",
          endTime: addClassEnd,
          startTime: addClassStart,
          date: addClassDate,
          academyId: Number(router.query.branch),
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
    } catch (err) {
      alert(err);
    }

    refetch();
    refetchUsers();
    refetchStudents();
    setIsEdit(false);
  };

  const onClickEdit = async () => {
    let variables = {
      userId: Number(router.query.id),
      birthDate: data?.userDetails?.profile?.birthDate,
      mobileno: data?.userDetails?.profile.mobileno,
      pmobileno: data?.userDetails?.profile.pmobileno,
      gender: data?.userDetails?.profile.gender,
      email: data?.userDetails?.email,
      korName: data?.userDetails?.profile?.korName,
      engName: data?.userDetails?.profile?.engName,
      registerDate: dateToInput(
        new Date(data?.userDetails?.profile?.registerDate)
      ),
      origin: data?.userDetails?.profile?.origin,
    };
    if (data?.userDetails?.profile.engName !== editEngName) {
      variables.engName = editEngName;
    }
    if (data?.userDetails?.profile.birthDate !== editBirthDay) {
      variables.birthDate = editBirthDay;
    }
    if (data?.userDetails?.profile.mobileno !== editMobileNumber1) {
      variables.mobileno =
        editMobileNumber1 + "-" + editMobileNumber2 + "-" + editMobileNumber3;
    }
    if (data?.userDetails?.profile.pmobileno !== editPMobileNumber1) {
      variables.pmobileno =
        editPMobileNumber1 +
        "-" +
        editPMobileNumber2 +
        "-" +
        editPMobileNumber3;
    }
    if (data?.userDetails?.profile.gender !== editGender) {
      variables.gender = editGender;
    }
    if (
      data?.userDetails?.profile?.registerDate?.slice(0, 10) !==
      editRegisterDate
    ) {
      variables.registerDate = editRegisterDate;
    }
    try {
      await editStudent({ variables });
      try {
        const addResult = await addMemo({
          variables: {
            memo: editMemo === "" ? "원생 특이 사항" : editMemo,
            userId: Number(router.query.id),
            academyId: Number(router.query.branch),
          },
        });
      } catch (err) {
        // alert("메모 내용을 입력해주세요.");
      }

      try {
        await editUser({
          variables: {
            email: editEmail1 + "@" + editEmail2,
            userId: Number(router.query.id),
            categoryId: 4,
          },
        });
      } catch {}

      if (branches.length > 0) {
        try {
          await editUserAcademy({
            variables: {
              userId: Number(router.query.id),
              academyIds: branches.map((el) => Number(el)),
            },
          });
        } catch (err) {}
        alert("수정 완료했습니다.");
      } else {
        alert("등원 지점은 1개 이상 체크하셔야 합니다.");
      }
      setHasUnsavedChanges(false);
    } catch (err) {
      alert(err);
    }
    refetch();
    setTeacherId(
      userData?.allUsers
        .filter((el) => el.userCategory === "선생님")
        .filter((el) => {
          return Number(el.profile.academy.id) === Number(router.query.branch);
        })[0].id
    );
    setAddClassDate(dateToClock(date));
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
  const onClickEditMemo = async () => {
    try {
      await editLectureMemo({
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

  // const onClickUpdateLecture = async () => {
  //   // console.log(
  //   //   Number(router.query.id),
  //   //   Number(lectureId),
  //   //   editAcademy,
  //   //   editDate,
  //   //   editStartTime,
  //   //   editEndTime,
  //   //   Number(teacherId)
  //   // );
  //   try {
  //     const result = await updateLecture({
  //       variables: {
  //         lectureId: Number(lectureId),
  //         date: editDate,
  //         studentIds: [Number(router.query.id)],
  //         startTime: editStartTime,
  //         endTime: editEndTime,
  //         academyId: editAcademy,
  //         teacherId: Number(teacherId),
  //         lectureMemo: editInfo,
  //       },
  //     });
  //     refetch();
  //     refetchUsers();
  //     refetchStudents();
  //     setIsEdit(false);
  //     setEditDate(dateToInput(date));
  //     setEditStartTime(dateToClock(date));
  //     setEditEndTime(dateToClockOneHour(date));
  //     setTeacherId(
  //       userData?.allUsers
  //         .filter((el) => el.userCategory === "선생님")
  //         .filter((el) => {
  //           return (
  //             Number(el.profile.academy.id) === Number(router.query.branch)
  //           );
  //         })[0].id
  //     );
  //     setEditAcademy(Number(router.query.branch));
  //     setEditInfo("");
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  useEffect(() => {
    setTeacherId(
      userData?.allUsers
        .filter((el) => el.userCategory === "선생님")
        .filter((el) => {
          return Number(el.profile.academy.id) === Number(router.query.branch);
        })[0].id
    );
  }, [userData]);
  useEffect(() => {
    if (data !== undefined) {
      setEditEngName(data?.userDetails?.profile.engName);
      setEditBirthDay(data?.userDetails?.profile.birthDate);
      setEditMobileNumber1(data?.userDetails?.profile.mobileno.split("-")[0]);
      setEditMobileNumber2(data?.userDetails?.profile.mobileno.split("-")[1]);
      setEditMobileNumber3(data?.userDetails?.profile.mobileno.split("-")[2]);
      setEditPMobileNumber1(data?.userDetails?.profile.pmobileno.split("-")[0]);
      setEditPMobileNumber2(data?.userDetails?.profile.pmobileno.split("-")[1]);
      setEditPMobileNumber3(data?.userDetails?.profile.pmobileno.split("-")[2]);
      setEditGender(data?.userDetails?.profile.gender);
      setEditEmail1(data?.userDetails?.email?.split("@")[0]);
      setEditEmail2(data?.userDetails?.email?.split("@")[1]);
      if (!addressList?.includes(data?.userDetails?.email?.split("@")[1])) {
        setIsTyped(true);
      }
      setEditRegisterDate(
        data?.userDetails?.profile?.registerDate?.slice(0, 10)
      );
      setEditMemo(
        data?.userDetails?.memos?.filter((el) => {
          console.log(el.academy.id);
          return el.academy.id === router.query.branch;
        })?.[0]?.memo
      );
    }
  }, [data]);

  console.log(data);

  useEffect(() => {
    setEditAcademy(Number(router.query.branch));
  }, [router]);

  const onClickCreateConSulting = () => async () => {
    try {
      await createConsulting({
        variables: {
          title: consultingTitle,
          contents: consultingContents,
          writerId: Number(consultingTeacherId),
          studentId: Number(router.query.id),
          createdAt: consultingDate,
        },
      });
      setIsConsulting(false);
      setConsultingTitle("");
      setConsultingContents("");
      refetchConsulting();
      alert("상담을 저장했습니다.");
    } catch (err) {}
  };

  useEffect(() => {
    if (studentData) {
      setOptions(
        studentData?.studentsInAcademy
          ?.filter((el) => {
            return el?.user?.isActive;
          })
          ?.sort((a, b) => {
            return a?.korName?.localeCompare(b?.korName, "kr-KR");
          })
          ?.map((el) => {
            return { value: el.id, label: el.korName + "(" + el.engName + ")" };
          })
      );
    }
  }, [studentData]);

  const filterOption = (input, option) => {
    // const target = option?.label?.replace(/[^\w]/g, "");
    return (option?.label ?? "")
      .toLowerCase()
      .includes(input.replace(/[^\w]/g, "").toLowerCase());
  };

  return (
    <S.AcademyDetailWrapper>
      {/* <style>{`
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
            
          `}</style> */}
      <S.AcademyDetailTitle>원생 정보</S.AcademyDetailTitle>
      <div
        style={{
          display: "flex",
          width: "90rem",
          borderBottom: "1px solid #A8AAAE",
          alignItems: "center",
          marginTop: "2.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "9.6875rem",
            height: "4.125rem",
            color: viewType === "profile" ? "#791285" : "#333",
            borderBottom: viewType === "profile" ? "3px solid #791285" : "none",
            fontFamily: "Spoqa Han Sans Neo",
            fontSize: "1.25rem",
            fontWeight: viewType === "profile" ? 700 : 400,
            cursor: "pointer",
          }}
          onClick={() => {
            setViewType("profile");
            localStorage.setItem("academyDetailTab", "profile");
          }}
        >
          프로필 정보
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "9.6875rem",
            height: "4.125rem",
            color: viewType === "lecture" ? "#791285" : "#333",
            borderBottom: viewType === "lecture" ? "3px solid #791285" : "none",
            fontFamily: "Spoqa Han Sans Neo",
            fontSize: "1.25rem",
            fontWeight: viewType === "lecture" ? 700 : 400,
            cursor: "pointer",
          }}
          onClick={() => {
            setViewType("lecture");
            localStorage.setItem("academyDetailTab", "lecture");
          }}
        >
          수업 정보
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "9.6875rem",
            height: "4.125rem",
            color: viewType === "consulting" ? "#791285" : "#333",
            borderBottom:
              viewType === "consulting" ? "3px solid #791285" : "none",
            fontFamily: "Spoqa Han Sans Neo",
            fontSize: "1.25rem",
            fontWeight: viewType === "consulting" ? 700 : 400,
            cursor: "pointer",
          }}
          onClick={() => {
            setViewType("consulting");
            localStorage.setItem("academyDetailTab", "consulting");
          }}
        >
          상담 정보
        </div>
      </div>
      <div
        style={{
          width: "90rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          marginTop: "2.5rem",
        }}
      >
        <div
          style={{
            marginBottom: "2.5rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: "Spoqa Han Sans Neo",
              fontSize: "1.125rem",
              fontWeight: 700,
              marginRight: "1.87rem",
            }}
          >
            원생 선택
          </span>
          {data && (
            <Select
              showSearch
              filterOption={filterOption}
              defaultValue={
                data !== undefined
                  ? {
                      value: Number(router.query.id),
                      label:
                        data?.userDetails?.profile?.korName +
                        "(" +
                        data?.userDetails?.profile?.engName +
                        ")",
                    }
                  : {}
              }
              style={{
                width: "10.875rem",
                height: "2.075rem",
                borderBottom: "1px solid #858585",
                fontSize: 18,
                fontWeight: "bold",
              }}
              // defaultValue={{
              //   value: router.query.id,
              //   label: options?.filter(
              //     (el) => Number(el?.value) === Number(router.query.id)
              //   )[0],
              // }}
              placeholder={
                data !== undefined
                  ? data?.userDetails?.profile?.korName +
                    "(" +
                    data?.userDetails?.profile?.engName +
                    ")"
                  : ""
              }
              bordered={false}
              onChange={(value) => {
                window.location.href =
                  "https://readingcenter.purpleacademy.co.kr/" +
                  router.query.branch +
                  "/academy/" +
                  value;
              }}
              options={options}
            />
          )}
        </div>
        <div
          style={{
            display: "flex",
            width: "25.3rem",
            justifyContent: "space-between",
          }}
        >
          <S.MoveButton
            onClick={onClickRouter(`/${router.query.branch}/academy`)}
          >
            <svg
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "0.62rem" }}
            >
              <path
                d="M2.65625 0.15625H12V1.5H2.65625V0.15625ZM2.65625 6.84375V5.5H12V6.84375H2.65625ZM2.65625 4.15625V2.84375H12V4.15625H2.65625ZM0 1.5V0.15625H1.34375V1.5H0ZM0 6.84375V5.5H1.34375V6.84375H0ZM0 4.15625V2.84375H1.34375V4.15625H0Z"
                fill="#333333"
              />
            </svg>{" "}
            원생 목록
          </S.MoveButton>
          <S.MoveButton
            onClick={onClickRouter(
              `/${router.query.branch}/report/${router.query.id}`
            )}
          >
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "0.62rem" }}
            >
              <path
                d="M5.80382 4.28444C5.54104 4.28444 5.32801 4.50157 5.32801 4.76942C5.32801 5.03726 5.54104 5.25439 5.80382 5.25439H10.196C10.4588 5.25439 10.6718 5.03726 10.6718 4.76942C10.6718 4.50157 10.4588 4.28444 10.196 4.28444H5.80382Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.3999 14.0958V3.27719C2.3999 2.75281 2.60427 2.2499 2.96808 1.8791C3.33187 1.5083 3.8253 1.29999 4.33977 1.29999H12.6849C12.9276 1.29999 13.1602 1.39827 13.3318 1.57305C13.5034 1.74796 13.5999 1.98531 13.5999 2.23263V15.7H3.9748C3.49616 15.7 3.08624 15.5322 2.8002 15.2156C2.52008 14.9055 2.3999 14.4996 2.3999 14.0958ZM3.64099 2.56495C3.82632 2.37606 4.07768 2.26994 4.33977 2.26994H12.6483V10.2534H3.97376C3.74916 10.2534 3.53993 10.2903 3.35154 10.3622V3.27719C3.35154 3.01005 3.45566 2.75384 3.64099 2.56495ZM3.97376 14.73H12.6483V13.4616H3.97376C3.72037 13.4616 3.58024 13.5446 3.50026 13.6331C3.41436 13.7282 3.35154 13.8818 3.35154 14.0958C3.35154 14.3099 3.41436 14.4635 3.50026 14.5586C3.58024 14.6471 3.72037 14.73 3.97376 14.73ZM3.97376 12.4917H12.6483V11.2233H3.97376C3.72037 11.2233 3.58024 11.3062 3.50026 11.3948C3.41436 11.4898 3.35154 11.6435 3.35154 11.8575C3.35154 12.0715 3.41436 12.2252 3.50026 12.3202C3.58024 12.4088 3.72037 12.4917 3.97376 12.4917Z"
                fill="#333333"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.33977 2.26994C4.07768 2.26994 3.82632 2.37606 3.64099 2.56495C3.45566 2.75384 3.35154 3.01005 3.35154 3.27719V10.3622C3.53993 10.2903 3.74916 10.2534 3.97376 10.2534H12.6483V2.26994H4.33977ZM5.80382 4.28444C5.54104 4.28444 5.32801 4.50157 5.32801 4.76942C5.32801 5.03726 5.54104 5.25439 5.80382 5.25439H10.196C10.4588 5.25439 10.6718 5.03726 10.6718 4.76942C10.6718 4.50157 10.4588 4.28444 10.196 4.28444H5.80382Z"
                fill="#333333"
              />
            </svg>{" "}
            리딩 이력
          </S.MoveButton>
          <S.MoveButton
            onClick={onClickRouter(
              `/${router.query.branch}/report/reportDetail/${router.query.id}`
            )}
          >
            <svg
              width="12"
              height="13"
              viewBox="0 0 12 13"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "0.62rem" }}
            >
              <g clip-path="url(#clip0_1381_4405)">
                <path
                  d="M2.375 12.4972C2.40815 12.4972 2.43995 12.484 2.46339 12.4605C2.48683 12.4371 2.5 12.4053 2.5 12.3722V9.75C2.5 9.61739 2.44732 9.49021 2.35355 9.39645C2.25979 9.30268 2.13261 9.25 2 9.25H1C0.867392 9.25 0.740215 9.30268 0.646447 9.39645C0.552678 9.49021 0.5 9.61739 0.5 9.75V12.3722C0.5 12.4053 0.51317 12.4371 0.536612 12.4605C0.560054 12.484 0.591848 12.4972 0.625 12.4972H2.375Z"
                  fill="#333333"
                />
                <path
                  d="M5.375 12.5052C5.40815 12.5052 5.43995 12.492 5.46339 12.4686C5.48683 12.4451 5.5 12.4133 5.5 12.3802V7.25C5.5 7.11739 5.44732 6.99021 5.35355 6.89645C5.25979 6.80268 5.13261 6.75 5 6.75H4C3.86739 6.75 3.74021 6.80268 3.64645 6.89645C3.55268 6.99021 3.5 7.11739 3.5 7.25V12.3802C3.5 12.4133 3.51317 12.4451 3.53661 12.4686C3.56005 12.492 3.59185 12.5052 3.625 12.5052H5.375Z"
                  fill="#333333"
                />
                <path
                  d="M8.375 12.4954C8.40815 12.4954 8.43995 12.4822 8.46339 12.4587C8.48683 12.4353 8.5 12.4035 8.5 12.3704V8.25C8.5 8.11739 8.44732 7.99021 8.35355 7.89645C8.25979 7.80268 8.13261 7.75 8 7.75H7C6.86739 7.75 6.74021 7.80268 6.64645 7.89645C6.55268 7.99021 6.5 8.11739 6.5 8.25V12.3704C6.5 12.4035 6.51317 12.4353 6.53661 12.4587C6.56005 12.4822 6.59185 12.4954 6.625 12.4954H8.375Z"
                  fill="#333333"
                />
                <path
                  d="M11.375 12.5052C11.4082 12.5052 11.4399 12.492 11.4634 12.4686C11.4868 12.4451 11.5 12.4133 11.5 12.3802V4.75C11.5 4.61739 11.4473 4.49021 11.3536 4.39645C11.2598 4.30268 11.1326 4.25 11 4.25H10C9.86739 4.25 9.74021 4.30268 9.64645 4.39645C9.55268 4.49021 9.5 4.61739 9.5 4.75V12.3802C9.5 12.4133 9.51317 12.4451 9.53661 12.4686C9.56005 12.492 9.59185 12.5052 9.625 12.5052H11.375Z"
                  fill="#333333"
                />
                <path
                  d="M1.75 7.2503C2.01522 7.2503 2.26957 7.14495 2.45711 6.95741C2.64464 6.76987 2.75 6.51552 2.75 6.2503C2.74888 6.14833 2.73201 6.04713 2.7 5.9503L4.2835 4.6303C4.48223 4.73973 4.71284 4.77662 4.93579 4.73466C5.15874 4.69269 5.36015 4.57449 5.5055 4.4003L6.7555 4.8173C6.78077 5.06981 6.90109 5.30328 7.09209 5.47037C7.28309 5.63746 7.53047 5.72569 7.7841 5.71717C8.03773 5.70865 8.27864 5.60402 8.45799 5.42448C8.63735 5.24495 8.74173 5.00394 8.75 4.7503C8.74901 4.59119 8.70937 4.4347 8.6345 4.2943L10.278 2.3768C10.4705 2.47943 10.6914 2.51608 10.9068 2.48112C11.1221 2.44616 11.32 2.34153 11.4702 2.18326C11.6204 2.025 11.7145 1.82185 11.7381 1.60496C11.7618 1.38808 11.7136 1.16943 11.601 0.982544C11.4884 0.795662 11.3177 0.650866 11.1149 0.57036C10.9121 0.489854 10.6885 0.478084 10.4784 0.536855C10.2683 0.595625 10.0833 0.721691 9.95171 0.89572C9.82014 1.06975 9.74928 1.28213 9.75 1.5003C9.75131 1.59724 9.76698 1.69346 9.7965 1.7858L8.065 3.8063C7.87774 3.73957 7.67445 3.73223 7.48287 3.7853C7.29129 3.83836 7.12074 3.94924 6.9945 4.1028L5.7445 3.6863C5.73663 3.54464 5.69864 3.40629 5.63305 3.28048C5.56746 3.15468 5.47579 3.04431 5.36415 2.95675C5.25252 2.86919 5.12349 2.80645 4.98568 2.77272C4.84787 2.73898 4.70445 2.73504 4.565 2.76115C4.42554 2.78725 4.29326 2.84281 4.17698 2.9241C4.0607 3.00539 3.9631 3.11056 3.8907 3.23257C3.8183 3.35458 3.77276 3.49064 3.75711 3.63165C3.74147 3.77266 3.75609 3.91539 3.8 4.0503L2.218 5.3723C2.07452 5.29347 1.9137 5.25155 1.75 5.2503C1.48478 5.2503 1.23043 5.35566 1.04289 5.5432C0.855357 5.73073 0.75 5.98509 0.75 6.2503C0.75 6.51552 0.855357 6.76987 1.04289 6.95741C1.23043 7.14495 1.48478 7.2503 1.75 7.2503Z"
                  fill="#333333"
                />
              </g>
              <defs>
                <clipPath id="clip0_1381_4405">
                  <rect
                    width="12"
                    height="12"
                    fill="white"
                    transform="translate(0 0.5)"
                  />
                </clipPath>
              </defs>
            </svg>{" "}
            학습 리포트
          </S.MoveButton>
        </div>
      </div>
      {viewType === "profile" && (
        <>
          <S.EditBox style={{ width: "90rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: "1.88rem",
              }}
            >
              <S.SubAcademyTitle>프로필 정보</S.SubAcademyTitle>
            </div>
            <div
              style={{
                display: "flex",
                width: "90rem",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <S.InputTag>
                  <S.InputName>{"원번(아이디)"}</S.InputName>
                  <S.InputInput
                    value={data?.userDetails?.profile?.origin}
                    disabled={true}
                  ></S.InputInput>
                </S.InputTag>
                <S.InputTag>
                  <S.InputName>생년월일</S.InputName>
                  <S.InputInput
                    type="date"
                    defaultValue={data?.userDetails?.profile.birthDate}
                    onChange={(e) => {
                      setHasUnsavedChanges(true);
                      setEditBirthDay(e.target.value);
                    }}
                  ></S.InputInput>
                </S.InputTag>
                <S.InputTag style={{ marginBottom: "1.88rem" }}>
                  <S.InputName>부모님 전화번호</S.InputName>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {isEditPMobileNumber ? (
                      <S.ModalLabel>
                        <S.ModalBorderLess
                          onChange={(e) => {
                            const onlyNumber = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                            setHasUnsavedChanges(true);
                            setEditPMobileNumber1(onlyNumber);
                            if (e.target.value.length === 4) {
                              pMobileNumber2.current.focus();
                            }
                          }}
                          value={editPMobileNumber1}
                          maxLength={4}
                        ></S.ModalBorderLess>
                        <div
                          style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setEditPMobileNumber1("010");
                            setIsEditPMobileNumber(false);
                            setHasUnsavedChanges(true);
                          }}
                        >
                          <svg
                            width="8"
                            height="6"
                            viewBox="0 0 8 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ marginRight: "0.3rem", cursor: "pointer" }}
                          >
                            <path
                              d="M7.0625 0.21875L8 1.15625L4 5.15625L0 1.15625L0.9375 0.21875L4 3.28125L7.0625 0.21875Z"
                              fill="#333333"
                            />
                          </svg>
                        </div>
                      </S.ModalLabel>
                    ) : (
                      <select
                        onChange={(e) => {
                          if (e.target.value === "") {
                            setIsEditPMobileNumber(true);
                            setEditPMobileNumber1(e.target.value);
                          } else {
                            setEditPMobileNumber1(e.target.value);
                          }
                          setHasUnsavedChanges(true);
                        }}
                        style={{
                          width: "4.875rem",
                          height: "2.9875rem",
                          borderRadius: "0.5rem",
                          border: "1px solid #dfe1e5",
                          marginLeft: "0.62rem",
                          fontSize: "1rem",
                          fontFamily: "Spoqa Han Sans Neo",
                          paddingLeft: "0.2rem",
                        }}
                      >
                        {firstPhone?.map((el) => {
                          return (
                            <option
                              selected={el === editPMobileNumber1}
                              value={el}
                            >
                              {el === "" ? "직접 입력" : el}
                            </option>
                          );
                        })}
                      </select>
                    )}
                    {"-"}
                    <S.InputPhoneInput
                      ref={pMobileNumber2}
                      maxLength={4}
                      onChange={(e) => {
                        const onlyNumber = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        setHasUnsavedChanges(true);
                        setEditPMobileNumber2(onlyNumber);
                        if (e.target.value.length === 4) {
                          pMobileNumber3.current.focus();
                        }
                      }}
                      value={editPMobileNumber2}
                    ></S.InputPhoneInput>
                    {"-"}
                    <S.InputPhoneInput
                      ref={pMobileNumber3}
                      maxLength={4}
                      onChange={(e) => {
                        const onlyNumber = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        setHasUnsavedChanges(true);
                        setEditPMobileNumber3(onlyNumber);
                        // setHasUnsavedChanges(true);
                      }}
                      value={editPMobileNumber3}
                    ></S.InputPhoneInput>
                  </div>
                </S.InputTag>
                <S.InputTag>
                  <S.InputName style={{ marginBottom: "1.31rem" }}>
                    성별
                  </S.InputName>
                  <div
                    style={{
                      marginLeft: "2.185rem",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={"M"}
                      checked={editGender === "M"}
                      style={{
                        marginRight: "0.62rem",
                        width: "1rem",
                        height: "1rem",
                        accentColor: "#791285",
                      }}
                      onClick={(e) => {
                        setHasUnsavedChanges(true);
                        setEditGender(e.target.value);
                      }}
                    ></input>{" "}
                    <S.OptionName
                      style={{
                        marginRight: "8.44rem",
                        color: editGender === "M" ? "#791285" : "",
                        fontWeight: editGender === "M" ? "500" : "400",
                      }}
                    >
                      남
                    </S.OptionName>
                    <input
                      type="radio"
                      name="gender"
                      value={"W"}
                      checked={editGender === "W"}
                      style={{
                        marginRight: "0.62rem",
                        width: "1rem",
                        height: "1rem",
                        accentColor: "#791285",
                      }}
                      onClick={(e) => {
                        setHasUnsavedChanges(true);
                        setEditGender(e.target.value);
                      }}
                    ></input>
                    <S.OptionName
                      style={{
                        color: editGender === "W" ? "#791285" : "",
                        fontWeight: editGender === "W" ? "500" : "400",
                      }}
                    >
                      여
                    </S.OptionName>
                  </div>
                </S.InputTag>
              </div>
              <div>
                <S.InputTag>
                  <S.InputName>한글 이름</S.InputName>
                  <S.InputInput
                    value={data?.userDetails?.profile.korName}
                  ></S.InputInput>
                </S.InputTag>

                <S.InputName>센터 등록일</S.InputName>
                <S.InputInput
                  type="date"
                  value={editRegisterDate}
                  onChange={(e) => {
                    setHasUnsavedChanges(true);
                    setEditRegisterDate(e.target.value);
                  }}
                  // disabled={true}
                ></S.InputInput>
                <S.InputTag style={{ marginBottom: "1.88rem" }}>
                  <S.InputName>연락처</S.InputName>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    {isEditMobileNumber ? (
                      <S.ModalLabel>
                        <S.ModalBorderLess
                          maxLength={4}
                          onChange={(e) => {
                            const onlyNumber = e.target.value.replace(
                              /[^0-9]/g,
                              ""
                            );
                            setHasUnsavedChanges(true);
                            setEditMobileNumber1(onlyNumber);
                            setHasUnsavedChanges(true);
                            if (e.target.value.length === 4) {
                              mobileNumber2.current.focus();
                            }
                          }}
                          value={editMobileNumber1}
                        ></S.ModalBorderLess>
                        <div
                          style={{
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            setEditMobileNumber1("010");
                            setIsEditMobileNumber(false);
                            setHasUnsavedChanges(true);
                          }}
                        >
                          <svg
                            width="8"
                            height="6"
                            viewBox="0 0 8 6"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{ marginRight: "0.3rem", cursor: "pointer" }}
                          >
                            <path
                              d="M7.0625 0.21875L8 1.15625L4 5.15625L0 1.15625L0.9375 0.21875L4 3.28125L7.0625 0.21875Z"
                              fill="#333333"
                            />
                          </svg>
                        </div>
                      </S.ModalLabel>
                    ) : (
                      <select
                        onChange={(e) => {
                          if (e.target.value === "") {
                            setEditMobileNumber1(e.target.value);
                            setIsEditMobileNumber(true);
                          } else {
                            setEditMobileNumber1(e.target.value);
                          }
                          setHasUnsavedChanges(true);
                        }}
                        style={{
                          width: "4.875rem",
                          height: "2.9875rem",
                          borderRadius: "0.5rem",
                          border: "1px solid #dfe1e5",
                          marginLeft: "0.62rem",
                          fontSize: "1rem",
                          fontFamily: "Spoqa Han Sans Neo",
                          paddingLeft: "0.2rem",
                        }}
                      >
                        {firstPhone?.map((el) => {
                          return (
                            <option
                              selected={el === editMobileNumber1}
                              value={el}
                            >
                              {el === "" ? "직접 입력" : el}
                            </option>
                          );
                        })}
                      </select>
                    )}
                    {"-"}
                    <S.InputPhoneInput
                      ref={mobileNumber2}
                      maxLength={4}
                      onChange={(e) => {
                        const onlyNumber = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        setHasUnsavedChanges(true);
                        setEditMobileNumber2(onlyNumber);
                        if (e.target.value.length === 4) {
                          mobileNumber3.current.focus();
                        }
                      }}
                      value={editMobileNumber2}
                    ></S.InputPhoneInput>
                    {"-"}
                    <S.InputPhoneInput
                      ref={mobileNumber3}
                      maxLength={4}
                      onChange={(e) => {
                        const onlyNumber = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        setHasUnsavedChanges(true);
                        setEditMobileNumber3(onlyNumber);
                      }}
                      value={editMobileNumber3}
                    ></S.InputPhoneInput>
                  </div>
                </S.InputTag>
                <S.InputTag>
                  {myData?.me?.profile?.academies?.length > 0 ? (
                    <>
                      <S.InputName
                        style={{
                          marginBottom: "1.31rem",
                        }}
                      >
                        지점
                      </S.InputName>
                      <div
                        style={{
                          display: "flex",
                          marginLeft: "2.182rem",
                          justifyContent: "space-between",
                        }}
                      >
                        {myData?.me?.profile?.academies?.map((el) => {
                          return (
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <input
                                type="checkbox"
                                style={{
                                  width: "1rem",
                                  height: "1rem",
                                  marginRight: "0.62rem",
                                  accentColor: "#791285",
                                  // padding: "0",
                                }}
                                onClick={onClickAddBranchList(el.id)}
                                checked={
                                  branches?.filter((ele) => {
                                    return el.id === ele;
                                  }).length === 1
                                }
                              ></input>
                              <S.OptionName
                                style={{
                                  color:
                                    branches?.filter((ele) => {
                                      return el.id === ele;
                                    }).length === 1
                                      ? "#791285"
                                      : "",
                                  fontWeight:
                                    branches?.filter((ele) => {
                                      return el.id === ele;
                                    }).length === 1
                                      ? "500"
                                      : "",
                                }}
                              >
                                {el.location}
                              </S.OptionName>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <>
                      <S.InputName
                        style={{
                          marginBottom: "1.31rem",
                        }}
                      >
                        지점
                      </S.InputName>
                      <div
                        style={{
                          display: "flex",
                          marginLeft: "2.182rem",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <input
                            type="checkbox"
                            style={{
                              width: "1rem",
                              height: "1rem",
                              marginRight: "0.62rem",
                              accentColor: "#791285",
                              // padding: "0",
                            }}
                            // onClick={onClickAddBranchList(el.id)}
                            checked={true}
                          ></input>
                          <S.OptionName style={{}}>
                            {myData?.me?.profile?.academy?.name}
                          </S.OptionName>
                        </div>
                      </div>
                    </>
                  )}
                </S.InputTag>
              </div>
              <div>
                <S.InputTag style={{ marginBottom: "6.51rem" }}>
                  <S.InputName>영어 이름</S.InputName>
                  <S.InputInput
                    defaultValue={data?.userDetails?.profile.engName}
                    onChange={(e) => {
                      setHasUnsavedChanges(true);
                      setEditEngName(e.target.value);
                    }}
                  ></S.InputInput>
                </S.InputTag>
                <S.InputTag style={{ marginBottom: "1.88rem" }}>
                  <S.InputName>이메일</S.InputName>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <S.InputEmailInput
                      onChange={(e) => {
                        setHasUnsavedChanges(true);
                        setEditEmail1(e.target.value);
                      }}
                      value={editEmail1}
                    ></S.InputEmailInput>
                    <div>{" @ "}</div>
                    <S.InputEmailInput
                      onChange={(e) => {
                        setHasUnsavedChanges(true);
                        setEditEmail2(e.target.value);
                      }}
                      disabled={!isTyped}
                      value={editEmail2}
                    ></S.InputEmailInput>
                    <div>{}</div>
                    <select
                      style={{
                        padding: "0 1rem",
                        height: "2.8rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #dbdde1",
                        width: "11.25rem",
                        color: "#333",
                        fontFamily: "Spoqa Han Sans Neo",
                        fontSize: "1rem",
                      }}
                      onChange={(e) => {
                        setHasUnsavedChanges(true);
                        if (e.target.value === "") {
                          setEditEmail2("");
                          setIsTyped(true);
                        } else {
                          setEditEmail2(e.target.value);
                          setIsTyped(false);
                        }
                      }}
                    >
                      {addressList.map((el) => {
                        return (
                          <option value={el} selected={el === editEmail2}>
                            {el}
                          </option>
                        );
                      })}
                      <option value={""} selected={isTyped}>
                        {"직접 입력"}
                      </option>
                    </select>
                  </div>
                </S.InputTag>

                <S.InputTag>
                  <S.InputName style={{ marginBottom: "1.32rem" }}>
                    재원 상태
                  </S.InputName>
                  <div style={{ display: "flex", marginLeft: "2.185rem" }}>
                    <div>휴원</div>
                    <Switch
                      style={{
                        margin: "0 0.94rem",
                        backgroundColor: data?.userDetails?.isActive
                          ? "#791285"
                          : "#dfe1e5",
                      }}
                      checked={data?.userDetails?.isActive}
                      onClick={(checked) => {
                        // setIsStop(!checked);
                        setStopToggle(true);
                        setDeleteDate(dateToInput(new Date()));
                      }}
                    ></Switch>
                    <div>재원</div>
                  </div>
                </S.InputTag>
              </div>
            </div>
            <S.InputBox style={{ marginTop: "1.87rem" }}>
              <S.InputTag style={{ width: "100%" }}>
                <S.InputName>메모</S.InputName>
                <textarea
                  style={{
                    width: "89rem",
                    height: "8rem",
                    fontSize: "15px",
                    resize: "none",
                    fontWeight: "400",
                    fontFamily: "1rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #dbdde1",
                    fontFamily: "Spoqa Han Sans Neo",
                    placeholder: "메모를 입력해주세요.",
                    marginLeft: "0.62rem",
                  }}
                  onChange={(e) => {
                    setHasUnsavedChanges(true);
                    setEditMemo(e.target.value);
                  }}
                  defaultValue={
                    data?.userDetails?.memos?.filter((el) => {
                      console.log(el.academy.id);
                      return el.academy.id === router.query.branch;
                    })?.[0]?.memo
                  }
                ></textarea>
              </S.InputTag>
            </S.InputBox>
          </S.EditBox>
          {/* <div
            style={{
              width: "90rem",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                fontFamily: "Spoqa Han Sans Neo",
                fontSize: "0.875rem",
                color: "#999",
              }}
            >
              <span style={{ color: "#F00" }}>*</span>
              {"은 필수 입력 항목 입니다."}
            </div>
          </div> */}
          <S.ButtonBox style={{ alignItems: "center" }}>
            <S.RouteButton onClick={onClickEdit}>
              <svg
                width="12"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "0.62rem" }}
              >
                <path
                  d="M8 4.5V1.84375H1.34375V4.5H8ZM4.59375 10.5625C4.98958 10.9583 5.45833 11.1562 6 11.1562C6.54167 11.1562 7.01042 10.9583 7.40625 10.5625C7.80208 10.1667 8 9.69792 8 9.15625C8 8.61458 7.80208 8.14583 7.40625 7.75C7.01042 7.35417 6.54167 7.15625 6 7.15625C5.45833 7.15625 4.98958 7.35417 4.59375 7.75C4.19792 8.14583 4 8.61458 4 9.15625C4 9.69792 4.19792 10.1667 4.59375 10.5625ZM9.34375 0.5L12 3.15625V11.1562C12 11.5104 11.8646 11.8229 11.5938 12.0938C11.3229 12.3646 11.0104 12.5 10.6562 12.5H1.34375C0.96875 12.5 0.645833 12.375 0.375 12.125C0.125 11.8542 0 11.5312 0 11.1562V1.84375C0 1.46875 0.125 1.15625 0.375 0.90625C0.645833 0.635417 0.96875 0.5 1.34375 0.5H9.34375Z"
                  fill="white"
                />
              </svg>
              저장하기
            </S.RouteButton>
          </S.ButtonBox>
        </>
      )}

      {viewType === "lecture" && (
        <>
          <div
            style={{
              width: "90rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <S.SubAcademyTitle>수업 정보</S.SubAcademyTitle>
          </div>

          <div
            style={{
              width: "90rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "2.56rem",
              }}
            >
              <S.LectureInfoName>원생 번호</S.LectureInfoName>
              <S.LectureInfoInput
                style={{ textAlign: "center" }}
                value={data?.userDetails?.profile.origin}
                disabled={true}
              ></S.LectureInfoInput>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginRight: "2.56rem",
              }}
            >
              <S.LectureInfoName>원생 이름</S.LectureInfoName>
              <S.LectureInfoInput
                style={{ textAlign: "center" }}
                value={
                  data?.userDetails?.profile.korName
                    ? data?.userDetails?.profile.korName +
                      " (" +
                      data?.userDetails?.profile.engName +
                      ")"
                    : ""
                }
                disabled={true}
              ></S.LectureInfoInput>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <S.LectureInfoName style={{ fontWeight: 700 }}>
                조회 기간
              </S.LectureInfoName>
              <DatePicker.RangePicker
                style={{
                  width: "17.1875rem",
                  height: "2.6875rem",
                  color: "#333",
                  fontSize: "1rem",
                  fontWeight: "500",
                  textAlignLast: "center",
                }}
                separator="~"
                placeholder={[listDate, endListDate]}
                // value={[
                //   moment(listDate, "YYYY-MM-DD"),
                //   moment(endListDate, "YYYY-MM-DD"),
                // ]}
                // defaultValue={defaultDateRange}
                onChange={(e) => {
                  // console.log(
                  //   e,
                  //   dateToInput(e?.[0]?.$d),
                  //   dateToInput(e?.[1]?.$d)
                  // );
                  if (e?.[0] && e?.[1]) {
                    setListDate(dateToInput(e?.[0]?.$d));
                    setEndListDate(dateToInput(e?.[1]?.$d));
                  } else {
                    setListDate(
                      calculateLectureDate(dateToInput(new Date()))[0]
                    );
                    setEndListDate(
                      calculateLectureDate(dateToInput(new Date()))[1]
                    );
                  }
                }} // 날짜가 선택될 때 호출될 콜백 함수
              />
              {/* <S.DateContainer
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <S.ModalBorderLess
                  style={{ width: "8rem", fontSize: "1rem" }}
                  type="date"
                  value={listDate}
                  onChange={(e) => {
                    setListDate(e.target.value);
                  }}
                ></S.ModalBorderLess>
                <span>~</span>
                <S.ModalBorderLess
                  style={{ width: "8rem" }}
                  type="date"
                  value={endListDate}
                  onChange={(e) => {
                    setEndListDate(e.target.value);
                  }}
                ></S.ModalBorderLess>
              </S.DateContainer> */}
            </div>
          </div>

          <div
            style={{
              width: "90rem",
              borderTop: "1px solid #dfe1e5",
              margin: " 2.5rem 0",
            }}
          ></div>

          {/* <div
            style={{
              width: "90rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <S.DateTitle>시작일</S.DateTitle>
              <S.DateInput
                type="date"
                value={listDate}
                onChange={(e) => {
                  setListDate(e.target.value);
                }}
                style={{ marginRight: "5rem" }}
              ></S.DateInput>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <S.DateTitle>종료일</S.DateTitle>
              <S.DateInput
                type="date"
                value={endListDate}
                onChange={(e) => {
                  setEndListDate(e.target.value);
                }}
              ></S.DateInput>
            </div>
          </div> */}
          <div
            style={{
              width: "90rem",
              display: "flex",
              alignItems: "center",
              marginBottom: "0.62rem",
            }}
          >
            <div
              style={{
                marginRight: "3rem",
                fontFamily: "Spoqa Han Sans Neo",
                fontSize: "1.125rem",
                fontWeight: 700,
              }}
            >
              {"총 " + lectureList.length + "개"}
            </div>
            <button
              onClick={onClickOpenEditModal}
              style={{
                width: "8rem",
                height: "2.6875rem",
                backgroundColor: "#fff",
                borderRadius: "0.25rem",
                border: "1px solid #C8C8C8",
                fontWeight: 500,
                fontFamily: "Spoqa Han Sans Neo",
                color: "#333",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.8125 5.6875L12.5938 6.90625L10.0938 4.40625L11.3125 3.1875C11.4375 3.0625 11.5938 3 11.7812 3C11.9688 3 12.125 3.0625 12.25 3.1875L13.8125 4.75C13.9375 4.875 14 5.03125 14 5.21875C14 5.40625 13.9375 5.5625 13.8125 5.6875ZM2 12.5L9.375 5.125L11.875 7.625L4.5 15H2V12.5Z"
                  fill="#791285"
                />
              </svg>{" "}
              수업 수정
            </button>
          </div>
          <div style={{ height: "45.87rem", overflowX: "auto" }}>
            <table style={{ width: "90rem", borderCollapse: "collapse" }}>
              {lectureList.length !== 0 && (
                <thead style={{ position: "sticky", top: -1 }}>
                  <tr>
                    <S.ConsultingTh
                      style={{ width: "3.125rem" }}
                    ></S.ConsultingTh>
                    <S.ConsultingTh
                      style={{ width: "8.4375rem", padding: "0.38rem 0" }}
                    >
                      수업 날짜
                    </S.ConsultingTh>
                    <S.ConsultingTh style={{ width: "7.25rem" }}>
                      수업 시간
                    </S.ConsultingTh>
                    <S.ConsultingTh style={{ width: "7.75rem" }}>
                      담당
                    </S.ConsultingTh>
                    <S.ConsultingTh style={{ width: "45.25rem" }}>
                      강의 정보
                    </S.ConsultingTh>
                    <S.ConsultingTh style={{ width: "5.0625rem" }}>
                      수업 메모
                    </S.ConsultingTh>
                    <S.ConsultingTh style={{ width: "5.5rem" }}>
                      출석현황
                    </S.ConsultingTh>
                    <S.ConsultingTh style={{ width: "7.0625rem" }}>
                      보강 학습 추가
                    </S.ConsultingTh>
                  </tr>
                </thead>
              )}
              <tbody>
                {lectureList
                  ?.sort((a, b) => {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    const timeA =
                      Number(a.startTime.slice(0, 2)) * 100 +
                      Number(a.startTime.slice(3, 5));
                    const timeB =
                      Number(b.startTime.slice(0, 2)) * 100 +
                      Number(b.startTime.slice(3, 5));
                    if (dateA - dateB === 0) {
                      console.log(timeA - timeB < 0, "same");
                      return timeA - timeB;
                    } else {
                      return dateA - dateB;
                    }
                  })
                  // ?.filter((_, index) => {
                  //   return (
                  //     index >= lecturePage * lecturePageNum &&
                  //     index < lecturePage * (lecturePageNum + 1)
                  //   );
                  // })
                  ?.map((el, index) => {
                    return (
                      <tr key={uuidv4()}>
                        <S.ConsultingTd style={{ padding: "0.31rem 0" }}>
                          {index + 1}
                        </S.ConsultingTd>
                        <S.ConsultingTd>
                          {"20" +
                            dateInputToDot(el.date) +
                            " (" +
                            week[(dateInputToDays(el.date) + 6) % 7] +
                            ")"}
                        </S.ConsultingTd>
                        <S.ConsultingTd>
                          {el.startTime.slice(0, 5) +
                            " ~ " +
                            el.endTime.slice(0, 5)}
                        </S.ConsultingTd>
                        <S.ConsultingTd>{el.teacher.korName}</S.ConsultingTd>
                        <S.ConsultingTd>
                          {el?.lectureMemo === ""
                            ? el?.lectureInfo?.about
                            : el?.lectureMemo}
                        </S.ConsultingTd>
                        <S.ConsultingTd>
                          {/* <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          onClick={onClickViewMemo(
                            Number(router.query.id),
                            el.id
                          )}
                          style={{ cursor: "pointer" }}
                        >
                          <path
                            d="M7.08337 3.33334H5.00004C4.55801 3.33334 4.13409 3.50894 3.82153 3.8215C3.50897 4.13406 3.33337 4.55798 3.33337 5.00001V16.6667C3.33337 17.1087 3.50897 17.5326 3.82153 17.8452C4.13409 18.1577 4.55801 18.3333 5.00004 18.3333H15C15.4421 18.3333 15.866 18.1577 16.1786 17.8452C16.4911 17.5326 16.6667 17.1087 16.6667 16.6667V5.00001C16.6667 4.55798 16.4911 4.13406 16.1786 3.8215C15.866 3.50894 15.4421 3.33334 15 3.33334H12.9167"
                            stroke="#81858C"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          />
                          <path
                            d="M6.66663 5.33334V3.75001C6.66663 3.6395 6.71052 3.53352 6.78866 3.45538C6.8668 3.37724 6.97279 3.33334 7.08329 3.33334C7.31329 3.33334 7.50329 3.14668 7.54329 2.92001C7.66663 2.21001 8.14496 0.833344 9.99996 0.833344C11.855 0.833344 12.3333 2.21001 12.4566 2.92001C12.4966 3.14668 12.6866 3.33334 12.9166 3.33334C13.0271 3.33334 13.1331 3.37724 13.2113 3.45538C13.2894 3.53352 13.3333 3.6395 13.3333 3.75001V5.33334C13.3333 5.46595 13.2806 5.59313 13.1868 5.6869C13.0931 5.78066 12.9659 5.83334 12.8333 5.83334H7.16663C7.03402 5.83334 6.90684 5.78066 6.81307 5.6869C6.7193 5.59313 6.66663 5.46595 6.66663 5.33334Z"
                            stroke="#81858C"
                            stroke-width="1.5"
                            stroke-linecap="round"
                          />
                        </svg> */}
                          <S.AddModalIconButton
                            onClick={onClickViewMemo(
                              Number(router.query.id),
                              el.id
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
                        </S.ConsultingTd>
                        <S.ConsultingTd>
                          {el.attendanceStatus?.statusDisplay}
                        </S.ConsultingTd>
                        <S.ConsultingTd style={{ height: "2.19rem" }}>
                          {el.attendanceStatus?.statusDisplay === "결석" ? (
                            // <FormOutlined onClick={onClickClassToggle(el.id)} />
                            <S.AddModalIconButton
                              onClick={onClickClassToggle(el)}
                            >
                              <svg
                                width="1rem"
                                height="1rem"
                                viewBox="0 0 19 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.32031 5.67969H8.57031V10.0938L11.9297 12.0859L11.2656 13.1016L7.32031 10.6797V5.67969ZM13.9219 9H15.6016C15.6536 9.28646 15.6797 9.5599 15.6797 9.82031C15.6797 10.862 15.4844 11.8385 15.0938 12.75C14.7031 13.6615 14.1562 14.4688 13.4531 15.1719C12.776 15.849 11.9818 16.3828 11.0703 16.7734C10.1849 17.138 9.22135 17.3203 8.17969 17.3203C7.13802 17.3203 6.16146 17.138 5.25 16.7734C4.33854 16.3828 3.53125 15.849 2.82812 15.1719C2.15104 14.4688 1.61719 13.6615 1.22656 12.75C0.861979 11.8385 0.679688 10.862 0.679688 9.82031C0.679688 8.77865 0.861979 7.8151 1.22656 6.92969C1.61719 6.01823 2.15104 5.22396 2.82812 4.54688C3.53125 3.84375 4.33854 3.29688 5.25 2.90625C6.16146 2.51562 7.13802 2.32031 8.17969 2.32031C8.72656 2.32031 9.27344 2.38542 9.82031 2.51562V4.23438C9.29948 4.07812 8.7526 4 8.17969 4C7.34635 4 6.57812 4.15625 5.875 4.46875C5.17188 4.75521 4.54688 5.17188 4 5.71875C3.47917 6.23958 3.0625 6.85156 2.75 7.55469C2.46354 8.25781 2.32031 9.01302 2.32031 9.82031C2.32031 10.6536 2.46354 11.4219 2.75 12.125C3.0625 12.8281 3.47917 13.4531 4 14C4.54688 14.5208 5.17188 14.9375 5.875 15.25C6.57812 15.5365 7.34635 15.6797 8.17969 15.6797C8.98698 15.6797 9.74219 15.5365 10.4453 15.25C11.1484 14.9375 11.7604 14.5208 12.2812 14C12.8281 13.4531 13.2448 12.8281 13.5312 12.125C13.8438 11.4219 14 10.6536 14 9.82031C14 9.5599 13.974 9.28646 13.9219 9ZM15.6797 3.17969H18.1797V4.82031H15.6797V7.32031H14V4.82031H11.5V3.17969H14V0.679688H15.6797V3.17969Z"
                                  fill="#333333"
                                />
                              </svg>
                            </S.AddModalIconButton>
                          ) : el.attendanceStatus?.statusDisplay ===
                            "결석 (보강)" ? (
                            <S.AddModalIconButton>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8 2C4.69165 2 2 4.69165 2 8C2 11.3083 4.69165 14 8 14C11.3086 14 14 11.3083 14 8C14 4.69165 11.3086 2 8 2ZM8 13C5.2429 13 3 10.7571 3 8C3 5.2429 5.2429 3 8 3C10.7569 3 13 5.2429 13 8C13 10.7571 10.7569 13 8 13Z"
                                  fill="#333333"
                                />
                                <path
                                  fill-rule="evenodd"
                                  clip-rule="evenodd"
                                  d="M11 6.63059L10.3211 6L7.37219 8.7472L5.68032 7.17579L5 7.79659L7.37231 10L11 6.63059Z"
                                  fill="#333333"
                                />
                              </svg>
                            </S.AddModalIconButton>
                          ) : (
                            <></>
                          )}
                        </S.ConsultingTd>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {/* <div
            style={{
              width: "90rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1.88rem",
            }}
          >
            <S.ConsultingPageNumber
              style={{ color: lecturePageNum > 0 ? "" : "#C8C8C8" }}
              onClick={() => {
                setLecturePageNum(0);
              }}
            >
              {"<<"}
            </S.ConsultingPageNumber>
            <S.ConsultingPageNumber
              style={{ color: lecturePageNum > 0 ? "" : "#C8C8C8" }}
              onClick={() => {
                if (lecturePageNum > 0) {
                  setLecturePageNum(lecturePageNum - 1);
                }
              }}
            >
              {"<"}
            </S.ConsultingPageNumber>
            {Array(lectureMaxNum)
              .fill(0)
              .map((_, index) => (
                <S.ConsultingPageNumber
                  onClick={() => {
                    setLecturePageNum(index);
                  }}
                  style={
                    lecturePageNum === index
                      ? {
                          color: "#fff",
                          background: "#791285",
                          width: "1rem",
                          display: "flex",
                          justifyContent: "center",
                        }
                      : {
                          width: "1rem",
                          display: "flex",
                          justifyContent: "center",
                        }
                  }
                >
                  {index + 1}
                </S.ConsultingPageNumber>
              ))}
            <S.ConsultingPageNumber
              style={{
                color: lectureMaxNum - 1 > lecturePageNum ? "" : "#C8C8C8",
              }}
              onClick={() => {
                if (lecturePageNum < lectureMaxNum - 1) {
                  setLecturePageNum(lecturePageNum + 1);
                }
              }}
            >
              {">"}
            </S.ConsultingPageNumber>
            <S.ConsultingPageNumber
              style={{
                color: lectureMaxNum - 1 > lecturePageNum ? "" : "#C8C8C8",
              }}
              onClick={() => {
                setLecturePageNum(lectureMaxNum - 1);
              }}
            >
              {">>"}
            </S.ConsultingPageNumber>
          </div> */}
        </>
      )}
      {viewType === "consulting" && (
        <>
          <div
            style={{
              width: "90rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <S.SubAcademyTitle>상담 정보</S.SubAcademyTitle>
          </div>
          <div
            style={{
              display: "flex",
              width: "90rem",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <S.DateTitle style={{ marginRight: "1.88rem" }}>
                원생 번호
              </S.DateTitle>
              <S.ConsultingTitleInput
                style={{ textAlign: "center" }}
                value={data?.userDetails?.profile.origin}
                disabled={true}
              ></S.ConsultingTitleInput>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <S.DateTitle style={{ marginRight: "1.88rem" }}>
                원생 이름
              </S.DateTitle>
              <S.ConsultingTitleInput
                style={{ textAlign: "center" }}
                value={
                  data?.userDetails?.profile.korName
                    ? data?.userDetails?.profile.korName +
                      " (" +
                      data?.userDetails?.profile.engName +
                      ")"
                    : ""
                }
                disabled={true}
              ></S.ConsultingTitleInput>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <S.DateTitle style={{ marginRight: "1.88rem" }}>
                부모님 전화번호
              </S.DateTitle>
              <div>
                <S.ConsultingTitleInput
                  style={{ textAlign: "center" }}
                  defaultValue={data?.userDetails?.profile.pmobileno}
                  disabled={true}
                ></S.ConsultingTitleInput>
                {/* -
                <S.ConsultingPhoneInput
                  defaultValue={
                    data?.userDetails?.profile.pmobileno?.split("-")[1]
                  }
                  disabled={true}
                ></S.ConsultingPhoneInput>
                -
                <S.ConsultingPhoneInput
                  defaultValue={
                    data?.userDetails?.profile.pmobileno?.split("-")[2]
                  }
                  disabled={true}
                ></S.ConsultingPhoneInput> */}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <S.DateTitle style={{ marginRight: "1.88rem" }}>
                생년월일
              </S.DateTitle>
              <S.ConsultingTitleInput
                style={{ textAlign: "center" }}
                value={data?.userDetails?.profile.birthDate}
                disabled={true}
              ></S.ConsultingTitleInput>
            </div>
          </div>
          <div
            style={{
              borderBottom: "1px solid #C8C8C8",
              width: "90rem",
              margin: "2.5rem 0",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.62rem",
            }}
          >
            <div
              style={{
                marginRight: "3rem",
                fontFamily: "Spoqa Han Sans Neo",
                fontSize: "1.125rem",
                fontWeight: 700,
              }}
            >
              {"총 " + consultingList.length + "건"}
            </div>
            <button
              style={{
                width: "8rem",
                height: "2.6875rem",
                backgroundColor: "#fff",
                borderRadius: "0.25rem",
                border: "1px solid #C8C8C8",
                fontWeight: 500,
                fontFamily: "Spoqa Han Sans Neo",
                color: "#333",
                fontSize: "1rem",
                cursor: "pointer",
              }}
              onClick={() => {
                setIsConsulting(true);
              }}
            >
              <svg
                width="10"
                height="11"
                viewBox="0 0 10 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "0.62rem" }}
              >
                <path
                  d="M9.65625 6.15625H5.65625V10.1562H4.34375V6.15625H0.34375V4.84375H4.34375V0.84375H5.65625V4.84375H9.65625V6.15625Z"
                  fill="#791285"
                />
              </svg>
              상담 추가
            </button>
          </div>
          {consultingList.length !== 0 && (
            <>
              <table
                style={{
                  width: "89.2rem",
                  border: "0.5px solid #dfe1e5",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr>
                    <S.ConsultingTh>
                      <div
                        style={{
                          width: "3.15rem",
                          height: "2.06rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      ></div>
                    </S.ConsultingTh>
                    <S.ConsultingTh>
                      <div
                        style={{
                          width: "27.185rem",
                          height: "2.06rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        제목
                      </div>
                    </S.ConsultingTh>
                    <S.ConsultingTh>
                      <div
                        style={{
                          width: "36.25rem",
                          height: "2.06rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        내용
                      </div>
                    </S.ConsultingTh>
                    <S.ConsultingTh>
                      <div
                        style={{
                          width: "9rem",
                          height: "2.06rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        상담 선생님
                      </div>
                    </S.ConsultingTh>
                    <S.ConsultingTh>
                      <div
                        style={{
                          width: "8.4375rem",
                          height: "2.06rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        상담 등록일
                      </div>
                    </S.ConsultingTh>
                    <S.ConsultingTh>
                      <div
                        style={{
                          width: "5.5625rem",
                          height: "2.06rem",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        수정/삭제
                      </div>
                    </S.ConsultingTh>
                  </tr>
                </thead>
                <tbody>
                  {consultingList
                    ?.filter((_, ind) => {
                      return (
                        12 * consultingPage <= ind &&
                        12 * (consultingPage + 1) > ind
                      );
                    })
                    ?.map((el, index) => {
                      return (
                        <ConsultingTable
                          el={el}
                          index={index}
                          openEdit={onClickOpenEditConsultingModal}
                          openDelete={onClickOpenDeleteModal}
                          teacherData={teacherData}
                        ></ConsultingTable>
                      );
                    })}
                </tbody>
              </table>
              <div
                style={{
                  width: "90rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "1.5rem 0",
                }}
              >
                <S.ConsultingPageNumber
                  style={{
                    cursor: consultingPage === 0 ? "default" : "",
                    color: consultingPage === 0 ? "#c8c8c8" : "",
                  }}
                  onClick={() => {
                    setConsultingPage(0);
                  }}
                >
                  {"<<"}
                </S.ConsultingPageNumber>
                <S.ConsultingPageNumber
                  style={{
                    cursor: consultingPage === 0 ? "default" : "",
                    color: consultingPage === 0 ? "#c8c8c8" : "",
                  }}
                  onClick={() => {
                    if (consultingPage > 0) {
                      setConsultingPage(consultingPage - 1);
                    }
                  }}
                >
                  {"<"}
                </S.ConsultingPageNumber>
                {Array(maxConsultingPage)
                  .fill(0)
                  ?.map((_, index) => {
                    return (
                      <S.ConsultingPageNumber
                        style={
                          consultingPage === index
                            ? { color: "#fff", background: "#791285" }
                            : {}
                        }
                        onClick={() => {
                          setConsultingPage(index);
                        }}
                      >
                        {index + 1}
                      </S.ConsultingPageNumber>
                    );
                  })}
                <S.ConsultingPageNumber
                  style={{
                    cursor:
                      consultingPage === maxConsultingPage - 1 ? "default" : "",
                    color:
                      consultingPage === maxConsultingPage - 1 ? "#c8c8c8" : "",
                  }}
                  onClick={() => {
                    if (consultingPage < maxConsultingPage - 1) {
                      setConsultingPage(consultingPage + 1);
                    }
                  }}
                >
                  {">"}
                </S.ConsultingPageNumber>
                <S.ConsultingPageNumber
                  onClick={() => {
                    setConsultingPage(maxConsultingPage - 1);
                  }}
                  style={{
                    cursor:
                      consultingPage === maxConsultingPage - 1 ? "default" : "",
                    color:
                      consultingPage === maxConsultingPage - 1 ? "#c8c8c8" : "",
                  }}
                >
                  {">>"}
                </S.ConsultingPageNumber>
              </div>
            </>
          )}
        </>
      )}
      {classToggle ? (
        <Modal
          closable={false}
          open={classToggle}
          width={"40.125rem"}
          height={"48rem"}
          onCancel={() => {
            setClassToggle(false);
          }}
          footer={null}
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
          <div>
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
                  value={data?.userDetails?.profile?.origin}
                  disabled={true}
                ></S.MakeUpModalInput>
              </div>
              <div>
                <S.MakeUpModalTagTitle>원생 이름</S.MakeUpModalTagTitle>
                <S.MakeUpModalInput
                  value={
                    data?.userDetails?.profile.korName
                      ? data?.userDetails?.profile.korName +
                        " (" +
                        data?.userDetails?.profile.engName +
                        ")"
                      : ""
                  }
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
            <S.MakeUpModalSubTitle>보강 수업</S.MakeUpModalSubTitle>
            <div
              style={{
                marginBottom: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
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
                      setAddClassDate(event.target.value);
                    }}
                  ></S.ModalBorderLess>
                  <div style={{ position: "absolute", left: "9.5rem" }}>
                    {"(" + dateInputToDay(addClassDate) + ")"}
                  </div>
                </S.DateLabel>
              </div>
              <div>
                <S.MakeUpModalTagTitle>담당 선생님</S.MakeUpModalTagTitle>
                <select
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
                  onChange={(event) => {
                    setTeacherId(event.target.value);
                  }}
                  value={teacherId}
                >
                  {userData?.allUsers
                    .filter((el) => el.userCategory === "선생님")
                    ?.filter((el) => {
                      return (
                        Number(el?.profile?.academy?.id) ===
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
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <S.MakeUpModalTagTitle>수업 시간</S.MakeUpModalTagTitle>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <S.MakeUpModalInput
                  type="time"
                  defaultValue={dateToClock(date)}
                  onChange={(event) => {
                    setAddClassStart(event.target.value);
                  }}
                ></S.MakeUpModalInput>
                ~
                <S.MakeUpModalInput
                  style={{ marginLeft: "0" }}
                  type="time"
                  defaultValue={dateToClockOneHour(date)}
                  onChange={(event) => {
                    setAddClassEnd(event.target.value);
                  }}
                ></S.MakeUpModalInput>
              </div>
            </div>
            <div>
              <S.MakeUpModalTagTitle>보강 설명</S.MakeUpModalTagTitle>
              <S.MakeUpModalTextArea
                placeholder="설명을 입력하세요"
                value={addClassInfo}
                onChange={(event) => {
                  setAddClassInfo(event.target.value);
                }}
              ></S.MakeUpModalTextArea>
            </div>
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
              marginTop: "0.88rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <S.MakeUpModalOKButton onClick={onClickMakeUpClass}>
              저장
            </S.MakeUpModalOKButton>
            <S.MakeUpModalCancelButton onClick={onClickCancelMakeUp}>
              취소
            </S.MakeUpModalCancelButton>
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
          width={"40.125rem"}
          height={"48rem"}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 0,
          }}
        >
          <div
            style={{
              width: "100%",
            }}
          >
            <S.MakeUpModalTitle>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginRight: "0.62rem" }}
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0 1.75758C0 0.786893 0.786893 0 1.75758 0H10.2424C11.2131 0 12 0.786898 12 1.75758V7.92218C12 8.3883 11.8148 8.83534 11.4852 9.16497L9.16497 11.4852C8.83534 11.8148 8.3883 12 7.92218 12H1.75758C0.786898 12 0 11.2131 0 10.2424V1.75758ZM1.75758 1.09091C1.38939 1.09091 1.09091 1.38939 1.09091 1.75758V10.2424C1.09091 10.6106 1.38938 10.9091 1.75758 10.9091H7.27273V9.0303C7.27273 8.0596 8.0596 7.27273 9.0303 7.27273H10.9091V1.75758C10.9091 1.38938 10.6106 1.09091 10.2424 1.09091H1.75758ZM10.742 8.36364H9.0303C8.6621 8.36364 8.36364 8.6621 8.36364 9.0303V10.742C8.37387 10.7329 8.38386 10.7235 8.39358 10.7138L10.7138 8.39358C10.7235 8.38386 10.7329 8.37387 10.742 8.36364ZM2.42424 2.9697C2.42424 2.66845 2.66845 2.42424 2.9697 2.42424H9.0303C9.33155 2.42424 9.57576 2.66845 9.57576 2.9697C9.57576 3.27094 9.33155 3.51515 9.0303 3.51515H2.9697C2.66845 3.51515 2.42424 3.27094 2.42424 2.9697ZM2.42424 5.39394C2.42424 5.09269 2.66845 4.84848 2.9697 4.84848H9.0303C9.33155 4.84848 9.57576 5.09269 9.57576 5.39394C9.57576 5.69519 9.33155 5.93939 9.0303 5.93939H2.9697C2.66845 5.93939 2.42424 5.69519 2.42424 5.39394ZM2.42424 7.81818C2.42424 7.51694 2.66845 7.27273 2.9697 7.27273H5.39394C5.69519 7.27273 5.93939 7.51694 5.93939 7.81818C5.93939 8.11943 5.69519 8.36364 5.39394 8.36364H2.9697C2.66845 8.36364 2.42424 8.11943 2.42424 7.81818Z"
                  fill="#791285"
                />
              </svg>
              수업 메모
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
                justifyContent: "space-between",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <S.MakeUpModalTagTitle>원생 번호</S.MakeUpModalTagTitle>
                <S.MakeUpModalInput
                  value={data?.userDetails?.profile?.origin}
                ></S.MakeUpModalInput>
              </div>
              <div>
                <S.MakeUpModalTagTitle>원생 이름</S.MakeUpModalTagTitle>
                <S.MakeUpModalInput
                  value={
                    data?.userDetails?.profile?.korName +
                    " (" +
                    data?.userDetails?.profile?.engName +
                    ")"
                  }
                ></S.MakeUpModalInput>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
              }}
            >
              <div>
                <S.MakeUpModalTagTitle>작성자</S.MakeUpModalTagTitle>
                <S.MakeUpModalInput
                  value={memoContents?.lecture?.teacher?.korName}
                ></S.MakeUpModalInput>
              </div>
              <div>
                <S.MakeUpModalTagTitle>수업 날짜</S.MakeUpModalTagTitle>
                <S.MakeUpModalInput
                  value={memoContents?.lecture?.date}
                ></S.MakeUpModalInput>
              </div>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <S.MakeUpModalTagTitle>수업 시간</S.MakeUpModalTagTitle>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <S.MakeUpModalInput
                  value={memoContents?.lecture?.startTime.slice(0, 5)}
                ></S.MakeUpModalInput>
                <span>~</span>
                <S.MakeUpModalInput
                  style={{ marginLeft: "0" }}
                  value={memoContents?.lecture?.endTime.slice(0, 5)}
                ></S.MakeUpModalInput>
              </div>
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <S.MakeUpModalTagTitle>수업 정보</S.MakeUpModalTagTitle>
              <S.MakeUpModalBigInput
                value={memoContents?.lecture?.lectureInfo?.about}
              ></S.MakeUpModalBigInput>
            </div>
            <div style={{ marginBottom: "1.25rem" }}>
              <S.MakeUpModalTagTitle>원생 메모</S.MakeUpModalTagTitle>
              <S.MakeUpModalTextArea
                placeholder="내용을 입력하세요."
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
                  // width: "100%",
                  // height: "200px",
                  // fontFamily: "Spoqa Han Sans Neo",
                  whiteSpace: "break-spaces",
                }}
              ></S.MakeUpModalTextArea>
            </div>
            {/* <table style={{ borderRight: "none", borderLeft: "none" }}>
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
                  ></td>
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
                  ></td>
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
                  ></td>
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
                  <td style={{ borderRight: "none", borderLeft: "none" }}></td>
                </tr>
              </tbody>
            </table> */}
            <div
              style={{
                width: "100%",
                borderTop: "1px solid #DFE1E5",
                marginTop: "1.25rem",
                marginBottom: "0.88rem",
              }}
            ></div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                marginTop: "30px",
              }}
            >
              {/* <div style={{ display: "flex" }}>
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
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </S.ClassButton>
              </div> */}
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <S.MakeUpModalOKButton onClick={onClickEditMemo}>
                  저장
                </S.MakeUpModalOKButton>
                <S.MakeUpModalCancelButton
                  onClick={() => {
                    setIsMemo(false);
                  }}
                  // style={{ background: "#EBECEF", color: "#000" }}
                >
                  취소
                </S.MakeUpModalCancelButton>
              </div>
            </div>
          </div>
        </Modal>
      ) : (
        <></>
      )}
      {isCheck ? (
        <Modal
          closable={false}
          footer={null}
          open={isCheck}
          onCancel={() => {
            setIsCheck(false);
          }}
        ></Modal>
      ) : (
        <></>
      )}
      {/* 수업 변경 모달 */}
      {isEdit ? (
        <Modal
          closable={false}
          open={isEdit}
          width={"89.875rem"}
          height={"47rem"}
          keyboard={true}
          onCancel={onClickCancel}
          footer={null}
          style={{ content: { padding: 0 } }}
          // className="ant-modal-content"
        >
          <S.ClassTitle>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "0.44rem" }}
            >
              <path
                d="M11.8125 2.6875L10.5938 3.90625L8.09375 1.40625L9.3125 0.1875C9.4375 0.0625 9.59375 0 9.78125 0C9.96875 0 10.125 0.0625 10.25 0.1875L11.8125 1.75C11.9375 1.875 12 2.03125 12 2.21875C12 2.40625 11.9375 2.5625 11.8125 2.6875ZM0 9.5L7.375 2.125L9.875 4.625L2.5 12H0V9.5Z"
                fill="#791285"
              />
            </svg>

            {" 수업 추가/수정"}
          </S.ClassTitle>
          <div
            style={{
              borderTop: "1px solid #DFE1E5",
              // width: "89.875rem",
              marginTop: "1.25rem",
              // marginRight: "1.3rem",
            }}
          ></div>
          <S.ModalClassAddWrapper>
            <div style={{ width: "53rem", height: "43.5rem" }}>
              <>
                <S.AddModalTitle style={{ marginTop: "1.25rem" }}>
                  {`${data?.userDetails?.profile?.origin} ${data?.userDetails?.profile?.korName}(${data?.userDetails?.profile?.engName})의 수업`}

                  {/* <span style={{ color: "#F00" }}>
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
                        addRepeatInput?.filter((el) => el?.isOne)?.length >
                      12
                        ? "30rem"
                        : "",
                    justifyContent: "flex-start",
                    overflowY:
                      addRepeatInput?.length +
                        addRepeatInput?.filter((el) => el?.isOne)?.length >
                      12
                        ? "scroll"
                        : "hidden",
                  }}
                >
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ position: "sticky", top: -1, zIndex: 0 }}>
                      <tr>
                        <S.AddModalTh
                          style={{
                            width: "4.19rem",
                            textAlign: "center",
                            background: "#791285",
                          }}
                        ></S.AddModalTh>
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
                                  opacity: el?.isDelete ? "50%" : "100%",
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
                                  opacity: el?.isDelete ? "50%" : "100%",
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

                                  opacity: el?.isDelete ? "50%" : "100%",
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
                                  opacity: el?.isDelete ? "50%" : "100%",
                                }}
                              >
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

                                  opacity: el?.isDelete ? "50%" : "100%",
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
                                  opacity: el?.isDelete ? "50%" : "100%",
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
                                    justifyContent: "space-around",
                                  }}
                                >
                                  <S.AddModalIconButton
                                    onClick={onClickSelectRepeatInput(index)}
                                    style={{ marginRight: "0.62rem" }}
                                  >
                                    <svg
                                      width="12"
                                      height="12"
                                      viewBox="0 0 12 12"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                      style={{
                                        opacity: el?.isDelete ? "50%" : "100%",
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
                                      onClick={onClickDeleteRepeatInput(index)}
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
                                          d="M9.65625 0.65625V2H0.34375V0.65625H2.65625L3.34375 0H6.65625L7.34375 0.65625H9.65625ZM1 10.6562V2.65625H9V10.6562C9 11.0104 8.86458 11.3229 8.59375 11.5938C8.32292 11.8646 8.01042 12 7.65625 12H2.34375C1.98958 12 1.67708 11.8646 1.40625 11.5938C1.13542 11.3229 1 11.0104 1 10.6562Z"
                                          fill="#333333"
                                        />
                                      </svg>
                                    </S.AddModalIconButton>
                                  )}
                                </div>
                                {/* <S.AddModalIconButton
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
                                      d="M9.65625 0.65625V2H0.34375V0.65625H2.65625L3.34375 0H6.65625L7.34375 0.65625H9.65625ZM1 10.6562V2.65625H9V10.6562C9 11.0104 8.86458 11.3229 8.59375 11.5938C8.32292 11.8646 8.01042 12 7.65625 12H2.34375C1.98958 12 1.67708 11.8646 1.40625 11.5938C1.13542 11.3229 1 11.0104 1 10.6562Z"
                                      fill="#333333"
                                    />
                                  </svg>
                                </S.AddModalIconButton> */}
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
                                    el.oneChangeList?.[0]?.endTime?.slice(0, 5)}
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
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "space-around",
                                      alignItems: "center",
                                    }}
                                  >
                                    <S.AddModalIconButton
                                      style={{ marginRight: "0.62rem" }}
                                      onClick={onClickSelectRepeatInput(index)}
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
                                  </div>
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
                  <S.MoveButton
                    onClick={onClickAddRepeatInput(addRepeatInput.length)}
                  >
                    <svg
                      width="10"
                      height="11"
                      viewBox="0 0 10 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ cursor: "pointer", marginRight: "0.66rem" }}
                    >
                      <path
                        d="M9.65625 6.15625H5.65625V10.1562H4.34375V6.15625H0.34375V4.84375H4.34375V0.84375H5.65625V4.84375H9.65625V6.15625Z"
                        fill="#333333"
                      />
                    </svg>
                    수업 추가
                  </S.MoveButton>
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
            </div>
            <div
              style={{
                borderRight: "1px solid #dfe1e5",
                marginLeft: "1.25rem",
              }}
            ></div>
            {/* <div
              style={{
                display: "flex",
                width: "30rem",
                alignItems: "center",
                justifyContent: "flex-start",
                overflowX: addRepeatInput.length > 6 ? "scroll" : "hidden",
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
                        selectedAddListIndex === ind ? "#ffffff" : "#858585",
                      backgroundColor:
                        selectedAddListIndex === ind ? "#791285" : "#F5F5F5",
                    }}
                    onClick={() => {
                      if (addRepeatInput?.length > ind) {
                        setSelectedAddListIndex(ind);
                      }
                    }}
                  >
                    {ind + 1}
                    {el.id === "" && addRepeatInput.length > 1 && (
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
                  </S.AddModalSelectBox>
                );
              })}
              <S.AddModalSelectBox
                style={{
                  border: "none",
                  borderBottom: "1px solid #dfe1e5",
                }}
                onClick={onClickAddRepeatInput(addRepeatInput.length)}
              >
                +
              </S.AddModalSelectBox>
            </div> */}
            <div style={{ marginLeft: "1rem", marginTop: "1.25rem" }}>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "flex",
                    width: "26.9rem",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    overflowX: addRepeatInput.length > 5 ? "scroll" : "hidden",
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
                          if (addRepeatInput?.length > ind) {
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
                  onClick={onClickAddRepeatInput(addRepeatInput.length)}
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
                {/* <S.AddModalSelectBox
                  style={{
                    border: "none",
                    borderBottom: "1px solid #dfe1e5",
                  }}
                  onClick={onClickAddRepeatInput(addRepeatInput.length)}
                >
                  +
                </S.AddModalSelectBox> */}
              </div>

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
                      {el?.oneChangeList !== undefined && (
                        <>
                          <S.AddModalTagTitle>변경 유형</S.AddModalTagTitle>
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
                                onClick={onClickAddOneChangeList(el, false)}
                                style={{
                                  width: "1.25rem",
                                  height: "1.25rem",
                                }}
                              ></S.AddRadioButton>
                              <span
                                style={{
                                  color: !el?.isOne ? "#791285" : "#82858B",
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
                                onClick={onClickAddOneChangeList(el, true)}
                                style={{
                                  width: "1.25rem",
                                  height: "1.25rem",
                                }}
                              ></S.AddRadioButton>
                              <span
                                style={{
                                  color: el?.isOne ? "#791285" : "#82858B",
                                  fontFamily: "Spoqa Han Sans Neo",
                                }}
                              >
                                단일 변경
                              </span>
                            </div>
                          </div>
                          {el.isOne && (
                            <div>
                              <S.AddModalTagTitle style={{ color: "#999" }}>
                                {"변경 수업 정보 (열 번호 " + (ind + 1) + "-1)"}
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
                                          ele?.lecture?.lectureInfo?.id ===
                                          el?.id
                                        );
                                      })
                                      ?.filter((ele) => {
                                        const newDate = new Date(
                                          ele.lecture.date
                                        );
                                        const calendarDate = new Date(listDate);
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
                                        return newDate - calendarDate >= 0;
                                      })
                                      ?.map((ele) => {
                                        const newDate = new Date(
                                          ele.lecture.date
                                        );
                                        return (
                                          <option
                                            selected={
                                              Number(ele?.lecture?.id) ===
                                              Number(
                                                el?.oneChangeList?.[0]
                                                  ?.lectureId
                                              )
                                            }
                                            value={ele?.lecture?.id}
                                          >
                                            {ele?.lecture?.date +
                                              "(" +
                                              week[(newDate.getDay() + 6) % 7] +
                                              ")"}
                                          </option>
                                        );
                                      })}
                                  </S.AddModalSelect>
                                </div>
                                <div>
                                  <S.AddModalTitle>변경 날짜</S.AddModalTitle>
                                  <S.AddModalInputDate
                                    onChange={onChangeOneDate(ind)}
                                    value={el?.oneChangeList?.[0]?.date}
                                    type="date"
                                  ></S.AddModalInputDate>
                                </div>
                              </div>
                              <div style={{ display: "flex" }}>
                                <div>
                                  <S.AddModalTitle>지점</S.AddModalTitle>
                                  {myData?.me?.profile?.academies?.length >
                                  0 ? (
                                    <S.AddModalSelect
                                      onChange={onChangeOneBranch(ind)}
                                    >
                                      {myData?.me?.profile?.academies?.map(
                                        (ele) => {
                                          return (
                                            <option
                                              value={Number(ele.id)}
                                              selected={
                                                Number(router.query.branch) ===
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
                                        value={Number(router.query.branch)}
                                      >
                                        {myData?.me?.profile?.academy?.name}
                                      </option>
                                    </S.AddModalSelect>
                                  )}
                                </div>
                                <div>
                                  <S.AddModalTitle>담당 선생님</S.AddModalTitle>
                                  <S.AddModalSelect
                                    onChange={onChangeOneTeacher(ind)}
                                  >
                                    {teacherData?.staffInAcademy
                                      ?.filter(
                                        (el) =>
                                          el.user.userCategory === "선생님"
                                      )
                                      .map((ele) => {
                                        return (
                                          <option
                                            value={ele.id}
                                            selected={
                                              Number(ele.id) ===
                                              Number(
                                                el.oneChangeList?.[0]?.teacherId
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
                                <S.AddModalTitle>수업시간</S.AddModalTitle>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <S.AddModalInputTime
                                    type="time"
                                    onChange={onChangeOneStartTime(ind)}
                                    value={el?.oneChangeList?.[0]?.startTime}
                                  ></S.AddModalInputTime>
                                  ~
                                  <S.AddModalInputTime
                                    type="time"
                                    onChange={onChangeOneEndTime(ind)}
                                    value={el?.oneChangeList?.[0]?.endTime}
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
                              <S.AddModalTagTitle style={{ color: "#999" }}>
                                {"기존 수업 정보 (열 번호 " + (ind + 1) + ")"}
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
                            disabled={el.isOne}
                            onChange={onChangeRepeatDate(ind)}
                          ></S.AddModalInputDate>
                        </div>
                      </div>

                      <div style={{ display: "flex" }}>
                        <div>
                          <S.AddModalTagTitle>지점</S.AddModalTagTitle>
                          {myData?.me?.profile?.academies?.length > 0 ? (
                            <S.AddModalSelect onChange={(e) => {}}>
                              {myData?.me?.profile?.academies?.map((ele) => {
                                return (
                                  <option
                                    value={Number(ele.id)}
                                    selected={
                                      Number(router.query.branch) ===
                                      Number(el?.oneChangeList?.[0]?.branchId)
                                    }
                                    disabled={true}
                                  >
                                    {ele.location}
                                  </option>
                                );
                              })}
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
                          <S.AddModalTagTitle>담당 선생님</S.AddModalTagTitle>
                          <S.AddModalSelect
                            onChange={onChangeRepeatTeacherId(ind)}
                            style={{
                              backgroundColor: el.isOne ? "#f1f1f1" : "",
                            }}
                            disabled={el.isOne}
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
                                      Number(addRepeatInput[ind].teacherId) ===
                                      Number(el.id)
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
                          style={{ display: "flex", flexDirection: "column" }}
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
                                addRepeatInput[ind].isRepeat === "routine"
                              }
                              style={{
                                width: "1.25rem",
                                height: "1.25rem",
                                backgroundColor: "#791285",
                              }}
                              onClick={onChangeRepeatIsRepeat(ind, "routine")}
                              disabled={el.isOne}
                            ></S.AddRadioButton>
                            <S.AddRadioTitle
                              style={
                                addRepeatInput[ind].isRepeat === "routine"
                                  ? { marginRight: "1rem" }
                                  : { color: "#cccccc", marginRight: "1rem" }
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
                                  addRepeatInput[ind].isAuto || el.isOne
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
                                  addRepeatInput[ind]?.isRepeat === "routine"
                                    ? addRepeatInput[ind].repeatsNum
                                    : 0
                                }
                                disabled={
                                  addRepeatInput[ind].isAuto ||
                                  el.isOne ||
                                  addRepeatInput[ind]?.isRepeat !== "routine"
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
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <S.AddRadioButton
                              type="radio"
                              name={"type" + ind}
                              checked={
                                addRepeatInput[ind].isRepeat === "infinity"
                              }
                              value={"infinity"}
                              onClick={onChangeRepeatIsRepeat(ind, "infinity")}
                              style={{ width: "1.25rem", height: "1.25rem" }}
                              disabled={el.isOne}
                            ></S.AddRadioButton>
                            <S.AddRadioTitle
                              style={
                                addRepeatInput[ind].isRepeat === "infinity"
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
                              checked={addRepeatInput[ind].isRepeat === "count"}
                              style={{
                                width: "1.25rem",
                                height: "1.25rem",
                              }}
                              onClick={onChangeRepeatIsRepeat(ind, "count")}
                              disabled={el.isOne}
                            ></S.AddRadioButton>
                            <S.AddRadioTitle
                              style={
                                addRepeatInput[ind].isRepeat === "count"
                                  ? { marginRight: "1rem" }
                                  : { color: "#cccccc", marginRight: "1rem" }
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
                                  addRepeatInput[ind].isAuto || el.isOne
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
                                  addRepeatInput[ind]?.isRepeat === "count"
                                    ? addRepeatInput[ind].repeatsNum
                                    : 0
                                }
                                disabled={
                                  addRepeatInput[ind].isAuto ||
                                  el.isOne ||
                                  addRepeatInput[ind]?.isRepeat !== "count"
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
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <S.AddRadioButton
                              type="radio"
                              name={"type" + ind}
                              checked={addRepeatInput[ind].isRepeat === "once"}
                              value={"once"}
                              onClick={onChangeRepeatIsRepeat(ind, "once")}
                              style={{ width: "1.25rem", height: "1.25rem" }}
                              disabled={el.isOne}
                            ></S.AddRadioButton>
                            <S.AddRadioTitle
                              style={
                                addRepeatInput[ind].isRepeat === "once"
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
                                    onClick={onClickRepeatDates(ind, index)}
                                    style={
                                      el.isOne
                                        ? { backgroundColor: "#f9f9f9" }
                                        : addRepeatInput[ind].week.includes(
                                            index
                                          )
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
                          width: "30rem",
                        }}
                      >
                        <S.AddModalTimeInput
                          type="time"
                          disabled={el.isOne}
                          style={{ marginLeft: "0.66rem" }}
                          value={addRepeatInput[ind].startTime}
                          onChange={onChangeRepeatStartTime(ind)}
                        ></S.AddModalTimeInput>
                        ~
                        <S.AddModalTimeInput
                          type="time"
                          disabled={el.isOne}
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
                            width: "29rem",
                            borderRadius: "0.5rem",
                            border: "1px solid #DBDDE1",
                          }}
                          disabled={el.isOne}
                          placeholder={"메모를 입력해주세요."}
                          value={addRepeatInput[ind].about}
                        ></S.AddModalTextArea>
                      </S.ModalInputBox>
                    </div>
                  );
                }
              })}
            </div>
          </S.ModalClassAddWrapper>

          <S.ModalButtonBox
            style={{
              width: "100%",
              justifyContent: "center",
              marginTop: "0.87rem",
            }}
          >
            <S.AddModalOKButton onClick={onClickOk}>저장</S.AddModalOKButton>
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
      {isConsulting && (
        <Modal
          open={isConsulting}
          onOk={() => {
            console.log(12345);
            setIsConsulting(false);
            setConsultingTitle("");
            setConsultingContents("");
          }}
          footer={null}
          closable={false}
          onCancel={() => {
            setIsConsulting(false);
            setConsultingTitle("");
            setConsultingContents("");
            setConsultingDate(dateToInput(date));
          }}
          width={"40.125rem"}
          style={{ padding: "0" }}
        >
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <S.ConsultingModalTitle>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: "0.62rem" }}
                >
                  <mask id="path-1-inside-1_1853_3383" fill="white">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M1 0C0.447715 0 0 0.447716 0 1V7.72727C0 8.27956 0.447715 8.72727 1 8.72727H1.88674L4.36675 12L6.84672 8.72727H11C11.5523 8.72727 12 8.27956 12 7.72727V1C12 0.447715 11.5523 0 11 0H1Z"
                    />
                  </mask>
                  <path
                    d="M1.88674 8.72727L2.92286 7.94212L2.53271 7.42727H1.88674V8.72727ZM4.36675 12L3.33063 12.7851L4.36676 14.1525L5.40287 12.7851L4.36675 12ZM6.84672 8.72727V7.42727H6.20074L5.8106 7.94213L6.84672 8.72727ZM1.3 1C1.3 1.16569 1.16569 1.3 1 1.3V-1.3C-0.270256 -1.3 -1.3 -0.270253 -1.3 1H1.3ZM1.3 7.72727V1H-1.3V7.72727H1.3ZM1 7.42727C1.16569 7.42727 1.3 7.56159 1.3 7.72727H-1.3C-1.3 8.99753 -0.270256 10.0273 1 10.0273V7.42727ZM1.88674 7.42727H1V10.0273H1.88674V7.42727ZM0.850621 9.51242L3.33063 12.7851L5.40287 11.2149L2.92286 7.94212L0.850621 9.51242ZM5.40287 12.7851L7.88285 9.51242L5.8106 7.94213L3.33063 11.2149L5.40287 12.7851ZM11 7.42727H6.84672V10.0273H11V7.42727ZM10.7 7.72727C10.7 7.56159 10.8343 7.42727 11 7.42727V10.0273C12.2703 10.0273 13.3 8.99752 13.3 7.72727H10.7ZM10.7 1V7.72727H13.3V1H10.7ZM11 1.3C10.8343 1.3 10.7 1.16568 10.7 1H13.3C13.3 -0.270254 12.2703 -1.3 11 -1.3V1.3ZM1 1.3H11V-1.3H1V1.3Z"
                    fill="#791285"
                    mask="url(#path-1-inside-1_1853_3383)"
                  />
                  <rect
                    x="2.70258"
                    y="3.6543"
                    width="1.41818"
                    height="1.41818"
                    fill="#791285"
                  />
                  <rect
                    x="7.8772"
                    y="3.6543"
                    width="1.41818"
                    height="1.41818"
                    fill="#791285"
                  />
                  <rect
                    x="5.28986"
                    y="3.6543"
                    width="1.41818"
                    height="1.41818"
                    fill="#791285"
                  />
                </svg>
                상담 추가
              </S.ConsultingModalTitle>
              <div
                style={{
                  width: "100%",
                  borderTop: "1px solid #dfe1e5",
                  margin: "1.25rem 0",
                }}
              ></div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <S.ConsultingModalTag>원생 번호</S.ConsultingModalTag>
                  <S.ConsultingModalInput
                    disabled={true}
                    value={data?.userDetails?.profile?.origin}
                  ></S.ConsultingModalInput>
                </div>
                <S.ConsultingModalBox>
                  <S.ConsultingModalTag>원생 이름</S.ConsultingModalTag>
                  <S.ConsultingModalInput
                    disabled={true}
                    value={
                      data?.userDetails?.profile?.korName +
                      " (" +
                      data?.userDetails?.profile?.engName +
                      ")"
                    }
                  ></S.ConsultingModalInput>
                </S.ConsultingModalBox>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  marginBottom: "1.25rem",
                }}
              >
                <div>
                  <S.ConsultingModalTag>상담 날짜</S.ConsultingModalTag>
                  <S.DateLabel>
                    <S.ModalBorderLess
                      style={{ width: "15rem" }}
                      type="date"
                      value={consultingDate}
                      onChange={(event) => {
                        setConsultingDate(event.target.value);
                      }}
                    ></S.ModalBorderLess>
                    <div style={{ position: "absolute", left: "9.5rem" }}>
                      {"(" + dateInputToDay(consultingDate) + ")"}
                    </div>
                  </S.DateLabel>
                  {/* <S.ConsultingModalInput
                    type="date"
                    value={consultingDate}
                    onChange={(e) => {
                      setConsultingDate(e.target.value);
                    }}
                  ></S.ConsultingModalInput> */}
                </div>
                <div>
                  <S.ConsultingModalTag>상담 시간</S.ConsultingModalTag>
                  <S.ConsultingModalInput
                    type="time"
                    // value={consultingDate}
                    defaultValue={dateToClock(new Date())}
                  ></S.ConsultingModalInput>
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <S.ConsultingModalTag>상담 선생님</S.ConsultingModalTag>
                <select
                  style={{
                    width: "36.35rem",
                    height: "2.6875rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #DFE1E5",
                    marginLeft: "0.62rem",
                    fontSize: "1rem",
                    fontFamily: "Spoqa Han Sans Neo",
                    paddingLeft: "0.62rem",
                  }}
                  onChange={(event) => {
                    setConsultingTeacherId(event.target.value);
                  }}
                  value={teacherId}
                >
                  {userData?.allUsers
                    .filter((el) => el.userCategory === "선생님")
                    ?.filter((el) => {
                      return (
                        Number(el?.profile?.academy?.id) ===
                        Number(router.query.branch)
                      );
                    })
                    .map((el) => {
                      return (
                        <option
                          key={uuidv4()}
                          value={el.profile.id}
                          selected={
                            Number(el.profile.id) ===
                            Number(consultingTeacherId)
                          }
                        >
                          {el.profile.korName}
                        </option>
                      );
                    })}
                </select>
              </div>

              <div>
                <S.ConsultingModalTag>제목</S.ConsultingModalTag>
                <S.ConsultingModalBigInput
                  onChange={(e) => {
                    setConsultingTitle(e.target.value);
                  }}
                  value={consultingTitle}
                ></S.ConsultingModalBigInput>
              </div>

              <div style={{ marginTop: "1.25rem" }}>
                <S.ConsultingModalTag>내용</S.ConsultingModalTag>
                <S.ConsultingModalTextArea
                  style={{ whiteSpace: "break-spaces" }}
                  onChange={(e) => {
                    setConsultingContents(e.target.value);
                  }}
                  value={consultingContents}
                  maxLength={2000}
                ></S.ConsultingModalTextArea>
                <S.ConsultingLength
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {consultingContents.length + " / 2000자"}
                </S.ConsultingLength>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                borderTop: "1px solid #dfe1e5",
                marginTop: "1.25rem",
              }}
            ></div>
            <div
              style={{
                marginTop: "0.88rem",
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <S.ConsultingModalOKButton onClick={onClickCreateConSulting()}>
                저장
              </S.ConsultingModalOKButton>
              <S.ConsultingModalCancelButton
                onClick={() => {
                  setIsConsulting(false);
                  setConsultingTitle("");
                  setConsultingContents("");
                  setConsultingDate(dateToInput(date));
                }}
              >
                취소
              </S.ConsultingModalCancelButton>
            </div>
          </div>
        </Modal>
      )}
      {isDelete && (
        <Modal
          open={isDelete}
          footer={null}
          closable={false}
          onCancel={() => {
            setIsDelete(false);
          }}
        >
          <S.ConsultingModalTitle>
            <svg
              width="12"
              height="15"
              viewBox="0 0 12 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "0.62rem" }}
            >
              <path
                d="M12 0.820312V2.5H0V0.820312H2.97987L3.86577 0H8.13423L9.02013 0.820312H12ZM0.845638 13.3203V3.32031H11.1544V13.3203C11.1544 13.763 10.9799 14.1536 10.6309 14.4922C10.2819 14.8307 9.87919 15 9.42282 15H2.57718C2.12081 15 1.71812 14.8307 1.36913 14.4922C1.02013 14.1536 0.845638 13.763 0.845638 13.3203Z"
                fill="#791285"
              />
            </svg>
            상담 삭제
          </S.ConsultingModalTitle>
          <div
            style={{
              width: "100%",
              borderTop: "1px solid #dfe1e5",
              margin: "1.25rem 0",
            }}
          ></div>
          <div
            style={{
              fontSize: "1rem",
              fontFamily: "Spoqa Han Sans Neo",
            }}
          >
            {1 +
              selectIndex +
              ", 원생 번호 " +
              data?.userDetails?.profile?.korName +
              " (" +
              data?.userDetails?.profile?.engName +
              ") 의 상담을 삭제하시겠습니까?"}
          </div>
          <div
            style={{
              width: "100%",
              borderTop: "1px solid #dfe1e5",
              margin: "1.25rem 0",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <S.ConsultingModalOKButton onClick={onClickConSultingDelete}>
              삭제
            </S.ConsultingModalOKButton>
            <S.ConsultingModalCancelButton
              onClick={() => {
                setIsDelete(false);
              }}
            >
              취소
            </S.ConsultingModalCancelButton>
          </div>
        </Modal>
      )}
      {isConsultingEdit && (
        <Modal
          open={isConsultingEdit}
          footer={null}
          closable={false}
          onCancel={() => {
            setIsConsultingEdit(false);
          }}
          width={"40.125rem"}
        >
          <S.ConsultingModalTitle>
            <svg
              style={{ marginRight: "0.62rem" }}
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.8125 2.6875L10.5938 3.90625L8.09375 1.40625L9.3125 0.1875C9.4375 0.0625 9.59375 0 9.78125 0C9.96875 0 10.125 0.0625 10.25 0.1875L11.8125 1.75C11.9375 1.875 12 2.03125 12 2.21875C12 2.40625 11.9375 2.5625 11.8125 2.6875ZM0 9.5L7.375 2.125L9.875 4.625L2.5 12H0V9.5Z"
                fill="#791285"
              />
            </svg>
            상담 수정
          </S.ConsultingModalTitle>

          <div
            style={{
              width: "100%",
              borderTop: "1px solid #dfe1e5",
              margin: "1.25rem 0",
            }}
          ></div>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <S.ConsultingModalTag>원생 번호</S.ConsultingModalTag>
              <S.ConsultingModalInput
                disabled={true}
                value={data?.userDetails?.profile?.origin}
              ></S.ConsultingModalInput>
            </div>
            <S.ConsultingModalBox>
              <S.ConsultingModalTag>원생 이름</S.ConsultingModalTag>
              <S.ConsultingModalInput
                disabled={true}
                value={
                  data?.userDetails?.profile?.korName +
                  " (" +
                  data?.userDetails?.profile?.engName +
                  ")"
                }
              ></S.ConsultingModalInput>
            </S.ConsultingModalBox>
          </div>

          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
              marginBottom: "1.25rem",
            }}
          >
            <div>
              <S.ConsultingModalTag>상담 날짜</S.ConsultingModalTag>
              <S.DateLabel>
                <S.ModalBorderLess
                  style={{ width: "15rem" }}
                  type="date"
                  value={editDate}
                  onChange={(event) => {
                    setEditDate(event.target.value);
                  }}
                ></S.ModalBorderLess>
                <div style={{ position: "absolute", left: "9.5rem" }}>
                  {"(" + dateInputToDay(editDate) + ")"}
                </div>
              </S.DateLabel>
              {/* <S.ConsultingModalInput
                type="date"
                value={editDate}
                onChange={(e) => {
                  setEditDate(e.target.value);
                }}
              ></S.ConsultingModalInput> */}
            </div>
            <div>
              <S.ConsultingModalTag>상담 시간</S.ConsultingModalTag>
              <S.ConsultingModalInput
                type="time"
                // value={consultingDate}
                defaultValue={dateToClock(new Date())}
              ></S.ConsultingModalInput>
            </div>
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <S.ConsultingModalTag>상담 선생님</S.ConsultingModalTag>
            <select
              style={{
                width: "36.35rem",
                height: "2.6875rem",
                borderRadius: "0.5rem",
                border: "1px solid #DFE1E5",
                marginLeft: "0.62rem",
                fontSize: "1rem",
                fontFamily: "Spoqa Han Sans Neo",
                paddingLeft: "0.62rem",
              }}
              onChange={(event) => {
                setConsultingTeacherId(event.target.value);
              }}
              value={teacherId}
            >
              {userData?.allUsers
                .filter((el) => el.userCategory === "선생님")
                ?.filter((el) => {
                  return (
                    Number(el?.profile?.academy?.id) ===
                    Number(router.query.branch)
                  );
                })
                .map((el) => {
                  return (
                    <option
                      key={uuidv4()}
                      value={el.profile.id}
                      selected={
                        Number(el.profile.id) === Number(consultingTeacherId)
                      }
                    >
                      {el.profile.korName}
                    </option>
                  );
                })}
            </select>
          </div>

          <div>
            <S.ConsultingModalTag>제목</S.ConsultingModalTag>
            <S.ConsultingModalBigInput
              onChange={(e) => {
                setEditTitle(e.target.value);
              }}
              value={editTitle}
            ></S.ConsultingModalBigInput>
          </div>

          <div style={{ marginTop: "1.25rem" }}>
            <S.ConsultingModalTag>내용</S.ConsultingModalTag>
            <S.ConsultingModalTextArea
              style={{ whiteSpace: "break-spaces" }}
              onChange={(e) => {
                setEditContents(e.target.value);
              }}
              value={editContents}
              maxLength={2000}
            ></S.ConsultingModalTextArea>
            <S.ConsultingLength
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {consultingContents.length + " / 2000자"}
            </S.ConsultingLength>
          </div>

          {/* <div>상담을 수정하시겠습니까?</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>제목</div>
            <input
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
              }}
            ></input>
            <div>내용</div>
            <div style={{ border: "1px solid" }}>
              <S.ConsultingTextArea
                value={editContents}
                onChange={(e) => {
                  setEditContents(e.target.value);
                }}
                style={{ whiteSpace: "break-spaces" }}
                maxLength={2000}
              ></S.ConsultingTextArea>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                {editContents.length + "/2000"}
              </div>
            </div>
            <div>날짜</div>
            <input
              type="date"
              value={editDate}
              onChange={(e) => {
                setEditDate(e.target.value);
              }}
            ></input>
          </div> */}

          <div
            style={{
              width: "100%",
              borderTop: "1px solid #dfe1e5",
              margin: "1.25rem 0",
            }}
          ></div>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <S.ConsultingModalOKButton onClick={onClickConSultingEdit}>
              저장
            </S.ConsultingModalOKButton>
            <S.ConsultingModalCancelButton
              onClick={() => {
                setIsConsultingEdit(false);
              }}
            >
              취소
            </S.ConsultingModalCancelButton>
          </div>
        </Modal>
      )}
      {stopToggle && (
        <Modal
          open={stopToggle}
          footer={null}
          closable={false}
          onCancel={() => {
            setStopToggle(false);
          }}
        >
          {isActive ? (
            <div>
              <div>휴원 처리하시겠습니까?</div>
              <div>휴원으로 변경하면 휴원일 이후 모든 수업이 삭제됩니다.</div>
              <span>휴원일</span>
              <input
                type="date"
                value={deleteDate}
                onChange={(e) => {
                  setDeleteDate(e.target.value);
                }}
              ></input>
            </div>
          ) : (
            <div>재원 처리하시겠습니까?</div>
          )}
          <div>
            <button
              onClick={() => {
                setStopToggle(false);
              }}
            >
              취소
            </button>
            <button
              onClick={() => {
                setStopToggle(false);
                onClickCheck();
              }}
            >
              확인
            </button>
          </div>
        </Modal>
      )}
      <div
        style={{
          width: "90rem",
          borderTop: "1px solid #dfe1e5",
          margin: " 2.5rem 0",
        }}
      ></div>
    </S.AcademyDetailWrapper>
  );
}
