import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import {
  CREATE_CONSULTING,
  DELETE_CONSULTING,
  GET_ALL_STUDENTS,
  GET_ME,
  GET_TEACHER_CONSULTING,
  UPDATE_CONSULTING,
} from "./consulting.query";
import * as S from "./consulting.style";
import { Modal } from "antd";
import {
  dateToInput,
  longConsulting,
  longWord,
} from "@/src/commons/library/library";
import { el } from "date-fns/locale";
import { useRouter } from "next/router";
import { DatePicker } from "antd";

const pageTagNumber = 12;
export default function ConsultingPage() {
  const router = useRouter();
  const [consultingList, setConsultingList] = useState([]);
  const [studentList, setStudentList] = useState([]);
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
    GET_TEACHER_CONSULTING,
    { variables: { userId: Number(myData?.me?.id) } }
  );
  const [deleteConsulting] = useMutation(DELETE_CONSULTING);
  const [updateConsulting] = useMutation(UPDATE_CONSULTING);
  const [createConsulting] = useMutation(CREATE_CONSULTING);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectId, setSelectId] = useState("");
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
  const { data: studentData } = useQuery(GET_ALL_STUDENTS, {
    variables: { academyId: Number(router.query.branch) },
  });

  const onClickOpenDeleteModal = (id) => () => {
    setIsDelete(true);
    setSelectId(id);
  };

  const onClickOpenEditModal = (el) => () => {
    setIsEdit(true);
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
          writerId: Number(myData?.me.id),
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
      setIsEdit(false);
      alert("상담을 수정했습니다.");
    } catch (err) {}
  };

  useEffect(() => {
    if (studentData !== undefined) {
      setStudentList(
        studentData?.studentsInAcademy?.filter((el) => {
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
      setConsultingList(
        consultingData?.getAllConsulting
          ?.filter((el) => {
            return (
              el.student.korName.includes(studentSearch) ||
              el.student.origin.includes(studentSearch)
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
              return (
                el.student.korName.includes(studentSearch) ||
                el.student.origin.includes(studentSearch)
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
  }, [consultingData, studentSearch, startDate, endDate]);
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
        }}
      >
        <S.DateTitle>조회 기간</S.DateTitle>
        <div>
          <DatePicker.RangePicker
            style={{
              width: "17.1875rem",
              height: "2.6875rem",
              color: "#333",
              fontSize: "1rem",
              fontWeight: "500",
            }}
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
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.65625 6.15625H5.65625V10.1562H4.34375V6.15625H0.34375V4.84375H4.34375V0.84375H5.65625V4.84375H9.65625V6.15625Z"
                fill="#791285"
              />
            </svg>
            상담 추가
          </S.AddButton>
        </div>
        <S.SearchInput
          placeholder="        원번, 이름을 입력하세요."
          value={studentSearch}
          onChange={(e) => {
            setStudentSearch(e.target.value);
          }}
        ></S.SearchInput>
      </div>
      <S.ConsultingTable style={{ width: "90rem" }}>
        <thead>
          <tr>
            <S.ConsultingTh style={{ width: "6.37rem" }}>
              원생 번호
            </S.ConsultingTh>
            <S.ConsultingTh style={{ width: "13.75rem" }}>
              원생 이름
            </S.ConsultingTh>
            <S.ConsultingTh style={{ width: "8.44rem" }}>
              학부모 전화번호
            </S.ConsultingTh>
            <S.ConsultingTh style={{ width: "22.06rem" }}>제목</S.ConsultingTh>
            <S.ConsultingTh style={{ width: "22.81rem" }}>내용</S.ConsultingTh>
            <S.ConsultingTh style={{ width: "6.75rem" }}>
              상담 등록일
            </S.ConsultingTh>
            <S.ConsultingTh style={{ width: "9.75rem" }}>
              수정/삭제
            </S.ConsultingTh>
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
            .map((el) => (
              <tr>
                <S.ConsultingTd>{el?.student?.origin}</S.ConsultingTd>
                <S.ConsultingTd>
                  {el?.student?.korName + "(" + el?.student?.engName + ")"}
                </S.ConsultingTd>
                <S.ConsultingTd>{el?.student?.pmobileno}</S.ConsultingTd>
                <S.ConsultingTd>{el?.title}</S.ConsultingTd>
                <S.ConsultingTd>{el?.contents}</S.ConsultingTd>
                <S.ConsultingTd>{el?.createdAt}</S.ConsultingTd>
                <S.ConsultingTd>
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
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
                      </svg>{" "}
                      수정
                    </S.EditButton>
                    <span>|</span>
                    <S.EditButton onClick={onClickOpenDeleteModal(el?.id)}>
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
                      </svg>{" "}
                      삭제
                    </S.EditButton>
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
          {addStudent === "" ? (
            <>
              <S.AddModalTitle
                style={{ display: "flex", alignItems: "center" }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 6.84564H6.84564V12H5.15436V6.84564H0V5.15436H5.15436V0H6.84564V5.15436H12V6.84564Z"
                    fill="#791285"
                  />
                </svg>
                상담 추가
              </S.AddModalTitle>
              <input
                value={addStudentSearch}
                onChange={(e) => {
                  setAddStudentSearch(e.target.value);
                }}
                placeholder="이름 혹은 원번을 입력하세요."
              ></input>
              <S.AddConsultingTable>
                <thead>
                  <tr>
                    <th>원번</th>
                    <th>이름</th>
                    <th>체크</th>
                  </tr>
                </thead>
                <tbody>
                  {studentList.map((el) => {
                    return (
                      <tr>
                        <td>{el.origin}</td>
                        <td>{el.korName}</td>
                        <td>
                          <button
                            onClick={() => {
                              setAddStudent(el);
                            }}
                          >
                            선택
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </S.AddConsultingTable>
              <button
                onClick={() => {
                  setIsAdd(false);
                  setAddStudentSearch("");
                  setAddStudent("");
                  setAddTitle("");
                  setAddContents("");
                  setAddDate(dateToInput(new Date()));
                }}
              >
                취소
              </button>
            </>
          ) : (
            <>
              <div>
                <div>{addStudent.korName + "원생 상담"}</div>
                <div>제목</div>
                <input
                  value={addTitle}
                  onChange={(e) => {
                    setAddTitle(e.target.value);
                  }}
                ></input>
                <div>내용</div>
                <input
                  value={addContents}
                  onChange={(e) => {
                    setAddContents(e.target.value);
                  }}
                ></input>
                <div>날짜</div>
                <input
                  type="date"
                  value={addDate}
                  onChange={(e) => {
                    setAddDate(e.target.value);
                  }}
                ></input>
              </div>
              <div>
                <button
                  onClick={() => {
                    setIsAdd(false);
                    setAddStudentSearch("");
                    setAddStudent("");
                    setAddTitle("");
                    setAddContents("");
                    setAddDate(dateToInput(new Date()));
                  }}
                >
                  취소
                </button>
                <button onClick={onClickConSultingCreate}>저장</button>
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
      {isEdit && (
        <Modal
          open={isEdit}
          footer={null}
          closable={false}
          onCancel={() => {
            setIsEdit(false);
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
                setIsEdit(false);
              }}
            >
              취소
            </button>
            <button onClick={onClickConSultingEdit}>수정</button>
          </div>
        </Modal>
      )}
    </S.Wrapper>
  );
}
