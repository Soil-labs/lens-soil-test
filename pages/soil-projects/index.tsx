import type { NextPage } from "next";
import { useRouter } from "next/router";

import { useQuery } from "@apollo/client";
import { FIND_PROJECTS } from "@/queries/soil/find-projects";

const MembersListPage: NextPage = () => {
  const router = useRouter();

  const { data } = useQuery(FIND_PROJECTS, {
    variables: {
      fields: {},
    },
    context: { serviceName: "soilservice" },
  });

  console.log("data", data);
  return (
    <div>
      <div>projects</div>
      <div>
        {data?.findProjects?.map((project: any, index: number) => (
          <button
            key={index}
            onClick={() => router.push(`/soil-projects/${project._id}`)}
            className="p-6 hover:bg-slate-200 cursor-pointer w-full"
          >
            <div className="pl-4">ID : {project._id}</div>
            <div className="pl-4">Description : {project.description}</div>
            <div>Roles : {project.role.length}</div>
            <div>Tweets : {project.tweets.length}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MembersListPage;
