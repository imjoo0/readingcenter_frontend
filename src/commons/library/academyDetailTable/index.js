export const ConsultingTable = ({ el, index, openEdit, openDelete }) => {
  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>{el?.student.origin}</td>
        <td>{el?.student.korName + "(" + el.student.engName + ")"}</td>
        <td>{el?.student.pmobileno}</td>
        <td>{el?.title}</td>
        <td>{el?.contents}</td>
        <td>{el?.createdAt}</td>
        <td>
          <button onClick={openEdit(el)}>수정</button>
          <button onClick={openDelete(el.id)}>삭제</button>
        </td>
      </tr>
    </>
  );
};
