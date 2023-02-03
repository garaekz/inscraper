import { VoyagerClient } from './clients/voyager.client';

export * from './types';

export const createClient = async (cookieString: string): Promise<VoyagerClient> => {
  return new VoyagerClient(cookieString);
};