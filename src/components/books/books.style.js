import styled from "@emotion/styled";

export const BooksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10rem;
  /* padding: 0 8.4% 0 8.4%; */
`;

export const BooksTitle = styled.div`
  color: #111;
  margin-bottom: 2.5rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 3rem;
  font-style: normal;
  font-weight: 700;
`;
export const BooksModalTitle = styled.div`
  font-size: 34px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
  :hover {
    cursor: pointer;
  }
`;

export const BooksTitleLine = styled.div`
  border-top: 2px solid;
  width: 100%;
  margin: 3vh 0;
`;

export const SearchBox = styled.div`
  /* width: 88.874rem; */
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eeeeee;
  padding: 2.5rem 15rem;
  background-color: #f4f4f8;
  margin-bottom: 5rem;
`;

export const SearchTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 1vh;
`;

export const SearchTag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SearchInput = styled.input`
  margin-left: 9px;
  width: 18.5vw;
  height: 25px;
  font-size: 16px;
  padding: 4px;
  border: 1px solid #dddddd;
  border-radius: 5px;
  ::placeholder {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M14.1667 14.1667L17.5 17.5M2.5 9.16667C2.5 10.9348 3.20238 12.6305 4.45262 13.8807C5.70286 15.131 7.39856 15.8333 9.16667 15.8333C10.9348 15.8333 12.6305 15.131 13.8807 13.8807C15.131 12.6305 15.8333 10.9348 15.8333 9.16667C15.8333 7.39856 15.131 5.70286 13.8807 4.45262C12.6305 3.20238 10.9348 2.5 9.16667 2.5C7.39856 2.5 5.70286 3.20238 4.45262 4.45262C3.20238 5.70286 2.5 7.39856 2.5 9.16667Z' stroke='%2381858C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-size: contain;
    background-position: 0px center;
    background-repeat: no-repeat;
  }
`;

export const SearchButton = styled.button`
  width: 5vw;
  height: 4vh;
  background-color: #1f1f1f;
  border: none;
  color: #eeeeee;
  font-size: 16px;
  :hover {
    cursor: pointer;
  }
`;

export const SearchSelect = styled.select`
  width: 10vw;
  height: 4vh;
  border: 1px solid #dddddd;
  border-radius: 5px;
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

export const CountNumber = styled.div`
  color: #333;

  font-family: Spoqa Han Sans Neo;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
`;

export const ModalTextArea = styled.textarea`
  width: 50%;
  height: 150px;
  border: 1px solid #dddddd;
`;

export const ModalButtonBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
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
  width: 78px;
  height: 44px;
  background-color: #333333;
  border: none;
  color: #ffffff;
  font-size: 16px;
  border-radius: 8px;
  font-family: Spoqa Han Sans Neo;
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

export const InputSelect = styled.select`
  width: 16.875rem;
  height: 2.8875rem;
  color: #333;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  padding-left: 0.6rem;
  background: #fff;
  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

export const TimeBox = styled.div`
  width: 51%;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  width: 90%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-bottom: 1px solid #dbdde1;
`;
export const ModalAddButton = styled.button`
  width: 6rem;
  height: 2.6875rem;
  color: #fff;
  padding: 0;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  border-radius: 0.25rem;
  background: #333;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    cursor: pointer;
    filter: brightness(120%);
  }
`;

export const EditTitleFont = styled.div`
  width: 145px;
  height: 44px;
  font-weight: 500;
  font-size: 14px;
  font-family: Spoqa Han Sans Neo;
  background-color: #f7f8fa;
  display: flex;
  align-items: center;
  padding-left: 20px;
`;

export const EditTagFont = styled.div`
  font-weight: 400;
  font-size: 14px;
  font-family: Spoqa Han Sans Neo;
  display: flex;
  align-items: center;
  padding-left: 20px;
`;

export const BookTagSmallInput = styled.input`
  width: 5.85rem;
  height: 2.6875rem;
  border-radius: 0.25rem;
  border: 1px solid #d9d9d9;
  padding: 0;
  padding-left: 0.6rem;
  margin-left: 1.25rem;
  margin-right: 1.25rem;
`;

export const BookTagBigInput = styled.input`
  width: 16.275rem;
  height: 2.6875rem;
  border-radius: 0.25rem;
  border: 1px solid #d9d9d9;
  margin-left: 1.25rem;
  margin-right: 1.25rem;
  color: #333;
  padding-left: 0.6rem;
  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
`;

export const BookTableTdMax = styled.div`
  /* display: flex; */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  background-color: #ffffff; /* 배경색 추가 */
  position: relative;
  :hover {
    /* white-space: pre; /* 기본으로 돌아가게 함 */
    overflow: hidden;
    /* text-overflow: clip; */
    z-index: 2;
  }
`;

export const BookTableTh = styled.th`
  background: #791285;
  border: 1px solid #dfe1e5;
  color: #fff;
  padding: 0.31rem 0;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
`;

export const BookTableTd = styled.td`
  background: #fff;
  border: 1px solid #dfe1e5;
  padding: 0.13rem 10px;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  height: 2rem;
  position: relative;
`;
