import * as React from "react";
import type { AppProps } from "next/app";
import { AppLayout } from "@/components/layout";
import "@/styles/globals.css";

// Imports
import { chain, createClient, WagmiConfig, configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { ApolloProvider } from "@apollo/client";
import { apolloClient } from "@/lib/auth-lens";
import { ENV_PROD, ENV_DEV, IS_PRODUCTION } from "@/lib/auth-lens/constants";

import { useIsMounted } from "../hooks";

// Get environment variables
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID as string;
// const infuraId = process.env.NEXT_PUBLIC_INFURA_ID as string;

const networks = [];
if (ENV_PROD && IS_PRODUCTION) {
  networks.push(chain.polygon);
}

if (ENV_DEV || !IS_PRODUCTION) {
  networks.push(chain.polygonMumbai);
}

const { chains, provider } = configureChains(networks, [
  alchemyProvider({ alchemyId }),
  publicProvider(),
]);

const { connectors } = getDefaultWallets({
  appName: "soil",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const App = ({ Component, pageProps }: AppProps) => {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider coolMode chains={chains}>
        <ApolloProvider client={apolloClient}>
          <AppLayout>
            <Component {...pageProps} />
          </AppLayout>
        </ApolloProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
