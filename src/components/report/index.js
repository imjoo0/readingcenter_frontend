import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { GET_ALL_STUDENTS } from "./report.query";
import { useEffect, useState } from "react";
import { BookOutlined } from "@ant-design/icons";
import * as S from './report.style';

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
		<div
			style={{
				marginTop: '10rem',
				padding: '0 8.4% 0 8.4%',
			}}
		>
			<S.ReportTitle>학습 리포트</S.ReportTitle>
			<S.ReportSearchBox>
				<S.ReportInput
					onChange={(e) => {
						setSearchWord(e.target.value);
					}}
					placeholder="       원번 혹은 이름을 입력하세요."
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
					</tr>
				</thead>
				<tbody>
					{studentArray?.map((el) => {
						return (
							<tr>
								<td>{el.origin}</td>
								<td>{el.korName + '(' + el.engName + ')'}</td>
								<td>{el.registerDate.slice(0, 10)}</td>
								<td>{el.birthDate.slice(0, 10)}</td>
								<td>
									<BookOutlined
										onClick={() => {
											window.open(
												'/' + router.query.branch + '/report/' + el.id
											);
										}}
									></BookOutlined>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		</div>
	);
}
