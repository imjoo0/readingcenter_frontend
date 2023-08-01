import styled from "@emotion/styled";

export const ClassWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 20px;
  padding-left: 10px;
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

export const ClassTopMenu = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const ClassDate = styled.div`
  border: 1px solid #dddddd;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 10vw;
  height: 4vh;
  font-size: 18px;
  font-weight: 500;
  :hover {
    cursor: pointer;
  }
`;

export const ClassMiddleBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 17px 0;
`;

export const ClassMiddleTag = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ClassButton = styled.button`
  border: 1px solid #dddddd;
  width: 7vw;
  height: 4vh;
  color: #eeeeee;
  background-color: #1e1e1e;
  :hover {
    cursor: pointer;
  }
`;

export const CountNumber = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin-right: 20px;
`;

export const ClassInput = styled.input`
  margin-left: 9px;
  width: 25vw;
  height: 25px;
  font-size: 16px;
  padding: 4px;
  border: 1px solid #dddddd;
  border-radius: 5px;
`;

export const ClassSmallButton = styled.button`
  border: 1px solid #dddddd;
  width: 6vw;
  height: 4vh;
  color: #eeeeee;
  background-color: #1e1e1e;

  :hover {
    cursor: pointer;
  }
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
  height: 4vh;

  border-bottom: 1px solid #dddddd;
`;

export const TableHeadLeft = styled.div`
  margin: 0;
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
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export const TableHeadRight = styled.div`
  margin: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  border-left: 1px solid #dddddd;
`;

export const PageContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const PageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2vw;
  height: 3vh;
  border: 1px solid #dddddd;
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
  margin-left: 20px;
  :hover {
    cursor: pointer;
  }
`;

export const InputInput = styled.input`
  width: 10vw;
  font-size: 16px;
  padding: 4px;
  border: 1px solid #dddddd;
  border-radius: 5px;
`;

export const AlarmButton = styled.button`
  width: 8vw;
  height: 5vh;
  background-color: purple;
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

export const AlarmDiv = styled.div`
  font-size: 18px;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ModalTable = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 15px;
`;

export const ModalTag = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

export const ModalHeadLeft = styled.div`
  display: flex;
  justify-content: center;
  height: 25px;
  font-size: 17px;
  font-weight: 600;
  border: 0.5px solid #1e1e1e;
`;
export const ModalHeadMiddle = styled.div`
  display: flex;
  justify-content: center;
  height: 25px;
  font-size: 17px;
  font-weight: 600;
  border-bottom: 0.5px solid #1e1e1e;
  border-top: 0.5px solid #1e1e1e;
`;

export const ModalHeadRight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25px;
  font-size: 17px;
  font-weight: 600;
  border: 0.5px solid #1e1e1e;
`;

export const ModalAddButton = styled.button`
  width: 100px;
  height: 30px;
  background-color: green;
  border: none;
  color: #eeeeee;
  font-size: 16px;
  font-weight: 600;
  border-radius: 5px;
  :hover {
    cursor: pointer;
  }
`;

export const BookTable = styled.div`
  display: flex;
  width: 80%;
  font-size: 24px;
`;

export const BookHead = styled.div`
  border: 1px solid #eeeeee;
`;

export const ModalIcon = styled.button`
  .hover {
    cursor: pointer;
  }
`;
