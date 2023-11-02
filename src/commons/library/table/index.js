import { Modal } from "antd";
import { gql } from "@apollo/client";
import { useState } from "react";
import { dateToInput } from "../library";
import { useRouter } from "next/router";

const week = ["월", "화", "수", "목", "금", "토", "일"];

export const TableClassListBody = ({
  el,
  allStudent,
  teachers,
  editLectureInfo,
  refetchList,
  refetchStudentList,
  refetchMonth,
}) => {
  const [startTime, setStartTime] = useState(el.startTime);
  const [endTime, setEndTime] = useState(el.endTime);
  const [about, setAbout] = useState(el.lectureInfo.about);
  const [isAuto, setIsAuto] = useState(el.lectureInfo.autoAdd);
  const [autoDays, setAutoDays] = useState(el.lectureInfo.repeatDay);
  const [isEditStudent, setIsEditStudent] = useState(false);
  const [preList, setPreList] = useState([]);
  const [repeatWeeks, setRepeatWeeks] = useState(el.lectureInfo.repeatWeeks);
  const [date] = useState(new Date());
  const router = useRouter();
  const [studentIdList, setStudentIdList] = useState(
    el.students.map((ele) => ele.id)
  );
  const [isRepeat, setIsRepeat] = useState(
    el.lectureInfo.repeatDay.includes(-1) ? false : true
  );
  const [teacherId, setTeacherId] = useState(el.teacher.id);

  const onClickAddStudents = (id) => () => {
    const newList = [...studentIdList];
    if (studentIdList.includes(id)) {
      setStudentIdList(newList.filter((el) => el !== id));
    } else {
      newList.push(id);
      setStudentIdList(newList);
    }
  };

  const onClickEdit = async () => {
    console.log(
      Number(el.lectureInfo.id),
      dateToInput(date),
      about,
      autoDays,
      repeatWeeks,
      isAuto,
      studentIdList,
      startTime,
      endTime,
      Number(router.query.branch),
      Number(teacherId)
    );
    try {
      await editLectureInfo({
        variables: {
          lectureInfoId: Number(el.lectureInfo.id),
          date: dateToInput(date),
          about: about,
          repeatDays: isRepeat
            ? JSON.stringify({ repeat_days: autoDays })
            : JSON.stringify({ repeat_days: [-1] }),
          repeatWeeks: repeatWeeks,
          autoAdd: isAuto,
          studentIds: studentIdList,
          startTime: startTime,
          endTime: endTime,
          academyId: Number(router.query.branch),
          teacherId: Number(teacherId),
        },
      });
      await refetchList();
      await refetchStudentList();
      await refetchMonth();
    } catch (err) {}
  };

  return (
    <>
      <tr>
        <td>
          <input
            type="time"
            value={startTime}
            onChange={(e) => {
              setStartTime(e.target.value);
            }}
          ></input>{" "}
          {" - "}{" "}
          <input
            type="time"
            value={endTime}
            onChange={(e) => {
              setEndTime(e.target.value);
            }}
          ></input>
        </td>
        <td>
          <input
            value={about}
            onChange={(e) => {
              setAbout(e.target.value);
            }}
          ></input>
        </td>
        <td>
          <input
            type="checkbox"
            checked={isRepeat}
            onChange={() => {
              setIsRepeat(!isRepeat);
              if (isRepeat) {
                setAutoDays([]);
                setRepeatWeeks(1);
              }
            }}
            style={{ width: "20px", height: "20px" }}
          ></input>
        </td>
        <td>
          <input
            type="checkbox"
            checked={isAuto}
            onChange={() => {
              setIsAuto(!isAuto);
            }}
            style={{ width: "20px", height: "20px" }}
          ></input>
        </td>
        <td>
          <input
            type="number"
            style={{ width: "3.5rem" }}
            value={repeatWeeks}
            onChange={(e) => {
              setRepeatWeeks(e.target.value);
            }}
            disabled={!isRepeat}
          ></input>
        </td>
        <td>
          {week.map((el, index) => {
            return (
              <span
                style={{
                  padding: "0.2rem",
                  color: autoDays.includes(index) ? "#ffffff" : "",
                  backgroundColor: autoDays.includes(index) ? "#111111" : "",
                  border: "1px solid #aaaaaa",
                }}
                onClick={() => {
                  if (isRepeat) {
                    if (autoDays.includes(index)) {
                      setAutoDays(
                        autoDays.filter((ele) => {
                          return ele !== index;
                        })
                      );
                    } else {
                      const newDays = [...autoDays];
                      newDays.push(index);
                      setAutoDays(newDays);
                    }
                  }
                }}
              >
                {el}
              </span>
            );
          })}
        </td>
        <td>
          {studentIdList.length + "명 "}
          <button
            onClick={() => {
              setIsEditStudent(true);
              setPreList(studentIdList);
            }}
          >
            수정
          </button>
        </td>
        <td>
          <select
            value={teacherId}
            onChange={(e) => {
              setTeacherId(e.target.value);
            }}
          >
            {teachers?.map((el) => {
              return (
                <option value={el.profile.id}>{el.profile.korName}</option>
              );
            })}
          </select>
        </td>
        {/* <td></td> */}
        <td>
          <button onClick={onClickEdit}>수정</button>
        </td>
      </tr>

      {isEditStudent && (
        <Modal
          onCancel={() => {
            setIsEditStudent(false);
            setStudentIdList(preList);
          }}
          closable={false}
          footer={null}
          open={isEditStudent}
        >
          {allStudent?.map((el) => {
            return (
              <div style={{ display: "flex" }}>
                <div>{el.origin}</div>
                <div>{el.korName}</div>
                <input
                  type="checkbox"
                  style={{ width: "20px", height: "20px" }}
                  checked={studentIdList.includes(el.id)}
                  onClick={onClickAddStudents(el.id)}
                ></input>
              </div>
            );
          })}
          <button
            onClick={() => {
              setIsEditStudent(false);
              setStudentIdList(preList);
            }}
          >
            취소
          </button>
          <button
            onClick={() => {
              setIsEditStudent(false);
            }}
          >
            확인
          </button>
        </Modal>
      )}
    </>
  );
};
