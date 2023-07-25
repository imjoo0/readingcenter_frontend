import styled from "@emotion/styled";

export const HeaderWrapper = styled.div`
  width: 100vw;
  height: 10vh;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #1e1e1e;
`;

export const HeaderTag = styled.div`
  margin: 0 1vw;
  padding: 1vh 0.5vw;
  font-size: 20px;
  font-weight: 600;
  background-color: #1e1e1e;
  color: #efefef;
  border-radius: 5px;
  :hover {
    cursor: pointer;
  }
`;
