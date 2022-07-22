import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Avatar } from "@/components/elements";

import { useQuery } from "@apollo/client";
import { FIND_MEMBER } from "@/queries/soil/find-member";

const MemberPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data } = useQuery(FIND_MEMBER, {
    variables: {
      fields: { _id: id },
    },
    context: { serviceName: "soilservice" },
  });

  console.log("data", data);

  return (
    <div className="p-6">
      <div>member id : {id}</div>
      <div>{data?.findMember?.discordName}</div>
      <Avatar
        src={data?.findMember?.discordAvatar}
        alt={data?.findMember?.discordName}
        size={12}
      />
    </div>
  );
};

export default MemberPage;
