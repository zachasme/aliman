import { GetStaticProps } from "next";
import Head from "next/head";
import makeSections, { defaultOptions } from "../steps";
import Guide from "../components/Guide";

export default function Index() {
  const options = defaultOptions;

  const sections = makeSections(options);

  return (
    <>
      <Head>
        <title>Arch Linux Installation Manager</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Guide />
    </>
  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  return {
    props: {}, // will be passed to the page component as props
  };
};
