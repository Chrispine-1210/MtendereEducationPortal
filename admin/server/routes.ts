import { Router } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { requireAuth, requireAdminRole, requireSuperAdmin } from "./middleware/auth";
import { uploadMiddleware, processImage, generateImageSizes } from "./services/upload";
import { moderateContent, generateContentSuggestions, analyzeChatConversation } from "./services/openai";
import {
  insertUserSchema,
  insertScholarshipSchema,
  insertJobOpportunitySchema,
  insertPartnerInstitutionSchema,
  insertBlogPostSchema,
  insertTeamMemberSchema,
  insertApplicationSchema,
} from "@shared/schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import path from "path";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!;

// Helper function to validate request body
const validateBody = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};

// Authentication middleware
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin' && req.user?.role !== 'super_admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export async function registerRoutes(app: any) {
  const httpServer = createServer(app);

  // WebSocket setup for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        if (data.type === 'subscribe') {
          (ws as any).subscriptions = data.channels || [];
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Broadcast function for real-time updates
  const broadcast = (channel: string, data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const subscriptions = (client as any).subscriptions || [];
        if (subscriptions.includes(channel)) {
          client.send(JSON.stringify({ channel, data }));
        }
      }
    });
  };
}

// Authentication routes
router.post("/api/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await storage.getUserByUsername(username);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Update last login
    await storage.updateUser(user.id, { lastLogin: new Date() });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const existingEmail = await storage.getUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await storage.createUser({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: "user",
    });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin Dashboard
router.get("/api/admin/dashboard/stats", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const stats = await storage.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard statistics" });
  }
  console.log("Received request for recent activity."); // Send some placeholder data for now 
  res.status(200).json({ 
    message: "Recent activity data", 
    activity: [ 
      { id: 1, type: "Login", user: "Admin", timestamp: "2025-08-18T14:00:00Z" }, 
      { id: 2, type: "Update", user: "John Doe", timestamp: "2025-08-18T13:45:00Z" }, 
    ] 
  });
});

// Admin Dashboard - Recent Activity (NEW ROUTE)
router.get("/api/admin/dashboard/recent-activity", requireAuth, requireAdminRole, async (req, res) => {
  try {
    // Your actual logic to get recent activity
    const recentActivity = await storage.getRecentActivity(); // Assuming this function exists
    res.json(recentActivity);
  } catch (error) {
    console.error("Recent activity error:", error);
    // Send a placeholder response in case of error
    res.status(500).json({
      message: "Failed to fetch recent activity",
      activity: [
        { id: 1, type: "Login", user: "Admin", timestamp: "2025-08-18T14:00:00Z" },
        { id: 2, type: "Update", user: "John Doe", timestamp: "2025-08-18T13:45:00Z" },
      ]
    });
  }
});

// Users Management
router.get("/api/admin/users", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = (req.query.search as string) || "";
    
    const offset = (page - 1) * limit;
    const result = await storage.getUsers(limit, offset, search);
    
    res.json(result);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

router.get("/api/admin/users/:id", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const user = await storage.getUser(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

router.put("/api/admin/users/:id", requireAuth, requireAdminRole, validateBody(insertUserSchema.partial()), async (req, res) => {
  try {
    const user = await storage.updateUser(req.params.id, req.validatedBody);
    res.json(user);
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

router.delete("/api/admin/users/:id", requireAuth, requireSuperAdmin, async (req, res) => {
  try {
    await storage.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// Scholarships Management
router.get("/api/admin/scholarships", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "";
    
    const offset = (page - 1) * limit;
    const result = await storage.getScholarships(limit, offset, search, status);
    
    res.json(result);
  } catch (error) {
    console.error("Get scholarships error:", error);
    res.status(500).json({ message: "Failed to fetch scholarships" });
  }
});

router.post("/api/admin/scholarships", requireAuth, requireAdminRole, validateBody(insertScholarshipSchema), async (req, res) => {
  try {
    const scholarship = await storage.createScholarship(req.validatedBody, req.user.id);
    res.status(201).json(scholarship);
  } catch (error) {
    console.error("Create scholarship error:", error);
    res.status(500).json({ message: "Failed to create scholarship" });
  }
});

router.put("/api/admin/scholarships/:id", requireAuth, requireAdminRole, validateBody(insertScholarshipSchema.partial()), async (req, res) => {
  try {
    const scholarship = await storage.updateScholarship(req.params.id, req.validatedBody);
    res.json(scholarship);
  } catch (error) {
    console.error("Update scholarship error:", error);
    res.status(500).json({ message: "Failed to update scholarship" });
  }
});

router.delete("/api/admin/scholarships/:id", requireAuth, requireAdminRole, async (req, res) => {
  try {
    await storage.deleteScholarship(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Delete scholarship error:", error);
    res.status(500).json({ message: "Failed to delete scholarship" });
  }
});

// Jobs Management
router.get("/api/admin/jobs", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "";
    
    const offset = (page - 1) * limit;
    const result = await storage.getJobOpportunities(limit, offset, search, status);
    
    res.json(result);
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({ message: "Failed to fetch job opportunities" });
  }
});

router.post("/api/admin/jobs", requireAuth, requireAdminRole, validateBody(insertJobOpportunitySchema), async (req, res) => {
  try {
    const job = await storage.createJobOpportunity(req.validatedBody, req.user.id);
    res.status(201).json(job);
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({ message: "Failed to create job opportunity" });
  }
});

router.put("/api/admin/jobs/:id", requireAuth, requireAdminRole, validateBody(insertJobOpportunitySchema.partial()), async (req, res) => {
  try {
    const job = await storage.updateJobOpportunity(req.params.id, req.validatedBody);
    res.json(job);
  } catch (error) {
    console.error("Update job error:", error);
    res.status(500).json({ message: "Failed to update job opportunity" });
  }
});

router.delete("/api/admin/jobs/:id", requireAuth, requireAdminRole, async (req, res) => {
  try {
    await storage.deleteJobOpportunity(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({ message: "Failed to delete job opportunity" });
  }
});

// Partners Management
router.get("/api/admin/partners", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = (req.query.search as string) || "";
    
    const offset = (page - 1) * limit;
    const result = await storage.getPartnerInstitutions(limit, offset, search);
    
    res.json(result);
  } catch (error) {
    console.error("Get partners error:", error);
    res.status(500).json({ message: "Failed to fetch partner institutions" });
  }
});

router.post("/api/admin/partners", requireAuth, requireAdminRole, validateBody(insertPartnerInstitutionSchema), async (req, res) => {
  try {
    const partner = await storage.createPartnerInstitution(req.validatedBody, req.user.id);
    res.status(201).json(partner);
  } catch (error) {
    console.error("Create partner error:", error);
    res.status(500).json({ message: "Failed to create partner institution" });
  }
});

router.put("/api/admin/partners/:id", requireAuth, requireAdminRole, validateBody(insertPartnerInstitutionSchema.partial()), async (req, res) => {
  try {
    const partner = await storage.updatePartnerInstitution(req.params.id, req.validatedBody);
    res.json(partner);
  } catch (error) {
    console.error("Update partner error:", error);
    res.status(500).json({ message: "Failed to update partner institution" });
  }
});

router.delete("/api/admin/partners/:id", requireAuth, requireAdminRole, async (req, res) => {
  try {
    await storage.deletePartnerInstitution(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Delete partner error:", error);
    res.status(500).json({ message: "Failed to delete partner institution" });
  }
});

// Blog Management
router.get("/api/admin/blog", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "";
    
    const offset = (page - 1) * limit;
    const result = await storage.getBlogPosts(limit, offset, search, status);
    
    res.json(result);
  } catch (error) {
    console.error("Get blog posts error:", error);
    res.status(500).json({ message: "Failed to fetch blog posts" });
  }
});

router.post("/api/admin/blog", requireAuth, requireAdminRole, validateBody(insertBlogPostSchema), async (req, res) => {
  try {
    const post = await storage.createBlogPost(req.validatedBody, req.user.id);
    res.status(201).json(post);
  } catch (error) {
    console.error("Create blog post error:", error);
    res.status(500).json({ message: "Failed to create blog post" });
  }
});

router.put("/api/admin/blog/:id", requireAuth, requireAdminRole, validateBody(insertBlogPostSchema.partial()), async (req, res) => {
  try {
    const post = await storage.updateBlogPost(req.params.id, req.validatedBody);
    res.json(post);
  } catch (error) {
    console.error("Update blog post error:", error);
    res.status(500).json({ message: "Failed to update blog post" });
  }
});

router.delete("/api/admin/blog/:id", requireAuth, requireAdminRole, async (req, res) => {
  try {
    await storage.deleteBlogPost(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Delete blog post error:", error);
    res.status(500).json({ message: "Failed to delete blog post" });
  }
});

// Team Management
router.get("/api/admin/team", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = (req.query.search as string) || "";
    
    const offset = (page - 1) * limit;
    const result = await storage.getTeamMembers(limit, offset, search);
    
    res.json(result);
  } catch (error) {
    console.error("Get team members error:", error);
    res.status(500).json({ message: "Failed to fetch team members" });
  }
});

router.post("/api/admin/team", requireAuth, requireAdminRole, validateBody(insertTeamMemberSchema), async (req, res) => {
  try {
    const member = await storage.createTeamMember(req.validatedBody, req.user.id);
    res.status(201).json(member);
  } catch (error) {
    console.error("Create team member error:", error);
    res.status(500).json({ message: "Failed to create team member" });
  }
});

router.put("/api/admin/team/:id", requireAuth, requireAdminRole, validateBody(insertTeamMemberSchema.partial()), async (req, res) => {
  try {
    const member = await storage.updateTeamMember(req.params.id, req.validatedBody);
    res.json(member);
  } catch (error) {
    console.error("Update team member error:", error);
    res.status(500).json({ message: "Failed to update team member" });
  }
});

router.delete("/api/admin/team/:id", requireAuth, requireAdminRole, async (req, res) => {
  try {
    await storage.deleteTeamMember(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Delete team member error:", error);
    res.status(500).json({ message: "Failed to delete team member" });
  }
});

// Applications Management
router.get("/api/admin/applications", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const search = (req.query.search as string) || "";
    const status = (req.query.status as string) || "";
    
    const offset = (page - 1) * limit;
    const result = await storage.getApplications(limit, offset, search, status);
    
    res.json(result);
  } catch (error) {
    console.error("Get applications error:", error);
    res.status(500).json({ message: "Failed to fetch applications" });
  }
});

router.put("/api/admin/applications/:id", requireAuth, requireAdminRole, validateBody(insertApplicationSchema.partial()), async (req, res) => {
  try {
    const application = await storage.updateApplication(req.params.id, {
      ...req.validatedBody,
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    });
    res.json(application);
  } catch (error) {
    console.error("Update application error:", error);
    res.status(500).json({ message: "Failed to update application" });
  }
});

// AI Chat Management
router.get("/api/admin/ai-chat/conversations", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const offset = (page - 1) * limit;
    const result = await storage.getChatConversations(limit, offset);
    
    res.json(result);
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Failed to fetch chat conversations" });
  }
});

router.get("/api/admin/ai-chat/conversations/:id", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const conversation = await storage.getChatConversation(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    res.json(conversation);
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({ message: "Failed to fetch conversation" });
  }
});

// File Upload
router.post("/api/admin/upload", requireAuth, requireAdminRole, uploadMiddleware.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`;
    
    // If it's an image, process it
    if (req.file.mimetype.startsWith('image/')) {
      try {
        const processedPath = await processImage(req.file.path);
        const sizes = await generateImageSizes(req.file.path);
        
        res.json({
          url: filePath,
          processedUrl: processedPath.replace(process.cwd(), ''),
          sizes: Object.fromEntries(
            Object.entries(sizes).map(([key, path]) => [key, path.replace(process.cwd(), '')])
          ),
          originalName: req.file.originalname,
          size: req.file.size,
          type: req.file.mimetype,
        });
      } catch (error) {
        console.error("Image processing error:", error);
        // Return original file if processing fails
        res.json({
          url: filePath,
          originalName: req.file.originalname,
          size: req.file.size,
          type: req.file.mimetype,
        });
      }
    } else {
      res.json({
        url: filePath,
        originalName: req.file.originalname,
        size: req.file.size,
        type: req.file.mimetype,
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload file" });
  }
});

// AI Content Moderation
router.post("/api/admin/moderate", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const result = await moderateContent(content);
    res.json(result);
  } catch (error) {
    console.error("Content moderation error:", error);
    res.status(500).json({ message: "Failed to moderate content" });
  }
});

// AI Content Suggestions
router.post("/api/admin/suggestions", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const { topic, contentType } = req.body;
    if (!topic || !contentType) {
      return res.status(400).json({ message: "Topic and content type are required" });
    }

    const suggestions = await generateContentSuggestions(topic, contentType);
    res.json({ suggestions });
  } catch (error) {
    console.error("Content suggestions error:", error);
    res.status(500).json({ message: "Failed to generate content suggestions" });
  }
});

// Notifications
router.get("/api/admin/notifications", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const offset = (page - 1) * limit;
    const result = await storage.getAdminNotifications(limit, offset, req.user.id);
    
    res.json(result);
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
});

router.put("/api/admin/notifications/:id/read", requireAuth, requireAdminRole, async (req, res) => {
  try {
    await storage.markNotificationAsRead(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Mark notification read error:", error);
    res.status(500).json({ message: "Failed to mark notification as read" });
  }
});

// Audit Logs
router.get("/api/admin/audit-logs", requireAuth, requireAdminRole, async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const userId = req.query.userId as string;
    const entityType = req.query.entityType as string;
    
    const offset = (page - 1) * limit;
    const result = await storage.getAuditLogs(limit, offset, userId, entityType);
    
    res.json(result);
  } catch (error) {
    console.error("Get audit logs error:", error);
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
});

// Serve uploaded files
router.use("/uploads", (req, res, next) => {
  // Basic security check
  const filePath = path.normalize(req.path);
  if (filePath.includes("..") || !filePath.startsWith("/")) {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
});

export default router;
