import styled from "@emotion/styled";

export const LibraryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 10rem;
  padding: 0 8.4% 0 8.4%;
`;

export const UserNameTitle = styled.div`
  display: flex;
  align-items: center;
  color: #000;
  font-family: Spoqa Han Sans Neo;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 500;
  line-height: 3.5rem;
  margin-bottom: 2.5rem;
`;

export const IconWrapper = styled.div`
  padding-top: 0.5rem;
  :hover {
    cursor: pointer;
  }
`;

export const MiddleTitle = styled.div`
  color: #000000;
  font-family: Spoqa Han Sans Neo;
  font-size: 1.0625rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const RendInputBox = styled.div`
  display: flex;
  align-items: center;
`;

export const RendInput = styled.input`
  width: 49.0625rem;
  height: 2.75rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  border-radius: 0.5rem;
  border: 1px solid #dbdde1;
  margin-right: 0.75rem;
  padding-left: 1.25rem;
  ::placeholder {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M14.1667 14.1667L17.5 17.5M2.5 9.16667C2.5 10.9348 3.20238 12.6305 4.45262 13.8807C5.70286 15.131 7.39856 15.8333 9.16667 15.8333C10.9348 15.8333 12.6305 15.131 13.8807 13.8807C15.131 12.6305 15.8333 10.9348 15.8333 9.16667C15.8333 7.39856 15.131 5.70286 13.8807 4.45262C12.6305 3.20238 10.9348 2.5 9.16667 2.5C7.39856 2.5 5.70286 3.20238 4.45262 4.45262C3.20238 5.70286 2.5 7.39856 2.5 9.16667Z' stroke='%2381858C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-size: contain;
    background-position: 0px center;
    background-repeat: no-repeat;
  }
`;

export const RendButton = styled.button`
  width: 6.6875rem;
  height: 2.75rem;
  display: inline-flex;
  padding: 0.75rem 1.5rem;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background: #333;
  color: #ffffff;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

export const ReturnButton = styled.button`
  display: inline-flex;
  padding: 0.5rem 1rem;
  justify-content: center;
  align-items: center;
  border-radius: 0.5rem;
  background: #ebecef;
  color: #333;
  font-family: Spoqa Han Sans Neo;
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  border: none;
  :hover {
    cursor: pointer;
    filter: brightness(80%);
  }
`;
