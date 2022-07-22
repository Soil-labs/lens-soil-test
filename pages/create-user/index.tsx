import type { NextPage } from "next";
import { CreateProfile } from "@/components/lens/user/CreateProfile";

const CreateUserPage: NextPage = () => {
  return (
    <div>
      <CreateProfile />
    </div>
  );
};

export default CreateUserPage;
