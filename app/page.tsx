'use client';

import { CopilotKit } from '@copilotkit/react-core';
import SimpleChatLayout from '@/components/SimpleChatLayout';

export default function Home() {
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <SimpleChatLayout />
    </CopilotKit>
  );
}
