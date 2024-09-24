'use client';

import type { ForwardedRef } from 'react';
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  tablePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  BlockTypeSelect,
  InsertTable,
  CreateLink,
  ListsToggle,
  InsertImage,
  InsertThematicBreak,
} from '@mdxeditor/editor';

export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      contentEditableClassName="prose 
        prose-sm  dark:prose-invert max-w-none
        prose-h1:text-3xl prose-headings:font-semibold
        prose-h2:text-2xl
        prose-h3:text-xl
        prose-h4:text-lg
        prose-h5:text-base "
      className="bg-transparent h-full overflow-y-auto 
        shadow-md py-3 px-5 bg-white dark:bg-stone-700 rounded-md"
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
}
