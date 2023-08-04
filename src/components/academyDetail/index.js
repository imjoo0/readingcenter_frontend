import { FormOutlined } from "@ant-design/icons";
import * as S from "./academyDetail.style";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Modal, TimePicker } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery } from "@apollo/client";
import { ADD_MEMO, EDIT_STUDENT, GET_STUDENT } from "./academyDetail.query";
import { dateToInput } from "@/src/commons/library/library";

export default function AcademyDetailPage() {
  const router = useRouter();
  const { data, refetch } = useQuery(GET_STUDENT, {
    variables: { userId: Number(router.query.id) },
  });
  const [editStudent] = useMutation(EDIT_STUDENT);
  const [addMemo] = useMutation(ADD_MEMO);
  const [editBirthDay, setEditBirthDay] = useState("");
  const [editMobileNumber, setEditMobileNumber] = useState("");
  const [editPMobileNumber, setEditPMobileNumber] = useState("");
  const [editGender, setEditGender] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editMemo, setEditMemo] = useState("");
  const [classToggle, setClassToggle] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [addClassType, setAddClassType] = useState("once");
  const [selectDates, setSelectDates] = useState([]);
  const [routineCount, setRoutineCount] = useState(0);
  const onClickRouter = (address) => () => {
    router.push("/2/" + address);
  };
  const onClickClassToggle = () => {
    setAddClassType("once");
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

  const onClickImageURL = (event) => {
    setImageFile(event.target.files[0]);
    let reader = new FileReader();
    reader.onload = function (event) {
      setImageURL(event.target.result);
    };
    reader.readAsDataURL(event.target.files[0]);
  };
  const onClickChangeType = (value) => () => {
    setAddClassType(value);
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

  const onClickAddClass = () => {
    console.log(
      "id : " + router.query.id,
      routineCount + "주",
      "선택요일 : " + selectDates
    );
  };

  const onClickEdit = async () => {
    console.log(editBirthDay, "생일");
    console.log(editMobileNumber, "원생 전화번호");
    console.log(editPMobileNumber, "부모 전화번호");
    console.log(editGender, "성별");
    console.log(editEmail, "이메일");
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
    console.log(editMemo, "메모");
  };

  useEffect(() => {
    setEditBirthDay(data?.userDetails?.profile.birthDate);
    setEditMobileNumber(data?.userDetails?.profile.mobileno);
    setEditPMobileNumber(data?.userDetails?.profile.pmobileno);
    setEditGender(data?.userDetails?.profile.gender);
    setEditEmail(data?.userDetails?.email);
    setEditMemo(data?.userDetails?.memo?.memo);
  }, [data]);

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
        <S.RouteButton onClick={onClickRouter("academy")}>목록</S.RouteButton>
        <S.RouteButton onClick={onClickEdit}>수정</S.RouteButton>
      </S.ButtonBox>
      <S.Table>
        <S.TableHeaderRound>
          <S.TableHeadLeft style={{ width: "70%" }}>수업 날짜</S.TableHeadLeft>
          <S.TableHead style={{ width: "70%" }}>수업 시간</S.TableHead>
          <S.TableHead style={{ width: "40%" }}>담당</S.TableHead>
          <S.TableHead>강의 정보</S.TableHead>
          {/* <S.TableHead style={{ width: "30%" }}>보강 학습 추가</S.TableHead> */}
        </S.TableHeaderRound>
        {data?.userDetails?.lectures?.map((el) => {
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
              <S.TableHead>{el.lectureInfo}</S.TableHead>
              {/* <S.TableHead style={{ width: "30%" }}>
                {el.status === "결석" ? (
                  <FormOutlined onClick={onClickClassToggle} />
                ) : (
                  <></>
                )}
              </S.TableHead> */}
            </S.TableRound>
          );
        })}
      </S.Table>
    </S.AcademyDetailWrapper>
  );
}
