import Calendar from "react-calendar";
import * as S from "./class.style";
import "react-calendar/dist/Calendar.css";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import {
  dateCalculator,
  dateToString,
  dateToTime,
  tileClassName,
  dateToInput,
} from "../../commons/library/library";
import { Modal } from "antd";
import { BookOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_CLASS, GET_CLASS } from "./class.query";

const week = ["일", "월", "화", "수", "목", "금", "토"];
const itemsPerPage = 20; // 페이지당 항목 수

export default function ClassPage() {
  const router = useRouter();
  const [date] = useState(new Date());
  const [createLecture] = useMutation(CREATE_CLASS);

  const { data, refetch } = useQuery(GET_CLASS, {
    variables: {
      academyId: Number(router.query.branch),
      date: dateToInput(date),
    },
  });
  console.log(data);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isCalendar, setIsCalendar] = useState(false);
  const [page, setPage] = useState(1);
  const [array, setArray] = useState();
  const [searchWord, setSearchWord] = useState("");
  const [classToggle, setClassToggle] = useState(false);
  const [bookToggle, setBookToggle] = useState(false);
  const [checkList, setCheckList] = useState([]);
  const [selectChild, setSelectChild] = useState();
  const [IdList, setIdList] = useState([]);
  const [now, setNow] = useState(new Date());
  const [maxPage, setMaxPage] = useState([]);
  const [isAlarm, setIsAlarm] = useState(false);
  const [addClassDate, setAddClassDate] = useState("");
  const [addClassStart, setAddClassStart] = useState("");
  const [addClassEnd, setAddClassEnd] = useState("");
  const [addClassInfo, setAddClassInfo] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const onClickOk = async () => {
    try {
      const result = await createLecture({
        variables: {
          academyId: Number(router.query.branch),
          date: addClassDate,
          startTime: addClassStart,
          endTime: addClassEnd,
          lectureInfo: addClassInfo,
          teacherId: Number(teacherId),
          repeatDay: routineCount,
        },
      });
      setClassToggle(false);
    } catch (err) {
      console.log(err);
    }
  };
  const [alarmContents, setAlarmContents] = useState([]);
  const [alarmList, setAlarmList] = useState([]);
  const [addClassType, setAddClassType] = useState("once");
  const [selectDates, setSelectDates] = useState([]);
  const [routineCount, setRoutineCount] = useState(0);
  const onClickCancel = () => {
    setClassToggle(false);
  };
  const onClickCalendar = () => {
    setIsCalendar(!isCalendar);
  };

  useEffect(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setArray(data?.getLecturesByAcademyAndDate.slice(start, end));
  }, [data, page]);

  const onClickPage = (pageNumber) => () => {
    setPage(pageNumber);
  };

  /* ??????? */
  const onClickDate = (value) => {
    const newDate = new Date(value);
    newDate.setDate(newDate.getDate() + 1);
    refetch({
      variables: {
        academyId: Number(router.query.branch),
        date: dateToInput(newDate),
      },
    });
    setCalendarDate(newDate);
    setIsCalendar(false);
  };

  const onChangeSearch = (event) => {
    setSearchWord(event.target.value);
  };
  const onClickSearch = () => {
    setPage(1);
    const newArray = [...data?.getLecturesByAcademyAndDate];
    setArray(
      newArray.filter((el) => {
        return el.students.some((ele) => ele.korName.includes(searchWord));
      })
    );
    setMaxPage(
      Array(
        Math.ceil(
          newArray.filter((el) => {
            return el.students.some((ele) => ele.korName.includes(searchWord));
          }).length / 20
        )
      ).fill(1)
    );
    setIdList(
      newArray
        .filter((el) => {
          return el.students.some((ele) => ele.korName.includes(searchWord));
        })
        .filter((_, ind) => {
          return ind < 20 && ind >= 0;
        })
        .map((el) => el.id)
    );
    setCheckList([]);
  };
  const onKeyPress = (event) => {
    if (event.key === "Enter") {
      onClickSearch();
    }
  };
  const onClickBooks = (el) => () => {
    setSelectChild(el);
    window.open("/class/" + el.id, "_blank");
    // setBookToggle(true);
  };

  const onChangeAll = (e) => {
    setCheckList(e.target.checked ? IdList : []);
  };

  const onChangeEach = (e, id) => {
    if (e.target.checked) {
      setCheckList([...checkList, id]);
    } else {
      setCheckList(checkList.filter((el) => el !== id));
    }
  };

  const onClickAttendance = (status) => () => {
    const newDate = new Date();
    const newAlarm = data
      .map((el) => {
        if (el.status === "결석") {
          return {
            name: el.name,
            status: el.status,
            startTime: el.start.getTime(),
            endTime: el.end.getTime(),
            id: el.id,
            time: el.start.getTime() - newDate.getTime(),
          };
        } else if (el.status === "등원") {
          return {
            name: el.name,
            status: el.status,
            startTime: el.start.getTime(),
            endTime: el.end.getTime(),
            time: el.end.getTime() - newDate.getTime(),
            id: el.id,
          };
        }
      })
      .filter((el) => el !== undefined);
    checkList.map((el) => {
      newAlarm.forEach((ele) => {
        if (ele.id === el) {
          ele.status = status;
          if (status === "등원") {
            ele.time = ele.endTime - newDate;
          }
          if (status === "하원") {
            ele.time = -1;
          }
          if (status === "지각") {
            ele.time = ele.endTime + newDate.getTime() - ele.startTime - date;
          }
          if (status === "결석") {
            ele.time = ele.startTime - date.getTime();
          }
        }
      });
    });
    setAlarmList(newAlarm);
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
  const onClickChangeType = (value) => () => {
    setAddClassType(value);
  };

  useEffect(() => {
    setArray(
      data !== undefined ? data?.getLecturesByAcademyAndDate : []
      // ? data?.getLecturesByAcademyAndDate.filter((_, index) => {
      //     return index < page * 20 && index >= (page - 1) * 20;
      //   })
      // : []
    );
    setIdList(
      data?.getLecturesByAcademyAndDate
        .filter((_, ind) => {
          return ind < 20 * page && ind >= (page - 1) * 20;
        })
        .map((el) => el.id)
    );
    setAlarmList(
      data?.getLecturesByAcademyAndDate
        .map((el) => {
          if (el.status === "결석") {
            return {
              name: el.name,
              status: el.status,
              startTime: el.start.getTime(),
              endTime: el.end.getTime(),
              id: el.id,
              time: el.start.getTime() - date.getTime(),
            };
          } else if (el.status === "등원") {
            return {
              name: el.name,
              status: el.status,
              startTime: el.start.getTime(),
              endTime: el.end.getTime(),
              time: el.end.getTime() - date.getTime(),
              id: el.id,
            };
          }
        })
        .filter((el) => el !== undefined)
    );
    setMaxPage(
      data !== undefined
        ? Array(Math.ceil(data?.getLecturesByAcademyAndDate?.length / 20)).fill(
            1
          )
        : []
    );
  }, [data]);

  useEffect(() => {
    if (alarmList !== []) {
      const openNotification = (el) => {
        setIsAlarm(true);
        setAlarmContents(el.student);
        setNow(new Date());
      };
      const startTime = Date.now();
      const timeTable = [];
      for (let i = 0; i < alarmList?.length; i++) {
        if (
          timeTable.filter((el) => el.time === alarmList[i].time).length === 0
        ) {
          timeTable.push({
            time: alarmList[i].time,
            student: [{ name: alarmList[i].name, status: alarmList[i].status }],
          });
        } else {
          for (let j = 0; j < timeTable.length; j++) {
            if (timeTable[j].time === alarmList[i].time) {
              timeTable[j].student = [
                ...timeTable[j].student,
                {
                  name: alarmList[i].name,
                  status: alarmList[i].status,
                },
              ];
            }
          }
        }
      }

      const timeTables = timeTable.filter((el) => el.time >= 0);
      console.log(timeTables);
      const animate = () => {
        const elapsedTime = Date.now() - startTime;

        timeTables.forEach((el) => {
          if (elapsedTime >= el.time) {
            openNotification(el);
            timeTables.splice(timeTables.indexOf(el), 1);
          }
        });

        if (timeTables.length > 0) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);

      return () => {
        timeTables.length = 0;
      };
    }
  }, [alarmList]);
  const totalPages =
    Math.ceil(data?.getLecturesByAcademyAndDate.length / itemsPerPage) || 1;
  return (
    <S.ClassWrapper>
      <S.ClassTitle>수업 관리</S.ClassTitle>
      <S.ClassTitleLine></S.ClassTitleLine>
      <S.ClassTopMenu>
        <div>
          <S.ClassDate onClick={onClickCalendar}>
            {dateToString(calendarDate)}
          </S.ClassDate>
          {isCalendar ? (
            <Calendar
              calendarType="gregory"
              onChange={onClickDate}
              value={date}
              locale="en-Us"
              tileClassName={tileClassName}
            ></Calendar>
          ) : (
            <></>
          )}
        </div>

        <div>
          <S.ClassButton
            onClick={() => {
              setClassToggle(true);
              setAddClassType("once");
            }}
          >
            원생 추가
          </S.ClassButton>

          <S.ClassButton
            onClick={() => {
              setClassToggle(true);
              setAddClassType("once");
            }}
          >
            수업 일정 추가
          </S.ClassButton>
        </div>
      </S.ClassTopMenu>
      <S.ClassMiddleBox>
        <S.ClassMiddleTag>
          <S.CountNumber>
            {data?.getLecturesByAcademyAndDate.reduce((acc, cur) => {
              return acc + cur.students.length;
            }, 0) + "명"}
          </S.CountNumber>
          <S.ClassSmallButton>초기화</S.ClassSmallButton>
          <S.ClassSmallButton onClick={onClickAttendance("등원")}>
            등원
          </S.ClassSmallButton>
          <S.ClassSmallButton onClick={onClickAttendance("지각")}>
            지각
          </S.ClassSmallButton>
          <S.ClassSmallButton onClick={onClickAttendance("결석")}>
            결석
          </S.ClassSmallButton>
          <S.ClassSmallButton onClick={onClickAttendance("하원")}>
            하원
          </S.ClassSmallButton>
          <S.ClassSmallButton onClick={onClickAttendance("보강")}>
            보강
          </S.ClassSmallButton>
        </S.ClassMiddleTag>
        <S.ClassMiddleTag>
          <S.ClassInput
            type="text"
            onChange={onChangeSearch}
            onKeyPress={onKeyPress}
          ></S.ClassInput>
          <S.ClassSmallButton onClick={onClickSearch}>
            search
          </S.ClassSmallButton>
        </S.ClassMiddleTag>
      </S.ClassMiddleBox>
      <S.Table>
        <S.TableHeaderRound>
          <S.TableHeadLeft style={{ width: "30%" }}>
            <input
              type="checkbox"
              onChange={onChangeAll}
              checked={checkList.length === IdList?.length}
            />
          </S.TableHeadLeft>
          <S.TableHead style={{ width: "50%" }}>원생명</S.TableHead>
          <S.TableHead style={{ width: "70%" }}>시작 시간</S.TableHead>
          <S.TableHead style={{ width: "70%" }}>마감 시작</S.TableHead>
          {/* <S.TableHead style={{ width: "70%" }}>수업 시간</S.TableHead>
          <S.TableHead style={{ width: "70%" }}>출결 상태</S.TableHead>
          <S.TableHead style={{ width: "70%" }}>등원 시간</S.TableHead> */}
          <S.TableHead style={{ width: "120%" }}>강의 정보</S.TableHead>
          {/* <S.TableHead style={{ width: "70%" }}>예약 도서</S.TableHead> */}
          <S.TableHeadRight style={{ width: "50%" }}>
            수업 준비
          </S.TableHeadRight>
        </S.TableHeaderRound>
        {array?.map((el) => {
          return el?.students.map((ele) => {
            return (
              <S.TableRound>
                <S.TableHeadLeft style={{ width: "30%" }}>
                  <input
                    type="checkbox"
                    onChange={(e) => onChangeEach(e, el.id)}
                    checked={checkList.includes(el.id)}
                  />
                </S.TableHeadLeft>
                <S.TableHead
                  //  style={
                  //     // (el.status.includes("결석") &&
                  //     //   dateCalculator(el.start, new Date())) ||
                  //     // (el.status.includes("등원") &&
                  //     //   dateCalculator(el.end, new Date()))
                  //     //   ? { width: "50%", color: "tomato" }
                  //     //   : { width: "50%" }
                  //   }
                  style={{ width: "50%" }}
                >
                  {ele.korName}
                </S.TableHead>
                <S.TableHead style={{ width: "70%" }}>
                  {el.startTime.slice(0, 5)}
                </S.TableHead>
                <S.TableHead style={{ width: "70%" }}>
                  {el.endTime.slice(0, 5)}
                </S.TableHead>
                <S.TableHead style={{ width: "120%" }}>
                  {el.lectureInfo}
                </S.TableHead>
                <S.TableHeadRight style={{ width: "50%" }}>
                  <BookOutlined onClick={onClickBooks(el)}></BookOutlined>
                </S.TableHeadRight>
              </S.TableRound>
            );
          });
        })}
      </S.Table>
      <S.PageContainer>
        {Array.from({ length: totalPages }, (_, i) => (
          <S.PageBox
            key={i}
            style={
              i + 1 === page
                ? { backgroundColor: "purple", color: "#eeeeee" }
                : {}
            }
            onClick={onClickPage(i + 1)}
          >
            {i + 1}
          </S.PageBox>
        ))}
      </S.PageContainer>
      {classToggle ? (
        <Modal open={classToggle} width={"55vw"} height={"50vh"} footer={null}>
          <S.ClassTitle>수업 일정 추가</S.ClassTitle>
          <S.ClassTitleLine></S.ClassTitleLine>
          <S.ModalWrapper>
            <select
              onChange={(event) => {
                setTeacherId(event.target.value);
                console.log(event.target.value);
              }}
            >
              <option defaultChecked>선생님 선택</option>
              {data?.getLecturesByAcademyAndDate.map((el) => {
                return (
                  <option key={uuidv4()} value={el.teacher.id}>
                    {el.teacher.korName}
                  </option>
                );
              })}
            </select>
            {/* <S.ModalRadioBox>
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
            </S.ModalRadioBox> */}
            <S.ModalInputBox>
              <div>
                <div>수업 날짜</div>
              </div>
              {/* {addClassType === "once" ? (
                <S.InputInput
                  type="date"
                  style={{ width: "50%" }}
                  onChange={(event) => {
                    setAddClassDate(event.target.value);
                  }}
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
              )} */}
              <div>
                <span>반복</span>
                <input type="number" onChange={onChangeRoutineCount}></input>
                <span>주</span>
              </div>
              <S.InputInput
                type="date"
                style={{ width: "50%" }}
                onChange={(event) => {
                  setAddClassDate(event.target.value);
                }}
              ></S.InputInput>
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
            <S.ModalOkButton onClick={onClickOk}>저장</S.ModalOkButton>
          </S.ModalButtonBox>
        </Modal>
      ) : (
        <></>
      )}
      {bookToggle ? (
        <Modal
          closable={false}
          open={bookToggle}
          onOk={() => {
            setBookToggle(false);
          }}
          onCancel={() => {
            setBookToggle(false);
          }}
          key={uuidv4()}
        >
          <div>{selectChild.name + "예약 도서"}</div>
        </Modal>
      ) : (
        <></>
      )}
      {isAlarm ? (
        <Modal open={isAlarm} footer={null} closeIcon={null}>
          <S.AlarmDiv>시간:{dateToTime(now)}</S.AlarmDiv>
          {alarmContents.map((el) => {
            return (
              <S.AlarmDiv key={uuidv4()}>
                {el.name}
                {" : "}
                {el.status === "결석" ? (
                  <S.AlarmDiv>등원 시간</S.AlarmDiv>
                ) : (
                  <S.AlarmDiv>하원 시간</S.AlarmDiv>
                )}
              </S.AlarmDiv>
            );
          })}
          <S.AlarmButton
            onClick={() => {
              setIsAlarm(false);
            }}
          >
            닫기
          </S.AlarmButton>
        </Modal>
      ) : (
        <></>
      )}
    </S.ClassWrapper>
  );
}
