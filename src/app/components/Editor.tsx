'use client';

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  H1Toggle,
  H2Toggle,
  H3Toggle,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  MDXEditorProps,
  ParagraphToggle,
  QuoteToggle,
  UndoRedo,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from '@mdxeditor/editor';
import { ForwardedRef, useEffect } from 'react';

const Editor = ({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) => {
  useEffect(() => {
    const handleSelectionChange = () => {
      const toolbar = document.querySelector(
        '.mdxeditor-toolbar._toolbarRoot_uazmk_160',
      );

      const selection = window.getSelection();
      if (typeof selection === 'undefined') return;
      if (selection !== null && !selection.isCollapsed) {
        const isCode =
          selection?.anchorNode?.parentNode?.parentElement?.nodeName === 'CODE';
        const isLexical =
          selection?.anchorNode?.parentElement?.dataset.lexicalText;

        if (isLexical || (!isLexical && isCode)) {
          if (selection?.type === 'Range') {
            const range = selection?.getRangeAt(0);

            if (!range) return;
            const rect = range.getBoundingClientRect();

            (toolbar as HTMLElement).style.display = 'revert-layer';
            (toolbar as HTMLElement).style.position = 'absolute';
            (toolbar as HTMLElement).style.zIndex = '100';

            (toolbar as HTMLElement).style.top = `${
              rect.top + window.scrollY - 107
              // 38
            }px`;

            (toolbar as HTMLElement).style.left = '0px'; //`${ rect.left + window.scrollX }px`;
          }
        }
      } else {
        (toolbar as HTMLElement).style.display = 'none';
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return (
    <MDXEditor
      autoFocus={true}
      placeholder="Write your proposal here..."
      contentEditableClassName="prose  
       prose-sm dark:prose-invert max-w-none
        prose-h1:text-3xl prose-headings:font-semibold
        prose-h2:text-2xl
        prose-h3:text-xl
        prose-h4:text-lg
        prose-h5:text-base "
      className="h-full overflow-y-auto  
        py-3px-5 "
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
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkDialogPlugin(),
        linkPlugin(),
        headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
        tablePlugin(),
        listsPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <CodeToggle />
              <H1Toggle />
              <H2Toggle />
              <H3Toggle />
              <QuoteToggle />
              <ParagraphToggle />
              <InsertTable />
              <CreateLink />
              <ListsToggle />
              <InsertImage />
              <InsertThematicBreak />
            </>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
};

export default Editor;
