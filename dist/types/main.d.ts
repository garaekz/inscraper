import { VoyagerClient } from './clients/voyager.client';
export * from './types';
export declare const createClient: (cookieString: string) => Promise<VoyagerClient>;
