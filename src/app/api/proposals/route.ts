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

    const [dataTally, dataSnapshot] = await Promise.all([
      resTally.json(),
      resSnapshot.json(),
    ]);

    // FIXME data clipping

    // this is the structure to use
    //   {
    //     "id": "0x29dd01ffe47f08352a79e5b8aab35d3cf8ba5bc60710fedeea821df181afcb23",
    //     "title": "Perpie LTIPP Council Recommended Proposal",
    //     "body": "## Link to Application\nhttps://forum.arbitrum.foundation/t/perpie-ltipp-application-draft/22079\n\n## Council - 3/3 Yes Votes\n\n### Feedback\n\n*Wintermute Feedback)*\nPerpie’s application is pretty solid and ticks off a lot of criteria. The main areas they lost points in are the grant request size in conjunction with the product’s usage and age.\n\nTheir distribution strategy seems fine although there may be potential for users to abuse self-referral rebates. Nonetheless, the distribution strategy is heavily focused on the end user and promoting trading activity on Arbitrum which is great.\n\nWhile we don’t think the grant size is justified, we plan to support Perpie as the Telegram bot industry has seen high demand. Thus, we think it’s reasonable for delegates to decide the outcome.\n\n*Karel Feedback)*\n\"Vote FOR Perpie's proposal.\n\nGood proposal that scored well across rubric. Supportive as given nature of the product (Telegram bot), composability, and usage in line with GMX STIP campaign. Keen to see other aspects of roadmap implemented. Over to the DAO.\"\t\t\n\n*404 Feedback)*\nOverall, Perpie’s application was decent and they addressed all the necessary components. They have had strong usage during other incentive programs, retention is a bit of a concern though. While the grant ask is a little high we support Perpie as demand for the TG bot industry is evident and is something Arbitrum DAO should support for LTIPP",
    //     "choices": [
    //         "For",
    //         "Against",
    //         "Abstain"
    //     ],
    //     "start": 1712620800,
    //     "end": 1713225600,
    //     "snapshot": 199011809,
    //     "state": "closed",
    //     "author": "0x18BF1a97744539a348304E9d266aAc7d446a1582",
    //     "space": {
    //         "id": "arbitrumfoundation.eth",
    //         "name": "Arbitrum DAO"
    //     }
    // }

    const dataTallyClipped = dataTally.data.proposals.nodes.map((i: any) => ({
      id: i.id,
      title: i.metadata.title,
      body: i.metadata.description,
      choices: ['For', 'Against', 'Abstain'],
      start: i.start.timestamp,
      end: i.end.timestamp,
      author: i.proposer.address, // FIXME creator?
      snapshot: i.block.number,
      state: i.status,
      space: 'dummy',
      source: 'tally',
    }));

    const dataSnapshotClipped = dataSnapshot.data.proposals.map((i: any) => ({
      ...i,
      source: 'snapshot',
    }));

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
