import { getSubjects } from "@/lib/content";
import CreateQuizClient from "./CreateQuizClient";

export default function CreatePage() {
  const subjects = getSubjects();
  return <CreateQuizClient subjects={subjects} />;
}