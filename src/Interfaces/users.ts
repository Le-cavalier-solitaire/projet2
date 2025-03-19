interface User{
    id : string,
    username: string,
    role: "student" | "teacher" | "parents"
    studentId ?: string[],
    password : string,
    email : string, 
    createAt : string,
    phoneNumber : number,
    address : string,
}
