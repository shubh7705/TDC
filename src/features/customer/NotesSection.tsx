import { useState } from 'react';
import { useNotes, useAddNote } from './useCustomer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Plus, MessageSquare } from 'lucide-react';

export const NotesSection = ({ customerId }: { customerId: string }) => {
  const { data: notes, isLoading } = useNotes(customerId);
  const addNote = useAddNote(customerId);
  const [newNote, setNewNote] = useState('');

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      await addNote.mutateAsync(newNote);
      setNewNote('');
      toast.success('Note added');
    } catch (error) {
      toast.error('Failed to add note');
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-serif text-navy flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-400" />
          Internal Notes
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <div className="flex-1 overflow-auto p-4 space-y-4 max-h-[400px]">
          {isLoading ? (
            <p className="text-sm text-slate-500 text-center py-4">Loading notes...</p>
          ) : notes?.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-4">No notes yet.</p>
          ) : (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {notes?.map((note) => (
                <div key={note.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-white bg-slate-300 group-[.is-active]:bg-gold text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-[2px] md:ml-0" />
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-xs text-navy">{note.authorName}</span>
                      <span className="text-[10px] text-slate-400">
                        {format(new Date(note.timestamp), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{note.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <Textarea 
            placeholder="Add a new note..."
            className="min-h-[80px] bg-white resize-none text-sm border-slate-200 focus-visible:ring-gold"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
          />
          <div className="flex justify-end mt-2">
            <Button 
              size="sm" 
              className="bg-navy hover:bg-navy-700 text-white gap-1"
              onClick={handleAddNote}
              disabled={!newNote.trim() || addNote.isPending}
            >
              <Plus className="w-4 h-4" />
              {addNote.isPending ? 'Adding...' : 'Add Note'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
