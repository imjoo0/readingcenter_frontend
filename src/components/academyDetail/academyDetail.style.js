import styled from "@emotion/styled";

export const AcademyDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 10rem;
  padding: 0 8.4% 0 8.4%;
`;

export const AcademyDetailTitle = styled.div`
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 3.5rem;
  height: 3.5rem;
  display: flex;
  vertical-align: center;
`;
export const BackButton = styled.button`
  width: 2.5rem;
  margin-right: 0.5rem;
  background-color: transparent;
  border: none;
  height: 3.5rem;
  margin-bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40' fill='none'%3E%3Cpath d='M35 20H5M5 20L19.1667 5.83331M5 20L19.1667 34.1666' stroke='black' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-position-y: center;
  :hover {
    cursor: pointer;
  }
`;

export const TitleLine = styled.div`
  border-top: 2px solid;
  width: 100%;
  margin: 3vh 0;
`;

export const EditBox = styled.div`
  margin-top: 2.5rem;
  width: 100%;
`;

export const ImageBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

export const InputBox = styled.div``;

export const InputTag = styled.div`
  width: 47%;
  display: block;
`;
export const TagLine = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1.25rem;
`;

export const InputInput = styled.input`
  padding: 0.81rem 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  width: calc(100% - 3rem);
  color: #333;
`;

export const CalenderDiv = styled.div`
  width: 10vw;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const InputName = styled.div`
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 0.75rem;
`;

export const CheckDiv = styled.div`
  width: 40vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonBox = styled.div`
  margin: 20px 0 2.5rem 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const RouteButton = styled.button`
  margin-top: 1.5rem;
  margin-left: 0.5rem;
  border-radius: 0.5rem;
  background: #333;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  :hover {
    cursor: pointer;
  }
`;

export const Box = styled.div`
  color: #000;
  font-family: Spoqa Han Sans Neo;
  font-size: 1.0625rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-bottom: 1rem;
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
  border-radius: 0.25rem 0.25rem 0rem 0rem;
  margin-bottom: 3rem;
`;

export const TableHeaderRound = styled.div`
  width: 100%;
  display: flex;
  border: 0.8px solid #dbdde1;
  justify-content: space-around;
  align-items: center;
  height: 2.75rem;
  background: #f7f8fa;
`;

export const TableRound = styled.div`
  width: 100%;
  display: flex;
  border: 0.8px solid #dbdde1;
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

export const ModalOkButton2 = styled.button`
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

export const ModalCancelButton2 = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  background: #333;
  border: 0;
  color: #fff;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  margin-left: 0.75rem;
  :hover {
    cursor: pointer;
    filter: brightness(80%);
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
