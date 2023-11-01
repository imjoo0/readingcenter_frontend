import styled from "@emotion/styled";

export const PageWrapper = styled.div`
  margin-top: 10rem;
  /* padding: 0 8.4% 0 8.4%; */
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
  color: #111;
  font-family: Noto Sans KR;
  font-size: 3rem;
  font-style: normal;
  font-weight: 800;
  /* margin-left: 15rem; */
`;

export const ReportSubTitle = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  align-items: center;

  /* border-radius: 5px;
  border: 1px solid #333333; */
`;

export const ReportTextArea = styled.textarea`
  width: 36.8125rem;
  height: 17.8125rem;
  font-size: 1.2rem;
  font-weight: 400;
  font-family: Spoqa Han Sans Neo;
  resize: none;
  /* background-color: gray; */
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

// 여기서부터 다시 디자인 시작

export const ReportWrapper = styled.div`
  border: 1px solid #dfe1e5;
  background-color: #f0e4f1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  width: 90rem;
  height: 127.375rem;
  @media print {
    zoom: 0.6;
    .print-button {
      display: none; /* 프린트 시에 버튼을 숨김 처리합니다. */
    }
  }
`;

export const UserInfoTitle = styled.div`
  border: 4px solid #791285;
  color: #791285;
  text-align: center;
  font-family: Noto Sans KR;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 130%; /* 3.25rem */
  letter-spacing: -0.05rem;
  background: #fff;
  width: 85rem;
  height: 5.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2.5rem;
  margin-bottom: 1.25rem;
`;

export const UserInfoWrapper = styled.div`
  display: flex;
  width: 85rem;
  height: 3.875rem;
`;

export const UserInfoTag1 = styled.div`
  background: #9646a0;
  color: #fff;
  display: flex;
  width: 11rem;
  height: 3.875rem;

  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: Noto Sans KR;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
`;

export const UserInfoTag2 = styled.div`
  background: #fff;
  color: #333;
  display: flex;
  width: 11rem;
  height: 3.875rem;
  justify-content: center;
  align-items: center;
  font-family: Noto Sans KR;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
`;

export const ReportInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 85rem;
  margin-top: 1.25rem;
`;

export const ReportInfoBox = styled.div`
  width: 20.25rem;
  height: 19.1875rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export const ReportInfoTag = styled.div`
  width: 17.75rem;
  height: 3.4375rem;
  display: flex;
  /* justify-content: space-between; */
  align-items: "center";
`;

export const ReportInfoTagLeft = styled.div`
  color: #862991;
  font-family: Noto Sans KR;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 700;
  width: 60%;
`;

export const ReportInfoTagRight = styled.div`
  color: #333;
  font-family: Noto Sans KR;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
`;
export const ReportSmallUnit = styled.span`
  color: #333;

  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  margin-left: 0.44rem;
`;

export const ChartTitle = styled.div`
  color: #333;
  font-family: Noto Sans KR;
  font-size: 1.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 130%; /* 1.95rem */
  letter-spacing: -0.03rem;
  margin: 1.25rem 0;
`;

export const ReportInfoDoubleBox = styled.div`
  width: 41.6875rem;
  height: 32.5625rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export const ReportPrintNot = styled.button`
  background-color: #791285;
  border: none;
  color: #fff;
  width: 8rem;
  height: 2.6rem;
  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  margin-bottom: 1.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  @media print {
    display: none;
  }
`;

export const DateButtonContainer = styled.div`
  width: 100%;
  height: 11.125rem;
  background-color: #f4f4f8;
  display: flex;
  justify-content: center;
`;

export const DateButtonBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
  width: 90rem;
  height: 11.125rem;
`;

export const DateButtonTag = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const DateButtonTagTitle = styled.div`
  color: #333;
  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  display: flex;
  width: 5rem;
`;

export const DateYearButton = styled.button`
  width: 6.125rem;
  height: 2.4375rem;
  border-radius: 0.25rem;
  border: 1px solid #d9d9d9;
  background: #fff;
  margin-right: 0.62rem;

  color: #333;

  text-align: center;
  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

export const DateMonthButton = styled.button`
  width: 4.5rem;
  height: 2.4375rem;
  border-radius: 0.25rem;
  border: 1px solid #d9d9d9;
  margin-right: 0.62rem;
  background: #fff;

  color: #333;

  text-align: center;
  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;
