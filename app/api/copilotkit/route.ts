import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { NextRequest } from 'next/server';

const serviceAdapter = new OpenAIAdapter();

const runtime = new CopilotRuntime({
  actions: [
    {
      name: 'showWidget',
      description: 'Display a widget in the chat interface based on user request or conversation context',
      parameters: [
        {
          name: 'widgetType',
          type: 'string',
          description: 'Type of widget to display: task_card, twin_matrix, verification, instagram_connect, active_task, global_dashboard, wallet_connect, feature_grid',
          required: true,
        },
        {
          name: 'widgetData',
          type: 'object',
          description: 'Optional data for the widget',
          required: false,
        },
      ],
      handler: async ({ widgetType, widgetData }: { widgetType: string; widgetData?: any }) => {
        console.log(`🎨 [AI Action] showWidget called: ${widgetType}`);
        return {
          widgetType,
          widgetData: widgetData || {},
        };
      },
    },
    {
      name: 'verifyUser',
      description: 'Verify user identity through Instagram or other methods',
      parameters: [
        {
          name: 'method',
          type: 'string',
          description: 'Verification method: instagram, wallet, email',
          required: true,
        },
      ],
      handler: async ({ method }: { method: string }) => {
        return {
          verified: false,
          message: `Please complete ${method} verification`,
        };
      },
    },
    {
      name: 'browseTask',
      description: 'Browse available tasks and opportunities',
      parameters: [
        {
          name: 'category',
          type: 'string',
          description: 'Task category: all, social, content, review',
          required: false,
        },
      ],
      handler: async ({ category }: { category?: string }) => {
        console.log(`📋 [AI Action] browseTask called with category: ${category || 'all'}`);
        // Return mock task data
        const tasks = [
          {
            id: 'task1',
            title: "L'Oréal Paris Lip Challenge",
            brand: "L'Oréal Paris",
            reward: 150,
            category: 'content',
          },
          {
            id: 'task2',
            title: 'Starbucks Coffee Vlog',
            brand: 'Starbucks',
            reward: 200,
            category: 'social',
          },
          {
            id: 'task3',
            title: 'Dior Makeup Unboxing',
            brand: 'Dior',
            reward: 180,
            category: 'review',
          },
        ];

        return {
          tasks: category && category !== 'all'
            ? tasks.filter(t => t.category === category)
            : tasks,
        };
      },
    },
    {
      name: 'getMatrixScore',
      description: 'Get the user Twin Matrix score across 6 dimensions',
      parameters: [],
      handler: async () => {
        return {
          dimensions: {
            physical: 65,
            digital: 82,
            social: 74,
            cognitive: 88,
            emotional: 71,
            spiritual: 58,
          },
          overall: 73,
        };
      },
    },
  ],
});

export const POST = async (req: NextRequest) => {
  console.log('🤖 [CopilotKit] Incoming request to /api/copilotkit');

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  });

  const response = await handleRequest(req);

  console.log('✅ [CopilotKit] Response sent - OpenAI API was called!');

  return response;
};
