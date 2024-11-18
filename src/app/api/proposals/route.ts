'use server';

import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

const db = admin.firestore();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const daoName = searchParams.get('daoName');

  try {
    const proposalsCollection = db.collection(`DAOS/${daoName}/proposals`);
    const items = await proposalsCollection.get();

    const proposals = items.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ ok: true, data: proposals });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        ok: false,
        status: 500,
        message: error.message,
        statusText: error.message,
      }),
      {
        status: 500,
        statusText: error.message,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }
}
