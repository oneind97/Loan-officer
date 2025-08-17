import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Lead, LeadNote } from "@shared/schema";

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadDetailModal({ lead, isOpen, onClose }: LeadDetailModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(lead?.status || 'new');
  const [newNote, setNewNote] = useState('');

  // Fetch lead notes
  const { data: notes = [] } = useQuery<LeadNote[]>({
    queryKey: ['/api/admin/leads', lead?.id, 'notes'],
    enabled: !!lead?.id && isOpen,
  });

  // Update lead status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      await apiRequest('PATCH', `/api/admin/leads/${lead?.id}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/leads'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/leads/stats'] });
      toast({ title: "Status updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update status", variant: "destructive" });
    },
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: async (note: string) => {
      await apiRequest('POST', `/api/admin/leads/${lead?.id}/notes`, { note });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/leads', lead?.id, 'notes'] });
      setNewNote('');
      toast({ title: "Note added successfully" });
    },
    onError: () => {
      toast({ title: "Failed to add note", variant: "destructive" });
    },
  });

  const handleStatusUpdate = () => {
    if (status !== lead?.status) {
      updateStatusMutation.mutate(status);
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNoteMutation.mutate(newNote.trim());
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!lead) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Lead Details - {lead.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300">Contact Information</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span className="text-white" data-testid="text-lead-name">{lead.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Email:</span>
                <a href={`mailto:${lead.email}`} className="text-cyan-400 hover:text-cyan-300" data-testid="link-lead-email">
                  {lead.email}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone:</span>
                <a href={`tel:${lead.phone}`} className="text-cyan-400 hover:text-cyan-300" data-testid="link-lead-phone">
                  {lead.phone}
                </a>
              </div>
            </div>
          </div>
          
          {/* Loan Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-300">Loan Details</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Loan Type:</span>
                <span className="text-white" data-testid="text-loan-type">{lead.loanType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Purpose:</span>
                <span className="text-white" data-testid="text-purpose">{lead.purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Credit Score:</span>
                <span className="text-white" data-testid="text-credit-score">{lead.creditScore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Timeline:</span>
                <span className="text-white" data-testid="text-timeline">{lead.timeline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(lead.status)}`} data-testid="text-status">
                  {lead.status}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Message */}
        {lead.message && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Message</h4>
            <p className="text-sm text-white bg-gray-700 rounded-lg p-3" data-testid="text-message">
              {lead.message}
            </p>
          </div>
        )}

        {/* Notes Section */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Notes</h4>
          
          {/* Add new note */}
          <div className="space-y-3 mb-4">
            <Textarea
              placeholder="Add a note about this lead..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
              data-testid="textarea-new-note"
            />
            <Button
              onClick={handleAddNote}
              disabled={!newNote.trim() || addNoteMutation.isPending}
              className="bg-cyan-500 hover:bg-cyan-400"
              data-testid="button-add-note"
            >
              {addNoteMutation.isPending ? "Adding..." : "Add Note"}
            </Button>
          </div>

          {/* Display existing notes */}
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {notes.length === 0 ? (
              <p className="text-gray-500 text-sm">No notes yet</p>
            ) : (
              notes.map((note: LeadNote) => (
                <div key={note.id} className="bg-gray-700 rounded p-3">
                  <p className="text-sm text-white">{note.note}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(note.createdAt!).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <label className="text-sm font-medium text-gray-300">Update Status:</label>
            <Select value={status} onValueChange={(value) => setStatus(value as any)}>
              <SelectTrigger className="w-40 bg-gray-700 border-gray-600 text-white" data-testid="select-status-update">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-gray-600 text-gray-300"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={status === lead.status || updateStatusMutation.isPending}
              className="bg-cyan-500 hover:bg-cyan-400"
              data-testid="button-save-changes"
            >
              {updateStatusMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
