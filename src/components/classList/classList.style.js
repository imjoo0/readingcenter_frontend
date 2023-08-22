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
