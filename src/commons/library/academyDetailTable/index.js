import {
  ConsultingTableButton,
  ConsultingTd,
  ConsultingTdMaxWidth,
} from "@/src/components/academyDetail/academyDetail.style";
import { dateInputToDay, dateInputToDot } from "../library";

export const ConsultingTable = ({
  el,
  index,
  openEdit,
  openDelete,
  teacherData,
}) => {
  return (
    <>
      <tr>
        <ConsultingTd>{index + 1}</ConsultingTd>

        <ConsultingTdMaxWidth>{el?.title}</ConsultingTdMaxWidth>
        <ConsultingTdMaxWidth>{el?.contents}</ConsultingTdMaxWidth>
        <ConsultingTd>{el?.writer?.profile?.korName}</ConsultingTd>
        <ConsultingTd style={{ width: "9.5rem", padding: "0px" }}>
          {"20" +
            dateInputToDot(el?.createdAt) +
            " (" +
            dateInputToDay(el?.createdAt) +
            ")"}
        </ConsultingTd>

        <ConsultingTd style={{ padding: "0px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <ConsultingTableButton onClick={openEdit(el)}>
              <svg
                width="12"
                height="13"
                viewBox="0 0 12 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.8125 3.1875L10.5938 4.40625L8.09375 1.90625L9.3125 0.6875C9.4375 0.5625 9.59375 0.5 9.78125 0.5C9.96875 0.5 10.125 0.5625 10.25 0.6875L11.8125 2.25C11.9375 2.375 12 2.53125 12 2.71875C12 2.90625 11.9375 3.0625 11.8125 3.1875ZM0 10L7.375 2.625L9.875 5.125L2.5 12.5H0V10Z"
                  fill="#333333"
                />
              </svg>
            </ConsultingTableButton>
            <ConsultingTableButton onClick={openDelete(el.id, index)}>
              <svg
                width="10"
                height="13"
                viewBox="0 0 10 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.65625 1.15625V2.5H0.34375V1.15625H2.65625L3.34375 0.5H6.65625L7.34375 1.15625H9.65625ZM1 11.1562V3.15625H9V11.1562C9 11.5104 8.86458 11.8229 8.59375 12.0938C8.32292 12.3646 8.01042 12.5 7.65625 12.5H2.34375C1.98958 12.5 1.67708 12.3646 1.40625 12.0938C1.13542 11.8229 1 11.5104 1 11.1562Z"
                  fill="#333333"
                />
              </svg>
            </ConsultingTableButton>
          </div>
        </ConsultingTd>
      </tr>
    </>
  );
};
