import {
  BackpackIcon,
  ExclamationTriangleIcon,
  IdCardIcon,
  Link2Icon,
  PersonIcon,
} from '@radix-ui/react-icons';

import Loader from './ui/Loader';

interface MetadataBarProps {
  documentId: string;
  isSaving: boolean;
  handleSave: () => void;
  handleClose: () => void;
  link: string;
  setLink: (link: string) => void;
  projectName: string;
  projects: any[];
  project: string;
  setProject: (project: string) => void;
}

export default function MetadataBar({
  documentId,
  isSaving,
  handleSave,
  handleClose,
  link,
  setLink,
  projectName,
  projects,
  project,
  setProject,
}: MetadataBarProps) {
  return (
    <div id="half2" className="w-3/12 h-full pl-4 text-sm flex flex-col">
      {isSaving ? (
        <Loader />
      ) : (
        <div className="flex justify-end gap-2">
          {/* <button
            onClick={handleSave}
            className="text-xs rounded-md px-3 py-2 mt-2
                             dark:hover:bg-stone-700
                             hover:bg-stone-200
                             dark:text-stone-400 text-stone-900">
            Save
          </button> */}

          {/* <button
            onClick={handleClose}
            className="text-xs rounded-md px-3 py-2 mt-2
                             dark:hover:bg-stone-700
                             hover:bg-stone-200
                             dark:text-stone-400 text-stone-900">
            Close
          </button> */}
        </div>
      )}

      <div className="flex flex-col mt-4 px-2 gap-2">
        <div className="flex flex-col gap-1 mb-1">
          <div className="flex gap-2 items-center">
            <Link2Icon /> Related Discussion Link
          </div>
          <input
            onChange={e => setLink(e.target.value)}
            value={link}
            className="py-2 px-3 w-full
            placeholder:dark:text-stone-600 
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm"
            placeholder="Enter an url..."
            type="text"
          />
        </div>
        <div className="flex flex-col gap-1 mb-1">
          <div className="flex gap-2 items-center">
            <BackpackIcon />
            Project
          </div>
          <select
            value={documentId === '0' ? projectName : project}
            onChange={e => setProject(e.target.value)}
            className="py-2 px-3 mr-2 w-full
            placeholder:dark:text-stone-800 
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm">
            {projects.map((i: any, k: number) => (
              <option key={k} value={i.project}>
                {i.project}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 mb-1">
          <div className="flex gap-2 items-center">
            <IdCardIcon />
            Label
          </div>
          <select
            className="py-2 px-3 mr-2 
            placeholder:dark:text-stone-800 
            placeholder:text-stone-300  w-full
            bg-white dark:bg-stone-700
            outline-none opacity-50  rounded-sm"></select>
        </div>

        <div className="flex flex-col gap-1 mb-1">
          <div className="flex gap-2 items-center">
            <ExclamationTriangleIcon />
            Priority
          </div>
          <select
            disabled
            className="py-2 px-3 mr-2 
            placeholder:dark:text-stone-600  w-full
            placeholder:text-stone-300
            bg-white dark:bg-stone-700
            outline-none rounded-sm  opacity-50  ">
            <option value={'medium'}></option>
          </select>
        </div>

        <div className="flex flex-col gap-1 mb-1">
          <div className="flex gap-2 items-center">
            <PersonIcon />
            Collaborators
          </div>
          <select
            disabled
            className="py-2 px-3 mr-2 
            placeholder:dark:text-stone-800 
            placeholder:text-stone-300  w-full
            bg-white dark:bg-stone-700
            outline-none rounded-sm">
            <option value={'critical'}> </option>
            <option value={'high'}> </option>
            <option defaultValue={''} value={''}></option>
            <option value={'low'}> </option>
          </select>
        </div>

        <hr className="border-stone-200 dark:border-stone-700 my-4" />
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="text-xs rounded-md px-8 py-3 
                             dark:bg-stone-700 dark:hover:bg-stone-900 dark:text-stone-400
                             hover:bg-stone-300 bg-stone-200
                              text-stone-900">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
