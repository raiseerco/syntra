'use client';

import * as Progress from '@radix-ui/react-progress';
import * as Tabs from '@radix-ui/react-tabs';

import { useEffect, useState } from 'react';

import { ALL_DOCS_FOLDER } from '../../lib/constants';
import CollaborativeEditor from './CollaborativeEditor';
import { ForwardRefEditor } from './ForwardRefEditor';
import Loader from './ui/Loader';
import { MDXEditorMethods } from 'mdx-float';
import { Pencil2Icon } from '@radix-ui/react-icons';
import { ProposalCard } from './ui/ProposalCard';
import { ProposalFilters } from './ui/ProposalFilters';
import React from 'react';
import { fetchSnapshotProposals } from '../../lib/proposals';
import { useAuth } from './contexts/AuthContext';
import { useMixpanel } from './contexts/mixpanelContext';

interface ProposalListProps {
  daoAddress: string;
  tallyOrgId: string;
  idDao: string;
}

const DEFAULT_EMPTY = '← Select a proposal to view';

export const ProposalList = ({
  daoAddress,
  tallyOrgId,
  idDao,
}: ProposalListProps) => {
  const [baseProposals, setBaseProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const [selectedProject, setSelectedProject] = useState(ALL_DOCS_FOLDER);
  const { trackEvent } = useMixpanel();
  const { user } = useAuth();

  const [daoTemplate, setDaoTemplate] = useState<any>('Write something... ');
  const [documentId, setDocumentId] = useState<any>(0);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [filters, setFilters] = useState({
    type: 'all',
    time: 'all',
    status: 'all',
  });

  const [showClosed, setShowClosed] = useState(false);
  const [cont, setCont] = useState(DEFAULT_EMPTY);
  const [selectedProposal, setSelectedProposal] = useState<number | null>(null);
  const [openedProposal, setOpenedProposal] = useState<any>();
  const ref = React.useRef<MDXEditorMethods>(null);

  const openProposal = (p: any, index: number) => {
    setCont(p.body);
    ref.current?.setMarkdown(p.body);
    setSelectedProposal(index);
    setOpenedProposal(p);
    console.log('ppp', p);
    trackEvent('open-proposal', {
      user: user?.wallet?.address,
      proposal: p.id,
    });
  };

  async function fetchProposals() {
    setIsLoading(true);
    try {
      const tt = await fetchSnapshotProposals(daoAddress, tallyOrgId);
      console.log('tt', tt);
      setBaseProposals(tt);
      setFilteredProposals(tt);
    } catch (err) {
      console.error('err ', err);
    } finally {
      setIsLoading(false);
    }
  }

  const filterProposals = (filters: any) => {
    // type
    const filtered = baseProposals.filter((p: any) => {
      if (filters.type === 'all') return true;
      if (filters.type === 'off-chain' && p.source === 'snapshot') return true;
      if (filters.type === 'on-chain' && p.source !== 'snapshot') return true;
      return false;
    });

    // status
    const filtered3 = filtered.filter((p: any) => {
      if (filters.status === 'all') return true;
      if (filters.status === 'active' && p.state === 'active') return true;
      if (filters.status === 'closed' && p.state !== 'active') return true;
      return false;
    });

    setFilteredProposals(filtered3);
  };

  useEffect(() => {
    if (daoAddress) fetchProposals();
  }, [daoAddress]);

  if (isLoading) return <Loader />;

  return (
    <>
      {!isEditorOpen && (
        <div className="w-full h-full flex rounded-lg border border-stone-100 dark:border-stone-700 dark:bg-stone-700">
          <div className="flex py-2 flex-col w-2/5 h-full">
            <div className="px-3 flex justify-between items-center dark:text-stone-400 text-stone-600">
              <span className="font-semibold text-lg">Proposals</span>
              <ProposalFilters
                filters={filters}
                setFilters={setFilters}
                filterProposals={filterProposals}
              />
            </div>

            {/* proposals area  */}
            <div className="flex flex-col flex-grow overflow-auto mt-3 px-3 h-full mb-2 w-full">
              {filteredProposals &&
                filteredProposals
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
                filteredProposals
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
              {cont !== DEFAULT_EMPTY && (
                <div className="flex justify-end w-full">
                  <button
                    onClick={() => {
                      setDocumentId('0');
                      setDaoTemplate('Write your proposal here');
                      setIsEditorOpen(true);
                    }}
                    className="items-center rounded-md flex gap-1 px-2 py-1 text-xs border">
                    <Pencil2Icon />
                    New draft
                  </button>
                </div>
              )}

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
                          {openedProposal &&
                            openedProposal.choices.map((c: any, k: number) => (
                              <div key={k} className="flex flex-col gap-1">
                                <div className="flex justify-between">
                                  <span className="text-stone-700 dark:text-stone-300">
                                    {c.type}
                                  </span>

                                  <span className="text-stone-700 dark:text-stone-300">
                                    {/* FIXME  */}
                                    {c.votesCount} ({c.percent.toFixed(2)}
                                    %)
                                  </span>
                                </div>
                                <Progress.Root
                                  className="relative overflow-hidden bg-stone-300 dark:bg-stone-600 rounded-full w-full h-2"
                                  value={c.percent}>
                                  <Progress.Indicator
                                    className="bg-stone-900 dark:bg-black h-full rounded-full transition-transform"
                                    style={{
                                      transform: `translateX(-${
                                        100 - c.percent
                                      }%)`,
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

      {/* sliding editor */}
      {isEditorOpen && (
        <div
          className=" px-4
                bg-stone-100 dark:bg-stone-800 dark:text-stone-400
                shadow-lg w-full  
                transition-opacity duration-300 ease-in-out flex flex-col flex-grow overflow-auto
                opacity-100">
          {/* {user?.wallet?.address && idDao && ( */}
          <CollaborativeEditor
            daoTemplate={daoTemplate}
            folder={`${idDao}/${user?.wallet?.address}`}
            documentId={documentId}
            // afterSave={fetchDocuments}
            afterSave={() => {
              console.log('after save');
            }}
            projectName={selectedProject}
            // projects={projects.filter(
            //   (r: any) => r.project !== ALL_DOCS_FOLDER,
            // )}
            projects={[]}
          />
          {/* )} */}
        </div>
      )}
    </>
  );
};
