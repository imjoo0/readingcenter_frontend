import { Modal } from "antd";
import * as S from "../class.style";

export default ClassChangeModal = ({ onClickCancel, onClickOk }) => {
  return (
    <Modal
      closable={false}
      open={classToggle}
      width={"89.875rem"}
      height={"47rem"}
      keyboard={true}
      onCancel={onClickCancel}
      footer={null}
      style={{ content: { padding: 0 } }}
    >
      <S.ClassTitle>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: "0.44rem" }}
        >
          <path
            d="M11.8125 2.6875L10.5938 3.90625L8.09375 1.40625L9.3125 0.1875C9.4375 0.0625 9.59375 0 9.78125 0C9.96875 0 10.125 0.0625 10.25 0.1875L11.8125 1.75C11.9375 1.875 12 2.03125 12 2.21875C12 2.40625 11.9375 2.5625 11.8125 2.6875ZM0 9.5L7.375 2.125L9.875 4.625L2.5 12H0V9.5Z"
            fill="#791285"
          />
        </svg>

        {" 수업 변경"}
      </S.ClassTitle>
      <div
        style={{
          borderTop: "1px solid #DFE1E5",
          // width: "89.875rem",
          margin: "1.25rem 0",
          // marginRight: "1.3rem",
        }}
      ></div>
      <S.ModalClassAddWrapper>
        <div style={{ width: "53rem", height: "43.5rem" }}>
          {addList.length === 0 ? (
            <>
              <S.ModalInput
                onChange={(e) => {
                  setSearchStudents(e.target.value);
                }}
                placeholder="      원번 혹은 이름을 입력하세요."
              ></S.ModalInput>
              <div
                style={{
                  height: "38rem",
                  overflow: "scroll",
                  overflowX: "hidden",
                }}
              >
                <table
                  style={{
                    height: "33.625rem",
                    width: "52.4rem",
                    overflow: "scroll",
                    overflowX: "hidden",
                  }}
                >
                  <thead
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 0,
                    }}
                  >
                    <tr>
                      <S.AddModalTh
                        style={{
                          width: "15rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        원번
                      </S.AddModalTh>
                      <S.AddModalTh
                        style={{
                          width: "17rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        이름
                      </S.AddModalTh>
                      <S.AddModalTh
                        style={{
                          width: "6rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        추가
                      </S.AddModalTh>
                    </tr>
                  </thead>
                  {/* 여기다가 필터 추가 lecture 정보로 */}
                  <tbody>
                    {allStudent?.map((el) => {
                      return (
                        <tr key={uuidv4()} style={{ margin: 0 }}>
                          <S.AddModalTd
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {el?.origin}
                          </S.AddModalTd>
                          <S.AddModalTd
                            style={{
                              textAlign: "center",
                            }}
                          >
                            {`${el?.korName} (${el?.engName ?? ""})`}
                          </S.AddModalTd>
                          <S.AddModalTd
                            style={{
                              textAlign: "center",
                            }}
                          >
                            <button
                              onClick={onClickStudents(
                                el?.id,
                                el?.korName,
                                el?.engName,
                                el?.origin
                              )}
                              style={{
                                cursor: "pointer",
                                border: "none",
                                background: "#fff",
                                fontFamily: "Noto Sans KR",
                                fontSize: "1rem",
                                fontWeight: "500",
                              }}
                            >
                              <svg
                                width="12"
                                height="10"
                                viewBox="0 0 12 10"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4 7.28125L11.0625 0.21875L12 1.15625L4 9.15625L0.28125 5.4375L1.21875 4.5L4 7.28125Z"
                                  fill="#333333"
                                />
                              </svg>
                              {" 선택"}
                            </button>
                          </S.AddModalTd>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <S.AddModalBackButton
                onClick={() => {
                  setAddList([]);
                }}
              >
                <svg
                  width="12"
                  height="9"
                  viewBox="0 0 12 9"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginBottom: "0.1rem", marginRight: "1rem" }}
                >
                  <path
                    d="M12 3.84375V5.15625H2.5625L4.9375 7.5625L4 8.5L0 4.5L4 0.5L4.9375 1.4375L2.5625 3.84375H12Z"
                    fill="#791285"
                  />
                </svg>
                원생 선택
              </S.AddModalBackButton>

              <S.AddModalTitle>
                {`${addListName?.origin} ${addListName?.korName}(${
                  addListName?.engName
                })의 수업(수정 전 ${
                  lectureInfoData?.studentLectures
                    ?.sort((a, b) => {
                      const newADate = new Date(a?.lecture?.date);
                      const newBDate = new Date(b?.lecture?.date);
                      return newADate - newBDate;
                    })
                    ?.filter((el, i, callback) => {
                      return (
                        i ===
                        callback.findIndex(
                          (t) =>
                            t.lecture.lectureInfo.id ===
                            el.lecture.lectureInfo.id
                        )
                      );
                    })?.length
                }개)`}
              </S.AddModalTitle>

              <div
                style={{
                  width: "53rem",
                  display: "flex",
                  alignItems: "flex-start",
                  height:
                    lectureInfoData?.studentLectures
                      ?.sort((a, b) => {
                        const newADate = new Date(a?.lecture?.date);
                        const newBDate = new Date(b?.lecture?.date);
                        return newADate - newBDate;
                      })
                      ?.filter((el, i, callback) => {
                        return (
                          i ===
                          callback.findIndex(
                            (t) =>
                              t.lecture.lectureInfo.id ===
                              el.lecture.lectureInfo.id
                          )
                        );
                      })?.length > 5
                      ? "15rem"
                      : "",
                  justifyContent: "flex-start",
                  overflowY:
                    lectureInfoData?.studentLectures
                      ?.sort((a, b) => {
                        const newADate = new Date(a?.lecture?.date);
                        const newBDate = new Date(b?.lecture?.date);
                        return newADate - newBDate;
                      })
                      ?.filter((el, i, callback) => {
                        return (
                          i ===
                          callback.findIndex(
                            (t) =>
                              t.lecture.lectureInfo.id ===
                              el.lecture.lectureInfo.id
                          )
                        );
                      })?.length > 5
                      ? "scroll"
                      : "hidden",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ position: "sticky", top: 0, zIndex: 0 }}>
                    <tr>
                      <S.AddModalTh
                        style={{
                          width: "4.19rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        열 번호
                      </S.AddModalTh>
                      <S.AddModalTh
                        style={{
                          width: "11.87rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        날짜
                      </S.AddModalTh>
                      <S.AddModalTh
                        style={{
                          width: "7.25rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        수업 시간
                      </S.AddModalTh>
                      <S.AddModalTh
                        style={{
                          width: "12.625rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        반복 요일
                      </S.AddModalTh>
                      <S.AddModalTh
                        style={{
                          width: "3.12rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        반복
                      </S.AddModalTh>
                      <S.AddModalTh
                        style={{
                          width: "7.12rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        강의 정보
                      </S.AddModalTh>
                      <S.AddModalTh
                        style={{
                          width: "5.75rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        수정/삭제
                      </S.AddModalTh>
                    </tr>
                  </thead>
                  <tbody>
                    {lectureInfoData?.studentLectures
                      ?.sort((a, b) => {
                        const newADate = new Date(a?.lecture?.date);
                        const newBDate = new Date(b?.lecture?.date);
                        return newADate - newBDate;
                      })
                      ?.filter((el, i, callback) => {
                        return (
                          i ===
                          callback.findIndex(
                            (t) =>
                              t.lecture.lectureInfo.id ===
                              el.lecture.lectureInfo.id
                          )
                        );
                      })
                      ?.map((el, index) => {
                        return (
                          <tr>
                            <S.AddModalTd>{index + 1}</S.AddModalTd>
                            <S.AddModalTd>
                              {el?.lecture?.lectureInfo?.repeatDay.includes(-1)
                                ? dateInputToDot(el?.lecture?.date)
                                : el?.lecture?.lectureInfo?.autoAdd
                                ? dateInputToDot(
                                    startDate(
                                      el?.lecture?.date,
                                      el?.lecture?.lectureInfo?.repeatDay
                                    )
                                  ) + " ~"
                                : dateInputToDot(
                                    startDate(
                                      el?.lecture?.date,
                                      el?.lecture?.lectureInfo?.repeatDay
                                    )
                                  ) +
                                  " ~ " +
                                  (el?.lecture?.lectureInfo?.repeatTimes ===
                                  null
                                    ? dateInputToDot(
                                        lastDate(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatWeeks,
                                          el?.lecture?.lectureInfo?.repeatDay
                                        )
                                      )
                                    : dateInputToDot(
                                        lastCount(
                                          el?.lecture?.date,
                                          el?.lecture?.lectureInfo?.repeatWeeks,
                                          el?.lecture?.lectureInfo?.repeatDay
                                        )
                                      ))}
                            </S.AddModalTd>
                            <S.AddModalTd>
                              {el?.lecture?.startTime.slice(0, 5) +
                                " ~ " +
                                el?.lecture?.endTime.slice(0, 5)}
                            </S.AddModalTd>
                            <S.AddModalTd>
                              <div style={{ display: "flex" }}>
                                {week?.map((_, weekIndex) => {
                                  return (
                                    <S.AddModalWeekBlock>
                                      {el?.lecture?.lectureInfo?.repeatDay?.includes(
                                        weekIndex
                                      )
                                        ? week[weekIndex]
                                        : ""}
                                    </S.AddModalWeekBlock>
                                  );
                                })}
                              </div>
                            </S.AddModalTd>
                            <S.AddModalTd>
                              {el?.lecture?.lectureInfo?.repeatDay?.includes(-1)
                                ? "없음"
                                : el?.lecture?.lectureInfo?.repeatTimes === null
                                ? el?.lecture?.lectureInfo?.repeatWeeks + "주"
                                : el?.lecture?.lectureInfo?.repeatTimes + "회"}
                            </S.AddModalTd>
                            <S.AddModalTdMaxWidth>
                              {el?.lecture?.lectureInfo?.about}
                            </S.AddModalTdMaxWidth>
                            <S.AddModalTd>
                              <S.AddModalIconButton
                                onClick={onClickSelectRepeatInput(index)}
                                style={{ marginRight: "0.63rem" }}
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.8125 2.68848L10.5938 3.90723L8.09375 1.40723L9.3125 0.188477C9.4375 0.0634766 9.59375 0.000976562 9.78125 0.000976562C9.96875 0.000976562 10.125 0.0634766 10.25 0.188477L11.8125 1.75098C11.9375 1.87598 12 2.03223 12 2.21973C12 2.40723 11.9375 2.56348 11.8125 2.68848ZM0 9.50098L7.375 2.12598L9.875 4.62598L2.5 12.001H0V9.50098Z"
                                    fill="#333333"
                                  />
                                </svg>
                              </S.AddModalIconButton>
                              <S.AddModalIconButton
                                onClick={onClickDeleteRepeatInput(index)}
                              >
                                <svg
                                  width="10"
                                  height="12"
                                  viewBox="0 0 10 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.65625 0.657227V2.00098H0.34375V0.657227H2.65625L3.34375 0.000976562H6.65625L7.34375 0.657227H9.65625ZM1 10.6572V2.65723H9V10.6572C9 11.0114 8.86458 11.3239 8.59375 11.5947C8.32292 11.8656 8.01042 12.001 7.65625 12.001H2.34375C1.98958 12.001 1.67708 11.8656 1.40625 11.5947C1.13542 11.3239 1 11.0114 1 10.6572Z"
                                    fill="#333333"
                                  />
                                </svg>
                              </S.AddModalIconButton>
                            </S.AddModalTd>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <S.AddModalTitle>
                {`${addListName?.origin} ${addListName?.korName}(${addListName?.engName})의 수업`}

                <span style={{ color: "#F00" }}>
                  {`(수정 후 ${
                    addRepeatInput?.reduce((acc, cur) => {
                      if (cur?.isDelete) {
                        return acc;
                      } else {
                        return acc + 1;
                      }
                    }, 0) +
                    addRepeatInput?.reduce((acc, cur) => {
                      if (cur?.isOne && !cur?.isDelete) {
                        return acc + 1;
                      } else {
                        return acc;
                      }
                    }, 0)
                  }개)`}
                </span>
              </S.AddModalTitle>
              <div
                style={{
                  width: "53rem",
                  display: "flex",
                  alignItems: "flex-start",
                  height:
                    addRepeatInput?.length +
                      addRepeatInput?.filter((el) => el?.isOne)?.length >
                    5
                      ? "15rem"
                      : "",
                  justifyContent: "flex-start",
                  overflowY:
                    addRepeatInput?.length +
                      addRepeatInput?.filter((el) => el?.isOne)?.length >
                    5
                      ? "scroll"
                      : "hidden",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ position: "sticky", top: 0, zIndex: 0 }}>
                    <tr>
                      <S.AddModalTh
                        style={{
                          width: "4.19rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        열 번호
                      </S.AddModalTh>
                      <S.AddModalTh
                        style={{
                          width: "11.87rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        날짜
                      </S.AddModalTh>
                      <S.AddModalTh
                        style={{
                          width: "9rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        수업 시간
                      </S.AddModalTh>
                      <S.AddModalTh
                        style={{
                          width: "7.25rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        반복 요일
                      </S.AddModalTh>
                      <S.AddModalTh
                        style={{
                          width: "3.12rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        반복
                      </S.AddModalTh>
                      <S.AddModalTh
                        style={{
                          width: "7.25rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        강의 정보
                      </S.AddModalTh>
                      <S.AddModalTh
                        style={{
                          width: "5.75rem",
                          textAlign: "center",
                          background: "#791285",
                        }}
                      >
                        수정/삭제
                      </S.AddModalTh>
                    </tr>
                  </thead>
                  <tbody>
                    {addRepeatInput?.map((el, index) => {
                      if (el?.isDelete) {
                        return <></>;
                      }
                      return (
                        <>
                          <tr>
                            <S.AddModalTd>{index + 1}</S.AddModalTd>
                            <S.AddModalTd>
                              {el?.week?.includes(-1) ||
                              el?.isRepeat === "once" ||
                              el?.week?.length === 0
                                ? dateInputToDot(el?.startDate)
                                : el?.isRepeat === "infinity"
                                ? dateInputToDot(
                                    startDate(el?.startDate, el?.week)
                                  ) + " ~"
                                : dateInputToDot(
                                    startDate(el?.startDate, el?.week)
                                  ) +
                                  " ~ " +
                                  (el?.isRepeat === "routine"
                                    ? dateInputToDot(
                                        lastDate(
                                          el?.startDate,
                                          el?.repeatsNum,
                                          el?.week
                                        )
                                      )
                                    : dateInputToDot(
                                        lastCount(
                                          el?.startDate,
                                          el?.repeatsNum,
                                          el?.week
                                        )
                                      ))}
                            </S.AddModalTd>
                            <S.AddModalTd>
                              {el?.startTime.slice(0, 5) +
                                " ~ " +
                                el?.endTime.slice(0, 5)}
                            </S.AddModalTd>
                            <S.AddModalTd>
                              {/* {el?.week?.includes(-1)
                                    ? ""
                                    : el?.week
                                        // ?.sort((a, b) => {
                                        //   return Number(a) - Number(b);
                                        // })
                                        .map((ele) => {
                                          return week[ele];
                                        })} */}

                              <div style={{ display: "flex" }}>
                                {week?.map((_, weekIndex) => {
                                  if (el?.isRepeat !== "once") {
                                    return (
                                      <S.AddModalWeekBlock>
                                        {el?.week?.includes(weekIndex)
                                          ? week[weekIndex]
                                          : ""}
                                      </S.AddModalWeekBlock>
                                    );
                                  } else {
                                    return (
                                      <S.AddModalWeekBlock></S.AddModalWeekBlock>
                                    );
                                  }
                                })}
                              </div>
                            </S.AddModalTd>
                            <S.AddModalTdMaxWidth>
                              {el?.isRepeat === "once"
                                ? "없음"
                                : el?.isRepeat === "routine"
                                ? el?.repeatsNum + "주"
                                : el?.repeatsNum + "회"}
                            </S.AddModalTdMaxWidth>
                            <S.AddModalTdMaxWidth>
                              {el?.about}
                            </S.AddModalTdMaxWidth>
                            <S.AddModalTd>
                              <S.AddModalIconButton
                                onClick={onClickSelectRepeatInput(index)}
                                style={{ marginRight: "0.62rem" }}
                              >
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 12 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.8125 2.6875L10.5938 3.90625L8.09375 1.40625L9.3125 0.1875C9.4375 0.0625 9.59375 0 9.78125 0C9.96875 0 10.125 0.0625 10.25 0.1875L11.8125 1.75C11.9375 1.875 12 2.03125 12 2.21875C12 2.40625 11.9375 2.5625 11.8125 2.6875ZM0 9.5L7.375 2.125L9.875 4.625L2.5 12H0V9.5Z"
                                    fill="#333333"
                                  />
                                </svg>
                              </S.AddModalIconButton>
                              <S.AddModalIconButton
                                onClick={onClickDeleteRepeatInput(index)}
                              >
                                <svg
                                  width="10"
                                  height="12"
                                  viewBox="0 0 10 12"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.65625 0.65625V2H0.34375V0.65625H2.65625L3.34375 0H6.65625L7.34375 0.65625H9.65625ZM1 10.6562V2.65625H9V10.6562C9 11.0104 8.86458 11.3229 8.59375 11.5938C8.32292 11.8646 8.01042 12 7.65625 12H2.34375C1.98958 12 1.67708 11.8646 1.40625 11.5938C1.13542 11.3229 1 11.0104 1 10.6562Z"
                                    fill="#333333"
                                  />
                                </svg>
                              </S.AddModalIconButton>
                            </S.AddModalTd>
                          </tr>
                          {el?.isOne && (
                            <tr>
                              <S.AddModalTd>{el.index + 1 + "-1"}</S.AddModalTd>
                              <S.AddModalTd>
                                {el.oneChangeList?.[0]?.date}
                              </S.AddModalTd>
                              <S.AddModalTd>
                                {el.oneChangeList?.[0]?.startTime?.slice(0, 5) +
                                  "~" +
                                  el.oneChangeList?.[0]?.endTime?.slice(0, 5)}
                              </S.AddModalTd>
                              <S.AddModalTd>
                                <div style={{ display: "flex" }}>
                                  {week?.map((_) => {
                                    return (
                                      <S.AddModalWeekBlock></S.AddModalWeekBlock>
                                    );
                                  })}
                                </div>
                              </S.AddModalTd>
                              <S.AddModalTdMaxWidth>
                                {el?.oneChangeList?.[0]?.about}
                              </S.AddModalTdMaxWidth>
                              <S.AddModalTd>
                                <S.AddModalIconButton
                                  style={{ marginRight: "0.62rem" }}
                                  onClick={onClickSelectRepeatInput(index)}
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M11.8125 2.68848L10.5938 3.90723L8.09375 1.40723L9.3125 0.188477C9.4375 0.0634766 9.59375 0.000976562 9.78125 0.000976562C9.96875 0.000976562 10.125 0.0634766 10.25 0.188477L11.8125 1.75098C11.9375 1.87598 12 2.03223 12 2.21973C12 2.40723 11.9375 2.56348 11.8125 2.68848ZM0 9.50098L7.375 2.12598L9.875 4.62598L2.5 12.001H0V9.50098Z"
                                      fill="#333333"
                                    />
                                  </svg>
                                </S.AddModalIconButton>
                                <S.AddModalIconButton
                                  onClick={onClickAddOneChangeList(el, false)}
                                >
                                  <svg
                                    width="10"
                                    height="12"
                                    viewBox="0 0 10 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M9.65625 0.65625V2H0.34375V0.65625H2.65625L3.34375 0H6.65625L7.34375 0.65625H9.65625ZM1 10.6562V2.65625H9V10.6562C9 11.0104 8.86458 11.3229 8.59375 11.5938C8.32292 11.8646 8.01042 12 7.65625 12H2.34375C1.98958 12 1.67708 11.8646 1.40625 11.5938C1.13542 11.3229 1 11.0104 1 10.6562Z"
                                      fill="#333333"
                                    />
                                  </svg>
                                </S.AddModalIconButton>
                              </S.AddModalTd>
                            </tr>
                          )}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <S.AddModalWarning>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.69141 9.30859C3.62109 10.2201 4.72396 10.6758 6 10.6758C7.27604 10.6758 8.36979 10.2201 9.28125 9.30859C10.2109 8.37891 10.6758 7.27604 10.6758 6C10.6758 4.72396 10.2109 3.63021 9.28125 2.71875C8.36979 1.78906 7.27604 1.32422 6 1.32422C4.72396 1.32422 3.62109 1.78906 2.69141 2.71875C1.77995 3.63021 1.32422 4.72396 1.32422 6C1.32422 7.27604 1.77995 8.37891 2.69141 9.30859ZM1.87109 1.89844C3.01953 0.75 4.39583 0.175781 6 0.175781C7.60417 0.175781 8.97135 0.75 10.1016 1.89844C11.25 3.02865 11.8242 4.39583 11.8242 6C11.8242 7.60417 11.25 8.98047 10.1016 10.1289C8.97135 11.2591 7.60417 11.8242 6 11.8242C4.39583 11.8242 3.01953 11.2591 1.87109 10.1289C0.740885 8.98047 0.175781 7.60417 0.175781 6C0.175781 4.39583 0.740885 3.02865 1.87109 1.89844ZM5.42578 3.07422H6.57422V6.57422H5.42578V3.07422ZM5.42578 7.75H6.57422V8.92578H5.42578V7.75Z"
                    fill="#FF0000"
                  />
                </svg>
                저장 버튼을 누르지 않고 나갈 경우 지금까지 변경한 내용은
                저장되지 않습니다.
              </S.AddModalWarning>
            </>
          )}
        </div>

        <div style={{ marginLeft: "1rem" }}>
          {addList.length !== 0 && (
            <div
              style={{
                display: "flex",
                width: "30rem",
                alignItems: "center",
                justifyContent: "flex-start",
                overflowX: addRepeatInput.length > 6 ? "scroll" : "hidden",
                overflowY: "hidden",
              }}
            >
              {addRepeatInput?.map((el, ind) => {
                if (el?.isDelete) {
                  return <></>;
                }
                return (
                  <S.AddModalSelectBox
                    style={{
                      color:
                        selectedAddListIndex === ind ? "#ffffff" : "#858585",
                      backgroundColor:
                        selectedAddListIndex === ind ? "#791285" : "#F5F5F5",
                    }}
                    onClick={() => {
                      if (
                        addRepeatInput?.length > ind &&
                        addList.length !== 0
                      ) {
                        setSelectedAddListIndex(ind);
                      }
                    }}
                  >
                    {ind + 1}
                    {el.id === "" && addRepeatInput.length > 1 && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={onClickAddRepeatDelete(ind)}
                      >
                        <path
                          d="M11.2383 1.81641L7.05469 6L11.2383 10.1836L10.1836 11.2383L6 7.05469L1.81641 11.2383L0.761719 10.1836L4.94531 6L0.761719 1.81641L1.81641 0.761719L6 4.94531L10.1836 0.761719L11.2383 1.81641Z"
                          fill="#82858B"
                        />
                      </svg>
                    )}
                  </S.AddModalSelectBox>
                );
              })}
              <S.AddModalSelectBox
                style={{
                  border: "none",
                  borderBottom: "1px solid #dfe1e5",
                }}
                onClick={
                  addList.length > 0
                    ? onClickAddRepeatInput(addRepeatInput.length)
                    : () => {}
                }
              >
                +
              </S.AddModalSelectBox>
            </div>
          )}
          {/* {Array(6)
                  .fill(0)
                  .map((el, ind) => {
                    return (
                      <S.AddModalSelectBox
                        style={{
                          border: selectedAddListIndex === ind ? "" : "none",
                          borderBottom:
                            selectedAddListIndex === ind
                              ? "none"
                              : "1px solid #dfe1e5",
                        }}
                        onClick={() => {
                          if (
                            addRepeatInput?.length > ind &&
                            addList.length !== 0
                          ) {
                            setSelectedAddListIndex(ind);
                          }
                        }}
                      >
                        {addRepeatInput?.length > ind
                          ? "수업 " + (ind + 1)
                          : ""}
                        {addRepeatInput.length > 1 &&
                          addRepeatInput?.length > ind && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={onClickAddRepeatDelete(ind)}
                            >
                              <path
                                d="M11.2383 1.81641L7.05469 6L11.2383 10.1836L10.1836 11.2383L6 7.05469L1.81641 11.2383L0.761719 10.1836L4.94531 6L0.761719 1.81641L1.81641 0.761719L6 4.94531L10.1836 0.761719L11.2383 1.81641Z"
                                fill="#82858B"
                              />
                            </svg>
                          )}
                        {addRepeatInput.length === ind &&
                          addList.length !== 0 && (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 10 10"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={() => {
                                const newList = [...addRepeatInput];
                                newList.push({
                                  week: [-1],
                                  startTime: dateToClock(date),
                                  endTime: dateToClockOneHour(date),
                                  isAuto: false,
                                  isRepeat: "once",
                                  repeatsNum: 0,
                                  startDate: dateToInput(date),
                                  teacherId: teacherData?.staffInAcademy
                                    ?.filter(
                                      (el) =>
                                        el?.user?.userCategory === "선생님"
                                    )
                                    // .filter((el) => {
                                    //   return (
                                    //     Number(el.profile.academy.id) ===
                                    //     Number(router.query.branch)
                                    //   );
                                    // })
                                    ?.sort((a, b) => {
                                      if (
                                        Number(a.id) === Number(myData.me.id)
                                      ) {
                                        return -1;
                                      } else if (
                                        Number(b.id) === Number(myData.me.id)
                                      ) {
                                        return 1;
                                      } else {
                                        return Number(a.id) - Number(b.id);
                                      }
                                    })?.[0].id,
                                  about: "",
                                });
                                setAddRepeatInput(newList);
                                setAddRepeatCount(addRepeatCount + 1);
                                setSelectedAddListIndex(addRepeatInput.length);
                              }}
                            >
                              <path
                                d="M9.65625 5.65625H5.65625V9.65625H4.34375V5.65625H0.34375V4.34375H4.34375V0.34375H5.65625V4.34375H9.65625V5.65625Z"
                                fill="#333333"
                              />
                            </svg>
                          )}
                      </S.AddModalSelectBox>
                    );
                  })} */}

          {addRepeatInput.map((el, ind) => {
            if (ind === selectedAddListIndex) {
              return (
                <div
                  style={{
                    width: "34rem",
                    height: "38rem",
                    // overflow: "none",
                    overflowY: "scroll",
                    overflowX: "hidden",
                  }}
                >
                  {addList.length !== 0 && el?.oneChangeList !== undefined && (
                    <>
                      <S.AddModalTagTitle>변경 유형</S.AddModalTagTitle>
                      <div
                        style={{
                          display: "flex",
                          width: "20rem",
                          justifyContent: "space-between",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <S.AddRadioButton
                            type="radio"
                            name="isOne"
                            checked={!el?.isOne}
                            onClick={onClickAddOneChangeList(el, false)}
                            style={{
                              width: "1.25rem",
                              height: "1.25rem",
                            }}
                          ></S.AddRadioButton>
                          <span
                            style={{
                              color: !el?.isOne ? "#791285" : "#82858B",
                              fontFamily: "Spoqa Han Sans Neo",
                            }}
                          >
                            전체 변경
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <S.AddRadioButton
                            type="radio"
                            name="isOne"
                            checked={el?.isOne}
                            onClick={onClickAddOneChangeList(el, true)}
                            style={{
                              width: "1.25rem",
                              height: "1.25rem",
                            }}
                          ></S.AddRadioButton>
                          <span
                            style={{
                              color: el?.isOne ? "#791285" : "#82858B",
                              fontFamily: "Spoqa Han Sans Neo",
                            }}
                          >
                            단일 변경
                          </span>
                        </div>
                      </div>
                      {el.isOne && (
                        <div>
                          <S.AddModalTagTitle style={{ color: "#999" }}>
                            {"변경 수업 정보 (열 번호 " + (ind + 1) + "-1)"}
                          </S.AddModalTagTitle>
                          <div style={{ display: "flex" }}>
                            <div>
                              <S.AddModalTagTitle>지정 날짜</S.AddModalTagTitle>
                              <S.AddModalSelect onChange={onChangeOneId(ind)}>
                                {lectureInfoData?.studentLectures
                                  ?.filter((ele) => {
                                    return (
                                      ele?.lecture?.lectureInfo?.id === el?.id
                                    );
                                  })
                                  ?.filter((ele) => {
                                    const newDate = new Date(ele.lecture.date);
                                    if (
                                      newDate.getDate() ===
                                        calendarDate.getDate() &&
                                      newDate.getMonth() ===
                                        calendarDate.getMonth() &&
                                      newDate.getFullYear() ===
                                        calendarDate.getFullYear()
                                    ) {
                                      return true;
                                    }
                                    return newDate - calendarDate >= 0;
                                  })
                                  ?.map((ele) => {
                                    const newDate = new Date(ele.lecture.date);
                                    return (
                                      <option
                                        selected={
                                          Number(ele?.lecture?.id) ===
                                          Number(
                                            el?.oneChangeList?.[0]?.lectureId
                                          )
                                        }
                                        value={ele?.lecture?.id}
                                      >
                                        {ele?.lecture?.date +
                                          "(" +
                                          week[(newDate.getDay() + 6) % 7] +
                                          ")"}
                                      </option>
                                    );
                                  })}
                              </S.AddModalSelect>
                            </div>
                            <div>
                              <S.AddModalTitle>변경 날짜</S.AddModalTitle>
                              <S.AddModalInputDate
                                onChange={onChangeOneDate(ind)}
                                value={el?.oneChangeList?.[0]?.date}
                                type="date"
                              ></S.AddModalInputDate>
                            </div>
                          </div>
                          <div style={{ display: "flex" }}>
                            <div>
                              <S.AddModalTitle>지점</S.AddModalTitle>
                              {myData?.me?.profile?.academies?.length > 0 ? (
                                <S.AddModalSelect
                                  onChange={onChangeOneBranch(ind)}
                                >
                                  {myData?.me?.profile?.academies?.map(
                                    (ele) => {
                                      return (
                                        <option
                                          value={Number(ele.id)}
                                          selected={
                                            Number(router.query.branch) ===
                                            Number(
                                              el?.oneChangeList?.[0]?.branchId
                                            )
                                          }
                                        >
                                          {ele.location}
                                        </option>
                                      );
                                    }
                                  )}
                                </S.AddModalSelect>
                              ) : (
                                <S.AddModalSelect disabled={true}>
                                  <option value={Number(router.query.branch)}>
                                    {myData?.me?.profile?.academy?.name}
                                  </option>
                                </S.AddModalSelect>
                              )}
                            </div>
                            <div>
                              <S.AddModalTitle>담당 선생님</S.AddModalTitle>
                              <S.AddModalSelect
                                onChange={onChangeOneTeacher(ind)}
                              >
                                {teacherData?.staffInAcademy
                                  ?.filter(
                                    (el) => el.user.userCategory === "선생님"
                                  )
                                  .map((ele) => {
                                    return (
                                      <option
                                        value={ele.id}
                                        selected={
                                          Number(ele.id) ===
                                          Number(
                                            el.oneChangeList?.[0]?.teacherId
                                          )
                                        }
                                      >
                                        {ele.korName}
                                      </option>
                                    );
                                  })}
                              </S.AddModalSelect>
                            </div>
                          </div>
                          <div>
                            <S.AddModalTitle>수업시간</S.AddModalTitle>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <S.AddModalInputTime
                                type="time"
                                onChange={onChangeOneStartTime(ind)}
                                value={el?.oneChangeList?.[0]?.startTime}
                              ></S.AddModalInputTime>
                              ~
                              <S.AddModalInputTime
                                type="time"
                                onChange={onChangeOneEndTime(ind)}
                                value={el?.oneChangeList?.[0]?.endTime}
                              ></S.AddModalInputTime>
                            </div>
                          </div>
                          <div>
                            <S.AddModalTitle>메모</S.AddModalTitle>
                            <S.AddModalTextArea
                              onChange={onChangeOneAbout(ind)}
                              value={el?.oneChangeList?.[0]?.about}
                              placeholder={"메모를 입력해주세요."}
                            ></S.AddModalTextArea>
                          </div>
                          <S.AddModalTagTitle style={{ color: "#999" }}>
                            {"기존 수업 정보 (열 번호 " + (ind + 1) + ")"}
                          </S.AddModalTagTitle>
                        </div>
                      )}
                    </>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "31rem",
                    }}
                  >
                    <div>
                      <S.AddModalTagTitle>변경 시작 날짜</S.AddModalTagTitle>
                      <S.AddModalInputDate
                        type="date"
                        value={addRepeatInput[ind].startDate}
                        disabled={addList.length === 0 || el.isOne}
                        onChange={onChangeRepeatDate(ind)}
                      ></S.AddModalInputDate>
                    </div>
                  </div>

                  <div style={{ display: "flex" }}>
                    <div>
                      <S.AddModalTagTitle>담당 지점</S.AddModalTagTitle>
                      {myData?.me?.profile?.academies?.length > 0 ? (
                        <S.AddModalSelect onChange={(e) => {}}>
                          {myData?.me?.profile?.academies?.map((ele) => {
                            return (
                              <option
                                value={Number(ele.id)}
                                selected={
                                  Number(router.query.branch) ===
                                  Number(el?.oneChangeList?.[0]?.branchId)
                                }
                                disabled={true}
                              >
                                {ele.location}
                              </option>
                            );
                          })}
                        </S.AddModalSelect>
                      ) : (
                        <S.AddModalSelect disabled={true}>
                          <option value={Number(router.query.branch)}>
                            {myData?.me?.profile?.academy?.name}
                          </option>
                        </S.AddModalSelect>
                      )}
                    </div>
                    <div>
                      <S.AddModalTagTitle>담당 선생님</S.AddModalTagTitle>
                      <S.AddModalSelect
                        onChange={onChangeRepeatTeacherId(ind)}
                        style={{
                          backgroundColor:
                            addList.length === 0 || el.isOne ? "#f1f1f1" : "",
                        }}
                        disabled={addList.length === 0 || el.isOne}
                        // value={teacherId}
                      >
                        {teacherData?.staffInAcademy
                          ?.filter((el) => el.user.userCategory === "선생님")
                          .map((el) => {
                            return (
                              <option
                                key={uuidv4()}
                                value={el.id}
                                selected={
                                  Number(addRepeatInput[ind].teacherId) ===
                                  Number(el.id)
                                }
                              >
                                {el.korName}
                              </option>
                            );
                          })}
                      </S.AddModalSelect>
                    </div>
                  </div>
                  <S.AddModalTagTitle>반복</S.AddModalTagTitle>
                  <S.ModalRadioBox>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "2rem",
                        }}
                      >
                        <S.AddRadioButton
                          type="radio"
                          name={"type" + ind}
                          value={"routine"}
                          checked={addRepeatInput[ind].isRepeat === "routine"}
                          style={{
                            width: "1.25rem",
                            height: "1.25rem",
                            backgroundColor: "#791285",
                          }}
                          onClick={onChangeRepeatIsRepeat(ind, "routine")}
                          disabled={addList.length === 0 || el.isOne}
                        ></S.AddRadioButton>
                        <S.AddRadioTitle
                          style={
                            addRepeatInput[ind].isRepeat === "routine" &&
                            addList.length !== 0
                              ? { marginRight: "1rem" }
                              : { color: "#cccccc", marginRight: "1rem" }
                          }
                        >
                          주 반복
                        </S.AddRadioTitle>
                        <div
                          style={{
                            width: "3.4375rem",
                            border: "1px solid #DBDDE1",
                            borderRadius: "0.5rem",
                            backgroundColor:
                              addRepeatInput[ind].isAuto ||
                              addList.length === 0 ||
                              el.isOne
                                ? "#f9f9f9"
                                : "",
                          }}
                        >
                          <input
                            type="number"
                            onChange={onChangeRepeatCount(ind)}
                            style={{
                              borderRadius: "0.5rem",
                              border: "0",
                              width: "2.2rem",
                              height: "2.6875rem",
                              textAlign: "center",
                              paddingLeft: "1rem",
                            }}
                            value={
                              addRepeatInput[ind]?.isRepeat === "routine"
                                ? addRepeatInput[ind].repeatsNum
                                : 0
                            }
                            disabled={
                              addRepeatInput[ind].isAuto ||
                              addList.length === 0 ||
                              el.isOne ||
                              addRepeatInput[ind]?.isRepeat !== "routine"
                            }
                          ></input>
                        </div>
                        <S.AddModalContent style={{ marginLeft: "0.62rem" }}>
                          {"주"}
                        </S.AddModalContent>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <S.AddRadioButton
                          type="radio"
                          name={"type" + ind}
                          checked={addRepeatInput[ind].isRepeat === "infinity"}
                          value={"infinity"}
                          onClick={onChangeRepeatIsRepeat(ind, "infinity")}
                          style={{ width: "1.25rem", height: "1.25rem" }}
                          disabled={addList.length === 0 || el.isOne}
                        ></S.AddRadioButton>
                        <S.AddRadioTitle
                          style={
                            addRepeatInput[ind].isRepeat === "infinity" &&
                            addList.length !== 0
                              ? {}
                              : { color: "#cccccc" }
                          }
                        >
                          무한 반복
                        </S.AddRadioTitle>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        marginLeft: "6.75rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginBottom: "2rem",
                        }}
                      >
                        <S.AddRadioButton
                          type="radio"
                          name={"type" + ind}
                          value={"routine"}
                          checked={addRepeatInput[ind].isRepeat === "count"}
                          style={{
                            width: "1.25rem",
                            height: "1.25rem",
                          }}
                          onClick={onChangeRepeatIsRepeat(ind, "count")}
                          disabled={addList.length === 0 || el.isOne}
                        ></S.AddRadioButton>
                        <S.AddRadioTitle
                          style={
                            addRepeatInput[ind].isRepeat === "count" &&
                            addList.length !== 0
                              ? { marginRight: "1rem" }
                              : { color: "#cccccc", marginRight: "1rem" }
                          }
                        >
                          횟수 반복
                        </S.AddRadioTitle>
                        <div
                          style={{
                            width: "3.4375rem",
                            border: "1px solid #DBDDE1",
                            borderRadius: "0.5rem",
                            backgroundColor:
                              addRepeatInput[ind].isAuto ||
                              addList.length === 0 ||
                              el.isOne
                                ? "#f9f9f9"
                                : "",
                          }}
                        >
                          <input
                            type="number"
                            onChange={onChangeRepeatCount(ind)}
                            style={{
                              borderRadius: "0.5rem",
                              border: "0",
                              width: "2.2rem",
                              height: "2.6875rem",
                              textAlign: "center",
                              paddingLeft: "1rem",
                            }}
                            value={
                              addRepeatInput[ind]?.isRepeat === "count"
                                ? addRepeatInput[ind].repeatsNum
                                : 0
                            }
                            disabled={
                              addRepeatInput[ind].isAuto ||
                              addList.length === 0 ||
                              el.isOne ||
                              addRepeatInput[ind]?.isRepeat !== "count"
                            }
                          ></input>
                        </div>
                        <S.AddModalContent style={{ marginLeft: "0.62rem" }}>
                          {"회"}
                        </S.AddModalContent>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <S.AddRadioButton
                          type="radio"
                          name={"type" + ind}
                          checked={addRepeatInput[ind].isRepeat === "once"}
                          value={"once"}
                          onClick={onChangeRepeatIsRepeat(ind, "once")}
                          style={{ width: "1.25rem", height: "1.25rem" }}
                          disabled={addList.length === 0 || el.isOne}
                        ></S.AddRadioButton>
                        <S.AddRadioTitle
                          style={
                            addRepeatInput[ind].isRepeat === "once" &&
                            addList.length !== 0
                              ? {}
                              : { color: "#cccccc" }
                          }
                        >
                          반복 없음
                        </S.AddRadioTitle>
                      </div>
                    </div>
                  </S.ModalRadioBox>
                  {addRepeatInput[ind].isRepeat === "once" ? (
                    <></>
                  ) : (
                    <>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "1.87rem",
                        }}
                      >
                        {/* <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginLeft: "0.7rem",
                                marginBottom: "1.25rem",
                              }}
                            >
                              <input
                                type="checkbox"
                                checked={addRepeatInput[ind].isAuto}
                                style={{
                                  width: "1rem",
                                  height: "1rem",
                                  marginRight: "0.62rem",
                                }}
                                onChange={onChangeRepeatIsAuto(ind)}
                                disabled={
                                  addRepeatInput[ind].isRepeat === "count" ||
                                  addList.length === 0 ||
                                  el.isOne
                                }
                              ></input>
                              <S.AddModalContent
                                style={{
                                  fontSize: "1rem",
                                  fontWeight: "400",
                                  fontStyle: "Noto Sans KR",
                                }}
                              >
                                자동 생성
                              </S.AddModalContent>
                            </div> */}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          marginLeft: "0.6rem",
                        }}
                      >
                        {/* <div
                              style={{
                                width: "3.4375rem",
                                border: "1px solid #DBDDE1",
                                borderRadius: "0.5rem",
                                backgroundColor:
                                  addRepeatInput[ind].isAuto ||
                                  addList.length === 0 ||
                                  el.isOne
                                    ? "#f9f9f9"
                                    : "",
                              }}
                            >
                              <input
                                type="number"
                                onChange={onChangeRepeatCount(ind)}
                                style={{
                                  borderRadius: "0.5rem",
                                  border: "0",
                                  width: "2.2rem",
                                  height: "2.6875rem",
                                  textAlign: "center",
                                  paddingLeft: "1rem",
                                }}
                                value={addRepeatInput[ind].repeatsNum}
                                disabled={
                                  addRepeatInput[ind].isAuto ||
                                  addList.length === 0 ||
                                  el.isOne
                                }
                              ></input>
                            </div>
                            <S.AddModalContent
                              style={{ marginLeft: "0.62rem" }}
                            >
                              {addRepeatInput[ind].isRepeat === "count"
                                ? "회 동안"
                                : "주 동안"}
                            </S.AddModalContent> */}
                        <S.ModalRoutineDates>
                          {week.map((week, index) => {
                            return (
                              <S.ModalRoutineDate
                                key={uuidv4()}
                                onClick={onClickRepeatDates(ind, index)}
                                style={
                                  addList.length === 0 || el.isOne
                                    ? { backgroundColor: "#f9f9f9" }
                                    : addRepeatInput[ind].week.includes(index)
                                    ? {
                                        backgroundColor: "#791285",
                                        color: "#eeeeee",
                                      }
                                    : {}
                                }
                              >
                                {week}
                              </S.ModalRoutineDate>
                            );
                          })}
                        </S.ModalRoutineDates>
                        <S.AddModalContent style={{ marginLeft: "0.62rem" }}>
                          {" "}
                          반복
                        </S.AddModalContent>
                      </div>
                    </>
                  )}

                  <S.AddModalTagTitle>수업 시간</S.AddModalTagTitle>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "31.5rem",
                    }}
                  >
                    <S.AddModalTimeInput
                      type="time"
                      disabled={addList.length === 0 || el.isOne}
                      style={{ marginLeft: "0.66rem" }}
                      value={addRepeatInput[ind].startTime}
                      onChange={onChangeRepeatStartTime(ind)}
                    ></S.AddModalTimeInput>
                    ~
                    <S.AddModalTimeInput
                      type="time"
                      disabled={addList.length === 0 || el.isOne}
                      // defaultValue={dateToClockOneHour(date)}
                      value={addRepeatInput[ind].endTime}
                      onChange={onChangeRepeatEndTime(ind)}
                    ></S.AddModalTimeInput>
                  </div>
                  <S.ModalInputBox style={{ display: "block" }}>
                    <S.AddModalTagTitle>메모</S.AddModalTagTitle>

                    <S.AddModalTextArea
                      onChange={onChangeRepeatAbout(ind)}
                      style={{
                        width: "30.6rem",
                        borderRadius: "0.5rem",
                        border: "1px solid #DBDDE1",
                      }}
                      disabled={addList.length === 0 || el.isOne}
                      placeholder={"메모를 입력해주세요."}
                      value={addRepeatInput[ind].about}
                    ></S.AddModalTextArea>
                  </S.ModalInputBox>
                </div>
              );
            }
          })}
        </div>
      </S.ModalClassAddWrapper>
      <S.ModalButtonBox
        style={{
          width: "100%",
          justifyContent: "center",
          marginTop: "0.87rem",
          // backgroundColor: "#F4F4F8",
        }}
      >
        <S.AddModalOKButton
          style={
            addList.length === 0
              ? {
                  borderRadius: "0.25rem",
                  border: "1px solid #791285",
                  cursor: "default",
                  opacity: 0.5,
                  background: "#791285",
                  color: "#FFF",
                }
              : {}
          }
          disabled={addList.length === 0}
          onClick={onClickOk}
        >
          저장
        </S.AddModalOKButton>
        <S.AddModalCancelButton
          onClick={onClickCancel}
          style={{ background: "#EBECEF", color: "#000" }}
        >
          취소
        </S.AddModalCancelButton>
      </S.ModalButtonBox>
    </Modal>
  );
};
