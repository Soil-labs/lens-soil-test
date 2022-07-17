import { useState } from "react";
import ImageUploading from "react-images-uploading";
import { Button } from "@/components/elements";
import { uploadImageIpfs } from "@/lib/ipfs/ipfsImage";

type AddPhotoProps = {
  title?: string;
  description?: string;
  onSelect: (image: any) => void;
};

export const AddPhoto = ({ title, description, onSelect }: AddPhotoProps) => {
  const [uploadImage, setUploadImage] = useState([]);
  const maxNumber = 1;

  const onChange = async (imageList: any) => {
    let ipfsImage = null;
    if (imageList[0]) ipfsImage = await uploadImageIpfs(imageList[0]);

    onSelect(ipfsImage);
    setUploadImage(imageList);
  };

  return (
    <div className="py-1 px-2 text-stone-500 my-auto rounded-lg">
      <ImageUploading
        multiple
        value={uploadImage}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemove,
          isDragging,
          dragProps,
        }) => (
          <div className="">
            {uploadImage[0] ? (
              <>
                {imageList.map((image: any, index: any) => (
                  <div key={index} className="flex w-full justify-between mt-4">
                    <img
                      className="h-20 rounded-full"
                      src={image.data_url}
                      alt=""
                    />
                    <div className="flex flex-col space-y-4">
                      <Button
                        className="py-1 px-2"
                        onClick={() => onImageRemove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <button
                type="button"
                className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-6 text-center hover:border-gray-400 focus:outline-none"
                style={isDragging ? { color: "red" } : {}}
                onClick={() => {
                  onImageRemove(0);
                  onImageUpload();
                }}
                {...dragProps}
              >
                <span className="mt-2 block text-md font-medium text-gray-900">
                  {title || "Add Photo"}
                </span>
                <span className="mt-2 block text-sm font-medium text-gray-600">
                  {description}
                </span>
              </button>
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
};
