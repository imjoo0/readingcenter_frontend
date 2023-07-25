import Layout from "@/src/commons/layout";
import "@/styles/globals.css";
import { RecoilRoot } from "recoil";
import ApolloSetting from "@/src/commons/apollo";

export default function App({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <ApolloSetting>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloSetting>
    </RecoilRoot>
  );
}
