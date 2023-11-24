import styled from "@emotion/styled";
import React, { useRef, useEffect, useState } from "react";
import Tooltip from "../tooltip";

const BookTableTdMax = styled.span`
  /* display: flex; */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  background-color: #ffffff; /* 배경색 추가 */
  position: relative;
  max-width: 24rem;
  :hover {
    /* white-space: pre; /* 기본으로 돌아가게 함 */
    overflow: hidden;
    /* text-overflow: clip; */
    /* z-index: 2; */
  }
`;

const BookTableTdMaxDiv = styled.div`
  /* display: flex; */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  background-color: #ffffff; /* 배경색 추가 */
  position: relative;
  max-width: 24rem;
  :hover {
    /* white-space: pre; /* 기본으로 돌아가게 함 */
    overflow: hidden;
    /* text-overflow: clip; */
    /* z-index: 2; */
  }
`;

// const BookTableTdMax = styled.span`
//   display: flex; /* 가운데 정렬을 위해 flex 속성 추가 */
//   align-items: center; /* 수직 가운데 정렬 */
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   overflow: hidden;
//   background-color: #ffffff; /* 배경색 추가 */
//   position: relative;
//   height: 2rem;
//   :hover {
//     /* white-space: pre; /* 기본으로 돌아가게 함 */
//     overflow: hidden;
//     /* text-overflow: clip; */
//     /* z-index: 2; */
//   }
// `;

// const BookTableTdMaxDiv = styled.div`
//   /* display: flex; */
//   text-overflow: ellipsis;
//   white-space: nowrap;
//   overflow: hidden;
//   background-color: #ffffff; /* 배경색 추가 */
//   position: relative;
//   max-width: 24rem;
//   height: 2rem;
//   :hover {
//     /* white-space: pre; /* 기본으로 돌아가게 함 */
//     overflow: hidden;
//     /* text-overflow: clip; */
//     /* z-index: 2; */
//   }

const CheckToolTipClass = ({ text, number, korName }) => {
  const textRef = useRef(null);
  const [isOver, setIsOver] = useState(false);
  useEffect(() => {
    // textRef.current는 실제 DOM 요소를 가리킵니다.

    // getBoundingClientRect()을 사용하여 요소의 크기를 측정합니다.
    const { offsetWidth, height } = textRef?.current;
    if (offsetWidth > number) {
      setIsOver(true);
      console.log("bbbb");
    }
    console.log(textRef?.current?.offsetWidth, "aaaaaaa", isOver);
  }, []);

  return (
    <>
      {isOver ? (
        <Tooltip text={korName + text}>
          <BookTableTdMaxDiv style={{ maxWidth: number + "px" }} ref={textRef}>
            {text}
          </BookTableTdMaxDiv>
        </Tooltip>
      ) : (
        <BookTableTdMax style={{ maxWidth: number + "px" }} ref={textRef}>
          {text}
        </BookTableTdMax>
      )}
    </>
  );
};

export default CheckToolTipClass;
