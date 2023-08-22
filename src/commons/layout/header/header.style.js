import styled from "@emotion/styled";


export const HeaderWrapper = styled.div`
	width: 83.2%;
	padding-left: 8.4%;
	padding-right: 8.4%;
	height: 5rem;
	border-bottom: 0.8px solid #dfe1e5 !important;
	display: flex;
	justify-content: space-between;
	background-color: #fff;
	position: fixed;
	top: 0;
`;

export const MenuDiv = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const logoHorizentalImage = styled.div`
	width: 15.6875rem;
	height: 2rem;
	flex-shrink: 0;
	background-image: url('/logo_horizental.svg');
	background-repeat: no-repeat;
`;

export const HeaderTag = styled.div`
	margin-left: 4%;
	height: 100%;
	width: 10rem;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #5f6268;
	font-size: 1rem;
	line-height: normal;
	:hover {
		cursor: pointer;
		color: #000;
	}
`;

export const HeaderText = styled.div`
	:hover {
		cursor: pointer;
	}
`;


export const logout = styled.button`
	font-size: 1rem;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
	background-color: transparent;
	border: 0;
	color: #5f6268;
	:hover {
		cursor: pointer;
		color: #000;
	}
`;