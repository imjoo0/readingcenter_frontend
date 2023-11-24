import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  CREATE_CONSULTING,
  DELETE_CONSULTING,
  GET_ALL_STUDENTS,
  GET_ME,
  GET_TEACHER,
  GET_TEACHER_CONSULTING,
  UPDATE_CONSULTING,
} from "./consulting.query";
import * as S from "./consulting.style";
import { Modal } from "antd";
import {
  dateInputToDay,
  dateInputToDot,
  dateToClock,
  dateToInput,
  longConsulting,
  longWord,
} from "@/src/commons/library/library";
import { el } from "date-fns/locale";
import { useRouter } from "next/router";
import { DatePicker } from "antd";
import { AcademyPageNumber } from "../academy/academy.style";
import CheckToolTip from "@/src/commons/library/tooltipcheck";
import TooltipButton from "@/src/commons/library/buttonTooltip";
import CheckToolTipClass from "@/src/commons/library/tooltipcheckClass";

const pageTagNumber = 20;
export default function ConsultingPage() {
  const router = useRouter();
  const [consultingList, setConsultingList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const { data: myData } = useQuery(GET_ME); // 수정 필수
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
  const [queryTeacherId, setQueryTeacherId] = useState("");
  const { data: teacherData, refetch: refetchTeacher } = useQuery(GET_TEACHER, {
    variables: { academyId: Number(router.query.branch) },
  });
  const { data: consultingData, refetch: refetchConsulting } = useQuery(
    GET_TEACHER_CONSULTING,
    { variables: { userId: Number(myData?.me?.profile?.id) } }
  );

  const [deleteConsulting] = useMutation(DELETE_CONSULTING);
  const [updateConsulting] = useMutation(UPDATE_CONSULTING);
  const [createConsulting] = useMutation(CREATE_CONSULTING);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectId, setSelectId] = useState("");
  const [selectStudent, setSelectStudent] = useState("");
  const [selectIndex, setSelectIndex] = useState(-1);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContents, setEditContents] = useState("");
  const [editDate, setEditDate] = useState(dateToInput(new Date()));
  const [consultingPage, setConsultingPage] = useState(0);
  const [maxConsultingPage, setMaxConsultingPage] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isAdd, setIsAdd] = useState(false);
  const [addStudent, setAddStudent] = useState("");
  const [addStudentSearch, setAddStudentSearch] = useState("");
  const [addTitle, setAddTitle] = useState("");
  const [addContents, setAddContents] = useState("");
  const [addDate, setAddDate] = useState(dateToInput(new Date()));
  const [addTeacherId, setAddTeacherId] = useState();
  const { data: studentData } = useQuery(GET_ALL_STUDENTS, {
    variables: { academyId: Number(router.query.branch) },
  });

  useEffect(() => {
    if (myData) {
      setAddTeacherId(myData?.me.id);
    }
  }, [myData]);

  const onClickOpenDeleteModal = (el, index) => () => {
    setIsDelete(true);
    setSelectStudent(el);
    setSelectId(el.id);
    setSelectIndex(index);
  };

  const onClickOpenEditModal = (el) => () => {
    setIsEdit(true);
    setSelectStudent(el);
    setSelectId(el.id);
    setEditContents(el.contents);
    setEditTitle(el.title);
    setEditDate(el.createdAt);
  };

  const onClickConSultingCreate = async () => {
    try {
      await createConsulting({
        variables: {
          title: addTitle,
          studentId: Number(addStudent.id),
          contents: addContents,
          writerId: Number(addTeacherId),
          createdAt: addDate,
        },
      });
      refetchConsulting();
      setSelectId("");
      setIsAdd(false);
      setIsAdd(false);
      setAddStudentSearch("");
      setAddStudent("");
      setAddTitle("");
      setAddContents("");
      setAddDate(dateToInput(new Date()));
      alert("상담 등록이 완료됐습니다.");
    } catch (err) {}
  };

  useEffect(() => {
    setQueryTeacherId(myData?.me?.profile?.id);
  }, [myData]);

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
          writerId: Number(addTeacherId),
          createdAt: editDate,
        },
      });
      refetchConsulting();
      setSelectId("");
      setIsEdit(false);
      alert("상담을 수정했습니다.");
    } catch (err) {}
  };

  useEffect(() => {
    if (studentData !== undefined) {
      setStudentList(
        studentData?.studentsInAcademy
          ?.filter((el) => {
            return el?.user?.isActive;
          })
          ?.filter((el) => {
            return (
              el.korName.includes(addStudentSearch) ||
              el.origin.includes(addStudentSearch)
            );
          })
      );
    }
  }, [studentData, addStudentSearch]);

  useEffect(() => {
    if (consultingData !== undefined) {
      setConsultingPage(0);
      // if(){}
      setConsultingList(
        consultingData?.getAllConsulting
          ?.sort((a, b) => {
            const aDate = new Date(a.createdAt);
            const bDate = new Date(b.createdAt);
            return bDate - aDate;
          })
          ?.filter((el) => {
            if (queryTeacherId === "") {
              return true;
            } else {
              return Number(el?.writer?.profile?.id) === Number(queryTeacherId);
            }
          })
          ?.filter((el) => {
            return (
              el.student.korName.includes(studentSearch) ||
              el.student.origin.includes(studentSearch) ||
              el.title.includes(studentSearch) ||
              el.contents.includes(studentSearch) ||
              el.createdAt.includes(studentSearch) ||
              studentSearch === dateInputToDay(el.createdAt) ||
              el.student.pmobileno.includes(studentSearch)
            );
          })
          ?.filter((el) => {
            if (startDate === "" || endDate === "") {
              return true;
            } else {
              const start = new Date(startDate);
              const end = new Date(endDate);
              const k = new Date(el.createdAt);
              return k - start >= 0 && end - k >= 0;
            }
          })
      );
      setMaxConsultingPage(
        Math.ceil(
          consultingData?.getAllConsulting
            ?.filter((el) => {
              if (queryTeacherId === "") {
                return true;
              } else {
                return (
                  Number(el?.writer?.profile?.id) === Number(queryTeacherId)
                );
              }
            })
            ?.filter((el) => {
              return (
                el.student.korName.includes(studentSearch) ||
                el.student.origin.includes(studentSearch) ||
                el.title.includes(studentSearch) ||
                el.contents.includes(studentSearch) ||
                el.createdAt.includes(studentSearch) ||
                studentSearch === dateInputToDay(el.createdAt) ||
                el.student.pmobileno.includes(studentSearch)
              );
            })
            ?.filter((el) => {
              if (startDate === "" || endDate === "") {
                return true;
              } else {
                const start = new Date(startDate);
                const end = new Date(endDate);
                const k = new Date(el.createdAt);
                return k - start >= 0 && end - k >= 0;
              }
            }).length / pageTagNumber
        )
      );
    }
  }, [consultingData, studentSearch, startDate, endDate, queryTeacherId]);
  return (
    <S.Wrapper>
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
      <S.Title>상담 관리</S.Title>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "2.5rem",
          marginBottom: "2.5rem",
          width: "90rem",
          justifyContent: "center",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", marginRight: "5rem" }}
        >
          <S.DateTitle>담당 선생님</S.DateTitle>
          <select
            style={{
              width: "10.875rem",
              height: "2.6875rem",
              border: "none",
              borderBottom: "1px solid #858585",
              fontWeight: 700,
              fontFamily: "Spoqa Han Sans Neo",
              fontSize: "1rem",
              // paddingLeft: "0.5rem",
              textAlign: "center",
            }}
            onChange={(e) => {
              console.log(e.target.value);
              setQueryTeacherId(e.target.value);
            }}
          >
            <option value={""}>{"전체"}</option>
            {teacherData?.staffInAcademy?.map((el) => {
              return <option value={el?.id}>{el?.korName}</option>;
            })}
          </select>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <S.DateTitle>조회 기간</S.DateTitle>
          <div>
            <DatePicker.RangePicker
              style={{
                width: "17.1875rem",
                height: "2.6875rem",
                color: "#333",
                fontSize: "1rem",
                fontWeight: "500",
                textAlignLast: "center",
                paddingLeft: "1rem",
              }}
              separator="~"
              placeholder={["시작 날짜", "끝 날짜"]}
              onChange={(e) => {
                // console.log(e, dateToInput(e?.[0]?.$d), dateToInput(e?.[1]?.$d));
                if (e?.[0]) {
                  setStartDate(dateToInput(e?.[0]?.$d));
                  setEndDate(dateToInput(e?.[1]?.$d));
                } else {
                  setStartDate("");
                  setEndDate("");
                }
              }} // 날짜가 선택될 때 호출될 콜백 함수
            />
          </div>
        </div>
        {/* <input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
          }}
        ></input>
        {" ~ "}
        <input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
          }}
        ></input> */}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "90rem",
          marginBottom: "0.69rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <S.DateTitle>{"총 " + consultingList.length + "건"}</S.DateTitle>
          <S.AddButton
            onClick={() => {
              setIsAdd(true);
            }}
          >
            <svg
              width="1rem"
              height="1rem"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <mask id="path-1-inside-1_1701_438" fill="white">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M3 2.5C2.44772 2.5 2 2.94772 2 3.5V10.2273C2 10.7796 2.44771 11.2273 3 11.2273H3.88674L6.36675 14.5L8.84672 11.2273H13C13.5523 11.2273 14 10.7796 14 10.2273V3.5C14 2.94772 13.5523 2.5 13 2.5H3Z"
                />
              </mask>
              <path
                d="M3.88674 11.2273L4.92286 10.4421L4.53271 9.92727H3.88674V11.2273ZM6.36675 14.5L5.33063 15.2851L6.36676 16.6525L7.40287 15.2851L6.36675 14.5ZM8.84672 11.2273V9.92727H8.20074L7.8106 10.4421L8.84672 11.2273ZM3.3 3.5C3.3 3.66569 3.16569 3.8 3 3.8V1.2C1.72974 1.2 0.7 2.22975 0.7 3.5H3.3ZM3.3 10.2273V3.5H0.7V10.2273H3.3ZM3 9.92727C3.16569 9.92727 3.3 10.0616 3.3 10.2273H0.7C0.7 11.4975 1.72974 12.5273 3 12.5273V9.92727ZM3.88674 9.92727H3V12.5273H3.88674V9.92727ZM2.85062 12.0124L5.33063 15.2851L7.40287 13.7149L4.92286 10.4421L2.85062 12.0124ZM7.40287 15.2851L9.88285 12.0124L7.8106 10.4421L5.33063 13.7149L7.40287 15.2851ZM13 9.92727H8.84672V12.5273H13V9.92727ZM12.7 10.2273C12.7 10.0616 12.8343 9.92727 13 9.92727V12.5273C14.2703 12.5273 15.3 11.4975 15.3 10.2273H12.7ZM12.7 3.5V10.2273H15.3V3.5H12.7ZM13 3.8C12.8343 3.8 12.7 3.66568 12.7 3.5H15.3C15.3 2.22975 14.2703 1.2 13 1.2V3.8ZM3 3.8H13V1.2H3V3.8Z"
                fill="#791285"
                mask="url(#path-1-inside-1_1701_438)"
              />
              <rect
                x="4.70258"
                y="6.1543"
                width="1.41818"
                height="1.41818"
                fill="#791285"
              />
              <rect
                x="9.8772"
                y="6.1543"
                width="1.41818"
                height="1.41818"
                fill="#791285"
              />
              <rect
                x="7.28986"
                y="6.1543"
                width="1.41818"
                height="1.41818"
                fill="#791285"
              />
            </svg>
            상담 추가
          </S.AddButton>
        </div>
        <S.SearchInput
          placeholder="        원번, 이름, 제목, 내용을 입력하세요."
          value={studentSearch}
          onChange={(e) => {
            setStudentSearch(e.target.value);
          }}
        ></S.SearchInput>
      </div>
      <S.ConsultingTable style={{ width: "90rem" }}>
        <thead>
          <tr>
            <S.ConsultingTh
              style={{ width: "3.125rem", height: "2rem" }}
            ></S.ConsultingTh>
            <S.ConsultingTh style={{ width: "9.25rem" }}>
              원생 번호
            </S.ConsultingTh>
            <S.ConsultingTh style={{ width: "13.5rem" }} colSpan={2}>
              원생 이름
            </S.ConsultingTh>
            <S.ConsultingTh style={{ width: "8.375rem" }}>
              부모님 전화번호
            </S.ConsultingTh>
            <S.ConsultingTh style={{ width: "15.125rem" }}>제목</S.ConsultingTh>
            <S.ConsultingTh style={{ width: "15.1875rem" }}>
              내용
            </S.ConsultingTh>
            <S.ConsultingTh style={{ width: "8.4375rem" }}>
              상담 등록일
            </S.ConsultingTh>
            <S.ConsultingTh style={{ width: "8.4375rem" }}>
              상담 선생님
            </S.ConsultingTh>
            <S.ConsultingTh style={{ width: "8.0625em" }}>동작</S.ConsultingTh>
          </tr>
        </thead>
        <tbody>
          {consultingList
            ?.filter((_, index) => {
              if (
                index < (consultingPage + 1) * pageTagNumber &&
                index >= consultingPage * pageTagNumber
              ) {
                return true;
              } else {
                return false;
              }
            })
            .map((el, index) => (
              <tr>
                <S.ConsultingTd style={{ padding: "4px" }}>
                  {index + 1}
                </S.ConsultingTd>
                <S.ConsultingTd>{el?.student?.origin}</S.ConsultingTd>
                <S.ConsultingTd
                  style={{
                    borderRight: "none",
                    width: "6.75rem",
                    maxWidth: "6.75rem",
                    textAlign: "end",
                  }}
                >
                  {el?.student?.korName}
                  {/* 테스트트트 */}
                </S.ConsultingTd>
                <S.ConsultingTd
                  style={{
                    overflow: "visible",
                    borderLeft: "none",
                    textAlign: "start",
                    width: "6.1275rem",
                    maxWidth: "6.1275rem",
                  }}
                >
                  {/* {"(" + el?.student?.engName + ")"} */}
                  <CheckToolTipClass
                    text={"(" + el?.student?.engName + ")"}
                    number={80}
                    korName={el?.student?.korName}
                  ></CheckToolTipClass>
                  {/* 테스트트트트트트 */}
                </S.ConsultingTd>
                <S.ConsultingTd>{el?.student?.pmobileno}</S.ConsultingTd>
                <S.ConsultingTd style={{ padding: "0 5px" }}>
                  {el?.title}
                </S.ConsultingTd>
                <S.ConsultingTd
                  style={{ padding: "0 5px", maxWidth: "15.1875rem" }}
                >
                  {el?.contents}
                </S.ConsultingTd>
                <S.ConsultingTd>
                  {"20" +
                    dateInputToDot(el?.createdAt) +
                    " (" +
                    dateInputToDay(el?.createdAt) +
                    ")"}
                </S.ConsultingTd>
                <S.ConsultingTd>{el?.writer?.profile?.korName}</S.ConsultingTd>
                <S.ConsultingTd style={{ overflow: "visible" }}>
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <TooltipButton text={"원생 정보"}>
                      <S.EditButton
                        onClick={() => {
                          localStorage.setItem("academyDetailTab", "profile");
                          router.push(
                            `/${router.query.branch}/academy/${el.student.id}`
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
                          <rect width="16" height="16" fill="white" />
                          <path
                            d="M4.28418 8.65952C4.88472 9.26005 5.61394 9.56032 6.47185 9.56032C7.32976 9.56032 8.05898 9.26005 8.65952 8.65952C9.26005 8.05898 9.56032 7.32976 9.56032 6.47185C9.56032 5.61394 9.26005 4.88472 8.65952 4.28418C8.05898 3.68365 7.32976 3.38338 6.47185 3.38338C5.61394 3.38338 4.88472 3.68365 4.28418 4.28418C3.68365 4.88472 3.38338 5.61394 3.38338 6.47185C3.38338 7.32976 3.68365 8.05898 4.28418 8.65952ZM10.5898 9.56032L14 12.9705L12.9705 14L9.56032 10.5898V10.0429L9.36729 9.84987C8.55228 10.5576 7.58713 10.9115 6.47185 10.9115C5.22788 10.9115 4.16622 10.4826 3.28686 9.62466C2.42895 8.76676 2 7.71582 2 6.47185C2 5.22788 2.42895 4.17694 3.28686 3.31903C4.16622 2.43968 5.22788 2 6.47185 2C7.71582 2 8.76676 2.43968 9.62466 3.31903C10.4826 4.17694 10.9115 5.22788 10.9115 6.47185C10.9115 6.92225 10.8043 7.437 10.5898 8.01609C10.3753 8.57373 10.1287 9.02413 9.84987 9.36729L10.0429 9.56032H10.5898Z"
                            fill="#333333"
                          />
                        </svg>
                      </S.EditButton>
                    </TooltipButton>
                    <TooltipButton text={"상담 수정"}>
                      <S.EditButton onClick={onClickOpenEditModal(el)}>
                        <svg
                          width="12"
                          height="13"
                          viewBox="0 0 12 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.8125 3.1875L10.5938 4.40625L8.09375 1.90625L9.3125 0.6875C9.4375 0.5625 9.59375 0.5 9.78125 0.5C9.96875 0.5 10.125 0.5625 10.25 0.6875L11.8125 2.25C11.9375 2.375 12 2.53125 12 2.71875C12 2.90625 11.9375 3.0625 11.8125 3.1875ZM0 10L7.375 2.625L9.875 5.125L2.5 12.5H0V10Z"
                            fill="#333333"
                          />
                        </svg>
                      </S.EditButton>
                    </TooltipButton>
                    <TooltipButton text={"상담 삭제"}>
                      <S.EditButton onClick={onClickOpenDeleteModal(el, index)}>
                        <svg
                          width="10"
                          height="13"
                          viewBox="0 0 10 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.65625 1.15625V2.5H0.34375V1.15625H2.65625L3.34375 0.5H6.65625L7.34375 1.15625H9.65625ZM1 11.1562V3.15625H9V11.1562C9 11.5104 8.86458 11.8229 8.59375 12.0938C8.32292 12.3646 8.01042 12.5 7.65625 12.5H2.34375C1.98958 12.5 1.67708 12.3646 1.40625 12.0938C1.13542 11.8229 1 11.5104 1 11.1562Z"
                            fill="#333333"
                          />
                        </svg>
                      </S.EditButton>
                    </TooltipButton>
                  </div>
                </S.ConsultingTd>
              </tr>
            ))}
        </tbody>
      </S.ConsultingTable>
      <div
        style={{
          display: "flex",
          width: "90rem",
          justifyContent: "center",
          marginTop: "1.25rem",
        }}
      >
        <AcademyPageNumber
          style={{
            margin: "0 0.31rem",
            color: consultingPage === 0 ? "#c8c8c8" : "",
          }}
          onClick={() => {
            if (consultingPage > 0) {
              setAcademyPage(0);
            }
          }}
        >
          {"<<"}
        </AcademyPageNumber>
        <AcademyPageNumber
          style={{
            margin: "0 0.31rem",
            color: consultingPage === 0 ? "#c8c8c8" : "",
          }}
          onClick={() => {
            if (consultingPage > 0) {
              setAcademyPage(consultingPage - 1);
            }
          }}
        >
          {"<"}
        </AcademyPageNumber>
        {Array(maxConsultingPage)
          .fill(0)
          .map((el, index) => {
            return (
              <div
                style={
                  index === consultingPage
                    ? {
                        width: "1.875rem",
                        height: "1.9375rem",
                        color: "#ffffff",
                        backgroundColor: "#791285",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }
                    : {
                        width: "1.875rem",
                        height: "1.9375rem",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                      }
                }
                onClick={() => {
                  setConsultingPage(index);
                }}
              >
                {index + 1}
              </div>
            );
          })}
        <AcademyPageNumber
          style={{
            margin: "0 0.31rem",
            color: consultingPage === maxConsultingPage - 1 ? "#c8c8c8" : "",
          }}
          onClick={() => {
            if (consultingPage < maxConsultingPage - 1) {
              setAcademyPage(consultingPage + 1);
            }
          }}
        >
          {">"}
        </AcademyPageNumber>
        <AcademyPageNumber
          style={{
            margin: "0 0.31rem",
            color: consultingPage === maxConsultingPage - 1 ? "#c8c8c8" : "",
          }}
          onClick={() => {
            if (consultingPage < maxConsultingPage - 1) {
              setAcademyPage(consultingPage - 1);
            }
          }}
        >
          {">>"}
        </AcademyPageNumber>
      </div>
      {isAdd && (
        <Modal
          open={isAdd}
          footer={null}
          closable={false}
          onCancel={() => {
            setIsAdd(false);
            setAddStudentSearch("");
            setAddStudent("");
            setAddTitle("");
            setAddContents("");
            setAddDate(dateToInput(new Date()));
          }}
          width={"40.125rem"}
        >
          <S.AddModalTitle style={{ display: "flex", alignItems: "center" }}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "0.62rem" }}
            >
              <mask id="path-1-inside-1_1867_4125" fill="white">
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M1 0C0.447715 0 0 0.447716 0 1V7.72727C0 8.27956 0.447715 8.72727 1 8.72727H1.88674L4.36675 12L6.84672 8.72727H11C11.5523 8.72727 12 8.27956 12 7.72727V1C12 0.447715 11.5523 0 11 0H1Z"
                />
              </mask>
              <path
                d="M1.88674 8.72727L2.92286 7.94212L2.53271 7.42727H1.88674V8.72727ZM4.36675 12L3.33063 12.7851L4.36676 14.1525L5.40287 12.7851L4.36675 12ZM6.84672 8.72727V7.42727H6.20074L5.8106 7.94213L6.84672 8.72727ZM1.3 1C1.3 1.16569 1.16569 1.3 1 1.3V-1.3C-0.270256 -1.3 -1.3 -0.270253 -1.3 1H1.3ZM1.3 7.72727V1H-1.3V7.72727H1.3ZM1 7.42727C1.16569 7.42727 1.3 7.56159 1.3 7.72727H-1.3C-1.3 8.99753 -0.270256 10.0273 1 10.0273V7.42727ZM1.88674 7.42727H1V10.0273H1.88674V7.42727ZM0.850621 9.51242L3.33063 12.7851L5.40287 11.2149L2.92286 7.94212L0.850621 9.51242ZM5.40287 12.7851L7.88285 9.51242L5.8106 7.94213L3.33063 11.2149L5.40287 12.7851ZM11 7.42727H6.84672V10.0273H11V7.42727ZM10.7 7.72727C10.7 7.56159 10.8343 7.42727 11 7.42727V10.0273C12.2703 10.0273 13.3 8.99752 13.3 7.72727H10.7ZM10.7 1V7.72727H13.3V1H10.7ZM11 1.3C10.8343 1.3 10.7 1.16568 10.7 1H13.3C13.3 -0.270254 12.2703 -1.3 11 -1.3V1.3ZM1 1.3H11V-1.3H1V1.3Z"
                fill="#791285"
                mask="url(#path-1-inside-1_1867_4125)"
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
          </S.AddModalTitle>
          {addStudent === "" ? (
            <>
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
                <div style={{ width: "53rem", height: "42.6rem" }}>
                  <S.ModalInput
                    value={addStudentSearch}
                    onChange={(e) => {
                      setAddStudentSearch(e.target.value);
                    }}
                    placeholder="        원번 혹은 이름을 입력하세요."
                  ></S.ModalInput>
                  <div
                    style={{
                      height: "35.625rem",
                      overflow: "scroll",
                      overflowX: "hidden",
                    }}
                  >
                    {" "}
                    <table
                      style={{
                        width: "37.125rem",
                        overflow: "scroll",
                        overflowX: "hidden",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead
                        style={{
                          position: "sticky",
                          top: -1,
                          zIndex: 5,
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
                            style={{
                              width: "15.9375rem",
                              textAlign: "center",
                              background: "#791285",
                            }}
                            colSpan={2}
                          >
                            원생 이름
                          </S.AddModalTh>
                          <S.AddModalTh
                            style={{
                              width: "9.5625rem",
                              textAlign: "center",
                              background: "#791285",
                            }}
                          >
                            선택
                          </S.AddModalTh>
                        </tr>
                      </thead>
                      <tbody>
                        {studentList.map((el) => {
                          return (
                            <tr>
                              <S.AddModalTd>{el.origin}</S.AddModalTd>
                              <S.AddModalTd
                                style={{
                                  width: "8.4rem",
                                  borderRight: "none",
                                  textAlign: "end",
                                  paddingRight: "2px",
                                }}
                              >
                                {el.korName}
                              </S.AddModalTd>
                              <S.AddModalTd
                                style={{
                                  borderLeft: "none",
                                  textAlign: "start",
                                }}
                              >
                                <CheckToolTip
                                  text={" (" + el.engName + ")"}
                                  number={110}
                                  korName={el.korName}
                                ></CheckToolTip>
                              </S.AddModalTd>
                              <S.AddModalTd>
                                <button
                                  onClick={() => {
                                    setAddStudent(el);
                                  }}
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
                                    style={{ marginRight: "0.5rem" }}
                                  >
                                    <path
                                      d="M4 7.28125L11.0625 0.21875L12 1.15625L4 9.15625L0.28125 5.4375L1.21875 4.5L4 7.28125Z"
                                      fill="#333333"
                                    />
                                  </svg>
                                  선택
                                </button>
                              </S.AddModalTd>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </S.ModalClassAddWrapper>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "1.25rem",
                }}
              >
                <S.ConsultingModalOKButton
                  style={{ opacity: "0.5", cursor: "default" }}
                >
                  저장
                </S.ConsultingModalOKButton>
                <S.ConsultingModalCancelButton
                  onClick={() => {
                    setIsAdd(false);
                    setAddStudentSearch("");
                    setAddStudent("");
                    setAddTitle("");
                    setAddContents("");
                    setAddDate(dateToInput(new Date()));
                    setAddTeacherId(myData?.me.id);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  취소
                </S.ConsultingModalCancelButton>
              </div>
            </>
          ) : (
            <>
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
                    value={addStudent?.origin}
                  ></S.ConsultingModalInput>
                </div>
                <S.ConsultingModalBox>
                  <S.ConsultingModalTag>원생 이름</S.ConsultingModalTag>
                  <S.ConsultingModalInput
                    disabled={true}
                    value={
                      addStudent?.korName + " (" + addStudent?.engName + ")"
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
                      value={addDate}
                      onChange={(event) => {
                        setAddDate(event.target.value);
                      }}
                    ></S.ModalBorderLess>
                    <div style={{ position: "absolute", left: "9.5rem" }}>
                      {"(" + dateInputToDay(addDate) + ")"}
                    </div>
                  </S.DateLabel>
                  {/* <S.ConsultingModalInput
                    type="date"
                    value={addDate}
                    onChange={(e) => {
                      setAddDate(e.target.value);
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
                    setAddTeacherId(event.target.value);
                  }}
                >
                  {teacherData?.staffInAcademy.map((el) => {
                    return (
                      <option
                        value={el.id}
                        selected={Number(el.id) === Number(addTeacherId)}
                      >
                        {el?.korName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <S.ConsultingModalTag>제목</S.ConsultingModalTag>
                <S.ConsultingModalBigInput
                  onChange={(e) => {
                    setAddTitle(e.target.value);
                  }}
                  value={addTitle}
                ></S.ConsultingModalBigInput>
              </div>

              <div style={{ marginTop: "1.25rem" }}>
                <S.ConsultingModalTag>내용</S.ConsultingModalTag>
                <S.ConsultingModalTextArea
                  style={{ whiteSpace: "break-spaces" }}
                  onChange={(e) => {
                    setAddContents(e.target.value);
                  }}
                  value={addContents}
                  maxLength={2000}
                ></S.ConsultingModalTextArea>
                <S.ConsultingLength
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  {addContents.length + " / 2000자"}
                </S.ConsultingLength>
              </div>
              {/* <div>
                <div>제목</div>
                <input
                  value={addTitle}
                  onChange={(e) => {
                    setAddTitle(e.target.value);
                  }}
                  style={{ width: "29.1rem" }}
                ></input>
                <div>내용</div>
                <div
                  style={{
                    border: "1px solid",
                    width: "29.5rem",
                    whiteSpace: "break-spaces",
                  }}
                >
                  <S.ConsultingTextArea
                    value={addContents}
                    onChange={(e) => {
                      setAddContents(e.target.value);
                    }}
                    maxLength={2000}
                    style={{ whiteSpace: "break-spaces" }}
                  ></S.ConsultingTextArea>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    {addContents.length + "/2000"}
                  </div>
                </div>
                <div>날짜</div>
                <input
                  type="date"
                  value={addDate}
                  onChange={(e) => {
                    setAddDate(e.target.value);
                  }}
                ></input>
              </div> */}
              <div
                style={{
                  width: "100%",
                  borderTop: "1px solid #dfe1e5",
                  marginTop: "1.25rem",
                }}
              ></div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "1.25rem",
                }}
              >
                <S.ConsultingModalOKButton onClick={onClickConSultingCreate}>
                  저장
                </S.ConsultingModalOKButton>
                <S.ConsultingModalCancelButton
                  onClick={() => {
                    setIsAdd(false);
                    setAddStudentSearch("");
                    setAddStudent("");
                    setAddTitle("");
                    setAddContents("");
                    setAddDate(dateToInput(new Date()));
                    setAddTeacherId(myData?.me.id);
                  }}
                >
                  취소
                </S.ConsultingModalCancelButton>
              </div>
            </>
          )}
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
          width={"40.125rem"}
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
            {selectIndex +
              1 +
              ", 원생 번호 " +
              selectStudent?.student?.korName +
              " (" +
              selectStudent?.student?.engName +
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
      {isEdit && (
        <Modal
          open={isEdit}
          footer={null}
          closable={false}
          width={"40.125rem"}
          onCancel={() => {
            setIsEdit(false);
            setAddTeacherId(myData?.me?.id);
          }}
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
                value={selectStudent?.student?.origin}
              ></S.ConsultingModalInput>
            </div>
            <S.ConsultingModalBox>
              <S.ConsultingModalTag>원생 이름</S.ConsultingModalTag>
              <S.ConsultingModalInput
                disabled={true}
                value={
                  selectStudent?.student?.korName +
                  " (" +
                  selectStudent?.student?.engName +
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
                setAddTeacherId(event.target.value);
              }}
            >
              {teacherData?.staffInAcademy.map((el) => {
                return (
                  <option
                    value={el.id}
                    selected={Number(el.id) === Number(addTeacherId)}
                  >
                    {el?.korName}
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
              {addContents.length + " / 2000자"}
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
                setIsEdit(false);
                setAddTeacherId(myData?.me?.id);
              }}
            >
              취소
            </S.ConsultingModalCancelButton>
          </div>
        </Modal>
      )}
    </S.Wrapper>
  );
}
