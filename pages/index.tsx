import Head from "next/head";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className={""}>
      <Head>
        <title>Soil</title>
        <meta name="description" content="Soil" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header style={{ padding: "1rem" }}>
        <ConnectButton />
      </header>

      <main
        style={{
          minHeight: "60vh",
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        here
      </main>
    </div>
  );
}
