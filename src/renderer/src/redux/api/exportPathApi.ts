import { apiBase } from "./apiBase";
import { ApiEndpoints } from "../../../../types/apiTypes";

export const exportPathApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    /*--------------------- QUERY /*---------------------*/
    exportPath: builder.query<string | null, void>({
      query: () => ({
        endpoint: ApiEndpoints.GET_EXPORT_PATH
      }),
      transformResponse: (response: string) => {
        return response;
      },
      providesTags: (_result, _error) => [{ type: "ExportPath" }]
    }),
    /*--------------------- MUTATION /*---------------------*/
    updateExportPath: builder.mutation<boolean, string>({
      query: (db) => ({
        endpoint: ApiEndpoints.UPDATE_EXPORT_PATH,
        queryArgs: db
      }),
      invalidatesTags: [{ type: "ExportPath" }]
    }),
  }),
})

export const {
  useExportPathQuery,
  useUpdateExportPathMutation,
} = exportPathApi
