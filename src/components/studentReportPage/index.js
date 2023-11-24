import { useMutation, useQuery } from "@apollo/client";
import * as S from "./studentReport.style";
import ReactDOM from "react-dom";
import {
  CREATE_OPINION,
  GET_ALL_STUDENTS,
  GET_ME,
  GET_MEMO,
  GET_MEMOS,
  GET_MONTH_REPORT,
  GET_OPINION,
  GET_STUDENT,
  GET_SUMMARY_REPORT,
} from "./studentReport.query";
import { useRouter } from "next/router";
import { use, useEffect, useRef, useState } from "react";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  BarChart,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import React, { PureComponent } from "react";
import { BgColorsOutlined, PlusOutlined } from "@ant-design/icons";
import { Modal, Select } from "antd";
import {
  addComma,
  dateToInput,
  dateToMonth,
} from "@/src/commons/library/library";
import ReactToPrint from "react-to-print";

export default function StudentReportPage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [maxAR, setMaxAr] = useState(0);
  const [maxBooks, setMaxBooks] = useState(0);
  const [maxWC, setMaxWC] = useState(0);
  const [maxSR, setMaxSr] = useState(0);
  const [maxWCPerBooks, setMaxWCPerBooks] = useState(0);
  const [maxCorrects, setMaxCorrects] = useState(0);
  const [widows, setWidows] = useState(false);
  const [moreView, setMoreView] = useState(false);
  const [isAr, setIsAr] = useState(false);
  const [isWc, setIsWc] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isBooks, setIsBooks] = useState(false);
  const [isDays, setIsDays] = useState(false);
  const [monthList, setMonthList] = useState([]);
  const [selectMonths] = useState([
    { name: "1월", date: "01" },
    { name: "2월", date: "02" },
    { name: "3월", date: "03" },
    { name: "4월", date: "04" },
    { name: "5월", date: "05" },
    { name: "6월", date: "06" },
    { name: "7월", date: "07" },
    { name: "8월", date: "08" },
    { name: "9월", date: "09" },
    { name: "10월", date: "10" },
    { name: "11월", date: "11" },
    { name: "12월", date: "12" },
  ]);
  const [selectedYear, setSelectedYear] = useState();
  const [latestData, setLatestData] = useState([
    {
      name: "지난 달",
      ar: 1.5,
      wc: 1400,
      averageCorrects: 87,
      books: 22,
      days: 15,
      color: "#A8AAAE",
    },
    {
      name: "이번 달",
      ar: 1.7,
      wc: 1500,
      averageCorrects: 99,
      books: 24,
      days: 17,
      color: "#862991",
    },
  ]);
  const [halfYearData, setHalfYearData] = useState([
    {
      name: "1월",
      wc: 1818,
      books: 16,
      ar: 2.7,
      correct: 88,
      days: 15,
      WCPerBooks: 1641,
    },
    {
      name: "2월",
      wc: 1981,
      books: 19,
      ar: 2.5,
      correct: 96,
      days: 13,
      WCPerBooks: 1981,
    },
    {
      name: "3월",
      wc: 1899,
      books: 14,
      ar: 2.7,
      correct: 91,
      days: 17,
      WCPerBooks: 2074,
    },
    {
      name: "4월",
      wc: 1997,
      books: 17,
      ar: 2.9,
      correct: 95,
      days: 16,
      WCPerBooks: 1717,
    },
    {
      name: "5월",
      wc: 1921,
      books: 15,
      ar: 2.8,
      correct: 79,
      days: 15,
      WCPerBooks: 2274,
    },
    {
      name: "6월",
      wc: 1999,
      books: 20,
      ar: 3.1,
      correct: 96,
      days: 17,
      WCPerBooks: 2101,
    },
  ]);
  const [memoData, setMemoData] = useState([]);
  const [opinion, setOpinion] = useState("");
  const [opinionIndex, setOpinionIndex] = useState(1);
  const [options, setOptions] = useState([]);

  const printRef = useRef(null);

  const { data: studentData } = useQuery(GET_ALL_STUDENTS, {
    variables: { academyId: Number(router.query.branch) },
  });

  const { data: userData } = useQuery(GET_STUDENT, {
    variables: {
      userId: Number(router.query.id),
      academyId: Number(router.query.branch),
    },
  });

  const { data: summaryData } = useQuery(GET_SUMMARY_REPORT, {
    variables: {
      studentId: Number(router.query.id),
      date: dateToInput(date).slice(0, 7) + "-01",
    },
  });
  const { data: monthData } = useQuery(GET_MONTH_REPORT, {
    variables: {
      studentId: Number(router.query.id),
      date: dateToInput(date).slice(0, 7) + "-01",
    },
  });

  const { data: myData } = useQuery(GET_ME); // 수정 필수
  // const { data: myData } = {
  //   data: {
  //     me: {
  //       id: "9",
  //       username: "gyeonggi_teacher",
  //       userCategory: "\uc120\uc0dd\ub2d8",
  //       profile: {
  //         id: 9,
  //         korName: "\uacbd\uae30\ud37c\ud50c",
  //         engName: "gyeonggiPurple",
  //         registerDate: "2023-08-01",
  //         birthDate: "1980-01-01",
  //         academy: {
  //           id: "2",
  //           name: "\ud37c\ud50c\uc544\uce74\ub370\ubbf8",
  //           location:
  //             "\uacbd\uae30 \uc6a9\uc778\uc2dc \uc218\uc9c0\uad6c \ud3ec\uc740\ub300\ub85c 536 \uc2e0\uc138\uacc4\ubc31\ud654\uc810\uacbd\uae30\uc810 8F",
  //           __typename: "AcademyType",
  //         },
  //         __typename: "TeacherType",
  //       },
  //       __typename: "UserType",
  //     },
  //   },
  // };

  const { data: memosData, refetch: refetchMemos } = useQuery(GET_MEMOS, {
    variables: {
      studentId: Number(router.query.id),
      academyIds: myData?.me?.profile?.academies
        ? myData?.me?.profile?.academies.map((el) => Number(el.id))
        : [Number(myData?.me?.profile?.academy.id)],
    },
  });
  const { data: opinionData, refetch: refetchOpinion } = useQuery(GET_OPINION, {
    variables: {
      userId: Number(myData?.me?.id),
      studentId: Number(router.query.id),
      date: dateToMonth(date) + "-01",
    },
  });

  const [createOpinion] = useMutation(CREATE_OPINION);

  const onChangeDate = (e) => {
    const newDate = new Date(e.target.value + "-01");
    setDate(newDate);
  };

  const onClickCreateOpinion = async () => {
    // console.log(opinionData?.getOpinion?.[0]?.id);
    // return;
    const variables = {
      contents: opinion,
      writerId: Number(myData?.me?.id),
      studentId: Number(router.query.id),
      date: dateToMonth(date) + "-01",
      opinionId: null,
    };

    if (opinionData !== undefined) {
      variables.opinionId = Number(opinionData?.getOpinion?.[0]?.id);
    }

    try {
      await createOpinion({ variables: variables });
      setHasUnsavedChanges(false);
      alert("종합의견이 저장됐습니다.");
      refetchOpinion();
    } catch (err) {}
  };

  const CustomTooltip1 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const wc = payload[0].payload.wc;
      const books = payload[0].payload.books;

      return (
        <div
          className="custom-tooltip"
          style={{
            height: 250,
            margin: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: 30,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 5,
              border: "1px solid #dfdfdf",
            }}
          >
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: 500,
                fontFamily: "Spoqa Han Sans Neo",
              }}
              className="label"
            >{`${label}`}</p>
            <p
              style={{
                fontSize: "1rem",
                color: "#FC480D",
                fontFamily: "Spoqa Han Sans Neo",
              }}
              className="data"
            >{`WC : ${addComma(wc)}`}</p>
            <p
              style={{
                fontSize: "1rem",
                color: "#64C7FD",
                fontFamily: "Spoqa Han Sans Neo",
              }}
              className="data"
            >{`권수 : ${books} 권`}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltip2 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const ar = payload[0].payload.ar;
      const wcPerBook = payload[0].payload.WCPerBooks;
      const corrects = payload[0].payload.correct;

      return (
        <div
          className="custom-tooltip"
          style={{
            height: 250,
            margin: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: 30,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 5,
              border: "1px solid #dfdfdf",
            }}
          >
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: 500,
                fontFamily: "Spoqa Han Sans Neo",
              }}
              className="label"
            >{`${label}`}</p>
            <p
              style={{
                fontSize: "1rem",
                color: "#578537",
                fontFamily: "Spoqa Han Sans Neo",
              }}
              className="data"
            >{`AR : ${ar}`}</p>
            <p
              style={{
                fontSize: "1rem",
                color: "#FE7445",
                fontFamily: "Spoqa Han Sans Neo",
              }}
              className="data"
            >{`WC/권 : ${addComma(wcPerBook)}`}</p>
            <p
              style={{
                fontSize: "1rem",
                color: "#8FC5FB",
                fontFamily: "Spoqa Han Sans Neo",
              }}
              className="data"
            >{`정답률 : ${corrects}%`}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltip3 = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const ar = payload[0].payload.ar;
      const sr = payload[0].payload.sr;

      return (
        <div
          className="custom-tooltip"
          style={{
            height: 250,
            margin: 20,
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: 30,
              paddingTop: 10,
              paddingBottom: 10,
              borderRadius: 5,
              border: "1px solid #dfdfdf",
            }}
          >
            <p
              style={{
                fontSize: "1.5rem",
                fontWeight: 500,
                fontFamily: "Spoqa Han Sans Neo",
              }}
              className="label"
            >{`${label}`}</p>
            <p
              style={{
                fontSize: "1rem",
                color: "#578537",
                fontFamily: "Spoqa Han Sans Neo",
              }}
              className="data"
            >{`AR : ${ar}`}</p>
            <p
              style={{
                fontSize: "1rem",
                color: "#293391",
                fontFamily: "Spoqa Han Sans Neo",
              }}
              className="data"
            >{`sr : ${sr || 0}`}</p>
          </div>
        </div>
      );
    }
    return null;
  };

  // useEffect(() => {
  //   console.log([myData?.me?.profile?.academies]);
  //   refetchMemos();
  // }, [myData]);

  // 페이지 벗어날 때

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // 예시: 사용자가 어떤 입력 필드를 수정한 경우
    const checkUnsavedChanges = () => {
      // 변경 사항이 있다면
      setHasUnsavedChanges(true);
    };

    // 여기에서 페이지 이동 전에 변경 사항을 확인하는 이벤트 리스너를 등록합니다.
    window.addEventListener("beforeunload", checkUnsavedChanges);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 해제합니다.
    return () => {
      window.removeEventListener("beforeunload", checkUnsavedChanges);
    };
  }, []);

  useEffect(() => {
    // 페이지 이동 이벤트를 감지하여 사용자에게 경고 메시지를 표시합니다.
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        const confirmationMessage =
          "변경 내용이 저장되지 않을 수 있습니다. 저장하지 않고 이동하시겠습니까?";
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.onbeforeunload = handleBeforeUnload;

    return () => {
      window.onbeforeunload = null;
    };
  }, [hasUnsavedChanges]);

  // 최근 반년 정보 데이터 추출
  useEffect(() => {
    if (Array.isArray(monthData?.getMonthReports)) {
      const newHalfYearData = [];
      const sortArray = monthData?.getMonthReports
        .sort((a, b) => {
          return b.month - a.month;
        })
        .filter((el) => {
          return (
            Number(el.month) -
              (100 * Number(date.getFullYear()) +
                Number(date.getMonth() + 1)) <=
            0
          );
        });

      sortArray.forEach((el, index) => {
        if (index < 6) {
          newHalfYearData.unshift({
            name: (el.month % 100) + "월",
            ar: el.ar,
            books: el.bc,
            wc: el.wc,
            WCPerBooks: el.wcPerBook,
            correct: el.correct,
            sr: el.sr,
            blank: 0,
          });
        }
      });
      setHalfYearData(newHalfYearData);
      // if (summaryData?.getSummaryReport?.thisMonthAr === null) {
      //   const newLatestData = [
      //     {
      //       name: "지난 달",
      //       ar: newHalfYearData[4].ar,
      //       wc: newHalfYearData[4].wc,
      //       averageCorrects: newHalfYearData[4].correct,
      //       books: newHalfYearData[4].books,
      //       days: 15,
      //       color: "gray",
      //     },
      //     {
      //       name: "이번 달",
      //       ar: newHalfYearData[5].ar,
      //       wc: newHalfYearData[5].wc,
      //       averageCorrects: newHalfYearData[5].correct,
      //       books: newHalfYearData[5].books,
      //       days: 15,
      //       color: "#CC1071",
      //     },
      //   ];
      // } else {
      // }
      const newLatestData = [
        {
          name: "지난 달",
          ar: summaryData?.getSummaryReport?.lastMonthAr
            ? summaryData?.getSummaryReport?.lastMonthAr
            : 0,
          wc: summaryData?.getSummaryReport?.lastMonthWc
            ? summaryData?.getSummaryReport?.lastMonthWc
            : 0,
          averageCorrects: summaryData?.getSummaryReport?.lastMonthCorrect
            ? summaryData?.getSummaryReport?.lastMonthCorrect
            : 0,
          books: summaryData?.getSummaryReport?.lastMonthBc
            ? summaryData?.getSummaryReport?.lastMonthBc
            : 0,
          days: summaryData?.getSummaryReport?.lastMonthStudyDays
            ? summaryData?.getSummaryReport?.lastMonthStudyDays
            : 0,
          sr: summaryData?.getSummaryReport?.lastMonthSr
            ? summaryData?.getSummaryReport?.lastMonthSr
            : 0,

          wcPerBook: summaryData?.getSummaryReport?.lastPerWc
            ? summaryData?.getSummaryReport?.lastPerWc
            : 0,
          color: "#A8AAAE",
        },
        {
          name: "이번 달",
          ar: summaryData?.getSummaryReport?.thisMonthAr
            ? summaryData?.getSummaryReport?.thisMonthAr
            : 0,
          wc: summaryData?.getSummaryReport?.thisMonthWc
            ? summaryData?.getSummaryReport?.thisMonthWc
            : 0,
          averageCorrects: summaryData?.getSummaryReport?.thisMonthCorrect
            ? summaryData?.getSummaryReport?.thisMonthCorrect
            : 0,
          books: summaryData?.getSummaryReport?.thisMonthBc
            ? summaryData?.getSummaryReport?.thisMonthBc
            : 0,
          days: summaryData?.getSummaryReport?.thisMonthStudyDays
            ? summaryData?.getSummaryReport?.thisMonthStudyDays
            : 0,
          sr: summaryData?.getSummaryReport?.thisMonthSr
            ? summaryData?.getSummaryReport?.thisMonthSr
            : 0,

          wcPerBook: summaryData?.getSummaryReport?.thisPerWc
            ? summaryData?.getSummaryReport?.thisPerWc
            : 0,
          color: "#862991",
        },
      ];
      setLatestData(newLatestData);
      setWidows(true);
    }
  }, [monthData, summaryData]);

  useEffect(() => {
    if (studentData) {
      setOptions(
        studentData?.studentsInAcademy
          ?.filter((el) => {
            return el.user.isActive;
          })
          ?.sort((a, b) => {
            return a?.korName?.localeCompare(b?.korName, "kr-KR");
          })
          ?.map((el) => {
            return { value: el.id, label: el.korName + "(" + el.engName + ")" };
          })
      );
    }
  }, [studentData]);

  useEffect(() => {
    if (memosData?.getLectureMemoByStudent?.length > 3) {
      setMemoData(
        memosData?.getLectureMemoByStudent
          ?.filter((el, index) => {
            return index > memosData?.getLectureMemoByStudent.length - 4;
          })
          ?.map((el) => {
            return {
              memo: el.memo,
              date: el.lecture.date,
            };
          })
      );
    } else {
      setMemoData(
        memosData?.getLectureMemoByStudent?.map((el) => {
          return {
            memo: el.memo,
            date: el.lecture.date,
          };
        })
      );
    }
  }, [memosData]);

  useEffect(() => {
    if (monthData !== undefined) {
      const newMonth = [];
      const months = monthData?.getMonthReports?.map((el) => {
        return String(el.month);
      });
      months?.forEach((el) => {
        if (
          newMonth?.findIndex((ele) => {
            return ele.year === el.slice(0, 4);
          }) !== -1
        ) {
          newMonth[
            newMonth?.findIndex((ele) => {
              return ele.year === el.slice(0, 4);
            })
          ].months.push(el?.slice(4, 6));
        } else {
          newMonth.push({
            year: el?.slice(0, 4),
            months: [el?.slice(4, 6)],
          });
        }
      });
      setMonthList(newMonth);
      newMonth?.forEach((el) => {
        if (dateToInput(date).slice(0, 4) === el.year) {
          setSelectedYear(el);
        }
      });
    }
  }, [monthData]);

  useEffect(() => {
    let ar = 0;
    let wc = 0;
    let wcPerBooks = 0;
    let corrects = 0;
    let books = 0;
    let sr = 0;
    halfYearData.forEach((el) => {
      if (ar < el.ar) {
        ar = el.ar;
      }
      if (sr < el.sr) {
        sr = el.sr;
      }
      if (wc < el.wc) {
        wc = el.wc;
      }
      if (corrects < el.correct) {
        corrects = el.correct;
      }
      if (books < el.books) {
        books = el.books;
      }
      if (wcPerBooks < el.WCPerBooks) {
        wcPerBooks = el.WCPerBooks;
      }
    });
    setMaxAr(Math.ceil(ar * 1.1));
    setMaxSr(Math.ceil(sr * 1.1));
    setMaxBooks(Math.ceil(books * 1.1));
    setMaxWC(Math.ceil(wc * 1.1));
    setMaxWCPerBooks(Math.ceil(wcPerBooks * 1.1));
    setMaxCorrects(Math.ceil(corrects * 1.1));
  }, [halfYearData]);

  useEffect(() => {
    if (opinionData !== undefined) {
      setOpinion(opinionData?.getOpinion[0]?.contents);
    } else {
      setOpinion("");
    }
  }, [opinionData]);

  const filterOption = (input, option) => {
    // const target = option?.label?.replace(/[^\w]/g, "");
    console.log(
      (option?.label ?? "")
        .toLowerCase()
        .includes(input.replace(/[^\w]/g, "").toLowerCase()),
      "aaaa"
    );
    return (option?.label ?? "")
      .toLowerCase()
      .includes(input.replace(/[^\w]/g, "").toLowerCase());
  };

  return (
    <S.PageWrapper>
      <style>{`
  table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
  }
  th,
  td {
    height: 2rem;
    width: 7rem;
    border-bottom: 2px solid #DFE1E5;
  }
  th {
    text-align: center;
  }
  td {
    text-align: center;
  }
`}</style>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginBottom: "2.5rem",
        }}
      >
        <div
          style={{
            width: "90rem",
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <S.ReportTitle>학습 리포트</S.ReportTitle>
        </div>
      </div>
      <div
        style={{
          marginLeft: "86.75rem",
          display: "flex",
          alignItems: "center",
          marginBottom: "1.87rem",
        }}
      >
        <div
          style={{
            fontFamily: "Spoqa Han Sans Neo",
            fontSize: "1.125rem",
            fontWeight: "700",
            marginRight: "3.06rem",
          }}
        >
          원생 선택
        </div>
        {userData && (
          <Select
            showSearch
            onSearch={(value) => {}}
            filterOption={filterOption}
            style={{
              width: "10.875rem",
              height: "2.075rem",
              borderBottom: "1px solid #858585",
              fontSize: 18,
              fontWeight: "bold",
            }}
            // defaultValue={{
            //   value: router.query.id,
            //   label: options?.filter(
            //     (el) => Number(el?.value) === Number(router.query.id)
            //   )[0],
            // }}
            defaultValue={
              userData !== undefined
                ? {
                    value: Number(router.query.id),
                    label:
                      userData?.userDetails?.profile?.korName +
                      "(" +
                      userData?.userDetails?.profile?.engName +
                      ")",
                  }
                : {}
            }
            bordered={false}
            onChange={(value) => {
              window.location.href =
                "https://readingcenter.purpleacademy.co.kr/" +
                router.query.branch +
                "/report/reportDetail/" +
                value;
            }}
            options={options}
          />
        )}
        {/* <select
          style={{
            width: "10.875rem",
            height: "2.6875rem",
            border: "none",
            borderBottom: "1px solid #858585",
            fontSize: "1rem",
            fontWeight: "700",
            marginRight: "3.06rem",
          }}
        >
          {studentData?.studentsInAcademy?.map((el) => {
            return (
              <option
                value={el?.id}
                selected={Number(el?.id) === Number(router.query.id)}
              >
                {el?.korName}
              </option>
            );
          })}
        </select> */}
      </div>
      {/* <div>
        <span>기준 월</span>
        <input
          value={dateToMonth(date)}
          onChange={onChangeDate}
          type="month"
        ></input>
      </div> */}
      <S.DateButtonContainer>
        <S.DateButtonBox>
          <S.DateButtonTag>
            <S.DateButtonTagTitle>기준연도</S.DateButtonTagTitle>
            {monthList
              ?.sort((a, b) => {
                return Number(a.year) - Number(b.year);
              })
              ?.map((el) => {
                return (
                  <S.DateYearButton
                    style={{
                      backgroundColor:
                        dateToInput(date).slice(0, 4) === el.year
                          ? "#791285"
                          : "",
                      color:
                        dateToInput(date).slice(0, 4) === el.year ? "#fff" : "",
                    }}
                    onClick={() => {
                      const newDate = new Date(
                        el.year + "-" + dateToInput(date).slice(5, 7) + "-01"
                      );
                      setDate(newDate);
                      setSelectedYear(el);
                    }}
                  >
                    {el.year + "년"}
                  </S.DateYearButton>
                );
              })}
          </S.DateButtonTag>
          <S.DateButtonTag>
            <S.DateButtonTagTitle>기준월</S.DateButtonTagTitle>
            {selectMonths?.map((el) => (
              <S.DateMonthButton
                style={{
                  backgroundColor:
                    dateToInput(date).slice(5, 7) === el.date
                      ? "#791285"
                      : selectedYear?.months?.includes(el.date)
                      ? ""
                      : "#acacac",
                  color:
                    dateToInput(date).slice(5, 7) === el.date ? "#fff" : "",
                }}
                disabled={!selectedYear?.months?.includes(el.date)}
                onClick={() => {
                  const newDate = new Date(
                    dateToInput(date).slice(0, 5) + el.date + "-01"
                  );
                  setDate(newDate);
                }}
              >
                {el.name}
              </S.DateMonthButton>
            ))}
          </S.DateButtonTag>
        </S.DateButtonBox>
      </S.DateButtonContainer>
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "90rem",
            marginTop: "2.5rem",
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "1.2rem",
          }}
        >
          <S.MoveButton
            onClick={() => {
              window.location.href =
                "https://readingcenter.purpleacademy.co.kr/" +
                router.query.branch +
                "/report";
            }}
            style={{ marginRight: "0.62rem", width: "5.75rem", padding: "0" }}
          >
            <svg
              width="12"
              height="11"
              viewBox="0 0 12 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "0.62rem" }}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.00893 0H0V1.92156H2.00893V0ZM12 0H3.13393V1.92156H12V0ZM2.00893 4.55172H0V6.44828H2.00893V4.55172ZM12 4.55172H3.13393V6.44828H12V4.55172ZM2.00893 9.07844H0V11H2.00893V9.07844ZM12 9.07844H3.13393V11H12V9.07844Z"
                fill="#333333"
              />
            </svg>

            {"목록"}
          </S.MoveButton>
          <ReactToPrint
            trigger={() => (
              <button
                style={{
                  backgroundColor: "#FFF",
                  border: "1px solid #C8C8C8",
                  borderRadius: "0.25rem",
                  color: "#333",
                  width: "6rem",
                  height: "2.6875rem",
                  cursor: "pointer",
                  fontFamily: "Spoqa Han Sans Neo",
                  fontSize: "1rem",
                  fontStyle: "normal",
                  fontWeight: 500,
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <svg
                  width="14"
                  height="13"
                  viewBox="0 0 14 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: "0.62rem" }}
                >
                  <path
                    d="M11 0.5V3.15625H3V0.5H11ZM11.1875 6.3125C11.3125 6.4375 11.4688 6.5 11.6562 6.5C11.8438 6.5 12 6.4375 12.125 6.3125C12.2708 6.1875 12.3438 6.03125 12.3438 5.84375C12.3438 5.65625 12.2708 5.5 12.125 5.375C12 5.22917 11.8438 5.15625 11.6562 5.15625C11.4688 5.15625 11.3125 5.22917 11.1875 5.375C11.0625 5.5 11 5.65625 11 5.84375C11 6.03125 11.0625 6.1875 11.1875 6.3125ZM9.65625 11.1562V7.84375H4.34375V11.1562H9.65625ZM11.6562 3.84375C12.1979 3.84375 12.6667 4.04167 13.0625 4.4375C13.4583 4.83333 13.6562 5.30208 13.6562 5.84375V9.84375H11V12.5H3V9.84375H0.34375V5.84375C0.34375 5.30208 0.541667 4.83333 0.9375 4.4375C1.33333 4.04167 1.80208 3.84375 2.34375 3.84375H11.6562Z"
                    fill="#333333"
                  />
                </svg>

                {"인쇄"}
              </button>
            )}
            content={() => printRef.current}
          ></ReactToPrint>
          <S.MoveButton
            onClick={() => {
              window.location.href =
                "https://readingcenter.purpleacademy.co.kr/" +
                router.query.branch +
                "/report/" +
                router.query.id;
            }}
            style={{ marginLeft: "0.62rem" }}
          >
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "0.62rem" }}
            >
              <path
                d="M5.80382 4.28426C5.54104 4.28426 5.32801 4.50139 5.32801 4.76924C5.32801 5.03708 5.54104 5.25421 5.80382 5.25421H10.196C10.4588 5.25421 10.6718 5.03708 10.6718 4.76924C10.6718 4.50139 10.4588 4.28426 10.196 4.28426H5.80382Z"
                fill="white"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.3999 14.0957V3.27701C2.3999 2.75263 2.60427 2.24972 2.96808 1.87892C3.33187 1.50812 3.8253 1.2998 4.33977 1.2998H12.6849C12.9276 1.2998 13.1602 1.39809 13.3318 1.57287C13.5034 1.74778 13.5999 1.98513 13.5999 2.23245V15.6998H3.9748C3.49616 15.6998 3.08624 15.532 2.8002 15.2154C2.52008 14.9054 2.3999 14.4994 2.3999 14.0957ZM3.64099 2.56477C3.82632 2.37587 4.07768 2.26975 4.33977 2.26975H12.6483V10.2532H3.97376C3.74916 10.2532 3.53993 10.2901 3.35154 10.362V3.27701C3.35154 3.00987 3.45566 2.75366 3.64099 2.56477ZM3.97376 14.7299H12.6483V13.4615H3.97376C3.72037 13.4615 3.58024 13.5444 3.50026 13.6329C3.41436 13.728 3.35154 13.8816 3.35154 14.0957C3.35154 14.3097 3.41436 14.4633 3.50026 14.5584C3.58024 14.6469 3.72037 14.7299 3.97376 14.7299ZM3.97376 12.4915H12.6483V11.2231H3.97376C3.72037 11.2231 3.58024 11.306 3.50026 11.3946C3.41436 11.4896 3.35154 11.6433 3.35154 11.8573C3.35154 12.0713 3.41436 12.225 3.50026 12.3201C3.58024 12.4086 3.72037 12.4915 3.97376 12.4915Z"
                fill="#333333"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M4.33977 2.26975C4.07768 2.26975 3.82632 2.37587 3.64099 2.56477C3.45566 2.75366 3.35154 3.00987 3.35154 3.27701V10.362C3.53993 10.2901 3.74916 10.2532 3.97376 10.2532H12.6483V2.26975H4.33977ZM5.80382 4.28426C5.54104 4.28426 5.32801 4.50139 5.32801 4.76924C5.32801 5.03708 5.54104 5.25421 5.80382 5.25421H10.196C10.4588 5.25421 10.6718 5.03708 10.6718 4.76924C10.6718 4.50139 10.4588 4.28426 10.196 4.28426H5.80382Z"
                fill="#333333"
              />
            </svg>

            {"리딩 이력"}
          </S.MoveButton>
        </div>
        <S.ReportWrapper ref={printRef}>
          <S.UserInfoTitle>
            {userData?.userDetails?.profile.korName + "님의 학습 리포트"}
          </S.UserInfoTitle>
          <S.UserInfoWrapper>
            <S.UserInfoTag1>이름</S.UserInfoTag1>
            <S.UserInfoTag2>
              {userData?.userDetails?.profile.korName}
            </S.UserInfoTag2>
            <S.UserInfoTag1>원번</S.UserInfoTag1>
            <S.UserInfoTag2>
              {userData?.userDetails?.profile.origin}
            </S.UserInfoTag2>
            <S.UserInfoTag1>최근 학습일</S.UserInfoTag1>
            <S.UserInfoTag2>
              {summaryData?.getSummaryReport?.recentStudyDate.replaceAll(
                "-",
                ". "
              )}
            </S.UserInfoTag2>
            <S.UserInfoTag1>기준일</S.UserInfoTag1>
            <S.UserInfoTag2>
              {date.getFullYear() + "년 " + (1 + date.getMonth()) + "월"}
            </S.UserInfoTag2>
          </S.UserInfoWrapper>
          <S.ReportInfoContainer>
            <S.ReportInfoBox>
              <S.ChartTitle>누적 합습량</S.ChartTitle>
              <S.ReportInfoTag>
                <S.ReportInfoTagLeft>누적 권 수</S.ReportInfoTagLeft>
                <S.ReportInfoTagRight>
                  {summaryData?.getSummaryReport?.totalBc
                    ? addComma(summaryData?.getSummaryReport?.totalBc)
                    : ""}
                  <S.ReportSmallUnit>권</S.ReportSmallUnit>
                </S.ReportInfoTagRight>
              </S.ReportInfoTag>
              <S.ReportInfoTag>
                <S.ReportInfoTagLeft>누적 WC</S.ReportInfoTagLeft>
                <S.ReportInfoTagRight>
                  {" "}
                  {summaryData?.getSummaryReport?.totalWc
                    ? addComma(summaryData?.getSummaryReport?.totalWc)
                    : ""}
                </S.ReportInfoTagRight>
              </S.ReportInfoTag>
              <S.ReportInfoTag>
                <S.ReportInfoTagLeft>누적 평균 정답률</S.ReportInfoTagLeft>
                <S.ReportInfoTagRight>
                  {summaryData?.getSummaryReport?.totalCorrect
                    ? summaryData?.getSummaryReport?.totalCorrect
                    : ""}
                  <S.ReportSmallUnit>%</S.ReportSmallUnit>
                </S.ReportInfoTagRight>
              </S.ReportInfoTag>
              <S.ReportInfoTag>
                <S.ReportInfoTagLeft>누적 학습일</S.ReportInfoTagLeft>
                <S.ReportInfoTagRight>
                  {summaryData?.getSummaryReport?.totalStudyDays
                    ? summaryData?.getSummaryReport?.totalStudyDays
                    : ""}
                  <S.ReportSmallUnit>일</S.ReportSmallUnit>
                </S.ReportInfoTagRight>
              </S.ReportInfoTag>
            </S.ReportInfoBox>
            <S.ReportInfoBox>
              <S.ChartTitle>읽은 권 수</S.ChartTitle>
              {widows ? (
                <BarChart
                  width={300}
                  height={250}
                  data={latestData}
                  onMouseEnter={() => {
                    setIsBooks(true);
                  }}
                  onMouseLeave={() => {
                    setIsBooks(false);
                  }}
                >
                  <XAxis
                    dataKey="name"
                    label={{
                      position: "insideBottom",
                      offset: 0,
                    }}
                    tickLine={false}
                  />
                  <Bar dataKey="books" barSize={70} fill="#862991">
                    {latestData?.map((el, index) => {
                      return (
                        <Cell key={`cell-${index}`} fill={el.color}></Cell>
                      );
                    })}{" "}
                  </Bar>
                </BarChart>
              ) : (
                <></>
              )}
            </S.ReportInfoBox>
            <S.ReportInfoBox>
              {" "}
              <S.ChartTitle>월별 WC</S.ChartTitle>
              {widows ? (
                <BarChart
                  width={250}
                  height={250}
                  data={latestData}
                  onMouseEnter={() => {
                    setIsWc(true);
                  }}
                  onMouseLeave={() => {
                    setIsWc(false);
                  }}
                >
                  {/* <CartesianGrid stroke="#f5f5f5" /> */}
                  <XAxis
                    dataKey="name"
                    label={{
                      position: "insideBottom",
                      offset: 0,
                    }}
                    tickLine={false}
                  />
                  <Bar dataKey="wc" barSize={70} fill="#2F86A6">
                    {latestData?.map((el, index) => {
                      return (
                        <Cell key={`cell-${index}`} fill={el.color}></Cell>
                      );
                    })}{" "}
                  </Bar>
                </BarChart>
              ) : (
                <></>
              )}
            </S.ReportInfoBox>
            <S.ReportInfoBox>
              <S.ChartTitle>학습일</S.ChartTitle>
              {widows ? (
                <BarChart
                  width={300}
                  height={250}
                  data={latestData}
                  onMouseEnter={() => {
                    setIsDays(true);
                  }}
                  onMouseLeave={() => {
                    setIsDays(false);
                  }}
                >
                  {/* <CartesianGrid stroke="#f5f5f5" /> */}
                  <XAxis
                    dataKey="name"
                    label={{
                      position: "insideBottom",
                      offset: 0,
                    }}
                    tickLine={false}
                  />
                  <Bar dataKey="days" barSize={70} fill="#2F86A6">
                    {latestData?.map((el, index) => {
                      return (
                        <Cell key={`cell-${index}`} fill={el.color}></Cell>
                      );
                    })}{" "}
                  </Bar>
                </BarChart>
              ) : (
                <></>
              )}
            </S.ReportInfoBox>
          </S.ReportInfoContainer>
          <S.ReportInfoContainer>
            <S.ReportInfoBox>
              <S.ChartTitle>SR</S.ChartTitle>
              {widows ? (
                <BarChart
                  width={300}
                  height={250}
                  data={latestData}
                  onMouseEnter={() => {
                    setIsDays(true);
                  }}
                  onMouseLeave={() => {
                    setIsDays(false);
                  }}
                >
                  {/* <CartesianGrid stroke="#f5f5f5" /> */}
                  <XAxis
                    dataKey="name"
                    label={{
                      position: "insideBottom",
                      offset: 0,
                    }}
                    tickLine={false}
                  />
                  <Bar dataKey="sr" barSize={70} fill="#2F86A6">
                    {latestData?.map((el, index) => {
                      return (
                        <Cell key={`cell-${index}`} fill={el.color}></Cell>
                      );
                    })}
                  </Bar>
                </BarChart>
              ) : (
                <></>
              )}
            </S.ReportInfoBox>
            <S.ReportInfoBox>
              <S.ChartTitle>AR</S.ChartTitle>
              {widows ? (
                <BarChart
                  width={300}
                  height={250}
                  data={latestData}
                  onMouseEnter={() => {
                    setIsAr(true);
                  }}
                  onMouseLeave={() => {
                    setIsAr(false);
                  }}
                >
                  <XAxis
                    dataKey="name"
                    label={{
                      position: "insideBottom",
                      offset: 0,
                    }}
                    tickLine={false}
                  />
                  <Bar dataKey="ar" barSize={70} fill="#CC1071">
                    {latestData?.map((el, index) => {
                      return (
                        <Cell key={`cell-${index}`} fill={el.color}></Cell>
                      );
                    })}{" "}
                  </Bar>
                </BarChart>
              ) : (
                <></>
              )}
            </S.ReportInfoBox>
            <S.ReportInfoBox>
              <S.ChartTitle>WC/권</S.ChartTitle>
              {widows ? (
                <BarChart
                  width={300}
                  height={250}
                  data={latestData}
                  onMouseEnter={() => {
                    setIsCorrect(true);
                  }}
                  onMouseLeave={() => {
                    setIsCorrect(false);
                  }}
                >
                  <XAxis
                    dataKey="name"
                    label={{
                      position: "insideBottom",
                      offset: 0,
                    }}
                    tickLine={false}
                  />
                  <Bar dataKey="wcPerBook" barSize={70} fill="#2F86A6">
                    {latestData?.map((el, index) => {
                      return (
                        <Cell key={`cell-${index}`} fill={el.color}></Cell>
                      );
                    })}{" "}
                  </Bar>
                </BarChart>
              ) : (
                <></>
              )}
            </S.ReportInfoBox>
            <S.ReportInfoBox>
              <S.ChartTitle>정답률</S.ChartTitle>
              {widows ? (
                <BarChart
                  width={300}
                  height={250}
                  data={latestData}
                  onMouseEnter={() => {
                    setIsCorrect(true);
                  }}
                  onMouseLeave={() => {
                    setIsCorrect(false);
                  }}
                >
                  <XAxis
                    dataKey="name"
                    label={{
                      position: "insideBottom",
                      offset: 0,
                    }}
                    tickLine={false}
                  />
                  <Bar dataKey="averageCorrects" barSize={70} fill="#2F86A6">
                    {latestData?.map((el, index) => {
                      return (
                        <Cell key={`cell-${index}`} fill={el.color}></Cell>
                      );
                    })}{" "}
                  </Bar>
                </BarChart>
              ) : (
                <></>
              )}
            </S.ReportInfoBox>
          </S.ReportInfoContainer>
          <S.ReportInfoContainer>
            <S.ReportInfoDoubleBox style={{ alignItems: "flex-end" }}>
              <S.ReportSubTitle>월별 독서량</S.ReportSubTitle>

              <ResponsiveContainer width={"87%"} height={300}>
                <ComposedChart width={100} height={300} data={halfYearData}>
                  {/* <XAxis
                    dataKey="name"
                    label={{
                      position: "insideBottom",
                      offset: 0,
                    }}
                    tickLine={false}
                  /> */}
                  <CartesianGrid stroke="#dedede" />
                  <YAxis
                    dataKey={"wc"}
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "wc",
                      position: "insideBottom",
                      offset: 10,
                    }}
                    domain={[0, maxWC]}
                    hide
                  />
                  <YAxis
                    dataKey={"books"}
                    yAxisId="left"
                    orientation="left"
                    label={{
                      value: "권 수",
                      position: "insideBottom",
                      offset: 10,
                    }}
                    domain={[0, maxBooks]}
                    hide
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={<CustomTooltip1 />}
                  />
                  <Legend
                    align="right"
                    verticalAlign="top"
                    payload={[
                      { value: "WC", type: "line", color: "#FC480D" },
                      { value: "권 수", type: "rect", color: "#64C7FD" },
                    ]}
                    wrapperStyle={{ fontSize: "1.25rem", fontWeight: 500 }}
                  />
                  <Bar
                    dataKey={"books"}
                    barSize={50}
                    fill="#64C7FD"
                    yAxisId={"left"}
                  />
                  <Line
                    dataKey={"wc"}
                    yAxisId={"right"}
                    strokeWidth={3}
                    stroke="#FC480D"
                  ></Line>
                </ComposedChart>
              </ResponsiveContainer>

              <table>
                <thead>
                  <tr>
                    <th width="50rem"></th>
                    {halfYearData?.map((el) => {
                      return <th style={{ width: "5rem" }}>{el?.name}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>WC</td>
                    {halfYearData?.map((el) => {
                      return <td>{addComma(el?.wc)}</td>;
                    })}
                  </tr>
                  <tr>
                    <td>권 수</td>
                    {halfYearData?.map((el) => {
                      return <td>{el?.books ? el?.books + "권" : ""}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </S.ReportInfoDoubleBox>
            <S.ReportInfoDoubleBox style={{ alignItems: "flex-end" }}>
              <S.ReportSubTitle>월별 지수변화</S.ReportSubTitle>

              <ResponsiveContainer width={"87%"} height={300}>
                <ComposedChart data={halfYearData}>
                  {/* <XAxis
                    dataKey="name"
                    label={{
                      position: "insideBottom",
                      offset: 0,
                    }}
                    tickLine={false}
                  /> */}
                  <CartesianGrid stroke="#dedede" />
                  <YAxis
                    dataKey={"WCPerBooks"}
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "WCPerBooks",
                      position: "insideBottom",
                      offset: 10,
                    }}
                    domain={[0, maxWCPerBooks]}
                    hide
                  />
                  <YAxis
                    dataKey={"correct"}
                    yAxisId="correct"
                    orientation="null"
                    label={{
                      value: "correct",
                      position: "insideBottom",
                      offset: 10,
                    }}
                    domain={[0, maxCorrects]}
                    hide
                  />
                  <YAxis
                    dataKey={"ar"}
                    yAxisId="left"
                    label={{
                      value: "ar",
                      position: "insideBottom",
                      offset: 10,
                    }}
                    domain={[0, maxAR]}
                    hide
                  />
                  <Tooltip content={<CustomTooltip2 />} />
                  <Legend
                    align="right"
                    verticalAlign="top"
                    margin={{ top: 0, right: 0, left: 0, bottom: 50 }}
                    payload={[
                      {
                        value: "AR",
                        type: "line",
                        color: "#578537",
                      },
                      { value: "WC/권", type: "line", color: "#FE7445" },
                      { value: "정답률", type: "rect", color: "#8FC5FB " },
                    ]}
                    wrapperStyle={{ fontSize: "1.25rem", fontWeight: 500 }}
                  />
                  <Bar
                    dataKey={"correct"}
                    barSize={50}
                    fill="#8FC5FB"
                    yAxisId={"correct"}
                    name="correct"
                  />
                  <Line
                    dataKey={"WCPerBooks"}
                    yAxisId={"right"}
                    name="WCPerBooks"
                    strokeWidth={3}
                    stroke="#FE7445"
                  ></Line>
                  <Line
                    dataKey={"ar"}
                    yAxisId={"left"}
                    stroke="#578537"
                    name="ar"
                    strokeWidth={3}
                  ></Line>
                </ComposedChart>
              </ResponsiveContainer>

              <table>
                <thead>
                  <tr>
                    <th width="60rem"></th>
                    {halfYearData?.map((el) => {
                      return <th>{el?.name}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>AR</td>
                    {halfYearData?.map((el) => {
                      return <td>{el?.ar}</td>;
                    })}
                  </tr>
                  <tr>
                    <td>WC/권</td>
                    {halfYearData?.map((el) => {
                      return (
                        <td style={{ width: "5rem" }}>
                          {addComma(el?.WCPerBooks)}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td>정답률</td>
                    {halfYearData?.map((el) => {
                      return <td>{el?.correct ? el?.correct + "%" : ""}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </S.ReportInfoDoubleBox>
          </S.ReportInfoContainer>
          <S.ReportInfoContainer>
            <S.ReportInfoDoubleBox style={{ alignItems: "flex-end" }}>
              <S.ReportSubTitle>월별 리딩지수</S.ReportSubTitle>
              <ResponsiveContainer width={"87%"} height={300}>
                <ComposedChart data={halfYearData}>
                  {/* <XAxis
                    dataKey="name"
                    label={{
                      position: "insideBottom",
                      offset: 0,
                    }}
                    tickLine={false}
                  /> */}
                  <CartesianGrid stroke="#dedede" />
                  <YAxis
                    dataKey={"sr"}
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "sr",
                      position: "insideBottom",
                      offset: 10,
                    }}
                    domain={[0, 4]}
                    hide
                  />
                  <YAxis
                    dataKey={"correct"}
                    yAxisId="correct"
                    orientation="null"
                    label={{
                      value: "correct",
                      position: "insideBottom",
                      offset: 10,
                    }}
                    domain={[0, maxCorrects]}
                    hide
                  />
                  <YAxis
                    dataKey={"ar"}
                    yAxisId="left"
                    label={{
                      value: "ar",
                      position: "insideBottom",
                      offset: 10,
                    }}
                    domain={[0, maxAR]}
                    hide
                  />
                  <Tooltip content={<CustomTooltip3 />} />
                  <Legend
                    align="right"
                    verticalAlign="top"
                    margin={{ top: 0, right: 0, left: 0, bottom: 50 }}
                    payload={[
                      {
                        value: "AR",
                        type: "line",
                        color: "#578537",
                      },
                      { value: "SR", type: "line", color: "#293391" },
                    ]}
                    wrapperStyle={{ fontSize: "1.25rem", fontWeight: 500 }}
                  />
                  <Line
                    dataKey={"sr"}
                    yAxisId={"right"}
                    name="sr"
                    strokeWidth={3}
                    stroke="#293391"
                  ></Line>
                  <Line
                    dataKey={"ar"}
                    yAxisId={"left"}
                    stroke="#578537"
                    name="ar"
                    strokeWidth={3}
                  ></Line>
                  <Bar dataKey={"blank"} barSize={50} yAxisId={"left"} />
                </ComposedChart>
              </ResponsiveContainer>
              <table>
                <thead>
                  <tr>
                    <th width="60rem"></th>
                    {halfYearData?.map((el) => {
                      return <th>{el?.name}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>AR</td>
                    {halfYearData?.map((el) => {
                      return <td>{el?.ar}</td>;
                    })}
                  </tr>
                  <tr>
                    <td>SR</td>
                    {halfYearData?.map((el) => {
                      return <td style={{ width: "5rem" }}>{el?.sr}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </S.ReportInfoDoubleBox>
            <S.ReportInfoDoubleBox>
              <S.ChartTitle>담당 선생님 종합의견</S.ChartTitle>
              <S.ReportTextArea
                value={opinion}
                onChange={(e) => {
                  setOpinion(e.target.value);
                  setHasUnsavedChanges(true);
                }}
              ></S.ReportTextArea>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                  marginRight: "4.5rem",
                  marginTop: "1.25rem",
                }}
              >
                <S.ReportPrintNot onClick={onClickCreateOpinion}>
                  <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: "0.62rem" }}
                  >
                    <path
                      d="M8 4.5V1.84375H1.34375V4.5H8ZM4.59375 10.5625C4.98958 10.9583 5.45833 11.1562 6 11.1562C6.54167 11.1562 7.01042 10.9583 7.40625 10.5625C7.80208 10.1667 8 9.69792 8 9.15625C8 8.61458 7.80208 8.14583 7.40625 7.75C7.01042 7.35417 6.54167 7.15625 6 7.15625C5.45833 7.15625 4.98958 7.35417 4.59375 7.75C4.19792 8.14583 4 8.61458 4 9.15625C4 9.69792 4.19792 10.1667 4.59375 10.5625ZM9.34375 0.5L12 3.15625V11.1562C12 11.5104 11.8646 11.8229 11.5938 12.0938C11.3229 12.3646 11.0104 12.5 10.6562 12.5H1.34375C0.96875 12.5 0.645833 12.375 0.375 12.125C0.125 11.8542 0 11.5312 0 11.1562V1.84375C0 1.46875 0.125 1.15625 0.375 0.90625C0.645833 0.635417 0.96875 0.5 1.34375 0.5H9.34375Z"
                      fill="white"
                    />
                  </svg>

                  {"저장"}
                </S.ReportPrintNot>
              </div>
            </S.ReportInfoDoubleBox>
          </S.ReportInfoContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "2.5rem",
            }}
          >
            <svg
              width="251"
              height="32"
              viewBox="0 0 251 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="logo_horizental 2" clip-path="url(#clip0_752_1669)">
                <path
                  id="Vector"
                  d="M1 31V1H250V31H1Z"
                  stroke="#791285"
                  stroke-width="2"
                />
                <path
                  id="Vector_2"
                  d="M12.346 8.94007C13.1187 8.94007 13.8407 9.01607 14.512 9.16807C15.1833 9.3074 15.766 9.54807 16.26 9.89007C16.754 10.2321 17.1403 10.6881 17.419 11.2581C17.7103 11.8154 17.856 12.5121 17.856 13.3481C17.856 14.1461 17.7103 14.8428 17.419 15.4381C17.1403 16.0208 16.754 16.5021 16.26 16.8821C15.7787 17.2621 15.2087 17.5471 14.55 17.7371C13.8913 17.9144 13.182 18.0031 12.422 18.0031H10.541V23.0001H7.729V8.94007H12.346ZM12.232 15.7801C14.1447 15.7801 15.101 14.9694 15.101 13.3481C15.101 12.5248 14.8477 11.9548 14.341 11.6381C13.847 11.3214 13.1123 11.1631 12.137 11.1631H10.541V15.7801H12.232ZM25.7979 23.2661C24.9492 23.2661 24.1829 23.1458 23.4989 22.9051C22.8275 22.6518 22.2512 22.2591 21.7699 21.7271C21.3012 21.1951 20.9402 20.5111 20.6869 19.6751C20.4462 18.8391 20.3259 17.8384 20.3259 16.6731V8.94007H23.1379V16.9201C23.1379 17.6548 23.1949 18.2754 23.3089 18.7821C23.4355 19.2761 23.6129 19.6751 23.8409 19.9791C24.0689 20.2831 24.3475 20.5048 24.6769 20.6441C25.0062 20.7708 25.3799 20.8341 25.7979 20.8341C26.2159 20.8341 26.5895 20.7708 26.9189 20.6441C27.2609 20.5048 27.5522 20.2831 27.7929 19.9791C28.0335 19.6751 28.2172 19.2761 28.3439 18.7821C28.4705 18.2754 28.5339 17.6548 28.5339 16.9201V8.94007H31.2319V16.6731C31.2319 17.8384 31.1115 18.8391 30.8709 19.6751C30.6302 20.5111 30.2755 21.1951 29.8069 21.7271C29.3382 22.2591 28.7682 22.6518 28.0969 22.9051C27.4255 23.1458 26.6592 23.2661 25.7979 23.2661ZM39.3837 17.6801H37.4267V23.0001H34.6147V8.94007H39.5167C40.2641 8.94007 40.9544 9.00974 41.5877 9.14907C42.2337 9.2884 42.7911 9.52274 43.2597 9.85207C43.7411 10.1814 44.1147 10.6184 44.3807 11.1631C44.6594 11.7078 44.7987 12.3854 44.7987 13.1961C44.7987 14.2728 44.5517 15.1404 44.0577 15.7991C43.5764 16.4451 42.9304 16.9264 42.1197 17.2431L45.4067 23.0001H42.2717L39.3837 17.6801ZM39.2507 15.4571C40.1627 15.4571 40.8531 15.2734 41.3217 14.9061C41.8031 14.5261 42.0437 13.9561 42.0437 13.1961C42.0437 12.4361 41.8031 11.9104 41.3217 11.6191C40.8531 11.3151 40.1627 11.1631 39.2507 11.1631H37.4267V15.4571H39.2507ZM52.1829 8.94007C52.9556 8.94007 53.6776 9.01607 54.3489 9.16807C55.0202 9.3074 55.6029 9.54807 56.0969 9.89007C56.5909 10.2321 56.9772 10.6881 57.2559 11.2581C57.5472 11.8154 57.6929 12.5121 57.6929 13.3481C57.6929 14.1461 57.5472 14.8428 57.2559 15.4381C56.9772 16.0208 56.5909 16.5021 56.0969 16.8821C55.6156 17.2621 55.0456 17.5471 54.3869 17.7371C53.7282 17.9144 53.0189 18.0031 52.2589 18.0031H50.3779V23.0001H47.5659V8.94007H52.1829ZM52.0689 15.7801C53.9816 15.7801 54.9379 14.9694 54.9379 13.3481C54.9379 12.5248 54.6846 11.9548 54.1779 11.6381C53.6839 11.3214 52.9492 11.1631 51.9739 11.1631H50.3779V15.7801H52.0689ZM63.0508 8.94007V20.6441H68.7508V23.0001H60.2388V8.94007H63.0508ZM79.8306 8.94007V11.2771H74.0166V14.5261H78.9566V16.8821H74.0166V20.6441H80.0396V23.0001H71.2046V8.94007H79.8306ZM91.9677 17.6801H90.0107V23.0001H87.1987V8.94007H92.1007C92.8481 8.94007 93.5384 9.00974 94.1717 9.14907C94.8177 9.2884 95.3751 9.52274 95.8437 9.85207C96.3251 10.1814 96.6987 10.6184 96.9647 11.1631C97.2434 11.7078 97.3827 12.3854 97.3827 13.1961C97.3827 14.2728 97.1357 15.1404 96.6417 15.7991C96.1604 16.4451 95.5144 16.9264 94.7037 17.2431L97.9907 23.0001H94.8557L91.9677 17.6801ZM91.8347 15.4571C92.7467 15.4571 93.4371 15.2734 93.9057 14.9061C94.3871 14.5261 94.6277 13.9561 94.6277 13.1961C94.6277 12.4361 94.3871 11.9104 93.9057 11.6191C93.4371 11.3151 92.7467 11.1631 91.8347 11.1631H90.0107V15.4571H91.8347ZM108.776 8.94007V11.2771H102.962V14.5261H107.902V16.8821H102.962V20.6441H108.985V23.0001H100.15V8.94007H108.776ZM113.872 19.3901L112.884 23.0001H110.034L114.537 8.94007H117.843L122.365 23.0001H119.42L118.432 19.3901H113.872ZM117.406 15.6661C117.191 14.9314 116.982 14.1714 116.779 13.3861C116.589 12.6008 116.387 11.8281 116.171 11.0681H116.095C115.918 11.8408 115.728 12.6198 115.525 13.4051C115.323 14.1778 115.114 14.9314 114.898 15.6661L114.48 17.2051H117.824L117.406 15.6661ZM127.868 8.94007C128.945 8.94007 129.908 9.0794 130.756 9.35807C131.618 9.63674 132.346 10.0674 132.941 10.6501C133.549 11.2201 134.012 11.9421 134.328 12.8161C134.658 13.6901 134.822 14.7224 134.822 15.9131C134.822 17.0911 134.658 18.1234 134.328 19.0101C134.012 19.8968 133.556 20.6378 132.96 21.2331C132.378 21.8158 131.668 22.2591 130.832 22.5631C129.996 22.8544 129.059 23.0001 128.02 23.0001H124.011V8.94007H127.868ZM127.697 20.7391C128.356 20.7391 128.945 20.6504 129.464 20.4731C129.996 20.2831 130.446 19.9981 130.813 19.6181C131.181 19.2254 131.459 18.7251 131.649 18.1171C131.852 17.4964 131.953 16.7618 131.953 15.9131C131.953 15.0518 131.852 14.3234 131.649 13.7281C131.459 13.1201 131.181 12.6324 130.813 12.2651C130.446 11.8851 129.996 11.6128 129.464 11.4481C128.945 11.2708 128.356 11.1821 127.697 11.1821H126.823V20.7391H127.697ZM140.387 8.94007V23.0001H137.575V8.94007H140.387ZM146.715 8.94007L150.8 16.4261L152.206 19.4661H152.301C152.225 18.7314 152.143 17.9271 152.054 17.0531C151.978 16.1791 151.94 15.3431 151.94 14.5451V8.94007H154.6V23.0001H151.75L147.684 15.4761L146.259 12.4551H146.164C146.228 13.2151 146.297 14.0194 146.373 14.8681C146.462 15.7168 146.506 16.5464 146.506 17.3571V23.0001H143.846V8.94007H146.715ZM164.12 23.2661C163.157 23.2661 162.264 23.1078 161.441 22.7911C160.617 22.4744 159.902 22.0121 159.294 21.4041C158.698 20.7961 158.23 20.0424 157.888 19.1431C157.546 18.2438 157.375 17.2051 157.375 16.0271C157.375 14.8618 157.552 13.8294 157.907 12.9301C158.261 12.0181 158.743 11.2454 159.351 10.6121C159.959 9.97874 160.674 9.4974 161.498 9.16807C162.321 8.83874 163.195 8.67407 164.12 8.67407C165.133 8.67407 165.994 8.85774 166.704 9.22507C167.426 9.5924 168.015 10.0104 168.471 10.4791L166.97 12.2651C166.628 11.9358 166.241 11.6571 165.811 11.4291C165.393 11.2011 164.861 11.0871 164.215 11.0871C163.632 11.0871 163.094 11.2011 162.6 11.4291C162.118 11.6444 161.7 11.9611 161.346 12.3791C161.004 12.7971 160.731 13.3038 160.529 13.8991C160.339 14.4944 160.244 15.1721 160.244 15.9321C160.244 17.4648 160.592 18.6681 161.289 19.5421C161.985 20.4034 163.024 20.8341 164.405 20.8341C164.747 20.8341 165.076 20.7898 165.393 20.7011C165.709 20.6124 165.969 20.4794 166.172 20.3021V17.5281H163.683V15.2291H168.68V21.5751C168.198 22.0438 167.565 22.4428 166.78 22.7721C165.994 23.1014 165.108 23.2661 164.12 23.2661ZM177.435 23.2661C176.548 23.2661 175.712 23.1078 174.927 22.7911C174.141 22.4744 173.457 22.0121 172.875 21.4041C172.292 20.7961 171.83 20.0424 171.488 19.1431C171.158 18.2438 170.994 17.2051 170.994 16.0271C170.994 14.8618 171.165 13.8294 171.507 12.9301C171.861 12.0181 172.336 11.2454 172.932 10.6121C173.527 9.97874 174.217 9.4974 175.003 9.16807C175.801 8.83874 176.643 8.67407 177.53 8.67407C178.442 8.67407 179.24 8.85774 179.924 9.22507C180.62 9.57974 181.197 9.99774 181.653 10.4791L180.171 12.2651C179.816 11.9231 179.43 11.6444 179.012 11.4291C178.594 11.2011 178.119 11.0871 177.587 11.0871C177.055 11.0871 176.561 11.2011 176.105 11.4291C175.649 11.6444 175.256 11.9611 174.927 12.3791C174.597 12.7971 174.338 13.3038 174.148 13.8991C173.958 14.4944 173.863 15.1721 173.863 15.9321C173.863 16.6921 173.945 17.3761 174.11 17.9841C174.287 18.5921 174.534 19.1114 174.851 19.5421C175.18 19.9601 175.566 20.2831 176.01 20.5111C176.466 20.7264 176.972 20.8341 177.53 20.8341C178.138 20.8341 178.676 20.7074 179.145 20.4541C179.626 20.1881 180.057 19.8524 180.437 19.4471L181.919 21.1951C180.766 22.5758 179.271 23.2661 177.435 23.2661ZM192.81 8.94007V11.2771H186.996V14.5261H191.936V16.8821H186.996V20.6441H193.019V23.0001H184.184V8.94007H192.81ZM198.743 8.94007L202.828 16.4261L204.234 19.4661H204.329C204.253 18.7314 204.17 17.9271 204.082 17.0531C204.006 16.1791 203.968 15.3431 203.968 14.5451V8.94007H206.628V23.0001H203.778L199.712 15.4761L198.287 12.4551H198.192C198.255 13.2151 198.325 14.0194 198.401 14.8681C198.489 15.7168 198.534 16.5464 198.534 17.3571V23.0001H195.874V8.94007H198.743ZM208.946 11.2771V8.94007H219.7V11.2771H215.71V23.0001H212.898V11.2771H208.946ZM230.606 8.94007V11.2771H224.792V14.5261H229.732V16.8821H224.792V20.6441H230.815V23.0001H221.98V8.94007H230.606ZM238.438 17.6801H236.481V23.0001H233.669V8.94007H238.571C239.319 8.94007 240.009 9.00974 240.642 9.14907C241.288 9.2884 241.846 9.52274 242.314 9.85207C242.796 10.1814 243.169 10.6184 243.435 11.1631C243.714 11.7078 243.853 12.3854 243.853 13.1961C243.853 14.2728 243.606 15.1404 243.112 15.7991C242.631 16.4451 241.985 16.9264 241.174 17.2431L244.461 23.0001H241.326L238.438 17.6801ZM238.305 15.4571C239.217 15.4571 239.908 15.2734 240.376 14.9061C240.858 14.5261 241.098 13.9561 241.098 13.1961C241.098 12.4361 240.858 11.9104 240.376 11.6191C239.908 11.3151 239.217 11.1631 238.305 11.1631H236.481V15.4571H238.305Z"
                  fill="#791285"
                />
              </g>
              <defs>
                <clipPath id="clip0_752_1669">
                  <rect width="251" height="32" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </S.ReportWrapper>
      </div>
      {undefined ? (
        <>
          <div style={{ width: "99rem" }}>
            <div
              style={{
                display: "flex",
                marginTop: "2rem",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <div style={{ borderRadius: "5px", border: "1px solid #42444E" }}>
                <S.ReportSubContainerTitle
                  style={{
                    marginLeft: "1rem",
                    marginTop: "1rem",
                    fontWeight: 500,
                  }}
                >
                  평균 리딩 지수
                </S.ReportSubContainerTitle>
                {widows ? (
                  <BarChart
                    width={300}
                    height={250}
                    data={latestData}
                    onMouseEnter={() => {
                      setIsAr(true);
                    }}
                    onMouseLeave={() => {
                      setIsAr(false);
                    }}
                  >
                    <XAxis
                      dataKey="name"
                      label={{
                        position: "insideBottom",
                        offset: 0,
                      }}
                      tickLine={false}
                    />
                    <Bar dataKey="ar" barSize={50} fill="#CC1071" zIndex={0}>
                      {latestData?.map((el, index) => {
                        return (
                          <Cell key={`cell-${index}`} fill={el.color}></Cell>
                        );
                      })}{" "}
                    </Bar>
                  </BarChart>
                ) : (
                  <></>
                )}
                {isAr && (
                  <div
                    style={{
                      position: "absolute",
                      left: "15rem",
                      top: "25rem",
                      backgroundColor: "#ffffff",
                      padding: "1rem",
                      border: "1px solid #dfdfdf",
                      borderRadius: 5,
                    }}
                    onMouseEnter={() => {
                      setIsAr(true);
                    }}
                    onMouseLeave={() => {
                      setIsAr(false);
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        marginBottom: "1rem",
                        fontWeight: 500,
                      }}
                    >
                      리딩지수
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        color: latestData[0].color,
                        marginBottom: "0.5rem",
                      }}
                    >
                      지난 달 : {latestData[0].ar}
                    </div>
                    <div
                      style={{ fontSize: "1rem", color: latestData[1].color }}
                    >
                      이번 달 : {latestData[1].ar}
                    </div>
                  </div>
                )}
                <S.ReportSubContainer style={{ backgroundColor: "#dddddd" }}>
                  <div style={{ marginLeft: "0.8rem", marginTop: "0.8rem" }}>
                    리딩 지수 상승폭
                  </div>
                  <S.ReportSubContainerGage>
                    {latestData?.[1]?.ar === 0
                      ? ""
                      : (latestData?.[1]?.ar - latestData?.[0]?.ar > 0
                          ? "+"
                          : "") +
                        Math.round(
                          (latestData?.[1]?.ar - latestData?.[0]?.ar) * 100
                        ) /
                          100}
                  </S.ReportSubContainerGage>
                </S.ReportSubContainer>
              </div>
              <div style={{ borderRadius: "5px", border: "1px solid #42444E" }}>
                <S.ReportSubContainerTitle
                  style={{
                    marginLeft: "1rem",
                    marginTop: "1rem",
                    fontWeight: 500,
                  }}
                >
                  월별 WC
                </S.ReportSubContainerTitle>
                {widows ? (
                  <BarChart
                    width={300}
                    height={250}
                    data={latestData}
                    onMouseEnter={() => {
                      setIsWc(true);
                    }}
                    onMouseLeave={() => {
                      setIsWc(false);
                    }}
                  >
                    {/* <CartesianGrid stroke="#f5f5f5" /> */}
                    <XAxis
                      dataKey="name"
                      label={{
                        position: "insideBottom",
                        offset: 0,
                      }}
                      tickLine={false}
                    />
                    <Bar dataKey="wc" barSize={50} fill="#2F86A6">
                      {latestData?.map((el, index) => {
                        return (
                          <Cell key={`cell-${index}`} fill={el.color}></Cell>
                        );
                      })}{" "}
                    </Bar>
                  </BarChart>
                ) : (
                  <></>
                )}
                {isWc && (
                  <div
                    style={{
                      position: "absolute",
                      left: "35rem",
                      top: "25rem",
                      backgroundColor: "#ffffff",
                      padding: "1rem",
                      border: "1px solid #dfdfdf",
                      borderRadius: 5,
                    }}
                    onMouseEnter={() => {
                      setIsWc(true);
                    }}
                    onMouseLeave={() => {
                      setIsWc(false);
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        marginBottom: "1rem",
                        fontWeight: 500,
                      }}
                    >
                      WC
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        color: latestData[0].color,
                        marginBottom: "0.5rem",
                      }}
                    >
                      지난 달 : {addComma(latestData[0].wc)}
                    </div>
                    <div
                      style={{ fontSize: "1rem", color: latestData[1].color }}
                    >
                      이번 달 : {addComma(latestData[1].wc)}
                    </div>
                  </div>
                )}
                <S.ReportSubContainer style={{ backgroundColor: "#dddddd" }}>
                  <div style={{ marginLeft: "0.8rem", marginTop: "0.8rem" }}>
                    누적 Word Count
                  </div>
                  <S.ReportSubContainerGage>
                    {summaryData?.getSummaryReport?.totalWc
                      ? addComma(summaryData?.getSummaryReport?.totalWc)
                      : ""}
                  </S.ReportSubContainerGage>
                </S.ReportSubContainer>
              </div>
              <div style={{ borderRadius: "5px", border: "1px solid #42444E" }}>
                <S.ReportSubContainerTitle
                  style={{
                    marginLeft: "1rem",
                    marginTop: "1rem",
                    fontWeight: 500,
                  }}
                >
                  평균 정답률
                </S.ReportSubContainerTitle>
                {widows ? (
                  <BarChart
                    width={300}
                    height={250}
                    data={latestData}
                    onMouseEnter={() => {
                      setIsCorrect(true);
                    }}
                    onMouseLeave={() => {
                      setIsCorrect(false);
                    }}
                  >
                    <XAxis
                      dataKey="name"
                      label={{
                        position: "insideBottom",
                        offset: 0,
                      }}
                      tickLine={false}
                    />
                    <Bar dataKey="averageCorrects" barSize={50} fill="#2F86A6">
                      {latestData?.map((el, index) => {
                        return (
                          <Cell key={`cell-${index}`} fill={el.color}></Cell>
                        );
                      })}{" "}
                    </Bar>
                  </BarChart>
                ) : (
                  <></>
                )}
                {isCorrect && (
                  <div
                    style={{
                      position: "absolute",
                      left: "55rem",
                      top: "25rem",
                      backgroundColor: "#ffffff",
                      padding: "1rem",
                      border: "1px solid #dfdfdf",
                      borderRadius: 5,
                    }}
                    onMouseEnter={() => {
                      setIsCorrect(true);
                    }}
                    onMouseLeave={() => {
                      setIsCorrect(false);
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        marginBottom: "1rem",
                        fontWeight: 500,
                      }}
                    >
                      평균 정답률
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        color: latestData[0].color,
                        marginBottom: "0.5rem",
                      }}
                    >
                      지난 달 : {latestData[0].averageCorrects + "%"}
                    </div>
                    <div
                      style={{ fontSize: "1rem", color: latestData[1].color }}
                    >
                      이번 달 : {latestData[1].averageCorrects + "%"}
                    </div>
                  </div>
                )}
                <S.ReportSubContainer style={{ backgroundColor: "#dddddd" }}>
                  <div style={{ marginLeft: "0.8rem", marginTop: "0.8rem" }}>
                    누적 평균 정답률
                  </div>
                  <S.ReportSubContainerGage>
                    {summaryData?.getSummaryReport?.totalCorrect
                      ? summaryData?.getSummaryReport?.totalCorrect + "%"
                      : ""}
                  </S.ReportSubContainerGage>
                </S.ReportSubContainer>
              </div>

              <div style={{ borderRadius: "5px", border: "1px solid #42444E" }}>
                <S.ReportSubContainerTitle
                  style={{
                    marginLeft: "1rem",
                    marginTop: "1rem",
                    fontWeight: 500,
                  }}
                >
                  읽은 권 수
                </S.ReportSubContainerTitle>
                {widows ? (
                  <BarChart
                    width={300}
                    height={250}
                    data={latestData}
                    onMouseEnter={() => {
                      setIsBooks(true);
                    }}
                    onMouseLeave={() => {
                      setIsBooks(false);
                    }}
                  >
                    <XAxis
                      dataKey="name"
                      label={{
                        position: "insideBottom",
                        offset: 0,
                      }}
                      tickLine={false}
                    />
                    <Bar dataKey="books" barSize={50} fill="#2F86A6">
                      {latestData?.map((el, index) => {
                        return (
                          <Cell key={`cell-${index}`} fill={el.color}></Cell>
                        );
                      })}{" "}
                    </Bar>
                  </BarChart>
                ) : (
                  <></>
                )}
                {isBooks && (
                  <div
                    style={{
                      position: "absolute",
                      left: "75rem",
                      top: "25rem",
                      backgroundColor: "#ffffff",
                      padding: "1rem",
                      border: "1px solid #dfdfdf",
                      borderRadius: 5,
                    }}
                    onMouseEnter={() => {
                      setIsBooks(true);
                    }}
                    onMouseLeave={() => {
                      setIsBooks(false);
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        marginBottom: "1rem",
                        fontWeight: 500,
                      }}
                    >
                      읽은 도서
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        color: latestData[0].color,
                        marginBottom: "0.5rem",
                      }}
                    >
                      지난 달 : {latestData[0].books + "권"}
                    </div>
                    <div
                      style={{ fontSize: "1rem", color: latestData[1].color }}
                    >
                      이번 달 : {latestData[1].books + "권"}
                    </div>
                  </div>
                )}
                <S.ReportSubContainer style={{ backgroundColor: "#dddddd" }}>
                  <div style={{ marginLeft: "0.8rem", marginTop: "0.8rem" }}>
                    누적 권 수
                  </div>
                  <S.ReportSubContainerGage>
                    {summaryData?.getSummaryReport?.totalBc
                      ? addComma(summaryData?.getSummaryReport?.totalBc) + "권"
                      : ""}
                  </S.ReportSubContainerGage>
                </S.ReportSubContainer>
              </div>
              <div style={{ borderRadius: "5px", border: "1px solid #42444E" }}>
                <S.ReportSubContainerTitle
                  style={{
                    marginLeft: "1rem",
                    marginTop: "1rem",
                    fontWeight: 500,
                  }}
                >
                  학습일
                </S.ReportSubContainerTitle>
                {widows ? (
                  <BarChart
                    width={300}
                    height={250}
                    data={latestData}
                    onMouseEnter={() => {
                      setIsDays(true);
                    }}
                    onMouseLeave={() => {
                      setIsDays(false);
                    }}
                  >
                    {/* <CartesianGrid stroke="#f5f5f5" /> */}
                    <XAxis
                      dataKey="name"
                      label={{
                        position: "insideBottom",
                        offset: 0,
                      }}
                      tickLine={false}
                    />
                    <Bar dataKey="days" barSize={50} fill="#2F86A6">
                      {latestData?.map((el, index) => {
                        return (
                          <Cell key={`cell-${index}`} fill={el.color}></Cell>
                        );
                      })}{" "}
                    </Bar>
                  </BarChart>
                ) : (
                  <></>
                )}
                {isDays && (
                  <div
                    style={{
                      position: "absolute",
                      left: "95rem",
                      top: "25rem",
                      backgroundColor: "#ffffff",
                      padding: "1rem",
                      border: "1px solid #dfdfdf",
                      borderRadius: 5,
                    }}
                    onMouseEnter={() => {
                      setIsDays(true);
                    }}
                    onMouseLeave={() => {
                      setIsDays(false);
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        marginBottom: "1rem",
                        fontWeight: 500,
                      }}
                    >
                      수업일
                    </div>
                    <div
                      style={{
                        fontSize: "1rem",
                        color: latestData[0].color,
                        marginBottom: "0.5rem",
                      }}
                    >
                      지난 달 : {latestData[0].days + "일"}
                    </div>
                    <div
                      style={{ fontSize: "1rem", color: latestData[1].color }}
                    >
                      이번 달 : {latestData[1].days + "일"}
                    </div>
                  </div>
                )}
                <S.ReportSubContainer style={{ backgroundColor: "#dddddd" }}>
                  <div style={{ marginLeft: "0.8rem", marginTop: "0.8rem" }}>
                    누적 학습일
                  </div>
                  <S.ReportSubContainerGage>
                    {summaryData?.getSummaryReport?.totalStudyDays
                      ? summaryData?.getSummaryReport?.totalStudyDays + "일"
                      : ""}
                  </S.ReportSubContainerGage>
                </S.ReportSubContainer>
              </div>
            </div>
          </div>
          <S.ReportChartContainer
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <div
              style={{
                width: "45%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "1rem",
                margin: "0.7rem",
              }}
            >
              <S.ReportSubTitle>월별 독서량</S.ReportSubTitle>

              <ResponsiveContainer width={"100%"} height={300}>
                <ComposedChart width={100} height={300} data={halfYearData}>
                  <XAxis
                    dataKey="name"
                    label={{
                      position: "insideBottom",
                      offset: 0,
                    }}
                    tickLine={false}
                  />
                  <CartesianGrid stroke="#dedede" />
                  <YAxis
                    dataKey={"wc"}
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "wc",
                      position: "insideBottom",
                      offset: 10,
                    }}
                    domain={[0, maxWC]}
                    hide
                  />
                  <YAxis
                    dataKey={"books"}
                    yAxisId="left"
                    orientation="left"
                    label={{
                      value: "권 수",
                      position: "insideBottom",
                      offset: 10,
                    }}
                    domain={[0, maxBooks]}
                    hide
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={<CustomTooltip1 />}
                  />
                  <Legend
                    align="right"
                    verticalAlign="top"
                    payload={[
                      { value: "WC", type: "line", color: "#FC480D" },
                      { value: "권 수", type: "rect", color: "#64C7FD" },
                    ]}
                    wrapperStyle={{ fontSize: "1.25rem", fontWeight: 500 }}
                  />
                  <Bar
                    dataKey={"books"}
                    barSize={50}
                    fill="#64C7FD"
                    yAxisId={"left"}
                  />
                  <Line
                    dataKey={"wc"}
                    yAxisId={"right"}
                    strokeWidth={3}
                    stroke="#FC480D"
                  ></Line>
                </ComposedChart>
              </ResponsiveContainer>

              <table>
                <thead>
                  <tr>
                    <th width="50rem"></th>
                    {halfYearData?.map((el) => {
                      return <th style={{ width: "5rem" }}>{el?.name}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>WC</td>
                    {halfYearData?.map((el) => {
                      return <td>{addComma(el?.wc)}</td>;
                    })}
                  </tr>
                  <tr>
                    <td>권 수</td>
                    {halfYearData?.map((el) => {
                      return <td>{el?.books ? el?.books + "권" : ""}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              style={{
                width: "45%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "1rem",
                margin: "0.7rem",
              }}
            >
              <S.ReportSubTitle>월별 지수변화</S.ReportSubTitle>

              <ResponsiveContainer width={"100%"} height={300}>
                <ComposedChart data={halfYearData}>
                  <XAxis
                    dataKey="name"
                    label={{
                      position: "insideBottom",
                      offset: 0,
                    }}
                    tickLine={false}
                  />
                  <CartesianGrid stroke="#dedede" />
                  <YAxis
                    dataKey={"WCPerBooks"}
                    yAxisId="right"
                    orientation="right"
                    label={{
                      value: "WCPerBooks",
                      position: "insideBottom",
                      offset: 10,
                    }}
                    domain={[0, maxWCPerBooks]}
                    hide
                  />
                  <YAxis
                    dataKey={"correct"}
                    yAxisId="correct"
                    orientation="null"
                    label={{
                      value: "correct",
                      position: "insideBottom",
                      offset: 10,
                    }}
                    domain={[0, maxCorrects]}
                    hide
                  />
                  <YAxis
                    dataKey={"ar"}
                    yAxisId="left"
                    label={{
                      value: "ar",
                      position: "insideBottom",
                      offset: 10,
                    }}
                    domain={[0, maxAR]}
                    hide
                  />
                  <Tooltip content={<CustomTooltip2 />} />
                  <Legend
                    align="right"
                    verticalAlign="top"
                    margin={{ top: 0, right: 0, left: 0, bottom: 50 }}
                    payload={[
                      {
                        value: "AR",
                        type: "line",
                        color: "#578537",
                      },
                      { value: "WC/권", type: "line", color: "#FE7445" },
                      { value: "정답률", type: "rect", color: "#8FC5FB " },
                    ]}
                    wrapperStyle={{ fontSize: "1.25rem", fontWeight: 500 }}
                  />
                  <Bar
                    dataKey={"correct"}
                    barSize={50}
                    fill="#8FC5FB"
                    yAxisId={"correct"}
                    name="correct"
                  />
                  <Line
                    dataKey={"WCPerBooks"}
                    yAxisId={"right"}
                    name="WCPerBooks"
                    strokeWidth={3}
                    stroke="#FE7445"
                  ></Line>
                  <Line
                    dataKey={"ar"}
                    yAxisId={"left"}
                    stroke="#578537"
                    name="ar"
                    strokeWidth={3}
                  ></Line>
                </ComposedChart>
              </ResponsiveContainer>

              <table>
                <thead>
                  <tr>
                    <th width="60rem"></th>
                    {halfYearData?.map((el) => {
                      return <th>{el?.name}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>AR</td>
                    {halfYearData?.map((el) => {
                      return <td>{el?.ar}</td>;
                    })}
                  </tr>
                  <tr>
                    <td>WC/권</td>
                    {halfYearData?.map((el) => {
                      return (
                        <td style={{ width: "5rem" }}>
                          {addComma(el?.WCPerBooks)}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td>정답률</td>
                    {halfYearData?.map((el) => {
                      return <td>{el?.correct ? el?.correct + "%" : ""}</td>;
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </S.ReportChartContainer>

          <S.ReportChartContainer>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <PlusOutlined
                style={{ margin: 30, fontSize: "1.7rem" }}
                onClick={() => {
                  setMoreView(true);
                }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <S.ReportSubTitle>원생 메모</S.ReportSubTitle>
            </div>
            <S.ReportMemoContainer>
              {memoData?.map((el, index) => {
                return (
                  <S.ReportMemoBox>
                    <div>{el.date}</div>
                    <div>{el.memo}</div>
                  </S.ReportMemoBox>
                );
              })}
            </S.ReportMemoContainer>
            <S.ReportInputBox>
              <div>담당 선생님 종합의견</div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  width: "100%",
                }}
              ></div>
            </S.ReportInputBox>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <S.ReportSaveButton onClick={onClickCreateOpinion}>
                {opinionData?.getOpinion === undefined ? "저장" : "수정"}
              </S.ReportSaveButton>
            </div>
          </S.ReportChartContainer>
        </>
      ) : (
        <></>
      )}

      {moreView ? (
        <Modal
          closable={false}
          footer={null}
          open={moreView}
          onCancel={() => {
            setMoreView(false);
          }}
        >
          {memosData?.getLectureMemoByStudent?.map((el) => {
            if (el.memo !== null) {
              return (
                <S.ReportModalMemo>
                  <div>{"날짜 : " + el.lecture.date}</div>
                  <div>{"메모 내용 : " + el.memo}</div>
                </S.ReportModalMemo>
              );
            } else {
              return (
                <S.ReportModalMemo>
                  <div>{"날짜 : " + el.lecture.date}</div>
                  <div>{"메모 내용 : 없음"}</div>
                </S.ReportModalMemo>
              );
            }
          })}
          {/* </div> */}
        </Modal>
      ) : (
        <></>
      )}
    </S.PageWrapper>
  );
}
