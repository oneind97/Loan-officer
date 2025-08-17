var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// vite.config.ts
var vite_config_exports = {};
__export(vite_config_exports, {
  default: () => vite_config_default
});
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default;
var init_vite_config = __esm({
  async "vite.config.ts"() {
    "use strict";
    vite_config_default = defineConfig({
      plugins: [
        react(),
        runtimeErrorOverlay(),
        ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
          await import("@replit/vite-plugin-cartographer").then(
            (m) => m.cartographer()
          )
        ] : []
      ],
      resolve: {
        alias: {
          "@": path.resolve(import.meta.dirname, "client", "src"),
          "@shared": path.resolve(import.meta.dirname, "shared"),
          "@assets": path.resolve(import.meta.dirname, "attached_assets")
        }
      },
      root: path.resolve(import.meta.dirname, "client"),
      build: {
        outDir: path.resolve(import.meta.dirname, "dist/public"),
        emptyOutDir: true
      },
      server: {
        fs: {
          strict: true,
          deny: ["**/.*"]
        }
      }
    });
  }
});

// index.ts
import express2 from "express";

// routes.ts
import { createServer } from "http";

// schema.ts
var schema_exports = {};
__export(schema_exports, {
  contactForms: () => contactForms,
  insertContactFormSchema: () => insertContactFormSchema,
  insertLeadNoteSchema: () => insertLeadNoteSchema,
  insertLeadSchema: () => insertLeadSchema,
  leadNotes: () => leadNotes,
  leadNotesRelations: () => leadNotesRelations,
  leadStatusEnum: () => leadStatusEnum,
  leads: () => leads,
  leadsRelations: () => leadsRelations,
  sessions: () => sessions,
  updateLeadSchema: () => updateLeadSchema,
  upsertUserSchema: () => upsertUserSchema,
  users: () => users
});
import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  pgEnum
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var leadStatusEnum = pgEnum("lead_status", ["new", "contacted", "qualified", "closed"]);
var leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone").notNull(),
  loanType: varchar("loan_type").notNull(),
  purpose: varchar("purpose").notNull(),
  creditScore: varchar("credit_score").notNull(),
  timeline: varchar("timeline").notNull(),
  message: text("message"),
  status: leadStatusEnum("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var contactForms = pgTable("contact_forms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  email: varchar("email").notNull(),
  phone: varchar("phone"),
  subject: varchar("subject"),
  message: text("message").notNull(),
  isRead: varchar("is_read").default("false"),
  createdAt: timestamp("created_at").defaultNow()
});
var leadNotes = pgTable("lead_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  leadId: varchar("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  note: text("note").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var leadsRelations = relations(leads, ({ many }) => ({
  notes: many(leadNotes)
}));
var leadNotesRelations = relations(leadNotes, ({ one }) => ({
  lead: one(leads, {
    fields: [leadNotes.leadId],
    references: [leads.id]
  })
}));
var insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var updateLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true
}).partial();
var insertContactFormSchema = createInsertSchema(contactForms).omit({
  id: true,
  createdAt: true
});
var insertLeadNoteSchema = createInsertSchema(leadNotes).omit({
  id: true,
  createdAt: true
});
var upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true
});

// db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// storage.ts
import { eq, desc, like, or, count, and } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  // Lead operations
  async createLead(lead) {
    const [newLead] = await db.insert(leads).values(lead).returning();
    return newLead;
  }
  async getLeads(options = {}) {
    const { status, search, limit = 50, offset = 0 } = options;
    let query = db.select().from(leads);
    const conditions = [];
    if (status && status !== "all") {
      conditions.push(eq(leads.status, status));
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
    return await query.orderBy(desc(leads.createdAt)).limit(limit).offset(offset);
  }
  async getLeadsCount(options = {}) {
    const { status, search } = options;
    let query = db.select({ count: count() }).from(leads);
    const conditions = [];
    if (status && status !== "all") {
      conditions.push(eq(leads.status, status));
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
  async getLead(id) {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead;
  }
  async updateLead(id, updates) {
    const [updatedLead] = await db.update(leads).set({ ...updates, updatedAt: /* @__PURE__ */ new Date() }).where(eq(leads.id, id)).returning();
    return updatedLead;
  }
  async deleteLead(id) {
    await db.delete(leads).where(eq(leads.id, id));
  }
  async getLeadStats() {
    const stats = await db.select({
      status: leads.status,
      count: count()
    }).from(leads).groupBy(leads.status);
    const result = {
      total: 0,
      new: 0,
      contacted: 0,
      qualified: 0,
      closed: 0
    };
    stats.forEach(({ status, count: count2 }) => {
      result.total += count2;
      result[status] = count2;
    });
    return result;
  }
  // Contact form operations
  async createContactForm(contact) {
    const [newContact] = await db.insert(contactForms).values(contact).returning();
    return newContact;
  }
  async getContactForms(options = {}) {
    const { limit = 50, offset = 0 } = options;
    return await db.select().from(contactForms).orderBy(desc(contactForms.createdAt)).limit(limit).offset(offset);
  }
  async getContactFormsCount() {
    const [result] = await db.select({ count: count() }).from(contactForms);
    return result.count;
  }
  async markContactFormRead(id) {
    await db.update(contactForms).set({ isRead: "true" }).where(eq(contactForms.id, id));
  }
  // Lead notes operations
  async createLeadNote(note) {
    const [newNote] = await db.insert(leadNotes).values(note).returning();
    return newNote;
  }
  async getLeadNotes(leadId) {
    return await db.select().from(leadNotes).where(eq(leadNotes.leadId, leadId)).orderBy(desc(leadNotes.createdAt));
  }
};
var storage = new DatabaseStorage();

// replitAuth.ts
import * as client from "openid-client";
import { Strategy } from "openid-client/passport";
import passport from "passport";
import session from "express-session";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}
var getOidcConfig = memoize(
  async () => {
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID
    );
  },
  { maxAge: 3600 * 1e3 }
);
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      maxAge: sessionTtl
    }
  });
}
function updateUserSession(user, tokens) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}
async function upsertUser(claims) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"]
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.use(passport.initialize());
  app2.use(passport.session());
  const config = await getOidcConfig();
  const verify = async (tokens, verified) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };
  for (const domain of process.env.REPLIT_DOMAINS.split(",")) {
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: `https://${domain}/api/callback`
      },
      verify
    );
    passport.use(strategy);
  }
  passport.serializeUser((user, cb) => cb(null, user));
  passport.deserializeUser((user, cb) => cb(null, user));
  app2.get("/api/login", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"]
    })(req, res, next);
  });
  app2.get("/api/callback", (req, res, next) => {
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login"
    })(req, res, next);
  });
  app2.get("/api/logout", (req, res) => {
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`
        }).href
      );
    });
  });
}
var isAuthenticated = async (req, res, next) => {
  const user = req.user;
  if (!req.isAuthenticated() || !user.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const now = Math.floor(Date.now() / 1e3);
  if (now <= user.expires_at) {
    return next();
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};

// emailService.ts
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || process.env.EMAIL_USER,
    pass: process.env.SMTP_PASS || process.env.EMAIL_PASS
  }
});
var EmailService = class {
  async sendEmail(to, subject, html) {
    try {
      await transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_USER || "noreply@eddielending.com",
        to,
        subject,
        html
      });
      console.log(`Email sent successfully to ${to}`);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
  async notifyNewLead(lead) {
    const eddieEmail = process.env.EDDIE_EMAIL || "eddie@example.com";
    const subject = `New Mortgage Lead: ${lead.name}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">New Mortgage Lead Received</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${lead.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
          <p><strong>Phone:</strong> <a href="tel:${lead.phone}">${lead.phone}</a></p>
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">Loan Details</h3>
          <p><strong>Loan Type:</strong> ${lead.loanType}</p>
          <p><strong>Purpose:</strong> ${lead.purpose}</p>
          <p><strong>Credit Score:</strong> ${lead.creditScore}</p>
          <p><strong>Timeline:</strong> ${lead.timeline}</p>
        </div>
        
        ${lead.message ? `
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Message</h3>
            <p>${lead.message}</p>
          </div>
        ` : ""}
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.ADMIN_URL || "https://your-domain.com"}/admin" 
             style="background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View in Dashboard
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px; text-align: center;">
          Received on ${new Date(lead.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })}
        </p>
      </div>
    `;
    await this.sendEmail(eddieEmail, subject, html);
  }
  async notifyNewContact(contact) {
    const eddieEmail = process.env.EDDIE_EMAIL || "eddie@example.com";
    const subject = `New Contact Form: ${contact.subject || "General Inquiry"}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">New Contact Form Submission</h2>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${contact.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${contact.email}">${contact.email}</a></p>
          ${contact.phone ? `<p><strong>Phone:</strong> <a href="tel:${contact.phone}">${contact.phone}</a></p>` : ""}
          ${contact.subject ? `<p><strong>Subject:</strong> ${contact.subject}</p>` : ""}
        </div>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">Message</h3>
          <p>${contact.message}</p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.ADMIN_URL || "https://your-domain.com"}/admin" 
             style="background-color: #06b6d4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View in Dashboard
          </a>
        </div>
        
        <p style="color: #64748b; font-size: 14px; text-align: center;">
          Received on ${new Date(contact.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })}
        </p>
      </div>
    `;
    await this.sendEmail(eddieEmail, subject, html);
  }
  async sendLeadConfirmation(lead) {
    const subject = "Thank you for your mortgage inquiry - Eddie Hernandez";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #06b6d4;">Thank You for Your Mortgage Inquiry</h2>
        
        <p>Dear ${lead.name},</p>
        
        <p>Thank you for reaching out about your mortgage needs. I've received your inquiry and will be in touch within 24 hours to discuss your ${lead.loanType} loan options.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">What's Next?</h3>
          <ul style="color: #475569;">
            <li>I'll review your information and prepare personalized loan options</li>
            <li>We'll schedule a call to discuss your goals and timeline</li>
            <li>I'll guide you through the pre-approval process step by step</li>
          </ul>
        </div>
        
        <p>In the meantime, feel free to call me directly at <strong>(210) 000-0000</strong> if you have any immediate questions.</p>
        
        <p>Best regards,<br>
        <strong>Eddie Hernandez</strong><br>
        Loan Officer \u2022 NMLS #XXXXX<br>
        <a href="mailto:eddie@example.com">eddie@example.com</a><br>
        (210) 000-0000</p>
        
        <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
          Equal Housing Lender. NMLS Consumer Access.
        </p>
      </div>
    `;
    await this.sendEmail(lead.email, subject, html);
  }
};
var emailService = new EmailService();

// routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  await setupAuth(app2);
  app2.get("/api/auth/user", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/leads", async (req, res) => {
    try {
      const validatedData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(validatedData);
      try {
        await Promise.all([
          emailService.notifyNewLead(lead),
          emailService.sendLeadConfirmation(lead)
        ]);
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
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
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactFormSchema.parse(req.body);
      const contact = await storage.createContactForm(validatedData);
      try {
        await emailService.notifyNewContact(contact);
      } catch (emailError) {
        console.error("Email notification failed:", emailError);
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
  app2.get("/api/admin/leads", isAuthenticated, async (req, res) => {
    try {
      const { status, search, page = "1", limit = "20" } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const [leads2, total] = await Promise.all([
        storage.getLeads({
          status,
          search,
          limit: parseInt(limit),
          offset
        }),
        storage.getLeadsCount({
          status,
          search
        })
      ]);
      res.json({
        leads: leads2,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });
  app2.get("/api/admin/leads/stats", isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getLeadStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching lead stats:", error);
      res.status(500).json({ message: "Failed to fetch lead stats" });
    }
  });
  app2.get("/api/admin/leads/:id", isAuthenticated, async (req, res) => {
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
  app2.patch("/api/admin/leads/:id", isAuthenticated, async (req, res) => {
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
  app2.delete("/api/admin/leads/:id", isAuthenticated, async (req, res) => {
    try {
      await storage.deleteLead(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting lead:", error);
      res.status(500).json({ message: "Failed to delete lead" });
    }
  });
  app2.get("/api/admin/leads/:id/notes", isAuthenticated, async (req, res) => {
    try {
      const notes = await storage.getLeadNotes(req.params.id);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching lead notes:", error);
      res.status(500).json({ message: "Failed to fetch lead notes" });
    }
  });
  app2.post("/api/admin/leads/:id/notes", isAuthenticated, async (req, res) => {
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
  app2.get("/api/admin/contacts", isAuthenticated, async (req, res) => {
    try {
      const { page = "1", limit = "20" } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const [contacts, total] = await Promise.all([
        storage.getContactForms({
          limit: parseInt(limit),
          offset
        }),
        storage.getContactFormsCount()
      ]);
      res.json({
        contacts,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });
  app2.patch("/api/admin/contacts/:id/read", isAuthenticated, async (req, res) => {
    try {
      await storage.markContactFormRead(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error marking contact as read:", error);
      res.status(500).json({ message: "Failed to mark contact as read" });
    }
  });
  app2.get("/api/admin/leads/export/csv", isAuthenticated, async (req, res) => {
    try {
      const { status, search } = req.query;
      const leads2 = await storage.getLeads({
        status,
        search,
        limit: 1e4
        // Get all matching leads for export
      });
      const csvHeader = "Name,Email,Phone,Loan Type,Purpose,Credit Score,Timeline,Status,Created At,Message\n";
      const csvRows = leads2.map((lead) => {
        const message = (lead.message || "").replace(/"/g, '""').replace(/\n/g, " ");
        return `"${lead.name}","${lead.email}","${lead.phone}","${lead.loanType}","${lead.purpose}","${lead.creditScore}","${lead.timeline}","${lead.status}","${lead.createdAt?.toISOString()}","${message}"`;
      }).join("\n");
      const csv = csvHeader + csvRows;
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="leads-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv"`);
      res.send(csv);
    } catch (error) {
      console.error("Error exporting leads:", error);
      res.status(500).json({ message: "Failed to export leads" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// viteServer.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { nanoid } from "nanoid";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const { createServer: createViteServer, createLogger } = await import("vite");
  const viteConfig = (await init_vite_config().then(() => vite_config_exports)).default;
  const viteLogger = createLogger();
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "..", "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
