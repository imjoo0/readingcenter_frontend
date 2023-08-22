import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { STUDENT_RECORD, GET_STUDENT } from "./reportDetail.query";
import { longWord } from "@/src/commons/library/library";

export default function ReportDetailPage() {
  const router = useRouter();
  const { data: recordData } = useQuery(STUDENT_RECORD, {
    variables: { studentId: Number(router.query.id) },
  });
  const { data: studentData } = useQuery(GET_STUDENT, {
    variables: {
      userId: Number(router.query.id),
      academyId: Number(router.query.branch),
    },
  });
  return (
    <>
      <div>
        {studentData?.userDetails?.profile?.korName +
          "(" +
          studentData?.userDetails?.profile?.engName +
          ")" +
          " 읽은 도서 목록"}
      </div>
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
            <th>제목</th>
            <th>저자</th>
            <th>Word Count</th>
            <th>AR</th>
            <th>Lexile</th>
            <th>AR Quiz</th>
            <th>AR 퀴즈 정답률</th>
            <th>AR 퀴즈 날짜</th>
            <th>Lexile 퀴즈 정답률</th>
            <th>Lexile 퀴즈 날짜</th>
          </tr>
        </thead>
        <tbody>
          {recordData?.studentBookRecord.map((el) => {
            return (
              <tr>
                <td>{longWord(el.book.titleAr)}</td>
                <td>{el.book.authorAr}</td>
                <td>{el.book.wcAr}</td>
                <td>{el.book.bl}</td>
                <td>{el.book.lexileLex ?? el.book.lexileAr}</td>
                <td>{el.book.arQuiz}</td>
                <td>{el.arCorrect ? el.arCorrect + "%" : ""}</td>
                <td>{el.arDate}</td>
                <td>{el.litCorrect ? el.litCorrect + "%" : ""}</td>
                <td>{el.litDate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
