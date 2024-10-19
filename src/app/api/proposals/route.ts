import { AuthProvider } from '../../components/contexts/AuthContext';
import { NextResponse } from 'next/server';
import { after } from 'node:test';
import { chainConfig } from 'viem/zksync';
import { title } from 'process';
const SNAPSHOT_GRAPHQL_URL = 'https://hub.snapshot.org/graphql';
const TALLY_GRAPHQL_URL = 'https://api.tally.xyz/query';

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

    // console.log('dataTally', dataTally.data.proposals.nodes[1]);

    // console.log('dataUserSnapshot', dataUserSnapshot.data.users);

    // console.log('dataSnapshot', dataSnapshot.data.proposals[1]);
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

    // this is the data from tally, and the destination format
    // voteStats: [
    //   {
    //     type: 'for',
    //     votesCount: '85944579175198098275816758',
    //     votersCount: 5827,
    //     percent: 84.90720528082699
    //   },

    // this is the data from snapshot, and the source format that need to be converted to tally format
    // "choices": [
    //     "Approve YIP-210",
    //     "Do Not Approve"
    //   ],
    //   "scores": [
    //     286653.5335327927,
    //     0
    //   ],
    //   "scores_state": "final",
    //   "scores_total": 286653.5335327927,
    //   "scores_updated": 1682430127,

    // create a new object with the same format as tally, keep in mind that choinces is an array with any number of choices

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

    const data = {
      tally: dataTallyClipped,
      snapshot: dataSnapshotClipped,
    };

    const fullData = dataTallyClipped.concat(dataSnapshotClipped);

    return NextResponse.json(fullData);
  } catch (error) {
    console.error('Error handling GET request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
