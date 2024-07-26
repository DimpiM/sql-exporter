import { Database, DbTable } from "../../types/appType";
import { ApiEndpoints, DatabaseApi } from "../../../../types/apiTypes";
import { apiBase } from "./apiBase";

export const databaseApi = apiBase.injectEndpoints({
  endpoints: (builder) => ({
    /*--------------------- QUERY /*---------------------*/
    database: builder.query<Array<Database> | null, void>({
      query: () => ({
        endpoint: ApiEndpoints.GET_DATABASES
      }),
      transformResponse: (response: Array<DatabaseApi>) => {
        return response;
      },
      providesTags: (_result, _error) => [{ type: "Database" }]
    }),

    tables: builder.query<Array<DbTable> | null, string>({
      query: (id) => ({
        endpoint: ApiEndpoints.GET_DB_TABLES,
        queryArgs: id
      }),
      transformResponse: (response: Array<DbTable> | null) => {
        return response;
      }
    }),
    /*--------------------- MUTATION /*---------------------*/
    addUpdateDatabase: builder.mutation<boolean, DatabaseApi>({
      query: (db) => ({
        endpoint: ApiEndpoints.ADD_UPDATE_DATABASE,
        queryArgs: db
      }),
      invalidatesTags: [{ type: "Database" }]
    }),
    deleteDatabase: builder.mutation<boolean, string>({
      query: (id) => ({
        endpoint: ApiEndpoints.DELETE_DATABASE,
        queryArgs: id
      }),
      invalidatesTags: [{ type: "Database" }]
    })
  }),
})

export const {
  useDatabaseQuery,
  useLazyTablesQuery,
  useAddUpdateDatabaseMutation,
  useDeleteDatabaseMutation
} = databaseApi
