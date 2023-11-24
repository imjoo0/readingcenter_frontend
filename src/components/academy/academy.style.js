import styled from "@emotion/styled";

export const AcademyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: "90rem";
  margin-top: 10rem;
  padding: 0 8.4% 0 8.4%;
`;

export const AcademyTitle = styled.div`
  color: #111;

  font-family: Spoqa Han Sans Neo;
  font-size: 3rem;
  font-style: normal;
  font-weight: 700;
`;

export const AcademyTitleLine = styled.div`
  border-top: 2px solid;
  width: 100%;
  margin: 3vh 0;
`;

export const SearchBox = styled.div`
  margin-top: 2.5rem;
`;

export const SearchTag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SearchInput = styled.input`
  width: 15.625rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  padding: 0.81rem 0 0.81rem 1.25rem;
  ::placeholder {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M14.1667 14.1667L17.5 17.5M2.5 9.16667C2.5 10.9348 3.20238 12.6305 4.45262 13.8807C5.70286 15.131 7.39856 15.8333 9.16667 15.8333C10.9348 15.8333 12.6305 15.131 13.8807 13.8807C15.131 12.6305 15.8333 10.9348 15.8333 9.16667C15.8333 7.39856 15.131 5.70286 13.8807 4.45262C12.6305 3.20238 10.9348 2.5 9.16667 2.5C7.39856 2.5 5.70286 3.20238 4.45262 4.45262C3.20238 5.70286 2.5 7.39856 2.5 9.16667Z' stroke='%2381858C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-size: contain;
    background-position: 0px center;
    background-repeat: no-repeat;
  }
`;

export const SearchButton = styled.button`
  padding: 0.75rem 1.5rem;
  margin-left: 0.75rem;
  border-radius: 0.5rem;
  background: #333;
  font-size: 1rem;
  color: #eeeeee;
  font-weight: 500;
  border: 0;
  :hover {
    cursor: pointer;
  }
`;
export const RegistButton = styled.button`
  display: inline-flex;
  padding: 0.6875rem 1.25rem;
  justify-content: center;
  align-items: center;
  border-radius: 0.25rem;
  border: 1px solid #c8c8c8;
  color: #333;
  margin-left: 2rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  background: #fff;
  :hover {
    cursor: pointer;
  }
`;

export const CountNumber = styled.div`
  font-size: 1.0625rem;
  font-style: normal;
  font-weight: 700;
  height: 100%;
  vertical-align: bottom;
  text-align: center;
  padding-top: 1.6rem;
`;

export const OptionTitle = styled.div`
  font-size: 1.0625rem;
  font-style: normal;
  font-weight: 700;
  height: 100%;
  margin-right: 1.25rem;
`;

export const OptionSelect = styled.select`
  border: none;
  width: 10.875rem;
  height: 2.6875rem;
  text-align: center;
  color: #333;
  border-bottom: 1px solid #858585;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
`;

export const CountBox = styled.div`
  margin-top: 2.5rem;
  display: flex;
  width: 90rem;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const CountLeft = styled.div`
  display: flex;
  text-align: bottom;
  vertical-align: bottom;
  align-items: center;
`;
export const CountRight = styled.div`
  display: flex;
`;
export const ContinueOrRest = styled.div`
  width: 7.9375rem;
  padding: 0.75rem 0.75rem 0.75rem;
  flex-shrink: 0;
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  text-align: center;
  vertical-align: center;
  display: flex;
  justify-content: space-between;
`;

export const Table = styled.div`
  width: 90rem;
  padding: 0;
  display: flex;
  flex-direction: column;
`;

export const TableHeaderRound = styled.div`
  border-radius: 0.25rem 0.25rem 0rem 0rem;
  background: #f7f8fa;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 2.75rem;
  border: 0.8px solid #dbdde1;
`;

export const TableRound = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 2.75rem;
  border: 0.8px solid #dbdde1;
`;

export const TableHeadLeft = styled.div`
  margin: 0;
  display: flex;
  flex-direction: row;
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
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: 100%;
  display: flex;

  justify-content: center;
`;
export const TableHead2 = styled.div`
  border-left: 1px solid #dddddd;
  margin: 0;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
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

export const ModalOkButton = styled.button`
  display: inline-flex;
  padding: 0.6875rem 1.25rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 0.25rem;
  border: 1px solid #791285;
  color: #fff;

  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  background: #791285;
  :hover {
    cursor: pointer;
  }
`;

export const ModalReturnButton = styled.button`
  display: inline-flex;
  padding: 0.6875rem 1.25rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  color: #333;
  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  border-radius: 0.25rem;
  border: 1px solid #c8c8c8;
  background: #fff;
  margin-left: 1.25rem;
  :hover {
    cursor: pointer;
    filter: brightness(90%);
  }
`;

export const ModalButtonBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const ModalTag = styled.div`
  margin-bottom: 1.25rem;
`;

export const ModalWrapperTitle = styled.div`
  display: flex;
  align-items: center;
  color: #222;

  font-family: Spoqa Han Sans Neo;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
  margin-bottom: 1.25rem;
`;

export const ModalWrapper = styled.div`
  margin-top: 1.25rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export const ModalTitle = styled.div`
  color: #333;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
`;

export const ModalInput = styled.input`
  margin-top: 0.75rem;
  width: 16.625rem;
  height: 2.6875rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  /* padding: 0.6rem 1.2rem; */
  padding-left: 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  margin-left: 0.6rem;
`;

export const ModalSmall = styled.input`
  margin-top: 0.75rem;
  width: 10.25rem;
  height: 2.6875rem;
  padding-left: 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

export const ModalPhone = styled.input`
  width: 4.275rem;
  height: 2.6875rem;
  padding-left: 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  margin-left: 0.31rem;
`;

export const ModalLabel = styled.div`
  width: 4.205rem;
  height: 2.8775rem;
  padding-left: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  margin-left: 0.62rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-right: 0.32rem;
`;

export const ModalBorderLess = styled.input`
  border: none;
  outline: none;
  width: 2rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

export const ModalRadioButton = styled.input`
  accent-color: #791285;
  width: 1rem;
  height: 1rem;
  margin-bottom: 0rem;
  :checked {
    border: 0.4em solid #791285;
  }
`;

export const AcademyTh = styled.th`
  background: #791285;
  border: 1px solid #dfe1e5;
  color: #fff;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  padding: 0;
`;

export const AcademyTd = styled.td`
  background: #fff;
  border: 1px solid #dfe1e5;
  color: #333;

  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  padding: 2px 10px;
`;

export const AcademyIconButton = styled.button`
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 0.25rem;
  border: 1px solid #c8c8c8;
  background-color: #fff;
  cursor: pointer;
`;

export const AcademyPageNumber = styled.div`
  display: flex;
  padding: 0.3125rem 0.625rem;
  flex-direction: column;
  width: 1.875rem;
  height: 1.6375rem;
  cursor: pointer;
  vertical-align: middle;
  /* align-items: flex-start; */
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 700;
  padding: 0;
  padding-top: 0.3rem;
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
  cursor: pointer;
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
  cursor: pointer;
`;
