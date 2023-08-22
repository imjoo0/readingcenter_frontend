import { useRouter } from "next/router";
import * as S from "./academy.style";
import {
  SearchOutlined,
  FormOutlined,
  UpOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery } from "@apollo/client";
import { dateChange, dateToInput } from "@/src/commons/library/library";
import {
  CREATE_ACADEMY_TO_USER,
  CREATE_STUDENT_PROFILE,
  CREATE_USER,
  GET_STUDENTS,
  STOP_ACADEMY,
} from "./academy.query";
import { Modal, Switch } from "antd";

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
  const [addEmail, setAddEmail] = useState("");
  const [password, setPassword] = useState("");
  const [addEngName, setAddEngName] = useState("");
  const [addGender, setAddGender] = useState("M");
  const [addMobileNumber1, setAddMobileNumber1] = useState("");
  const [addMobileNumber2, setAddMobileNumber2] = useState("");
  const [addMobileNumber3, setAddMobileNumber3] = useState("");
  const [addPMobileNumber1, setAddPMobileNumber1] = useState("");
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
  const firstRef = useRef();
  const mobileNumber2 = useRef();
  const mobileNumber3 = useRef();
  const pMobileNumber2 = useRef();
  const pMobileNumber3 = useRef();
  const [selectId, setSelectId] = useState("");
  const [isCheck, setIsCheck] = useState(false);
  const [isStop, setIsStop] = useState(false);

  const onChangeSearchWord = (event) => {
    setSearchWord(event.target.value);
  };
  const onClickSearch = () => {
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

  const onClickStop = async () => {
    try {
      await stopAcademy({ variables: { userId: Number(selectId.id) } });
    } catch {
      alert("실패");
    }
    setIsCheck(false);
    refetch();
  };

  const onClickAddStudent = async () => {
    if (
      addKorName === "" ||
      addEmail === "" ||
      password === "" ||
      addEngName === "" ||
      addMobileNumber1 === "" ||
      addPMobileNumber1 === "" ||
      addMobileNumber2 === "" ||
      addPMobileNumber2 === "" ||
      addMobileNumber3 === "" ||
      addPMobileNumber3 === "" ||
      addOrigin === ""
    ) {
      alert("입력을 모두 완료해 주십시오.");
      return;
    }
    try {
      const result1 = await createUser({
        variables: {
          username: addId,
          email: addEmail,
          password: password,
          userCategory: "학생",
        },
      });
      console.log(result1);
      try {
        const result2 = await createProfile({
          variables: {
            userId: Number(result1?.data?.createUser?.user?.id),
            korName: addKorName,
            engName: addEngName,
            gender: addGender,
            mobileno:
              addMobileNumber1 +
              "-" +
              addMobileNumber2 +
              "-" +
              addMobileNumber3,
            pmobileno:
              addPMobileNumber1 +
              "-" +
              addPMobileNumber2 +
              "-" +
              addPMobileNumber3,
            birthDate: addBirthDay,
            registerDate: addBirthDay,
            origin: addOrigin,
          },
        });
        try {
          await addUserToAcademy({
            variables: {
              userIds: [Number(result1?.data?.createUser?.user?.id)],
              academyId: Number(router.query.branch),
            },
          });
        } catch {}
      } catch {
        alert("유저 정보 수정 오류");
      }
    } catch {
      alert("유저 생성 오류");
    }
    refetch();
    setAddKorName("");
    setAddEmail("");
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
  console.log(data);
  return (
		<>
			<S.AcademyWrapper>
				<S.AcademyTitle>원생 관리</S.AcademyTitle>

				<S.SearchBox>
					<S.SearchTag>
						<S.SearchInput
							type="text"
							placeholder="       원번 혹은 이름을 입력하세요."
							onChange={onChangeSearchWord}
							onKeyPress={onKeyPress}
						/>
						<S.SearchButton onClick={onClickSearch}>검색하기</S.SearchButton>
					</S.SearchTag>
				</S.SearchBox>
				<S.CountBox>
					<S.CountLeft>
						<S.CountNumber>{'전체 ' + array?.length + '명'}</S.CountNumber>
					</S.CountLeft>
					<S.CountRight>
						<S.ContinueOrRest>
							재원 / 휴원
							<Switch
								defaultChecked={false}
								onChange={(checked) => {
									setIsStop(checked);
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
						<S.TableHeadLeft style={{ width: '40%' }}>
							원번{' '}
							{sortType !== 'origin' || sortType === '' ? (
								<DownOutlined
									style={{ marginLeft: '5px' }}
									onClick={onClickSort('origin')}
								></DownOutlined>
							) : (
								<UpOutlined
									style={{ marginLeft: '5px' }}
									onClick={onClickSort('originReverse')}
								/>
							)}
						</S.TableHeadLeft>
						<S.TableHead style={{ width: '40%' }}>
							원생명
							{sortType !== 'name' || sortType === '' ? (
								<DownOutlined
									style={{ marginLeft: '5px' }}
									onClick={onClickSort('name')}
								></DownOutlined>
							) : (
								<UpOutlined
									style={{ marginLeft: '5px' }}
									onClick={onClickSort('nameReverse')}
								/>
							)}
						</S.TableHead>
						<S.TableHead style={{ width: '40%' }}>
							생년월일{' '}
							{sortType !== 'birthDate' || sortType === '' ? (
								<DownOutlined
									style={{ marginLeft: '5px' }}
									onClick={onClickSort('birthDate')}
								></DownOutlined>
							) : (
								<UpOutlined
									style={{ marginLeft: '5px' }}
									onClick={onClickSort('birthDateReverse')}
								/>
							)}
						</S.TableHead>
						<S.TableHead style={{ width: '50%' }}>
							등록일{' '}
							{sortType !== 'register' || sortType === '' ? (
								<DownOutlined
									style={{ marginLeft: '5px' }}
									onClick={onClickSort('register')}
								></DownOutlined>
							) : (
								<UpOutlined
									style={{ marginLeft: '5px' }}
									onClick={onClickSort('registerReverse')}
								/>
							)}
						</S.TableHead>
						<S.TableHead style={{ width: '100%' }}>연락처</S.TableHead>
						<S.TableHead style={{ width: '30%' }}>성별</S.TableHead>
						<S.TableHeadRight style={{ width: '30%' }}>
							상세 보기
						</S.TableHeadRight>
						<S.TableHeadRight style={{ width: '30%' }}>휴원</S.TableHeadRight>
					</S.TableHeaderRound>
					{array?.map((el) => {
						return (
							<S.TableRound key={uuidv4()}>
								<S.TableHeadLeft style={{ width: '40%' }}>
									{el.origin}
								</S.TableHeadLeft>
								<S.TableHead style={{ width: '40%' }}>{el.korName}</S.TableHead>
								<S.TableHead style={{ width: '40%' }}>
									{el.birthDate}
								</S.TableHead>
								<S.TableHead style={{ width: '50%' }}>
									{dateChange(el.registerDate)}
								</S.TableHead>
								<S.TableHead2 style={{ width: '100%' }}>
									<div>{'학생 : ' + el.mobileno}</div>
									<div>{'학부모 : ' + el.pmobileno}</div>
								</S.TableHead2>
								<S.TableHead style={{ width: '30%' }}>
									{el.gender === 'M' ? '남' : '여'}
								</S.TableHead>
								<S.TableHeadRight style={{ width: '30%' }}>
									<SearchOutlined
										onClick={() => {
											window.open(
												'/' + router.query.branch + '/academy/' + el.id,
												'_blank'
											);
										}}
									></SearchOutlined>
								</S.TableHeadRight>
								<S.TableHeadRight style={{ width: '30%' }}>
									<button
										style={{ backgroundColor: 'transparent', border: 0 }}
										onClick={onClickCheck(el.id, el.user.isActive)}
									>
										{el.user.isActive ? '휴원 처리' : '비휴원 처리'}
									</button>
								</S.TableHeadRight>
							</S.TableRound>
						);
					})}
				</S.Table>
			</S.AcademyWrapper>

			{addToggle ? (
				<Modal
					closable={false}
					open={addToggle}
					onCancel={() => {
						setAddToggle(false);
						setAddKorName('');
						setAddEmail('');
						setPassword('');
						setAddEngName('');
						setAddGender('M');
						setAddMobileNumber1('');
						setAddMobileNumber2('');
						setAddMobileNumber3('');
						setAddPMobileNumber1('');
						setAddPMobileNumber2('');
						setAddPMobileNumber3('');
						setAddBirthDay(dateToInput(date));
						setAddRegisterDay(dateToInput(date));
						setAddOrigin('');
					}}
					footer={null}
				>
					<S.ModalWrapperTitle>원생 등록</S.ModalWrapperTitle>
					<S.ModalWrapper>
						<S.ModalTag>
							<S.ModalTitle>원생 아이디</S.ModalTitle>
							<S.ModalInput
								type="text"
								onChange={(e) => {
									setAddId(e.target.value);
								}}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										onClickAddStudent();
									}
								}}
							></S.ModalInput>
						</S.ModalTag>
						<S.ModalTag>
							<S.ModalTitle>E-Mail</S.ModalTitle>
							<S.ModalInput
								type="text"
								onChange={(e) => {
									setAddEmail(e.target.value);
								}}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										onClickAddStudent();
									}
								}}
							></S.ModalInput>
						</S.ModalTag>
						<S.ModalTag>
							<S.ModalTitle>Password</S.ModalTitle>
							<S.ModalInput
								type="password"
								onChange={(e) => {
									setPassword(e.target.value);
								}}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										onClickAddStudent();
									}
								}}
							></S.ModalInput>
						</S.ModalTag>
						<S.ModalTag>
							<S.ModalTitle>한글 이름</S.ModalTitle>
							<S.ModalInput
								type="text"
								onChange={(e) => {
									setAddKorName(e.target.value);
								}}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
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
									if (e.key === 'Enter') {
										onClickAddStudent();
									}
								}}
							></S.ModalInput>
						</S.ModalTag>
						<S.ModalTag>
							<S.ModalTitle>성별</S.ModalTitle>
							<div>
								<input
									type="radio"
									name="gender"
									value={'M'}
									checked={addGender === 'M'}
									onChange={(e) => {
										setAddGender(e.target.value);
									}}
								></input>{' '}
								남
								<input
									type="radio"
									name="gender"
									value={'W'}
									checked={addGender === 'W'}
									onChange={(e) => {
										setAddGender(e.target.value);
									}}
								></input>{' '}
								여
							</div>
						</S.ModalTag>
						<S.ModalTag>
							<S.ModalTitle>원생 전화번호</S.ModalTitle>
							<div>
								<S.ModalSmall
									type="text"
									maxLength={3}
									onChange={(e) => {
										const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
										setAddMobileNumber1(onlyNumber);
										if (e.target.value.length === 3) {
											mobileNumber2.current.focus();
										}
									}}
									value={addMobileNumber1}
								></S.ModalSmall>{' '}
								-{' '}
								<S.ModalSmall
									type="text"
									maxLength={4}
									onChange={(e) => {
										const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
										setAddMobileNumber2(onlyNumber);
										if (e.target.value.length === 4) {
											mobileNumber3.current.focus();
										}
									}}
									ref={mobileNumber2}
									value={addMobileNumber2}
								></S.ModalSmall>{' '}
								-{' '}
								<S.ModalSmall
									type="text"
									maxLength={4}
									onChange={(e) => {
										const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
										setAddMobileNumber3(onlyNumber);
									}}
									ref={mobileNumber3}
									value={addMobileNumber3}
								></S.ModalSmall>
							</div>
						</S.ModalTag>
						<S.ModalTag>
							<S.ModalTitle>학부모 전화번호</S.ModalTitle>
							<div>
								<S.ModalSmall
									type="text"
									maxLength={3}
									onChange={(e) => {
										const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
										setAddPMobileNumber1(onlyNumber);
										if (e.target.value.length === 3) {
											pMobileNumber2.current.focus();
										}
									}}
									value={addPMobileNumber1}
								></S.ModalSmall>{' '}
								-{' '}
								<S.ModalSmall
									type="text"
									maxLength={4}
									onChange={(e) => {
										const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
										setAddPMobileNumber2(onlyNumber);
										if (e.target.value.length === 4) {
											pMobileNumber3.current.focus();
										}
									}}
									ref={pMobileNumber2}
									value={addPMobileNumber2}
								></S.ModalSmall>{' '}
								-{' '}
								<S.ModalSmall
									type="text"
									maxLength={4}
									onChange={(e) => {
										const onlyNumber = e.target.value.replace(/[^0-9]/g, '');
										setAddPMobileNumber3(onlyNumber);
									}}
									ref={pMobileNumber3}
									value={addPMobileNumber3}
								></S.ModalSmall>
							</div>
						</S.ModalTag>
						<S.ModalTag>
							<S.ModalTitle>생년월일</S.ModalTitle>
							<S.ModalInput
								type="date"
								defaultValue={addBirthDay}
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
							<S.ModalTitle>원생 번호</S.ModalTitle>
							<S.ModalInput
								type="text"
								onChange={(e) => {
									setAddOrigin(e.target.value);
								}}
								onKeyPress={(e) => {
									if (e.key === 'Enter') {
										onClickAddStudent();
									}
								}}
							></S.ModalInput>
						</S.ModalTag>
					</S.ModalWrapper>
					<S.ModalButtonBox>
						<S.ModalReturnButton
							onClick={() => {
								setAddToggle(false);
								setAddKorName('');
								setAddEmail('');
								setPassword('');
								setAddEngName('');
								setAddGender('M');
								setAddMobileNumber1('');
								setAddMobileNumber2('');
								setAddMobileNumber3('');
								setAddPMobileNumber1('');
								setAddPMobileNumber2('');
								setAddPMobileNumber3('');
								setAddBirthDay(dateToInput(date));
								setAddRegisterDay(dateToInput(date));
								setAddOrigin('');
							}}
						>
							취소
						</S.ModalReturnButton>
						<S.ModalOkButton onClick={onClickAddStudent}>저장</S.ModalOkButton>
					</S.ModalButtonBox>
				</Modal>
			) : (
				<></>
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
						<div>{'휴원 처리 하시겠습니까?'}</div>
						<button onClick={onClickStop}>확인</button>
						<button
							onClick={() => {
								setIsCheck(false);
							}}
						>
							취소
						</button>
					</div>
				</Modal>
			) : (
				<></>
			)}
		</>
	);
}
