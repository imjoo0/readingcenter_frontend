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
} from "./academyDetail.query";
import {
  dateToClock,
  dateToClockOneHour,
  dateToInput,
} from "@/src/commons/library/library";
import { noSSR } from "next/dynamic";

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
  const [editStudent] = useMutation(EDIT_STUDENT);
  const [addMemo] = useMutation(ADD_MEMO);
  const [createAttendance] = useMutation(CREATE_ATTENDANCE);
  const [createMakeUp] = useMutation(CREATE_MAKE_UP);
  const [editLectureMemo] = useMutation(CREATE_MEMO);
  const [stopAcademy] = useMutation(STOP_ACADEMY);
  const [updateLecture] = useMutation(UPDATE_LECTURE);
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
  const [teacherId, setTeacherId] = useState(0);
  const [date] = useState(new Date());
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
  const [isEdit, setIsEdit] = useState(false);
  const [editDate, setEditDate] = useState(dateToInput(date));
  const [editEndTime, setEditEndTime] = useState(dateToClockOneHour(date));
  const [editStartTime, setEditStartTime] = useState(dateToClock(date));
  const [editInfo, setEditInfo] = useState("");
  const [editAcademy, setEditAcademy] = useState(0);
  const [lectureId, setLectureId] = useState(0);

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

  const onClickCheck = (id, active) => async () => {
    setSelectId({ id: id, active: active });
    // setIsCheck(true);
    try {
      await stopAcademy({ variables: { userId: Number(router.query.id) } });
    } catch (err) {
      console.log(err);
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
      }
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
            memo: editMemo === "" ? "원생 특이 사항" : editMemo,
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

  const onClickUpdateLecture = async () => {
    // console.log(
    //   Number(router.query.id),
    //   Number(lectureId),
    //   editAcademy,
    //   editDate,
    //   editStartTime,
    //   editEndTime,
    //   Number(teacherId)
    // );
    try {
      const result = await updateLecture({
        variables: {
          lectureId: Number(lectureId),
          date: editDate,
          studentIds: [Number(router.query.id)],
          startTime: editStartTime,
          endTime: editEndTime,
          academyId: editAcademy,
          teacherId: Number(teacherId),
          lectureMemo: editInfo,
        },
      });
      refetch();
      refetchUsers();
      refetchStudents();
      setIsEdit(false);
      setEditDate(dateToInput(date));
      setEditStartTime(dateToClock(date));
      setEditEndTime(dateToClockOneHour(date));
      setTeacherId(
        userData?.allUsers
          .filter((el) => el.userCategory === "선생님")
          .filter((el) => {
            return (
              Number(el.profile.academy.id) === Number(router.query.branch)
            );
          })[0].id
      );
      setEditAcademy(Number(router.query.branch));
      setEditInfo("");
    } catch (err) {
      console.log(err);
    }
  };
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

  console.log(data);

  useEffect(() => {
    setEditAcademy(Number(router.query.branch));
  }, [router]);

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
                value={
                  data?.userDetails?.profile.korName +
                  "(" +
                  data?.userDetails?.profile.engName +
                  ")"
                }
              ></S.InputInput>
            </S.InputTag>
            <S.InputTag>
              <S.InputName>학부모 전화번호</S.InputName>
              <S.InputInput
                onChange={(e) => {
                  setEditPMobileNumber(e.target.value);
                }}
                defaultValue={data?.userDetails?.profile.pmobileno}
              ></S.InputInput>
            </S.InputTag>
          </S.TagLine>
          <S.TagLine>
            <S.InputTag>
              <S.InputName>원번</S.InputName>
              <S.InputInput
                value={data?.userDetails?.profile?.origin}
              ></S.InputInput>
            </S.InputTag>
            <S.InputTag>
              <S.InputName>연락처</S.InputName>
              <S.InputInput
                onChange={(e) => {
                  setEditMobileNumber(e.target.value);
                }}
                defaultValue={data?.userDetails?.profile.mobileno}
              ></S.InputInput>
            </S.InputTag>
          </S.TagLine>
          <S.TagLine>
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
              <S.InputName>이메일</S.InputName>
              <S.InputInput
                onChange={(e) => {
                  setEditEmail(e.target.value);
                }}
                defaultValue={data?.userDetails?.email}
              ></S.InputInput>
            </S.InputTag>
          </S.TagLine>
          <S.TagLine>
            <S.InputTag>
              <S.InputName>등록일</S.InputName>
              <S.InputInput
                type="date"
                value={data?.userDetails?.profile.registerDate.slice(0, 10)}
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
      <S.Table>
        <S.TableHeaderRound>
          <S.TableHeadLeft style={{ width: "70%" }}>수업 날짜</S.TableHeadLeft>
          <S.TableHead style={{ width: "70%" }}>수업 시간</S.TableHead>
          <S.TableHead style={{ width: "40%" }}>담당</S.TableHead>
          <S.TableHead style={{ width: "30%" }}>출석현황</S.TableHead>
          <S.TableHead>강의 정보</S.TableHead>
          <S.TableHead style={{ width: "30%" }}>원생 메모</S.TableHead>
          <S.TableHead style={{ width: "30%" }}>수업 수정</S.TableHead>
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
                  <EditOutlined
                    onClick={() => {
                      setIsEdit(true);
                      setLectureId(el.id);
                    }}
                  />
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
          onCancel={() => {
            setIsEdit(false);
            setEditDate(dateToInput(date));
            setEditStartTime(dateToClock(date));
            setEditEndTime(dateToClockOneHour(date));
            setTeacherId(
              userData?.allUsers
                .filter((el) => el.userCategory === "선생님")
                .filter((el) => {
                  return (
                    Number(el.profile.academy.id) ===
                    Number(router.query.branch)
                  );
                })[0].id
            );
            setEditAcademy(Number(router.query.branch));
            setEditInfo("");
          }}
          footer={null}
          closable={false}
          width={"25%"}
        >
          <div>
            <S.EditModalTitle>수업 수정</S.EditModalTitle>

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
                {userData?.allUsers
                  .filter((el) => el.userCategory === "선생님")
                  .filter((el) => {
                    return (
                      Number(el.profile.academy.id) ===
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
            </S.EditModalTag>

            <S.EditModalTag>
              <S.EditModalTagTitle>수정 날짜</S.EditModalTagTitle>
              <input
                type="date"
                defaultValue={dateToInput(date)}
                onChange={(e) => {
                  setEditDate(e.target.value);
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
              <S.EditModalTagTitle>수정 시간</S.EditModalTagTitle>
              <S.EditModalTimeTag>
                <input
                  type="time"
                  defaultValue={dateToClock(date)}
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
                  defaultValue={dateToClockOneHour(date)}
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
            <S.EditModalTag>
              <S.EditModalTagTitle>수업 메모</S.EditModalTagTitle>
              <S.EditTextArea
                onChange={(e) => {
                  setEditInfo(e.target.value);
                }}
                style={{
                  width: "97%",
                  height: "10rem",
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
                  setEditDate(dateToInput(date));
                  setEditStartTime(dateToClock(date));
                  setEditEndTime(dateToClockOneHour(date));
                  setTeacherId(
                    userData?.allUsers
                      .filter((el) => el.userCategory === "선생님")
                      .filter((el) => {
                        return (
                          Number(el.profile.academy.id) ===
                          Number(router.query.branch)
                        );
                      })[0].id
                  );
                  setEditAcademy(Number(router.query.branch));
                  setEditInfo("");
                }}
              >
                취소
              </S.EditModalCancelButton>
              <S.EditModalOKButton onClick={onClickUpdateLecture}>
                저장
              </S.EditModalOKButton>
            </S.EditModalButtonContainer>
          </div>
        </Modal>
      ) : (
        <></>
      )}
    </S.AcademyDetailWrapper>
  );
}
