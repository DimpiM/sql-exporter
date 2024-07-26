import { ApiEndpoints } from "../../../types/apiTypes";

export interface BaseQueryArgs {
  endpoint: ApiEndpoints;
  queryArgs?: any;
}
