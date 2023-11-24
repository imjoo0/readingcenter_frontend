import styled from "@emotion/styled";

const TooltipContainer = styled.div`
  position: relative;

  .tooltip {
    display: none;
    position: absolute;
    top: -2.5rem;
    left: -80%;
    /* transform: translateX(-50%); */
    background-color: #333;
    color: #fff;
    padding: 0.5rem;
    border-radius: 4px;
    white-space: nowrap;
    z-index: 2;
  }

  &:hover .tooltip {
    display: block;
  }
`;

const TooltipButton = ({ text, children, button }) => {
  return (
    <TooltipContainer>
      {children}
      <div className="tooltip">{text}</div>
    </TooltipContainer>
  );
};

export default TooltipButton;
