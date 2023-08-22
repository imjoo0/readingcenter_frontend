import styled from "@emotion/styled";

export const AcademyWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	margin-top: 10rem;
	padding: 0 8.4% 0 8.4%;
`;

export const AcademyTitle = styled.div`
	font-size: 2.5rem;
	font-style: normal;
	font-weight: 500;
	line-height: 3.5rem;
`;

export const AcademyTitleLine = styled.div`
  border-top: 2px solid;
  width: 100%;
  margin: 3vh 0;
`;

export const SearchBox = styled.div`
  margin-top: 2.5rem;
`;


export const SearchTag = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SearchInput = styled.input`
	width: 49.0625rem;
	flex-shrink: 0;
	border-radius: 0.5rem;
	border: 1px solid #dbdde1;
	font-size: 0.875rem;
	font-style: normal;
	font-weight: 400;
	padding: 0.81rem 0 0.81rem 1.25rem;
	::placeholder {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M14.1667 14.1667L17.5 17.5M2.5 9.16667C2.5 10.9348 3.20238 12.6305 4.45262 13.8807C5.70286 15.131 7.39856 15.8333 9.16667 15.8333C10.9348 15.8333 12.6305 15.131 13.8807 13.8807C15.131 12.6305 15.8333 10.9348 15.8333 9.16667C15.8333 7.39856 15.131 5.70286 13.8807 4.45262C12.6305 3.20238 10.9348 2.5 9.16667 2.5C7.39856 2.5 5.70286 3.20238 4.45262 4.45262C3.20238 5.70286 2.5 7.39856 2.5 9.16667Z' stroke='%2381858C' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-size: contain;
    background-position: 0px center;
    background-repeat: no-repeat;
  }
`;

export const SearchButton = styled.button`
	padding: 0.75rem 1.5rem;
  margin-left: 0.75rem;
	border-radius: 0.5rem;
	background: #333;
	font-size: 1rem;
	color: #eeeeee;
	font-weight: 500;
  border: 0;
	:hover {
		cursor: pointer;
	}
`;
export const RegistButton = styled.button`
	color: #333;
	font-family: Spoqa Han Sans Neo;
	font-size: 1rem;
	font-style: normal;
	font-weight: 500;
	margin-left: 0.75rem;
	display: inline-flex;
	padding: 0.75rem 1.5rem;
	justify-content: center;
	align-items: center;
	gap: 0.625rem;
	border-radius: 0.5rem;
	border: 0;
	background: #ebecef;
	:hover {
		cursor: pointer;
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

export const CountBox = styled.div`
	margin-top: 2.5rem;
	display: flex;
	width: 100%;
	justify-content: space-between;
  margin-bottom: 1rem;
`;

export const CountLeft = styled.div`
	display: flex;
	text-align: bottom;
	vertical-align: bottom;
`;
export const CountRight = styled.div`
	display: flex;
`;
export const ContinueOrRest = styled.div`
	width: 7.9375rem;
	padding: 0.75rem 0.75rem 0.75rem;
	flex-shrink: 0;
	border-radius: 0.5rem;
	border: 1px solid #dbdde1;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	text-align: center;
	vertical-align: center;
	display: flex;
	justify-content: space-between;
`;

export const Table = styled.div`
	width: 100%;
	padding: 0;
	display: flex;
	flex-direction: column;
	
`;

export const TableHeaderRound = styled.div`
	border-radius: 0.25rem 0.25rem 0rem 0rem;
	background: #f7f8fa;
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 2.75rem;
	border: 0.8px solid #dbdde1;
`;

export const TableRound = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 2.75rem;
	border: 0.8px solid #dbdde1;
`;

export const TableHeadLeft = styled.div`
  margin: 0;
  display: flex;
  flex-direction: row;
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
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: 100%;
  display: flex;

  justify-content: center;
`;
export const TableHead2 = styled.div`
  border-left: 1px solid #dddddd;
  margin: 0;
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
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

export const ModalOkButton = styled.button`
	color: #fff;
	font-size: 1rem;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
	border: none;
	padding: 0.75rem 1.5rem;
	justify-content: center;
	align-items: center;
	border-radius: 0.5rem;
	background: #333;
  margin-left: 0.75rem;
	:hover {
		cursor: pointer;
		filter: brightness(150%);
	}
`;

export const ModalReturnButton = styled.button`
	color: #333;
	font-size: 1rem;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
	border: none;
	padding: 0.75rem 1.5rem;
	justify-content: center;
	align-items: center;
	border-radius: 0.5rem;
	background: #ebecef;
	:hover {
		cursor: pointer;
		filter: brightness(90%);
	}
`;

export const ModalButtonBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const ModalTag = styled.div`
  width: 50%;
  margin-bottom: 1.25rem;
`;

export const ModalWrapperTitle = styled.div`
	font-size: 2.125rem;
	font-style: normal;
	font-weight: 500;
	line-height: 2.5rem;
  margin-bottom: 2rem;
`;

export const ModalWrapper = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
`;

export const ModalTitle = styled.div`
	color: #000;
	font-family: Spoqa Han Sans Neo;
	font-size: 0.875rem;
	font-style: normal;
	font-weight: 500;
	line-height: normal;
`;

export const ModalInput = styled.input`
  margin-top: 0.75rem;
	width: 76%;
	font-size: 0.875rem;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	padding: 0.6rem 1.2rem;
	border-radius: 0.5rem;
	border: 1px solid #dbdde1;
`;

export const ModalSmall = styled.input`
	margin-top: 0.75rem;
	width: 18%;
	font-size: 0.875rem;
	font-style: normal;
	font-weight: 400;
	line-height: normal;
	padding: 0.6rem 0.6rem;
	border-radius: 0.5rem;
	border: 1px solid #dbdde1;
`;
