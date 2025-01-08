
import { PushAPI } from '@pushprotocol/restapi';

export const initializePushChat = async (signer: any) => {
  const pushAPI = await PushAPI.initialize(signer);
  return pushAPI;
};
