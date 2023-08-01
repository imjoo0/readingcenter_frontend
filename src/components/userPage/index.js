import gql from "graphql-tag";
import * as S from "./userPage.style";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { accessTokenState, refreshTokenState } from "@/src/commons/stores";
import { Modal } from "antd";
import {
  GET_USER_PROFILE,
  GET_ALL_STUDENTS,
  ADD_ACADEMY,
} from "./userPage.query";

export default function AcademyListPage() {
  const { data } = useQuery(GET_USER_PROFILE);
  const { data: studentsData } = useQuery(GET_ALL_STUDENTS);
  const router = useRouter();
  const onClickAcademy = (id) => () => {
    router.push(`/${id}/class/`);
  };
  const [accessToken] = useRecoilState(accessTokenState);
  const [addStudents] = useMutation(ADD_ACADEMY);

  const [addToggle, setAddToggle] = useState(false);
  const [addAcademy, setAddAcademy] = useState({});
  const [addList, setAddList] = useState([]);

  const academiesOrAcademy =
    data?.me?.profile?.userCategory === "선생님"
      ? data?.me?.profile?.academy
      : data?.me?.profile?.academies;

  const onClickAddClass = (academy) => () => {
    setAddAcademy(academy);

    setAddToggle(true);
  };

  const onClickStudents = (id) => () => {
    const nId = Number(id);
    if (addList.includes(nId)) {
      const newList = [...addList];
      const filter = newList.filter((el) => {
        return el !== nId;
      });
      setAddList(filter);
    } else {
      const newList = [...addList];
      newList.push(nId);
      setAddList(newList);
    }
  };

  const onClickSubmit = async () => {
    // console.log(addList, addAcademy.id);
    try {
      const result = await addStudents({
        variables: { userIds: addList, academyId: Number(addAcademy.id) },
      });
      setAddToggle(false);
      setAddList([]);
      alert("등록 성공");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <S.UserContainer>
        <S.UserMain>유저 정보</S.UserMain>
        <S.UserInfo>{`직책 : ${data?.me?.userCategory}`}</S.UserInfo>
        <S.UserInfo>{`e-mail : ${data?.me?.email}`}</S.UserInfo>
        <S.UserInfo>{`ID : ${data?.me?.username}`}</S.UserInfo>
        <S.UserInfo>
          {"이름 : " +
            data?.me?.profile?.korName +
            "(" +
            data?.me?.profile?.engName +
            ")"}
        </S.UserInfo>
      </S.UserContainer>
      <S.Table>
        <S.TableHeaderRound>
          <S.TableHead style={{ width: "100%" }}>이름</S.TableHead>
          <S.TableHead style={{ width: "100%" }}>학원 위치</S.TableHead>

          <S.TableHeadRight style={{ width: "30%" }}>
            상세 관리
          </S.TableHeadRight>
        </S.TableHeaderRound>
        {academiesOrAcademy?.map((el) => {
          return (
            <S.TableRound key={uuidv4()}>
              <S.TableHeadLeft style={{ width: "100%" }}>
                {el.name}
              </S.TableHeadLeft>
              <S.TableHead style={{ width: "100%" }}>{el.location}</S.TableHead>

              <S.TableHeadRight style={{ width: "30%" }}>
                <S.LinkButton onClick={onClickAcademy(el.id)}>
                  링크
                </S.LinkButton>
              </S.TableHeadRight>
            </S.TableRound>
          );
        })}
      </S.Table>
      {addToggle ? (
        <Modal footer={null} closable={false} open={addToggle}>
          <S.ModalTable>
            <S.ModalTag>
              <S.ModalHeadLeft style={{ width: "30%" }}>원번</S.ModalHeadLeft>
              <S.ModalHeadMiddle style={{ width: "30%" }}>
                이름
              </S.ModalHeadMiddle>
              <S.ModalHeadRight style={{ width: "30%" }}>추가</S.ModalHeadRight>
            </S.ModalTag>
            {studentsData?.allStudents?.map((el) => {
              return (
                <S.ModalTag key={uuidv4()}>
                  <S.ModalHeadLeft style={{ width: "30%" }}>
                    {el.id}
                  </S.ModalHeadLeft>
                  <S.ModalHeadMiddle style={{ width: "30%" }}>
                    {el.profile.korName}
                  </S.ModalHeadMiddle>
                  <S.ModalHeadRight style={{ width: "30%" }}>
                    <input
                      type="checkbox"
                      onChange={onClickStudents(el.id)}
                      checked={addList.includes(Number(el.id))}
                    ></input>
                  </S.ModalHeadRight>
                </S.ModalTag>
              );
            })}
          </S.ModalTable>
          <S.ModalOkButton onClick={onClickSubmit}>추가</S.ModalOkButton>

          <S.ModalCloseButton
            onClick={() => {
              setAddToggle(false);
              setAddList([]);
            }}
          >
            취소
          </S.ModalCloseButton>
        </Modal>
      ) : (
        <></>
      )}
    </div>
  );
}
