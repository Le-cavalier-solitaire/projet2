import { Branch } from "./branch";

interface Quiz {
  id: string;
  startDate: string;
  endDate: string;
  name: string;
  description: string;
  authorId : string;
  createdDate: string;
  branch: Branch;
}
