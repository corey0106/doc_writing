import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; 
import axios from 'axios';
import { useRouter } from 'next/router';

const Editor = dynamic(() => import('../components/Editor'), {
  ssr: false 
});

export default function EditorPage() {
  const [documentText, setDocumentText] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [instructions, setInstructions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const filename = localStorage.getItem('uploadedFilename');
    if (!filename) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleEdit = async () => {
    const filename = localStorage.getItem('uploadedFilename');

    if (!filename) {
      alert('No file selected for editing.');
      return;
    }

    setIsLoading(true);

    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_URL
        ? process.env.NEXT_PUBLIC_BACKEND_URL
        : "http://localhost:5000"; 
      const res = await axios.post(url + '/edit', {
        selectedSection,
        instructions,
        user_id: localStorage.getItem('email'),
        filename,
      });

      if (res.data && res.data.revisedText) {
        console.log('Revised text:', res.data.revisedText);

        const fullDocument = documentText;
        const updatedText = res.data.revisedText;

        const updatedDocument = fullDocument.replace(selectedSection, updatedText);

        setDocumentText(updatedDocument);
      } else {
        console.error('No revised text received.')
      }
      
    } catch (error) {
      console.error('Error during editing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {   
    try {  
        const url = process.env.NEXT_PUBLIC_BACKEND_URL
        ? process.env.NEXT_PUBLIC_BACKEND_URL
        : "http://localhost:5000"; 
      const res = await axios.post(url + '/export', {
        content: documentText, 
        filename: 'revised_document.txt',
      }); 
      if (res.status === 200) {
        const blob = new Blob([res.data], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'revised_document.txt';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) { 
      console.error('Error during export:', error);
    }
  };

  return (
    <div className="container">
      <h1>Document Editor</h1>
      <Editor content={documentText} onContentChange={setDocumentText} />
      <textarea
        value={selectedSection}
        onChange={(e) => setSelectedSection(e.target.value)}
        placeholder="Select section to edit"
      />
      <textarea
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        placeholder="Enter editing instructions"
      />
      <button type='button' onClick={handleEdit} disabled={isLoading}>{isLoading ? 'Editing...' : 'Edit Section'}</button>
      <button onClick={handleExport}>Export Document</button>
    </div>
  );
}
