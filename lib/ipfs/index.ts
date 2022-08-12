import { create } from "ipfs-http-client";
import { v4 as uuidv4 } from "uuid";

const projectSecret = process.env.NEXT_PUBLIC_INFURA_S;
const projectId = process.env.NEXT_PUBLIC_INFURA_ID;

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
  const auth =
    "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

  const client = create({
    // url: "https://localhost:5001/api/v0",
    url: new URL("https://ipfs.infura.io:5001"),
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      authorization: auth,
    },
  });
  try {
    // console.log("ipfs upload payload", payload);
    const toIpfs = JSON.stringify({
      version: "2.0.0",
      metadata_id: uuidv4(),
      description: payload.description,
      content: payload.content,
      external_url: null,
      image: payload.image || null,
      imageMimeType: payload.imageMimeType || null,
      name: payload.name,
      attributes: payload.attributes || [],
      media: payload.media || [],
      mainContentFocus: "TEXT_ONLY",
      contentWarning: null,
      locale: "en",
      appId: payload.appId || "test project",
    });

    const result = await client.add(toIpfs);
    return result;
  } catch (error) {
    console.log("ipfs upload error", error);
    // throw error;
  }
};
