import { useRouter } from "next/router";
import * as S from "./academy.style";
import {
  SearchOutlined,
  FormOutlined,
  UpOutlined,
  DownOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery } from "@apollo/client";
import {
  dateChange,
  dateInputToDot,
  dateToClock,
  dateToInput,
} from "@/src/commons/library/library";
import {
  CREATE_ACADEMY_TO_USER,
  CREATE_STUDENT_PROFILE,
  CREATE_USER,
  GET_ME,
  GET_STUDENTS,
  STOP_ACADEMY,
  GET_STUDENTS_REPORT_LIST,
  GET_TEACHER,
  CREATE_CONSULTING,
  DELETE_LECTURE_INFO,
} from "./academy.query";
import { Modal, Switch } from "antd";
import CheckToolTip from "@/src/commons/library/tooltipcheck";
import TooltipButton from "@/src/commons/library/buttonTooltip";
import CheckToolTipClass from "@/src/commons/library/tooltipcheckClass";

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

export default function AcademyPage() {
  const router = useRouter();
  const { data, refetch } = useQuery(GET_STUDENTS, {
    variables: { academyId: Number(router.query.branch) },
  });
  const { data: listData, refetch: refetchList } = useQuery(
    GET_STUDENTS_REPORT_LIST,
    {
      variables: { academyId: Number(router.query.branch) },
    }
  );
  const { data: teacherData } = useQuery(GET_TEACHER, {
    variables: { academyId: Number(router.query.branch) },
  });

  const [array, setArray] = useState(data?.studentsInAcademy);
  const [searchWord, setSearchWord] = useState("");
  const [addToggle, setAddToggle] = useState(false);
  const [date] = useState(new Date());
  const [addId, setAddId] = useState("");
  const [addKorName, setAddKorName] = useState("");
  const [addEmail1, setAddEmail1] = useState("");
  const [addEmail2, setAddEmail2] = useState("gmail.com");
  const [isTyped, setIsTyped] = useState(false);
  const [password, setPassword] = useState("");
  const [addEngName, setAddEngName] = useState("");
  const [addGender, setAddGender] = useState("M");
  const [addMobileNumber1, setAddMobileNumber1] = useState("010");
  const [addMobileNumber2, setAddMobileNumber2] = useState("");
  const [addMobileNumber3, setAddMobileNumber3] = useState("");
  const [isAddMobileNumber, setIsAddMobileNumber] = useState(false);
  const [addPMobileNumber1, setAddPMobileNumber1] = useState("010");
  const [addPMobileNumber2, setAddPMobileNumber2] = useState("");
  const [addPMobileNumber3, setAddPMobileNumber3] = useState("");
  const [isAddPMobileNumber, setIsAddPMobileNumber] = useState(false);
  const [addBirthDay, setAddBirthDay] = useState(dateToInput(date));
  const [addRegisterDay, setAddRegisterDay] = useState(dateToInput(date));
  const [addOrigin, setAddOrigin] = useState("");
  const [sortType, setSortType] = useState("name");
  const [createUser] = useMutation(CREATE_USER);
  const [createProfile] = useMutation(CREATE_STUDENT_PROFILE);
  const [addUserToAcademy] = useMutation(CREATE_ACADEMY_TO_USER);
  const [stopAcademy] = useMutation(STOP_ACADEMY);
  const mobileNumber2 = useRef();
  const mobileNumber3 = useRef();
  const pMobileNumber2 = useRef();
  const pMobileNumber3 = useRef();
  const [selectId, setSelectId] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [stopType, setStopType] = useState("start");
  const [branches, setBranches] = useState([]);
  const [academyPage, setAcademyPage] = useState(0);
  const [maxAcademyPage, setMaxAcademyPage] = useState(1);
  // 상담 추가
  const [isConsulting, setIsConsulting] = useState(false);
  const [consultingTitle, setConsultingTitle] = useState("");
  const [consultingContents, setConsultingContents] = useState("");
  const [consultingDate, setConsultingDate] = useState(dateToInput(date));
  const [consultingTeacherId, setConsultingTeacherId] = useState("");
  const [consultingStudent, setConsultingStudent] = useState("");
  const [deleteStudent, setDeleteStudent] = useState("");
  const [deleteDate, setDeleteDate] = useState(dateToInput(new Date()));
  const [createConsulting] = useMutation(CREATE_CONSULTING);
  const [deleteLectureInfo] = useMutation(DELETE_LECTURE_INFO);

  const onClickCreateConSulting = () => async () => {
    try {
      await createConsulting({
        variables: {
          title: consultingTitle,
          contents: consultingContents,
          writerId: Number(consultingTeacherId),
          studentId: Number(consultingStudent?.student?.id),
          createdAt: consultingDate,
        },
      });
      setIsConsulting(false);
      setConsultingTitle("");
      setConsultingContents("");
      refetchList();
      alert("상담을 저장했습니다.");
    } catch (err) {}
  };

  // const { data: myData } = useQuery(GET_ME);
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

  const onChangeSearchWord = (event) => {
    setSearchWord(event.target.value);
  };

  useEffect(() => {
    setConsultingTeacherId(myData?.me?.id);
  }, [myData]);

  useEffect(() => {
    onClickSearch();
  }, [searchWord]);

  const onClickSearch = () => {
    if (!Array.isArray(listData?.studentsInAcademyWithConsulting)) {
      return;
    }
    let newArray = [];
    if (stopType === "stop") {
      newArray = [
        ...listData?.studentsInAcademyWithConsulting
          ?.filter((el) => {
            return !el?.student.user.isActive;
          })
          ?.sort((a, b) => {
            return a?.student.korName.localeCompare(
              b?.student.korName,
              "kr-KR"
            );
          }),
      ];
    } else if (stopType === "start") {
      newArray = [
        ...listData?.studentsInAcademyWithConsulting
          ?.filter((el) => {
            return el?.student.user.isActive;
          })
          ?.sort((a, b) => {
            return a?.student.korName.localeCompare(
              b?.student.korName,
              "kr-KR"
            );
          }),
      ];
    } else {
      newArray = [
        ...listData?.studentsInAcademyWithConsulting?.sort((a, b) => {
          return a?.student.korName.localeCompare(b?.student.korName, "kr-KR");
        }),
      ];
    }
    setAcademyPage(0);
    setMaxAcademyPage(
      Math.ceil(
        newArray?.filter((el) => {
          return (
            el.student.korName.includes(searchWord) ||
            el.student.origin.includes(searchWord)
          );
        })?.length / 20
      )
    );
    setArray(
      newArray.filter((el) => {
        return (
          el.student.korName.includes(searchWord) ||
          el.student.origin.includes(searchWord)
        );
      })
    );
  };

  const onKeyPress = (event) => {
    if (event.key === "Enter") {
      onClickSearch();
    }
  };

  const onClickSort = (status) => () => {
    setSortType(status);
  };

  const onClickCheck = (el) => () => {
    setSelectId({
      id: Number(el?.student?.id),
      active: el?.student?.user?.isActive,
    });
    setDeleteStudent(el);
    setIsStop(!el?.student?.user?.isActive);
    setDeleteDate(dateToInput(new Date()));
    setIsCheck(true);
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

  const onClickStop = async () => {
    try {
      await stopAcademy({ variables: { userId: Number(selectId.id) } });
      if (!isStop) {
        // console.log(deleteStudent?.student, "테스트");
        deleteStudent?.student?.lectures
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
            } catch (err) {}
          });
        alert("휴원 처리 완료했습니다.");
      } else {
        alert("재원 처리 완료했습니다.");
      }
    } catch {
      alert("실패");
    }
    setIsCheck(false);
    refetch();
    refetchList();
  };

  const onClickAddStudent = async () => {
    if (
      addKorName === "" ||
      password === "" ||
      addPMobileNumber2 === "" ||
      addPMobileNumber3 === "" ||
      addPMobileNumber3 === "" ||
      addBirthDay === "" ||
      addId === "" ||
      (branches.length === 0 && myData?.me?.profile?.academies?.length > 0)
    ) {
      alert("필수 입력을 모두 완료해 주십시오.");
      return;
    }
    try {
      const result1 = await createUser({
        variables: {
          username: addId,
          email: addEmail1 + "@" + addEmail2,
          password: password,
          userCategory: "학생",
        },
      });
      try {
        const result2 = await createProfile({
          variables: {
            userId: Number(result1?.data?.createUser?.user?.id),
            korName: addKorName,
            engName: addEngName,
            gender: addGender,
            mobileno:
              addMobileNumber1 === "" ||
              addMobileNumber2 === "" ||
              addMobileNumber3 === ""
                ? addPMobileNumber1 +
                  "-" +
                  addPMobileNumber2 +
                  "-" +
                  addPMobileNumber3
                : addPMobileNumber1 +
                  "-" +
                  addPMobileNumber2 +
                  "-" +
                  addPMobileNumber3,
            pmobileno:
              addPMobileNumber1 +
              "-" +
              addPMobileNumber2 +
              "-" +
              addPMobileNumber3,
            birthDate: addBirthDay,
            registerDate: addBirthDay,
            origin: addId,
          },
        });
        if (myData?.me?.profile?.academies?.length > 0) {
          branches.forEach(async (el) => {
            try {
              await addUserToAcademy({
                variables: {
                  userIds: [Number(result1?.data?.createUser?.user?.id)],
                  academyId: Number(el),
                },
              });
            } catch {}
          });
        } else {
          try {
            await addUserToAcademy({
              variables: {
                userIds: [Number(result1?.data?.createUser?.user?.id)],
                academyId: Number(router.query.branch),
              },
            });
            refetch();
            refetchList();
          } catch {}
        }
      } catch {
        alert("유저 정보 수정 오류");
      }
    } catch {
      alert("유저 생성 오류");
    }
    setAddKorName("");
    setAddEmail1("");
    setAddEmail2("gmail.com");
    setPassword("");
    setAddEngName("");
    setAddGender("M");
    setAddMobileNumber1("");
    setAddMobileNumber2("");
    setAddMobileNumber3("");
    setAddPMobileNumber1("");
    setAddPMobileNumber2("");
    setAddPMobileNumber3("");
    setAddBirthDay(dateToInput(date));
    setAddRegisterDay(dateToInput(date));
    setAddOrigin("");
    setAddToggle(false);
  };

  useEffect(() => {
    if (!Array.isArray(listData?.studentsInAcademyWithConsulting)) {
      return;
    }
    if (stopType === "stop") {
      setArray(
        listData?.studentsInAcademyWithConsulting
          ?.filter((el) => {
            return !el?.student.user.isActive;
          })
          ?.sort((a, b) => {
            return a?.student.korName.localeCompare(
              b?.student.korName,
              "kr-KR"
            );
          })
      );
      setMaxAcademyPage(
        Math.ceil(
          listData?.studentsInAcademyWithConsulting
            ?.filter((el) => {
              return !el?.student.user.isActive;
            })
            ?.sort((a, b) => {
              return a?.student.korName.localeCompare(
                b?.student.korName,
                "kr-KR"
              );
            })?.length / 20
        )
      );
    } else if (stopType === "start") {
      setArray(
        listData?.studentsInAcademyWithConsulting
          ?.filter((el) => {
            return el?.student.user.isActive;
          })
          ?.sort((a, b) => {
            return a?.student.korName.localeCompare(
              b?.student.korName,
              "kr-KR"
            );
          })
      );
      setMaxAcademyPage(
        Math.ceil(
          listData?.studentsInAcademyWithConsulting
            ?.filter((el) => {
              return el?.student.user.isActive;
            })
            ?.sort((a, b) => {
              return a?.student.korName.localeCompare(
                b?.student.korName,
                "kr-KR"
              );
            })?.length / 20
        )
      );
    } else {
      setArray(
        listData?.studentsInAcademyWithConsulting?.sort((a, b) => {
          return a?.student.korName.localeCompare(b?.student.korName, "kr-KR");
        })
      );
      setMaxAcademyPage(
        Math.ceil(
          listData?.studentsInAcademyWithConsulting?.sort((a, b) => {
            return a?.student.korName.localeCompare(
              b?.student.korName,
              "kr-KR"
            );
          })?.length / 20
        )
      );
    }
  }, [data, listData, stopType]);

  useEffect(() => {
    if (data !== undefined) {
      const newArray = [...array];
      if (sortType === "origin") {
        setArray(
          newArray?.sort((a, b) => {
            return (
              parseInt(a?.student.origin.replace(/[^0-9]/g, "")) -
              parseInt(b?.student.origin.replace(/[^0-9]/g, ""))
            );
          })
        );
      }
      // git test
      if (sortType === "originReverse") {
        setArray(
          newArray?.sort((a, b) => {
            return (
              parseInt(b?.student.origin.replace(/[^0-9]/g, "")) -
              parseInt(a?.student.origin.replace(/[^0-9]/g, ""))
            );
          })
        );
      }
      if (sortType === "name") {
        setArray(
          newArray?.sort((a, b) => {
            return a?.student.korName.localeCompare(
              b?.student.korName,
              "kr-KR"
            );
          })
        );
      }
      if (sortType === "nameReverse") {
        setArray(
          newArray?.sort((a, b) => {
            return b?.student.korName.localeCompare(
              a?.student.korName,
              "kr-KR"
            );
          })
        );
      }
      if (sortType === "register") {
        setArray(
          newArray?.sort((a, b) => {
            const dateA = new Date(a.registerDate);
            const dateB = new Date(b.registerDate);
            return dateA - dateB;
          })
        );
      }
      if (sortType === "registerReverse") {
        setArray(
          newArray?.sort((a, b) => {
            const dateA = new Date(a?.student.registerDate);
            const dateB = new Date(b?.student.registerDate);
            return dateB - dateA;
          })
        );
      }
      if (sortType === "birthDate") {
        setArray(
          newArray?.sort((a, b) => {
            const dateA = new Date(a?.student.birthDate);
            const dateB = new Date(b?.student.birthDate);
            return dateA - dateB;
          })
        );
      }
      if (sortType === "birthDateReverse") {
        setArray(
          newArray?.sort((a, b) => {
            const dateA = new Date(a?.student.birthDate);
            const dateB = new Date(b?.student.birthDate);
            return dateB - dateA;
          })
        );
      }
    }
  }, [sortType]);

  const onChangeAcademy = (e) => {
    router.push("/" + e.target.value + "/academy");
  };
  return (
    <>
      <S.AcademyWrapper>
        <S.AcademyTitle>원생 관리</S.AcademyTitle>
        <div
          style={{
            display: "flex",
            width: "90rem",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "3.19rem",
          }}
        >
          {myData?.me?.profile?.academies?.length > 0 ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "5rem",
              }}
            >
              <S.OptionTitle>지점</S.OptionTitle>
              <S.OptionSelect onChange={onChangeAcademy}>
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
              </S.OptionSelect>
            </div>
          ) : (
            <></>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <S.OptionTitle>재원 상태</S.OptionTitle>
            <S.OptionSelect
              onChange={(e) => {
                setStopType(e.target.value);
                setAcademyPage(0);
              }}
            >
              <option selected={stopType === "all"} value={"all"}>
                전체
              </option>
              <option selected={stopType === "start"} value={"start"}>
                재원
              </option>
              <option selected={stopType === "stop"} value={"stop"}>
                휴원
              </option>
            </S.OptionSelect>
          </div>
        </div>
        <S.CountBox>
          <S.CountLeft>
            <S.CountNumber>
              {"전체 " + (array?.length ?? "0") + "명"}
            </S.CountNumber>
            <S.RegistButton
              onClick={() => {
                setAddToggle(true);
                setIsAddPMobileNumber(false);
                setIsAddMobileNumber(false);
                setAddPMobileNumber1("010");
                setAddMobileNumber1("010");
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
              원생 등록
            </S.RegistButton>
          </S.CountLeft>
          <S.CountRight>
            <S.SearchInput
              type="text"
              placeholder="       원번 혹은 이름을 입력하세요."
              onChange={onChangeSearchWord}
            />
          </S.CountRight>
        </S.CountBox>

        <table style={{ borderCollapse: "collapse", width: "90rem" }}>
          <thead>
            <tr>
              <S.AcademyTh>
                <div style={{ width: "3.125rem", height: "2rem" }}></div>
              </S.AcademyTh>
              <S.AcademyTh style={{ width: "9.25rem", height: "2rem" }}>
                원생 번호
                {sortType !== "origin" || sortType === "" ? (
                  <svg
                    width="10"
                    height="12"
                    viewBox="0 0 10 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={onClickSort("origin")}
                    style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                  >
                    <path
                      d="M3 0L5.65625 2.65625H3.65625V7.34375H2.34375V2.65625H0.34375L3 0ZM7.65625 9.34375H9.65625L7 12L4.34375 9.34375H6.34375V4.65625H7.65625V9.34375Z"
                      fill="white"
                    />
                  </svg>
                ) : (
                  <svg
                    width="10"
                    height="12"
                    viewBox="0 0 10 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={onClickSort("originReverse")}
                    style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                  >
                    <path
                      d="M3 0L5.65625 2.65625H3.65625V7.34375H2.34375V2.65625H0.34375L3 0ZM7.65625 9.34375H9.65625L7 12L4.34375 9.34375H6.34375V4.65625H7.65625V9.34375Z"
                      fill="white"
                    />
                  </svg>
                )}
              </S.AcademyTh>
              <S.AcademyTh
                colSpan={2}
                style={{ width: "13.5rem", height: "2rem" }}
              >
                원생 이름
                {sortType !== "name" || sortType === "" ? (
                  <svg
                    width="10"
                    height="12"
                    viewBox="0 0 10 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={onClickSort("name")}
                    style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                  >
                    <path
                      d="M3 0L5.65625 2.65625H3.65625V7.34375H2.34375V2.65625H0.34375L3 0ZM7.65625 9.34375H9.65625L7 12L4.34375 9.34375H6.34375V4.65625H7.65625V9.34375Z"
                      fill="white"
                    />
                  </svg>
                ) : (
                  <svg
                    width="10"
                    height="12"
                    viewBox="0 0 10 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={onClickSort("nameReverse")}
                    style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                  >
                    <path
                      d="M3 0L5.65625 2.65625H3.65625V7.34375H2.34375V2.65625H0.34375L3 0ZM7.65625 9.34375H9.65625L7 12L4.34375 9.34375H6.34375V4.65625H7.65625V9.34375Z"
                      fill="white"
                    />
                  </svg>
                )}
              </S.AcademyTh>
              <S.AcademyTh style={{ width: "9.25rem", height: "2rem" }}>
                생년월일{" "}
                {sortType !== "birthDate" || sortType === "" ? (
                  <svg
                    width="10"
                    height="12"
                    viewBox="0 0 10 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={onClickSort("birthDate")}
                    style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                  >
                    <path
                      d="M3 0L5.65625 2.65625H3.65625V7.34375H2.34375V2.65625H0.34375L3 0ZM7.65625 9.34375H9.65625L7 12L4.34375 9.34375H6.34375V4.65625H7.65625V9.34375Z"
                      fill="white"
                    />
                  </svg>
                ) : (
                  <svg
                    width="10"
                    height="12"
                    viewBox="0 0 10 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={onClickSort("birthDateReverse")}
                    style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                  >
                    <path
                      d="M3 0L5.65625 2.65625H3.65625V7.34375H2.34375V2.65625H0.34375L3 0ZM7.65625 9.34375H9.65625L7 12L4.34375 9.34375H6.34375V4.65625H7.65625V9.34375Z"
                      fill="white"
                    />
                  </svg>
                )}
              </S.AcademyTh>
              <S.AcademyTh style={{ width: "5.62rem", height: "2rem" }}>
                성별
              </S.AcademyTh>
              <S.AcademyTh style={{ width: "9.25rem", height: "2rem" }}>
                등록일{" "}
                {sortType !== "register" || sortType === "" ? (
                  <svg
                    width="10"
                    height="12"
                    viewBox="0 0 10 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={onClickSort("register")}
                    style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                  >
                    <path
                      d="M3 0L5.65625 2.65625H3.65625V7.34375H2.34375V2.65625H0.34375L3 0ZM7.65625 9.34375H9.65625L7 12L4.34375 9.34375H6.34375V4.65625H7.65625V9.34375Z"
                      fill="white"
                    />
                  </svg>
                ) : (
                  <svg
                    width="10"
                    height="12"
                    viewBox="0 0 10 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={onClickSort("registerReverse")}
                    style={{ marginLeft: "0.62rem", cursor: "pointer" }}
                  >
                    <path
                      d="M3 0L5.65625 2.65625H3.65625V7.34375H2.34375V2.65625H0.34375L3 0ZM7.65625 9.34375H9.65625L7 12L4.34375 9.34375H6.34375V4.65625H7.65625V9.34375Z"
                      fill="white"
                    />
                  </svg>
                )}
              </S.AcademyTh>
              <S.AcademyTh style={{ width: "10.94rem", height: "2rem" }}>
                부모님 전화번호
              </S.AcademyTh>
              <S.AcademyTh style={{ width: "6.37rem", height: "2rem" }}>
                상담 횟수
              </S.AcademyTh>

              <S.AcademyTh style={{ width: "11.87rem", height: "2rem" }}>
                동작
              </S.AcademyTh>

              <S.AcademyTh style={{ width: "10.69rem", height: "2rem" }}>
                재원 상태
              </S.AcademyTh>
            </tr>
          </thead>
          <tbody>
            {array?.map((el, index) => {
              if (index >= academyPage * 20 && index < (1 + academyPage) * 20) {
                return (
                  <tr key={uuidv4()}>
                    <S.AcademyTd>{index + 1}</S.AcademyTd>
                    <S.AcademyTd>
                      <span>{el?.student?.origin}</span>
                    </S.AcademyTd>
                    <S.AcademyTd
                      style={{
                        borderRight: "none",
                        width: "6.31rem",
                        paddingRight: "2px",
                        textAlign: "end",
                      }}
                    >
                      {el?.student?.korName}
                    </S.AcademyTd>
                    <S.AcademyTd
                      style={{
                        borderLeft: "none",
                        textAlign: "start",
                        paddingLeft: "2px",
                        width: "7rem",
                      }}
                    >
                      <CheckToolTipClass
                        text={"(" + el?.student?.engName + ")"}
                        number={100}
                        korName={el?.student?.korName}
                      ></CheckToolTipClass>
                    </S.AcademyTd>
                    <S.AcademyTd>
                      {"20" + dateInputToDot(el?.student?.birthDate)}
                    </S.AcademyTd>
                    <S.AcademyTd>
                      {el?.student?.gender === "M" ? "남" : "여"}
                    </S.AcademyTd>
                    <S.AcademyTd>
                      {"20" + dateInputToDot(el?.student?.registerDate)}
                    </S.AcademyTd>
                    <S.AcademyTd>
                      <div>{el?.student?.pmobileno}</div>
                    </S.AcademyTd>

                    <S.AcademyTd>{el?.consultingCount + "회"}</S.AcademyTd>
                    <S.AcademyTd>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <TooltipButton text={"원생 정보"}>
                          <S.AcademyIconButton
                            onClick={() => {
                              // window.open(
                              //   "/" + router.query.branch + "/academy/" + el.id,
                              //   "_blank"
                              // );
                              localStorage.setItem(
                                "academyDetailTab",
                                "profile"
                              );
                              router.push(
                                "/" +
                                  router.query.branch +
                                  "/academy/" +
                                  el?.student?.id
                              );
                            }}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.28418 8.65952C4.88472 9.26005 5.61394 9.56032 6.47185 9.56032C7.32976 9.56032 8.05898 9.26005 8.65952 8.65952C9.26005 8.05898 9.56032 7.32976 9.56032 6.47185C9.56032 5.61394 9.26005 4.88472 8.65952 4.28418C8.05898 3.68365 7.32976 3.38338 6.47185 3.38338C5.61394 3.38338 4.88472 3.68365 4.28418 4.28418C3.68365 4.88472 3.38338 5.61394 3.38338 6.47185C3.38338 7.32976 3.68365 8.05898 4.28418 8.65952ZM10.5898 9.56032L14 12.9705L12.9705 14L9.56032 10.5898V10.0429L9.36729 9.84987C8.55228 10.5576 7.58713 10.9115 6.47185 10.9115C5.22788 10.9115 4.16622 10.4826 3.28686 9.62466C2.42895 8.76676 2 7.71582 2 6.47185C2 5.22788 2.42895 4.17694 3.28686 3.31903C4.16622 2.43968 5.22788 2 6.47185 2C7.71582 2 8.76676 2.43968 9.62466 3.31903C10.4826 4.17694 10.9115 5.22788 10.9115 6.47185C10.9115 6.92225 10.8043 7.437 10.5898 8.01609C10.3753 8.57373 10.1287 9.02413 9.84987 9.36729L10.0429 9.56032H10.5898Z"
                                fill="#333333"
                              />
                            </svg>
                          </S.AcademyIconButton>
                        </TooltipButton>
                        <TooltipButton text={"학습 리포트"}>
                          <S.AcademyIconButton
                            onClick={() => {
                              router.push(
                                "/" +
                                  router.query.branch +
                                  "/report/reportDetail/" +
                                  el?.student?.id
                              );
                            }}
                          >
                            <svg
                              width="16"
                              height="18"
                              viewBox="0 0 12 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
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
                            </svg>
                          </S.AcademyIconButton>
                        </TooltipButton>
                        <TooltipButton text={"리딩이력"}>
                          <S.AcademyIconButton
                            onClick={() => {
                              // window.open(
                              //   "/" + router.query.branch + "/report/" + el.id
                              // );
                              router.push(
                                "/" +
                                  router.query.branch +
                                  "/report/" +
                                  el?.student.id
                              );
                            }}
                          >
                            <svg
                              width="14"
                              height="18"
                              viewBox="0 0 14 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2 2.32031V9L4.07031 7.75L6.17969 9V2.32031H2ZM12 0.679688C12.4427 0.679688 12.8333 0.848958 13.1719 1.1875C13.5104 1.5 13.6797 1.8776 13.6797 2.32031V15.6797C13.6797 16.1224 13.5104 16.513 13.1719 16.8516C12.8333 17.1641 12.4427 17.3203 12 17.3203H2C1.55729 17.3203 1.16667 17.1641 0.828125 16.8516C0.489583 16.513 0.320312 16.1224 0.320312 15.6797V2.32031C0.320312 1.8776 0.489583 1.5 0.828125 1.1875C1.16667 0.848958 1.55729 0.679688 2 0.679688H12Z"
                                fill="#333333"
                              />
                            </svg>
                          </S.AcademyIconButton>
                        </TooltipButton>
                        <TooltipButton text={"상담 추가"}>
                          <S.AcademyIconButton
                            onClick={() => {
                              setConsultingStudent(el);
                              setIsConsulting(true);
                            }}
                          >
                            <svg
                              width="1rem"
                              height="1.7rem"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_1688_161)">
                                <mask
                                  id="path-1-inside-1_1688_161"
                                  fill="white"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M3 2C2.44772 2 2 2.44772 2 3V9.72727C2 10.2796 2.44771 10.7273 3 10.7273H3.88674L6.36675 14L8.84672 10.7273H13C13.5523 10.7273 14 10.2796 14 9.72727V3C14 2.44772 13.5523 2 13 2H3Z"
                                  />
                                </mask>
                                <path
                                  d="M3.88674 10.7273L4.92286 9.94212L4.53271 9.42727H3.88674V10.7273ZM6.36675 14L5.33063 14.7851L6.36676 16.1525L7.40287 14.7851L6.36675 14ZM8.84672 10.7273V9.42727H8.20074L7.8106 9.94213L8.84672 10.7273ZM3.3 3C3.3 3.16569 3.16569 3.3 3 3.3V0.7C1.72974 0.7 0.7 1.72975 0.7 3H3.3ZM3.3 9.72727V3H0.7V9.72727H3.3ZM3 9.42727C3.16569 9.42727 3.3 9.56159 3.3 9.72727H0.7C0.7 10.9975 1.72974 12.0273 3 12.0273V9.42727ZM3.88674 9.42727H3V12.0273H3.88674V9.42727ZM2.85062 11.5124L5.33063 14.7851L7.40287 13.2149L4.92286 9.94212L2.85062 11.5124ZM7.40287 14.7851L9.88285 11.5124L7.8106 9.94213L5.33063 13.2149L7.40287 14.7851ZM13 9.42727H8.84672V12.0273H13V9.42727ZM12.7 9.72727C12.7 9.56159 12.8343 9.42727 13 9.42727V12.0273C14.2703 12.0273 15.3 10.9975 15.3 9.72727H12.7ZM12.7 3V9.72727H15.3V3H12.7ZM13 3.3C12.8343 3.3 12.7 3.16568 12.7 3H15.3C15.3 1.72975 14.2703 0.7 13 0.7V3.3ZM3 3.3H13V0.7H3V3.3Z"
                                  fill="#333333"
                                  mask="url(#path-1-inside-1_1688_161)"
                                />
                                <rect
                                  x="4.70258"
                                  y="5.6543"
                                  width="1.41818"
                                  height="1.41818"
                                  fill="#333333"
                                />
                                <rect
                                  x="9.8772"
                                  y="5.6543"
                                  width="1.41818"
                                  height="1.41818"
                                  fill="#333333"
                                />
                                <rect
                                  x="7.28986"
                                  y="5.6543"
                                  width="1.41818"
                                  height="1.41818"
                                  fill="#333333"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_1688_161">
                                  <rect width="16" height="16" fill="white" />
                                </clipPath>
                              </defs>
                            </svg>
                          </S.AcademyIconButton>
                        </TooltipButton>
                      </div>
                    </S.AcademyTd>
                    <S.AcademyTd>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-around",
                        }}
                      >
                        휴원
                        <Switch
                          style={{
                            backgroundColor: el?.student?.user?.isActive
                              ? "#791285"
                              : "#c8c8c8",
                          }}
                          defaultChecked={el?.student?.user?.isActive}
                          onClick={onClickCheck(
                            el
                            // el?.student?.id,
                            // el?.student?.user?.isActive
                          )}
                        ></Switch>
                        재원
                      </div>
                    </S.AcademyTd>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
        <div
          style={{
            margin: "1.87rem 0",
            width: "90rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <S.AcademyPageNumber
            style={{
              margin: "0 0.31rem",
              color: academyPage === 0 ? "#c8c8c8" : "",
            }}
            onClick={() => {
              if (academyPage > 0) {
                setAcademyPage(0);
              }
            }}
          >
            {"<<"}
          </S.AcademyPageNumber>
          <S.AcademyPageNumber
            style={{
              margin: "0 0.31rem",
              color: academyPage === 0 ? "#c8c8c8" : "",
            }}
            onClick={() => {
              if (academyPage > 0) {
                setAcademyPage(academyPage - 1);
              }
            }}
          >
            {"<"}
          </S.AcademyPageNumber>
          {Array(maxAcademyPage)
            .fill(0)
            .map((_, index) => {
              return (
                <S.AcademyPageNumber
                  style={{
                    margin: "0 0.31rem",
                    backgroundColor: index === academyPage ? "#791285" : "",
                    color: index === academyPage ? "#fff" : "",
                  }}
                  onClick={() => {
                    setAcademyPage(index);
                  }}
                >
                  {index + 1}
                </S.AcademyPageNumber>
              );
            })}
          <S.AcademyPageNumber
            style={{
              margin: "0 0.31rem",
              color: academyPage === maxAcademyPage - 1 ? "#c8c8c8" : "",
            }}
            onClick={() => {
              if (academyPage < maxAcademyPage - 1) {
                setAcademyPage(academyPage + 1);
              }
            }}
          >
            {">"}
          </S.AcademyPageNumber>
          <S.AcademyPageNumber
            style={{
              margin: "0 0.31rem",
              color: academyPage === maxAcademyPage - 1 ? "#c8c8c8" : "",
            }}
            onClick={() => {
              if (academyPage < maxAcademyPage - 1) {
                setAcademyPage(maxAcademyPage - 1);
              }
            }}
          >
            {">>"}
          </S.AcademyPageNumber>
        </div>
      </S.AcademyWrapper>

      {addToggle && (
        <Modal
          closable={false}
          open={addToggle}
          onCancel={() => {
            setAddId("");
            setAddToggle(false);
            setAddKorName("");
            setAddEmail1("");
            setAddEmail2("gmail.com");
            setPassword("");
            setAddEngName("");
            setAddGender("M");
            setAddMobileNumber1("");
            setAddMobileNumber2("");
            setAddMobileNumber3("");
            setAddPMobileNumber1("");
            setAddPMobileNumber2("");
            setAddPMobileNumber3("");
            setAddBirthDay(dateToInput(date));
            setAddRegisterDay(dateToInput(date));
            setAddOrigin("");
          }}
          width={"40.125rem"}
          // style={{ padding: "0", backgroundColor: "none" }}
          footer={null}
        >
          <S.ModalWrapperTitle>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "0.63rem" }}
            >
              <path
                d="M12 6.84564H6.84564V12H5.15436V6.84564H0V5.15436H5.15436V0H6.84564V5.15436H12V6.84564Z"
                fill="#791285"
              />
            </svg>
            원생 등록
          </S.ModalWrapperTitle>
          <div
            style={{ width: "100%", borderBottom: "1px solid #DFE1E5" }}
          ></div>
          <S.ModalWrapper>
            <S.ModalTag>
              <S.ModalTitle>
                {"원번(아이디)"}
                <span style={{ color: "#F00" }}>{" *"}</span>
                <span
                  style={{
                    color: "#F00",
                    fontSize: "0.875rem",
                    verticalAlign: "center",
                  }}
                >
                  {"필수"}
                </span>
              </S.ModalTitle>
              <S.ModalInput
                type="text"
                placeholder={"아이디를 입력하세요."}
                onChange={(e) => {
                  setAddId(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onClickAddStudent();
                  }
                }}
              ></S.ModalInput>
            </S.ModalTag>
            <S.ModalTag>
              <S.ModalTitle>
                비밀번호 <span style={{ color: "#F00" }}>{" *"}</span>
                <span
                  style={{
                    color: "#F00",
                    fontSize: "0.875rem",
                    verticalAlign: "center",
                  }}
                >
                  {"필수"}
                </span>
              </S.ModalTitle>
              <S.ModalInput
                type="password"
                placeholder={"비밀번호를 입력하세요."}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onClickAddStudent();
                  }
                }}
              ></S.ModalInput>
            </S.ModalTag>

            <S.ModalTag>
              <S.ModalTitle>
                한글 이름 <span style={{ color: "#F00" }}>{" *"}</span>
                <span
                  style={{
                    color: "#F00",
                    fontSize: "0.875rem",
                    verticalAlign: "center",
                  }}
                >
                  {"필수"}
                </span>
              </S.ModalTitle>
              <S.ModalInput
                placeholder={"한글 이름을 입력하세요."}
                type="text"
                onChange={(e) => {
                  setAddKorName(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onClickAddStudent();
                  }
                }}
              ></S.ModalInput>
            </S.ModalTag>
            <S.ModalTag>
              <S.ModalTitle>영어 이름</S.ModalTitle>
              <S.ModalInput
                placeholder={"영어 이름을 입력하세요."}
                type="text"
                onChange={(e) => {
                  setAddEngName(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onClickAddStudent();
                  }
                }}
              ></S.ModalInput>
            </S.ModalTag>
            <S.ModalTag>
              <S.ModalTitle>
                생년월일 <span style={{ color: "#F00" }}>{" *"}</span>
                <span
                  style={{
                    color: "#F00",
                    fontSize: "0.875rem",
                    verticalAlign: "top",
                  }}
                >
                  {"필수"}
                </span>
              </S.ModalTitle>
              <S.ModalInput
                type="date"
                value={addBirthDay}
                onChange={(e) => {
                  setAddBirthDay(e.target.value);
                }}
              ></S.ModalInput>
            </S.ModalTag>
            <S.ModalTag>
              <S.ModalTitle>센터 등록일</S.ModalTitle>
              <S.ModalInput
                type="date"
                defaultValue={addRegisterDay}
                onChange={(e) => {
                  setAddRegisterDay(e.target.value);
                }}
              ></S.ModalInput>
            </S.ModalTag>
            <S.ModalTag>
              <S.ModalTitle>
                부모님 전화번호 <span style={{ color: "#F00" }}>{" *"}</span>
                <span
                  style={{
                    color: "#F00",
                    fontSize: "0.875rem",
                    verticalAlign: "center",
                  }}
                >
                  {"필수"}
                </span>
              </S.ModalTitle>
              <div
                style={{
                  fontFamily: "Spoqa Han Sans Neo",
                  fontWeight: 500,
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  marginTop: "0.63rem",
                }}
              >
                {isAddPMobileNumber ? (
                  <S.ModalLabel>
                    <S.ModalBorderLess
                      type="text"
                      style={{ width: "3rem" }}
                      maxLength={4}
                      onChange={(e) => {
                        const onlyNumber = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        setAddPMobileNumber1(onlyNumber);
                        if (e.target.value.length === 4) {
                          pMobileNumber2.current.focus();
                        }
                      }}
                      value={addPMobileNumber1}
                    ></S.ModalBorderLess>
                    <div
                      style={{
                        cursor: "pointer",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onClick={() => {
                        setIsAddPMobileNumber(false);
                        setAddPMobileNumber1("010");
                      }}
                    >
                      <svg
                        width="8"
                        height="6"
                        viewBox="0 0 8 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ margin: "0.3rem", cursor: "pointer" }}
                      >
                        <path
                          d="M7.0625 0.21875L8 1.15625L4 5.15625L0 1.15625L0.9375 0.21875L4 3.28125L7.0625 0.21875Z"
                          fill="#333333"
                        />
                      </svg>
                    </div>

                    {/* <button
                      
                      style={{
                        border: "none",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      x
                    </button> */}
                  </S.ModalLabel>
                ) : (
                  <select
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setIsAddPMobileNumber(true);
                        setAddPMobileNumber1(e.target.value);
                      } else {
                        setAddPMobileNumber1(e.target.value);
                      }
                    }}
                    style={{
                      paddingLeft: "0.5rem",
                      width: "4.875rem",
                      height: "2.9875rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #dfe1e5",
                      margin: "0 0.31rem 0 0.62rem",
                      fontSize: "1rem",
                      fontFamily: "Spoqa Han Sans Neo",
                    }}
                  >
                    {firstPhone?.map((el) => {
                      return (
                        <option selected={el === addPMobileNumber1} value={el}>
                          {el === "" ? "직접 입력" : el}
                        </option>
                      );
                    })}
                  </select>
                )}
                -
                <S.ModalPhone
                  type="text"
                  maxLength={4}
                  onChange={(e) => {
                    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                    setAddPMobileNumber2(onlyNumber);
                    if (e.target.value.length === 4) {
                      pMobileNumber3.current.focus();
                    }
                  }}
                  ref={pMobileNumber2}
                  value={addPMobileNumber2}
                  style={{ marginRight: "0.31rem" }}
                ></S.ModalPhone>
                -
                <S.ModalPhone
                  type="text"
                  maxLength={4}
                  onChange={(e) => {
                    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                    setAddPMobileNumber3(onlyNumber);
                  }}
                  ref={pMobileNumber3}
                  value={addPMobileNumber3}
                ></S.ModalPhone>
              </div>
            </S.ModalTag>
            <S.ModalTag>
              <S.ModalTitle>원생 전화번호</S.ModalTitle>
              <div
                style={{
                  fontFamily: "Spoqa Han Sans Neo",
                  fontWeight: 500,
                  fontSize: "1rem",
                  marginTop: "0.63rem",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {isAddMobileNumber ? (
                  <S.ModalLabel>
                    <S.ModalBorderLess
                      type="text"
                      maxLength={4}
                      onChange={(e) => {
                        const onlyNumber = e.target.value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        setAddMobileNumber1(onlyNumber);
                        if (e.target.value.length === 4) {
                          mobileNumber2.current.focus();
                        }
                      }}
                      style={{ width: "3rem" }}
                      value={addMobileNumber1}
                    ></S.ModalBorderLess>
                    <div
                      style={{
                        cursor: "pointer",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                      }}
                      onClick={() => {
                        setIsAddMobileNumber(false);
                        setAddMobileNumber1("010");
                      }}
                    >
                      <svg
                        width="8"
                        height="6"
                        viewBox="0 0 8 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ cursor: "pointer", marginRight: "0.3rem" }}
                      >
                        <path
                          d="M7.0625 0.21875L8 1.15625L4 5.15625L0 1.15625L0.9375 0.21875L4 3.28125L7.0625 0.21875Z"
                          fill="#333333"
                        />
                      </svg>
                    </div>
                    {/* 
                    <button
                      
                      style={{
                        border: "none",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                      }}
                    >
                      x
                    </button> */}
                  </S.ModalLabel>
                ) : (
                  <select
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setIsAddMobileNumber(true);
                        setAddMobileNumber1(e.target.value);
                      } else {
                        setAddMobileNumber1(e.target.value);
                      }
                    }}
                    style={{
                      paddingLeft: "0.5rem",
                      width: "4.875rem",
                      height: "2.9875rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #dfe1e5",
                      margin: "0 0.31rem 0 0.62rem",
                      fontSize: "1rem",
                      fontFamily: "Spoqa Han Sans Neo",
                    }}
                  >
                    {firstPhone?.map((el) => {
                      return (
                        <option selected={el === addMobileNumber1} value={el}>
                          {el === "" ? "직접 입력" : el}
                        </option>
                      );
                    })}
                  </select>
                )}
                -
                <S.ModalPhone
                  type="text"
                  maxLength={4}
                  onChange={(e) => {
                    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                    setAddMobileNumber2(onlyNumber);
                    if (e.target.value.length === 4) {
                      mobileNumber3.current.focus();
                    }
                  }}
                  ref={mobileNumber2}
                  value={addMobileNumber2}
                  style={{ marginRight: "0.31rem" }}
                ></S.ModalPhone>
                -
                <S.ModalPhone
                  type="text"
                  maxLength={4}
                  onChange={(e) => {
                    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                    setAddMobileNumber3(onlyNumber);
                  }}
                  ref={mobileNumber3}
                  value={addMobileNumber3}
                ></S.ModalPhone>
              </div>
            </S.ModalTag>

            <S.ModalTag style={{ width: "100%" }}>
              <S.ModalTitle>이메일</S.ModalTitle>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",

                  justifyContent: "space-between",
                }}
              >
                <S.ModalSmall
                  placeholder={"이메일을 입력하세요."}
                  type="text"
                  onChange={(e) => {
                    setAddEmail1(e.target.value);
                  }}
                  style={{ marginLeft: "0.6rem" }}
                  value={addEmail1}
                ></S.ModalSmall>{" "}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontFamily: "Spoqa Han Sans Neo",
                    fontSize: "1rem",
                    marginTop: "0.4rem",
                  }}
                >
                  @
                </span>
                <S.ModalSmall
                  type="text"
                  onChange={(e) => {
                    setAddEmail2(e.target.value);
                  }}
                  value={addEmail2}
                  disabled={!isTyped}
                ></S.ModalSmall>{" "}
                <select
                  style={{
                    borderRadius: "0.5rem",
                    border: "1px solid #dbdde1",
                    width: "11.25rem",
                    height: "3rem",
                    color: "#333",
                    paddingLeft: "1rem",
                    fontFamily: "Spoqa Han Sans Neo",
                    fontSize: "1rem",
                    marginTop: "0.8rem",
                  }}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setAddEmail2("");
                      setIsTyped(true);
                    } else {
                      setAddEmail2(e.target.value);
                      setIsTyped(false);
                    }
                  }}
                >
                  {addressList.map((el) => {
                    return (
                      <option value={el} selected={el === addEmail2}>
                        {el}
                      </option>
                    );
                  })}
                  <option value={""} selected={isTyped}>
                    {"직접 입력"}
                  </option>
                </select>
              </div>
              {/* <S.ModalInput
                type="text"
                onChange={(e) => {
                  setAddEmail(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onClickAddStudent();
                  }
                }}
              ></S.ModalInput> */}
            </S.ModalTag>
            <S.ModalTag style={{ width: "16.625rem" }}>
              <S.ModalTitle>성별</S.ModalTitle>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  paddingLeft: "0.62rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.66rem",
                  }}
                >
                  <S.ModalRadioButton
                    type="radio"
                    name="gender"
                    value={"M"}
                    checked={addGender === "M"}
                    onChange={(e) => {
                      setAddGender(e.target.value);
                    }}
                  ></S.ModalRadioButton>{" "}
                  <span
                    style={{
                      marginLeft: "1rem",
                      fontFamily: "Spoqa Han Sans Neo",
                      fontSize: "1rem",
                      fontWeight: addGender === "M" ? "500" : "400",
                      color: addGender === "M" ? "#791285" : "",
                    }}
                  >
                    남
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "0.66rem",
                  }}
                >
                  <S.ModalRadioButton
                    type="radio"
                    name="gender"
                    value={"W"}
                    checked={addGender === "W"}
                    onChange={(e) => {
                      setAddGender(e.target.value);
                    }}
                  ></S.ModalRadioButton>{" "}
                  <span
                    style={{
                      marginLeft: "1rem",
                      fontFamily: "Spoqa Han Sans Neo",
                      fontSize: "1rem",
                      fontWeight: addGender === "W" ? "500" : "400",
                      color: addGender === "W" ? "#791285" : "",
                    }}
                  >
                    여
                  </span>
                </div>
              </div>
            </S.ModalTag>
            <S.ModalTag style={{ width: "17.525rem", marginLeft: "0" }}>
              {myData?.me?.profile?.academies?.length > 0 && (
                <div>
                  <S.ModalTitle>
                    지점 <span style={{ color: "#F00" }}>*</span>
                    <span
                      style={{
                        color: "#F00",
                        fontSize: "0.875rem",
                        verticalAlign: "center",
                      }}
                    >
                      {"필수"}
                    </span>
                  </S.ModalTitle>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      paddingLeft: "0.62rem",
                    }}
                  >
                    {myData?.me?.profile?.academies?.map((el) => {
                      return (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "0.66rem",
                          }}
                        >
                          <S.ModalRadioButton
                            type="checkbox"
                            onClick={onClickAddBranchList(el?.id)}
                            checked={branches.includes(el?.id)}
                          ></S.ModalRadioButton>
                          <div
                            style={{
                              marginLeft: "1rem",
                              fontFamily: "Spoqa Han Sans Neo",
                              fontSize: "1rem",
                              fontWeight: branches?.includes(el?.id)
                                ? "500"
                                : "400",
                              color: branches?.includes(el?.id)
                                ? "#791285"
                                : "",
                            }}
                          >
                            {el.location}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </S.ModalTag>

            {/* <S.ModalTag>
              <S.ModalTitle>원생 번호</S.ModalTitle>
              <S.ModalInput
                type="text"
                onChange={(e) => {
                  setAddOrigin(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onClickAddStudent();
                  }
                }}
              ></S.ModalInput>
            </S.ModalTag> */}
            <div
              style={{
                width: "99%",
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
                {"은 필수 입력 항목입니다."}
              </div>
            </div>
          </S.ModalWrapper>

          <S.ModalButtonBox
            style={{
              width: "100%",
              borderTop: "1px solid #DFE1E5",
              paddingTop: "1rem",
            }}
          >
            <S.ModalOkButton
              onClick={onClickAddStudent}
              disabled={
                addKorName === "" ||
                addId === "" ||
                addPMobileNumber2 === "" ||
                addPMobileNumber3 === "" ||
                addBirthDay === "" ||
                (branches?.length === 0 &&
                  myData?.me?.profile?.academies?.length > 0)
              }
              style={
                addKorName === "" ||
                addId === "" ||
                addPMobileNumber2 === "" ||
                addPMobileNumber3 === "" ||
                addBirthDay === "" ||
                (branches?.length === 0 &&
                  myData?.me?.profile?.academies?.length > 0)
                  ? {
                      opacity: 0.5,
                      cursor: "default",
                    }
                  : {}
              }
            >
              저장
            </S.ModalOkButton>
            <S.ModalReturnButton
              onClick={() => {
                setAddId("");
                setAddToggle(false);
                setAddKorName("");
                setAddEmail1("");
                setAddEmail2("gmail.com");
                setPassword("");
                setAddEngName("");
                setAddGender("M");
                setAddMobileNumber1("");
                setAddMobileNumber2("");
                setAddMobileNumber3("");
                setAddPMobileNumber1("");
                setAddPMobileNumber2("");
                setAddPMobileNumber3("");
                setAddBirthDay(dateToInput(date));
                setAddRegisterDay(dateToInput(date));
                setAddOrigin("");
                setBranches([]);
              }}
            >
              취소
            </S.ModalReturnButton>
          </S.ModalButtonBox>
        </Modal>
      )}
      {isCheck ? (
        <Modal
          open={isCheck}
          closable={false}
          onCancel={() => {
            setIsCheck(false);
          }}
          footer={null}
        >
          <div>
            <div>
              {isStop
                ? "재원으로 변경하시겠습니까?"
                : "휴원으로 변경하시겠습니까?"}
            </div>

            {!isStop && (
              <div>
                <div>휴원으로 변경 시 휴원일 이후 모든 수업이 삭제 됩니다.</div>
                <span>휴원일</span>
                <input
                  type="date"
                  onChange={(e) => {
                    setDeleteDate(e.target.value);
                  }}
                  value={deleteDate}
                ></input>
              </div>
            )}
            <button
              onClick={() => {
                setIsCheck(false);
              }}
            >
              취소
            </button>
            <button onClick={onClickStop}>확인</button>
          </div>
        </Modal>
      ) : (
        <></>
      )}
      {isConsulting && (
        <Modal
          open={isConsulting}
          onOk={() => {
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
                  <path
                    d="M12 6.84564H6.84564V12H5.15436V6.84564H0V5.15436H5.15436V0H6.84564V5.15436H12V6.84564Z"
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
                    value={consultingStudent?.student?.origin}
                  ></S.ConsultingModalInput>
                </div>
                <S.ConsultingModalBox>
                  <S.ConsultingModalTag>원생 이름</S.ConsultingModalTag>
                  <S.ConsultingModalInput
                    disabled={true}
                    value={
                      consultingStudent?.student?.korName +
                      "(" +
                      consultingStudent?.student?.engName +
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
                  <S.ConsultingModalInput
                    type="date"
                    value={consultingDate}
                    onChange={(e) => {
                      setConsultingDate(e.target.value);
                    }}
                  ></S.ConsultingModalInput>
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
                >
                  {teacherData?.staffInAcademy
                    .filter((el) => el?.user?.userCategory === "선생님")
                    // ?.filter((el) => {
                    //   return (
                    //     Number(el?.profile?.academy?.id) ===
                    //     Number(router.query.branch)
                    //   );
                    // })
                    .map((el) => {
                      return (
                        <option
                          key={uuidv4()}
                          value={el.id}
                          selected={
                            Number(el.id) === Number(consultingTeacherId)
                          }
                        >
                          {el.korName}
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

              <div>
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
    </>
  );
}
