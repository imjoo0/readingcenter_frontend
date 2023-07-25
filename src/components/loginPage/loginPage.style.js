import styled from "@emotion/styled";

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const LoginBox = styled.div`
  width: 50vw;
  height: 55vh;
  display: flex;
  align-items: center;
  border: 1px solid #e3e3e3;
  border-radius: 20px;
`;
export const LoginBoxRight = styled.div`
  width: 28vw;
  height: 55vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

export const LoginBoxLeft = styled.div`
  width: 22vw;
  height: 55vh;
  background-color: purple;
  border-radius: 20px 0 0 20px;
`;

export const LoginTitle = styled.div`
  font-size: 27px;
  font-weight: 600;
  display: flex;
  justify-content: center;
`;

export const LoginLine = styled.div`
  width: 2vw;
  border-top: 3px solid purple;
`;
export const InputTag = styled.div`
  width: 20vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LoginInputTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

export const LoginInput = styled.input`
  width: 13vw;
  font-size: 20px;
  border: 1px solid #e3e3e3;
  border-radius: 5px;
`;
export const LoginSelect = styled.select`
  font-size: 20px;
  width: 13.5vw;
  border: 1px solid #e3e3e3;
  border-radius: 5px;
  font-weight: 600;
`;
export const LoginOption = styled.option`
  font-size: 20px;
`;

export const LoginButton = styled.button`
  width: 12vw;
  height: 5vh;
  font-size: 20px;
  font-weight: 500;
  border: none;
  border-radius: 10px;
  background-color: purple;
  color: #fefefe;
`;
