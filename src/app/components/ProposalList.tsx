'use client';

import * as Progress from '@radix-ui/react-progress';
import * as Tabs from '@radix-ui/react-tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/Avatar';

import { ChevronDownIcon, LinkIcon } from 'lucide-react';
import {
  getTimeUntil,
  getTimeAgo,
  shortAddress,
  parseIPFS,
} from '../../lib/utils';
import { useEffect, useState } from 'react';

import { ForwardRefEditor } from './ForwardRefEditor';
import { LightningBoltIcon } from '@radix-ui/react-icons';
import Loader from './ui/Loader';
import { MDXEditorMethods } from 'mdx-float';
import React from 'react';
import { fetchSnapshotProposals } from '../../lib/proposals';

interface ProposalListProps {
  daoAddress: string;
  tallyOrgId: string;
}

const DEFAULT_EMPTY = '← Select a proposal to view';

const ProposalCard = ({ p, index, openProposal, selectedProposal }: any) => {
  const isSelected = selectedProposal === index;
  const isSnapshot = p.source === 'snapshot';
  const baseStyle = `rounded-lg w-full p-4 gap-2 flex flex-col mb-3 box-border dark:opacity-70 transition-all
                     hover:shadow-md cursor-pointer`;
  const bgColor = isSnapshot
    ? 'bg-amber-50 dark:bg-amber-200 hover:bg-amber-50 dark:hover:bg-amber-300'
    : 'bg-blue-50 dark:bg-blue-200 hover:bg-blue-50 dark:hover:bg-blue-300';
  const selectedStyle = isSelected
    ? isSnapshot
      ? 'dark:bg-amber-300 border-amber-200 dark:border-amber-500 border-2 shadow-md'
      : 'dark:bg-blue-300 border-blue-200 dark:border-blue-500 border-2 shadow-md'
    : '';

  return (
    <button
      key={index}
      onClick={() => openProposal(p, index)}
      className={`${baseStyle} ${bgColor} ${selectedStyle}`}>
      <div className="flex items-center w-full text-md justify-between">
        {/* <span title={p.title} className="text-left truncate "> */}
        <span
          title={p.title}
          className="text-left overflow-hidden whitespace-nowrap truncate hover:animate-scroll hover:truncate-none">
          {p.title}
        </span>
        <ProposalStateBadge state={p.state} />
      </div>
      <div className="text-xs text-left pb-2 text-stone-400 dark:text-stone-600">
        {getTimeUntil(p.end)}
      </div>
      <ProposalDetails p={p} />
    </button>
  );
};

const ProposalStateBadge = ({ state }: { state: string }) => {
  const stateClasses: any = {
    active: 'bg-green-100 dark:bg-green-500 text-green-600 dark:text-green-50',
    closed: 'bg-slate-300 dark:bg-stone-100 dark:text-slate-800',
    default: 'bg-blue-200 dark:bg-blue-400 dark:text-blue-50',
  };
  return (
    <span
      className={`rounded-xl text-xs px-3 py-1 ${
        stateClasses[state] || stateClasses.default
      }`}>
      {state.charAt(0).toUpperCase() + state.slice(1)}
    </span>
  );
};

const AuthorPill = ({ authorObject }: any) => {
  return (
    <div className="flex gap-3 items-center">
      {/* picture */}
      <Avatar className="h-6 w-6">
        <AvatarImage src={authorObject.picture} alt={authorObject.name} />
        <AvatarFallback>{authorObject.name}</AvatarFallback>
      </Avatar>
      <span>{shortAddress(authorObject.ens || authorObject.address)}</span>
    </div>
  );
};

const ProposalDetails = ({ p }: any) => (
  <div className="text-xs w-full flex justify-between text-stone-600 dark:text-stone-600">
    <div className="flex gap-3 items-center">
      <AuthorPill authorObject={p.author} />
      <span>•</span>
      <span>{getTimeAgo(p.start)}</span>
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
          <LinkIcon className="text-blue-600" width={12} height={12} />
          On-Chain
        </>
      )}
    </div>
  </div>
);

export const ProposalList = ({ daoAddress, tallyOrgId }: ProposalListProps) => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [showClosed, setShowClosed] = useState(false);
  const [cont, setCont] = useState(DEFAULT_EMPTY);
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [openedProposal, setOpenedProposal] = useState<>();
  const ref = React.useRef<MDXEditorMethods>(null);

  const openProposal = (p: any, index: number) => {
    setCont(p.body);
    ref.current?.setMarkdown(p.body);
    setSelectedProposal(index);
    setOpenedProposal(p);
    console.log('ppp', p);
  };

  useEffect(() => {
    async function fetchProposals() {
      setIsLoading(true);
      try {
        const tt = await fetchSnapshotProposals(daoAddress, tallyOrgId);
        console.log('tt', tt);
        setProposals(tt);
      } catch (err) {
        console.error('err ', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (daoAddress) fetchProposals();
  }, [daoAddress]);

  if (isLoading) return <Loader />;

  return (
    <div className="w-full h-full flex rounded-lg border border-stone-100 dark:border-stone-700 dark:bg-stone-700">
      <div className="flex py-2 flex-col w-2/5 h-full">
        <div className="px-3 flex justify-between items-center dark:text-stone-400 text-stone-600">
          <span className="font-semibold text-lg">Proposals</span>
          <button className="hover:bg-stone-100 hover:dark:bg-stone-600 text-stone-800 text-sm dark:text-stone-400 py-1 px-2 rounded-md flex items-center">
            Filters <ChevronDownIcon className="ml-2 h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col flex-grow overflow-auto mt-3 px-3 h-full mb-2 w-full">
          {proposals
            ?.filter((p: any) => p.state === 'active')
            .map((p: any, k: number) => (
              <ProposalCard
                key={k}
                p={p}
                index={k}
                openProposal={openProposal}
                selectedProposal={selectedProposal}
              />
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
              ?.filter((p: any) => p.state !== 'active')
              .map((p: any, k: number) => (
                <ProposalCard
                  key={k}
                  p={p}
                  index={k}
                  openProposal={openProposal}
                  selectedProposal={selectedProposal}
                />
              ))}
        </div>
      </div>

      <div className="flex flex-col flex-grow overflow-auto gap-4 bg-stone-100 dark:bg-stone-800 dark:text-stone-400 px-10 py-6 w-full">
        <div
          className={`flex rounded-md shadow-sm bg-white dark:bg-stone-700 dark:text-stone-300 px-8 py-4 w-full ${
            showMore ? 'h-auto' : 'h-64'
          } flex-col transition-all`}>
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
                <span className="text-lg font-semibold">Off-Chain vote</span>
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
                  <Tabs.Content value="tab1" className="w-full space-y-4 p-4">
                    <div className="flex flex-col gap-4 text-sm text-stone-600 dark:text-stone-400">
                      {openedProposal &&
                        openedProposal.choices.map((c: string, k: number) => (
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
  );
};
