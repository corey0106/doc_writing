import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Home() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_URL
        ? process.env.NEXT_PUBLIC_BACKEND_URL
        : "http://localhost:5000";
      const res = await axios.post(url + '/auth', { email });
      if (res.data.success) {
        localStorage.setItem('email', email);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Authentication Error:', error);
    }
  };

  return (
    <div className="container">
      <h1>Welcome to the Document Writing Platform</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}