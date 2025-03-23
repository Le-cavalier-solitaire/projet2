export interface Users {
  id: number;
  name: string;
  surname: string;
  email: string;
  dob: string; // format jour-mois- année
  branchId: string;
  password: string;
  phoneNumber: number;
  address: string;
  role: "student" | "teacher" |"parent" | "Admin"
}
