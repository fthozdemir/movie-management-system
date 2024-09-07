import { IMovie } from "@/interfaces";
export class Movie implements IMovie {
  id: IMovie["id"];
  name: IMovie["name"];
  ageRestriction: IMovie["ageRestriction"];
  sessions: IMovie["sessions"];

  constructor(movie: Omit<IMovie, "sessions" | "id">) {
    this.name = movie.name;
    this.ageRestriction = movie.ageRestriction;
    this.sessions = [];
  }
}
