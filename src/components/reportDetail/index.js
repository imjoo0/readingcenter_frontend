import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { STUDENT_RECORD, GET_STUDENT } from "./reportDetail.query";
import { longWord } from "@/src/commons/library/library";
import * as S from './reportDetail.style';

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
		<S.PageWrapper>
			<S.ReportDetailTitle>
				{studentData?.userDetails?.profile?.korName +
					'(' +
					studentData?.userDetails?.profile?.engName +
					')' +
					' 읽은 도서 목록'}
			</S.ReportDetailTitle>
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
								<td>{el.arCorrect ? el.arCorrect + '%' : ''}</td>
								<td>{el.arDate}</td>
								<td>{el.litCorrect ? el.litCorrect + '%' : ''}</td>
								<td>{el.litDate}</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</S.PageWrapper>
	);
}
