import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FiFile, FiPlus, FiSave, FiFolder } from 'react-icons/fi';

const Workspace = ({ project, onProjectSave }) => {
  const [files, setFiles] = useState(project.files || {});
  const [activeFile, setActiveFile] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [showProjectsList, setShowProjectsList] = useState(false);

  const languageMap = {
    html: 'html',
    markdown: 'markdown',
    python: 'python',
    react: 'javascript',
    node: 'javascript'
  };

  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    roundedSelection: false,
    automaticLayout: true,
    fontFamily: 'JetBrains Mono',
    contextmenu: false,
    theme: 'vs-dark',
    scrollBeyondLastLine: false
  };

  useEffect(() => {
    if (!activeFile && Object.keys(files).length > 0) {
      setActiveFile(Object.keys(files)[0]);
    }
  }, [files]);

  const createFile = () => {
    const defaultContent = {
      html: '<!DOCTYPE html>\n<html>\n<head>\n\t<title>New Document</title>\n</head>\n<body>\n\n</body>\n</html>',
      markdown: '# New Document',
      python: '# Python script\nprint("Hello World")',
      react: 'import React from "react";\n\nexport default function App() {\n return (\n <div>\n \n </div>\n );\n}',
      node: 'const express = require("express");\nconst app = express();\n\napp.get("/", (req, res) => {\n res.send("Hello World");\n});\n\napp.listen(3000);'
    };

    const newFiles = { ...files };
    newFiles[newFileName] = defaultContent[project.type] || '';
    setFiles(newFiles);
    setNewFileName('');
    saveProject(newFiles);
  };

  const saveProject = (updatedFiles) => {
    const updatedProject = { ...project, files: updatedFiles };
    onProjectSave(updatedProject);
  };

  return (
    <div className="workspace">
      <div className="file-manager">
        <div className="file-header">
          <div className="project-actions">
            <button 
              className="open-project-btn"
              onClick={() => setShowProjectsList(!showProjectsList)}
            >
              <FiFolder/> Открыть проект
            </button>
            <button 
              className="save-project-btn"
              onClick={() => saveProject(files)}
            >
              <FiSave/> Сохранить проект
            </button>
          </div>

          <div className="file-actions">
            <input
              type="text"
              placeholder="Имя файла"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
            />
            <button onClick={createFile}><FiPlus/> Создать</button>
          </div>
        </div>

        <div className="file-list">
          {Object.keys(files).map((fileName) => (
            <div 
              key={fileName} 
              className={`file-item ${activeFile === fileName ? 'active' : ''}`}
              onClick={() => setActiveFile(fileName)}
            >
              <FiFile className="file-icon"/>
              {fileName}
            </div>
          ))}
        </div>
      </div>

      <div className="editor-container">
        {activeFile && (
          <Editor
            height="100%"
            width="100%"
            language={languageMap[project.type]}
            value={files[activeFile]}
            options={editorOptions}
            onChange={(value) => {
              const updatedFiles = { ...files };
              updatedFiles[activeFile] = value;
              setFiles(updatedFiles);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Workspace;