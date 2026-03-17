import axios from "axios";

// Mock API base - replace with real backend URL
const API_BASE = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- MOCK DATA ----
export interface User {
  _id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  skillsOffered: Skill[];
  skillsWanted: string[];
  rating: number;
  reviewCount: number;
}

export interface Skill {
  _id: string;
  name: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  userId: string;
  userName: string;
}

export interface ExchangeRequest {
  _id: string;
  fromUser: User;
  toUser: User;
  skillOffered: string;
  skillWanted: string;
  status: "pending" | "accepted" | "rejected";
  message: string;
  createdAt: string;
}

export interface Session {
  _id: string;
  requestId: string;
  fromUser: User;
  toUser: User;
  skill: string;
  date: string;
  time: string;
  duration: number;
  status: "scheduled" | "completed" | "cancelled";
  meetingLink: string;
}

export interface Review {
  _id: string;
  fromUser: { _id: string; name: string; avatar: string };
  toUser: { _id: string; name: string };
  skill: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// MOCK DATA STORE
const mockUsers: User[] = [
  {
    _id: "1",
    name: "Alex Rivera",
    email: "alex@demo.com",
    bio: "Full-stack developer passionate about teaching React and learning design.",
    avatar: "",
    skillsOffered: [
      { _id: "s1", name: "React.js", category: "Programming", level: "advanced", description: "Modern React with hooks, context, and patterns", userId: "1", userName: "Alex Rivera" },
      { _id: "s2", name: "Node.js", category: "Programming", level: "intermediate", description: "REST APIs and Express.js", userId: "1", userName: "Alex Rivera" },
    ],
    skillsWanted: ["UI/UX Design", "Photography"],
    rating: 4.8,
    reviewCount: 12,
  },
  {
    _id: "2",
    name: "Priya Sharma",
    email: "priya@demo.com",
    bio: "Graphic designer who wants to learn web development.",
    avatar: "",
    skillsOffered: [
      { _id: "s3", name: "UI/UX Design", category: "Design", level: "advanced", description: "Figma, wireframes, prototyping", userId: "2", userName: "Priya Sharma" },
      { _id: "s4", name: "Illustration", category: "Design", level: "intermediate", description: "Digital illustration and branding", userId: "2", userName: "Priya Sharma" },
    ],
    skillsWanted: ["React.js", "Python"],
    rating: 4.6,
    reviewCount: 8,
  },
  {
    _id: "3",
    name: "Marcus Chen",
    email: "marcus@demo.com",
    bio: "Data scientist and photography enthusiast.",
    avatar: "",
    skillsOffered: [
      { _id: "s5", name: "Python", category: "Programming", level: "advanced", description: "Data science, ML, and automation", userId: "3", userName: "Marcus Chen" },
      { _id: "s6", name: "Photography", category: "Creative", level: "intermediate", description: "Portrait and landscape photography", userId: "3", userName: "Marcus Chen" },
    ],
    skillsWanted: ["Node.js", "Guitar"],
    rating: 4.9,
    reviewCount: 15,
  },
  {
    _id: "4",
    name: "Sofia Lopez",
    email: "sofia@demo.com",
    bio: "Music teacher exploring the world of coding.",
    avatar: "",
    skillsOffered: [
      { _id: "s7", name: "Guitar", category: "Music", level: "advanced", description: "Classical and modern guitar techniques", userId: "4", userName: "Sofia Lopez" },
      { _id: "s8", name: "Piano", category: "Music", level: "intermediate", description: "Music theory and piano basics", userId: "4", userName: "Sofia Lopez" },
    ],
    skillsWanted: ["Python", "UI/UX Design"],
    rating: 4.7,
    reviewCount: 6,
  },
];

const mockRequests: ExchangeRequest[] = [
  {
    _id: "r1",
    fromUser: mockUsers[1],
    toUser: mockUsers[0],
    skillOffered: "UI/UX Design",
    skillWanted: "React.js",
    status: "pending",
    message: "Hi Alex! I'd love to trade design skills for React lessons.",
    createdAt: "2026-03-15T10:00:00Z",
  },
  {
    _id: "r2",
    fromUser: mockUsers[2],
    toUser: mockUsers[0],
    skillOffered: "Photography",
    skillWanted: "Node.js",
    status: "accepted",
    message: "Hey, interested in swapping photography for backend skills!",
    createdAt: "2026-03-12T14:30:00Z",
  },
];

const mockSessions: Session[] = [
  {
    _id: "ss1",
    requestId: "r2",
    fromUser: mockUsers[2],
    toUser: mockUsers[0],
    skill: "Photography ↔ Node.js",
    date: "2026-03-20",
    time: "14:00",
    duration: 60,
    status: "scheduled",
    meetingLink: "https://meet.example.com/abc123",
  },
];

const mockReviews: Review[] = [
  {
    _id: "rv1",
    fromUser: { _id: "2", name: "Priya Sharma", avatar: "" },
    toUser: { _id: "1", name: "Alex Rivera" },
    skill: "React.js",
    rating: 5,
    comment: "Alex is an amazing teacher! Explained hooks so clearly.",
    createdAt: "2026-03-10T09:00:00Z",
  },
  {
    _id: "rv2",
    fromUser: { _id: "3", name: "Marcus Chen", avatar: "" },
    toUser: { _id: "1", name: "Alex Rivera" },
    skill: "Node.js",
    rating: 4,
    comment: "Great session, learned a lot about REST APIs.",
    createdAt: "2026-03-08T16:00:00Z",
  },
];

// ---- MOCK API FUNCTIONS ----

export const authApi = {
  login: async (email: string, _password: string) => {
    const user = mockUsers.find((u) => u.email === email);
    if (!user) throw new Error("Invalid credentials");
    localStorage.setItem("token", "mock-jwt-token");
    localStorage.setItem("user", JSON.stringify(user));
    return { token: "mock-jwt-token", user };
  },
  signup: async (name: string, email: string, _password: string) => {
    const newUser: User = {
      _id: Date.now().toString(),
      name,
      email,
      bio: "",
      avatar: "",
      skillsOffered: [],
      skillsWanted: [],
      rating: 0,
      reviewCount: 0,
    };
    localStorage.setItem("token", "mock-jwt-token");
    localStorage.setItem("user", JSON.stringify(newUser));
    return { token: "mock-jwt-token", user: newUser };
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  getUser: (): User | null => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  },
};

export const skillsApi = {
  getAll: async (): Promise<Skill[]> => {
    return mockUsers.flatMap((u) => u.skillsOffered);
  },
  add: async (skill: Omit<Skill, "_id" | "userId" | "userName">) => {
    const user = authApi.getUser();
    if (!user) throw new Error("Not authenticated");
    const newSkill: Skill = { ...skill, _id: Date.now().toString(), userId: user._id, userName: user.name };
    user.skillsOffered.push(newSkill);
    localStorage.setItem("user", JSON.stringify(user));
    return newSkill;
  },
};

export const usersApi = {
  getAll: async (): Promise<User[]> => mockUsers,
  getById: async (id: string): Promise<User | undefined> => mockUsers.find((u) => u._id === id),
  getMatches: async (): Promise<User[]> => {
    const user = authApi.getUser();
    if (!user) return [];
    return mockUsers.filter((u) => u._id !== user._id);
  },
};

export const requestsApi = {
  getAll: async (): Promise<ExchangeRequest[]> => mockRequests,
  send: async (data: { toUserId: string; skillOffered: string; skillWanted: string; message: string }) => {
    const user = authApi.getUser();
    if (!user) throw new Error("Not authenticated");
    const toUser = mockUsers.find((u) => u._id === data.toUserId);
    if (!toUser) throw new Error("User not found");
    const req: ExchangeRequest = {
      _id: Date.now().toString(),
      fromUser: user,
      toUser,
      skillOffered: data.skillOffered,
      skillWanted: data.skillWanted,
      status: "pending",
      message: data.message,
      createdAt: new Date().toISOString(),
    };
    mockRequests.push(req);
    return req;
  },
  updateStatus: async (id: string, status: "accepted" | "rejected") => {
    const req = mockRequests.find((r) => r._id === id);
    if (req) req.status = status;
    return req;
  },
};

export const sessionsApi = {
  getAll: async (): Promise<Session[]> => mockSessions,
  schedule: async (data: { requestId: string; date: string; time: string; duration: number }) => {
    const req = mockRequests.find((r) => r._id === data.requestId);
    if (!req) throw new Error("Request not found");
    const session: Session = {
      _id: Date.now().toString(),
      requestId: data.requestId,
      fromUser: req.fromUser,
      toUser: req.toUser,
      skill: `${req.skillOffered} ↔ ${req.skillWanted}`,
      date: data.date,
      time: data.time,
      duration: data.duration,
      status: "scheduled",
      meetingLink: `https://meet.example.com/${Date.now()}`,
    };
    mockSessions.push(session);
    return session;
  },
};

export const reviewsApi = {
  getAll: async (): Promise<Review[]> => mockReviews,
  add: async (data: { toUserId: string; skill: string; rating: number; comment: string }) => {
    const user = authApi.getUser();
    if (!user) throw new Error("Not authenticated");
    const review: Review = {
      _id: Date.now().toString(),
      fromUser: { _id: user._id, name: user.name, avatar: user.avatar },
      toUser: { _id: data.toUserId, name: mockUsers.find((u) => u._id === data.toUserId)?.name || "User" },
      skill: data.skill,
      rating: data.rating,
      comment: data.comment,
      createdAt: new Date().toISOString(),
    };
    mockReviews.push(review);
    return review;
  },
};

export default api;
