import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Avatar, Loading, Error } from "@/components/elements";

import { useQuery } from "@apollo/client";
import { FIND_PROJECT } from "@/queries/soil/find-project";

const MemberPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, loading, error } = useQuery(FIND_PROJECT, {
    variables: {
      fields: { _id: id },
    },
    context: { serviceName: "soilservice" },
  });

  if (loading) return <Loading />;
  if (error) return <Error />;
  console.log("data", data);

  return (
    <div className="p-6">
      <div>project id : {id}</div>
      <div>title : {data.findProject.title}</div>
      <div>description : {data.findProject.description}</div>
      <div className="flex my-4">
        <div>champion : </div>
        <Avatar
          src={data.findProject.champion?.discordAvatar}
          alt={data.findProject.champion?.discordName}
          size={6}
        />
        <div>{data.findProject.champion?.discordName}</div>
      </div>
    </div>
  );
};

export default MemberPage;
