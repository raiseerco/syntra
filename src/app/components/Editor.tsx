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

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary.
 *  Next.js dynamically imported components don't support refs.
 */
const Editor = ({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) => {
  //   console.log('markdown ', markdown);
  //   editorRef?.current?.setMarkdown(markdown);

  return (
    // <MDXEditor
    //   onChange={e => console.log(e)}
    //   ref={editorRef}
    //   markdown={markdown}
    //   plugins={[headingsPlugin()]}
    // />

    <MDXEditor
      //   markdown={markdown}
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
