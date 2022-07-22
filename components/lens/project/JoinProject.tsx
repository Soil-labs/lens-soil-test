import { useContext, useState } from "react";
import { UserContext } from "@/components/layout";
import { Button, Loading } from "@/components/elements";

import { useSignTypedData, useContractWrite } from "wagmi";

import { useMutation, gql } from "@apollo/client";
import { omit, splitSignature } from "@/lib/auth-lens/helpers";

import LENS_ABI from "@/abis/lens/Lens-Hub.json";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/auth-lens/constants";

export const CREATE_COLLECT_TYPED_DATA = gql`
  mutation ($request: CreateCollectRequest!) {
    createCollectTypedData(request: $request) {
      id
      expiresAt
      typedData {
        types {
          CollectWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          pubId
          data
        }
      }
    }
  }
`;

interface JoinProjectProps {
  publication: any;
  onSuccess: () => void;
}

export const JoinProject = ({ publication, onSuccess }: JoinProjectProps) => {
  const { currentUser } = useContext(UserContext);
  const { collectModule, hasCollectedByMe } = publication;
  const [submitting, setSubmitting] = useState(false);

  const { signTypedDataAsync } = useSignTypedData();
  const { writeAsync } = useContractWrite({
    addressOrName: LENS_HUB_PROXY_ADDRESS,
    contractInterface: LENS_ABI,
    functionName: "collectWithSig",
  });

  const [createCollectTypedData, {}] = useMutation(CREATE_COLLECT_TYPED_DATA, {
    onCompleted({ createCollectTypedData }: any) {
      const { typedData } = createCollectTypedData;
      if (!createCollectTypedData)
        console.log("createCollectTypedData is null");
      const { profileId, pubId, data } = typedData?.value;

      signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        value: omit(typedData?.value, "__typename"),
      }).then((res) => {
        if (res) {
          const { v, r, s } = splitSignature(res);
          const postARGS = {
            collector: currentUser?.ownedBy,
            profileId,
            pubId,
            data,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };

          writeAsync({ args: postARGS }).then((res) => {
            res.wait(1).then(() => {
              onSuccess();
              setSubmitting(false);
            });
          });
        }
      });
    },
    onError(error) {
      console.log(error);
      setSubmitting(false);
    },
  });

  const handleCollect = () => {
    setSubmitting(true);
    createCollectTypedData({
      variables: {
        request: {
          publicationId: publication.id,
        },
      },
      context: { serviceName: "lensservice" },
    });
  };

  if (collectModule.__typename !== "FreeCollectModuleSettings") return null;

  if (submitting) return <Loading message={"Submitting..."} />;
  return (
    <>
      {hasCollectedByMe ? (
        <div className="w-36 text-center rounded-xl border-2 border-stone-800 shadow-md font-bold bg-green-600 text-gray-100">
          Joined
        </div>
      ) : (
        <Button
          className="w-36"
          disabled={hasCollectedByMe}
          onClick={() => handleCollect()}
        >
          Join Project
        </Button>
      )}
    </>
  );
};
