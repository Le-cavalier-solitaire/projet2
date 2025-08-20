import { ApiSlice } from "./ApiSlice";

// Définir l'interface User pour le typage
interface User {
  id: string | number;
  name: string;
  email: string;
  role?: string;
  sexe?: string;
  // Ajoute d'autres propriétés selon tes besoins
}

interface UsersResponse {
  users: User[];
  totalCount: number;
}

interface UsersParams {
  page?: number;
  pageSize?: number;
  gender?: string;
  role?: string;
}

export const UsersApi = ApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, UsersParams>({
      query: (params) => {
        const { page = 1, pageSize = 5, gender, role } = params || {};
        const queryParams = new URLSearchParams();

        queryParams.set("page", page.toString());
        queryParams.set("pageSize", pageSize.toString());
        if (gender) queryParams.set("gender", gender);
        if (role) queryParams.set("role", role);

        return `/api/users?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ id }) => ({ type: "Users" as const, id })),
              { type: "Users", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Users", id: "PARTIAL-LIST" }],
    }),
    getStudentsUsers: builder.query<User[], void>({
      query: () => "/api/userStudents",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Users" as const,
                id,
              })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    checkExistingUser: builder.query<
      { exists: boolean },
      { email?: string; telephone?: string }
    >({
      query: (params) => {
        const { email, telephone } = params;
        const queryParams = new URLSearchParams();

        if (email) queryParams.append("email", email);
        if (telephone) queryParams.append("telephone", telephone);

        return `/api/user/check-existing?${queryParams.toString()}`;
      },
    }),
    addUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: "/api/user",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<
      User,
      { id: string | number; [key: string]: any }
    >({
      query: ({ id, ...patch }) => ({
        url: `/api/updateUser/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users" as const, id },
      ],
    }),
    updateUserPassword: builder.mutation<
      User,
      { id: string | number; [key: string]: any }
    >({
      query: ({ id, ...passwords }) => ({
        url: `/api/updatePassword/${id}`,
        method: "PATCH",
        body: passwords,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Users" as const, id },
      ],
    }),
    resetPasswordAccount: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: ({ email }) => ({
        url: `/api/resetPassword/${email}`, // Correspond à votre route API
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { email }) => [
        { type: "Users" as const, email },
      ],
    }),
    deleteUser: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/api/deleteUser/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Users" as const, id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetStudentsUsersQuery,
  useLazyCheckExistingUserQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useUpdateUserPasswordMutation,
  useResetPasswordAccountMutation,
  useDeleteUserMutation,
} = UsersApi;
