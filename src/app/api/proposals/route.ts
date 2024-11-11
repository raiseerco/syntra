'use server';

import { NextResponse } from 'next/server';
const SNAPSHOT_GRAPHQL_URL = 'https://hub.snapshot.org/graphql';
const TALLY_GRAPHQL_URL = 'https://api.tally.xyz/query';
const AGORA_URL =
  'https://vote.optimism.io/api/v1/proposals?limit=20&offset=0&filter=everything';
const agoraToken = process.env.BAGORA; // ''; //searchParams.get('agoraToken');

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const daoAddress = searchParams.get('daoAddress');
  const organizationId = searchParams.get('organizationId'); // tallyOrgId

  const moreValue = searchParams.get('moreValue');

  try {
    const querySnapshot = `
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
            scores
            scores_state
            scores_total
            scores_updated
            start
            end
            snapshot
            state
            author
            link
            space {
              id
              name
            }
        }
      }`;

    const varSnapshot = {
      space: daoAddress,
    };

    // snapshot area
    const resSnapshot = await fetch(SNAPSHOT_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: querySnapshot, variables: varSnapshot }),
    });

    const dataSnapshot = await resSnapshot.json();

    const queryUserSnapshot = `
    query getUsers($ids: [String!]) {
      users(where: { id_in: $ids }) {
        id
        name
        twitter
        about
        avatar
        about
      }
    }
  `;

    const varUserSnapshot = {
      ids: dataSnapshot.data.proposals.map((i: any) => i.author),
    };
    const resUserSnapshot = await fetch(SNAPSHOT_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: queryUserSnapshot,
        variables: varUserSnapshot,
      }),
    });

    // tally area
    const queryTally = `
      query Proposals($input: ProposalsInput!) {
        proposals(input: $input) {
          nodes {
            ... on Proposal {
              id
              onchainId
              block {
                id
                number
                timestamp
                ts
              }
              chainId
              creator {
                id
                address
                ens
                twitter
                name
                bio
                picture
                safes
                type
              }
              end {
                ... on Block {
                  ts
                  id
                  timestamp
                }
                ... on BlocklessTimestamp {
                  timestamp
                }
              }
              events {
                block {
                  ts
                  id
                  timestamp
                }
                chainId
                createdAt
                type
                txHash
              }
              executableCalls {
                calldata
                chainId
                index
                signature
                target
                type
                value
              }
              governor {
                id
                chainId
                isIndexing
                isBehind
                isPrimary
                kind
                lastIndexedBlock {
                  timestamp
                  ts
                }
                name
                organization {
                  id
                  creator {
                    name
                    email
                    twitter
                    ens
                    address
                    isOFAC
                    safes
                  }
                  chainIds
                  proposalsCount
                  hasActiveProposals
                  delegatesCount
                  tokenOwnersCount
                  metadata {
                    contact {
                      name
                      email
                      twitter
                      discord
                    }
                  }
                }
                proposalStats {
                  active
                  total
                  failed
                  passed
                }
                quorum
                slug
                timelockId
                tokenId
                token {
                  name
                  id
                  type
                  symbol
                }
                type
                delegatesCount
                delegatesVotesCount
                tokenOwnersCount
                metadata {
                  description
                }
              }
              metadata {
                title
                description
                eta
                ipfsHash
                previousEnd
                timelockId
                txHash
                discourseURL
                snapshotURL
              }
              organization {
                id
                slug
                name
                chainIds
                governorIds
                tokenIds
                metadata {
                  socials {
                    website
                    telegram
                    twitter
                    discord
                  }
                  description
                  contact {
                    name
                    email
                    discord
                    twitter
                  }
                  karmaName
                  icon
                  color
                }
                creator {
                  address
                  name
                  email
                }
                hasActiveProposals
                proposalsCount
                delegatesCount
                delegatesVotesCount
                tokenOwnersCount
              }
              proposer {
                id
                address
                ens
                twitter
                name
                bio
                picture
                safes
                type
              }
              quorum
              status
              start {
                ... on Block {
                  id
                  ts
                  number
                  timestamp
                }
                ... on BlocklessTimestamp {
                  timestamp
                }
              }
              voteStats {
                type
                votesCount
                votersCount
                percent
              }
            }
          }
          pageInfo {
            firstCursor
            lastCursor
            count
          }
        }
      }`;

    const varTally = {
      input: {
        filters: {
          organizationId: organizationId || '',
        },
        page: {} as {
          afterCursor?: string;
        },
      },
    };

    if (moreValue) {
      varTally.input.page.afterCursor = moreValue;
    }

    const resTally = await fetch(TALLY_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Api-key': process.env.NEXT_PUBLIC_TALLY || '',
      },
      body: JSON.stringify({ query: queryTally, variables: varTally }),
    });

    if (!resTally.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch proposals' },
        { status: resTally.status },
      );
    }

    const [dataTally, dataUserSnapshot] = await Promise.all([
      resTally.json(),
      resUserSnapshot.json(),
    ]);

    const dataTallyClipped = dataTally.data.proposals.nodes.map((i: any) => ({
      id: i.id,
      title: i.metadata.title,
      body: i.metadata.description,
      quorum: i.quorum,
      choices: i.voteStats,
      start: new Date(i.start.timestamp).getTime() / 1000,
      end: new Date(i.end.timestamp).getTime() / 1000,
      author: {
        // FIXME proposer?
        address: i.creator.address,
        ens: i.creator.ens,
        twitter: i.creator.twitter,
        name: i.creator.name,
        bio: i.creator.bio,
        picture: i.creator.picture,
        // safes: i.creator.safes, // TBD
        // type: i.creator.type,
      },
      // HACK: rebuilds the url using its own metadata
      // https://www.tally.xyz/gov/arbitrum/proposal/83546392681388778220788629004310255202561156229718364611160970131196959784333?govId=eip155:42161:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4

      link: `https://www.tally.xyz/gov/${i.organization.slug}/proposal/${i.id}`,
      snapshot: i.block.number,
      state: i.status,
      space: 'dummy',
      source: 'tally',
    }));

    // find author in dataUserSnapshot by id
    const findAuthor = (id: string) => {
      const author = dataUserSnapshot.data.users.find((i: any) => i.id === id);
      return author;
    };

    const dataSnapshotClipped = dataSnapshot.data.proposals.map((i: any) => {
      const author = findAuthor(i.author);
      return {
        ...i,
        source: 'snapshot',
        choices: i.choices.map((choice: any, index: number) => ({
          type: choice,
          votesCount: i.scores[index],
          votersCount: i.scores_total,
          percent:
            i.scores_total === 0 ? 0 : (i.scores[index] / i.scores_total) * 100,
        })),

        author: {
          address: i.author,
          ens: author?.name,
          twitter: author?.twitter,
          name: author?.name,
          bio: author?.about,
          picture: `https://cdn.stamp.fyi/avatar/eth:${i.author}`,
        },
      };
    });

    // agora
    const resAgora = await fetch(AGORA_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // HACK: remove this when infrastructure is ready
        Authorization: agoraToken as string,
      },
    });

    if (!resAgora.ok) {
      console.log('resAgora???', resAgora);
      return NextResponse.json(
        { error: 'Failed to fetch proposals' },
        { status: resAgora.status },
      );
    }

    const dataAgora = await resAgora.json();
    const clippedAgora = dataAgora.data.map((i: any) => ({
      id: i.id,
      title: i.markdowntitle,
      body: i.description,
      scores: [],
      scores_state: 'not set',
      scores_total: '',
      scores_updated: '',
      start: new Date(i.startTime).getTime() / 1000,
      end: new Date(i.endTime).getTime() / 1000,
      author: {
        address: i.proposer,
        picture: `https://cdn.stamp.fyi/avatar/eth:${i.proposer}`,
      },
      link: `https://vote.optimism.io/proposals/${i.id}`,
      space: '',

      state:
        new Date(i.endTime).getTime() < new Date().getTime()
          ? 'closed'
          : 'active',
      source: 'agora',
    }));

    const fullData = dataTallyClipped
      .concat(dataSnapshotClipped)
      .concat(clippedAgora);

    return NextResponse.json(fullData);
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
