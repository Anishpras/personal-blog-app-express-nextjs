import React, { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  ChevronDown,
  AlignJustify,
} from "lucide-react";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) {
      return;
    }

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="control-group" style={{ marginBottom: "10px" }}>
      <div className="button-group">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 px-2 ${editor.isActive("bold") ? "is-active" : ""}`}>
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 px-2 ${
            editor.isActive("italic") ? "is-active" : ""
          }`}>
          <Italic className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-base">
              Heading <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <DropdownMenuItem
                key={level}
                onSelect={() =>
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: level as HeadingLevel })
                    .run()
                }
                className={
                  editor.isActive("heading", { level }) ? "is-active" : ""
                }>
                H{level}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 px-2 ${
            editor.isActive("bulletList") ? "is-active" : ""
          }`}>
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 px-2 ${
            editor.isActive("orderedList") ? "is-active" : ""
          }`}>
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`h-8 px-2 ${
            editor.isActive("codeBlock") ? "is-active" : ""
          }`}>
          <Code className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`h-8 px-2 ${
            editor.isActive({ textAlign: "left" }) ? "is-active" : ""
          }`}>
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`h-8 px-2 ${
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          }`}>
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`h-8 px-2 ${
            editor.isActive({ textAlign: "right" }) ? "is-active" : ""
          }`}>
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`h-8 px-2 ${
            editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
          }`}>
          <AlignJustify className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={setLink}
          className={`h-8 px-2 ${editor.isActive("link") ? "is-active" : ""}`}>
          <LinkIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
}) => {
  const [key, setKey] = useState(0);
  const [internalContent, setInternalContent] = useState(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Color,
      TextStyle,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: internalContent,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setInternalContent(newContent);
      onChange(newContent);
    },
    editorProps: {
      attributes: {
        class: "tiptap",
        style: `
            height: 400px;
            overflow-y: auto;
            padding: 1rem;
            border: 1px solid #ccc;
            border-radius: 0.5rem;
          `,
      },
    },
  });

  const updateContent = useCallback(
    (newContent: string) => {
      if (editor && newContent !== editor.getHTML()) {
        editor.commands.setContent(newContent, false);
        setInternalContent(newContent);
      }
    },
    [editor]
  );

  useEffect(() => {
    if (content !== internalContent) {
      if (Math.abs(content.length - internalContent.length) > 10) {
        setKey((prevKey) => prevKey + 1);
        setInternalContent(content);
      } else {
        updateContent(content);
      }
    }
  }, [content, internalContent, updateContent]);

  return (
    <div key={key}>
      <style jsx global>{`
        .tiptap {
          > * + * {
            margin-top: 0.75em;
          }

          ul,
          ol {
            padding: 0 1rem;
            margin: 1rem 0;
          }

          ul {
            list-style-type: disc;
          }

          ol {
            list-style-type: decimal;
          }

          li {
            margin-bottom: 0.5em;
          }

          li > p {
            margin: 0;
          }

          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            line-height: 1.1;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }

          h1 {
            font-size: 2em;
          }
          h2 {
            font-size: 1.5em;
          }
          h3 {
            font-size: 1.17em;
          }
          h4 {
            font-size: 1em;
          }
          h5 {
            font-size: 0.83em;
          }
          h6 {
            font-size: 0.67em;
          }

          code {
            background-color: rgba(97, 97, 97, 0.1);
            color: #616161;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-size: 0.85em;
          }

          pre {
            background: #0d0d0d;
            color: #fff;
            font-family: "JetBrainsMono", monospace;
            padding: 0.75rem 1rem;
            border-radius: 0.5rem;

            code {
              color: inherit;
              padding: 0;
              background: none;
              font-size: 0.8rem;
            }
          }

          img {
            max-width: 100%;
            height: auto;
          }

          blockquote {
            padding-left: 1rem;
            border-left: 2px solid rgba(13, 13, 13, 0.1);
            font-style: italic;
            margin: 1rem 0;
          }

          hr {
            border: none;
            border-top: 2px solid rgba(13, 13, 13, 0.1);
            margin: 2rem 0;
          }
        }
      `}</style>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
