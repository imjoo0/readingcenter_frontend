import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import {
  GET_ALL_STUDENTS,
  GET_ME,
  GET_STUDENTS_REPORT_LIST,
} from "./report.query";
import { useEffect, useState } from "react";
import * as S from "./report.style";

export default function ReportPage() {
  const router = useRouter();
  const { data } = useQuery(GET_ALL_STUDENTS, {
    variables: { academyId: Number(router.query.branch) },
  });

  const { data: listData } = useQuery(GET_STUDENTS_REPORT_LIST, {
    variables: { academyId: Number(router.query.branch) },
  });

  const { data: myData } = useQuery(GET_ME);
  const [searchWord, setSearchWord] = useState("");
  const [studentArray, setStudentArray] = useState([]);

  const onChangeAcademy = (e) => {
    router.push("/" + e.target.value + "/report");
  };

  useEffect(() => {
    setStudentArray(
      listData?.studentsInAcademyWithConsulting?.filter((el) => {
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
      <style>{`
              table {
              border-collapse: separate;
              border-spacing: 0;
              border-radius: 0.125rem;
              border: 1px solid #DBDDE1;
              width: 100%;
              margin-bottom:2.5rem;
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
      <table>
        <thead>
          <tr>
            <th>원번</th>
            <th>이름</th>
            <th>등록일</th>
            <th>생년월일</th>
            <th>학습 리포트</th>
            <th>리딩 이력</th>
            <th>상담 횟수</th>
            <th>최근 상담 날짜</th>
          </tr>
        </thead>
        <tbody>
          {studentArray?.map((el) => {
            return (
              <tr>
                <td>{el?.student?.origin}</td>
                <td>
                  {el?.student?.korName + "(" + el?.student?.engName + ")"}
                </td>
                <td>{el?.student?.registerDate.slice(0, 10)}</td>
                <td>{el?.student?.birthDate?.slice(0, 10)}</td>
                <td>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open(
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
                  </svg>
                </td>
                <td>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open(
                        "/" + router.query.branch + "/report/" + el?.student?.id
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
                  </svg>
                </td>
                <td>{el.consultingCount}</td>
                <td>
                  {el.lastConsultingDate === null ? "-" : el.lastConsultingDate}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
