import { useMutation, useQuery } from "@apollo/client";
import * as S from "./classList.style";
import { useRouter } from "next/router";
import {
  CREATE_MEMO,
  DELETE_LECTURE,
  GET_ALL_LECTURES,
  GET_CLASS,
  GET_MEMO,
} from "./classList.query";
import { useEffect, useState } from "react";
import { dateToInput, longWord } from "@/src/commons/library/library";
import { DeleteOutlined, MoreOutlined } from "@ant-design/icons";
import { Modal } from "antd";

export default function ClassListPage() {
  const router = useRouter();
  const { data, refetch } = useQuery(GET_ALL_LECTURES, {
    variables: { academyId: Number(router.query.branch) },
  });
  const { data: memoData, refetch: refetchMemo } = useQuery(GET_MEMO, {
    variables: { lectureId: 0 },
  });
  const [deleteLecture] = useMutation(DELETE_LECTURE);
  const [editMemo] = useMutation(CREATE_MEMO);
  const [date, setDate] = useState(new Date());
  const [lecture, setLectures] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [isViewStudents, setIsViewStudents] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const [memoInputs, setMemoInputs] = useState([]);
  const { refetch: refetchLecture } = useQuery(GET_CLASS, {
    variables: {
      academyId: Number(router.query.branch),
      date: dateToInput(date),
    },
  });

  const onChangeDate = (e) => {
    setDate(new Date(e.target.value));
    console.log(e.target.value);
  };
  const onClickDateOne = (int) => () => {
    const newDate = new Date(date.setDate(date.getDate() + int));
    // newDate.setDate(calendarDate.getDate() + number);
    setDate(newDate);
  };

  const onClickDeleteModal = (id) => () => {
    console.log(id);
    setIsDelete(true);
    setDeleteId(id);
  };

  const onClickDeleteLecture = async () => {
    try {
      const result = await deleteLecture({ variables: { id: deleteId } });
      refetch();
      refetchLecture();
    } catch (err) {
      alert("예약한 도서가 있는 원생이 남아있습니다.");
    }
    setIsDelete(false);
  };

  const onClickViewStudents = (id) => async () => {
    try {
      await refetchMemo({ lectureId: Number(id) });
      setIsViewStudents(true);
    } catch {}
  };

  const onClickEditMemo = () => {
    memoInputs?.forEach(async (el, index) => {
      if (memoData?.getLectureMemo?.[index]?.memo !== el.memo) {
        try {
          await editMemo({
            variables: {
              lectureId: Number(el.lectureId),
              studentId: Number(el.studentId),
              memo: el.memo,
            },
          });
        } catch {}
      }
    });
    alert("수정되었습니다.");
    refetch();
    refetchMemo();
  };

  useEffect(() => {
    setLectures(data);
  }, [data, date]);
  useEffect(() => {
    setMemoInputs(
      memoData?.getLectureMemo?.map((el) => {
        return {
          studentId: el.student.id,
          memo: el.memo,
          lectureId: el.lecture.id,
        };
      })
    );
  }, [memoData]);

  const onChangeMemo = (id) => (e) => {
    const newInputs = [...memoInputs];
    newInputs[newInputs.findIndex((el) => el.studentId === id)].memo =
      e.target.value;
    setMemoInputs(newInputs);
  };

  console.log(data, "data");
  return (
    <S.ClassWrapper>
      <S.ClassTitle>수업 목록</S.ClassTitle>
      <div
        style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
      >
        <S.ClassSearchBox>
          <S.AButton onClick={onClickDateOne(-1)}>{"<"}</S.AButton>
          <S.ClassSearchInput
            type="date"
            value={dateToInput(date)}
            onChange={onChangeDate}
          ></S.ClassSearchInput>
          <S.AButton onClick={onClickDateOne(+1)}>{">"}</S.AButton>
        </S.ClassSearchBox>
      </div>

      <S.ClassTable style={{ width: "100%" }}>
        <S.ClassHeaderLeft
          style={{
            width: "10%",
            color: "#000",
            background: "#F7F8FA",
            height: "2.75rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          수업 번호
        </S.ClassHeaderLeft>
        <S.ClassHeader
          style={{
            width: "25%",
            color: "#000",
            background: "#F7F8FA",
            height: "2.75rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          수업 날짜
        </S.ClassHeader>
        <S.ClassHeader
          style={{
            width: "15%",
            color: "#000",
            background: "#F7F8FA",
            height: "2.75rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          수업 시작 시간
        </S.ClassHeader>
        <S.ClassHeader
          style={{
            width: "15%",
            color: "#000",
            background: "#F7F8FA",
            height: "2.75rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          수업 마감 시간
        </S.ClassHeader>
        <S.ClassHeader
          style={{
            width: "50%",
            color: "#000",
            background: "#F7F8FA",
            height: "2.75rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          수업 정보
        </S.ClassHeader>
        <S.ClassHeader
          style={{
            width: "15%",
            color: "#000",
            background: "#F7F8FA",
            height: "2.75rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          담담 선생님
        </S.ClassHeader>
        <S.ClassHeader
          style={{
            width: "10%",
            color: "#000",
            background: "#F7F8FA",
            height: "2.75rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          수강 인원
        </S.ClassHeader>
        <S.ClassHeader
          style={{
            width: "10%",
            color: "#000",
            background: "#F7F8FA",
            height: "2.75rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          수업 삭제
        </S.ClassHeader>
      </S.ClassTable>

      {lecture?.allLectures
        ?.filter((el) => {
          return el.date === dateToInput(date);
        })
        ?.map((el) => {
          return (
            <S.ClassTable style={{ width: "100%" }}>
              <S.ClassBodyLeft style={{ width: "10%" }}>
                {el.id}
              </S.ClassBodyLeft>
              <S.ClassBody style={{ width: "25%" }}>{el.date}</S.ClassBody>
              <S.ClassBody style={{ width: "15%" }}>
                {el.startTime.slice(0, 5)}
              </S.ClassBody>
              <S.ClassBody style={{ width: "15%" }}>
                {el.endTime.slice(0, 5)}
              </S.ClassBody>
              <S.ClassBody style={{ width: "50%" }}>
                {longWord(el.lectureInfo.about)}
              </S.ClassBody>
              <S.ClassBody style={{ width: "15%" }}>
                {el?.teacher?.korName}
              </S.ClassBody>
              <S.ClassBody style={{ width: "10%" }}>
                {el?.students?.length + "명"}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={onClickViewStudents(el.id)}
                  style={{
                    cursor: "pointer",
                    marginTop: "1px",
                    marginLeft: "0.5rem",
                  }}
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
              </S.ClassBody>
              <S.ClassBody style={{ width: "10%" }}>
                <DeleteOutlined
                  style={{ color: "#81858C" }}
                  onClick={onClickDeleteModal(Number(el.id))}
                />
              </S.ClassBody>
            </S.ClassTable>
          );
        })}
      {isViewStudents ? (
        <Modal
          open={isViewStudents}
          onCancel={() => {
            setIsViewStudents(false);
          }}
          footer={null}
          closable={false}
          width={"980px"}
          height={"580px"}
        >
          <div
            style={{
              fontSize: "34px",
              fontFamily: "Spoqa Han Sans Neo",
              fontWeight: "500",
              marginBottom: "25px",
            }}
          >
            강의 메모
          </div>
          <S.ModalWrapper
            style={{ overflow: "scroll", height: "480px", width: "920px" }}
          >
            {memoData?.getLectureMemo?.map((el, index) => {
              return (
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      borderTop: index === 0 ? "1px solid #DBDDE1" : "",
                      height: "58px",
                      width: "165px",
                      borderBottom: "1px solid #DBDDE1",
                      backgroundColor: "#F7F8FA",
                      padding: "15px",
                      fontSize: "14px",
                      fontFamily: "Spoqa Han Sans Neo",
                    }}
                  >
                    {el?.student?.korName}
                  </div>
                  <div
                    style={{
                      borderTop: index === 0 ? "1px solid #DBDDE1" : "",
                      height: "88px",
                      width: "735px",
                      borderBottom: "1px solid #DBDDE1",
                    }}
                  >
                    <textarea
                      style={{
                        border: "none",
                        width: "705px",
                        height: "50px",
                        padding: "15px",
                        fontSize: "14px",
                        fontFamily: "Spoqa Han Sans Neo",
                      }}
                      onChange={onChangeMemo(el.student.id)}
                      value={memoInputs?.[index]?.memo}
                    ></textarea>
                  </div>
                </div>
              );
            })}
          </S.ModalWrapper>

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              margin: "25px 0",
            }}
          >
            <S.DeleteButton
              style={{ backgroundColor: "#EBECEF", color: "#333333" }}
              onClick={onClickEditMemo}
            >
              수정
            </S.DeleteButton>
            <S.DeleteButton
              onClick={() => {
                setIsViewStudents(false);
              }}
              style={{ backgroundColor: "#333333", color: "#FFFFFF" }}
            >
              닫기
            </S.DeleteButton>
          </div>
        </Modal>
      ) : (
        <></>
      )}
      {isDelete ? (
        <Modal
          open={isDelete}
          onCancel={() => {
            setIsDelete(false);
          }}
          footer={null}
          closable={false}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                fontSize: "27px",
                marginBottom: "30px",
                width: "100%",
                fontWeight: "700",
              }}
            >
              수업을 삭제하시겠습니까?
            </div>
            <div>
              <S.DeleteButton
                onClick={onClickDeleteLecture}
                style={{ backgroundColor: "#333", color: "#e1e1e1" }}
              >
                삭제
              </S.DeleteButton>
              <S.DeleteButton
                onClick={() => {
                  setIsDelete(false);
                }}
                style={{ backgroundColor: "#c2c2c2", color: "#1e1e1e" }}
              >
                취소
              </S.DeleteButton>
            </div>
          </div>
        </Modal>
      ) : (
        <></>
      )}
    </S.ClassWrapper>
  );
}
