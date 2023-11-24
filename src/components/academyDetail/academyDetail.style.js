import styled from "@emotion/styled";

export const AcademyDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 10rem;
  padding: 0 8.4% 0 8.4%;
  /* margin-left: 15rem; */
`;

export const AcademyDetailTitle = styled.div`
  color: #111;

  font-family: Spoqa Han Sans Neo;
  font-size: 3rem;
  font-style: normal;
  font-weight: 700;
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
  display: flex;
  flex-direction: column;
`;
export const TagLine = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1.25rem;
`;

export const InputInput = styled.input`
  width: 18.75rem;
  height: 2.6875rem;
  color: #333;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  padding: 0 1rem;
  padding-left: 1rem;
  background: #fff;
  margin-left: 0.62rem;
  margin-bottom: 1.87rem;
  color: #333;

  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

export const InputPhoneInput = styled.input`
  width: 3.75rem;
  height: 2.6875rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
  border: 1px solid #dfe1e5;
  color: #333;
  padding: 0 1rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  background: #fff;
`;

export const InputEmailInput = styled.input`
  width: 9.25rem;
  height: 2.6875rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
  border: 1px solid #dfe1e5;
  color: #333;
  padding: 0 1rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  background: #fff;
  margin: 0 0.62rem;
`;

export const CalenderDiv = styled.div`
  width: 10vw;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const InputName = styled.div`
  color: #333;

  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  margin-bottom: 0.62rem;
`;

export const CheckDiv = styled.div`
  width: 40vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ButtonBox = styled.div`
  /* margin: 20px 0 2.5rem 0; */
  width: 90rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export const RouteButton = styled.button`
  width: 8rem;
  height: 2.6875rem;
  margin-top: 1.5rem;
  margin-left: 0.5rem;
  border-radius: 0.25rem;
  background: #333;
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  :hover {
    cursor: pointer;
  }
`;

export const MoveButton = styled.button`
  width: 8rem;
  height: 2.6875rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  border: 1px solid #c8c8c8;
  color: #333;
  background: #fff;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
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

export const ClassTitle = styled.div`
  color: #222;

  font-family: Spoqa Han Sans Neo;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
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

export const ConsultingTextArea = styled.textarea`
  resize: none;
  width: 29rem;
  height: 20rem;
  border: none;
  /* white-space: pre-wrap; */
  :focus {
    outline: none;
    border: none;
  }
`;

export const SubAcademyTitle = styled.div`
  color: #222;
  font-family: Spoqa Han Sans Neo;
  font-size: 1.875rem;
  font-style: normal;
  font-weight: 700;
  margin-bottom: 1.88rem;
`;

export const ConsultingInputTitle = styled.div`
  color: #333;

  font-family: Spoqa Han Sans Neo;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
`;

export const ConsultingPhoneInput = styled.input`
  width: 3.5rem;
  height: 2.6875rem;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  color: #545454;
  margin: 0.62rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  text-align: center;
`;

export const ConsultingTitleInput = styled.input`
  width: 12.325rem;
  height: 2.6875rem;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  color: #545454;
  /* padding-left: 0.87rem; */
  /* margin: 0.62rem; */
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

export const ConsultingTh = styled.th`
  color: #fff;
  background: #791285;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  border: 0.5px solid #dfe1e5;
  padding: 0 0rem;
  text-align: center;
`;

export const ConsultingTd = styled.td`
  color: #333;
  background: #fff;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  border: 0.5px solid #dfe1e5;
  padding: 0;
`;

export const ConsultingTdMaxWidth = styled.td`
  color: #333;
  background: #fff;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  border: 0.5px solid #dfe1e5;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 33.69rem;
  padding: 0 0.44rem;
`;

export const ConsultingTableButton = styled.button`
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 0.25rem;
  border: 1px solid #c8c8c8;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fff;
  cursor: pointer;
`;

export const ConsultingPageNumber = styled.span`
  width: 1.875rem;
  height: 1.9375rem;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
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
  border: 1px solid #dfe1e5;
`;

export const AddModalTd = styled.td`
  color: #333;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  padding: 0;
  border: 1px solid #dfe1e5;
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
  border: 1px solid #dfe1e5;
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
  width: 28.8rem;
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
  width: 12.875rem;
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
  width: 1.875rem;
  height: 1.875rem;
  display: inline-flex;
  padding: 0.491rem 0.4375rem 0.39169rem 0.4375rem;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  border: 1px solid #c8c8c8;
  background-color: #fefefe;
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
  width: 12.4rem;
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

export const ModalClassAddWrapper = styled.div`
  padding: 0;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #dfe1e5;
`;

export const OptionName = styled.span`
  color: #82858b;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

export const LectureInfoName = styled.div`
  color: #333;
  font-family: Spoqa Han Sans Neo;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 500;
  margin-right: 1.88rem;
`;

export const LectureInfoInput = styled.input`
  color: #545454;

  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  width: 13.125rem;
  height: 2.6875rem;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;

  background: rgba(239, 239, 239, 0.3);
`;

export const DateTitle = styled.div`
  color: #333;
  font-family: Spoqa Han Sans Neo;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  margin-right: 2.5rem;
`;

export const DateInput = styled.input`
  color: #333;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  border-radius: 0.25rem;
  border: 1px solid #d9d9d9;
  display: flex;
  padding: 0.6875rem 0.6875rem 0.6875rem 0.875rem;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
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

// 상담 추가, 상담 수정 디자인

export const ConsultingModalTitle = styled.div`
  color: #222;

  font-family: Spoqa Han Sans Neo;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
`;

export const ConsultingModalTag = styled.div`
  color: #333;

  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  margin-bottom: 0.63rem;
`;
export const ConsultingModalBox = styled.div``;

export const ConsultingModalInput = styled.input`
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

export const ConsultingModalBigInput = styled.input`
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

export const ConsultingModalTextArea = styled.textarea`
  margin-left: 0.62rem;
  width: 35.5rem;
  height: 11.5rem;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  overflow-y: auto;
  color: #333;
  resize: none;

  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  padding-left: 0.87rem;
`;

export const ConsultingLength = styled.div`
  color: #999;
  text-align: right;
  font-family: Noto Sans KR;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  margin-top: 0.62rem;
`;

export const ConsultingModalOKButton = styled.button`
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
export const ConsultingModalCancelButton = styled.button`
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

export const ModalLabel = styled.div`
  width: 4.255rem;
  height: 2.8785rem;
  padding-left: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  margin-left: 0.62rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

export const DateContainer = styled.div`
  width: 16.0625rem;
  height: 2.6875rem;
  border-radius: 0.25rem;
  border: 1px solid #d9d9d9;
  padding: 0 0.5rem;
  background: #fff;
`;
