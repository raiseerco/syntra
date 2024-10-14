'use client';

import * as Progress from '@radix-ui/react-progress';
import * as Tabs from '@radix-ui/react-tabs';

import { ChevronDownIcon, LinkIcon } from 'lucide-react';
import { LightningBoltIcon, Link1Icon } from '@radix-ui/react-icons';
import { getTimeStart, getTimeUntil, shortAddress } from '../../lib/utils';
import { useEffect, useState } from 'react';

import { ForwardRefEditor } from './ForwardRefEditor';
import Loader from './ui/Loader';
import { MDXEditorMethods } from 'mdx-float';
import React from 'react';
import { fetchSnapshotProposals } from '../../lib/proposals';

interface ProposalListProps {
  daoAddress: string;
  tallyOrgId: string;
}

const DEFAULT_EMPTY = '← Select a proposal to view';

export const ProposalList = ({ daoAddress, tallyOrgId }: ProposalListProps) => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [showClosed, setShowClosed] = useState(false);
  const [cont, setCont] = useState(DEFAULT_EMPTY);
  const [proposal, setProposal] = useState<any>();
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const ref = React.useRef<MDXEditorMethods>(null);

  const openProposal = (p: any, index: number) => {
    console.log('proposal ', p);
    setCont(p.body);
    setProposal(p);
    ref.current?.setMarkdown(p.body);
    setSelectedProposal(index);
  };

  useEffect(() => {
    async function fetchProposals() {
      setIsLoading(true);
      try {
        const tt = await fetchSnapshotProposals(daoAddress, tallyOrgId);
        setProposals(tt);
      } catch (err) {
        console.log('err ', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (daoAddress) {
      fetchProposals();
    }
  }, [daoAddress]);

  return (
    <>
      {isLoading ? (
        <div className="w-full p-4">
          <Loader />
        </div>
      ) : (
        <div className="w-full h-full flex rounded-lg border border-stone-100 dark:border-stone-700 dark:bg-stone-700">
          {/* Left side, the list */}
          <div className="flex py-2 flex-col w-2/5 h-full">
            <div className="px-3 flex justify-between items-center dark:text-stone-400 text-stone-600">
              <span className="font-semibold text-lg">Proposals</span>
              <button
                className=" hover:bg-stone-100 hover:dark:bg-stone-600 text-stone-800 text-sm
               dark:text-stone-400 py-1 px-2 rounded-md flex items-center">
                Filters
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col flex-grow overflow-auto mt-3 px-3 h-full mb-2 w-full">
              {proposals
                ?.filter((p: any) => p.state !== 'closed')
                .map((p: any, k: number) => (
                  <button
                    key={k}
                    onClick={() => openProposal(p, k)}
                    className={`rounded-lg w-full p-4 gap-2 flex flex-col mb-3 box-border dark:opacity-70 transition-all
                   hover:shadow-md cursor-pointer

                   ${
                     p.source === 'snapshot'
                       ? 'bg-amber-50 dark:bg-amber-200 hover:bg-amber-50 dark:hover:bg-amber-300'
                       : 'bg-blue-50 dark:bg-blue-200 hover:bg-blue-50 dark:hover:bg-blue-300'
                   }

                   ${
                     selectedProposal === k
                       ? p.source === 'snapshot'
                         ? '  dark:bg-amber-300 border-amber-200 box-border dark:border-amber-500 border-2 shadow-md transition-all '
                         : '  dark:bg-blue-300 border-blue-200 box-border dark:border-blue-500 border-2 shadow-md transition-all '
                       : ''
                   }`}>
                    <div className="flex items-center w-full text-md justify-between">
                      <span title={p.title} className="text-left truncate ">
                        {p.title}
                      </span>

                      <span
                        className={`${
                          p.state === 'active' &&
                          'bg-green-300 dark:bg-green-500 '
                        }
                         ${
                           p.state === 'closed' && 'bg-red-300 dark:bg-red-400 '
                         } rounded-sm text-xs px-2 py-1`}>
                        {p.state}
                      </span>
                    </div>
                    <div className="text-xs text-left pb-2 text-stone-400 dark:text-stone-600 ">
                      {getTimeStart(p.end)}
                    </div>

                    <div className="text-xs w-full flex justify-between text-stone-600 dark:text-stone-600">
                      <div className="flex gap-3 items-center">
                        <span>{shortAddress(p.author)}</span>
                        <span>•</span>
                        <span>{getTimeUntil(p.start)}</span>
                      </div>
                      <div className="flex gap-1 items-center">
                        {p.source !== 'tally' ? (
                          <>
                            <LightningBoltIcon
                              className="text-amber-400"
                              width={12}
                              height={12}
                            />
                            Off-Chain
                          </>
                        ) : (
                          <>
                            <LinkIcon
                              className="text-blue-600"
                              width={12}
                              height={12}
                            />
                            On-Chain
                          </>
                        )}
                      </div>
                    </div>
                  </button>
                ))}

              <div className="flex gap-2 w-full justify-center">
                <button
                  onClick={() => setShowClosed(!showClosed)}
                  className="border text-xs w-full px-3 py-2 dark:border-stone-500 dark:text-stone-400 rounded-md mb-3">
                  Past votes {showClosed ? '↑' : '↓'}
                </button>
              </div>
              {showClosed &&
                proposals
                  ?.filter((p: any) => p.state === 'closed')
                  .map((p: any, k: number) => (
                    <button
                      key={k}
                      onClick={() => openProposal(p, k)}
                      className={`rounded-lg w-full p-4 gap-2 flex flex-col mb-3 box-border dark:opacity-70 transition-all
                   hover:shadow-md cursor-pointer

                   ${
                     p.source === 'snapshot'
                       ? 'bg-amber-50 dark:bg-amber-200 hover:bg-amber-50 dark:hover:bg-amber-300'
                       : 'bg-blue-50 dark:bg-blue-200 hover:bg-blue-50 dark:hover:bg-blue-300'
                   }

                   ${
                     selectedProposal === k
                       ? p.source === 'snapshot'
                         ? '  dark:bg-amber-300 border-amber-200 box-border dark:border-amber-500 border-2 shadow-md transition-all '
                         : '  dark:bg-blue-300 border-blue-200 box-border dark:border-blue-500 border-2 shadow-md transition-all '
                       : ''
                   }`}>
                      <div className="flex items-center w-full text-md justify-between">
                        <span title={p.title} className="text-left truncate ">
                          {p.title}
                        </span>
                        <span
                          className={`${
                            p.state === 'active' &&
                            'bg-green-300 dark:bg-green-500 '
                          }
                         ${
                           p.state === 'closed' && 'bg-red-300 dark:bg-red-400 '
                         } rounded-sm text-xs px-2 py-1`}>
                          {p.state}
                        </span>
                      </div>
                      <div className="text-xs text-left pb-2 text-stone-400 dark:text-stone-600 ">
                        {getTimeStart(p.end)}
                      </div>

                      <div className="text-xs w-full flex justify-between text-stone-600 dark:text-stone-600">
                        <div className="flex gap-3 items-center">
                          <span>{shortAddress(p.author)}</span>
                          <span>•</span>
                          <span>{getTimeUntil(p.start)}</span>
                        </div>
                        <div className="flex gap-1 items-center">
                          {p.source !== 'tally' ? (
                            <>
                              <LightningBoltIcon
                                className="text-amber-400"
                                width={12}
                                height={12}
                              />
                              Off-Chain
                            </>
                          ) : (
                            <>
                              <LinkIcon
                                className="text-blue-600"
                                width={12}
                                height={12}
                              />
                              On-Chain
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
            </div>
          </div>

          <div className="flex flex-col flex-grow overflow-auto gap-4 bg-stone-100 dark:bg-stone-800 dark:text-stone-400 px-10 py-6 w-full ">
            <div
              className={`flex rounded-md shadow-sm bg-white dark:bg-stone-700 dark:text-stone-300 px-8 py-4 w-full ${
                showMore ? 'h-autos' : 'h-64'
              } flex-col w-3/5 transition-all duration-300 ease-in-out`}>
              <ForwardRefEditor readOnly markdown={cont} ref={ref} />

              {cont !== DEFAULT_EMPTY && (
                <div className="pt-4 pb-1">
                  <button
                    onClick={() => setShowMore(!showMore)}
                    className="border dark:border-stone-500 text-xs px-3 py-1 rounded-md">
                    {showMore ? '⇡ Show less' : '⇣ Show more'}
                  </button>
                </div>
              )}
            </div>

            {cont !== DEFAULT_EMPTY && (
              <>
                <div className="rounded-md shadow-sm bg-white dark:bg-stone-700 dark:text-stone-400 px-8 py-6 w-full">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-lg font-semibold">Discussion</span>
                    <span className="bg-stone-100 dark:bg-stone-600 rounded-md text-xs px-2 py-1">
                      Governance
                    </span>
                  </div>
                  <span className="text-sm py-2 text-stone-500 dark:text-stone-400">
                    Join the conversation about this proposal
                  </span>
                </div>

                <div className="rounded-md shadow-sm bg-white dark:bg-stone-700 dark:text-stone-400 px-8 py-6 w-full">
                  <div className="flex w-full items-center justify-between">
                    <span className="text-lg font-semibold">
                      Off-Chain vote
                    </span>
                  </div>

                  {/* Tabs Root */}
                  <div className="flex gap-4 dark:text-stone-300 py-6 rounded-lg w-full  ">
                    <Tabs.Root
                      defaultValue="tab1"
                      className="w-full"
                      orientation="vertical">
                      {/* Tabs List */}
                      <Tabs.List
                        aria-label="tabs example"
                        className="flex text-sm pb-4 gap-2">
                        <Tabs.Trigger
                          value="tab1"
                          className="px-4 py-2 rounded-lg text-center text-stone-700 dark:text-stone-400 bg-transparent dark:bg-transparent hover:bg-stone-200 dark:hover:bg-stone-700 transition-all data-[state=active]:bg-stone-100 dark:data-[state=active]:bg-stone-600">
                          Current Results
                        </Tabs.Trigger>
                        <Tabs.Trigger
                          value="tab2"
                          className="px-4 py-2 rounded-lg text-center text-stone-700 dark:text-stone-400 bg-transparent dark:bg-transparent hover:bg-stone-200 dark:hover:bg-stone-700 transition-all data-[state=active]:bg-stone-100 dark:data-[state=active]:bg-stone-600">
                          Cast Your Vote
                        </Tabs.Trigger>
                        <Tabs.Trigger
                          value="tab3"
                          className="px-4 py-2 rounded-lg text-center text-stone-700 dark:text-stone-400 bg-transparent dark:bg-transparent hover:bg-stone-200 dark:hover:bg-stone-700 transition-all data-[state=active]:bg-stone-100 dark:data-[state=active]:bg-stone-600">
                          Votes Info
                        </Tabs.Trigger>
                      </Tabs.List>

                      {/* Tabs Content */}
                      <Tabs.Content
                        value="tab1"
                        className="w-full space-y-4 p-4">
                        <div className="flex flex-col gap-4 text-sm text-stone-600 dark:text-stone-400">
                          {proposal &&
                            proposal.choices.map((c: string, k: number) => (
                              <div key={k} className="flex flex-col gap-2">
                                <span className="text-stone-700 dark:text-stone-300">
                                  {c}
                                </span>
                                <Progress.Root
                                  className="relative overflow-hidden bg-stone-300 dark:bg-stone-600 rounded-full w-full h-2"
                                  value={2}>
                                  <Progress.Indicator
                                    className="bg-stone-500 dark:bg-black h-full rounded-full transition-transform"
                                    style={{
                                      transform: `translateX(-${100 - 2}%)`,
                                    }}
                                  />
                                </Progress.Root>
                              </div>
                            ))}
                        </div>
                      </Tabs.Content>

                      <Tabs.Content
                        value="tab2"
                        className="w-full p-4 h-40 text-center">
                        <p className="text-lg text-stone-700 dark:text-stone-300">
                          Coming soon...
                        </p>
                      </Tabs.Content>

                      <Tabs.Content
                        value="tab3"
                        className="w-full p-4 h-40 text-center">
                        <p className="text-lg text-stone-700 dark:text-stone-300">
                          More coming soon...
                        </p>
                      </Tabs.Content>
                    </Tabs.Root>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
