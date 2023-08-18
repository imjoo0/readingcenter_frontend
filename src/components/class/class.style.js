import styled from "@emotion/styled";

export const ClassWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 20px;
  padding: 0px 30px 0px 30px;
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

export const SwitchDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
`;

export const SwitchFont = styled.div`
  font-size: 17px;
  font-weight: 600;
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
  border-radius: 15px;
  color: #eeeeee;
  margin-left: 10px;
  background-color: #1e1e1e;
  :hover {
    cursor: pointer;
    filter: brightness(200%);
  }
`;

export const CountNumber = styled.div`
  font-size: 20px;
  height: 45px;
  line-height: 45px;
  font-weight: 500;
  color: black;
  margin-right: 20px;
  margin-left: 20px;
  border-radius: 10px;
  border: 1px black solid;
  padding: 0px 40px 0px 40px;
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

export const ClassSmallGreenButton = styled.button`
  border: 1px solid #dddddd;
  width: 6vw;
  height: 4vh;
  color: #fff;
  font-weight: 600;
  font-size: medium;
  background-color: #00923f;
  margin-left: 10px;
  border-radius: 20px;
  :hover {
    cursor: pointer;
    filter: brightness(120%);
  }
`;
export const ClassSmallBlueButton = styled.button`
  border: 1px solid #dddddd;
  width: 6vw;
  height: 4vh;
  color: #eeeeee;
  font-weight: 600;
  font-size: medium;
  background-color: #070093;
  margin-left: 10px;
  border-radius: 20px;
  :hover {
    cursor: pointer;
    filter: brightness(120%);
  }
`;
export const ClassSmallRedButton = styled.button`
  border: 1px solid #dddddd;
  width: 6vw;
  height: 4vh;
  color: #eeeeee;
  font-weight: 600;
  font-size: medium;
  background-color: #8b0000;
  margin-left: 10px;
  border-radius: 20px;
  :hover {
    cursor: pointer;
    filter: brightness(120%);
  }
`;
export const ClassSmallBlackButton = styled.button`
  border: 1px solid #dddddd;
  width: 6vw;
  height: 4vh;
  color: #eeeeee;
  font-weight: 600;
  font-size: medium;
  background-color: #1e1e1e;
  margin-left: 10px;
  border-radius: 20px;
  :hover {
    cursor: pointer;
    filter: brightness(120%);
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
  position: relative;
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

export const ModalReturnButton = styled.button`
  width: 6vw;
  height: 4vh;
  background-color: black;
  border: none;
  color: #eeeeee;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  margin-left: 20px;
  :hover {
    cursor: pointer;
    filter: brightness(180%);
  }
`;

export const ModalOkButton = styled.button`
  width: 6vw;
  height: 4vh;
  background-color: green;
  border: none;
  color: #eeeeee;
  font-size: 16px;
  font-weight: 600;
  border-radius: 10px;
  margin-left: 20px;
  :hover {
    cursor: pointer;
    filter: brightness(120%);
  }
`;

export const ModalCancelButton = styled.button`
  width: 6vw;
  height: 4vh;
  background-color: tomato;
  border: none;
  color: #eeeeee;
  font-size: 16px;
  border-radius: 10px;
  font-weight: 600;
  margin-left: 20px;
  :hover {
    cursor: pointer;
    filter: brightness(120%);
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
  font-weight: bold;
  font-size: large;
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
  border-right: 0.5px solid #1e1e1e;
`;

export const ModalHeadRight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25px;
  font-size: 17px;
  font-weight: 600;
  border: 0.5px solid #1e1e1e;
  border-left: none;
`;

export const ModalAddButton = styled.button`
  width: 100px;
  height: 30px;
  position: absolute;
  right: 30px;
  bottom: 20px;
  background-color: green;
  border: none;
  color: #eeeeee;
  font-size: 16px;
  font-weight: 600;
  border-radius: 5px;
  :hover {
    cursor: pointer;
    filter: brightness(120%);
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
export const SearchSelect = styled.select`
  width: 10vw;
  height: 4vh;
  border: 1px solid #dddddd;
  border-radius: 5px;
`;

export const DateMoveButton = styled.button`
  border: none;
  background-color: white;
  font-size: "25px";
  :hover {
    cursor: pointer;
    filter: brightness(120%);
  }
`;

export const DeleteButton = styled.button`
  width: 70px;
  height: 30px;
  border: none;
  border-radius: 10px;
  margin: 0 5px;
  :hover {
    cursor: pointer;
    filter: brightness(120%);
  }
`;

export const lectureInfo = styled.div`
  :hover {
    cursor: pointer;
  }
`;

export const lectureModalInfo = styled.div`
  font-size: 24px;
  font-weight: 600;
`;
