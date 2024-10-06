'use client';

import { use, useEffect, useState } from 'react';

interface ProposalListProps {
  idDao: string;
}

export const ProposalList = ({ idDao }: ProposalListProps) => {
  //   const [selectedP, setSelectedP] = useState(ALL_DOCS_FOLDER);
  const [proposals, setProposals] = useState([]);
  //   const handleClick = (project: string) => {
  //     setSelectedP(project);
  //     handleSelect(project);
  //   };

  const openProposal = (proposalId: string) => {
    console.log('proposalId ', proposalId);
  };
  // setSelectedP(project);
  // fetch proposals
  useEffect(() => {
    async function fetchProposals() {
      //   try {
      //     const docs = await getDocument('DAOS', idDao, prop);
      //     setProposals(docs?.templates as any);
      //   } catch (err) {
      //     setError('Error fetching documents ');
      //     setLoading(false);
      //   }
    }

    if (!idDao) return;
    fetchProposals();
  }, [idDao]);

  return (
    <div className="w-full p-4 flex flex-col gap-d rounded-lg bg-stone-100 dark:bg-stone-700">
      {/* left side, the list */}
      <div className="flex flex-col p-2">
        {proposals.map((p, k) => (
          <div key={k}>
            <button
              onClick={e => openProposal(p)}
              className={`${
                'selectedP === p.project'
                  ? 'bg-stone-100 dark:bg-stone-500 dark:text-stone-800'
                  : 'bg-transparent '
              } hover:bg-stone-100 dark:hover:bg-stone-500 hover:dark:text-stone-800
                        px-4 py-2 rounded-md cursor-pointer w-full
                        text-sm flex justify-between`}>
              <div className={`flex items-center gap-2`}>
                {/* <span>{p.id}</span> */}
              </div>
              {/* <span className="text-right font-light">{p.drafts} draft(s)</span> */}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
