import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import type { Editor } from '@tiptap/react';
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function emptyToString(editor: Editor): string {
  return editor.isEmpty ? '' : editor.getHTML();
}

export default function RichTextEditor({ value, onChange, disabled = false }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false })],
    content: value,
    editable: !disabled,
    editorProps: {
      attributes: {
        'aria-label': 'Task description',
        'data-placeholder': 'Add details (optional)',
      },
    },
    onUpdate: ({ editor: currentEditor }) => onChange(emptyToString(currentEditor)),
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== (value || '<p></p>'))
      editor.commands.setContent(value || '<p></p>');
  }, [editor, value]);

  if (!editor)
    return (
      <div className="overflow-hidden rounded-lg border border-gray-300">
        <div className="min-h-32 animate-pulse bg-gray-100" />
      </div>
    );

  const button = (label: string, active: boolean, action: () => void) => (
    <button
      className="min-h-9 min-w-9 rounded-md px-2 text-xs text-gray-600 hover:bg-teal-50 disabled:opacity-50"
      type="button"
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={action}
    >
      {label}
    </button>
  );

  return (
    <div className="overflow-hidden rounded-lg border border-gray-300">
      <div className="flex gap-1 border-b border-gray-200 bg-gray-50 p-1">
        {button('Bold', editor.isActive('bold'), () => editor.chain().focus().toggleBold().run())}
        {button('Italic', editor.isActive('italic'), () =>
          editor.chain().focus().toggleItalic().run()
        )}
        {button('Bulleted list', editor.isActive('bulletList'), () =>
          editor.chain().focus().toggleBulletList().run()
        )}
        {button('Numbered list', editor.isActive('orderedList'), () =>
          editor.chain().focus().toggleOrderedList().run()
        )}
        {button('Link', editor.isActive('link'), () => {
          const href = window.prompt('Link URL');
          if (href) editor.chain().focus().setLink({ href }).run();
        })}
        {button('Clear formatting', false, () =>
          editor.chain().focus().clearNodes().unsetAllMarks().run()
        )}
      </div>
      <EditorContent editor={editor} className="min-h-32 text-sm text-gray-600" />
    </div>
  );
}
