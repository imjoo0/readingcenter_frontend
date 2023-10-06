import { useQuery } from "@apollo/client";
import * as S from "./studentReport.style";
import {
  GET_MEMO,
  GET_MONTH_REPORT,
  GET_STUDENT,
  GET_SUMMARY_REPORT,
} from "./studentReport.query";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
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
import { Modal } from "antd";
import { addComma } from "@/src/commons/library/library";

export default function StudentReportPage() {
  const router = useRouter();
  const [maxAR, setMaxAr] = useState(0);
  const [maxBooks, setMaxBooks] = useState(0);
  const [maxWC, setMaxWC] = useState(0);
  const [maxWCPerBooks, setMaxWCPerBooks] = useState(0);
  const [maxCorrects, setMaxCorrects] = useState(0);
  const [window, setWindow] = useState(false);
  const [moreView, setMoreView] = useState(false);
  const [isAr, setIsAr] = useState(false);
  const [isWc, setIsWc] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isBooks, setIsBooks] = useState(false);
  const [isDays, setIsDays] = useState(false);
  const [latestData, setLatestData] = useState([
    {
      name: "지난 달",
      ar: 1.5,
      wc: 1400,
      averageCorrects: 87,
      books: 22,
      days: 15,
      color: "gray",
    },
    {
      name: "이번 달",
      ar: 1.7,
      wc: 1500,
      averageCorrects: 99,
      books: 24,
      days: 17,
      color: "#CC1071",
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

  const { data: userData } = useQuery(GET_STUDENT, {
    variables: {
      userId: Number(router.query.id),
      academyId: Number(router.query.branch),
    },
  });

  const { data: summaryData } = useQuery(GET_SUMMARY_REPORT, {
    variables: { studentId: Number(router.query.id) },
  });
  const { data: monthData } = useQuery(GET_MONTH_REPORT, {
    variables: { studentId: Number(router.query.id) },
  });

  const { data: userMemoData } = useQuery(GET_MEMO, {
    variables: {
      academyId: Number(router.query.branch),
      studentId: Number(router.query.id),
    },
  });

  const memoData = [
    { date: "2023-07-21", memo: "메모1" },
    { date: "2023-07-24", memo: "메모2" },
    { date: "2023-07-25", memo: "7월 25일 특이사항(예시)" },
    { date: "2023-08-03", memo: "8월 3일 특이사항(예시)" },
    { date: "2023-08-05", memo: "8월 5일 특이사항(예시)" },
  ];

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
                color: "#F75353",
                fontFamily: "Spoqa Han Sans Neo",
              }}
              className="data"
            >{`WC : ${addComma(wc)}`}</p>
            <p
              style={{
                fontSize: "1rem",
                color: "#8BB2FF",
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
                color: "#3B3BFF",
                fontFamily: "Spoqa Han Sans Neo",
              }}
              className="data"
            >{`AR : ${ar}`}</p>
            <p
              style={{
                fontSize: "1rem",
                color: "#F75353",
                fontFamily: "Spoqa Han Sans Neo",
              }}
              className="data"
            >{`WC/권 : ${addComma(wcPerBook)}`}</p>
            <p
              style={{
                fontSize: "1rem",
                color: "#8AEE96",
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

  // 최근 반년 정보 데이터 추출
  useEffect(() => {
    if (Array.isArray(monthData?.getMonthReports)) {
      const newHalfYearData = [];
      const sortArray = monthData?.getMonthReports.sort((a, b) => {
        return b.month - a.month;
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
          color: "gray",
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
          color: "#CC1071",
        },
      ];
      setLatestData(newLatestData);
      setWindow(true);
    }
  }, [monthData, summaryData]);

  useEffect(() => {
    let ar = 0;
    let wc = 0;
    let wcPerBooks = 0;
    let corrects = 0;
    let books = 0;
    halfYearData.forEach((el) => {
      if (ar < el.ar) {
        ar = el.ar;
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
    setMaxBooks(Math.ceil(books * 1.1));
    setMaxWC(Math.ceil(wc * 1.1));
    setMaxWCPerBooks(Math.ceil(wcPerBooks * 1.1));
    setMaxCorrects(Math.ceil(corrects * 1.1));
  }, [halfYearData]);

  console.log(userMemoData);

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
    padding: 6px 15px;
  }
  th {
    background: #42444e;
    color: #fff;
    text-align: center;
  }
  tr:first-child th:first-child {
    border-top-left-radius: 6px;
  }
  tr:first-child th:last-child {
    border-top-right-radius: 6px;
  }
  td {
    border-right: 1px solid #c6c9cc;
    border-bottom: 1px solid #c6c9cc;
    text-align: center;
  }
  td:first-child {
    border-left: 1px solid #c6c9cc;
  }
  tr:nth-child(even) td {
    background: #eaeaed;
  }
  tr:last-child td:first-child {
    border-bottom-left-radius: 6px;
  }
  tr:last-child td:last-child {
    border-bottom-right-radius: 6px;
  }
`}</style>
      <table style={{ width: "99rem" }}>
        <thead>
          <tr>
            <th>이름</th>
            <th>원번</th>
            <th>최근 학습일</th>
            <th>등록일</th>
            <th>생일</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{userData?.userDetails?.profile?.korName}</td>
            <td>{userData?.userDetails?.profile?.origin}</td>
            <td>{summaryData?.getSummaryReport?.recentStudyDate}</td>
            <td>{userData?.userDetails?.profile?.registerDate.slice(0, 10)}</td>
            <td>{userData?.userDetails?.profile?.birthDate.slice(0, 10)}</td>
          </tr>
        </tbody>
      </table>
      {window ? (
        <>
          <S.ReportTitle>이달의 독서 개요</S.ReportTitle>
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
                {window ? (
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
                {window ? (
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
                {window ? (
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
                    {summaryData?.getSummaryReport?.totalCorrect + "%"}
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
                {window ? (
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
                {window ? (
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
                    {summaryData?.getSummaryReport?.totalStudyDays + "일"}
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
                      { value: "WC", type: "line", color: "#F75353" },
                      { value: "권 수", type: "rect", color: "#8BB2FF" },
                    ]}
                    wrapperStyle={{ fontSize: "1.25rem", fontWeight: 500 }}
                  />
                  <Bar
                    dataKey={"books"}
                    barSize={50}
                    fill="#8BB2FF"
                    yAxisId={"left"}
                  />
                  <Line
                    dataKey={"wc"}
                    yAxisId={"right"}
                    strokeWidth={3}
                    stroke="#F75353"
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
                        color: "#3B3BFF",
                      },
                      { value: "WC/권", type: "line", color: "#F75353" },
                      { value: "정답률", type: "rect", color: "#8AEE96 " },
                    ]}
                    wrapperStyle={{ fontSize: "1.25rem", fontWeight: 500 }}
                  />
                  <Bar
                    dataKey={"correct"}
                    barSize={50}
                    fill="#8AEE96"
                    yAxisId={"correct"}
                    name="correct"
                  />
                  <Line
                    dataKey={"WCPerBooks"}
                    yAxisId={"right"}
                    name="WCPerBooks"
                    strokeWidth={3}
                    stroke="#F75353"
                  ></Line>
                  <Line
                    dataKey={"ar"}
                    yAxisId={"left"}
                    stroke="#3B3BFF"
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
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <S.ReportSubTitle>리딩 기록</S.ReportSubTitle>
              <PlusOutlined
                style={{ margin: 30, fontSize: "1.7rem" }}
                onClick={() => {
                  setMoreView(true);
                }}
              />
            </div>
            <S.ReportMemoContainer>
              {memoData?.map((el, index) => {
                if (index > memoData?.length - 4) {
                  return (
                    <S.ReportMemoBox>
                      <div>{el.date}</div>
                      <div>{el.memo}</div>
                    </S.ReportMemoBox>
                  );
                } else {
                  return <></>;
                }
              })}
            </S.ReportMemoContainer>
            <S.ReportInputBox>
              <S.ReportSubTitle>원장선생님 종합의견</S.ReportSubTitle>
              <S.ReportTextArea></S.ReportTextArea>
            </S.ReportInputBox>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <S.ReportSaveButton>저장</S.ReportSaveButton>
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
          {/* <div style={{ overflow: "scroll" }}> */}
          {memoData?.map((el) => {
            return (
              <S.ReportModalMemo>
                <div>{el.date}</div>
                <div>{el.memo}</div>
              </S.ReportModalMemo>
            );
          })}
          {/* </div> */}
        </Modal>
      ) : (
        <></>
      )}
    </S.PageWrapper>
  );
}
