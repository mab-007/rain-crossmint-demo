import React from "react";
import {
  CrossmintAuthProvider,
  CrossmintProvider,
  CrossmintWalletProvider,
} from "@crossmint/client-sdk-react-native-ui";

type ProvidersProps = {
  children: React.ReactNode;
};

const CLIENT_API_KEY = process.env.EXPO_PUBLIC_CROSSMINT_CLIENT_API_KEY ?? "";
const CHAIN = (process.env.EXPO_PUBLIC_CHAIN ?? "base-sepolia") as "base-sepolia";

export default function CrossmintProviders({ children }: ProvidersProps) {
  return (
    <CrossmintProvider apiKey={CLIENT_API_KEY}>
      <CrossmintAuthProvider>
        <CrossmintWalletProvider
          createOnLogin={{
            chain: CHAIN,
            signer: { type: "email" },
          }}
        >
          {children}
        </CrossmintWalletProvider>
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
}
