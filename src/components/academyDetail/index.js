import { EditOutlined, FormOutlined } from "@ant-design/icons";
import * as S from "./academyDetail.style";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Modal, TimePicker } from "antd";
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
} from "./academyDetail.query";
import {
  calculateLectureDate,
  dateInputToNumber,
  dateToClock,
  dateToClockOneHour,
  dateToInput,
  lastCount,
  lastDate,
  startDate,
} from "@/src/commons/library/library";
import { ConsultingTable } from "@/src/commons/library/academyDetailTable";

const addressList = ["gmail.com", "naver.com", "daum.net"];
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
  const { data: myData } = useQuery(GET_ME);
  const { data: consultingData, refetch: refetchConsulting } = useQuery(
    GET_CONSULTING,
    {
      variables: {
        studentId: Number(router.query.id),
        userId: Number(myData?.me?.id),
      },
    }
  );
  const [editStudent] = useMutation(EDIT_STUDENT);
  const [editUser] = useMutation(EDIT_USER);
  const [addMemo] = useMutation(ADD_MEMO);
  const [createMakeUp] = useMutation(CREATE_MAKE_UP);
  const [editLectureMemo] = useMutation(CREATE_MEMO);
  const [stopAcademy] = useMutation(STOP_ACADEMY);
  const [updateLecture] = useMutation(UPDATE_LECTURE);
  const [addAcademyUser] = useMutation(CREATE_ACADEMY_TO_USER);
  const [editUserAcademy] = useMutation(EDIT_ACADEMY_LIST);
  const [createConsulting] = useMutation(CREATE_CONSULTING);
  const [deleteConsulting] = useMutation(DELETE_CONSULTING);
  const [updateConsulting] = useMutation(UPDATE_CONSULTING);
  const [editEngName, setEditEngName] = useState("");
  const [editBirthDay, setEditBirthDay] = useState("");
  const [editMobileNumber1, setEditMobileNumber1] = useState("");
  const [editMobileNumber2, setEditMobileNumber2] = useState("");
  const [editMobileNumber3, setEditMobileNumber3] = useState("");
  const [editPMobileNumber1, setEditPMobileNumber1] = useState("");
  const [editPMobileNumber2, setEditPMobileNumber2] = useState("");
  const [editPMobileNumber3, setEditPMobileNumber3] = useState("");
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

  const onClickEditDates = (index) => () => {
    const newDates = [...editRepeatWeek];
    if (newDates.includes(index)) {
      setEditRepeatWeek(newDates.filter((el) => index !== el));
    } else {
      newDates.push(index);
      setEditRepeatWeek(newDates);
    }
  };

  const onClickOpenEditModal = (el) => () => {
    const setting = lectureInfoData?.studentLectures?.filter((ele) => {
      return ele?.lecture?.id === el.id;
    })?.[0];
    console.log(setting);
    setIsAll(false);
    setTodayDate(new Date());
    setIsEdit(true);
    setEditLectureInfoId(el?.lectureInfo?.id);
    setEditLectureId(el?.id);

    setIsEditAuto(setting?.lecture?.lectureInfo?.autoAdd);
    setIsEditRepeat(
      setting?.lecture?.lectureInfo.repeatDay.includes(-1)
        ? "once"
        : setting?.lecture?.lectureInfo.repeatTimes === null
        ? "routine"
        : "count"
    );
    setEditDate(setting?.lecture?.date);
    setStandardDate(setting?.lecture?.date);
    setEditStartTime(setting?.lecture?.startTime);
    setEditEndTime(setting?.lecture?.endTime);
    setEditInfo(setting?.lecture?.lectureInfo.about);
    if (!setting?.lecture?.lectureInfo.repeatDay.includes(-1)) {
      setEditRepeatWeek(setting?.lecture?.lectureInfo.repeatDay);
      setEditRepeatCount(setting?.lecture?.lectureInfo.repeatWeeks);
    } else {
      setEditRepeatCount(1);
      setEditRepeatWeek([]);
    }
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

  const [lectureId, setLectureId] = useState(0);
  const [branches, setBranches] = useState([]);
  const [listDate, setListDate] = useState(dateToInput(new Date()));
  const [isTyped, setIsTyped] = useState(false);
  const [lectureList, setLectureList] = useState([]);
  const [consultingList, setConsultingList] = useState([]);

  // 상담 state
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultingTitle, setConsultingTitle] = useState("");
  const [consultingContents, setConsultingContents] = useState("");
  const [consultingDate, setConsultingDate] = useState(dateToInput(date));
  const [isDelete, setIsDelete] = useState(false);
  const [isConsultingEdit, setIsConsultingEdit] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContents, setEditContents] = useState("");
  const [consultingEditDate, setConsultingEditDate] = useState(
    dateToInput(new Date())
  );

  const onClickOpenDeleteModal = (id) => () => {
    setIsDelete(true);
    setSelectId(id);
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
          writerId: Number(myData?.me.id),
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
    router.push("/" + router.query.branch + "/" + address);
  };
  const onClickClassToggle = (id) => () => {
    setMakeUpLectureId(id);
    setClassToggle(true);
  };

  const onClickOk = () => {
    const now = new Date();
    const dates = [];
    for (let i = 0; i < routineCount; i++) {
      for (let j = 0; j < 7; j++) {
        const newDates = new Date();
        newDates.setDate(now.getDate() + j + i * 7);
        if (selectDates.includes(newDates.getDay())) {
          dates.push(newDates);
        }
      }
    }
    setClassToggle(false);
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
    setClassToggle(false);
  };

  // 상당 정보 useEffect

  useEffect(() => {
    if (consultingData === undefined) {
      setConsultingList([]);
    } else {
      setConsultingList(consultingData?.getConsulting);
    }
  }, [consultingData]);

  useEffect(() => {
    if (data) {
      setLecturePageNum(0);
      const [mondayDate, sunDayDate] = calculateLectureDate(listDate);
      console.log(mondayDate, sunDayDate, "계산");
      const newLectureList = data?.userDetails?.profile?.lectures?.filter(
        (el) => {
          const start = new Date(mondayDate);
          const end = new Date(sunDayDate);
          const k = new Date(el.date);
          return k - start >= 0 && end - k >= 0;
        }
      );
      setLectureMaxNum(
        Math.ceil(
          data?.userDetails?.profile?.lectures?.filter((el) => {
            const start = new Date(mondayDate);
            const end = new Date(sunDayDate);
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
  }, [data, listDate]);

  useEffect(() => {
    setBranches(
      data?.userDetails?.profile?.academies?.map((el) => {
        return el.id;
      })
    );
  }, [data]);

  const onClickCheck = (id, active) => async () => {
    // setIsCheck(true);
    try {
      await stopAcademy({ variables: { userId: Number(router.query.id) } });
    } catch (err) {
      console.log(err);
    }
  };

  const onClickAddBranchList = (id) => () => {
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

  const onClickImageURL = (event) => {
    setImageFile(event.target.files[0]);
    let reader = new FileReader();
    reader.onload = function (event) {
      setImageURL(event.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
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
      await createMakeUp({
        variables: {
          lectureId: Number(makeUpLectureId),
          date: addClassDate,
          startTime: addClassStart,
          endTime: addClassEnd,
          lectureInfo: addClassInfo,
          teacherId: Number(teacherId),
          studentIds: [Number(router.query.id)],
        },
      });
    } catch (err) {
      alert(err);
    }

    refetch();
    refetchUsers();
    refetchStudents();
    setClassToggle(false);
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
          writerId: Number(myData?.me?.id),
          studentId: Number(router.query.id),
          createdAt: consultingDate,
        },
      });
      setIsConsulting(false);
      setConsultingTitle("");
      setConsultingContents("");
      refetchConsulting();
    } catch (err) {}
  };

  return (
    <S.AcademyDetailWrapper>
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
      <S.AcademyDetailTitle>
        <S.BackButton onClick={onClickRouter("academy")}></S.BackButton>
        원생 정보 상세보기
      </S.AcademyDetailTitle>
      <S.EditBox>
        {/* <S.ImageBox>
          {imageURL !== "" ? (
            <img src={imageURL} width={"200px"} height={"200px"}></img>
          ) : (
            <img src="/sample.png" width={"200px"} height={"200px"}></img>
          )}

          <input type="file" onChange={onClickImageURL}></input>
        </S.ImageBox> */}
        <S.InputBox>
          <S.TagLine>
            <S.InputTag>
              <S.InputName>이름</S.InputName>
              <S.InputInput
                value={data?.userDetails?.profile.korName}
              ></S.InputInput>
            </S.InputTag>
            <S.InputTag>
              <S.InputName>영어 이름</S.InputName>
              <S.InputInput
                defaultValue={data?.userDetails?.profile.engName}
                onChange={(e) => {
                  setEditEngName(e.target.value);
                }}
              ></S.InputInput>
            </S.InputTag>
          </S.TagLine>
          <S.TagLine>
            <S.InputTag>
              <S.InputName>학부모 전화번호</S.InputName>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <S.InputPhoneInput
                  onChange={(e) => {
                    setEditPMobileNumber1(e.target.value);
                  }}
                  value={editPMobileNumber1}
                ></S.InputPhoneInput>
                {"-"}
                <S.InputPhoneInput
                  onChange={(e) => {
                    setEditPMobileNumber2(e.target.value);
                  }}
                  value={editPMobileNumber2}
                ></S.InputPhoneInput>
                {"-"}
                <S.InputPhoneInput
                  onChange={(e) => {
                    setEditPMobileNumber3(e.target.value);
                  }}
                  value={editPMobileNumber3}
                ></S.InputPhoneInput>
              </div>
            </S.InputTag>
            <S.InputTag>
              <S.InputName>연락처</S.InputName>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <S.InputPhoneInput
                  onChange={(e) => {
                    setEditMobileNumber1(e.target.value);
                  }}
                  value={editMobileNumber1}
                ></S.InputPhoneInput>
                {"-"}
                <S.InputPhoneInput
                  onChange={(e) => {
                    setEditMobileNumber2(e.target.value);
                  }}
                  value={editMobileNumber2}
                ></S.InputPhoneInput>
                {"-"}
                <S.InputPhoneInput
                  onChange={(e) => {
                    setEditMobileNumber3(e.target.value);
                  }}
                  value={editMobileNumber3}
                ></S.InputPhoneInput>
              </div>
            </S.InputTag>
          </S.TagLine>
          <S.TagLine>
            <S.InputTag>
              <S.InputName>원번</S.InputName>
              <S.InputInput
                value={data?.userDetails?.profile?.origin}
                disabled={true}
              ></S.InputInput>
            </S.InputTag>
            <S.InputTag>
              <S.InputName>이메일</S.InputName>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <S.InputPhoneInput
                  onChange={(e) => {
                    setEditEmail1(e.target.value);
                  }}
                  value={editEmail1}
                ></S.InputPhoneInput>
                <div>{" @ "}</div>
                <S.InputPhoneInput
                  onChange={(e) => {
                    setEditEmail2(e.target.value);
                  }}
                  disabled={!isTyped}
                  value={editEmail2}
                ></S.InputPhoneInput>
                <div>{}</div>
                <select
                  style={{
                    padding: "0.81rem 1.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #dbdde1",
                    width: "calc(25% - 1rem)",
                    color: "#333",
                  }}
                  onChange={(e) => {
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
          </S.TagLine>
          <S.TagLine>
            <S.InputTag>
              <S.InputName>등록일</S.InputName>
              <S.InputInput
                type="date"
                value={editRegisterDate}
                onChange={(e) => {
                  setEditRegisterDate(e.target.value);
                }}
                // disabled={true}
              ></S.InputInput>
            </S.InputTag>
            <S.InputTag>
              <S.InputName>생년월일</S.InputName>
              <S.InputInput
                type="date"
                defaultValue={data?.userDetails?.profile.birthDate}
                onChange={(e) => {
                  setEditBirthDay(e.target.value);
                }}
              ></S.InputInput>
            </S.InputTag>
          </S.TagLine>
          <S.TagLine>
            <S.InputTag>
              <S.InputName>성별</S.InputName>
              <div style={{ width: "10vw" }}>
                남{" "}
                <input
                  type="radio"
                  name="gender"
                  value={"M"}
                  checked={editGender === "M"}
                  onClick={(e) => {
                    setEditGender(e.target.value);
                  }}
                ></input>{" "}
                여{" "}
                <input
                  type="radio"
                  name="gender"
                  value={"W"}
                  checked={editGender === "W"}
                  onClick={(e) => {
                    setEditGender(e.target.value);
                  }}
                ></input>
              </div>
            </S.InputTag>
            <S.InputTag>
              {myData?.me?.profile?.academies?.length > 0 ? (
                <>
                  <S.EditModalTagTitle>담당 지점</S.EditModalTagTitle>
                  <div style={{ display: "flex" }}>
                    {myData?.me?.profile?.academies?.map((el) => {
                      return (
                        <S.InputTag>
                          <S.InputName
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            {el.location}
                            <input
                              type="checkbox"
                              style={{ width: "20px", height: "20px" }}
                              onClick={onClickAddBranchList(el.id)}
                              checked={
                                branches?.filter((ele) => {
                                  return el.id === ele;
                                }).length === 1
                              }
                            ></input>
                          </S.InputName>
                        </S.InputTag>
                      );
                    })}
                  </div>
                </>
              ) : (
                <></>
              )}
            </S.InputTag>
          </S.TagLine>

          <S.InputTag style={{ width: "100%" }}>
            <S.InputName>메모</S.InputName>
            <textarea
              style={{
                width: "100%",
                height: "8rem",
                fontSize: "15px",
                resize: "none",
                fontWeight: "300",
                borderRadius: "0.5rem",
                border: "1px solid #dbdde1",
                fontFamily: "Spoqa Han Sans Neo",
              }}
              onChange={(e) => {
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
      <S.ButtonBox>
        <S.RouteButton
          onClick={onClickCheck(
            data?.userDetails?.id,
            data?.userDetails?.isActive
          )}
        >
          {data?.userDetails?.isActive ? "휴원 처리" : "휴원 취소"}
        </S.RouteButton>

        <S.RouteButton onClick={onClickEdit}>수정 완료</S.RouteButton>
      </S.ButtonBox>

      <S.Box>수업 정보</S.Box>
      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
      >
        <input
          type="date"
          value={listDate}
          onChange={(e) => {
            setListDate(e.target.value);
          }}
        ></input>
      </div>
      <S.Table>
        {lectureList.length !== 0 && (
          <S.TableHeaderRound>
            <S.TableHeadLeft style={{ width: "70%" }}>
              수업 날짜
            </S.TableHeadLeft>
            <S.TableHead style={{ width: "70%" }}>수업 시간</S.TableHead>
            <S.TableHead style={{ width: "40%" }}>담당</S.TableHead>
            <S.TableHead style={{ width: "30%" }}>출석현황</S.TableHead>
            <S.TableHead>강의 정보</S.TableHead>
            <S.TableHead style={{ width: "30%" }}>원생 메모</S.TableHead>
            <S.TableHead style={{ width: "30%" }}>수업 수정</S.TableHead>
            <S.TableHead style={{ width: "30%" }}>보강 학습 추가</S.TableHead>
          </S.TableHeaderRound>
        )}
        {lectureList
          ?.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA - dateB;
          })
          ?.sort((a, b) => {
            if (
              a.attendanceStatus?.statusDisplay === "결석" &&
              b.attendanceStatus?.statusDisplay !== "결석"
            ) {
              return -1;
            } else {
              return 1;
            }
          })
          ?.filter((_, index) => {
            return (
              index >= lecturePage * lecturePageNum &&
              index < lecturePage * (lecturePageNum + 1)
            );
          })
          ?.map((el) => {
            return (
              <S.TableRound key={uuidv4()}>
                <S.TableHeadLeft style={{ width: "70%" }}>
                  {el.date}
                </S.TableHeadLeft>
                <S.TableHead style={{ width: "70%" }}>
                  {el.startTime.slice(0, 5) + "~" + el.endTime.slice(0, 5)}
                </S.TableHead>
                <S.TableHead style={{ width: "40%" }}>
                  {el.teacher.engName}
                </S.TableHead>
                <S.TableHead style={{ width: "30%" }}>
                  {el.attendanceStatus?.statusDisplay}
                </S.TableHead>
                <S.TableHead>
                  {el?.lectureMemo === ""
                    ? el?.lectureInfo?.about
                    : el?.lectureMemo}
                </S.TableHead>
                <S.TableHead style={{ width: "30%" }}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={onClickViewMemo(Number(router.query.id), el.id)}
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
                  </svg>
                </S.TableHead>
                <S.TableHead style={{ width: "30%" }}>
                  <EditOutlined onClick={onClickOpenEditModal(el)} />
                </S.TableHead>
                <S.TableHead style={{ width: "30%" }}>
                  {el.attendanceStatus?.statusDisplay === "결석" ? (
                    <FormOutlined onClick={onClickClassToggle(el.id)} />
                  ) : (
                    <></>
                  )}
                </S.TableHead>
              </S.TableRound>
            );
          })}
      </S.Table>
      <div style={{ display: "flex" }}>
        {Array(lectureMaxNum)
          .fill(0)
          .map((_, index) => (
            <div
              onClick={() => {
                setLecturePageNum(index);
              }}
              style={
                lecturePageNum === index
                  ? {
                      color: "#fff",
                      background: "#111",
                      width: "1rem",
                      display: "flex",
                      justifyContent: "center",
                    }
                  : { width: "1rem", display: "flex", justifyContent: "center" }
              }
            >
              {index + 1}
            </div>
          ))}
      </div>
      <S.Box>상담 정보</S.Box>
      <div>
        <button
          onClick={() => {
            setIsConsulting(true);
          }}
        >
          상담 추가
        </button>
      </div>
      {consultingList.length !== 0 && (
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>원번</th>
              <th>학생 이름</th>
              <th>학부모 전화번호</th>
              <th>제목</th>
              <th>내용</th>
              <th>상담 등록일</th>
              <th>수정/삭제</th>
            </tr>
          </thead>
          <tbody>
            {consultingList?.map((el, index) => {
              return (
                <ConsultingTable
                  el={el}
                  index={index}
                  openEdit={onClickOpenEditConsultingModal}
                  openDelete={onClickOpenDeleteModal}
                ></ConsultingTable>
              );
            })}
          </tbody>
        </table>
      )}
      {classToggle ? (
        <Modal
          closable={false}
          open={classToggle}
          width={"55vw"}
          height={"50vh"}
          onCancel={() => {
            setClassToggle(false);
          }}
          footer={null}
        >
          <S.ClassTitle>{"수업 보강"}</S.ClassTitle>
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
            </S.ModalInputBox>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <S.InputInput
                type="date"
                defaultValue={dateToInput(date)}
                style={{ width: "50%" }}
                onChange={(event) => {
                  setAddClassDate(event.target.value);
                }}
              ></S.InputInput>
            </div>
            <S.ModalInputBox>
              <div>수업 시간</div>
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
          <S.ModalButtonBox>
            <S.ModalCancelButton onClick={onClickCancel}>
              취소
            </S.ModalCancelButton>
            <S.ModalOkButton onClick={onClickMakeUpClass}>저장</S.ModalOkButton>
          </S.ModalButtonBox>
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
              {data?.userDetails?.profile?.korName} 강의 메모
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
              </div>
              <div>
                <S.ModalOkButton2 onClick={onClickEditMemo}>
                  수정
                </S.ModalOkButton2>
                <S.ModalCancelButton2
                  onClick={() => {
                    setIsMemo(false);
                  }}
                  style={{ background: "#EBECEF", color: "#000" }}
                >
                  닫기
                </S.ModalCancelButton2>
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
                                    Number(editLectureInfoId)
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
                                    (el?.lecture?.lectureInfo?.repeatTimes ===
                                    null
                                      ? lastDate(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatWeeks,
                                          el?.lecture?.lectureInfo?.repeatDay
                                        )
                                      : lastCount(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatTimes,
                                          el?.lecture?.lectureInfo?.repeatDay
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
                            Number(editLectureInfoId)
                          ) {
                            return (
                              <tr>
                                <td
                                  style={{
                                    color:
                                      Number(el?.lecture?.lectureInfo?.id) ===
                                      Number(editLectureInfoId)
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
                                      ? startDate(editDate, editRepeatWeek) +
                                        (isEditRepeat === "once"
                                          ? ""
                                          : "~" +
                                            (isEditRepeat === "routine"
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
                                      Number(el?.lecture?.lectureInfo?.id) ===
                                      Number(editLectureInfoId)
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
                                      (el?.lecture?.lectureInfo?.repeatTimes ===
                                      null
                                        ? lastDate(
                                            el?.lecture?.date,
                                            el?.lecture?.lectureInfo
                                              ?.repeatWeeks,
                                            el?.lecture?.lectureInfo?.repeatDay
                                          )
                                        : lastCount(
                                            el?.lecture?.date,
                                            el?.lecture?.lectureInfo
                                              ?.repeatTimes,
                                            el?.lecture?.lectureInfo?.repeatDay
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
                                    Number(editLectureInfoId)
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
                                    (el?.lecture?.lectureInfo?.repeatTimes ===
                                    null
                                      ? lastDate(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatWeeks,
                                          el?.lecture?.lectureInfo?.repeatDay
                                        )
                                      : lastCount(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatTimes,
                                          el?.lecture?.lectureInfo?.repeatDay
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
                                    (el?.lecture?.lectureInfo?.repeatTimes ===
                                    null
                                      ? lastDate(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatWeeks,
                                          el?.lecture?.lectureInfo?.repeatDay
                                        )
                                      : lastCount(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatTimes,
                                          el?.lecture?.lectureInfo?.repeatDay
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
                          {isEditRepeat === "routine" ? "반복 주" : "반복 횟수"}
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
                          <span style={{ marginLeft: "1rem" }}>자동 추가</span>
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
                          } else if (Number(b.id) === Number(myData.me.id)) {
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
        >
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "20rem",
              }}
            >
              <span>제목</span>
              <input
                onChange={(e) => {
                  setConsultingTitle(e.target.value);
                }}
                value={consultingTitle}
              ></input>
              <span>내용</span>
              <input
                onChange={(e) => {
                  setConsultingContents(e.target.value);
                }}
                value={consultingContents}
              ></input>
              <span>날짜</span>
              <input
                type="date"
                value={dateToInput(date)}
                onChange={(e) => {
                  setConsultingDate(e.target.value);
                }}
              ></input>
            </div>
            <div>
              <button
                onClick={() => {
                  setIsConsulting(false);
                  setConsultingTitle("");
                  setConsultingContents("");
                  setConsultingDate(dateToInput(date));
                }}
              >
                취소
              </button>
              <button onClick={onClickCreateConSulting()}>저장</button>
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
          <div>상담을 삭제하시겠습니까?</div>
          <div>
            <button
              onClick={() => {
                setIsDelete(false);
              }}
            >
              취소
            </button>
            <button onClick={onClickConSultingDelete}>삭제</button>
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
        >
          <div>상담을 수정하시겠습니까?</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>제목</div>
            <input
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
              }}
            ></input>
            <div>내용</div>
            <input
              value={editContents}
              onChange={(e) => {
                setEditContents(e.target.value);
              }}
            ></input>
            <div>날짜</div>
            <input
              type="date"
              value={editDate}
              onChange={(e) => {
                setEditDate(e.target.value);
              }}
            ></input>
          </div>
          <div>
            <button
              onClick={() => {
                setIsConsultingEdit(false);
              }}
            >
              취소
            </button>
            <button onClick={onClickConSultingEdit}>수정</button>
          </div>
        </Modal>
      )}
    </S.AcademyDetailWrapper>
  );
}
