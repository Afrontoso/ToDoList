import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Routes } from './routes'
import { GlobalStyle } from './styles/global'

import { Button } from "./components/ui/button" 

function App() {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center bg-blue-900">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-white">
          Teste do Tailwind CSS
        </h1>
        <p className="mb-6 text-lg text-slate-300">
          Se você vê este texto estilizado, está funcionando.
        </p>
        <Button variant="secondary" size="lg" onClick={() => alert("Funcionou!")}>Botão de Teste</Button>
      </div>
    </main>
  )
}

export default App
