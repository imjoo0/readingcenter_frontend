import styled from '@emotion/styled';

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

export const ClassTitleLine = styled.div`
	border-top: 2px solid;
	width: 100%;
	margin: 3vh 0;
`;

export const SwitchDiv = styled.div`
	border-radius: 0.5rem;
	border: 1px solid #dbdde1;
  padding: 0.75rem 1.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
  margin-left: 0.75rem;
`;

export const SwitchFont = styled.div`
	font-size: 1rem;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
`;

export const ClassTopMenu = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
`;

export const ClassDate = styled.div`
	border: none;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	color: #000;
	padding: 0 0.81rem;
	text-align: center;
	font-family: Spoqa Han Sans Neo;
	font-size: 1.0625rem;
	font-style: normal;
	font-weight: 500; /* 117.647% */
	:hover {
		cursor: pointer;
	}
`;
export const DateBox = styled.div`
	border-radius: 0.2rem;
	border: 1px solid #dbdde1;
	display: flex;
	justify-content: center;
	vertical-align: center;
`;

export const DateMoveButton = styled.button`
	border: none;
	background-color: white;
	padding: 0.75rem 1.25rem;
	:hover {
		cursor: pointer;
		filter: brightness(120%);
	}
`;

export const ClassMiddleBox = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 17px 0;
`;

export const ClassMiddleTag = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const ClassButton = styled.button`
	font-size: 1rem;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
	border-radius: 0.5rem;
	background: #ebecef;
  border: 0;
  padding: 0.75rem 1.5rem;
  margin-left: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: center;
	:hover {
		cursor: pointer;
		filter: brightness(80%);
	}
`;

export const CountNumber = styled.div`
	font-size: 1.0625rem;
	font-style: normal;
	font-weight: 500;
	height: 100%;
	vertical-align: bottom;
	text-align: center;
	padding-top: 1.6rem;
`;

export const ClassInput = styled.input`
	width: 14.3125rem;
	height: 2.75rem;
	font-size: 16px;
	padding: 0 1.25rem;
	border: 1px solid #dddddd;
	border-radius: 5px;
	::placeholder {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M14.1667 14.1667L17.5 17.5M2.5 9.16667C2.5 10.9348 3.20238 12.6305 4.45262 13.8807C5.70286 15.131 7.39856 15.8333 9.16667 15.8333C10.9348 15.8333 12.6305 15.131 13.8807 13.8807C15.131 12.6305 15.8333 10.9348 15.8333 9.16667C15.8333 7.39856 15.131 5.70286 13.8807 4.45262C12.6305 3.20238 10.9348 2.5 9.16667 2.5C7.39856 2.5 5.70286 3.20238 4.45262 4.45262C3.20238 5.70286 2.5 7.39856 2.5 9.16667Z' stroke='%2381858C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
		background-size: contain;
		background-position: 0px center;
		background-repeat: no-repeat;
	}
`;

export const ClassSmallGreenButton = styled.div`
	width: 5.625rem;
	height: 2.75rem;
	flex-shrink: 0;
	border-radius: 1.375rem;
	border: 1px solid #dbdde1;
	background: #f7f8fa;
	display: flex;
	font-size: 1rem;
	font-weight: 500;
	vertical-align: center;
	align-items: center;
	justify-content: center;
	:hover {
		cursor: pointer;
		filter: brightness(80%);
	}
`;
export const ClassSmallBlueButton = styled.button`
	width: 5.625rem;
	height: 2.75rem;
	flex-shrink: 0;
	border-radius: 1.375rem;
	border: 1px solid #dbdde1;
	background: #f7f8fa;
	display: flex;
	font-size: 1rem;
	font-weight: 500;
	vertical-align: center;
	align-items: center;
	justify-content: center;
	:hover {
		cursor: pointer;
		filter: brightness(80%);
	}
`;
export const ClassSmallRedButton = styled.button`
	width: 5.625rem;
	height: 2.75rem;
	flex-shrink: 0;
	border-radius: 1.375rem;
	border: 1px solid #dbdde1;
	background: #f7f8fa;
	display: flex;
	font-size: 1rem;
	font-weight: 500;
	vertical-align: center;
	align-items: center;
	justify-content: center;
	:hover {
		cursor: pointer;
		filter: brightness(80%);
	}
`;
export const ClassSmallBlackButton = styled.button`
	width: 5.625rem;
	height: 2.75rem;
	flex-shrink: 0;
	border-radius: 1.375rem;
	border: 1px solid #dbdde1;
	background: #f7f8fa;
	display: flex;
	font-size: 1rem;
	font-weight: 500;
	vertical-align: center;
	align-items: center;
	justify-content: center;
	:hover {
		cursor: pointer;
		filter: brightness(80%);
	}
`;
export const ClassSmallTimeInput = styled.input`
	border-radius: 0.5rem;
	border: 1px solid #dbdde1;
	margin-left: 0.75rem;
	padding: 0.56rem 1rem 0.56rem 1rem;
`;
export const ClassSmallTimeBtn = styled.button`
	border-radius: 0.5rem;
	border: 1px solid #dbdde1;
	margin-left: 0.25rem;
	padding: 0.56rem 1.25rem 0.56rem 1.5rem;
  background-color: #fff;
`;

export const Table = styled.div`
	width: 100%;
	padding: 0;
	display: flex;
	flex-direction: column;
`;

export const TableHeaderRound = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 3vh;
	border-top: 2px solid #1f1f1f;
	border-bottom: 2px solid #1f1f1f;
`;

export const TableRound = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 4vh;

	border-bottom: 1px solid #dddddd;
`;

export const TableHeadLeft = styled.div`
	margin: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
`;

export const TableHead = styled.div`
	border-left: 1px solid #dddddd;
	margin: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
`;

export const TableHeadRight = styled.div`
	margin: 0;
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: space-evenly;
	border-left: 1px solid #dddddd;
`;

export const PageContainer = styled.div`
	width: 100%;
	margin-top: 20px;
	display: flex;
	justify-content: flex-end;
	align-items: center;
`;

export const PageBox = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 2vw;
	height: 3vh;
	border: 1px solid #dddddd;
`;

export const ModalWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	align-items: flex-start;
	position: relative;
`;

export const ModalRadioBox = styled.div`
	display: flex;
	justify-content: flex-start;
	align-items: center;
  margin-top: 1.38rem;
`;

export const ModalInputBox = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin: 10px 0;
`;

export const TimeBox = styled.div`
	width: 51%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const ModalTextArea = styled.textarea`
	width: 50%;
	height: 150px;
	border: 1px solid #dddddd;
`;

export const ModalTitle = styled.div`
	width: 100%;
	font-size: 2.125rem;
	font-style: normal;
	font-weight: 500;
	line-height: 2.5rem;
  margin-top: 1rem;
`;

export const ModalButtonBox = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	align-items: center;
  margin-bottom: 1rem;
`;

export const ModalReturnButton = styled.button`
	padding: 0.75rem 1.5rem;
	border-radius: 0.5rem;
	background: #ebecef;
	border: 0;
	color: #333;
	font-size: 1rem;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
	:hover {
		cursor: pointer;
		filter: brightness(180%);
	}
`;

export const ModalOkButton = styled.button`
	border-radius: 0.5rem;
	background: #333;
	color: #eeeeee;
	margin-left: 20px;
	border: 0;
	font-size: 1rem;
	font-style: normal;
	font-weight: 500;
	padding: 0.75rem 1.5rem;
	:hover {
		cursor: pointer;
		filter: brightness(120%);
	}
`;

export const ModalCancelButton = styled.button`
	padding: 0.75rem 1.5rem;
	border-radius: 0.5rem;
	background: #333;
	border: 0;
	color: #FFF;
	font-size: 1rem;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
  margin-left: 0.75rem;
	:hover {
		cursor: pointer;
		filter: brightness(80%);
	}
`;

export const ModalClassAddWrapper=styled.div`
  padding:0;
  display: flex;
  justify-content:space-between
`;

export const InputInput = styled.input`
	width: 10vw;
	font-size: 16px;
	padding: 4px;
	border: 1px solid #dddddd;
	border-radius: 5px;
`;

export const AlarmButton = styled.button`
	width: 8vw;
	height: 5vh;
	background-color: purple;
	border: none;
	color: #eeeeee;
	font-size: 16px;
	border-radius: 10px;
	font-weight: 600;
	:hover {
		cursor: pointer;
	}
`;

export const ModalRoutineInput = styled.div`
	width: 100%;
`;

export const ModalRoutineDates = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 0.75rem;
	width: 100%;
	border-radius: 0.5rem;
	border: 1px solid #dbdde1;
`;

export const ModalRoutineDate = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 14%;
	height: 2.75rem;
`;

export const AlarmDiv = styled.div`
	font-size: 18px;
	font-weight: 600;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const ModalTable = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	width: 100%;
	margin-bottom: 15px;
	::-webkit-scrollbar {
		display: none;
	}
`;

export const ModalTag = styled.div`
	display: flex;
	justify-content: flex-start;
	width: 100%;
	font-weight: bold;
	font-size: large;
  margin-top: 2rem;
`;

export const ModalHeadLeft = styled.div`
	display: flex;
	justify-content: center;
	height: 25px;
	font-size: 17px;
	font-weight: 600;
	border: 0.5px solid #dbdde1;
`;
export const ModalHeadMiddle = styled.div`
	display: flex;
	justify-content: center;
	height: 25px;
	font-size: 17px;
	font-weight: 600;
	border-bottom: 0.5px solid #dbdde1;
	border-top: 0.5px solid #dbdde1;
	border-right: 0.5px solid #dbdde1;
`;

export const ModalHeadRight = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 25px;
	font-size: 17px;
	font-weight: 600;
	border: 0.5px solid #dbdde1;
	border-left: none;
`;

export const ModalAddButton = styled.button`
	width: 100px;
	height: 30px;
	position: absolute;
	right: 30px;
	bottom: 20px;
	background-color: green;
	border: none;
	color: #eeeeee;
	font-size: 16px;
	font-weight: 600;
	border-radius: 5px;
	:hover {
		cursor: pointer;
		filter: brightness(120%);
	}
`;

export const BookTable = styled.div`
	display: flex;
	width: 80%;
	font-size: 24px;
`;

export const BookHead = styled.div`
	border: 1px solid #eeeeee;
`;

export const ModalIcon = styled.button`
	.hover {
		cursor: pointer;
	}
`;
export const SearchSelect = styled.select`
	width: 10vw;
	height: 4vh;
	border: 1px solid #dddddd;
	border-radius: 5px;
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

export const lectureInfo = styled.div`
	:hover {
		cursor: pointer;
	}
`;

export const lectureModalInfo = styled.div`
	font-size: 24px;
	font-weight: 600;
`;
