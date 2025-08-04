import React from 'react'
import { MdCheck, MdDelete, MdEdit, MdOutlineRemoveDone } from 'react-icons/md'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

interface Issue {
  id: number
  title: string
}

function App() {
  const [issues, setIssues] = React.useState<Issue[]>(() => {
    const storageIssues = localStorage.getItem('@ToDoList:issues')
    return storageIssues ? JSON.parse(storageIssues) : []
  })

  const [newIssue, setNewIssue] = React.useState('')
  const [inputError, setInputError] = React.useState('')

  const [completedIssues, setCompletedIssues] = React.useState<Issue[]>(() => {
    const storageIssues = localStorage.getItem('@ToDoList:completed')
    return storageIssues ? JSON.parse(storageIssues) : []
  })

  const [editingIssue, setEditingIssue] = React.useState<Issue | null>(null)
  const [editingText, setEditingText] = React.useState('')

  React.useEffect(() => {
    localStorage.setItem('@ToDoList:issues', JSON.stringify(issues))
    localStorage.setItem('@ToDoList:completed', JSON.stringify(completedIssues))
  }, [issues, completedIssues])


  // --- FUNÇÕES DE MANIPULAÇÃO (Copiadas e adaptadas) ---

  function handleAddIssue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!newIssue.trim()) {
      setInputError('Por favor, informe um nome para a tarefa.')
      return
    }

    const newIssueObject: Issue = {
      id: Date.now(),
      title: newIssue,
    }

    setIssues([...issues, newIssueObject])
    setNewIssue('')
    setInputError('')
  }

  function handleDeleteIssue(idToDelete: number) {
    const updatedIssues = issues.filter((issue) => issue.id !== idToDelete)
    setIssues(updatedIssues)
  }

  function handleDeleteCompletedIssue(idToDelete: number) {
    setCompletedIssues(completedIssues.filter((issue) => issue.id !== idToDelete))
  }

function handleCompleteIssue(issueToComplete: Issue) {
  handleDeleteIssue(issueToComplete.id)
  setCompletedIssues([...completedIssues, issueToComplete])
}

  function handleUncompleteIssue(issueToUncomplete: Issue) {
    setCompletedIssues(completedIssues.filter((issue) => issue.id !== issueToUncomplete.id))
    setIssues([...issues, issueToUncomplete])
  }

  function startEditing(issue: Issue) {
    setEditingIssue(issue)
    setEditingText(issue.title)
  }

  function handleSaveEdit() {
    if (!editingIssue || !editingText.trim()) return;

    setIssues(
      issues.map((issue) =>
        issue.id === editingIssue.id ? { ...issue, title: editingText } : issue
      )
    )
    setEditingIssue(null)
    setEditingText('')
  }

  // --- RENDERIZAÇÃO DA UI (Reconstruída com Tailwind e shadcn/ui) ---

  return (
    <div className="bg-background text-foreground min-h-screen w-full flex justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">

        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-8">
          To-Do List
        </h1>

        <form onSubmit={handleAddIssue} className="flex gap-2 mb-2">
          <Input
            type="text"
            placeholder="Nome da nova tarefa..."
            value={newIssue}
            onChange={(e) => {
              setNewIssue(e.target.value)
              if (inputError) setInputError('')
            }}
            className={inputError ? 'border-destructive ring-destructive' : ''}
          />
          <Button type="submit" variant="success">Adicionar</Button>
        </form>
        {inputError && <p className="text-destructive text-sm mb-6">{inputError}</p>}

        {/* --- LISTA DE TAREFAS A FAZER --- */}
        <div className="space-y-4 mt-8">
          {issues.map((issue) => (
            <Card key={issue.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => handleCompleteIssue(issue)}>
                  <MdCheck className="h-6 w-6 text-emerald-600" />
                </Button>

                <p className="font-medium flex-1 mx-4">{issue.title}</p>

                <div className="flex gap-2">
                  <Button variant="warning" size="icon" onClick={() => startEditing(issue)}>
                    <MdEdit className="h-5 w-5" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDeleteIssue(issue.id)}>
                    <MdDelete className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* --- LISTA DE TAREFAS CONCLUÍDAS --- */}
        {completedIssues.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold text-center mb-6">Tarefas Concluídas</h2>
            <div className="space-y-4">
              {completedIssues.map((issue) => (
                <Card key={issue.id} className="bg-muted/50">
                  <CardContent className="p-4 flex items-center justify-between">
                    <Button variant="ghost" size="icon" onClick={() => handleUncompleteIssue(issue)}>
                      <MdOutlineRemoveDone className="h-6 w-6 text-muted-foreground" />
                    </Button>

                    <p className="font-medium flex-1 mx-4 line-through text-muted-foreground">
                      {issue.title}
                    </p>

                    <div className="flex">
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteCompletedIssue(issue.id)}>
                        <MdDelete className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* --- DIÁLOGO DE EDIÇÃO --- */}
        <Dialog open={editingIssue !== null} onOpenChange={() => setEditingIssue(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Tarefa</DialogTitle>
            </DialogHeader>
            <Input
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              className="my-4"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancelar</Button>
              </DialogClose>
              <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  )
}

export default App