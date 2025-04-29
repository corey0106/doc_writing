import { useState } from 'react';
import dynamic from 'next/dynamic';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

const TextEditor = ({ content, onContentChange }) => {
  return (
    <ReactQuill
      value={content}
      onChange={onContentChange}
      modules={{
        toolbar: [
          [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline'],
          [{ 'align': [] }],
          ['link'],
        ],
      }}
    />
  );
};

export default TextEditor;
