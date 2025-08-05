import React from 'react';
import { MdCheck, MdDelete, MdEdit, MdOutlineRemoveDone } from 'react-icons/md';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

// Importando os componentes do shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

// Interface para definir a estrutura de uma tarefa
interface Issue {
  id: number;
  title: string;
  is_complete: boolean;
  user_id: string;
}

// O componente agora recebe a sessão do usuário como propriedade
export function TodoListPage({ session }: { session: Session }) {
  const [loading, setLoading] = React.useState(true);
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [newIssue, setNewIssue] = React.useState('');
  const [inputError, setInputError] = React.useState('');
  const [editingIssue, setEditingIssue] = React.useState<Issue | null>(null);
  const [editingText, setEditingText] = React.useState('');

  // Busca as tarefas do Supabase quando o componente é montado
  React.useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      setLoading(true);
      const { user } = session;

      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) setIssues(data);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIssue = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newIssue.trim()) {
      setInputError('Por favor, informe um nome para a tarefa.');
      return;
    }

    try {
      const { user } = session;
      const { data, error } = await supabase
        .from('todos')
        .insert({ title: newIssue, user_id: user.id })
        .select()
        .single();
      
      if (error) throw error;
      if (data) setIssues([...issues, data]);
      
      setNewIssue('');
      setInputError('');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const updateTodoStatus = async (id: number, is_complete: boolean) => {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ is_complete })
        .eq('id', id);

      if (error) throw error;
      setIssues(
        issues.map((issue) =>
          issue.id === id ? { ...issue, is_complete } : issue
        )
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingIssue || !editingText.trim()) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ title: editingText })
        .eq('id', editingIssue.id);
      
      if (error) throw error;
      setIssues(
        issues.map((issue) =>
          issue.id === editingIssue.id ? { ...issue, title: editingText } : issue
        )
      );
      setEditingIssue(null);
      setEditingText('');
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleDeleteIssue = async (id: number) => {
    try {
      const { error } = await supabase.from('todos').delete().eq('id', id);
      if (error) throw error;
      setIssues(issues.filter((issue) => issue.id !== id));
    } catch (error: any) {
      alert(error.message);
    }
  };

  function startEditing(issue: Issue) {
    setEditingIssue(issue);
    setEditingText(issue.title);
  }

  const todos = issues.filter(issue => !issue.is_complete);
  const completedTodos = issues.filter(issue => issue.is_complete);

  if (loading) {
    return <div className="min-h-screen w-full flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="bg-background text-foreground min-h-screen w-full flex justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold">To-Do List</h1>
            <Button variant="ghost" onClick={() => supabase.auth.signOut()}>Sair</Button>
        </div>
        
        <form onSubmit={handleAddIssue} className="flex gap-2 mb-2">
          <Input
            type="text"
            placeholder="Nome da nova tarefa..."
            value={newIssue}
            onChange={(e) => {
              setNewIssue(e.target.value);
              if (inputError) setInputError('');
            }}
            className={inputError ? 'border-destructive ring-destructive' : ''}
          />
          <Button type="submit" variant="success">Adicionar</Button>
        </form>
        {inputError && <p className="text-destructive text-sm mb-6">{inputError}</p>}

        <div className="space-y-4 mt-8">
          {todos.map((issue) => (
            <Card key={issue.id}>
              <CardContent className="p-4 flex items-center justify-between gap-2">
                <Button variant="ghost" size="icon" onClick={() => updateTodoStatus(issue.id, true)}>
                  <MdCheck className="h-6 w-6 text-emerald-600" />
                </Button>
                <p className="font-medium flex-1 mr-auto">{issue.title}</p>
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

        {completedTodos.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold text-center mb-6">Tarefas Concluídas</h2>
            <div className="space-y-4">
              {completedTodos.map((issue) => (
                <Card key={issue.id} className="bg-muted/50">
                  <CardContent className="p-4 flex items-center justify-between gap-2">
                    <Button variant="ghost" size="icon" onClick={() => updateTodoStatus(issue.id, false)}>
                      <MdOutlineRemoveDone className="h-6 w-6 text-muted-foreground" />
                    </Button>
                    <p className="font-medium flex-1 mr-auto line-through text-muted-foreground">
                      {issue.title}
                    </p>
                    <div className="flex">
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteIssue(issue.id)}>
                        <MdDelete className="h-5 w-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Dialog open={editingIssue !== null} onOpenChange={() => setEditingIssue(null)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Editar Tarefa</DialogTitle></DialogHeader>
            <Input
              value={editingText}
              onChange={(e) => setEditingText(e.target.value)}
              className="my-4"
              onKeyUp={(e) => e.key === 'Enter' && handleSaveEdit()}
            />
            <DialogFooter>
              <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
              <Button onClick={handleSaveEdit}>Salvar Alterações</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}