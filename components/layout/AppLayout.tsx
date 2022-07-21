import { useEffect, useState } from "react";
import { Header } from "@/components/layout";
import { Loading } from "@/components/elements";

import { useAccount, useDisconnect } from "wagmi";
import { removeAuthenticationToken } from "@/lib/auth-lens/state";

import { UserContext } from "@/components/layout";
import { useQuery, gql } from "@apollo/client";
import { ProfileFragmentFull } from "@/queries/fragments/ProfileFragmentFull";

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

export const GET_DEFAULT_PROFILE = gql`
  query ($request: DefaultProfileRequest!) {
    defaultProfile(request: $request) {
      ...ProfileFragmentFull
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

  useEffect(() => {
    connector?.on("change", () => {
      removeAuthenticationToken();
      disconnect();
    });
  }, [address, connector, isDisconnected]);

  const { data: userProfilesData, loading: userProfilesLoading } = useQuery(
    GET_PROFILES,
    {
      variables: {
        request: { ownedBy: address },
      },
      context: { serviceName: "lensservice" },
    }
  );
  // const userProfilesData = {} as any;

  const {
    data: currentProfileData,
    loading: currentProfileLoading,
    refetch,
  } = useQuery(GET_DEFAULT_PROFILE, {
    variables: {
      request: {
        ethereumAddress: address,
      },
      context: { serviceName: "lensservice" },
    },
  });

  const [currentUserProfile, setCurrentUserProfile] = useState(
    currentProfileData?.defaultProfile
  );

  useEffect(() => {
    if (userProfilesData?.profiles) {
      const profileId = localStorage.getItem("current_user_profile_id");
      if (profileId) {
        const profile = userProfilesData.profiles.items.find(
          (profile: any) => profile.id === profileId
        );
        if (profile) {
          setCurrentUserProfile(profile);
        } else if (currentProfileData?.defaultProfile) {
          setCurrentUserProfile(currentProfileData?.defaultProfile);
        } else {
          setCurrentUserProfile(userProfilesData.profiles.items[0]);
        }
      }
    }
  }, [userProfilesData?.profiles]);

  // console.log("ALL PROFILES", userProfilesData);
  // console.log("current profile", currentProfileData);

  const injectContext = {
    profiles: userProfilesData?.profiles?.items,
    defaultProfile: currentProfileData?.defaultProfile,
    currentUser: currentUserProfile,
    setCurrentUser: (profile: any) => {
      // console.log(profile);
      setCurrentUserProfile(profile);
      localStorage.setItem("current_user_profile_id", profile.id);
    },
    refechProfiles: refetch,
  };

  if (userProfilesLoading || currentProfileLoading) return <Loading />;

  return (
    <UserContext.Provider value={injectContext}>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-grow">{children}</main>
      </div>
    </UserContext.Provider>
  );
};
