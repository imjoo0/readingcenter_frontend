import { useMutation, useQuery } from "@apollo/client";
import * as S from "./classList.style";
import { useRouter } from "next/router";
import { DELETE_LECTURE, GET_ALL_LECTURES } from "./classList.query";
import { useEffect, useState } from "react";
import { dateToInput } from "@/src/commons/library/library";
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

  const onChangeDate = (e) => {
    setDate(new Date(e.target.value));
    console.log(e.target.value);
  };
  const onClickDeleteLecture = (id) => async () => {
    try {
      const result = await deleteLecture({ variables: { id: id } });
      refetch();
    } catch (err) {
      alert(err);
    }
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
      <S.ClassTitleLine></S.ClassTitleLine>
      <input
        type="date"
        defaultValue={dateToInput(date)}
        onChange={onChangeDate}
      ></input>

      <S.ClassTable>
        <S.ClassHeaderLeft style={{ width: "10%" }}>
          수업 번호
        </S.ClassHeaderLeft>
        <S.ClassHeader style={{ width: "25%" }}>수업 날짜</S.ClassHeader>
        <S.ClassHeader style={{ width: "20%" }}>수업 시작 시간</S.ClassHeader>
        <S.ClassHeader style={{ width: "20%" }}>수업 마감 시간</S.ClassHeader>
        <S.ClassHeader style={{ width: "15%" }}>담담 선생님</S.ClassHeader>
        <S.ClassHeader style={{ width: "10%" }}>수강 인원</S.ClassHeader>
        <S.ClassHeader style={{ width: "10%" }}>수업 삭제</S.ClassHeader>
      </S.ClassTable>

      {lecture?.allLectures
        ?.filter((el) => {
          return el.date === dateToInput(date);
        })
        ?.map((el) => {
          return (
            <S.ClassTable>
              <S.ClassBodyLeft style={{ width: "10%" }}>
                {el.id}
              </S.ClassBodyLeft>
              <S.ClassBody style={{ width: "25%" }}>{el.date}</S.ClassBody>
              <S.ClassBody style={{ width: "20%" }}>
                {el.startTime.slice(0, 5)}
              </S.ClassBody>
              <S.ClassBody style={{ width: "20%" }}>
                {el.endTime.slice(0, 5)}
              </S.ClassBody>
              <S.ClassBody style={{ width: "15%" }}>
                {el.teacher.korName}
              </S.ClassBody>
              <S.ClassBody style={{ width: "10%" }}>
                {el.students.length + "명"}
                <PlusOutlined onClick={onClickViewStudents(el.students)} />
              </S.ClassBody>
              <S.ClassBody style={{ width: "10%" }}>
                <DeleteOutlined onClick={onClickDeleteLecture(Number(el.id))} />
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
              <S.ClassTable>
                <S.ClassBodyLeft>{el.korName}</S.ClassBodyLeft>
                <S.ClassBody>{el.korName}</S.ClassBody>
              </S.ClassTable>
            );
          })}
          ;
          <button
            onClick={() => {
              setIsViewStudents(false);
            }}
          >
            닫기
          </button>
        </Modal>
      ) : (
        <></>
      )}
    </S.ClassWrapper>
  );
}
