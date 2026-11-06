import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import type { ReactNode } from 'react';

import { Bold, Italic, List, ListOrdered, Link as LinkIcon, RemoveFormatting } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

interface ToolbarButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

function emptyToString(editor: Editor): string {
  return editor.isEmpty ? '' : editor.getHTML();
}

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={`
        flex size-9 shrink-0 items-center justify-center
        rounded-md transition-colors duration-150
        disabled:cursor-not-allowed disabled:opacity-40
        ${
          active
            ? 'bg-teal-100 text-teal-800'
            : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
        }
      `}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px shrink-0 bg-gray-200" aria-hidden="true" />;
}

export default function RichTextEditor({ value, onChange, disabled = false }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      Placeholder.configure({
        placeholder: 'Add details (optional)',
      }),
    ],
    content: value || '',
    editable: !disabled,
    parseOptions: {
      // Prevents TipTap from squashing newlines and multiple spaces on paste
      preserveWhitespace: 'full',
    },
    editorProps: {
      attributes: {
        'aria-label': 'Task description',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(emptyToString(currentEditor));
    },
  });

  useEffect(() => {
    editor?.setEditable(!disabled);
  }, [editor, disabled]);

  useEffect(() => {
    if (!editor) return;
    const currentContent = emptyToString(editor);
    const nextContent = value || '';
    if (currentContent !== nextContent) {
      editor.commands.setContent(nextContent || '<p></p>');
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="w-full min-w-0 overflow-hidden rounded-lg border border-gray-300">
        <div className="h-11 animate-pulse bg-gray-50" />
        <div className="min-h-30 animate-pulse bg-white" />
      </div>
    );
  }

  const handleLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter link URL', previousUrl || '');

    if (url === null) return;
    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  return (
    <div
      className={`
        w-full min-w-0 overflow-hidden rounded-lg border bg-white
        transition-all duration-150
        ${
          disabled
            ? 'border-gray-200 bg-gray-50'
            : 'border-gray-300 focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100'
        }
      `}
    >
      {/* Toolbar */}
      <div
        role="toolbar"
        aria-label="Text formatting"
        className="flex w-full flex-wrap items-center gap-0.5 border-b border-gray-200 bg-gray-50 p-1"
      >
        <ToolbarButton
          label="Bold"
          active={editor.isActive('bold')}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold size={18} strokeWidth={2.2} />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive('italic')}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton
          label="Bulleted list"
          active={editor.isActive('bulletList')}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive('orderedList')}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={18} />
        </ToolbarButton>
        <ToolbarDivider />
        <ToolbarButton
          label="Insert link"
          active={editor.isActive('link')}
          disabled={disabled}
          onClick={handleLink}
        >
          <LinkIcon size={18} />
        </ToolbarButton>
        <ToolbarButton
          label="Clear formatting"
          disabled={disabled}
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        >
          <RemoveFormatting size={18} />
        </ToolbarButton>
      </div>

      <EditorContent
        editor={editor}
        className="tiptap-editor w-full min-w-0 text-base text-gray-700"
      />
    </div>
  );
}
