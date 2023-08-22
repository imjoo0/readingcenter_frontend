import { useMutation, useQuery } from "@apollo/client";
import * as S from "./classList.style";
import { useRouter } from "next/router";
import { DELETE_LECTURE, GET_ALL_LECTURES, GET_CLASS } from "./classList.query";
import { useEffect, useState } from "react";
import { dateToInput, longWord } from "@/src/commons/library/library";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Modal } from "antd";

export default function ClassListPage() {
  const router = useRouter();
  const { data, refetch } = useQuery(GET_ALL_LECTURES, {
    variables: { academyId: Number(router.query.branch) },
  });

  const [deleteLecture] = useMutation(DELETE_LECTURE);
  const [date, setDate] = useState(new Date());
  const [lecture, setLectures] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [isViewStudents, setIsViewStudents] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
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
  const onClickViewStudents = (students) => () => {
    setStudentList(students);
    setIsViewStudents(true);
  };

  useEffect(() => {
    setLectures(data);
  }, [data]);
  console.log(data, "data");
  return (
    <S.ClassWrapper>
      <S.ClassTitle>수업 목록</S.ClassTitle>
      <input
        type="date"
        defaultValue={dateToInput(date)}
        onChange={onChangeDate}
        style={{
          fontSize: "20px",
          padding: "10px",
          marginBottom: "20px",
          border: "1px solid",
        }}
      ></input>

      <S.ClassTable style={{ width: "95%" }}>
        <S.ClassHeaderLeft
          style={{
            width: "10%",
            background: "#42444e",
            color: "#fff",
            textAlign: "left",
          }}
        >
          수업 번호
        </S.ClassHeaderLeft>
        <S.ClassHeader
          style={{
            width: "25%",
            background: "#42444e",
            color: "#fff",
            textAlign: "left",
          }}
        >
          수업 날짜
        </S.ClassHeader>
        <S.ClassHeader
          style={{
            width: "15%",
            background: "#42444e",
            color: "#fff",
            textAlign: "left",
          }}
        >
          수업 시작 시간
        </S.ClassHeader>
        <S.ClassHeader
          style={{
            width: "15%",
            background: "#42444e",
            color: "#fff",
            textAlign: "left",
          }}
        >
          수업 마감 시간
        </S.ClassHeader>
        <S.ClassHeader
          style={{
            width: "50%",
            background: "#42444e",
            color: "#fff",
            textAlign: "left",
          }}
        >
          수업 정보
        </S.ClassHeader>
        <S.ClassHeader
          style={{
            width: "15%",
            background: "#42444e",
            color: "#fff",
            textAlign: "left",
          }}
        >
          담담 선생님
        </S.ClassHeader>
        <S.ClassHeader
          style={{
            width: "10%",
            background: "#42444e",
            color: "#fff",
            textAlign: "left",
          }}
        >
          수강 인원
        </S.ClassHeader>
        <S.ClassHeader
          style={{
            width: "10%",
            background: "#42444e",
            color: "#fff",
            textAlign: "left",
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
            <S.ClassTable style={{ width: "95%" }}>
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
                {longWord(el.lectureInfo)}
              </S.ClassBody>
              <S.ClassBody style={{ width: "15%" }}>
                {el?.teacher?.korName}
              </S.ClassBody>
              <S.ClassBody style={{ width: "10%" }}>
                {el?.students?.length + "명"}
                {/* <PlusOutlined onClick={onClickViewStudents(el.students)} /> */}
              </S.ClassBody>
              <S.ClassBody style={{ width: "10%" }}>
                <DeleteOutlined onClick={onClickDeleteModal(Number(el.id))} />
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
        >
          {studentList.map((el) => {
            return (
              <div>
                <div>{el.korName}</div>
              </div>
            );
          })}
          <S.DeleteButton
            onClick={() => {
              setIsViewStudents(false);
            }}
            style={{ backgroundColor: "#c2c2c2", color: "#1e1e1e" }}
          >
            닫기
          </S.DeleteButton>
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
                style={{ backgroundColor: "purple", color: "#e1e1e1" }}
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
