import { NextRequest, NextResponse } from 'next/server';

import FormData from 'form-data';
import fs from 'fs';

export const POST = async (req: NextRequest) => {
  try {
    const form = new FormData();
    const { fileName, fileContent } = await req.json();

    // Crea un buffer desde el contenido del archivo
    const buffer = Buffer.from(fileContent, 'base64');
    form.append('file', buffer, fileName);

    const response = await fetch(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PINATA_API_KEY}:${process.env.PINATA_SECRET_API_KEY}`,
          ...form.getHeaders(), // Añade los headers generados por FormData
        },
        body: form as unknown as BodyInit,
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to upload to Pinata: ${response.statusText}`);
    }

    const result = await response.json();
    return NextResponse.json({ success: true, cid: result.IpfsHash });
  } catch (error: any) {
    console.error('Error uploading to Pinata:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
};
