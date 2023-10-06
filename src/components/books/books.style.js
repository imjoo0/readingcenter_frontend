import styled from "@emotion/styled";

export const BooksWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 10rem;
  padding: 0 8.4% 0 8.4%;
`;

export const BooksTitle = styled.div`
  font-size: 34px;
  font-weight: 600;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  width: 88%;
  border: 1px solid #eeeeee;
  padding: 1%;
  background-color: #f8f9fa;
  margin-bottom: 4vh;
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
  width: 18vw;
  height: 25px;
  font-size: 16px;
  padding: 4px;
  border: 1px solid #dddddd;
  border-radius: 5px;
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
  font-size: 20px;
  font-weight: 500;
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
  width: 100px;
  height: 30px;

  background-color: green;
  border: none;
  color: #eeeeee;
  font-size: 16px;
  font-weight: 600;
  border-radius: 5px;
  margin-left: 50px;
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
