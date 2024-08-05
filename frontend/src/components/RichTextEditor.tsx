import React, { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
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
} from "lucide-react";

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
    <div className="flex flex-wrap items-center gap-1 mb-2 p-1 border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-base">
            Heading <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }>
            Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }>
            Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }>
            Heading 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`h-8 px-2 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`h-8 px-2 ${
          editor.isActive("italic") ? "bg-gray-200" : ""
        }`}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`h-8 px-2 ${
          editor.isActive("bulletList") ? "bg-gray-200" : ""
        }`}>
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`h-8 px-2 ${
          editor.isActive("orderedList") ? "bg-gray-200" : ""
        }`}>
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`h-8 px-2 ${
          editor.isActive("codeBlock") ? "bg-gray-200" : ""
        }`}>
        <Code className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`h-8 px-2 ${
          editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""
        }`}>
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`h-8 px-2 ${
          editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""
        }`}>
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`h-8 px-2 ${
          editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""
        }`}>
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={setLink}
        className={`h-8 px-2 ${editor.isActive("link") ? "bg-gray-200" : ""}`}>
        <LinkIcon className="h-4 w-4" />
      </Button>
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
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: internalContent,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setInternalContent(newContent);
      onChange(newContent);
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none p-4 focus:outline-none",
        style: "height: 400px; overflow-y: auto;",
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
        // If the change is significant, remount the editor
        setKey((prevKey) => prevKey + 1);
        setInternalContent(content);
      } else {
        // For smaller changes, update the content directly
        updateContent(content);
      }
    }
  }, [content, internalContent, updateContent]);

  return (
    <div
      key={key}
      className="border border-gray-300 rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="prose max-w-none p-4" />
    </div>
  );
};

export default RichTextEditor;
