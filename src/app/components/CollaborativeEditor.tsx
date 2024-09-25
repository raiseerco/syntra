'use client';

import '../../../src/app/EditorStyle.css';

import React, { useEffect, useState } from 'react';
import {
  escapeMD,
  preprocessMarkdown,
  readDocument,
  readSettings,
  upsertDocument,
} from '../../lib/utils';

import { ALL_DOCS_FOLDER } from '../../lib/constants';
import { ForwardRefEditor } from './ForwardRefEditor';
import Loader from './ui/Loader';
import { MDXEditorMethods } from '@mdxeditor/editor';
import MetadataBar from './MetadataBar';

const MarkdownEditor: React.FC<{
  daoTemplate: any;
  folder: string;
  documentId: string;
  afterSave: () => void;
  projectName: string;
  projects: any[];
}> = ({
  daoTemplate,
  folder,
  documentId,
  afterSave,
  projectName,
  projects,
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
  const ref = React.useRef<MDXEditorMethods>(null);

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
          console.log('unescaped!', data.content);
          ref.current?.setMarkdown(
            data.content.replace(/\\([\\`*_{}\[\]()#+\-.!])/g, '$1'),
          );
          // ref.current?.insertMarkdown(data.content);
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
      } catch (error) {
        console.error('Error fetching document:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, folder]);

  const handleSave = async () => {
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

        const escapedContent = escapeMD(newCont);
        console.log('escapedContent ', escapedContent);
        // return;
        await upsertDocument(
          pathName,
          escapedContent,
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
    <div id="main" className="w-full h-screen flex">
      {/* editor  */}
      <div
        className="w-9/12 border-rs h-full mb-10 pb-20 pr-1
      bg-white dark:bg-stone-700 rounded-md shadow-md my-4
      border-stone-200 dark:border-stone-700">
        <input
          onChange={e => setTitle(e.target.value)}
          value={title}
          className="py-2 px-3 mr-2 mt-2 mb-2s text-2xl w-full
            placeholder:dark:text-stone-600 
            placeholder:text-stone-300

            bg-white dark:bg-stone-700 
            outline-none rounded-t-md"
          placeholder="Draft title..."
          type="text"
        />

        <ForwardRefEditor
          onChange={e => setCont(e)}
          markdown={cont}
          ref={ref}
        />
      </div>

      {/* metadata  */}
      <MetadataBar
        documentId={documentId}
        isSaving={isSaving}
        handleSave={handleSave}
        handleClose={handleClose}
        link={link}
        setLink={setLink}
        projectName={projectName}
        projects={projects}
        project={project}
        setProject={setProject}
      />
    </div>
  );
};

export default MarkdownEditor;
