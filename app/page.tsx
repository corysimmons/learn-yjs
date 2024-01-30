'use client'

import { useEffect, useRef, useState } from 'react';
import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';
import { nanoid } from 'nanoid';
import useFingerprintUsername from '../hooks/useFingerprintUsername';

type Message = {
  id: string;
  author: string;
  text: string;
};

export default function Page() {
  const ydocRef = useRef(new Y.Doc());
  const providerRef = useRef<WebrtcProvider>();
  const username = useFingerprintUsername(); // Get the username from the hook
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    providerRef.current = new WebrtcProvider('your-room-namesdoasdjkasodkasdokasodkasodkkasdk22323', ydocRef.current);

    const yArray = ydocRef.current.getArray<Message>('shared-messages');

    yArray.observe(() => {
      setMessages(yArray.toArray());
    });

    return () => {
      providerRef.current?.destroy();
    };
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username) { // Only send message if username is set
      const yArray = ydocRef.current.getArray<Message>('shared-messages');
      yArray.push([{ id: nanoid(), author: username, text: messageText }]);
      setMessageText('');
    }
  };

  return (
    <div className='m-auto p-8 max-w-7xl'>
      <h1 className='mb-10 text-2xl font-bold'>Y.js + WebRTC in Next.js</h1>

      <form className='flex flex-col gap-4 items-start' onSubmit={sendMessage}>
        <div className="rounded-md px-3 pb-1.5 pt-2.5 shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 min-w-[600px]">
          <label htmlFor="name" className="block text-xs font-medium text-gray-900">
            Your name: {username}
          </label>
          <input
            type="text"
            className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Send
        </button>
      </form>

      <div className='mt-10 flex flex-col gap-6'>
        <h2 className='text-xl font-bold'>Messages</h2>
        <ul className='flex flex-col gap-2'>
          {messages.map(msg => (
            <li key={msg.id} className='flex gap-2'><b>{msg.author}:</b> <span className='flex-1 text-slate-400'>{msg.text}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
};
