export const uploadImageIpfs = async (payload: any) => {
  const formData = new FormData();
  formData.append("file", payload.file, "img");

  const upload = await fetch("https://ipfs.infura.io:5001/api/v0/add", {
    method: "POST",
    body: formData,
  });
  const { Hash }: { Hash: string } = await upload.json();

  return {
    item: `https://ipfs.infura.io/ipfs/${Hash}`,
    type: payload.file.type,
  };
};
