// User entity interface
import { UserRole, TimeSlot } from "@prisma/client";
export { UserRole, TimeSlot } from "@prisma/client";

export interface IUser {
  id: number;
  username: string;
  password: string;
  age: number;
  role: UserRole;
  tickets?: ITicket[];
}

// Movie entity interface
export interface IMovie {
  id: number;
  name: string;
  ageRestriction: number;
  sessions?: ISession[];
}

// Session entity interface
export interface ISession {
  id: number;
  movieId: IMovie["id"];
  movie?: IMovie;
  date: Date;
  timeSlot: TimeSlot;
  roomNumber: number;
  tickets?: ITicket[];
}

// Ticket entity interface
export interface ITicket {
  id: number;
  userId: IUser["id"];
  user?: IUser;
  sessionId: ISession["id"];
  session?: ISession;
  watched: boolean;
}
