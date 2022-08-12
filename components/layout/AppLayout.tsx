import { useEffect, useState } from "react";
import { Header } from "@/components/layout";
import { Loading } from "@/components/elements";

import { useAccount, useDisconnect } from "wagmi";
import { removeAuthenticationToken } from "@/lib/auth-lens/state";

import { UserContext } from "@/components/layout";
import { useQuery, gql } from "@apollo/client";
import { ProfileFragmentFull } from "@/queries/lens/fragments/ProfileFragmentFull";

export const GET_PROFILES = gql`
  query ($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        ...ProfileFragmentFull
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
  ${ProfileFragmentFull}
`;

type AppLayoutProps = {
  children: React.ReactNode;
};

export const AppLayout = ({ children }: AppLayoutProps) => {
  const { address, connector, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();

  const [userProfiles, setUserProfiles] = useState<any[]>([]);
  const [defaultProfile, setDefaultProfile] = useState<any>();
  const [currentUserProfile, setCurrentUserProfile] = useState(
    defaultProfile || undefined
  );

  useEffect(() => {
    connector?.on("change", () => {
      removeAuthenticationToken();
      disconnect();
    });
  }, [address, connector, isDisconnected]);

  useEffect(() => {
    if (isDisconnected) {
      removeAuthenticationToken();
      setUserProfiles([]);
      setDefaultProfile(undefined);
    }
  }, [isDisconnected]);

  const { loading: userProfilesLoading } = useQuery(GET_PROFILES, {
    variables: {
      request: { ownedBy: address },
    },
    skip: !address,
    context: { serviceName: "lensservice" },
    onCompleted(data) {
      setUserProfiles(data.profiles.items);
    },
  });

  useEffect(() => {
    if (userProfiles && userProfiles.length > 0) {
      const checkDefaultProfile = userProfiles.find(
        (profile: any) => profile.isDefault
      );
      setDefaultProfile(checkDefaultProfile);
    }
  }, [userProfiles]);

  // console.log("ALL PROFILES", userProfilesData);
  // console.log("current profile", currentProfileData);

  // console.log("userProfiles", userProfiles);

  const injectContext = {
    profiles: userProfiles,
    defaultProfile: defaultProfile,
    currentUser: currentUserProfile,
    setCurrentUser: (profile: any) => {
      if (profile) {
        localStorage.setItem("current_user_profile_id", profile.id);
        setCurrentUserProfile(profile);
      }
    },
    // refechProfiles: refetch,
  };

  if (userProfilesLoading) return <Loading />;

  return (
    <UserContext.Provider value={injectContext}>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
      </div>
    </UserContext.Provider>
  );
};
