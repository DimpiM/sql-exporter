import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { BaseQueryArgs } from '../../types/baseType';

const customBaseQuery: BaseQueryFn<BaseQueryArgs> = async (args) => {
    const response = await window.api[args.endpoint](args.queryArgs)
    return {data: response};
}

export const apiBase = createApi({
  reducerPath: 'apiBase',
  baseQuery: customBaseQuery,
  tagTypes: [
    'Database',
    'ExportPath'
  ],
  endpoints: () => ({})
})
