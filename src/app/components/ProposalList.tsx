'use client';

import { getTimeStart, getTimeUntil, shortAddress } from '../../lib/utils';
import { useEffect, useState } from 'react';

import { ChevronDownIcon } from 'lucide-react';
import { ForwardRefEditor } from './ForwardRefEditor';
import { LightningBoltIcon } from '@radix-ui/react-icons';
import Loader from './ui/Loader';
import { MDXEditorMethods } from 'mdx-float';
import React from 'react';
import { fetchSnapshotProposals } from '../../lib/proposals';

interface ProposalListProps {
  daoAddress: string;
}

export const ProposalList = ({ daoAddress }: ProposalListProps) => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cont, setCont] = useState('Select a proposal to view');
  const ref = React.useRef<MDXEditorMethods>(null);

  const openProposal = (proposal: any) => {
    console.log('proposal ', proposal);
    setCont(proposal.body);
    ref.current?.setMarkdown(proposal.body);
  };

  useEffect(() => {
    async function fetchProposals() {
      setIsLoading(true);
      try {
        const tt = await fetchSnapshotProposals(daoAddress);
        setProposals(tt);
        console.log('proposals ', tt);
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
        <div className="w-full h-full flex rounded-lg border bg-stone-100 dark:bg-stone-700">
          {/* left side, the list */}
          <div className="flex px-4 py-2 flex-col w-2/5  h-full ">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-lg">Proposals</span>
              <button
                className=" hover:bg-stone-100 text-stone-800 text-sm
               dark:text-stone-200 py-1 px-2 rounded-md flex items-center">
                Filters
                <ChevronDownIcon className="ml-2 h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col flex-grow overflow-auto mt-4 h-full gap-3 mb-2 w-full">
              {proposals.map((p: any, k: number) => (
                <button
                  key={k}
                  onClick={e => openProposal(p)}
                  className="rounded-lg w-full p-3 gap-2 flex flex-col 
                  bg-white dark:bg-stone-700 cursor-pointer
                  hover:bg-stone-50 hover:dark:bg-stone-600 
                  shadow-md ">
                  <div
                    className={`flex items-center w-full text-md justify-between`}>
                    <span title={p.title} className="text-left truncate ">
                      {/* text-wrap h-14 */}
                      {p.title}
                    </span>
                    <span
                      className={`${
                        p.state === 'active' &&
                        'bg-green-300 dark:bg-green-800 '
                      } 
                         ${
                           p.state === 'closed' && 'bg-red-300 dark:bg-red-800 '
                         } rounded-sm text-xs px-2 py-0`}>
                      {p.state}
                    </span>
                  </div>
                  <div className="text-xs text-left pb-2 text-stone-400 dark:text-stone-600 ">
                    {getTimeStart(p.end)}
                  </div>

                  <div className="text-xs w-full flex justify-between  text-stone-600 dark:text-stone-600 ">
                    <div className="flex gap-3 items-center">
                      <span>{shortAddress(p.author)}</span>
                      <span>•</span>
                      <span>{getTimeUntil(p.start)}</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <LightningBoltIcon width={12} height={12} />
                      Off-Chain
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="flex bg-white -50 px-14 py-3 flex-col w-3/5">
            <ForwardRefEditor markdown={cont} ref={ref} />
          </div>
        </div>
      )}
    </>
  );
};
