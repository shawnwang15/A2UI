/*
 Copyright 2025 Google LLC

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { A2AClient, AgentCard, MessageSendParams, Part, SendMessageSuccessResponse, Task } from '@a2a-js/sdk';
import { v4 as uuidv4 } from 'uuid';
import type { Connect } from 'vite';

let client: A2AClient | null = null;
let contextId: string | undefined = undefined;

async function fetchWithCustomHeader(url: string | URL | Request, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  headers.set('X-A2A-Extensions', 'https://a2ui.org/a2a-extension/a2ui/v0.8');
  const newInit = { ...init, headers };
  return fetch(url, newInit);
}

async function createOrGetClient() {
  client ??= await A2AClient.fromCardUrl('http://localhost:10003/.well-known/agent-card.json', {
    fetchImpl: fetchWithCustomHeader,
  });
  return client;
}

export function createA2AMiddleware(): Connect.NextHandleFunction {
  return async (req, res, next) => {
    // Handle agent card request
    if (req.url === '/a2a/agent-card' && req.method === 'GET') {
      try {
        const client = await createOrGetClient();
        const card = await client.getAgentCard();
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(card));
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String(error) }));
      }
      return;
    }

    // Handle catalog request
    if (req.url === '/a2a/catalog' && req.method === 'GET') {
      try {
        const client = await createOrGetClient();
        const card = await client.getAgentCard() as any;
        const catalogs = card?.skills?.[0]?.metadata?.catalogs || [];
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(catalogs));
      } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String(error) }));
      }
      return;
    }

    if (req.url !== '/a2a' || req.method !== 'POST') {
      next();
      return;
    }

    let originalBody = '';

    req.on('data', (chunk: Buffer) => {
      originalBody += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const bodyData = JSON.parse(originalBody);
        const parts = bodyData.parts as Part[];
        const componentCatalog = bodyData.component_catalog || '';

        const sendParams: MessageSendParams = {
          message: {
            messageId: uuidv4(),
            role: 'user',
            parts: parts,
            kind: 'message',
            contextId: contextId,
            metadata: componentCatalog ? { component_catalog: componentCatalog } : undefined,
          },
        };

        const client = await createOrGetClient();
        const response = await client.sendMessage(sendParams);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');

        if ('error' in response) {
          console.error('Error:', response.error.message);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: response.error.message }));
          return;
        }

        const successResponse = response as SendMessageSuccessResponse;
        if (successResponse.result && 'contextId' in successResponse.result) {
          contextId = (successResponse.result as any).contextId;
        }

        res.end(JSON.stringify({ ...successResponse, context_id: contextId }));
      } catch (error) {
        console.error('Error:', error);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String(error) }));
      }
    });
  };
}
