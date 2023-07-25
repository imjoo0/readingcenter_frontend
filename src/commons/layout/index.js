import { useRouter } from "next/router";
import Header from "./header";

export default function Layout(props) {
  const router = useRouter();
  const HIDDEN_HEADERS = ["/login"];
  return (
    <>
      {!HIDDEN_HEADERS.includes(router.asPath) ? <Header></Header> : <></>}
      <div>{props.children}</div>
    </>
  );
}
