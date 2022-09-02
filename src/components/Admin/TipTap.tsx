import { Button, Box, Divider, SimpleGrid } from '@chakra-ui/react';
import {
  BsChatLeftQuote,
  BsCode,
  BsCodeSquare,
  BsParagraph,
  BsTypeBold,
  BsTypeH1,
  BsTypeH2,
  BsTypeH3,
  BsTypeItalic,
  BsTypeStrikethrough,
} from 'react-icons/bs';
import {
  MdFormatClear,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdHorizontalRule,
  MdRedo,
  MdUndo,
} from 'react-icons/md';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const MenuBar: React.FC<{ editor: Editor | null }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <SimpleGrid columns={8} spacing={2}>
      {/* heading1 */}
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <BsTypeH1 />
      </Button>
      {/* heading2 */}
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <BsTypeH2 />
      </Button>
      {/* heading3 */}
      <Button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        <BsTypeH3 />
      </Button>
      {/* paragraph */}
      <Button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive('paragraph') ? 'is-active' : ''}
      >
        <BsParagraph />
      </Button>
      {/* bold */}
      <Button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <BsTypeBold />
      </Button>
      {/* italic */}
      <Button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <BsTypeItalic />
      </Button>
      {/* strikethrough */}
      <Button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <BsTypeStrikethrough />
      </Button>
      {/* code */}
      <Button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'is-active' : ''}
      >
        <BsCode />
      </Button>
      {/* clear marks */}
      <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
        <MdFormatClear />
      </Button>
      {/* bullet list */}
      <Button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <MdFormatListBulleted />
      </Button>
      {/* ordered list */}
      <Button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <MdFormatListNumbered />
      </Button>
      {/* code block */}
      <Button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
      >
        <BsCodeSquare />
      </Button>
      {/* block quote */}
      <Button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        <BsChatLeftQuote />
      </Button>
      {/* line */}
      <Button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <MdHorizontalRule />
      </Button>
      {/* undo */}
      <Button onClick={() => editor.chain().focus().undo().run()}>
        <MdUndo />
      </Button>
      {/* redo */}
      <Button onClick={() => editor.chain().focus().redo().run()}>
        <MdRedo />
      </Button>
    </SimpleGrid>
  );
};

const TipTap: React.FC<{
  setContent: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setContent }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  return (
    <Box borderWidth={1} rounded={'lg'} pt={2} px={2}>
      <MenuBar editor={editor} />
      <Divider py={2} />
      <EditorContent editor={editor} />
    </Box>
  );
};

export default TipTap;
