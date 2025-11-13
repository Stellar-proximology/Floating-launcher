import React from 'react'
import FloatingChatBox from './components/FloatingChatBox'
import FloatingUrlSelector from './components/FloatingUrlSelector'

export default function App() {
  return (
    <div className="min-h-screen w-full relative">
      <FloatingChatBox />
      <FloatingUrlSelector />
    </div>
  );
}
