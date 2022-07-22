import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Avatar } from "@/components/elements";

import { useQuery } from "@apollo/client";
import { FIND_MEMBERS } from "@/queries/soil/find-members";

const MembersListPage: NextPage = () => {
  const router = useRouter();

  const { data } = useQuery(FIND_MEMBERS, {
    variables: {
      fields: {},
    },
    context: { serviceName: "soilservice" },
  });

  console.log("data", data);
  return (
    <div>
      <div>members</div>
      <div>
        {data?.findMembers?.map((member: any, index: number) => (
          <button
            key={index}
            onClick={() => router.push(`/members/${member._id}`)}
            className="flex p-6 hover:bg-slate-200 cursor-pointer w-full"
          >
            <Avatar
              src={member.discordAvatar}
              alt={member.discordName}
              size={12}
            />
            <div className="pl-4">Discord : {member.discordName}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MembersListPage;
