import { NextResponse } from 'next/server';
const SNAPSHOT_GRAPHQL_URL = 'https://hub.snapshot.org/graphql';
const TALLY_GRAPHQL_URL = 'https://api.tally.xyz/query';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const daoAddress = searchParams.get('daoAddress');

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
          // FIXME
          governorId: 'eip155:42161:0x789fC99093B09aD01C34DC7251D0C89ce743e5a4',
        },
      },
    };

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

    const [dataTally, dataSnapshot] = await Promise.all([
      resTally.json(),
      resSnapshot.json(),
    ]);

    // consolidate data
    const data = {};

    // FIXME
    return NextResponse.json(data.data.proposals);
  } catch (error) {
    console.error('Error handling GET request:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
