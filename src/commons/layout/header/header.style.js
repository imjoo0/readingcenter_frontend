import styled from "@emotion/styled";

export const HeaderWrapper = styled.div`
	width: 100vw;
	height: 10vh;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	background-color: #3c3e44;
`;

export const HeaderTag = styled.div`
	//margin: 0 1vw;
	padding: 0 2vw;
	height: 100%;
	background-color: #3c3e44;
	color: #efefef;
	display: flex;
	justify-content: center;
	align-items: center;
	:hover {
		cursor: pointer;
		box-shadow: 200px 0 0 0 rgba(0, 0, 0, 0.15) inset,
			-200px 0 0 0 rgba(0, 0, 0, 0.15) inset;
	}
`;

export const HeaderText = styled.div`
	font-size: 20px;
	font-weight: 600;
	color: #efefef;

	:hover {
		cursor: pointer;
		box-shadow: 200px 0 0 0 rgba(0, 0, 0, 0.15) inset,
			-200px 0 0 0 rgba(0, 0, 0, 0.15) inset;
	}
`;


export const logout = styled.button`
	font-size: 20px;
  height: 40px;
	font-weight: 600;
	color: black;
  position: absolute;
  right: 50px;
	:hover {
		cursor: pointer;
		box-shadow: 200px 0 0 0 rgba(0, 0, 0, 0.15) inset,
			-200px 0 0 0 rgba(0, 0, 0, 0.15) inset;
	}
`;