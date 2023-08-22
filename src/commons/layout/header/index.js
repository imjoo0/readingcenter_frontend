import { useRouter } from "next/router";
import * as S from "./header.style";
import { v4 as uuidv4 } from "uuid";

export default function Header() {
  const menuList = [
    // ["유저 페이지", "userPage"],
    ["원생 관리", "academy"],
    ["수업 관리", "class"],
    ["도서 관리", "books"],
    ["수업 목록", "classList"],
  ];
  const router = useRouter();

  const onClickMenu = (address) => () => {
    if (address === "userPage") {
      router.push("/userPage");
    } else {
      router.push("/" + router.query.branch + "/" + address);
    }
  };

  return (
		<S.HeaderWrapper>
			<S.MenuDiv>
				<S.logoHorizentalImage></S.logoHorizentalImage>
				{menuList.map((el) => {
					return (
						<S.HeaderTag
							key={uuidv4()}
							style={
								router.asPath.split('/')[
									router.asPath.split('/').length - 1
								] === el[1]
									? { color: '#000' }
									: {}
							}
							onClick={onClickMenu(el[1])}
						>
							<S.HeaderText>{el[0]}</S.HeaderText>
						</S.HeaderTag>
					);
				})}
			</S.MenuDiv>
			<S.logout
				onClick={() => {
					router.push('/');
				}}
			>
				로그아웃
			</S.logout>
		</S.HeaderWrapper>
	);
}
