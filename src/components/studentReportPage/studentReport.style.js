import styled from "@emotion/styled";

export const PageWrapper = styled.div`
  margin-top: 10rem;
  padding: 0 8.4% 0 8.4%;
`;

export const ReportDetailTitle = styled.div`
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 3.5rem;
  margin-bottom: 2.5rem;
`;

export const ReportFilterBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-bottom: 30px;
`;

export const ReportTitle = styled.div`
  margin-top: 2rem;
  font-size: 2rem;
  font-family: Spoqa Han Sans Neo;
  font-weight: 500;
`;

export const ReportSubTitle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin: 1rem;
  font-size: 1.7rem;
  font-family: Spoqa Han Sans Neo;
  font-weight: 500;
`;

export const ReportChartSubContainer = styled.div``;

export const ReportChartContainer = styled.div`
  border-radius: 5px;
  border: 1px solid black;
  width: 99rem;
  margin: 2rem 0;
  z-index: -1;
`;

export const ReportMemoContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const ReportMemoBox = styled.div`
  padding: 1rem;
  width: 25rem;
  height: 10rem;
  border: 1px solid #333333;
  border-radius: 5px;
`;

export const ReportInputBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  /* border-radius: 5px;
  border: 1px solid #333333; */
`;

export const ReportTextArea = styled.textarea`
  width: 93rem;
  height: 30rem;
  border-radius: 1rem;
  padding: 1rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1.3rem;
  margin-left: 2rem;
`;

export const ReportSubContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  height: 5.5rem;
`;

export const ReportSubContainerTitle = styled.div`
  font-size: 1.3rem;
`;

export const ReportSubContainerGage = styled.div`
  width: 100%;
  font-size: 2rem;
  display: flex;
  align-items: "flex-start";
  justify-content: center;
`;

export const ReportSaveButton = styled.button`
  width: 5rem;
  height: 2rem;
  background-color: #333;
  color: #eeeeee;
  border: none;
  border-radius: 0.3rem;
  margin: 2rem;
  :hover {
    cursor: pointer;
  }
`;

export const ReportModalMemo = styled.div`
  display: flex;
  width: 25rem;
  font-size: 1rem;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #333;
  border-radius: 0.5rem;
`;
