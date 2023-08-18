import styled from "@emotion/styled";

export const AcademyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 20px;
  padding: 0px 30px 0px 30px;
`;

export const AcademyTitle = styled.div`
  font-size: 35px;
  font-weight: 600;
`;

export const AcademyTitleLine = styled.div`
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
  width: 45%;
  height: 25px;
  font-size: 16px;
  padding: 4px;
  border: 1px solid #dddddd;
  border-radius: 5px;
`;

export const SearchButton = styled.button`
  width: 120px;
  height: 40px;
  background-color: #1f1f1f;
  border: none;
  color: #eeeeee;
  font-size: 16px;
  :hover {
    cursor: pointer;
  }
`;

export const CountNumber = styled.div`
  font-size: 20px;
  font-weight: 500;
`;

export const CountBox = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
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
  width: 130px;
  height: 40px;
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

export const ModalReturnButton = styled.button`
  width: 130px;
  height: 40px;
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

export const ModalButtonBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
`;

export const ModalTag = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ModalWrapper = styled.div`
  display: flex;
  height: 480px;
  flex-direction: column;
  justify-content: space-around;
`;

export const ModalTitle = styled.div`
  font-size: 20px;
  font-weight: 700;
`;

export const ModalInput = styled.input`
  width: 250px;
  height: 25px;
  font-size: 18px;
  font-weight: 500;
`;

export const ModalSmall = styled.input`
  width: 60px;
  height: 25px;
  font-size: 18px;
  font-weight: 500;
`;
