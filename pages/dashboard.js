import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const router = useRouter();

  const handleFileUpload = async (e) => {
    console.log("the upoload button is triggered.");
    e.preventDefault();

    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('document', file);

    try {
        const url = process.env.NEXT_PUBLIC_BACKEND_URL
        ? process.env.NEXT_PUBLIC_BACKEND_URL
        : "http://localhost:5000";
      const res = await axios.post(url + '/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Backend Response:', res.data); // Log the response for debugging

      if (res.data.success) {
        localStorage.setItem('uploadedFilename', res.data.filename); // Store the filename
        console.log('Filename saved:', res.data.filename);
        router.push('/editor'); // Redirect to the editor page
      } else {
        alert('File upload failed: ' + res.data.error); // Display error message
      }
    } catch (error) {
      console.error('Upload Error:', error); // Log the error for debugging
      alert('There was an error uploading the file');
    }
  };

  return ( 
    <div className="container">
      <h1>Your Documents</h1>
      <form onSubmit={handleFileUpload}>
        <input 
          type="file" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        <button type="submit">Upload Document</button>
      </form>
      <button onClick={() => router.push('/editor')}>Create New Document</button>
    </div>
  );
}
