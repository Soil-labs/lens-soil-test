import type { NextPage } from "next";
import { useRouter } from "next/router";

const UpdateProjectPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Update Project Page - {id}</h1>
    </div>
  );
};

export default UpdateProjectPage;
