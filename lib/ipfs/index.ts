import { create } from "ipfs-http-client";
import { v4 as uuidv4 } from "uuid";

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});

type uploadIpfsProps = {
  payload: {
    name: string;
    description: string;
    content: string;
    image: string | null;
    imageMimeType: any | null;
    attributes: any[];
    media: any[];
    appId: string;
  };
};

export const uploadIpfs = async ({ payload }: uploadIpfsProps) => {
  // console.log("ipfs upload payload", payload);
  const result = await client.add(
    JSON.stringify({
      version: "1.0.0",
      metadata_id: uuidv4(),
      description: payload.description,
      content: payload.content,
      external_url: null,
      image: payload.image || null,
      imageMimeType: payload.imageMimeType || null,
      name: payload.name,
      attributes: payload.attributes || [],
      media: payload.media || [],
      appId: payload.appId || "soil",
    })
  );

  return result;
};
