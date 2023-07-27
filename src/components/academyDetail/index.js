import { FormOutlined } from "@ant-design/icons";
import * as S from "./academyDetail.style";
import "react-calendar/dist/Calendar.css";
import { useRouter } from "next/router";
import { useState } from "react";
import { Modal, TimePicker } from "antd";
import { v4 as uuidv4 } from "uuid";

const childrenData = {
  id: "P01",
  name: "철수",
  birthYear: "2013년 2월 1일",
  registerDate: "2023년 5월 3일",
  status: "재원 중",
  phone: "010-0000-0000",
  parentsPhone: "010-0000-0000",
  address: "서울특별시 광진구 아차산로70길 75",
};

const classArray = [
  {
    date: "2023월 7월 5일",
    timeStart: "14:00",
    timeEnd: "16:00",
    status: "미정",
    memo: "메모메모메모",
  },
  {
    date: "2023월 7월 3일",
    timeStart: "14:00",
    timeEnd: "16:00",
    status: "등원",
    memo: "",
  },
  {
    date: "2023월 6월 30일",
    timeStart: "14:00",
    timeEnd: "16:00",
    status: "결석",
    memo: "",
  },
];

const week = ["일", "월", "화", "수", "목", "금", "토"];

export default function AcademyDetailPage() {
  const router = useRouter();
  const [classToggle, setClassToggle] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [imageFile, setImageFile] = useState("");
  const [isMemo, setIsMemo] = useState(classArray.map(() => false));
  const [addClassType, setAddClassType] = useState("once");
  const [selectDates, setSelectDates] = useState([]);
  const [routineCount, setRoutineCount] = useState(0);
  const onClickRouter = (address) => () => {
    router.push("/" + address);
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
  const onClickMemo = (index) => () => {
    const newIsMemo = [...isMemo];
    newIsMemo[index] = true;
    setIsMemo(newIsMemo);
  };
  const onClickMemoClose = (index) => () => {
    const newIsMemo = [...isMemo];
    newIsMemo[index] = false;
    setIsMemo(newIsMemo);
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
  return (
    <S.AcademyDetailWrapper>
      <S.AcademyDetailTitle>원생 정보 상세보기</S.AcademyDetailTitle>
      <S.TitleLine></S.TitleLine>
      <S.EditBox>
        <S.ImageBox>
          {imageURL !== "" ? (
            <img src={imageURL} width={"200px"} height={"200px"}></img>
          ) : (
            <img src="/sample.png" width={"200px"} height={"200px"}></img>
          )}

          <input type="file" onChange={onClickImageURL}></input>
        </S.ImageBox>
        <S.InputBox>
          <S.InputTag>
            <S.InputName>이름</S.InputName>
            <S.InputInput defaultValue={childrenData.name}></S.InputInput>
            <S.InputName>아이디</S.InputName>
            <S.InputInput defaultValue={childrenData.id}></S.InputInput>
          </S.InputTag>
          <S.InputTag>
            <S.InputName>생년월일</S.InputName>
            <S.InputInput defaultValue={childrenData.birthYear}></S.InputInput>
            <S.InputName>등록일</S.InputName>
            <S.InputInput
              defaultValue={childrenData.registerDate}
            ></S.InputInput>
          </S.InputTag>
          <S.InputTag>
            <S.InputName>학부모 전화번호</S.InputName>
            <S.InputInput
              defaultValue={childrenData.parentsPhone}
            ></S.InputInput>
            <S.InputName>학생 전화번호</S.InputName>
            <S.InputInput defaultValue={childrenData.phone}></S.InputInput>
          </S.InputTag>
          <S.InputTag>
            <S.InputName>성별</S.InputName>
            <S.InputInput defaultValue={childrenData.status}></S.InputInput>
            <S.InputName>주소</S.InputName>
            <S.InputInput defaultValue={childrenData.address}></S.InputInput>
          </S.InputTag>
          <S.ButtonBox>
            <S.RouteButton onClick={onClickRouter("academy")}>
              목록
            </S.RouteButton>
            <S.RouteButton>수정하기</S.RouteButton>
          </S.ButtonBox>
        </S.InputBox>
      </S.EditBox>
      <S.TableTitleBox>
        <div>수업 정보</div>
        <S.RouteButton onClick={onClickClassToggle}>수업 추가</S.RouteButton>
      </S.TableTitleBox>
      <S.Table>
        <S.TableHeaderRound>
          <S.TableHeadLeft style={{ width: "70%" }}>수업 날짜</S.TableHeadLeft>
          <S.TableHead style={{ width: "70%" }}>수업 시간</S.TableHead>
          <S.TableHead style={{ width: "30%" }}>출결</S.TableHead>
          <S.TableHead>강의 정보</S.TableHead>
          <S.TableHead style={{ width: "30%" }}>정보 수정</S.TableHead>
          <S.TableHead style={{ width: "30%" }}>보강 학습 추가</S.TableHead>
        </S.TableHeaderRound>

        {classArray.map((el, index) => {
          return (
            <S.TableRound key={uuidv4()}>
              <S.TableHeadLeft style={{ width: "70%" }}>
                {el.date}
              </S.TableHeadLeft>
              <S.TableHead style={{ width: "70%" }}>
                {el.timeStart + "~" + el.timeEnd}
              </S.TableHead>
              <S.TableHead style={{ width: "30%" }}>{el.status}</S.TableHead>
              <S.TableHead>
                {isMemo[index] ? (
                  <div style={{ display: "flex" }}>
                    <S.ClassTableInput
                      type="text"
                      defaultValue={el.memo}
                    ></S.ClassTableInput>
                    <S.ClassTableButton>수정</S.ClassTableButton>
                    <S.ClassTableButtonCancel onClick={onClickMemoClose(index)}>
                      취소
                    </S.ClassTableButtonCancel>
                  </div>
                ) : (
                  <div>{el.memo}</div>
                )}
              </S.TableHead>
              <S.TableHead style={{ width: "30%" }}>
                <FormOutlined onClick={onClickMemo(index)}></FormOutlined>
              </S.TableHead>
              <S.TableHead style={{ width: "30%" }}>
                {el.status === "결석" ? (
                  <FormOutlined onClick={onClickClassToggle} />
                ) : (
                  <></>
                )}
              </S.TableHead>
            </S.TableRound>
          );
        })}
      </S.Table>
      {classToggle ? (
        <Modal open={classToggle} width={"55vw"} height={"50vh"} footer={null}>
          <S.AcademyDetailTitle>수업 일정 추가</S.AcademyDetailTitle>
          <S.TitleLine></S.TitleLine>
          <S.ModalWrapper>
            <S.ModalRadioBox>
              <input
                type="radio"
                name="type"
                defaultChecked={true}
                value={"once"}
                onClick={onClickChangeType("once")}
              ></input>
              <div>단일</div>
              <input
                type="radio"
                name="type"
                value={"routine"}
                onClick={onClickChangeType("routine")}
              ></input>
              <div>반복</div>
            </S.ModalRadioBox>
            <S.ModalInputBox>
              <div>
                <div>수업 날짜</div>
              </div>
              {addClassType === "once" ? (
                <S.InputInput
                  type="date"
                  style={{ width: "50%" }}
                ></S.InputInput>
              ) : (
                <S.ModalRoutineInput>
                  <div>
                    <input
                      type="number"
                      onChange={onChangeRoutineCount}
                    ></input>
                    <span>주</span>
                  </div>
                  <S.ModalRoutineDates>
                    {week.map((el, index) => {
                      return (
                        <S.ModalRoutineDate
                          key={uuidv4()}
                          onClick={onClickDates(index)}
                          style={
                            selectDates.includes(index)
                              ? { backgroundColor: "purple", color: "#eeeeee" }
                              : {}
                          }
                        >
                          {el}
                        </S.ModalRoutineDate>
                      );
                    })}
                  </S.ModalRoutineDates>
                </S.ModalRoutineInput>
              )}
            </S.ModalInputBox>
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
                ></input>
              </S.TimeBox>
            </S.ModalInputBox>
            <S.ModalInputBox>
              <div>
                <div>메모</div>
              </div>
              <S.ModalTextArea></S.ModalTextArea>
            </S.ModalInputBox>
          </S.ModalWrapper>
          <S.ModalButtonBox>
            <S.ModalCancelButton onClick={onClickCancel}>
              취소
            </S.ModalCancelButton>
            <S.ModalOkButton onClick={onClickOk}>저장</S.ModalOkButton>
          </S.ModalButtonBox>
        </Modal>
      ) : (
        <></>
      )}
    </S.AcademyDetailWrapper>
  );
}
