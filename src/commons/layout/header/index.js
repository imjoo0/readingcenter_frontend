import { useRouter } from "next/router";
import * as S from "./header.style";
import { v4 as uuidv4 } from "uuid";

export default function Header() {
  const menuList = [
    ["원생 관리", "academy"],
    ["수업 관리", "class"],
    ["도서 관리", "books"],
  ];
  const router = useRouter();

  const onClickMenu = (address) => () => {
    router.push("/" + address);
  };

  return (
    <S.HeaderWrapper>
      {menuList.map((el) => {
        return (
          <S.HeaderTag
            key={uuidv4()}
            style={
              router.asPath.includes("/" + el[1])
                ? { backgroundColor: "#efefef", color: "#1e1e1e" }
                : {}
            }
            onClick={onClickMenu(el[1])}
          >
            {el[0]}
          </S.HeaderTag>
        );
      })}
    </S.HeaderWrapper>
  );
}
