import { useState } from "react";
import { Button, TextField, Loading } from "../elements";
import { AddPhoto } from "./";
import { SelectProfile } from "../lens";

import { useMutation } from "@apollo/client";
import { CREATE_COMMENT_TYPED_DATA } from "@/queries/publications/create-comment";
import { uploadIpfs } from "@/lib/ipfs";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/auth-lens/helpers";

import LENS_ABI from "@/abis/lens/Lens-Hub.json";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/auth-lens/constants";

interface selectedPictureType {
  item: string;
  type: string;
}

interface CreateCommentProps {
  publicationId: string;
  onRefetch: () => void;
}

export const CreateComment = ({
  publicationId,
  onRefetch,
}: CreateCommentProps) => {
  const [selectedProfile, setSelectedProfile] = useState<any>();

  const [description, setDescription] = useState("");
  const [selectedPicture, setSelectedPicture] =
    useState<selectedPictureType | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const { signTypedDataAsync } = useSignTypedData();
  const { writeAsync } = useContractWrite({
    addressOrName: LENS_HUB_PROXY_ADDRESS,
    contractInterface: LENS_ABI,
    functionName: "commentWithSig",
  });

  const [createCommentTypedData, {}] = useMutation(CREATE_COMMENT_TYPED_DATA, {
    onCompleted({ createCommentTypedData }: any) {
      const { typedData } = createCommentTypedData;

      if (!createCommentTypedData) console.log("createComment is null");
      const {
        profileId,
        contentURI,
        profileIdPointed,
        pubIdPointed,
        referenceModuleData,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData,
      } = typedData?.value;

      signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        value: omit(typedData?.value, "__typename"),
      }).then((res) => {
        const { v, r, s } = splitSignature(res);
        const postARGS = {
          profileId,
          contentURI,
          profileIdPointed,
          pubIdPointed,
          referenceModuleData,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleInitData,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline,
          },
        };
        writeAsync({ args: postARGS }).then(() => {
          setSubmitting(false);
          onRefetch();
        });
      });
    },
    onError(error) {
      console.log(error);
      setSubmitting(false);
    },
  });

  const handleSubmit = async () => {
    setSubmitting(true);

    let media = [] as any[];

    const payload = {
      name: "Comment by @" + selectedProfile.handle,
      description,
      content: description,
      image: selectedPicture?.item || null,
      imageMimeType: selectedPicture?.type || null,
      media: media,
      attributes: [
        {
          displayType: "string",
          traitType: "publication",
          key: "type",
          value: "project comment",
        },
      ],
      appId: "test project comment",
    };
    const result = await uploadIpfs({ payload });

    // console.log("result", result);

    createCommentTypedData({
      variables: {
        request: {
          profileId: selectedProfile.id,
          publicationId: publicationId,
          contentURI: `https://ipfs.infura.io/ipfs/` + result.path,
          collectModule: {
            freeCollectModule: {
              followerOnly: false,
            },
          },
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        },
      },
    });
  };

  // if (!defaultProfile) return null;

  if (submitting)
    return (
      <div className="border rounded p-4 md:w-1/2 h-72">
        <Loading message={"Waiting for signing..."} />
      </div>
    );

  return (
    <div className="border rounded p-4 md:w-1/2 text-gray-700">
      <SelectProfile onSelect={(profile) => setSelectedProfile(profile)} />

      {!selectedProfile ? (
        <div className="text-center">
          <p className="text-gray-700">
            Please select a profile to make a comment.
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-center  font-semibold">
            Create Comment - {selectedProfile.handle} - id {selectedProfile.id}
          </h1>
          <TextField
            label="comment"
            onChange={(e) => setDescription(e.target.value)}
          />
          <AddPhoto onSelect={(photo) => setSelectedPicture(photo)} />

          <Button
            className="my-4 p-2"
            disabled={description === ""}
            onClick={() => handleSubmit()}
          >
            Create Comment
          </Button>
        </>
      )}
    </div>
  );
};
