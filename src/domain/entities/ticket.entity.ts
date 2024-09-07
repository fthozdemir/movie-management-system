import { ISession, ITicket, IUser } from "@/interfaces";

export class Ticket implements ITicket {
  id: ITicket["id"];
  userId: ITicket["userId"];
  sessionId: ITicket["sessionId"];
  watched: ITicket["watched"];
  user: IUser;
  session: ISession;

  constructor(ticket: Omit<ITicket, "id">) {
    this.userId = ticket.userId;
    this.sessionId = ticket.sessionId;
    this.watched = false;
    this.user = ticket.user;
    this.session = ticket.session;
  }
}
