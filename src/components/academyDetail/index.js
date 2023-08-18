import { FormOutlined } from "@ant-design/icons";
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
  EDIT_STUDENT,
  GET_STUDENT,
  GET_STUDENTS_BY_DATE,
  GET_USERS,
} from "./academyDetail.query";
import {
  dateToClock,
  dateToClockOneHour,
  dateToInput,
} from "@/src/commons/library/library";

export default function AcademyDetailPage() {
  const router = useRouter();
  const { data, refetch } = useQuery(GET_STUDENT, {
    variables: { userId: Number(router.query.id), academyId: Number(router.query.branch) },
  });
  const { refetch: refetchStudents } = useQuery(GET_STUDENTS_BY_DATE);
  const { data: userData, refetch: refetchUsers } = useQuery(GET_USERS);
  const [editStudent] = useMutation(EDIT_STUDENT);
  const [addMemo] = useMutation(ADD_MEMO);
  const [createAttendance] = useMutation(CREATE_ATTENDANCE);
  const [createMakeUp] = useMutation(CREATE_MAKE_UP);
  const [editBirthDay, setEditBirthDay] = useState("");
  const [editMobileNumber, setEditMobileNumber] = useState("");
  const [editPMobileNumber, setEditPMobileNumber] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editMemo, setEditMemo] = useState("");
  const [classToggle, setClassToggle] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [selectDates, setSelectDates] = useState([]);
  const [routineCount, setRoutineCount] = useState(0);
  const [teacherId, setTeacherId] = useState("");
  const [date] = useState(new Date());
  const [addClassStart, setAddClassStart] = useState(dateToClock(date));
  const [addClassEnd, setAddClassEnd] = useState(dateToClockOneHour(date));
  const [addClassDate, setAddClassDate] = useState(dateToInput(date));
  const [addClassInfo, setAddClassInfo] = useState("");
  const [makeUpLectureId, setMakeUpLectureId] = useState("");
  const [selectId, setSelectId] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  
  const onClickRouter = (address) => () => {
    router.push("/2/" + address);
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
    console.log(
      dates.map((el) => {
        return el.getDate();
      })
    );
    setClassToggle(false);
  };

  const onClickCancel = () => {
    setClassToggle(false);
  };

  const onClickCheck = (id, active) => () => {
    setSelectId({ id: id, active: active });
    setIsCheck(true);
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
    console.log(routineCount);
  };

  const onClickMakeUpClass = async () => {
    try {
      await createAttendance({
        variables: {
          lectureId: Number(makeUpLectureId),
          studentId: Number(Number(router.query.id)),
          statusInput: "makeup",
        },
      });
      try {
        await createMakeUp({
          variables: {
            academyId: Number(router.query.branch),
            date: addClassDate,
            startTime: addClassStart,
            endTime: addClassEnd,
            lectureInfo: addClassInfo,
            teacherId: Number(teacherId),
            repeatDays: [-1],
            repeatWeeks: 1,
            studentIds: [Number(router.query.id)],
          },
        });
      } catch (err) {
        alert(err);
        console.log("보강 추가 에러");
      }
    } catch (err) {
      alert(err);
      console.log("출석 에러");
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
    if (data?.userDetails?.profile.birthDate !== editBirthDay) {
      variables.birthDate = editBirthDay;
    }
    if (data?.userDetails?.profile.mobileno !== editMobileNumber) {
      variables.mobileno = editMobileNumber;
    }
    if (data?.userDetails?.profile.pmobileno !== editPMobileNumber) {
      variables.pmobileno = editPMobileNumber;
    }
    if (data?.userDetails?.profile.gender !== editGender) {
      variables.gender = editGender;
    }
    if (data?.userDetails?.email !== editEmail) {
      variables.email = editEmail;
    }
    try {
      const result = await editStudent({ variables });
      try {
        const addResult = await addMemo({
          variables: {
            memo: editMemo,
            userId: Number(router.query.id),
            academyId: Number(router.query.branch),
          },
        });
        alert("수정 되었습니다.");
      } catch (err) {
        alert("메모 내용을 입력해주세요.");
      }
    } catch (err) {
      alert(err);
    }
    refetch();
    setTeacherId(
      userData?.allUsers.filter((el) => el.userCategory === "선생님")[0].id
    );
    setAddClassDate(dateToClock(date));
  };

  useEffect(() => {
    setTeacherId(
      userData?.allUsers.filter((el) => el.userCategory === "선생님")[0].id
    );
  }, [userData]);
  useEffect(() => {
    setEditBirthDay(data?.userDetails?.profile.birthDate);
    setEditMobileNumber(data?.userDetails?.profile.mobileno);
    setEditPMobileNumber(data?.userDetails?.profile.pmobileno);
    setEditGender(data?.userDetails?.profile.gender);
    setEditEmail(data?.userDetails?.email);
    setEditMemo(
      data?.userDetails?.memos?.filter((el) => {
        console.log(el.academy.id);
        return el.academy.id === router.query.branch;
      })?.[0]?.memo
    );
  }, [data]);

  console.log(userData);

  return (
    <S.AcademyDetailWrapper>
      <S.AcademyDetailTitle>원생 정보 상세보기</S.AcademyDetailTitle>
      <S.TitleLine></S.TitleLine>
      <S.EditBox>
        {/* <S.ImageBox>
          {imageURL !== "" ? (
            <img src={imageURL} width={"200px"} height={"200px"}></img>
          ) : (
            <img src="/sample.png" width={"200px"} height={"200px"}></img>
          )}

          <input type="file" onChange={onClickImageURL}></input>
        </S.ImageBox> */}
        <div>
          <S.InputBox>
            <S.InputBoxLeft>
              <S.InputTag>
                <S.InputName>이름</S.InputName>
                <S.InputInput
                  value={
                    data?.userDetails?.profile.korName +
                    "(" +
                    data?.userDetails?.profile.engName +
                    ")"
                  }
                ></S.InputInput>
              </S.InputTag>
              <S.InputTag>
                <S.InputName>원번</S.InputName>
                <S.InputInput
                  value={data?.userDetails?.profile?.origin}
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
              <S.InputTag>
                <S.InputName>등록일</S.InputName>
                <S.InputInput
                  type="date"
                  value={data?.userDetails?.profile.registerDate.slice(0, 10)}
                ></S.InputInput>
              </S.InputTag>
            </S.InputBoxLeft>
            <S.InputBoxRight>
              <S.InputTag>
                <S.InputName>학부모 전화번호</S.InputName>
                <S.InputInput
                  onChange={(e) => {
                    setEditPMobileNumber(e.target.value);
                  }}
                  defaultValue={data?.userDetails?.profile.pmobileno}
                ></S.InputInput>
              </S.InputTag>
              <S.InputTag>
                <S.InputName>원생 전화번호</S.InputName>
                <S.InputInput
                  onChange={(e) => {
                    setEditMobileNumber(e.target.value);
                  }}
                  defaultValue={data?.userDetails?.profile.mobileno}
                ></S.InputInput>
              </S.InputTag>
              <S.InputTag>
                <S.InputName>이메일</S.InputName>
                <S.InputInput
                  onChange={(e) => {
                    setEditEmail(e.target.value);
                  }}
                  defaultValue={data?.userDetails?.email}
                ></S.InputInput>
              </S.InputTag>
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
            </S.InputBoxRight>
          </S.InputBox>
        </div>
        <div style={{ display: "flex" }}>
          <S.InputBox style={{ height: "5vh", marginLeft: "30px" }}>
            <S.InputName>메모</S.InputName>
          </S.InputBox>
          <textarea
            style={{
              marginLeft: "30px",
              width: "30vw",
              height: "80%",
              fontSize: "18px",
              resize: "none",
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
        </div>
      </S.EditBox>
      <S.ButtonBox>
        <S.RouteButton onClick={onClickCheck(data?.userDetails?.id, data?.userDetails?.isActive)}>
          {data?.userDetails?.isActive ? "휴원 처리" : "휴원 처리 철회"}
        </S.RouteButton>
        <S.RouteButton onClick={onClickRouter("academy")}>목록</S.RouteButton>
        <S.RouteButton onClick={onClickEdit}>수정</S.RouteButton>
      </S.ButtonBox>
      <S.Table>
        <S.TableHeaderRound>
          <S.TableHeadLeft style={{ width: "70%" }}>수업 날짜</S.TableHeadLeft>
          <S.TableHead style={{ width: "70%" }}>수업 시간</S.TableHead>
          <S.TableHead style={{ width: "40%" }}>담당</S.TableHead>
          <S.TableHead style={{ width: "30%" }}>출석현황</S.TableHead>
          <S.TableHead>강의 정보</S.TableHead>
          <S.TableHead style={{ width: "30%" }}>보강 학습 추가</S.TableHead>
        </S.TableHeaderRound>
        {data?.userDetails?.profile?.lectures
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
                <S.TableHead>{el.lectureInfo}</S.TableHead>
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
              <div>
                <div>수업 시간</div>
              </div>
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
    </S.AcademyDetailWrapper>
  );
}
