import styled from "@emotion/styled";

export const ClassWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 10rem;
  padding: 0 8.4% 0 8.4%;
`;

export const ClassTitle = styled.div`
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 3.5rem;
  margin-bottom: 2.5rem;
`;

export const ClassSearchBox = styled.div`
  width: 12%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.25rem;
  border: 1px solid #dddddd;
  border-radius: 5px;
`;

export const ClassSearchInput = styled.input`
  height: 2.75rem;
  font-size: 16px;
  padding: 0 1.25rem;
  border: none;
  /* border: 1px solid #dddddd;
  border-radius: 5px; */
  ::placeholder {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M14.1667 14.1667L17.5 17.5M2.5 9.16667C2.5 10.9348 3.20238 12.6305 4.45262 13.8807C5.70286 15.131 7.39856 15.8333 9.16667 15.8333C10.9348 15.8333 12.6305 15.131 13.8807 13.8807C15.131 12.6305 15.8333 10.9348 15.8333 9.16667C15.8333 7.39856 15.131 5.70286 13.8807 4.45262C12.6305 3.20238 10.9348 2.5 9.16667 2.5C7.39856 2.5 5.70286 3.20238 4.45262 4.45262C3.20238 5.70286 2.5 7.39856 2.5 9.16667Z' stroke='%2381858C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-size: contain;
    background-position: 0px center;
    background-repeat: no-repeat;
  }
`;

export const ClassTable = styled.div`
  width: 80%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

export const ClassHeaderLeft = styled.div`
  height: 30px;
  border: 1px solid #2e2e2e;
  display: flex;
  justify-content: center;
  align-items: center;
`;
export const ClassHeader = styled.div`
  height: 30px;
  border: 1px solid #2e2e2e;
  border-left: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ClassBodyLeft = styled.div`
  height: 30px;
  border: 1px solid #2e2e2e;
  border-top: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ClassBody = styled.div`
  height: 30px;
  border: 1px solid #2e2e2e;
  border-top: none;
  border-left: none;
  display: flex;
  justify-content: center;
  align-items: center;
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

export const AButton = styled.div`
  :hover {
    cursor: pointer;
  }
`;

export const ModalWrapper = styled.div`
  ::-webkit-scrollbar {
    display: none;
  }
`;
