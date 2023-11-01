import { useRouter } from "next/router";
import * as S from "./academy.style";
import {
  SearchOutlined,
  FormOutlined,
  UpOutlined,
  DownOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery } from "@apollo/client";
import { dateChange, dateToInput } from "@/src/commons/library/library";
import {
  CREATE_ACADEMY_TO_USER,
  CREATE_STUDENT_PROFILE,
  CREATE_USER,
  GET_ME,
  GET_STUDENTS,
  STOP_ACADEMY,
} from "./academy.query";
import { Modal, Switch } from "antd";

const addressList = ["gmail.com", "naver.com", "daum.net"];

export default function AcademyPage() {
  const router = useRouter();
  const { data, refetch } = useQuery(GET_STUDENTS, {
    variables: { academyId: Number(router.query.branch) },
  });

  const [array, setArray] = useState(data?.studentsInAcademy);
  const [searchWord, setSearchWord] = useState("");
  const [addToggle, setAddToggle] = useState(false);
  const [date] = useState(new Date());
  const [addId, setAddId] = useState("");
  const [addKorName, setAddKorName] = useState("");
  const [addEmail1, setAddEmail1] = useState("");
  const [addEmail2, setAddEmail2] = useState("gmail.com");
  const [isTyped, setIsTyped] = useState(false);
  const [password, setPassword] = useState("");
  const [addEngName, setAddEngName] = useState("");
  const [addGender, setAddGender] = useState("M");
  const [addMobileNumber1, setAddMobileNumber1] = useState("010");
  const [addMobileNumber2, setAddMobileNumber2] = useState("");
  const [addMobileNumber3, setAddMobileNumber3] = useState("");
  const [addPMobileNumber1, setAddPMobileNumber1] = useState("010");
  const [addPMobileNumber2, setAddPMobileNumber2] = useState("");
  const [addPMobileNumber3, setAddPMobileNumber3] = useState("");
  const [addBirthDay, setAddBirthDay] = useState(dateToInput(date));
  const [addRegisterDay, setAddRegisterDay] = useState(dateToInput(date));
  const [addOrigin, setAddOrigin] = useState("");
  const [sortType, setSortType] = useState("name");
  const [createUser] = useMutation(CREATE_USER);
  const [createProfile] = useMutation(CREATE_STUDENT_PROFILE);
  const [addUserToAcademy] = useMutation(CREATE_ACADEMY_TO_USER);
  const [stopAcademy] = useMutation(STOP_ACADEMY);
  const mobileNumber2 = useRef();
  const mobileNumber3 = useRef();
  const pMobileNumber2 = useRef();
  const pMobileNumber3 = useRef();
  const [selectId, setSelectId] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [isStop, setIsStop] = useState(false);
  const [branches, setBranches] = useState([]);
  const { data: myData } = useQuery(GET_ME);

  const onChangeSearchWord = (event) => {
    setSearchWord(event.target.value);
  };
  const onClickSearch = () => {
    if (Array.isArray(data?.studentsInAcademy)) {
    }
    const newArray = [...data?.studentsInAcademy];
    setArray(
      newArray.filter((el) => {
        return (
          el.korName.includes(searchWord) || el.origin.includes(searchWord)
        );
      })
    );
  };
  const onKeyPress = (event) => {
    if (event.key === "Enter") {
      onClickSearch();
    }
  };

  const onClickSort = (status) => () => {
    setSortType(status);
  };

  const onClickCheck = (id, active) => () => {
    setSelectId({ id: id, active: active });
    setIsCheck(true);
  };

  const onClickAddBranchList = (id) => () => {
    const newBranches = [...branches];
    if (branches.includes(id)) {
      setBranches(
        newBranches.filter((el) => {
          return el !== id;
        })
      );
    } else {
      newBranches.push(id);
      setBranches(newBranches);
    }
  };

  const onClickStop = async () => {
    try {
      await stopAcademy({ variables: { userId: Number(selectId.id) } });
      if (!isStop) {
        alert("휴원 처리 완료했습니다.");
      } else {
        alert("재원 처리 완료했습니다.");
      }
    } catch {
      alert("실패");
    }
    setIsCheck(false);
    refetch();
  };

  const onClickAddStudent = async () => {
    if (
      addKorName === "" ||
      password === "" ||
      addPMobileNumber2 === "" ||
      addPMobileNumber3 === "" ||
      addPMobileNumber3 === "" ||
      addBirthDay === "" ||
      addId === "" ||
      (branches.length === 0 && myData?.me?.profile?.academies?.length > 0)
    ) {
      alert("필수 입력을 모두 완료해 주십시오.");
      return;
    }
    try {
      const result1 = await createUser({
        variables: {
          username: addId,
          email: addEmail1 + "@" + addEmail2,
          password: password,
          userCategory: "학생",
        },
      });
      try {
        const result2 = await createProfile({
          variables: {
            userId: Number(result1?.data?.createUser?.user?.id),
            korName: addKorName,
            engName: addEngName,
            gender: addGender,
            mobileno:
              addMobileNumber1 === "" ||
              addMobileNumber2 === "" ||
              addMobileNumber3 === ""
                ? addPMobileNumber1 +
                  "-" +
                  addPMobileNumber2 +
                  "-" +
                  addPMobileNumber3
                : addPMobileNumber1 +
                  "-" +
                  addPMobileNumber2 +
                  "-" +
                  addPMobileNumber3,
            pmobileno:
              addPMobileNumber1 +
              "-" +
              addPMobileNumber2 +
              "-" +
              addPMobileNumber3,
            birthDate: addBirthDay,
            registerDate: addBirthDay,
            origin: addId,
          },
        });
        if (myData?.me?.profile?.academies?.length > 0) {
          branches.forEach(async (el) => {
            try {
              await addUserToAcademy({
                variables: {
                  userIds: [Number(result1?.data?.createUser?.user?.id)],
                  academyId: Number(el),
                },
              });
            } catch {}
          });
        } else {
          try {
            await addUserToAcademy({
              variables: {
                userIds: [Number(result1?.data?.createUser?.user?.id)],
                academyId: Number(router.query.branch),
              },
            });
            refetch();
          } catch {}
        }
      } catch {
        alert("유저 정보 수정 오류");
      }
    } catch {
      alert("유저 생성 오류");
    }
    refetch();
    setAddKorName("");
    setAddEmail1("");
    setAddEmail2("gmail.com");
    setPassword("");
    setAddEngName("");
    setAddGender("M");
    setAddMobileNumber1("");
    setAddMobileNumber2("");
    setAddMobileNumber3("");
    setAddPMobileNumber1("");
    setAddPMobileNumber2("");
    setAddPMobileNumber3("");
    setAddBirthDay(dateToInput(date));
    setAddRegisterDay(dateToInput(date));
    setAddOrigin("");
    setAddToggle(false);
  };

  useEffect(() => {
    if (isStop) {
      setArray(
        data?.studentsInAcademy
          ?.filter((el) => {
            return !el.user.isActive;
          })
          ?.sort((a, b) => {
            return a.korName.localeCompare(b.korName, "kr-KR");
          })
      );
    } else {
      setArray(
        data?.studentsInAcademy
          ?.filter((el) => {
            return el.user.isActive;
          })
          ?.sort((a, b) => {
            return a.korName.localeCompare(b.korName, "kr-KR");
          })
      );
    }
  }, [data, isStop]);

  useEffect(() => {
    if (data !== undefined) {
      const newArray = [
        ...data?.studentsInAcademy?.filter((el) => {
          return el.user.isActive;
        }),
      ];
      if (sortType === "origin") {
        setArray(
          newArray?.sort((a, b) => {
            return (
              parseInt(a.origin.replace(/[^0-9]/g, "")) -
              parseInt(b.origin.replace(/[^0-9]/g, ""))
            );
          })
        );
      }
      // git test
      if (sortType === "originReverse") {
        setArray(
          newArray?.sort((a, b) => {
            return (
              parseInt(b.origin.replace(/[^0-9]/g, "")) -
              parseInt(a.origin.replace(/[^0-9]/g, ""))
            );
          })
        );
      }
      if (sortType === "name") {
        setArray(
          newArray?.sort((a, b) => {
            return a.korName.localeCompare(b.korName, "kr-KR");
          })
        );
      }
      if (sortType === "nameReverse") {
        setArray(
          newArray?.sort((a, b) => {
            return b.korName.localeCompare(a.korName, "kr-KR");
          })
        );
      }
      if (sortType === "register") {
        setArray(
          newArray?.sort((a, b) => {
            const dateA = new Date(a.registerDate);
            const dateB = new Date(b.registerDate);
            return dateA - dateB;
          })
        );
      }
      if (sortType === "registerReverse") {
        setArray(
          newArray?.sort((a, b) => {
            const dateA = new Date(a.registerDate);
            const dateB = new Date(b.registerDate);
            return dateB - dateA;
          })
        );
      }
      if (sortType === "birthDate") {
        setArray(
          newArray?.sort((a, b) => {
            const dateA = new Date(a.birthDate);
            const dateB = new Date(b.birthDate);
            return dateA - dateB;
          })
        );
      }
      if (sortType === "birthDateReverse") {
        setArray(
          newArray?.sort((a, b) => {
            const dateA = new Date(a.birthDate);
            const dateB = new Date(b.birthDate);
            return dateB - dateA;
          })
        );
      }
    }
  }, [sortType]);

  const onChangeAcademy = (e) => {
    router.push("/" + e.target.value + "/academy");
  };
  return (
    <>
      <S.AcademyWrapper>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          {myData?.me?.profile?.academies?.length > 0 ? (
            <select
              onChange={onChangeAcademy}
              style={{
                width: "200px",
                height: "30px",
                fontSize: "14px",
                border: "1px solid #DBDDE1",
                borderRadius: "8px",
                fontFamily: "Spoqa Han Sans Neo",
                paddingLeft: "10px",
              }}
            >
              {myData?.me?.profile?.academies?.map((el) => {
                return (
                  <option
                    value={Number(el.id)}
                    selected={Number(router.query.branch) === Number(el.id)}
                  >
                    {el.location}
                  </option>
                );
              })}
            </select>
          ) : (
            <></>
          )}
        </div>
        <S.AcademyTitle>원생 관리</S.AcademyTitle>
        <S.SearchBox>
          <S.SearchTag>
            <S.SearchInput
              type="text"
              placeholder="       원번 혹은 이름을 입력하세요."
              onChange={onChangeSearchWord}
              onKeyPress={onKeyPress}
            />
            <S.SearchButton onClick={onClickSearch}>검색</S.SearchButton>
          </S.SearchTag>
        </S.SearchBox>
        <S.CountBox>
          <S.CountLeft>
            <S.CountNumber>{"전체 " + array?.length + "명"}</S.CountNumber>
          </S.CountLeft>
          <S.CountRight>
            <S.ContinueOrRest>
              휴원 / 재원
              <Switch
                defaultChecked={true}
                onChange={(checked) => {
                  setIsStop(!checked);
                }}
              ></Switch>
            </S.ContinueOrRest>
            <S.RegistButton
              onClick={() => {
                setAddToggle(true);
              }}
            >
              원생 등록
            </S.RegistButton>
          </S.CountRight>
        </S.CountBox>

        <S.Table>
          <S.TableHeaderRound>
            <S.TableHeadLeft style={{ width: "40%" }}>
              원번
              {sortType !== "origin" || sortType === "" ? (
                <DownOutlined
                  style={{ marginLeft: "5px" }}
                  onClick={onClickSort("origin")}
                ></DownOutlined>
              ) : (
                <UpOutlined
                  style={{ marginLeft: "5px" }}
                  onClick={onClickSort("originReverse")}
                />
              )}
            </S.TableHeadLeft>
            <S.TableHead style={{ width: "45%" }}>
              원생명
              {sortType !== "name" || sortType === "" ? (
                <DownOutlined
                  style={{ marginLeft: "5px" }}
                  onClick={onClickSort("name")}
                ></DownOutlined>
              ) : (
                <UpOutlined
                  style={{ marginLeft: "5px" }}
                  onClick={onClickSort("nameReverse")}
                />
              )}
            </S.TableHead>
            <S.TableHead style={{ width: "40%" }}>
              생년월일{" "}
              {sortType !== "birthDate" || sortType === "" ? (
                <DownOutlined
                  style={{ marginLeft: "5px" }}
                  onClick={onClickSort("birthDate")}
                ></DownOutlined>
              ) : (
                <UpOutlined
                  style={{ marginLeft: "5px" }}
                  onClick={onClickSort("birthDateReverse")}
                />
              )}
            </S.TableHead>
            <S.TableHead style={{ width: "30%" }}>성별</S.TableHead>
            <S.TableHead style={{ width: "50%" }}>
              등록일{" "}
              {sortType !== "register" || sortType === "" ? (
                <DownOutlined
                  style={{ marginLeft: "5px" }}
                  onClick={onClickSort("register")}
                ></DownOutlined>
              ) : (
                <UpOutlined
                  style={{ marginLeft: "5px" }}
                  onClick={onClickSort("registerReverse")}
                />
              )}
            </S.TableHead>
            <S.TableHead style={{ width: "70%" }}>연락처</S.TableHead>

            {/* <S.TableHeadRight style={{ width: "30%" }}>
              상세 보기
            </S.TableHeadRight> */}
            <S.TableHeadRight style={{ width: "30%" }}>
              리딩 이력
            </S.TableHeadRight>
            <S.TableHeadRight style={{ width: "35%" }}>상태</S.TableHeadRight>
          </S.TableHeaderRound>
          {array?.map((el) => {
            return (
              <S.TableRound key={uuidv4()}>
                <S.TableHeadLeft
                  style={{
                    width: "40%",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    window.open(
                      "/" + router.query.branch + "/academy/" + el.id,
                      "_blank"
                    );
                  }}
                >
                  {el.origin}
                </S.TableHeadLeft>
                <S.TableHead
                  style={{
                    width: "45%",
                    cursor: "pointer",
                    // display: "flex",
                    // justifyContent: "space-between",
                  }}
                  onClick={() => {
                    window.open(
                      "/" + router.query.branch + "/academy/" + el.id,
                      "_blank"
                    );
                  }}
                >
                  <div>{el.korName + "(" + el.engName + ")"}</div>
                  <SearchOutlined
                    onClick={() => {
                      window.open(
                        "/" + router.query.branch + "/academy/" + el.id,
                        "_blank"
                      );
                    }}
                  ></SearchOutlined>
                </S.TableHead>
                <S.TableHead style={{ width: "40%" }}>
                  {el.birthDate}
                </S.TableHead>
                <S.TableHead style={{ width: "30%" }}>
                  {el.gender === "M" ? "남" : "여"}
                </S.TableHead>
                <S.TableHead style={{ width: "50%" }}>
                  {dateChange(el.registerDate)}
                </S.TableHead>
                <S.TableHead2 style={{ width: "70%" }}>
                  <div>{el.pmobileno}</div>
                </S.TableHead2>

                {/* <S.TableHeadRight style={{ width: "30%" }}>
                  
                </S.TableHeadRight> */}
                <S.TableHeadRight style={{ width: "30%" }}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      window.open(
                        "/" + router.query.branch + "/report/" + el.id
                      );
                    }}
                  >
                    <path
                      d="M5 19.5V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H18.4C18.5591 3 18.7117 3.06321 18.8243 3.17574C18.9368 3.28826 19 3.44087 19 3.6V21H6.5M9 7H15M6.5 15H19M6.5 18H19"
                      stroke="#81858C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                    <path
                      d="M6.5 15C5.5 15 5 15.672 5 16.5C5 17.328 5.5 18 6.5 18C5.5 18 5 18.672 5 19.5C5 20.328 5.5 21 6.5 21"
                      stroke="#81858C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </S.TableHeadRight>
                <S.TableHeadRight style={{ width: "35%" }}>
                  휴원
                  <Switch
                    defaultChecked={el.user.isActive}
                    onClick={onClickCheck(el.id, el.user.isActive)}
                  ></Switch>
                  재원
                  {/* <button
                    style={{
                      backgroundColor: "transparent",
                      border: 0,
                      cursor: "pointer",
                    }}
                    onClick={onClickCheck(el.id, el.user.isActive)}
                  >
                    {el.user.isActive ? "재원 " : "휴원"}
                  </button> */}
                </S.TableHeadRight>
              </S.TableRound>
            );
          })}
        </S.Table>
      </S.AcademyWrapper>

      {addToggle && (
        <Modal
          closable={false}
          open={addToggle}
          onCancel={() => {
            setAddToggle(false);
            setAddKorName("");
            setAddEmail1("");
            setAddEmail1("gmail.com");
            setPassword("");
            setAddEngName("");
            setAddGender("M");
            setAddMobileNumber1("");
            setAddMobileNumber2("");
            setAddMobileNumber3("");
            setAddPMobileNumber1("");
            setAddPMobileNumber2("");
            setAddPMobileNumber3("");
            setAddBirthDay(dateToInput(date));
            setAddRegisterDay(dateToInput(date));
            setAddOrigin("");
          }}
          footer={null}
        >
          <S.ModalWrapperTitle>원생 등록</S.ModalWrapperTitle>
          <S.ModalWrapper>
            <S.ModalTag>
              <S.ModalTitle>원생 아이디 *</S.ModalTitle>
              <S.ModalInput
                type="text"
                onChange={(e) => {
                  setAddId(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onClickAddStudent();
                  }
                }}
              ></S.ModalInput>
            </S.ModalTag>
            <S.ModalTag>
              <S.ModalTitle>Password *</S.ModalTitle>
              <S.ModalInput
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onClickAddStudent();
                  }
                }}
              ></S.ModalInput>
            </S.ModalTag>

            <S.ModalTag>
              <S.ModalTitle>한글 이름 *</S.ModalTitle>
              <S.ModalInput
                type="text"
                onChange={(e) => {
                  setAddKorName(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onClickAddStudent();
                  }
                }}
              ></S.ModalInput>
            </S.ModalTag>
            <S.ModalTag>
              <S.ModalTitle>영어 이름</S.ModalTitle>
              <S.ModalInput
                type="text"
                onChange={(e) => {
                  setAddEngName(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onClickAddStudent();
                  }
                }}
              ></S.ModalInput>
            </S.ModalTag>
            <S.ModalTag>
              <S.ModalTitle>이메일</S.ModalTitle>
              <div>
                <S.ModalSmall
                  type="text"
                  onChange={(e) => {
                    setAddEmail1(e.target.value);
                  }}
                  value={addEmail1}
                ></S.ModalSmall>{" "}
                @{" "}
                <S.ModalSmall
                  type="text"
                  onChange={(e) => {
                    setAddEmail2(e.target.value);
                  }}
                  value={addEmail2}
                  disabled={!isTyped}
                ></S.ModalSmall>{" "}
                <select
                  style={{
                    padding: "0.81rem 0",
                    borderRadius: "0.5rem",
                    border: "1px solid #dbdde1",
                    width: "calc(25% - 1rem)",
                    color: "#333",
                  }}
                  onChange={(e) => {
                    if (e.target.value === "") {
                      setAddEmail2("");
                      setIsTyped(true);
                    } else {
                      setAddEmail2(e.target.value);
                      setIsTyped(false);
                    }
                  }}
                >
                  {addressList.map((el) => {
                    return (
                      <option value={el} selected={el === addEmail2}>
                        {el}
                      </option>
                    );
                  })}
                  <option value={""} selected={isTyped}>
                    {"직접 입력"}
                  </option>
                </select>
              </div>
              {/* <S.ModalInput
                type="text"
                onChange={(e) => {
                  setAddEmail(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onClickAddStudent();
                  }
                }}
              ></S.ModalInput> */}
            </S.ModalTag>
            <S.ModalTag>
              <S.ModalTitle>성별</S.ModalTitle>
              <div>
                <input
                  type="radio"
                  name="gender"
                  value={"M"}
                  checked={addGender === "M"}
                  onChange={(e) => {
                    setAddGender(e.target.value);
                  }}
                ></input>{" "}
                남
                <input
                  type="radio"
                  name="gender"
                  value={"W"}
                  checked={addGender === "W"}
                  onChange={(e) => {
                    setAddGender(e.target.value);
                  }}
                ></input>{" "}
                여
              </div>
            </S.ModalTag>
            <S.ModalTag>
              <S.ModalTitle>학부모 전화번호 *</S.ModalTitle>
              <div>
                <S.ModalSmall
                  type="text"
                  maxLength={3}
                  onChange={(e) => {
                    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                    setAddPMobileNumber1(onlyNumber);
                    if (e.target.value.length === 3) {
                      pMobileNumber2.current.focus();
                    }
                  }}
                  value={addPMobileNumber1}
                ></S.ModalSmall>{" "}
                -{" "}
                <S.ModalSmall
                  type="text"
                  maxLength={4}
                  onChange={(e) => {
                    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                    setAddPMobileNumber2(onlyNumber);
                    if (e.target.value.length === 4) {
                      pMobileNumber3.current.focus();
                    }
                  }}
                  ref={pMobileNumber2}
                  value={addPMobileNumber2}
                ></S.ModalSmall>{" "}
                -{" "}
                <S.ModalSmall
                  type="text"
                  maxLength={4}
                  onChange={(e) => {
                    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                    setAddPMobileNumber3(onlyNumber);
                  }}
                  ref={pMobileNumber3}
                  value={addPMobileNumber3}
                ></S.ModalSmall>
              </div>
            </S.ModalTag>
            <S.ModalTag>
              <S.ModalTitle>원생 전화번호</S.ModalTitle>
              <div>
                <S.ModalSmall
                  type="text"
                  maxLength={3}
                  onChange={(e) => {
                    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                    setAddMobileNumber1(onlyNumber);
                    if (e.target.value.length === 3) {
                      mobileNumber2.current.focus();
                    }
                  }}
                  value={addMobileNumber1}
                ></S.ModalSmall>{" "}
                -{" "}
                <S.ModalSmall
                  type="text"
                  maxLength={4}
                  onChange={(e) => {
                    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                    setAddMobileNumber2(onlyNumber);
                    if (e.target.value.length === 4) {
                      mobileNumber3.current.focus();
                    }
                  }}
                  ref={mobileNumber2}
                  value={addMobileNumber2}
                ></S.ModalSmall>{" "}
                -{" "}
                <S.ModalSmall
                  type="text"
                  maxLength={4}
                  onChange={(e) => {
                    const onlyNumber = e.target.value.replace(/[^0-9]/g, "");
                    setAddMobileNumber3(onlyNumber);
                  }}
                  ref={mobileNumber3}
                  value={addMobileNumber3}
                ></S.ModalSmall>
              </div>
            </S.ModalTag>
            <S.ModalTag>
              <S.ModalTitle>생년월일 *</S.ModalTitle>
              <S.ModalInput
                type="date"
                value={addBirthDay}
                onChange={(e) => {
                  setAddBirthDay(e.target.value);
                }}
              ></S.ModalInput>
            </S.ModalTag>
            <S.ModalTag>
              <S.ModalTitle>등록일</S.ModalTitle>
              <S.ModalInput
                type="date"
                defaultValue={addRegisterDay}
                onChange={(e) => {
                  setAddRegisterDay(e.target.value);
                }}
              ></S.ModalInput>
            </S.ModalTag>
            <S.ModalTag>
              {myData?.me?.profile?.academies?.length > 0 && (
                <>
                  <S.ModalTitle style={{ marginBottom: "0.5rem" }}>
                    지점 *
                  </S.ModalTitle>
                  {myData?.me?.profile?.academies?.map((el) => {
                    return (
                      <div style={{ display: "flex" }}>
                        <div>{el.location}</div>{" "}
                        <input
                          type="checkbox"
                          style={{ width: "20px", height: "20px" }}
                          onClick={onClickAddBranchList(el?.id)}
                          checked={branches.includes(el?.id)}
                        ></input>
                      </div>
                    );
                  })}
                </>
              )}
            </S.ModalTag>
            {/* <S.ModalTag>
              <S.ModalTitle>원생 번호</S.ModalTitle>
              <S.ModalInput
                type="text"
                onChange={(e) => {
                  setAddOrigin(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    onClickAddStudent();
                  }
                }}
              ></S.ModalInput>
            </S.ModalTag> */}
            <div
              style={{ marginTop: "40px", fontFamily: "Spoqa Han Sans Neo" }}
            >
              {"*은 "}
              <span style={{ color: "tomato" }}>필수 입력 항목</span>
              {"입니다."}
            </div>
          </S.ModalWrapper>

          <S.ModalButtonBox>
            <S.ModalReturnButton
              onClick={() => {
                setAddToggle(false);
                setAddKorName("");
                setAddEmail1("");
                setAddEmail2("");
                setPassword("");
                setAddEngName("");
                setAddGender("M");
                setAddMobileNumber1("");
                setAddMobileNumber2("");
                setAddMobileNumber3("");
                setAddPMobileNumber1("");
                setAddPMobileNumber2("");
                setAddPMobileNumber3("");
                setAddBirthDay(dateToInput(date));
                setAddRegisterDay(dateToInput(date));
                setAddOrigin("");
                setBranches([]);
              }}
            >
              취소
            </S.ModalReturnButton>
            <S.ModalOkButton onClick={onClickAddStudent}>저장</S.ModalOkButton>
          </S.ModalButtonBox>
        </Modal>
      )}
      {isCheck ? (
        <Modal
          open={isCheck}
          closable={false}
          onCancel={() => {
            setIsCheck(false);
          }}
          footer={null}
        >
          <div>
            <div>
              {isStop
                ? "재원으로 변경하시겠습니까?"
                : "휴원으로 변경하시겠습니까?"}
            </div>
            <button
              onClick={() => {
                setIsCheck(false);
              }}
            >
              취소
            </button>
            <button onClick={onClickStop}>확인</button>
          </div>
        </Modal>
      ) : (
        <></>
      )}
    </>
  );
}
