'use client';

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  MDXEditorProps,
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
import { FC, ForwardedRef } from 'react';

interface EditorProps {
  markdown: string;
  editorRef: ForwardedRef<MDXEditorMethods>;
}

const Editor = ({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) => {
  return (
    <MDXEditor
      contentEditableClassName="prose  
       prose-sm dark:prose-invert max-w-none
        prose-h1:text-3xl prose-headings:font-semibold
        prose-h2:text-2xl
        prose-h3:text-xl
        prose-h4:text-lg
        prose-h5:text-base "
      className="h-full overflow-y-auto bg-fuchsia-500
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
        headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4] }),
        tablePlugin(),
        listsPlugin(),
        markdownShortcutPlugin(),
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
      {...props}
      ref={editorRef}
    />
  );
};

export default Editor;
