import React, { useState, useEffect } from "react";
import { Button, TextField, Loading, Error } from "@/components/elements";
import { AddPhoto } from "../create-project";

interface selectedPictureType {
  item: string;
  type: string;
}

import { useMutation, gql } from "@apollo/client";

export const CREATE_PROFILE = gql`
  mutation ($request: CreateProfileRequest!) {
    createProfile(request: $request) {
      ... on RelayerResult {
        txHash
      }
      ... on RelayError {
        reason
      }
      __typename
    }
  }
`;

export const CreateProfile = () => {
  const [handle, setHandle] = useState("");
  const [selectedPicture, setSelectedPicture] =
    useState<selectedPictureType | null>(null);

  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [createProfile, { data, loading, error }] = useMutation(
    CREATE_PROFILE,
    {
      onCompleted: () => {
        setSubmitSuccess(
          "Profile Created, it may take a few minutes to be visible.  Please refresh the page in a few minutes."
        );
      },
      onError: (error) => {
        console.log("create profile error", error);
        setSubmitError(error.message);
      },
    }
  );
  useEffect(() => {
    if (data?.createProfile.__typename === "RelayError") {
      setSubmitError("Handle already taken");
    }
  }, [data]);

  if (loading) return <Loading />;
  if (error) return <Error />;

  const handleCreateProfile = async () => {
    setSubmitError("");
    await createProfile({
      variables: {
        request: {
          handle: handle.toLowerCase(),
          profilePictureUri: selectedPicture?.item || null,
        },
      },
    });
  };

  if (submitError)
    return (
      <div className="mt-16 mx-auto h-44 w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 rounded-lg shadow-lg max-w-2xl">
        <div className="text-xl font-bold cursor-pointer text-red-600">
          Submission error! {submitError}
        </div>
      </div>
    );

  if (submitSuccess)
    return (
      <div className="mt-16 mx-auto h-44 w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 rounded-lg shadow-lg max-w-2xl">
        <div className="p-4 rounded-xl font-bold text-lg text-center bg-green-700 text-gray-100">
          {submitSuccess}
        </div>
      </div>
    );

  return (
    <div className="mt-16 mx-auto  w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 rounded-lg shadow-lg max-w-2xl">
      <div className="text-center font-bold p-4">Create a profile to post</div>
      <p className="italic text-center p-2 text-red-600">
        profiles can only be created on Mumbai testnet
      </p>
      <TextField
        label="handle"
        value={handle}
        onChange={(e) => setHandle(e.target.value)}
      />
      <AddPhoto onSelect={(photo) => setSelectedPicture(photo)} />

      <Button className="p-2 my-4" onClick={() => handleCreateProfile()}>
        Create A New Profile
      </Button>
      {submitError && (
        <div className="text-red-600 text-center text-xl">{submitError}</div>
      )}
    </div>
  );
};
