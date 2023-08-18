import styled from "@emotion/styled";

export const AcademyDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 20px;
  padding: 0px 30px 0px 30px;
`;

export const AcademyDetailTitle = styled.div`
  font-size: 35px;
  font-weight: 600;
`;

export const TitleLine = styled.div`
  border-top: 2px solid;
  width: 100%;
  margin: 3vh 0;
`;

export const EditBox = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ImageBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const InputBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: flex-start;
`;
export const InputBoxLeft = styled.div`
  display: flex;
  flex-direction: column;
`;
export const InputBoxRight = styled.div`
  margin-left: 30px;
  display: flex;
  flex-direction: column;
`;

export const InputTag = styled.div`
  width: 23vw;
  height: 6vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const InputInput = styled.input`
  width: 10vw;
  font-size: 16px;
  padding: 4px;
  border: 1px solid #dddddd;
  border-radius: 5px;
  margin: 0;
`;

export const CalenderDiv = styled.div`
  width: 10vw;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const InputName = styled.div`
  width: 9vw;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1e1e1e;
  color: #efefef;
`;

export const CheckDiv = styled.div`
  width: 40vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonBox = styled.div`
  margin: 20px 0;
  width: 90vw;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const RouteButton = styled.button`
  width: 8vw;
  height: 5vh;
  background-color: #1f1f1f;
  border: none;
  color: #eeeeee;
  font-size: 16px;
  margin-right: 20px;
  :hover {
    cursor: pointer;
  }
`;

export const TableTitleBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
`;

export const Table = styled.div`
  width: 100%;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const TableHeaderRound = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 3vh;
  border-top: 2px solid #1f1f1f;
  border-bottom: 2px solid #1f1f1f;
`;

export const TableRound = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 6vh;

  border-bottom: 1px solid #dddddd;
`;

export const TableHeadLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const TableHead = styled.div`
  border-left: 1px solid #dddddd;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const TableHeadRight = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  border-left: 1px solid #dddddd;
`;

export const ClassTableButton = styled.button`
  width: 3vw;
  height: 3vh;
  background-color: #1f1f1f;
  border: none;
  color: #eeeeee;
  font-size: 16px;
  :hover {
    cursor: pointer;
  }
`;

export const ClassTableButtonCancel = styled.button`
  width: 3vw;
  height: 3vh;
  background-color: #eeeeee;
  border: none;
  color: #1f1f1f;
  font-size: 16px;
  :hover {
    cursor: pointer;
  }
`;

export const ClassTableInput = styled.input`
  font-size: 16px;
  padding: 4px;
  border: 1px solid #dddddd;
  border-radius: 5px;
`;

export const ModalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
`;

export const ModalRadioBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const ModalInputBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 10px 0;
`;

export const TimeBox = styled.div`
  width: 51%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalTextArea = styled.textarea`
  width: 50%;
  height: 150px;
  border: 1px solid #dddddd;
`;

export const ModalButtonBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const ModalOkButton = styled.button`
  width: 8vw;
  height: 5vh;
  background-color: green;
  border: none;
  color: #eeeeee;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  margin-left: 20px;
  :hover {
    cursor: pointer;
  }
`;

export const ModalCancelButton = styled.button`
  width: 8vw;
  height: 5vh;
  background-color: tomato;
  border: none;
  color: #eeeeee;
  font-size: 16px;
  border-radius: 10px;
  font-weight: 600;
  :hover {
    cursor: pointer;
  }
`;

export const ModalRoutineInput = styled.div`
  width: 51%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalRoutineDates = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalRoutineDate = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2vw;
  height: 3vh;
  border: 1px solid #1e1e1e;
`;

export const ClassTitle = styled.div`
  font-size: 35px;
  font-weight: 600;
`;

export const ClassTitleLine = styled.div`
  border-top: 2px solid;
  width: 100%;
  margin: 3vh 0;
`;
