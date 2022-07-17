import type { NextPage } from "next";
import { useRouter } from "next/router";

const ProjectPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <h1>Project Page - {id}</h1>
    </div>
  );
};

export default ProjectPage;
