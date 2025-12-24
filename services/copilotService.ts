import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import type { Message, Suggestion } from '../types';
import type { WidgetType } from '../types/a2ui';
import { INTERACTION_INVENTORY } from '../data/inventory';

export interface WidgetPayload {
  type: WidgetType;
  data?: any;
}

// Hook to register A2UI actions with CopilotKit
export function useA2UIActions(
  onShowWidget: (payload: WidgetPayload) => void,
  onVerify: (verified: boolean) => void,
  onShowTasks: (tasks: any[]) => void
) {
  // Register widget display action
  useCopilotAction({
    name: 'showWidget',
    description: 'Display a widget in the chat based on context: task cards, Twin Matrix, verification flows, Instagram connect, active tasks, or global dashboard',
    parameters: [
      {
        name: 'widgetType',
        type: 'string',
        description: 'Widget type: task_card, twin_matrix, verification, instagram_connect, active_task, global_dashboard, wallet_connect, feature_grid',
        required: true,
      },
      {
        name: 'widgetData',
        type: 'object',
        description: 'Optional widget data',
      },
    ],
    handler: async ({ widgetType, widgetData }) => {
      onShowWidget({ type: widgetType as WidgetType, data: widgetData });
      return `Showing ${widgetType} widget`;
    },
  });

  // Register verification action
  useCopilotAction({
    name: 'verifyUser',
    description: 'Verify user identity via Instagram or wallet to unlock tasks and features',
    parameters: [
      {
        name: 'method',
        type: 'string',
        description: 'Verification method: instagram, wallet',
        required: true,
      },
    ],
    handler: async ({ method }) => {
      // Trigger Instagram connect widget
      if (method === 'instagram') {
        onShowWidget({ type: 'instagram_connect', data: {} });
      }
      return `Starting ${method} verification flow`;
    },
  });

  // Register task browsing action
  useCopilotAction({
    name: 'browseTasks',
    description: 'Show available task opportunities from brands like L\'Oréal, Starbucks, Dior',
    parameters: [
      {
        name: 'category',
        type: 'string',
        description: 'Task category filter: all, social, content, review',
      },
    ],
    handler: async ({ category }) => {
      const tasks = [
        {
          id: 'task1',
          brand: "L'Oréal Paris",
          title: 'Share your favorite lipstick shade',
          reward: 150,
          category: 'content',
          description: 'Create a 30-second video showcasing your favorite L\'Oréal lipstick',
        },
        {
          id: 'task2',
          brand: 'Starbucks',
          title: 'Coffee Vlog Challenge',
          reward: 200,
          category: 'social',
          description: 'Vlog your Starbucks morning routine',
        },
        {
          id: 'task3',
          brand: 'Dior',
          title: 'Makeup Unboxing',
          reward: 180,
          category: 'review',
          description: 'Unbox and review the new Dior makeup collection',
        },
      ];

      const filteredTasks = category && category !== 'all'
        ? tasks.filter(t => t.category === category)
        : tasks;

      onShowTasks(filteredTasks);
      return `Showing ${filteredTasks.length} available tasks`;
    },
  });

  // Register Twin Matrix action
  useCopilotAction({
    name: 'showTwinMatrix',
    description: 'Display the user\'s Twin Matrix - a 256-dimensional identity score across physical, digital, social, cognitive, emotional, and spiritual dimensions',
    parameters: [],
    handler: async () => {
      onShowWidget({
        type: 'twin_matrix',
        data: {
          dimensions: {
            physical: 65,
            digital: 82,
            social: 74,
            cognitive: 88,
            emotional: 71,
            spiritual: 58,
          },
        },
      });
      return 'Displaying Twin Matrix visualization';
    },
  });

  // Register dashboard action
  useCopilotAction({
    name: 'showDashboard',
    description: 'Display the user\'s global dashboard with active tasks, completed tasks, and achievements',
    parameters: [],
    handler: async () => {
      onShowWidget({ type: 'global_dashboard', data: {} });
      return 'Opening global dashboard';
    },
  });
}

// Hook to provide context to CopilotKit
export function useA2UIContext(isVerified: boolean, currentMessages: Message[]) {
  useCopilotReadable({
    description: 'User verification status',
    value: isVerified ? 'verified' : 'not verified',
  });

  useCopilotReadable({
    description: 'Current conversation context and message history',
    value: JSON.stringify(currentMessages.map(m => ({
      role: m.role,
      content: m.content,
      type: m.type,
    }))),
  });

  useCopilotReadable({
    description: 'Available interaction flows from the A2UI inventory',
    value: JSON.stringify(INTERACTION_INVENTORY.map(node => ({
      id: node.id,
      description: node.description,
      triggers: node.triggers,
    }))),
  });
}

// Utility to find matching node from inventory
export function findNodeFromInput(text: string) {
  const lowerText = text.toLowerCase();
  const match = INTERACTION_INVENTORY.find(node =>
    node.triggers.some(trigger => lowerText.includes(trigger.toLowerCase()))
  );
  return match || null;
}

// Generate suggestions based on context
export function generateContextualSuggestions(
  lastMessage: Message | null,
  isVerified: boolean
): Suggestion[] {
  if (!lastMessage) {
    return [
      { id: '1', text: 'How does Twin3 work?', action: 'how_it_works' },
      { id: '2', text: 'Show my Twin Matrix', action: 'twin_matrix' },
      { id: '3', text: 'Browse available tasks', action: 'browse_tasks' },
    ];
  }

  // Context-aware suggestions
  const suggestions: Suggestion[] = [];

  if (!isVerified) {
    suggestions.push(
      { id: 's1', text: 'Verify my account', action: 'verify_human' },
      { id: 's2', text: 'How does verification work?', action: 'how_it_works' }
    );
  } else {
    suggestions.push(
      { id: 's1', text: 'Browse tasks', action: 'browse_tasks' },
      { id: 's2', text: 'My dashboard', action: 'dashboard' }
    );
  }

  suggestions.push({ id: 's3', text: 'Show Twin Matrix', action: 'twin_matrix' });

  return suggestions;
}
