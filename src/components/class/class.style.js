import { css } from "@emotion/react";
import styled from "@emotion/styled";

export const CustomRadioStyles = css`
  input[type="radio"] {
    appearance: none;
    width: 15px;
    height: 15px;
    box-shadow: 0 0 0 1px red;
    border: 4px solid black;
    border-radius: 50%;
    background-color: yellow;
    &:checked {
      background-color: #791285;
    }
  }
`;

export const ClassWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 10rem;
  padding: 0 8.4% 0 8.4%;
`;

export const TitleWrapper = styled.div`
  width: 1600px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ClassTitle = styled.div`
  color: #222;
  font-family: Spoqa Han Sans Neo;
  font-size: 3rem;
  font-style: normal;
  font-weight: 700;
  display: flex;
  align-items: center;
  margin-bottom: 2.5rem;
`;

export const ClassSubTitle = styled.div`
  width: 90rem;
  color: #222;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2.5rem 0 1.87rem 0;
  font-family: Spoqa Han Sans Neo;
  font-size: 1.875rem;
  font-style: normal;
  font-weight: 700;
`;

export const CalendarLine = styled.div`
  display: flex;
  width: 90rem;
  border-bottom: 1px solid #dfe1e5;
`;

export const CalendarSpan = styled.span`
  width: 8.5625rem;
  height: 4.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 400;
  :hover {
    cursor: pointer;
  }
`;

export const ClassTitleLine = styled.div`
  border-top: 2px solid;
  width: 100%;
  margin: 3vh 0;
`;

export const SwitchDiv = styled.div`
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  padding: 0.75rem 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.75rem;
`;

export const SwitchFont = styled.div`
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const ClassTopMenu = styled.div`
  display: flex;
  justify-content: center;
  width: 90rem;
`;

export const ClassDate = styled.div`
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #000;
  padding: 0 0.81rem;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1.0625rem;
  font-style: normal;
  font-weight: 500; /* 117.647% */
  :hover {
    cursor: pointer;
  }
`;
export const DateBox = styled.div`
  border-radius: 0.2rem;
  /* border: 1px solid #dbdde1; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  vertical-align: center;
`;

export const DateMoveButton = styled.button`
  border: none;
  background-color: white;
  padding: 0.75rem 1.25rem;
  :hover {
    cursor: pointer;
    filter: brightness(120%);
  }
`;

export const ClassMiddleBox = styled.div`
  width: 90rem;
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
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  border-radius: 0.5rem;
  background: #ebecef;
  border: 0;
  padding: 0.75rem 1.5rem;
  margin-left: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: center;
  :hover {
    cursor: pointer;
    filter: brightness(80%);
  }
`;

export const SettingButton = styled.button`
  width: 8rem;
  height: 2.6875rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  border: 1px solid #c8c8c8;
  color: #333;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  background: #fff;
  cursor: pointer;
`;

export const SettingSpan = styled.span`
  color: #333;
  font-family: Spoqa Han Sans Neo;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
`;

export const SettingSelect = styled.select`
  width: 10.875rem;
  height: 2.6875rem;
  text-align: center;
  border: none;
  border-bottom: 1px solid #858585;
  color: #333;
  margin-top: 1.5rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  margin-left: 1.25rem;
  margin-right: 1.5rem;
`;

export const CountNumber = styled.div`
  font-style: normal;
  font-weight: 500;
  height: 100%;
  text-align: center;
  font-size: 1.125rem;
  font-weight: 700;
`;

export const ClassInput = styled.input`
  width: 15.3125rem;
  height: 2.6875rem;
  font-size: 16px;
  padding: 0 0 0 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  ::placeholder {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M14.1667 14.1667L17.5 17.5M2.5 9.16667C2.5 10.9348 3.20238 12.6305 4.45262 13.8807C5.70286 15.131 7.39856 15.8333 9.16667 15.8333C10.9348 15.8333 12.6305 15.131 13.8807 13.8807C15.131 12.6305 15.8333 10.9348 15.8333 9.16667C15.8333 7.39856 15.131 5.70286 13.8807 4.45262C12.6305 3.20238 10.9348 2.5 9.16667 2.5C7.39856 2.5 5.70286 3.20238 4.45262 4.45262C3.20238 5.70286 2.5 7.39856 2.5 9.16667Z' stroke='%2381858C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-size: contain;
    background-position: 0px center;
    background-repeat: no-repeat;
  }
`;

export const ClassSmallGreenButton = styled.div`
  width: 5.625rem;
  height: 2.75rem;
  flex-shrink: 0;
  border-radius: 1.375rem;
  border: 1px solid #dbdde1;
  background: #f7f8fa;
  display: flex;
  font-size: 1rem;
  font-weight: 400;
  vertical-align: center;
  align-items: center;
  justify-content: center;
  :hover {
    cursor: pointer;
    filter: brightness(80%);
  }
`;
export const ClassSmallBlueButton = styled.button`
  width: 5.625rem;
  height: 2.75rem;
  flex-shrink: 0;
  border-radius: 1.375rem;
  border: 1px solid #dbdde1;
  background: #f7f8fa;
  display: flex;
  font-size: 1rem;
  font-weight: 500;
  vertical-align: center;
  align-items: center;
  justify-content: center;
  :hover {
    cursor: pointer;
    filter: brightness(80%);
  }
`;
export const ClassSmallRedButton = styled.button`
  display: inline-flex;
  padding: 0.6875rem 1.25rem;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  border: 1px solid #c8c8c8;
  background-color: #ffffff;
  color: #333;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  :hover {
    cursor: pointer;
    filter: brightness(80%);
  }
`;
export const ClassSmallBlackButton = styled.button`
  width: 6rem;
  height: 2.6875rem;
  display: inline-flex;
  padding: 0.6875rem 1.25rem;
  justify-content: center;
  align-items: center;
  border: 1px solid #c8c8c8;
  border-radius: 0.25rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  :hover {
    cursor: pointer;
    filter: brightness(80%);
  }
`;

export const AbsentButton = styled.button`
  :hover {
    cursor: pointer;
    filter: brightness(80%);
  }
`;

export const ClassSmallTimeInput = styled.input`
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  margin-left: 0.75rem;
  padding: 0.56rem 1rem 0.56rem 1rem;
  width: 250px;
`;
export const ClassSmallTimeBtn = styled.button`
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  margin-left: 0.25rem;
  padding: 0.56rem 1.25rem 0.56rem 1.5rem;
  background-color: #fff;
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
  width: 89rem;
`;

export const ModalRadioBox = styled.div`
  width: 29rem;
  /* flex-direction: column; */
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: 1.38rem;
  margin-left: 0.62rem;
`;

export const ModalInputBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin: 10px 0;
`;

export const TimeBox = styled.div`
  width: 37rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 0.62rem;
`;

export const ModalTextArea = styled.textarea`
  width: 50%;
  height: 150px;
  border: 1px solid #dddddd;
`;

export const ModalTitle = styled.div`
  width: 100%;
  font-size: 2.125rem;
  font-style: normal;
  font-weight: 500;
  line-height: 2.5rem;
  margin-top: 1rem;
`;

export const ModalButtonBox = styled.div`
  width: 92rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ModalReturnButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  background: #ebecef;
  border: 0;
  color: #333;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  :hover {
    cursor: pointer;
    filter: brightness(120%);
  }
`;

export const ModalOkButton = styled.button`
  border-radius: 0.5rem;
  background: #333;
  color: #eeeeee;
  margin-left: 20px;
  border: 0;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  :hover {
    cursor: pointer;
    filter: brightness(120%);
  }
`;

export const ModalCancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  background: #333;
  border: 0;
  color: #fff;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-right: 0.75rem;
  :hover {
    cursor: pointer;
    filter: brightness(80%);
  }
`;

export const ModalClassAddWrapper = styled.div`
  padding: 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #dfe1e5;
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
  width: 100%;
`;

export const ModalRoutineDates = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* border-radius: 0.5rem;
  border: 1px solid #dbdde1; */
`;

export const ModalRoutineDate = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.6875rem;
  height: 2.6875rem;
  border-radius: 0.5rem;
  border: 1px solid #d9d9d9;
  margin-left: 0.62rem;
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
  /* ::-webkit-scrollbar {
    display: none;
  } */
`;

export const ModalTag = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  font-weight: bold;
  font-size: large;
  margin-top: 2rem;
`;

export const ModalTagHover = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-right: 20px;
  font-weight: bold;
  font-size: large;
  :hover {
    cursor: pointer;
  }
`;

export const ModalHeadLeft = styled.div`
  display: flex;
  justify-content: center;
  height: 25px;
  font-size: 17px;
  font-weight: 600;
  border: 0.5px solid #dbdde1;
`;
export const ModalHeadMiddle = styled.div`
  display: flex;
  justify-content: center;
  height: 25px;
  font-size: 17px;
  font-weight: 600;
  border-bottom: 0.5px solid #dbdde1;
  border-top: 0.5px solid #dbdde1;
  border-right: 0.5px solid #dbdde1;
`;

export const ModalHeadRight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25px;
  font-size: 17px;
  font-weight: 600;
  border: 0.5px solid #dbdde1;
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
  font-size: 20px;
  font-weight: 400;
`;

export const MoveIcon = styled.div`
  :hover {
    cursor: pointer;
  }
`;

export const NumberIcon = styled.span`
  :hover {
    cursor: pointer;
  }
`;

export const CalendarWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;

export const CalendarLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  border-right: 1px solid #dbdde1;
  height: 58.5rem;
`;

export const CalendarLeftSelect = styled.select`
  width: 6.9375rem;
  height: 2.75rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  color: #333;
  padding-left: 1rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  margin-right: 1rem;
`;

export const CalendarRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: 1.5rem;
  margin-left: 1.5rem;
`;

export const CalendarRightTitle = styled.div`
  font-family: Spoqa Han Sans Neo;
  font-size: 2.125rem;
  font-style: normal;
  font-weight: 500;
`;

export const CalendarRightDiv = styled.div`
  font-family: Spoqa Han Sans Neo;
  color: #000;
  font-family: Spoqa Han Sans Neo;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
`;

export const CalendarRightSelect = styled.select`
  width: 19.25rem;
  height: 2.75rem;
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  font-family: Spoqa Han Sans Neo;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  padding-left: 1rem;
`;

export const CalendarRightInput = styled.input`
  width: 18.25rem;
  height: 2.75rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  color: #333;
  font-family: Spoqa Han Sans Neo;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  padding-left: 1rem;
`;

export const CalendarRightInputTime = styled.input`
  width: 7.375rem;
  height: 2.75rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  color: #333;
  font-family: Spoqa Han Sans Neo;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  padding-left: 1rem;
`;

export const CalendarRightTextarea = styled.textarea`
  width: 17.25rem;
  height: 3.75rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  padding: 1rem;
  color: #81858c;
  font-family: Spoqa Han Sans Neo;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
`;

export const CalendarLecture = styled.div`
  /* width: 9.125rem; */

  font-family: Spoqa Han Sans Neo;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  :hover {
    cursor: pointer;
  }
`;

export const EditModalTitle = styled.div`
  font-size: 2rem;
  font-weight: 500;
  font-family: Spoqa Han Sans Neo;
  margin-bottom: 1rem;
`;

export const EditModalTagTitle = styled.div`
  font-size: 1rem;
  font-weight: 400;
  font-family: Spoqa Han Sans Neo;
`;

export const EditModalTag = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

export const EditModalTimeTag = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const EditTextArea = styled.textarea`
  width: 100%;
  height: 10rem;
  resize: none;
`;

export const EditModalButtonContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const EditModalOKButton = styled.div`
  border-radius: 0.5rem;
  background: #333;
  display: inline-flex;
  padding: 0.75rem 1.5rem;
  justify-content: center;
  align-items: center;
  margin-left: 1rem;
  color: #ffffff;
  cursor: pointer;
`;

export const EditModalCancelButton = styled.div`
  border-radius: 0.5rem;
  border: 1px solid;
  background: #ffffff;
  display: inline-flex;
  padding: 0.75rem 1.5rem;
  justify-content: center;
  align-items: center;
  color: #333;
  cursor: pointer;
`;

export const HoverButton = styled.div`
  cursor: pointer;
`;

export const ModalInput = styled.input`
  width: 15.625rem;
  height: 2.6875rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  background: #fff;
  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  margin-bottom: 0.7rem;
  ::placeholder {
    background-image: url("/image/search.svg");
    background-size: contain;
    background-position: 0px center;
    background-repeat: no-repeat;
  }
`;

export const AddModalTh = styled.th`
  color: #fff;
  padding: 0.31rem 0;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  width: 2rem;
`;

export const AddModalTd = styled.td`
  color: #333;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  padding: 0;
`;

export const AddModalTdMaxWidth = styled.td`
  color: #333;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 0.5rem;
  padding: 0;
`;

export const AddModalBackButton = styled.button`
  border-radius: 0.25rem;
  border: 1px solid #791285;
  background: #fff;
  width: 8.875rem;
  height: 2.6875rem;
  color: #791285;

  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  display: "flex";
  align-items: center;
  justify-content: space-around;
`;

export const AddModalTitle = styled.div`
  color: #333;

  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  margin-top: 1.25rem;
  margin-bottom: 0.69rem;
`;

export const AddModalSelectBox = styled.div`
  border-radius: 0.25rem 0.25rem 0rem 0rem;
  border: 1px solid #dfe1e5;
  background: #fff;
  width: 4rem;
  height: 2.6875rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #333;
  min-width: 4rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
`;

export const AddModalOKButton = styled.button`
  width: 4.375rem;
  height: 2.6875rem;
  border-radius: 0.25rem;
  border: 1px solid #791285;
  color: #fff;
  background: #791285;
  color: #fff;
  margin-right: 0.88rem;
  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  cursor: pointer;
`;

export const AddModalCancelButton = styled.button`
  width: 4.375rem;
  height: 2.6875rem;
  border-radius: 0.25rem;
  border: 1px solid #d9d9d9;
  background: #fff;
  color: #333;
  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  cursor: pointer;
`;

export const AddModalInput = styled.input`
  width: 16rem;
  height: 2.6875rem;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  margin-left: 0.62rem;
  color: #333;
  padding-left: 0.87rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

export const AddModalTagTitle = styled.div`
  color: #333;

  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  margin-top: 1.25rem;
  margin-bottom: 0.62rem;
`;

export const AddRadioButton = styled.input`
  accent-color: #791285;
  margin-right: 0.5rem;
  :checked {
    border: 0.4em solid #791285;
  }
`;

export const AddRadioTitle = styled.div`
  color: #791285;

  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

export const AddModalTextArea = styled.textarea`
  width: 28.5rem;
  height: 4rem;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  resize: none;
  color: #000000;
  margin-left: 0.62rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

export const AddModalContent = styled.div`
  color: #333;

  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

export const AddModalTimeInput = styled.input`
  width: 12.5rem;
  height: 2.6875rem;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  color: #333;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  padding-left: 0.87rem;
`;

export const AddModalIconButton = styled.button`
  display: inline-flex;
  padding: 0.491rem 0.4375rem 0.39169rem 0.4375rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  border: 1px solid #c8c8c8;
  background-color: #fefefe;
  width: 1.875rem;
  height: 1.875rem;
  cursor: pointer;
`;

export const AddModalWeekBlock = styled.div`
  width: 2.1875rem;
  height: 2.125rem;
  border-right: 1px solid #dfe1e5;
  border-left: 1px solid #dfe1e5;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const AddModalWarning = styled.span`
  color: #f00;
  font-family: Spoqa Han Sans Neo;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  display: flex;
  align-items: center;
  margin-top: 0.75rem;
`;

export const AddModalSelect = styled.select`
  width: 13.5rem;
  height: 2.6875rem;
  padding-left: 0.87rem;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  color: #333;

  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  margin-left: 0.62rem;
  margin-right: 1.56rem;
`;

export const AddModalInputDate = styled.input`
  width: 12.275rem;
  height: 2.6875rem;
  padding: 0;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  padding-left: 0.87rem;
  background: #fff;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  margin-left: 0.62rem;
  margin-right: 1.56rem;
`;

export const AddModalInputTime = styled.input`
  width: 13.1875rem;
  height: 2.6875rem;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  padding-left: 0.87rem;
  background: #fff;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  margin-left: 0.62rem;
  margin-right: 1.16rem;
`;

export const ClassTh = styled.th`
  background: #791285;
  color: #fff;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  border: 1px solid #dfe1e5;
  padding: 0;
`;

export const ClassTd = styled.td`
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  border: 1px solid #dfe1e5;
  padding: 0 0.7rem;
`;

// 보강 디자인, 수업 메모 디자인
export const MakeUpModalTitle = styled.div`
  color: #222;
  font-family: Spoqa Han Sans Neo;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
`;

export const MakeUpModalSubTitle = styled.div`
  color: #333;
  margin-bottom: 0.88rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
`;

export const MakeUpModalTagTitle = styled.div`
  color: #333;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  margin-bottom: 0.62rem;
`;

export const MakeUpModalInput = styled.input`
  width: 15.725rem;
  height: 2.6875rem;
  border: 1px solid #dfe1e5;
  border-radius: 0.5rem;
  margin-left: 0.63rem;
  padding: 0;
  padding-left: 0.87rem;
  color: #333;

  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;
export const MakeUpModalBigInput = styled.input`
  width: 35.5rem;
  height: 2.6875rem;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  margin-left: 0.63rem;
  padding: 0;
  padding-left: 0.87rem;
  color: #333;

  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

export const MakeUpModalTextArea = styled.textarea`
  margin-left: 0.62rem;
  width: 35.5rem;
  height: 4.375rem;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  overflow-y: auto;
  color: #333;

  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  padding-left: 0.87rem;
  resize: none;
`;
export const MakeUpModalOKButton = styled.button`
  border-radius: 0.25rem;
  justify-content: center;
  align-items: center;
  background: #791285;
  border: 1px solid #791285;
  width: 4.375rem;
  height: 2.6875rem;
  color: #fff;

  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  margin-right: 0.88rem;
`;
export const MakeUpModalCancelButton = styled.button`
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  border: 1px solid #c8c8c8;
  background: #fff;
  width: 4.375rem;
  height: 2.6875rem;
  color: #333;

  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
`;

export const DateLabel = styled.div`
  width: 15.725rem;
  height: 2.6875rem;
  display: flex;
  align-items: center;
  border: 1px solid #dfe1e5;
  border-radius: 0.5rem;
  margin-left: 0.63rem;
  padding: 0;
  padding-left: 0.87rem;
  color: #333;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

export const ModalBorderLess = styled.input`
  border: none;
  outline: none;
  width: 3rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;
