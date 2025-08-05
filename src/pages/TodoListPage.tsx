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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Interface para definir a estrutura de uma tarefa
interface Issue {
  id: number;
  title: string;
  is_complete: boolean;
  user_id?: string;
}

interface TodoListPageProps {
  session: Session | null;
  onSignOut: () => void;
}

// O componente agora recebe a sessão do usuário como propriedade
export function TodoListPage({ session, onSignOut }: TodoListPageProps) {
  const isGuestMode = !session;
  const [loading, setLoading] = React.useState(true);
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [newIssue, setNewIssue] = React.useState('');
  const [inputError, setInputError] = React.useState('');
  const [editingIssue, setEditingIssue] = React.useState<Issue | null>(null);
  const [editingText, setEditingText] = React.useState('');

  const user = session?.user;
  const userName = user?.user_metadata?.full_name || user?.email || "Visitante";
  const avatarUrl = user?.user_metadata?.avatar_url;

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  React.useEffect(() => {
    if (isGuestMode) {
      const savedIssues = localStorage.getItem('@ToDoList:guestIssues');
      if (savedIssues) {
        setIssues(JSON.parse(savedIssues));
      }
      setLoading(false);
    } else {
      getTodosFromSupabase();
    }
  }, [isGuestMode]);

  React.useEffect(() => {
    if (isGuestMode) {
      localStorage.setItem('@ToDoList:guestIssues', JSON.stringify(issues));
    }
  }, [issues, isGuestMode]);

  const getTodosFromSupabase = async () => {
    try {
      setLoading(true);
      const { user } = session!;
      const { data, error } = await supabase.from('todos').select('*').eq('user_id', user.id).order('created_at');
      if (error) throw error;
      if (data) setIssues(data);
    } catch (error: any) { alert(error.message); }
    finally { setLoading(false); }
  };

  const handleAddIssue = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newIssue.trim()) {
      setInputError('Por favor, informe um nome para a tarefa.');
      return;
    }

    if (isGuestMode) {
      const newGuestIssue: Issue = { id: Date.now(), title: newIssue, is_complete: false };
      setIssues([...issues, newGuestIssue]);
    } else {
      try {
        const { user } = session!;
        const { data, error } = await supabase.from('todos').insert({ title: newIssue, user_id: user.id }).select().single();
        if (error) throw error;
        if (data) setIssues([...issues, data]);
      } catch (error: any) { alert(error.message); }
    }
    setNewIssue('');
    setInputError('');
  };

  const updateTodoStatus = async (id: number, is_complete: boolean) => {
    if (isGuestMode) {
      setIssues(issues.map((issue) => issue.id === id ? { ...issue, is_complete } : issue));
    } else {
      try {
        const { error } = await supabase.from('todos').update({ is_complete }).eq('id', id);
        if (error) throw error;
        setIssues(issues.map((issue) => issue.id === id ? { ...issue, is_complete } : issue));
      } catch (error: any) { alert(error.message); }
    }
  };

  const handleSaveEdit = async () => {
    if (!editingIssue || !editingText.trim()) return;

    if (isGuestMode) {
      setIssues(issues.map((issue) => issue.id === editingIssue.id ? { ...issue, title: editingText } : issue));
    } else {
      try {
        const { error } = await supabase.from('todos').update({ title: editingText }).eq('id', editingIssue.id);
        if (error) throw error;
        setIssues(issues.map((issue) => issue.id === editingIssue.id ? { ...issue, title: editingText } : issue));
      } catch (error: any) { alert(error.message); }
    }
    setEditingIssue(null);
    setEditingText('');
  };

  const handleDeleteIssue = async (id: number) => {
    if (isGuestMode) {
      setIssues(issues.filter((issue) => issue.id !== id));
    } else {
      try {
        const { error } = await supabase.from('todos').delete().eq('id', id);
        if (error) throw error;
        setIssues(issues.filter((issue) => issue.id !== id));
      } catch (error: any) { alert(error.message); }
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
            <h1 className="text-4xl sm:text-5xl font-bold cursor-default">To-Do List</h1>
            <div className="flex items-center gap-4">
              {!isGuestMode && (
                <>
                  <div className="text-right hidden sm:block">
                    <p className="font-semibold text-sm">{userName}</p>
                  </div>
                  <Avatar>
                    <AvatarImage src={avatarUrl} alt={userName} />
                    <AvatarFallback>{getInitials(userName)}</AvatarFallback>
                  </Avatar>
                </>
              )}
              <Button variant="ghost" onClick={onSignOut}>Sair</Button>
            </div>
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
            <Card className="py-2" key={issue.id}>
              <CardContent className="px-4 py-1 flex items-center justify-between gap-2">
                <Button variant="ghost" size="icon" onClick={() => updateTodoStatus(issue.id, true)}>
                  <MdCheck className="h-6 w-6 text-emerald-600" />
                </Button>
                <p className="font-medium flex-1 mr-auto text-xl ">{issue.title}</p>
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
            <h2 className="text-2xl font-bold text-center mb-6 cursor-default">Tarefas Concluídas</h2>
            <div className="space-y-4">
              {completedTodos.map((issue) => (
                <Card key={issue.id} className="bg-muted/50 py-2">
                  <CardContent className="px-4 py-1 flex items-center justify-between gap-2">
                    <Button variant="ghost" size="icon" onClick={() => updateTodoStatus(issue.id, false)}>
                      <MdOutlineRemoveDone className="h-6 w-6 text-muted-foreground" />
                    </Button>
                    <p className="font-medium flex-1 mr-auto line-through text-muted-foreground text-xl">
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