import { useState, useContext } from "react";
import { UserContext } from "@/components/layout";
import { Button, TextField, Loading } from "../elements";
import { AddPhoto } from "./";

import { useMutation } from "@apollo/client";
import { CREATE_POST_TYPED_DATA } from "@/queries/publications/create-post";
import { uploadIpfs } from "@/lib/ipfs";

import { useSignTypedData, useContractWrite } from "wagmi";
import { omit, splitSignature } from "@/lib/auth-lens/helpers";

import LENS_ABI from "@/abis/lens/Lens-Hub.json";
import { LENS_HUB_PROXY_ADDRESS } from "@/lib/auth-lens/constants";

interface selectedPictureType {
  item: string;
  type: string;
}

export const CreateProject = () => {
  const { defaultProfile } = useContext(UserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPicture, setSelectedPicture] =
    useState<selectedPictureType | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const { signTypedDataAsync } = useSignTypedData();
  const { writeAsync } = useContractWrite({
    addressOrName: LENS_HUB_PROXY_ADDRESS,
    contractInterface: LENS_ABI,
    functionName: "postWithSig",
  });

  const [createPostTypedData, {}] = useMutation(CREATE_POST_TYPED_DATA, {
    onCompleted({ createPostTypedData }: any) {
      if (!createPostTypedData) console.log("createPost is null");
      const { typedData } = createPostTypedData;
      const {
        profileId,
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData,
      } = typedData?.value;

      signTypedDataAsync({
        domain: omit(typedData?.domain, "__typename"),
        types: omit(typedData?.types, "__typename"),
        value: omit(typedData?.value, "__typename"),
      }).then((res: any) => {
        const { v, r, s } = splitSignature(res);
        const postARGS = {
          profileId,
          contentURI,
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
      name,
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
          value: "project",
        },
      ],
      appId: "test project",
    };
    const result = await uploadIpfs({ payload });

    // console.log("result", result);

    createPostTypedData({
      variables: {
        request: {
          profileId: defaultProfile?.id,
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

  if (submitting)
    return (
      <div className="border rounded p-4 md:w-1/2 h-72">
        <Loading message={"Waiting for signing..."} />
      </div>
    );

  return (
    <div className="border rounded p-4 md:w-1/2 text-gray-700">
      <div className="flex justify-between text-sm font-medium mb-4">
        <span>{defaultProfile.handle}</span>
        <span>user id {defaultProfile?.id}</span>
      </div>

      <h1 className="text-center  font-semibold">
        Create Project - user id {defaultProfile?.id}
      </h1>
      <TextField label="name" onChange={(e) => setName(e.target.value)} />
      <TextField
        label="description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <AddPhoto onSelect={(photo) => setSelectedPicture(photo)} />

      <Button
        className="my-4 p-2"
        disabled={name === "" || description === "" || !selectedPicture}
        onClick={() => handleSubmit()}
      >
        Create Project
      </Button>
    </div>
  );
};
