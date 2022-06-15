import type { NextPage } from "next";
import Head from "next/head";
import makeSections, { defaultOptions } from "../lib/steps";
import Guide from "../components/Guide";

const Home: NextPage = () => {
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
};

export default Home;
