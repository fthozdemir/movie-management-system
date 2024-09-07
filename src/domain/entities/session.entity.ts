import { IMovie, ISession } from "@/interfaces";
export class Session implements ISession {
  id: ISession["id"];
  movieId: ISession["movieId"];
  movie: IMovie;
  date: ISession["date"];
  timeSlot: ISession["timeSlot"];
  roomNumber: ISession["roomNumber"];
  tickets: ISession["tickets"];

  constructor(session: Omit<ISession, "tickets" | "id">) {
    this.movieId = session.movieId;
    this.movie = session.movie;
    this.date = session.date;
    this.timeSlot = session.timeSlot;
    this.roomNumber = session.roomNumber;
    this.tickets = [];
  }
}
