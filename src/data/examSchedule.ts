/** B.Tech Regular Semester 3 (FOE) end-semester theory exams, Winter 2026, as published by the university. */
export interface ExamSlot {
  date: string; // YYYY-MM-DD
  time: string; // 24h HH:MM, IST
  code: string;
  course: string;
  short: string;
  /** Library subject slug, for study links */
  subject: string;
  type: "Theory";
  block?: string;
  room?: string;
}

export const EXAM_SCHEDULE_TITLE = "B.Tech Regular Semester 3 · FOE · Winter 2026";

export const EXAM_SCHEDULE: ExamSlot[] = [
  { date: "2026-11-25", time: "10:10", code: "C2311C1", course: "Object Oriented Programming Using Java", short: "Java", subject: "java", type: "Theory" },
  { date: "2026-11-27", time: "10:10", code: "C2310C2", course: "Computer Architecture", short: "COA", subject: "coa", type: "Theory" },
  { date: "2026-12-02", time: "10:10", code: "C2311C4", course: "Database Management System", short: "DBMS", subject: "dbms", type: "Theory" },
  { date: "2026-12-04", time: "10:10", code: "C2310C5", course: "Data Structures and Algorithms", short: "DSA", subject: "dsa", type: "Theory" },
  { date: "2026-12-07", time: "10:10", code: "S2320C1", course: "Computer Oriented Numerical Methods with Python", short: "CONMP", subject: "conmp", type: "Theory" },
];

export const examStart = (e: ExamSlot) => new Date(`${e.date}T${e.time}:00+05:30`);
