import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { emailService } from "./emailService";
import { insertLeadSchema, insertContactFormSchema, updateLeadSchema, insertLeadNoteSchema } from "./schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Public lead submission endpoint
  app.post('/api/leads', async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      
      // Send email notifications
      try {
        await Promise.all([
          emailService.notifyNewLead(lead),
          emailService.sendLeadConfirmation(lead)
        ]);
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
        // Don't fail the request if email fails
      }
      
      res.status(201).json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating lead:", error);
        res.status(500).json({ message: "Failed to create lead" });
      }
    }
  });

  // Public contact form submission endpoint
  app.post('/api/contact', async (req, res) => {
    try {
      const validatedData = insertContactFormSchema.parse(req.body);
      const contact = await storage.createContactForm(validatedData);
      
      // Send email notification
      try {
        await emailService.notifyNewContact(contact);
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }
      
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating contact:", error);
        res.status(500).json({ message: "Failed to create contact" });
      }
    }
  });

  // Protected admin routes
  app.get('/api/admin/leads', isAuthenticated, async (req, res) => {
    try {
      const { status, search, page = '1', limit = '20' } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      const [leads, total] = await Promise.all([
        storage.getLeads({
          status: status as string,
          search: search as string,
          limit: parseInt(limit as string),
          offset
        }),
        storage.getLeadsCount({
          status: status as string,
          search: search as string
        })
      ]);
      
      res.json({
        leads,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          totalPages: Math.ceil(total / parseInt(limit as string))
        }
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.get('/api/admin/leads/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getLeadStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching lead stats:", error);
      res.status(500).json({ message: "Failed to fetch lead stats" });
    }
  });

  app.get('/api/admin/leads/:id', isAuthenticated, async (req, res) => {
    try {
      const lead = await storage.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }
      res.json(lead);
    } catch (error) {
      console.error("Error fetching lead:", error);
      res.status(500).json({ message: "Failed to fetch lead" });
    }
  });

  app.patch('/api/admin/leads/:id', isAuthenticated, async (req, res) => {
    try {
      const validatedData = updateLeadSchema.parse(req.body);
      const lead = await storage.updateLead(req.params.id, validatedData);
      res.json(lead);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error updating lead:", error);
        res.status(500).json({ message: "Failed to update lead" });
      }
    }
  });

  app.delete('/api/admin/leads/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deleteLead(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ message: "Failed to delete lead" });
    }
  });

  // Lead notes endpoints
  app.get('/api/admin/leads/:id/notes', isAuthenticated, async (req, res) => {
    try {
      const notes = await storage.getLeadNotes(req.params.id);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching lead notes:", error);
      res.status(500).json({ message: "Failed to fetch lead notes" });
    }
  });

  app.post('/api/admin/leads/:id/notes', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertLeadNoteSchema.parse({
        ...req.body,
        leadId: req.params.id
      });
      const note = await storage.createLeadNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error("Error creating lead note:", error);
        res.status(500).json({ message: "Failed to create lead note" });
      }
    }
  });

  // Contact forms endpoints
  app.get('/api/admin/contacts', isAuthenticated, async (req, res) => {
    try {
      const { page = '1', limit = '20' } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      const [contacts, total] = await Promise.all([
        storage.getContactForms({
          limit: parseInt(limit as string),
          offset
        }),
        storage.getContactFormsCount()
      ]);
      
      res.json({
        contacts,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          totalPages: Math.ceil(total / parseInt(limit as string))
        }
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  app.patch('/api/admin/contacts/:id/read', isAuthenticated, async (req, res) => {
    try {
      await storage.markContactFormRead(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error marking contact as read:", error);
      res.status(500).json({ message: "Failed to mark contact as read" });
    }
  });

  // CSV export endpoint
  app.get('/api/admin/leads/export/csv', isAuthenticated, async (req, res) => {
    try {
      const { status, search } = req.query;
      const leads = await storage.getLeads({
        status: status as string,
        search: search as string,
        limit: 10000 // Get all matching leads for export
      });
      
      const csvHeader = 'Name,Email,Phone,Loan Type,Purpose,Credit Score,Timeline,Status,Created At,Message\n';
      const csvRows = leads.map(lead => {
        const message = (lead.message || '').replace(/"/g, '""').replace(/\n/g, ' ');
        return `"${lead.name}","${lead.email}","${lead.phone}","${lead.loanType}","${lead.purpose}","${lead.creditScore}","${lead.timeline}","${lead.status}","${lead.createdAt?.toISOString()}","${message}"`;
      }).join('\n');
      
      const csv = csvHeader + csvRows;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="leads-${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } catch (error) {
      console.error("Error exporting leads:", error);
      res.status(500).json({ message: "Failed to export leads" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
