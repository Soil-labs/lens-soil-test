import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { LensLogin } from "@/components/lens";

export const Header = () => {
  return (
    <div>
      <div className="flex justify-between p-4">
        <ConnectButton />
        <LensLogin />
      </div>
      <nav id="bar" className="flex justify-center ">
        <div className=" flex flex-col md:flex-row justify-center md:space-y-0 my-4 space-y-4  text-center text-gray-500 font-semibold">
          <Link href="/">
            <a className="mx-8 hover:text-blue-500 active" aria-current="page">
              Landing
            </a>
          </Link>
          <Link href="/project">
            <a className="mx-8 hover:text-blue-500 active" aria-current="page">
              Project
            </a>
          </Link>
          <Link href="/create-user">
            <a className="mx-8 hover:text-blue-500 active" aria-current="page">
              Create User
            </a>
          </Link>
        </div>
      </nav>
    </div>
  );
};
