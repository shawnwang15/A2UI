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

import type { AgentCard, Part, SendMessageSuccessResponse } from '@a2a-js/sdk';

/**
 * Options for configuring the A2A service.
 */
export interface A2AServiceOptions {
  /** Base URL for the A2A proxy endpoint. */
  baseUrl?: string;
  /** Custom fetch implementation. */
  fetchImpl?: typeof fetch;
}

/**
 * Interface for the A2A service that communicates with agents.
 */
export interface A2AService {
  /**
   * Gets the agent card information.
   */
  getAgentCard(): Promise<AgentCard | null>;

  /**
   * Sends a message to the agent.
   * @param parts The message parts to send.
   * @param signal An optional abort signal.
   * @param metadata Optional metadata to include with the message.
   */
  sendMessage(
    parts: Part[],
    signal?: AbortSignal,
    metadata?: Record<string, any>
  ): Promise<SendMessageSuccessResponse>;
}
