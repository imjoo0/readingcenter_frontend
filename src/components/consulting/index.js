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
import { dateToInput } from "@/src/commons/library/library";
import { el } from "date-fns/locale";
import { useRouter } from "next/router";

const pageTagNumber = 5;
export default function ConsultingPage() {
  const router = useRouter();
  const [consultingList, setConsultingList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const { data: myData } = useQuery(GET_ME);
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
      <S.Title>상담 관리</S.Title>
      {/* <S.SubTitle>상담 리스트</S.SubTitle> */}
      <div>
        <input
          placeholder="원번, 이름을 입력하세요."
          value={studentSearch}
          onChange={(e) => {
            setStudentSearch(e.target.value);
          }}
        ></input>
        <span>기간</span>
        <input
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
        ></input>
        <button
          onClick={() => {
            setIsAdd(true);
          }}
        >
          추가
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>원번</th>
            <th>학생 이름</th>
            <th>학부모 전화번호</th>
            <th>제목</th>
            <th>내용</th>
            <th>상담 등록일</th>
            <th>확인 / 삭제</th>
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
                <th>{el?.student?.origin}</th>
                <th>
                  {el?.student?.korName + "(" + el?.student?.engName + ")"}
                </th>
                <th>{el?.student?.pmobileno}</th>
                <th>{el?.title}</th>
                <th>{el?.contents}</th>
                <th>{el?.createdAt}</th>
                <th>
                  <button onClick={onClickOpenEditModal(el)}>수정</button>
                  <button onClick={onClickOpenDeleteModal(el?.id)}>삭제</button>
                </th>
              </tr>
            ))}
        </tbody>
      </table>
      <div style={{ display: "flex" }}>
        {Array(maxConsultingPage)
          .fill(0)
          .map((el, index) => {
            return (
              <div
                style={
                  index === consultingPage
                    ? {
                        color: "#ffffff",
                        backgroundColor: "#333",
                        width: "1.3rem",
                        display: "flex",
                        justifyContent: "center",
                      }
                    : {
                        width: "1.3rem",
                        display: "flex",
                        justifyContent: "center",
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
        >
          {addStudent === "" ? (
            <>
              <input
                value={addStudentSearch}
                onChange={(e) => {
                  setAddStudentSearch(e.target.value);
                }}
                placeholder="이름 혹은 원번을 입력하세요."
              ></input>
              <table>
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
              </table>
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
