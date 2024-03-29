import { useContext, useEffect } from "react";
import { UserContext } from "@/components/layout";
import Link from "next/link";
import { useAccount } from "wagmi";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LensLogin, SelectProfile } from "@/components/lens/user";

export const Header = () => {
  const { setCurrentUser } = useContext(UserContext);
  const { isDisconnected } = useAccount();
  useEffect(() => {
    if (isDisconnected) {
      setCurrentUser({});
    }
  }, [isDisconnected]);

  return (
    <div>
      <div className="flex justify-between p-4">
        <ConnectButton />
        <SelectProfile onSelect={(profile) => setCurrentUser(profile)} />
        <LensLogin />
      </div>
      <nav id="bar" className="flex justify-center ">
        <div className=" flex flex-col md:flex-row justify-center md:space-y-0 my-4 space-y-4  text-center text-gray-500 font-semibold">
          <Link href="/">
            <a className="mx-8 hover:text-blue-500 active" aria-current="page">
              Landing
            </a>
          </Link>
          <Link href="/lens-projects">
            <a className="mx-8 hover:text-blue-500 active" aria-current="page">
              Lens Project
            </a>
          </Link>
          <Link href="/create-user">
            <a className="mx-8 hover:text-blue-500 active" aria-current="page">
              Create Lens User
            </a>
          </Link>
          <Link href="/soil-projects">
            <a className="mx-8 hover:text-blue-500 active" aria-current="page">
              Soil Projects
            </a>
          </Link>
          <Link href="/members">
            <a className="mx-8 hover:text-blue-500 active" aria-current="page">
              Soil Members
            </a>
          </Link>
        </div>
      </nav>
    </div>
  );
};
