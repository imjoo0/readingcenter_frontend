import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import {
  GET_ALL_STUDENTS,
  GET_ME,
  GET_STUDENTS_REPORT_LIST,
} from "./report.query";
import { useEffect, useState } from "react";
import * as S from "./report.style";
import { dateInputToDay, dateInputToDot } from "@/src/commons/library/library";
import CheckToolTip from "@/src/commons/library/tooltipcheck";
import CheckToolTipClass from "@/src/commons/library/tooltipcheckClass";

export default function ReportPage() {
  const router = useRouter();
  const { data } = useQuery(GET_ALL_STUDENTS, {
    variables: { academyId: Number(router.query.branch) },
  });

  const { data: listData } = useQuery(GET_STUDENTS_REPORT_LIST, {
    variables: { academyId: Number(router.query.branch) },
  });

  const { data: myData } = useQuery(GET_ME); //수정 필수
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
  const [searchWord, setSearchWord] = useState("");
  const [studentArray, setStudentArray] = useState([]);

  const onChangeAcademy = (e) => {
    router.push("/" + e.target.value + "/report");
  };

  useEffect(() => {
    setStudentArray(
      listData?.studentsInAcademyWithConsulting
        ?.filter((el) => {
          return el?.student?.user?.isActive;
        })
        ?.filter((el) => {
          return (
            el.student.origin.includes(searchWord) ||
            el.student.korName.includes(searchWord)
          );
        })
    );
  }, [searchWord, data]);

  return (
    <div
      style={{
        marginTop: "10rem",
        padding: "0 8.4% 0 8.4%",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {myData?.me?.profile?.academies?.length > 0 ? (
          <select
            onChange={onChangeAcademy}
            style={{
              width: "200px",
              height: "30px",
              fontSize: "14px",
              border: "1px solid #DBDDE1",
              borderRadius: "8px",
              fontFamily: "Spoqa Han Sans Neo",
              paddingLeft: "10px",
            }}
          >
            {myData?.me?.profile?.academies?.map((el) => {
              return (
                <option
                  value={Number(el.id)}
                  selected={Number(router.query.branch) === Number(el.id)}
                >
                  {el.location}
                </option>
              );
            })}
          </select>
        ) : (
          <></>
        )}
      </div>
      <S.ReportTitle>학습 리포트</S.ReportTitle>
      <S.ReportSearchBox>
        <S.ReportInput
          onChange={(e) => {
            setSearchWord(e.target.value);
          }}
          placeholder="      원번 혹은 이름을 입력하세요."
        ></S.ReportInput>
      </S.ReportSearchBox>
      {/* <style>{`
              table {
              border-spacing: 0;
              border-radius: 0.125rem;
              border: 1px solid #dfe1e5;
              width: 90rem;
              margin-bottom:2.5rem;
            }
            thead{
              border-radius: 0.25rem 0.25rem 0rem 0rem;
              background: #F7F8FA;
            }
            th,
            td {
              border: 1px solid #dfe1e5;
              font-size: 0.875rem;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
            }
            td {
              color: #333;
            }
            `}</style> */}
      <table style={{ borderCollapse: "collapse", width: "90rem" }}>
        <thead>
          <tr>
            <S.ReportTh
              style={{
                width: "3.125rem",
                height: "2rem",
                backgroundColor: "#791285",
              }}
            ></S.ReportTh>
            <S.ReportTh
              style={{
                width: "15.25rem",
                textAlign: "center",
                backgroundColor: "#791285",
                color: "#fff",
              }}
            >
              원생 번호
            </S.ReportTh>
            <S.ReportTh
              style={{
                width: "15.9375rem",
                textAlign: "center",
                backgroundColor: "#791285",
                color: "#fff",
              }}
              colSpan={2}
            >
              원생 이름
            </S.ReportTh>
            <S.ReportTh
              style={{
                width: "16.94rem",
                backgroundColor: "#791285",
                color: "#fff",
              }}
            >
              등록일
            </S.ReportTh>
            <S.ReportTh
              style={{
                width: "15.56rem",
                backgroundColor: "#791285",
                color: "#fff",
              }}
            >
              생년월일
            </S.ReportTh>
            <S.ReportTh
              style={{
                width: "11.375rem",
                backgroundColor: "#791285",
                color: "#fff",
              }}
            >
              학습 리포트
            </S.ReportTh>
            <S.ReportTh
              style={{
                width: "11.4375rem",
                backgroundColor: "#791285",
                color: "#fff",
              }}
            >
              리딩이력
            </S.ReportTh>
            {/* <th>상담 횟수</th>
            <th>최근 상담 날짜</th> */}
          </tr>
        </thead>
        <tbody>
          {studentArray?.map((el, index) => {
            return (
              <tr>
                <S.ReportTd style={{ textAlign: "center", height: "2rem" }}>
                  {index + 1}
                </S.ReportTd>
                <S.ReportTd style={{ textAlign: "center" }}>
                  {el?.student?.origin}
                </S.ReportTd>
                <S.ReportTd
                  style={{
                    borderRight: "none",
                    textAlign: "end",
                    padding: 0,
                    width: "7.91rem",
                    maxWidth: "7.91rem",
                  }}
                >
                  {el?.student?.korName}
                  {/* 테스트트트 */}
                </S.ReportTd>
                <S.ReportTd
                  style={{
                    borderLeft: "none",
                    textAlign: "start",
                    // maxWidth: "9.5375rem",
                    width: "8.06rem",
                    maxWidth: "8.06rem",
                    overflow: "visible",
                  }}
                >
                  <CheckToolTipClass
                    text={"(" + el?.student?.engName + ")"}
                    number={80}
                    korName={el?.student?.korName}
                  ></CheckToolTipClass>
                </S.ReportTd>
                <S.ReportTd style={{ textAlign: "center" }}>
                  {"20" +
                    dateInputToDot(
                      el?.student?.registerDate.slice(0, 10) +
                        " (" +
                        dateInputToDay(el?.student?.registerDate.slice(0, 10)) +
                        ")"
                    )}
                </S.ReportTd>
                <S.ReportTd style={{ textAlign: "center" }}>
                  {"20" +
                    dateInputToDot(
                      el?.student?.birthDate.slice(0, 10)
                      //  +
                      //   " (" +
                      //   dateInputToDay(el?.student?.birthDate.slice(0, 10)) +
                      //   ")"
                    )}
                </S.ReportTd>
                <S.ReportTd style={{ textAlign: "center" }}>
                  <svg
                    width="16"
                    height="18"
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      // window.open(
                      //   "/" +
                      //     router.query.branch +
                      //     "/report/reportDetail/" +
                      //     el?.student?.id
                      // );
                      router.push(
                        "/" +
                          router.query.branch +
                          "/report/reportDetail/" +
                          el?.student?.id
                      );
                    }}
                  >
                    <g clip-path="url(#clip0_1381_4405)">
                      <path
                        d="M2.375 12.4972C2.40815 12.4972 2.43995 12.484 2.46339 12.4605C2.48683 12.4371 2.5 12.4053 2.5 12.3722V9.75C2.5 9.61739 2.44732 9.49021 2.35355 9.39645C2.25979 9.30268 2.13261 9.25 2 9.25H1C0.867392 9.25 0.740215 9.30268 0.646447 9.39645C0.552678 9.49021 0.5 9.61739 0.5 9.75V12.3722C0.5 12.4053 0.51317 12.4371 0.536612 12.4605C0.560054 12.484 0.591848 12.4972 0.625 12.4972H2.375Z"
                        fill="#333333"
                      />
                      <path
                        d="M5.375 12.5052C5.40815 12.5052 5.43995 12.492 5.46339 12.4686C5.48683 12.4451 5.5 12.4133 5.5 12.3802V7.25C5.5 7.11739 5.44732 6.99021 5.35355 6.89645C5.25979 6.80268 5.13261 6.75 5 6.75H4C3.86739 6.75 3.74021 6.80268 3.64645 6.89645C3.55268 6.99021 3.5 7.11739 3.5 7.25V12.3802C3.5 12.4133 3.51317 12.4451 3.53661 12.4686C3.56005 12.492 3.59185 12.5052 3.625 12.5052H5.375Z"
                        fill="#333333"
                      />
                      <path
                        d="M8.375 12.4954C8.40815 12.4954 8.43995 12.4822 8.46339 12.4587C8.48683 12.4353 8.5 12.4035 8.5 12.3704V8.25C8.5 8.11739 8.44732 7.99021 8.35355 7.89645C8.25979 7.80268 8.13261 7.75 8 7.75H7C6.86739 7.75 6.74021 7.80268 6.64645 7.89645C6.55268 7.99021 6.5 8.11739 6.5 8.25V12.3704C6.5 12.4035 6.51317 12.4353 6.53661 12.4587C6.56005 12.4822 6.59185 12.4954 6.625 12.4954H8.375Z"
                        fill="#333333"
                      />
                      <path
                        d="M11.375 12.5052C11.4082 12.5052 11.4399 12.492 11.4634 12.4686C11.4868 12.4451 11.5 12.4133 11.5 12.3802V4.75C11.5 4.61739 11.4473 4.49021 11.3536 4.39645C11.2598 4.30268 11.1326 4.25 11 4.25H10C9.86739 4.25 9.74021 4.30268 9.64645 4.39645C9.55268 4.49021 9.5 4.61739 9.5 4.75V12.3802C9.5 12.4133 9.51317 12.4451 9.53661 12.4686C9.56005 12.492 9.59185 12.5052 9.625 12.5052H11.375Z"
                        fill="#333333"
                      />
                      <path
                        d="M1.75 7.2503C2.01522 7.2503 2.26957 7.14495 2.45711 6.95741C2.64464 6.76987 2.75 6.51552 2.75 6.2503C2.74888 6.14833 2.73201 6.04713 2.7 5.9503L4.2835 4.6303C4.48223 4.73973 4.71284 4.77662 4.93579 4.73466C5.15874 4.69269 5.36015 4.57449 5.5055 4.4003L6.7555 4.8173C6.78077 5.06981 6.90109 5.30328 7.09209 5.47037C7.28309 5.63746 7.53047 5.72569 7.7841 5.71717C8.03773 5.70865 8.27864 5.60402 8.45799 5.42448C8.63735 5.24495 8.74173 5.00394 8.75 4.7503C8.74901 4.59119 8.70937 4.4347 8.6345 4.2943L10.278 2.3768C10.4705 2.47943 10.6914 2.51608 10.9068 2.48112C11.1221 2.44616 11.32 2.34153 11.4702 2.18326C11.6204 2.025 11.7145 1.82185 11.7381 1.60496C11.7618 1.38808 11.7136 1.16943 11.601 0.982544C11.4884 0.795662 11.3177 0.650866 11.1149 0.57036C10.9121 0.489854 10.6885 0.478084 10.4784 0.536855C10.2683 0.595625 10.0833 0.721691 9.95171 0.89572C9.82014 1.06975 9.74928 1.28213 9.75 1.5003C9.75131 1.59724 9.76698 1.69346 9.7965 1.7858L8.065 3.8063C7.87774 3.73957 7.67445 3.73223 7.48287 3.7853C7.29129 3.83836 7.12074 3.94924 6.9945 4.1028L5.7445 3.6863C5.73663 3.54464 5.69864 3.40629 5.63305 3.28048C5.56746 3.15468 5.47579 3.04431 5.36415 2.95675C5.25252 2.86919 5.12349 2.80645 4.98568 2.77272C4.84787 2.73898 4.70445 2.73504 4.565 2.76115C4.42554 2.78725 4.29326 2.84281 4.17698 2.9241C4.0607 3.00539 3.9631 3.11056 3.8907 3.23257C3.8183 3.35458 3.77276 3.49064 3.75711 3.63165C3.74147 3.77266 3.75609 3.91539 3.8 4.0503L2.218 5.3723C2.07452 5.29347 1.9137 5.25155 1.75 5.2503C1.48478 5.2503 1.23043 5.35566 1.04289 5.5432C0.855357 5.73073 0.75 5.98509 0.75 6.2503C0.75 6.51552 0.855357 6.76987 1.04289 6.95741C1.23043 7.14495 1.48478 7.2503 1.75 7.2503Z"
                        fill="#333333"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1381_4405">
                        <rect
                          width="12"
                          height="12"
                          fill="white"
                          transform="translate(0 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  {/* <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      // window.open(
                      //   "/" +
                      //     router.query.branch +
                      //     "/report/reportDetail/" +
                      //     el?.student?.id
                      // );
                      router.push(
                        "/" +
                          router.query.branch +
                          "/report/reportDetail/" +
                          el?.student?.id
                      );
                    }}
                  >
                    <path
                      d="M5 19.5V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H18.4C18.5591 3 18.7117 3.06321 18.8243 3.17574C18.9368 3.28826 19 3.44087 19 3.6V21H6.5M9 7H15M6.5 15H19M6.5 18H19"
                      stroke="#81858C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M6.5 15C5.5 15 5 15.672 5 16.5C5 17.328 5.5 18 6.5 18C5.5 18 5 18.672 5 19.5C5 20.328 5.5 21 6.5 21"
                      stroke="#81858C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg> */}
                </S.ReportTd>
                <S.ReportTd style={{ textAlign: "center" }}>
                  <svg
                    width="14"
                    height="18"
                    viewBox="0 0 14 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      // window.open(
                      //   "/" + router.query.branch + "/report/" + el.id
                      // );
                      router.push(
                        "/" + router.query.branch + "/report/" + el?.student.id
                      );
                    }}
                  >
                    <path
                      d="M2 2.32031V9L4.07031 7.75L6.17969 9V2.32031H2ZM12 0.679688C12.4427 0.679688 12.8333 0.848958 13.1719 1.1875C13.5104 1.5 13.6797 1.8776 13.6797 2.32031V15.6797C13.6797 16.1224 13.5104 16.513 13.1719 16.8516C12.8333 17.1641 12.4427 17.3203 12 17.3203H2C1.55729 17.3203 1.16667 17.1641 0.828125 16.8516C0.489583 16.513 0.320312 16.1224 0.320312 15.6797V2.32031C0.320312 1.8776 0.489583 1.5 0.828125 1.1875C1.16667 0.848958 1.55729 0.679688 2 0.679688H12Z"
                      fill="#333333"
                    />
                  </svg>
                </S.ReportTd>
                {/* <td>{el.consultingCount}</td>
                <td>
                  {el.lastConsultingDate === null ? "-" : el.lastConsultingDate}
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
