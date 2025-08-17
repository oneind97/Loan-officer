import {
  users,
  leads,
  contactForms,
  leadNotes,
  type User,
  type UpsertUser,
  type Lead,
  type InsertLead,
  type UpdateLead,
  type ContactForm,
  type InsertContactForm,
  type LeadNote,
  type InsertLeadNote,
} from "./schema";
import { db } from "./db";
import { eq, desc, like, or, count, sql, and } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Lead operations
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(options?: { status?: string; search?: string; limit?: number; offset?: number }): Promise<Lead[]>;
  getLeadsCount(options?: { status?: string; search?: string }): Promise<number>;
  getLead(id: string): Promise<Lead | undefined>;
  updateLead(id: string, updates: UpdateLead): Promise<Lead>;
  deleteLead(id: string): Promise<void>;
  getLeadStats(): Promise<{
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    closed: number;
  }>;
  
  // Contact form operations
  createContactForm(contact: InsertContactForm): Promise<ContactForm>;
  getContactForms(options?: { limit?: number; offset?: number }): Promise<ContactForm[]>;
  getContactFormsCount(): Promise<number>;
  markContactFormRead(id: string): Promise<void>;
  
  // Lead notes operations
  createLeadNote(note: InsertLeadNote): Promise<LeadNote>;
  getLeadNotes(leadId: string): Promise<LeadNote[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Lead operations
  async createLead(lead: InsertLead): Promise<Lead> {
    const [newLead] = await db
      .insert(leads)
      .values(lead)
      .returning();
    return newLead;
  }

  async getLeads(options: { status?: string; search?: string; limit?: number; offset?: number } = {}): Promise<Lead[]> {
    const { status, search, limit = 50, offset = 0 } = options;
    
    let query = db.select().from(leads);
    
    const conditions = [];
    if (status && status !== 'all') {
      conditions.push(eq(leads.status, status as any));
    }
    if (search) {
      conditions.push(
        or(
          like(leads.name, `%${search}%`),
          like(leads.email, `%${search}%`),
          like(leads.phone, `%${search}%`)
        )
      );
    }
    
    if (conditions.length === 1) {
      query = query.where(conditions[0]);
    } else if (conditions.length > 1) {
      query = query.where(and(...conditions));
    }
    
    return await query
      .orderBy(desc(leads.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getLeadsCount(options: { status?: string; search?: string } = {}): Promise<number> {
    const { status, search } = options;
    
    let query = db.select({ count: count() }).from(leads);
    
    const conditions = [];
    if (status && status !== 'all') {
      conditions.push(eq(leads.status, status as any));
    }
    if (search) {
      conditions.push(
        or(
          like(leads.name, `%${search}%`),
          like(leads.email, `%${search}%`),
          like(leads.phone, `%${search}%`)
        )
      );
    }
    
    if (conditions.length === 1) {
      query = query.where(conditions[0]);
    } else if (conditions.length > 1) {
      query = query.where(and(...conditions));
    }
    
    const [result] = await query;
    return result.count;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }

  async updateLead(id: string, updates: UpdateLead): Promise<Lead> {
    const [updatedLead] = await db
      .update(leads)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return updatedLead;
  }

  async deleteLead(id: string): Promise<void> {
    await db.delete(leads).where(eq(leads.id, id));
  }

  async getLeadStats(): Promise<{
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    closed: number;
  }> {
    const stats = await db
      .select({
        status: leads.status,
        count: count(),
      })
      .from(leads)
      .groupBy(leads.status);

    const result = {
      total: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      closed: 0,
    };

    stats.forEach(({ status, count }) => {
      result.total += count;
      result[status] = count;
    });

    return result;
  }

  // Contact form operations
  async createContactForm(contact: InsertContactForm): Promise<ContactForm> {
    const [newContact] = await db
      .insert(contactForms)
      .values(contact)
      .returning();
    return newContact;
  }

  async getContactForms(options: { limit?: number; offset?: number } = {}): Promise<ContactForm[]> {
    const { limit = 50, offset = 0 } = options;
    return await db
      .select()
      .from(contactForms)
      .orderBy(desc(contactForms.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getContactFormsCount(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(contactForms);
    return result.count;
  }

  async markContactFormRead(id: string): Promise<void> {
    await db
      .update(contactForms)
      .set({ isRead: 'true' })
      .where(eq(contactForms.id, id));
  }

  // Lead notes operations
  async createLeadNote(note: InsertLeadNote): Promise<LeadNote> {
    const [newNote] = await db
      .insert(leadNotes)
      .values(note)
      .returning();
    return newNote;
  }

  async getLeadNotes(leadId: string): Promise<LeadNote[]> {
    return await db
      .select()
      .from(leadNotes)
      .where(eq(leadNotes.leadId, leadId))
      .orderBy(desc(leadNotes.createdAt));
  }
}

export const storage = new DatabaseStorage();
