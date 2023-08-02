import styled from '@emotion/styled';
import { keyframes } from '@emotion/css';

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
	width: 50vw;
	height: 55vh;
	display: flex;
	align-items: center;
	border-radius: 20px;
	background-color: white;
	box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.2);
	${(props) =>
		props.active &&
		`
   animation: ${boxFade} 2s 1s infinite linear alternate;
  `}
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
  position: relative;
`;
export const logoImage = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 190px;
	height: 100px;
	background-image: url('/logo.svg');
	background-repeat: no-repeat;
`;

export const LoginTitle = styled.div`
  font-size: 27px;
  font-weight: 600;
  display: flex;
  justify-content: center;
`;

export const LoginLine = styled.div`
  width: 10vw;
  border-top: 3px solid purple;
`;
export const InputTag = styled.div`
  width: 15vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const LoginInputTitle = styled.div`
  font-size: 20px;
  font-weight: 600;
`;

export const LoginInput = styled.input`
  width: 8vw;
  font-size: 20px;
  height: 30px;
  border: 2px solid #e3e3e3;
  border-radius: 8px;
  
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
	&:hover {
		box-shadow: 200px 0 0 0 rgba(0, 0, 0, 0.15) inset,
			-200px 0 0 0 rgba(0, 0, 0, 0.15) inset;
		color: #fff;
	}
`;

