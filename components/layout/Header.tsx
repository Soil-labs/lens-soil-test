import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LensLogin } from "@/components/lens";

export const Header = () => {
  return (
    <div className="flex justify-between p-4">
      <ConnectButton />
      <LensLogin />
    </div>
  );
};
