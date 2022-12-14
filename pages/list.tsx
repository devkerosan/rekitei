import type { NextPage } from "next";
import Head from "next/head";
import { RecoilRoot } from "recoil";
import Body from "../components/Body";
import Card from "../components/Card";
import Header from "../components/Header";
import RekiteiCard from "../components/RekiteiCard";

const CardsList = ["React", "Vue", "TypeScript", "React"];

const List: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </Head>

      <RecoilRoot>
        <div className="flex flex-col w-screen h-screen items-center bg-gray-100">
          <Header />
          <Body>
            <div className="flex flex-col w-full h-full p-2">
              <h1 className="text-4xl font-bold">Tree List</h1>
              <div className="flex gap-1">
                {CardsList.map((card) => {
                  return <Card key={card} data={card} />;
                })}
              </div>
              <div className="grid grid-cols-3 gap-8 p-4 place-items-center">
                {CardsList.map((_) => (
                  <RekiteiCard key={_} />
                ))}
              </div>
            </div>
          </Body>
        </div>
      </RecoilRoot>
    </div>
  );
};

export default List;
