import styled from "@emotion/styled";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  margin-top: 10rem;
  padding: 0 8.4% 0 8.4%;
`;

export const Title = styled.div`
  color: #111;

  font-family: Spoqa Han Sans Neo;
  font-size: 3rem;
  font-style: normal;
  font-weight: 700;
`;

export const SubTitle = styled.div`
  font-size: 1.3rem;
  font-style: normal;
`;

export const DateTitle = styled.div`
  color: #333;

  font-family: Spoqa Han Sans Neo;
  font-size: 1.125rem;
  font-style: normal;
  font-weight: 700;
  margin-right: 2.5rem;
  width: 4.5rem;
`;

export const AddButton = styled.button`
  color: #333;
  width: 8rem;
  height: 2.6875rem;
  font-family: Spoqa Han Sans Neo;
  border-radius: 0.25rem;
  border: 1px solid #d9d9d9;
  cursor: pointer;
  background: #fff;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  background: #fff;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const SearchInput = styled.input`
  width: 15.625rem;
  height: 2.6875rem;
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  background: #fff;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  line-height: 130%;
  ::placeholder {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M14.1667 14.1667L17.5 17.5M2.5 9.16667C2.5 10.9348 3.20238 12.6305 4.45262 13.8807C5.70286 15.131 7.39856 15.8333 9.16667 15.8333C10.9348 15.8333 12.6305 15.131 13.8807 13.8807C15.131 12.6305 15.8333 10.9348 15.8333 9.16667C15.8333 7.39856 15.131 5.70286 13.8807 4.45262C12.6305 3.20238 10.9348 2.5 9.16667 2.5C7.39856 2.5 5.70286 3.20238 4.45262 4.45262C3.20238 5.70286 2.5 7.39856 2.5 9.16667Z' stroke='%2381858C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-size: contain;
    background-position: 0px center;
    background-repeat: no-repeat;
  }
`;

export const ConsultingTable = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 0.125rem;
  border: 0.2px solid #dbdde1;
  width: 90rem;
`;

export const ConsultingTh = styled.th`
  background: #791285;
  color: #fff;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  border: 0.2px solid #dfe1e5;
`;

export const ConsultingTd = styled.td`
  color: #333;

  text-align: center;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
  border: 0.2px solid #dfe1e5;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 22.81rem;
`;

export const EditButton = styled.button`
  border: none;
  background-color: #ffffff;
  color: #333;

  font-family: Noto Sans KR;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  cursor: pointer;
`;

export const AddConsultingTable = styled.table`
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 0.125rem;
  border: 0.2px solid #dbdde1;
  width: 38.1875rem;
  height: 32.6875rem;
`;

export const AddModalTitle = styled.div`
  color: #222;
  margin-left: 0.62rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
`;
