import React, { PropsWithChildren, useRef } from "react";
import MonacoEditor, { OnChange, OnMount } from "@monaco-editor/react";
import monaco from "monaco-editor/esm/vs/editor/editor.api";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import editorStyle from "./code-editor.module.css";

interface IProps extends PropsWithChildren {
  defaultValue: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<IProps> = (props) => {
  const { defaultValue, onChange } = props;

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleEditorChange: OnChange = (value, _event) => {
    if (value) {
      onChange?.(value);
    }
  };

  const onClickFormat = () => {
    //* Get current value from editor
    const unformatted = editorRef.current?.getValue();

    if (unformatted) {
      //* format that value
      const formatted = prettier.format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        singleQuote: false,
        semi: true,
      }).replace(/\n$/, '');

      //* Set formatted value back in the editor
      editorRef.current?.setValue(formatted);
    }
  };

  return (
    <div className={editorStyle.editorWrapper}>
      <button
        className={`button is-warning is-small ${editorStyle.formatterButton}`}
        onClick={onClickFormat}
      >
        Format
      </button>
      <MonacoEditor
        height="80vh"
        language="javascript"
        theme="vs-dark"
        defaultValue={defaultValue}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        options={{
          wordWrap: "on", //* Make word to  wrap
          minimap: {
            enabled: false, //* Disable minimap
          },
          showUnused: false, //* Don't fade unused statements
          folding: false, //* Collapse left margin of the lines
          lineNumbersMinChars: 3, //* Decrease right side of the line number
          fontSize: 18, //* font size
          scrollBeyondLastLine: false,
          automaticLayout: true, //* Auto adjust for resizing
          tabSize: 2, //* Tab size inside editor
        }}
      />
    </div>
  );
};

export default CodeEditor;
