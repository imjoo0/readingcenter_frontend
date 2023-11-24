import styled from "@emotion/styled";
import { keyframes } from "@emotion/css";

const boxFade = keyframes`
  0% {
      opacity: 0;
      transform: translate3d(0, 100%, 0);
  }
  to {
      opacity: 1;
      transform: translateZ(0);
  }
`;

export const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #c3c3c3;
`;

export const LoginBox = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  background-color: white;
`;
export const LoginBoxRight = styled.div`
  margin-left: 6.25rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

export const LoginBoxLeft = styled.div`
  width: 64vw;
  height: 100vh;
  background: #791285;
  position: relative;
`;
export const logoImage = styled.div`
  position: absolute;
  top: 44%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20.5rem;
  height: 9.1875rem;
  flex-shrink: 0;
  background-image: url("/logo.svg");
  background-repeat: no-repeat;
`;

export const LoginTitle = styled.div`
  color: #333;
  text-align: center;
  font-family: Spoqa Han Sans Neo;
  margin-bottom: 1.88rem;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
  line-height: 3rem; /* 120% */
  display: flex;
  justify-content: center;
`;

export const InputTag = styled.div``;

export const LoginInputTitle = styled.div`
  font-size: 20px;
  color: #111;

  font-family: Spoqa Han Sans Neo;
  font-size: 2.5rem;
  font-style: normal;
  font-weight: 700;
`;

export const LoginInput = styled.input`
  border-radius: 0.5rem;
  border: 1px solid #dfe1e5;
  width: 18rem;
  height: 2.6875rem;
  background-color: #fff;
  margin-bottom: 0.75rem;
  padding-left: 0.88rem;
  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 400;
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
  margin-top: 1.25rem;
  display: flex;
  width: 18rem;
  padding: 0.6875rem 1.5rem;
  justify-content: center;
  align-items: center;
  gap: 0.625rem;
  border-radius: 0.5rem;
  border: 1px solid #791285;
  color: #fff;

  font-family: Spoqa Han Sans Neo;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  :active {
    filter: brightness(70%);
  }
  background: #791285;
  :hover {
    cursor: pointer;
    transition: 0.3s;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.3);
  }
`;
