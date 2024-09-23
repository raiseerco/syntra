'use client';

import '../../../src/app/EditorStyle.css';
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  CreateLink,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  UndoRedo,
  markdownShortcutPlugin,
  type MDXEditorProps,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  listsPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import { MDXEditor, MDXEditorMethods } from '@mdxeditor/editor';
import React, { useEffect, useRef, useState } from 'react';
import {
  preprocessMarkdown,
  readDocument,
  readSettings,
  upsertDocument,
} from '../../lib/utils';

import { ALL_DOCS_FOLDER } from '../../lib/constants';
import Loader from './ui/Loader';
import { linkPlugin } from '@mdxeditor/editor';
import {
  BackpackIcon,
  ExclamationTriangleIcon,
  IdCardIcon,
  Link1Icon,
  Link2Icon,
  PersonIcon,
} from '@radix-ui/react-icons';

const MarkdownEditor: React.FC<{
  daoTemplate: any;
  folder: string;
  documentId: string;
  afterSave: () => void;
  projectName: string;
  projects: any[];
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}> = ({
  daoTemplate,
  folder,
  documentId,
  afterSave,
  projectName,
  projects,
  editorRef,
}: any) => {
  const [cont, setCont] = useState('');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [priority, setPriority] = useState('medium');
  const [project, setProject] = useState(projectName);
  const [tags, setTags] = useState([]);
  const [collabs, setCollabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);

        if (documentId !== '0' && typeof daoTemplate?.id === 'undefined') {
          const data = await readDocument(`/${folder}/${documentId}`);
          setTitle(data.title);
          setLink(data.link || '');
          setPriority(data.priority);
          setProject(data.project || 'xxx');
          setTags(data.tags || []);
          setCollabs(data.collabs || []);
          setCont(data.content);
          // initializeEditor(data.content);
        }

        if (documentId === '0' && typeof daoTemplate?.id === 'undefined') {
          setTitle('');
          setLink('');
          setPriority('medium');
          if (project === ALL_DOCS_FOLDER) {
            setProject('Unassigned');
          }

          setTags([]);
          setCollabs([]);
          // initializeEditor();
          return;
        }

        if (documentId === '0' && typeof daoTemplate?.id !== 'undefined') {
          setTitle(`[${daoTemplate.name}]`);
          setLink('');
          setPriority('medium');
          if (project === ALL_DOCS_FOLDER) {
            setProject('Unassigned');
          }
          setTags([]);
          setCollabs([]);
          const contentPre = daoTemplate.markdown;
          console.log('nuevo CON TEMPLATE', daoTemplate.markdown);

          const content = preprocessMarkdown(contentPre);
          setCont(content);
          // initializeEditor(content);
        }

        return;
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();

    return () => {
      // if (viewRef.current) viewRef.current.destroy();
    };
  }, [documentId, folder]);

  const handleSave = async () => {
    console.log('link, cont, title>>>> ', link, cont, title);

    if (
      typeof link !== 'undefined' ||
      cont.trim() !== '' ||
      title.trim() !== ''
    ) {
      console.log('saving!');

      let newTitle = title.trim();
      let newCont = cont.trim();

      if (newTitle === '') {
        newTitle = 'Untitled';
      }

      if (newCont.trim() === '') {
        newCont = ' ';
      }

      console.log('>>>> ', link.trim(), newCont, newTitle);

      setIsSaving(true);
      try {
        const pathName =
          documentId === '0'
            ? `/${folder}/${new Date().getTime().toString()}`
            : `/${folder}/${documentId}`;

        await upsertDocument(
          pathName,
          newCont,
          newTitle,
          link,
          priority,
          project,
          tags,
          collabs,
        );

        afterSave();
        return;
      } catch (error) {
        console.error('Error saving document:', error);
      } finally {
        setIsSaving(false);
      }
    }
    console.log('not saving !');
    afterSave();
    return;
  };

  const handleClose = async () => {
    afterSave();
    setCont('');
    setTitle('');
    setLink('');
    setIsSaving(false);
  };

  return (
    <div id="whole" className="w-full h-screen flex ">
      <div
        id="half1"
        className="w-9/12 border-r h-full mb-10 pb-20 pr-3 border-stone-200 dark:border-stone-700">
        <input
          onChange={e => setTitle(e.target.value)}
          value={title}
          className="py-2 px-3 mr-2 mt-1 mb-4 w-full
            placeholder:dark:text-stone-600 
            placeholder:text-stone-300
            bg-transparent
            outline-none rounded-sm"
          placeholder="Draft title..."
          type="text"
        />

        <MDXEditor
          contentEditableClassName="prose-sm prose dark:prose-invert max-w-none"
          markdown="Hello world"
          className="bg-transparent h-full overflow-y-auto "
          plugins={[
            imagePlugin({
              imageUploadHandler: () => {
                return Promise.resolve('https://picsum.photos/200/300');
              },
              imageAutocompleteSuggestions: [
                'https://picsum.photos/200/300',
                'https://picsum.photos/200',
              ],
            }),

            // headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            linkDialogPlugin(),
            linkPlugin(),
            headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
            tablePlugin(),
            listsPlugin(),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <BoldItalicUnderlineToggles />
                  <CodeToggle />
                  <BlockTypeSelect />
                  <InsertTable />
                  <CreateLink />
                  <ListsToggle />
                  <InsertImage />
                  <InsertThematicBreak />
                </>
              ),
            }),
          ]}
        />
      </div>
      {/* metadata  */}
      <div id="half2" className="w-3/12 h-full pl-4 text-sm flex flex-col">
        {isSaving ? (
          <Loader />
        ) : (
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="text-xs rounded-md px-3 py-2 mt-2
                             dark:hover:bg-stone-700
                             hover:bg-stone-200
                             dark:text-stone-400 text-stone-900">
              Save
            </button>

            <button
              onClick={handleClose}
              className="text-xs rounded-md px-3 py-2 mt-2
                             dark:hover:bg-stone-700
                             hover:bg-stone-200
                             dark:text-stone-400 text-stone-900">
              Close
            </button>
          </div>
        )}

        <div className="flex flex-col gap-2">
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
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
