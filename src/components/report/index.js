import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { GET_ALL_STUDENTS } from "./report.query";
import { useEffect, useState } from "react";
import { BookOutlined } from "@ant-design/icons";

export default function ReportPage() {
  const router = useRouter();
  const { data } = useQuery(GET_ALL_STUDENTS, {
    variables: { academyId: Number(router.query.branch) },
  });
  const [searchWord, setSearchWord] = useState("");
  const [studentArray, setStudentArray] = useState([]);

  useEffect(() => {
    setStudentArray(
      data?.studentsInAcademy?.filter((el) => {
        return (
          el.origin.includes(searchWord) || el.korName.includes(searchWord)
        );
      })
    );
  }, [searchWord, data]);

  return (
    <>
      <div>학습 리포트</div>
      <span>검색</span>
      <input
        onChange={(e) => {
          setSearchWord(e.target.value);
        }}
        placeholder="원번, 이름으로 검색하세요"
      ></input>
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
                text-align: left;
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
      <table>
        <thead>
          <tr>
            <th>원번</th>
            <th>이름</th>
            <th>등록일</th>
            <th>생년월일</th>
            <th>학습 리포트</th>
          </tr>
        </thead>
        <tbody>
          {studentArray?.map((el) => {
            return (
              <tr>
                <td>{el.origin}</td>
                <td>{el.korName + "(" + el.engName + ")"}</td>
                <td>{el.registerDate.slice(0, 10)}</td>
                <td>{el.birthDate.slice(0, 10)}</td>
                <td>
                  <BookOutlined
                    onClick={() => {
                      window.open(
                        "/" + router.query.branch + "/report/" + el.id
                      );
                    }}
                  ></BookOutlined>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
