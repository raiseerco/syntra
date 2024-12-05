import FormData from 'form-data';

type UploadToPinataResult = {
  success: boolean;
  cid?: string;
  error?: string;
};

export const uploadToPinata = async (
  fileName: string,
  fileContent: string,
): Promise<UploadToPinataResult> => {
  try {
    const form = new FormData();
    const buffer = Buffer.from(fileContent, 'base64');
    form.append('file', buffer, fileName);

    const response = await fetch(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PINATA_API_KEY}:${process.env.PINATA_SECRET_API_KEY}`,
          ...form.getHeaders(),
        },
        body: form as unknown as BodyInit,
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to upload to Pinata: ${response.statusText}`);
    }

    const result = await response.json();
    return { success: true, cid: result.IpfsHash };
  } catch (error: any) {
    console.error('Error uploading to Pinata:', error);
    return { success: false, error: error.message };
  }
};
