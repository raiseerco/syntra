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
import { MDXEditorMethods } from 'mdx-float';
import MetadataBar from './MetadataBar';
import { useDAO } from './contexts/DAOContext';

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
  const dn = new Date().getTime().toString();
  const [docName, setDocName] = useState(documentId === '0' ? dn : documentId);
  const ref = React.useRef<MDXEditorMethods>(null);

  const { setBackBehavior, backBehavior } = useDAO();

  const myFn = (e: any) => {
    console.log('eee ');
    // if (e.key === 'Escape') {
    //   console.log('ESCAPE');
    //   e.preventDefault();
    //   setBackBehavior('none');
    // }
  };

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
    setBackBehavior(myFn);
    console.log('backBehavior ', backBehavior);
  }, [documentId, folder]);

  const handleSave = async (exit: boolean = true) => {
    if (link.trim() !== '' || cont.trim() !== '' || title.trim() !== '') {
      console.log('saving! ', typeof link, cont.trim(), title.trim());

      let newTitle = title.trim();
      let newCont = cont.trim();

      if (newTitle === '') {
        newTitle = 'Untitled';
      }

      if (newCont.trim() === '') {
        newCont = ' ';
      }

      setIsSaving(true);

      try {
        const pathName = `/${folder}/${docName}`;

        // const pathName =
        //   documentId === '0' ? `/${folder}/${dn}` : `/${folder}/${documentId}`;

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

        setDocName(dn);

        if (exit) {
          afterSave();
        }
        return;
      } catch (error) {
        console.error('Error saving document:', error);
      } finally {
        setIsSaving(false);
      }
    }
    console.log('not saving !');
    // afterSave();
  };

  const handleClose = async () => {
    afterSave();
    setCont('');
    setTitle('');
    setLink('');
    setIsSaving(false);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      handleSave();
      e.preventDefault();
      e.returnValue = '';
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleSave();
      }
    };

    const saveInterval = setInterval(() => {
      console.log('auto-saving!');
      handleSave(false);
    }, 30000);

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(saveInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [cont, title, link, priority, project, tags, collabs]);

  return (
    <div id="main" className="w-full my-4 flex flex-grow  overflow-y-auto">
      {/* editor  */}
      <div
        className="w-9/12 p-4 relative mb-2
       dark:bg-stone-700 rounded-md shadow-md flex flex-col flex-grow overflow-auto
      bg-white border-stone-200 dark:border-stone-700">
        <input
          onChange={e => setTitle(e.target.value)}
          value={title}
          className="text-2xl w-full 
            placeholder:dark:text-stone-600 
            placeholder:text-stone-300
            bg-transparent 
            outline-none"
          placeholder="Draft title..."
          type="text"
        />

        <ForwardRefEditor
          onChange={(e: any) => setCont(e)}
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
