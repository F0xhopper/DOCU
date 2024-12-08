import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "eu-north-1", // Replace with your region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_KEY as string,
  },
});

export const uploadFile = async (file: any) => {
  const params: PutObjectCommandInput = {
    Bucket: process.env.S3_BUCKET || "",
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
  };

  try {
    const data = await s3.send(new PutObjectCommand(params));
    console.log("Upload success:", data);
    return data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};
