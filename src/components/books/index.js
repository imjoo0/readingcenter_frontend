import * as S from "./books.style";
import { BookOutlined, DeleteOutlined } from "@ant-design/icons";
import { addComma, dateToInput, longWord } from "../../commons/library/library";
import { useEffect, useRef, useState } from "react";
import { Modal, Spin } from "antd";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQuery } from "@apollo/client";
import { EDIT_BOOK_PLACE, GET_BOOKS } from "./books.query";
import { useRouter } from "next/router";

export default function BookPage() {
  const router = useRouter();

  const [searchType, setSearchType] = useState("name");
  const [minBl, setMinBl] = useState("");
  const [maxBl, setMaxBl] = useState("");
  const [date, setDate] = useState(new Date());
  const [bookArray, setBookArray] = useState([]);
  const [bookPage, setBookPage] = useState(1);
  const [bookMaxPage, setBookMaxPage] = useState(1);
  const [bookPageList, setBookPageList] = useState(0);
  const [bookSearchWord, setBookSearchWord] = useState("");
  const [detailToggle, setDetailToggle] = useState(false);
  const [selectBook, setSelectBook] = useState();
  const [minWc, setMinWc] = useState("");
  const [maxWc, setMaxWc] = useState("");
  const [minLex, setMinLex] = useState("");
  const [maxLex, setMaxLex] = useState("");
  const [inputPlbn, setInputPlbn] = useState("");
  const [isAddBook, setIsAddBook] = useState(false);
  const [inputFile, setInputFile] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [inputPlace, setInputPlace] = useState([]);
  const fileInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const { data, refetch, loading } = useQuery(GET_BOOKS, {
    variables: {
      minBl: 0,
      maxBl: 0,
      academyId: Number(router.query.branch),
      lectureDate: dateToInput(date),
    },
    onCompleted: () => {
      setIsLoading(false); // 쿼리 완료 시 로딩 상태 변경
    },
    onError: () => {
      setIsLoading(false); // 에러 시 로딩 상태 변경
    },
  });

  const [editBookPlace] = useMutation(EDIT_BOOK_PLACE);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 1) {
      alert("한 개의 파일만 드래그 해주십시요.");
      return;
    }
    const allowedFile = ["xlsx"];
    if (
      !allowedFile.includes(
        e.dataTransfer.files[0].name.split(".").pop().toLowerCase()
      )
    ) {
      alert("엑셀 파일을 올려주십시오.");
      return;
    }
    // const newFiles = ...e.dataTransfer.files;
    setInputFile(...e.dataTransfer.files);
  };

  const onClickAddList = () => {
    console.log(inputFile);
    setIsAddBook(false);
    setInputFile([]);
  };

  const onClickFileRef = () => {
    fileInputRef.current.click();
  };

  const onChangeAddBooks = (e) => {
    if (e.target.files.length === 0) {
      return;
    }
    const fileArray = Array.from(e.target.files);
    const allowedFile = ["xlsx"];

    if (
      !allowedFile.includes(fileArray[0].name.split(".").pop().toLowerCase())
    ) {
      alert("엑셀 파일을 올려주십시오.");
      return;
    }
    setInputFile(...fileArray);
  };
  const editPlace = (id, index) => async () => {
    console.log(id);
    console.log(inputPlace);
    if (inputPlace[index].place === "") {
      alert("변경 내용이 없습니다.");
      return;
    }
    try {
      await editBookPlace({
        variables: { id: id, newPlace: inputPlace[index].place },
      });
      refetch();
      inputPlace[index].place = "";
      alert("변경했습니다.");
    } catch {
      alert("변경에 실패했습니다.");
    }
  };

  const onClickSelectBook = (el) => () => {
    setDetailToggle(true);
    setSelectBook(el);
    setInputPlace(
      el.books.map((ele) => {
        return { id: ele.id, place: "" };
      })
    );
  };

  // useEffect(() => {
  //   refetch();
  // }, [minBl, maxBl]);

  useEffect(() => {
    setBookArray(
      data === undefined
        ? []
        : data?.getBooksByBl
            ?.filter((el) => {
              return (
                el?.titleAr
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase()) ||
                String(el?.books[0]?.isbn)
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase()) ||
                el?.authorAr
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase()) ||
                String(el?.kplbn)
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase())
              );
            })
            ?.filter((el, index) => {
              return index < bookPage * 20 && index >= (bookPage - 1) * 20;
            })
            ?.map((el) => {
              return el;
            })
    );
    setBookMaxPage(
      Math.ceil(
        data?.getBooksByBl?.filter((el) => {
          return (
            el?.titleAr.toUpperCase().includes(bookSearchWord.toUpperCase()) ||
            String(el?.books[0]?.isbn)
              .toUpperCase()
              .includes(bookSearchWord.toUpperCase()) ||
            el?.authorAr.toUpperCase().includes(bookSearchWord.toUpperCase()) ||
            String(el?.kplbn)
              .toUpperCase()
              .includes(bookSearchWord.toUpperCase())
          );
        })?.length / 20
      )
    );
    setBookPage(1);
    setBookPageList(0);
  }, [data, bookSearchWord, minWc, maxWc]);

  useEffect(() => {
    setBookArray(
      data === undefined
        ? []
        : data?.getBooksByBl
            ?.filter((el) => {
              return (
                el?.titleAr
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase()) ||
                String(el?.books[0]?.isbn)
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase()) ||
                el?.authorAr
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase()) ||
                String(el?.kplbn)
                  .toUpperCase()
                  .includes(bookSearchWord.toUpperCase())
              );
            })
            ?.filter((el, index) => {
              return index < bookPage * 20 && index >= (bookPage - 1) * 20;
            })
            ?.map((el) => {
              return el;
            })
    );
    setBookMaxPage(
      Math.ceil(
        data?.getBooksByBl?.filter((el) => {
          return (
            el?.titleAr.toUpperCase().includes(bookSearchWord.toUpperCase()) ||
            String(el?.books[0]?.isbn)
              .toUpperCase()
              .includes(bookSearchWord.toUpperCase()) ||
            el?.authorAr.toUpperCase().includes(bookSearchWord.toUpperCase()) ||
            String(el?.kplbn)
              .toUpperCase()
              .includes(bookSearchWord.toUpperCase())
          );
        })?.length / 20
      )
    );
  }, [bookPage, bookSearchWord, minWc, maxWc, inputPlbn]);

  // const deleteFile = (fileName) => () => {
  //   setInputFile(
  //     inputFile.filter((el) => {
  //       return el.name !== fileName;
  //     })
  //   );
  // };

  const onClickSearch = async () => {
    setIsLoading(true);
    const variables = {
      academyId: Number(router.query.branch),
      lectureDate: dateToInput(date),
    };
    if (minBl !== "") {
      variables.minBl = Number(minBl);
    }
    if (maxBl !== "") {
      variables.maxBl = Number(maxBl);
    }
    if (minLex !== "") {
      variables.minLex = Number(minLex);
    }
    if (maxLex !== "") {
      variables.maxLex = Number(maxLex);
    }
    if (minWc !== "") {
      variables.minWc = Number(minWc);
    }
    if (maxWc !== "") {
      variables.maxWc = Number(maxWc);
    }
    try {
      await refetch(variables);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeInputPlace = (index) => (e) => {
    const newArray = [...inputPlace];
    newArray[index].place = e.target.value;
    setInputPlace(newArray);
  };

  if (isLoading) {
    return <Spin></Spin>;
  } else {
    return (
			<S.BooksWrapper>
				<S.BooksTitle>도서 관리</S.BooksTitle>
				<S.SearchBox
					style={{
						borderRadius: '0.25rem 0.25rem 0rem 0rem',
						background: '#F7F8FA',
						padding: '1.5rem',
						borderRadius: '9px',
						marginTop: '1.25rem',
						width: '95%',
					}}
				>
					<S.SearchTag
						style={{
							flexDirection: 'row',
							justifyContent: 'flex-start',
							alignItems: 'flex-end',
						}}
					>
						<div
							style={{
								display: 'flex',
								color: '#000',
								fontSize: '15px',
								fontWeight: 'bold',
								flexDirection: 'column',
								marginRight: '1.87rem',
							}}
						>
							<div style={{ marginBottom: '5px' }}>AR 점수</div>
							<div>
								<span>최소</span>
								<S.InputInput
									style={{ marginLeft: '10px', marginTop: '10px' }}
									type="number"
									onChange={(e) => {
										setMinBl(Number(e.target.value));
									}}
									onKeyPress={async (e) => {
										if (e.key === 'Enter') {
											onClickSearch();
										}
									}}
									defaultValue={minBl}
								></S.InputInput>
							</div>
							<div>
								<span>최대</span>
								<S.InputInput
									style={{ marginLeft: '10px', marginTop: '10px' }}
									type="number"
									onChange={(e) => {
										setMaxBl(Number(e.target.value));
									}}
									onKeyPress={async (e) => {
										if (e.key === 'Enter') {
											onClickSearch();
										}
									}}
									defaultValue={maxBl}
								></S.InputInput>
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								color: '#000',
								fontSize: '15px',
								fontWeight: 'bold',
								flexDirection: 'column',
								marginRight: '1.87rem',
							}}
						>
							<div style={{ marginBottom: '5px' }}>Word Count</div>
							<div>
								최소
								<S.InputInput
									type="number"
									style={{ marginLeft: '10px', marginTop: '10px' }}
									onChange={(e) => {
										setMinWc(Number(e.target.value));
									}}
									defaultValue={minWc}
								></S.InputInput>
							</div>
							<div>
								최대
								<S.InputInput
									type="number"
									style={{ marginLeft: '10px', marginTop: '10px' }}
									onChange={(e) => {
										setMaxWc(Number(e.target.value));
									}}
									defaultValue={maxWc}
								></S.InputInput>
							</div>
						</div>
						<div
							style={{
								display: 'flex',
								color: '#000',
								fontSize: '15px',
								fontWeight: 'bold',
								flexDirection: 'column',
								marginRight: '1.87rem',
							}}
						>
							<div>Lexile 점수</div>
							<div>
								<div>
									최소
									<S.InputInput
										type="number"
										style={{ marginLeft: '10px', marginTop: '10px' }}
										onChange={(e) => {
											setMinLex(Number(e.target.value));
											console.log(Number(e.target.value));
										}}
										defaultValue={minLex}
									></S.InputInput>
								</div>
								<div>
									최대
									<S.InputInput
										type="number"
										style={{ marginLeft: '10px', marginTop: '10px' }}
										onChange={(e) => {
											setMaxLex(Number(e.target.value));
										}}
										defaultValue={maxLex}
									></S.InputInput>
								</div>
							</div>
						</div>
						<S.ModalAddButton
							onClick={onClickSearch}
							style={{
								borderRadius: '0.5rem',
								background: '#333',
								height: '2.75rem',
							}}
						>
							검색
						</S.ModalAddButton>
					</S.SearchTag>
					<S.SearchTag style={{ marginTop: '30px' }}>
						<div>
							<S.SearchInput
								type="text"
								placeholder="도서 제목, 바코드, 저자 등으로 검색해주세요."
								onChange={(e) => {
									setBookSearchWord(e.target.value);
								}}
							/>
						</div>
					</S.SearchTag>
				</S.SearchBox>
				<S.CountNumber
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						width: '100%',
						marginBottom: '10px',
					}}
				>
					{(data?.getBooksByBl !== undefined &&
						data?.getBooksByBl?.filter((el) => {
							return (
								el?.titleAr
									.toUpperCase()
									.includes(bookSearchWord.toUpperCase()) ||
								String(el?.books[0]?.isbn)
									.toUpperCase()
									.includes(bookSearchWord.toUpperCase()) ||
								el?.authorAr
									.toUpperCase()
									.includes(bookSearchWord.toUpperCase()) ||
								String(el?.kplbn)
									.toUpperCase()
									.includes(bookSearchWord.toUpperCase())
							);
						}).length !== 0) ||
					undefined
						? data?.getBooksByBl?.filter((el) => {
								return (
									el?.titleAr
										.toUpperCase()
										.includes(bookSearchWord.toUpperCase()) ||
									String(el?.books[0]?.isbn)
										.toUpperCase()
										.includes(bookSearchWord.toUpperCase()) ||
									el?.authorAr
										.toUpperCase()
										.includes(bookSearchWord.toUpperCase()) ||
									String(el?.kplbn)
										.toUpperCase()
										.includes(bookSearchWord.toUpperCase())
								);
						  }).length + '권'
						: ''}
				</S.CountNumber>
				<style>{`
              table {
              border-collapse: separate;
              border-spacing: 0;
              border-radius: 0.125rem;
              border: 1px solid #DBDDE1;
              width: 100%;
            }
            thead{
              border-radius: 0.25rem 0.25rem 0rem 0rem;
              background: #F7F8FA;
            }
            th,
            td {
              border: 0.8px solid #DBDDE1;
              padding: 6px 1.5rem;
              font-size: 0.875rem;
              font-style: normal;
              font-weight: 500;
              line-height: normal;
              text-align: left;
            }
            td {
              color: #333;
            }
            `}</style>
				<table>
					{bookArray.length === 0 ? (
						<></>
					) : (
						<thead>
							<tr>
								<th>바코드</th>
								<th>도서 제목</th>
								<th>저자</th>
								<th>AR QUIZ No.</th>
								<th>AR</th>
								<th>Lexile</th>
								<th>Word Count</th>
								<th>도서 권수</th>
								<th>상세 보기</th>
							</tr>
						</thead>
					)}
					<tbody>
						{bookArray?.map((el) => {
							return (
								<tr>
									<td>{el.books[0].isbn}</td>
									<td>{longWord(el.titleAr)}</td>
									<td>{el.authorAr}</td>
									<td>{el.arQuiz}</td>
									<td>{el.bl}</td>
									<td>{el.lexileLex ?? el.lexileAr}</td>
									<td>{el.wcAr}</td>
									<td>{el.books.length + '권'}</td>
									<td>
										<BookOutlined onClick={onClickSelectBook(el)} />
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '20px',
						marginBottom: '20px',
						width: '100%',
					}}
				>
					{data === undefined || data?.getBooksByBl.length === 0 ? (
						<></>
					) : (
						<>
							<button
								onClick={() => {
									console.log(bookPageList);
									if (bookPage - 10 > 0) {
										setBookPage(bookPage - 10);
									}
								}}
							>
								{'<<'}
							</button>
							<button
								onClick={() => {
									if (bookPage > 1) {
										setBookPage(bookPage - 1);
									}
								}}
							>
								{'<'}
							</button>
						</>
					)}
					{Array.from({ length: bookMaxPage })
						// .filter((_, index) => {
						//   return (
						//     index === 0 ||
						//     index === bookMaxPage ||
						//     (index >= bookPage && index <= bookPage + 1)
						//   );
						// })
						.map((_, index) => {
							if (
								index === 0 ||
								index === bookMaxPage - 1 ||
								(index + 3 >= bookPage && index - 1 <= bookPage)
							) {
								return (
									<>
										{bookPage > 4 && bookPage === index + 3 ? (
											<span
												style={{
													width: '17px',
													color: 'black',
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
												}}
											>
												...
											</span>
										) : (
											<></>
										)}
										<span
											onClick={() => {
												setBookPage(index + 1);
											}}
											style={
												index + 1 + bookPageList * 10 === bookPage
													? {
															width: '27px',
															color: 'white',
															backgroundColor: '#333',
															border: '1px solid black',
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
													  }
													: {
															width: '27px',
															color: 'black',
															border: '1px solid black',
															display: 'flex',
															justifyContent: 'center',
															alignItems: 'center',
													  }
											}
										>
											{index + 1}
										</span>
										{bookPage < bookMaxPage - 3 && bookPage === index - 1 ? (
											<span
												style={{
													width: '17px',
													color: 'black',
													display: 'flex',
													justifyContent: 'center',
													alignItems: 'center',
												}}
											>
												...
											</span>
										) : (
											<></>
										)}
									</>
								);
							}
						})}
					{data === undefined || data?.getBooksByBl.length === 0 ? (
						<></>
					) : (
						<>
							<button
								onClick={() => {
									if (bookPage < bookMaxPage) {
										setBookPage(bookPage + 1);
									}
								}}
							>
								{'>'}
							</button>
							<button
								onClick={() => {
									console.log(bookPageList);
									if (bookPage + 10 < bookMaxPage) {
										setBookPage(bookPage + 10);
									}
								}}
							>
								{'>>'}
							</button>
						</>
					)}
				</div>
				{/* <button
          onClick={() => {
            setIsAddBook(true);
          }}
        >
          도서 등록
        </button> */}
				{isAddBook ? (
					<Modal
						open={isAddBook}
						onCancel={() => {
							setIsAddBook(false);
							setInputFile([]);
						}}
						footer={null}
						closable={false}
					>
						<button onClick={onClickFileRef}>첨부</button>
						<div className="App">
							<div
								className={`drop-box ${dragging ? 'dragging' : ''}`}
								onDragEnter={handleDragEnter}
								onDragLeave={handleDragLeave}
								onDragOver={handleDragOver}
								onDrop={handleDrop}
								style={{
									border: '1px solid #2d2d2d',
									width: '450px',
									height: '300px',
								}}
							>
								{/* {dragging ? "Drop here" : "Drag and drop files here"} */}
							</div>

							<div className="file-list" style={{ margin: '10px 0' }}>
								{/* <div>
                  {inputFile.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "450px",
                      }}
                    >
                      <div>{file.name}</div>
                      <DeleteOutlined onClick={deleteFile(file.name)} />
                    </div>
                  ))}
                </div> */}
								<div>{inputFile.name}</div>
							</div>
						</div>
						<input
							type="file"
							onChange={onChangeAddBooks}
							ref={fileInputRef}
							style={{ display: 'none' }}
							multiple={false}
							// accept="application/vnd.ms-excel"
						></input>
						<button onClick={onClickAddList}>등록</button>
						<button
							onClick={() => {
								setIsAddBook(false);
								setInputFile([]);
							}}
						>
							취소
						</button>
					</Modal>
				) : (
					<></>
				)}
				{detailToggle ? (
					<Modal
						open={detailToggle}
						width={'55vw'}
						height={'50vh'}
						footer={null}
						closable={false}
						onCancel={() => {
							setDetailToggle(false);
							setInputPlace([]);
						}}
					>
						<S.BooksTitle>도서 정보</S.BooksTitle>
						<S.BooksTitleLine></S.BooksTitleLine>
						<S.ModalWrapper>
							<S.ModalInputBox>
								<S.EditTitleFont>도서 제목</S.EditTitleFont>

								<S.EditTagFont>{selectBook.titleAr}</S.EditTagFont>
							</S.ModalInputBox>
							<S.ModalInputBox>
								<S.EditTitleFont>저자</S.EditTitleFont>

								<S.EditTagFont>{selectBook.authorAr}</S.EditTagFont>
							</S.ModalInputBox>
							<S.ModalInputBox>
								<S.EditTitleFont>바코드</S.EditTitleFont>

								<S.EditTagFont>{selectBook.books[0].isbn}</S.EditTagFont>
							</S.ModalInputBox>
							{/* <S.ModalInputBox>
                <div>F/NF</div>
                <S.InputInput
                  type="text"
                  style={{ width: "80%" }}
                  defaultValue={"Fiction"}
                ></S.InputInput>
              </S.ModalInputBox> */}
							<S.ModalInputBox>
								<S.EditTitleFont>AR Quiz No.</S.EditTitleFont>
								<S.EditTagFont>{selectBook.arQuiz}</S.EditTagFont>
							</S.ModalInputBox>
							<S.ModalInputBox>
								<S.EditTitleFont>AR</S.EditTitleFont>
								<S.EditTagFont>{selectBook.bl}</S.EditTagFont>
							</S.ModalInputBox>
							<S.ModalInputBox>
								<S.EditTitleFont>Lexile</S.EditTitleFont>
								<S.EditTagFont>
									{selectBook.lexileLex ?? selectBook.lexileAr}
								</S.EditTagFont>
							</S.ModalInputBox>
							<S.ModalInputBox>
								<S.EditTitleFont>Word Count</S.EditTitleFont>
								<S.EditTagFont>{selectBook.wcAr}</S.EditTagFont>
							</S.ModalInputBox>
							<S.BooksTitle>재고 정보</S.BooksTitle>
							<S.BooksTitleLine></S.BooksTitleLine>
							{selectBook.books.map((el, index) => {
								return (
									<S.ModalInputBox>
										<div style={{ width: '250px' }}>
											{'도서 위치(' + el.plbn + ')'}
										</div>
										<div
											style={{
												width: '81%',
												display: 'flex',
												justifyContent: 'space-between',
											}}
										>
											<S.InputInput
												type="text"
												style={{ width: '90%' }}
												defaultValue={el.place}
												onChange={onChangeInputPlace(index)}
											></S.InputInput>
											<button onClick={editPlace(Number(el.id), index)}>
												변경
											</button>
										</div>
									</S.ModalInputBox>
								);
							})}
						</S.ModalWrapper>
						<S.ModalButtonBox>
							<S.ModalCancelButton
								onClick={() => {
									setDetailToggle(false);
									setInputPlace([]);
								}}
							>
								닫기
							</S.ModalCancelButton>
						</S.ModalButtonBox>
					</Modal>
				) : (
					<></>
				)}
			</S.BooksWrapper>
		);
  }
}
