import { ApiSlice } from "./ApiSlice";

// Définir l'interface Branch pour le typage
interface Branch {
  id: string | number;
  name: string;
  create_at: string;
  // Ajoute d'autres propriétés selon tes besoins
}

interface BranchsResponse {
  branchs: Branch[];
  totalCount: number;
}

interface BranchsParams {
  page?: number;
  pageSize?: number;
  gender?: string;
  role?: string;
}

export const BranchApi = ApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBranchs: builder.query<BranchsResponse, BranchsParams>({
      query: (params) => {
        const { page = 1, pageSize = 5 } = params || {};
        const queryParams = new URLSearchParams();

        queryParams.set("page", page.toString());
        queryParams.set("pageSize", pageSize.toString());

        return `/api/branchs?${queryParams.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.branchs.map(({ id }) => ({
                type: "Branchs" as const,
                id,
              })),
              { type: "Branchs", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Branchs", id: "PARTIAL-LIST" }],
    }),
    getAllBranchs: builder.query<Branch[], void>({
      query: () => "/api/branchs/all",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: "Branchs" as const,
                id,
              })),
              { type: "Branchs", id: "LIST" },
            ]
          : [{ type: "Branchs", id: "LIST" }],
    }),
    checkExistingBranch: builder.query<{ exists: boolean }, { name?: string }>({
      query: (params) => {
        const { name } = params;
        const queryParams = new URLSearchParams();

        if (name) queryParams.append("name", name);

        return `/api/branch/check-existing?${queryParams.toString()}`;
      },
    }),
    addBranch: builder.mutation<Branch, Partial<Branch>>({
      query: (newBranch) => ({
        url: "/api/branch",
        method: "POST",
        body: newBranch,
      }),
      invalidatesTags: ["Branchs"],
    }),
    updateBranch: builder.mutation<
      Branch,
      { id: string | number; [key: string]: any }
    >({
      query: ({ id, ...patch }) => ({
        url: `/api/updateBranch/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Branchs" as const, id },
      ],
    }),
    deleteBranch: builder.mutation<void, string | number>({
      query: (id) => ({
        url: `/api/deleteBranch/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Branchs" as const, id },
      ],
    }),
  }),
});

export const {
  useGetBranchsQuery,
  useGetAllBranchsQuery,
  useLazyCheckExistingBranchQuery,
  useAddBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} = BranchApi;
