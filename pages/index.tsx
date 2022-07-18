import Head from "next/head";

export default function Home() {
  return (
    <div className={""}>
      <Head>
        <title>Soil</title>
        <meta name="description" content="Soil" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="text-center mt-16">
          <h1 className="text-2xl text-gray-700 font-bold">
            Soil - Landing Page
          </h1>
        </div>
      </main>
    </div>
  );
}
