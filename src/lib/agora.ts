'use server';

import {
  AGORA_URL,
  SIWE_CHAINID,
  SIWE_DOMAIN,
  SIWE_URI,
  SIWE_VERSION,
} from './constants';

import { SiweMessage } from 'siwe';

export async function getNonce() {
  try {
    const response = await fetch(`${AGORA_URL}/auth/nonce`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP status error: ${response.status}`);
    }

    const data = await response.text();
    return data;
  } catch (error: any) {
    throw new Error(`Http status error: ${error.message}`);
  }
}

export async function createSiweMessage(
  domain: string,
  uri: string,
  address: string,
  statement: string,
  nonce: string,
) {
  const siweMessage = new SiweMessage({
    domain,
    address,
    statement,
    uri,
    version: SIWE_VERSION,
    chainId: SIWE_CHAINID,
    nonce,
  });

  return siweMessage.prepareMessage();
}
