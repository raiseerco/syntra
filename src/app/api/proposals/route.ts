import { NextResponse } from 'next/server';
const SNAPSHOT_GRAPHQL_URL = 'https://hub.snapshot.org/graphql';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const daoAddress = searchParams.get('daoAddress');

  try {
    const query = `
      query Proposals($space: String!) {
        proposals(
          first: 1000, 
          skip: 0,
          where: {
            space_in: [$space]
          },
          orderBy: "created",
          orderDirection: desc
        ) {
            id
            title
            body
            choices
            start
            end
            snapshot
            state
            author
            space {
              id
              name
            }
        }
      }`;

    const variables = {
      space: daoAddress,
    };

    const res = await fetch(SNAPSHOT_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch proposals' },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data.data.proposals);
  } catch (error) {
    console.error('Error handling GET request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
