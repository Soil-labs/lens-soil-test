import React from "react";
import { useAccount, useSignMessage } from "wagmi";
import { generateChallenge, authenticate } from "@/lib/auth-lens/login";
import { setAuthenticationToken } from "@/lib/auth-lens/state";
import { Button } from "@/components/elements";

export const LensLogin = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const handleLogin = async () => {
    const challenge = await generateChallenge(address as string);
    if (!challenge) return;
    const signature = await signMessageAsync({
      message: challenge.data.challenge.text,
    });
    const accessTokens = await authenticate(
      address as string,
      signature as string
    );
    await setAuthenticationToken({ token: accessTokens.data.authenticate });
  };

  if (!address) return null;
  return (
    <Button className="w-36" onClick={() => handleLogin()}>
      Login with Lens
    </Button>
  );
};
