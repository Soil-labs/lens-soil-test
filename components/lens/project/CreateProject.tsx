import { useContext, useState } from "react";
import { UserContext } from "@/components/layout";
import { Button, TextField, Loading } from "@/components/elements";
import { AddPhoto } from "./";

import { useMutation } from "@apollo/client";
import { CREATE_POST_TYPED_DATA } from "@/queries/lens/publications/create-post";
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
  const { currentUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPicture, setSelectedPicture] =
    useState<selectedPictureType | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      setError("please login with lens");
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
          profileId: currentUser.id,
          contentURI: `https://ipfs.infura.io/ipfs/` + result?.path,
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
      context: { serviceName: "lensservice" },
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
      {!currentUser || !currentUser.id ? (
        <div className="text-center">
          <p className="text-gray-700">
            Please select a profile to create a project.
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-center  font-semibold">
            Create Project - {currentUser.handle} - id {currentUser.id}
          </h1>
          <TextField label="name" onChange={(e) => setName(e.target.value)} />
          <TextField
            label="description"
            onChange={(e) => setDescription(e.target.value)}
          />
          {/* <AddPhoto onSelect={(photo) => setSelectedPicture(photo)} /> */}

          <Button
            className="my-4 p-2"
            disabled={name === "" || description === ""}
            onClick={() => handleSubmit()}
          >
            Create Project
          </Button>
          <div
            className={`p-4 font-bold text-xl text-red-600 uppercase text-center`}
          >
            {error}
          </div>
        </>
      )}
    </div>
  );
};
