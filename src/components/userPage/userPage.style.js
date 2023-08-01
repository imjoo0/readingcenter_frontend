import styled from "@emotion/styled";

export const UserContainer = styled.div`
  width: 50vw;
  height: 15vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border: 1px solid #1e1e1e;
  border-radius: 10px;
  margin: 10px;
  padding: 10px;
`;

export const UserMain = styled.div`
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 15px;
`;

export const UserInfo = styled.div`
  font-size: 18px;
  font-weight: 500;
`;

export const InputTag = styled.div`
  width: 60vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SearchBox = styled.div`
  width: 88%;
  border: 1px solid #eeeeee;
  padding: 1%;
  background-color: #f8f9fa;
  margin-bottom: 4vh;
`;

export const SearchInput = styled.input`
  width: 75%;
  height: 25px;
  font-size: 16px;
  padding: 4px;
  border: 1px solid #dddddd;
  border-radius: 5px;
`;

export const LoginInputTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
`;
export const LoginSelect = styled.select`
  font-size: 20px;
  width: 13.5vw;
  border: 1px solid #e3e3e3;
  border-radius: 5px;
  font-weight: 600;
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

export const LinkButton = styled.div`
  :hover {
    cursor: pointer;
  }
`;

export const ModalCloseButton = styled.button`
  width: 8vw;
  height: 5vh;
  background-color: tomato;
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
  border-top: 1px solid #1e1e1e;
  border-left: 1px solid #1e1e1e;
  border-bottom: 1px solid #1e1e1e;
`;
export const ModalHeadMiddle = styled.div`
  display: flex;
  justify-content: center;
  height: 25px;
  font-size: 17px;
  font-weight: 600;
  border: 1px solid #1e1e1e;
`;

export const ModalHeadRight = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 25px;
  font-size: 17px;
  font-weight: 600;
  border-top: 1px solid #1e1e1e;
  border-right: 1px solid #1e1e1e;
  border-bottom: 1px solid #1e1e1e;
`;

export const ModalAddButton = styled.button`
  width: 60px;
  height: 20px;
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
