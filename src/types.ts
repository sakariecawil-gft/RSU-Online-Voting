export type Role = 'student' | 'admin';

export interface User {
  id: string; // This will be the studentId or admin username
  name: string;
  role: Role;
  passwordHash: string; // In a real app, this is hashed. Here we store plain for simplicity of the prototype.
  passwordChanged: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  photoUrl: string;
  bio: string;
}

export interface Election {
  id: string;
  title: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  candidates: Candidate[];
}

export interface Vote {
  electionId: string;
  studentId: string;
  candidateId: string;
  timestamp: string; // ISO string
}

export interface AppState {
  users: User[];
  elections: Election[];
  votes: Vote[];
}
