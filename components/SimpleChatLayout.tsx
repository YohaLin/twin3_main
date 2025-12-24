"use client";

import { useState, useRef, useEffect } from "react";
import { useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import {
  Menu,
  Settings,
  Send,
  Sparkles,
  LayoutDashboard,
  FileText,
  CheckSquare,
  Coins,
  Clock,
  Terminal,
  Target,
  Handshake,
} from "lucide-react";
import type { Message, Suggestion } from "../types";
import type { TaskOpportunityPayload } from "../types";
import { MessageBubble } from "../features/chat/MessageBubble";
import { TaskDetailModal } from "../features/cards/TaskDetailModal";
import { INTERACTION_INVENTORY } from "../data/inventory";
import {
  TwinMatrixWidget,
  DevConsole,
  devLog,
  InstagramConnectWidget,
  ScoreProgressWidget,
  ActiveTaskWidget,
  GlobalDashboardWidget,
} from "../features/widgets";
import {
  findNodeFromInput,
} from "../services/copilotService";

export default function SimpleChatLayout() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTask, setSelectedTask] =
    useState<TaskOpportunityPayload | null>(null);
  const [showDevConsole, setShowDevConsole] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasStarted = useRef(false);
  const messageIdCounter = useRef(0);

  // Generate unique message ID
  const generateMessageId = () => {
    messageIdCounter.current += 1;
    return `${Date.now()}-${messageIdCounter.current}`;
  };

  // Register a general chat action to handle text responses
  useCopilotAction({
    name: "respondToUser",
    description: "Respond to user questions and provide general assistance",
    parameters: [
      {
        name: "response",
        type: "string",
        description: "The response message to show to the user",
        required: true,
      },
    ],
    handler: async ({ response }: { response: string }) => {
      const aiMsg: Message = {
        id: generateMessageId(),
        role: "assistant",
        type: "text",
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
      return "Response delivered";
    },
  });

  // Provide context to CopilotKit
  useCopilotReadable({
    description: "User verification status",
    value: isVerified ? "verified" : "not verified",
  });

  useCopilotReadable({
    description: "Available twin3 features and commands",
    value: JSON.stringify({
      features: [
        "Twin Matrix visualization",
        "Task opportunities",
        "Instagram verification",
        "Global dashboard",
      ],
      commands: [
        "show twin matrix",
        "browse tasks",
        "verify instagram",
        "show dashboard",
      ],
    }),
  });

  // Register CopilotKit actions
  useCopilotAction({
    name: "showTwinMatrix",
    description:
      "Display the user's Twin Matrix - a 256-dimensional identity score visualization",
    parameters: [],
    handler: async () => {
      const widgetMsg: Message = {
        id: generateMessageId(),
        role: "assistant",
        type: "widget",
        content: "Here is your Twin Matrix visualization:",
        widget: "twin_matrix",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, widgetMsg]);
      return "Twin Matrix displayed successfully";
    },
  });

  useCopilotAction({
    name: "browseTasks",
    description: "Show available brand task opportunities",
    parameters: [],
    handler: async () => {
      const tasks = [
        {
          id: "task1",
          brand: { name: "L'Oréal Paris", logoUrl: "" },
          title: "Share your favorite lipstick shade",
          reward: { tokens: "150" },
          description:
            "Create a 30-second video showcasing your favorite L'Oréal lipstick",
          status: "open" as const,
        },
        {
          id: "task2",
          brand: { name: "Starbucks", logoUrl: "" },
          title: "Coffee Vlog Challenge",
          reward: { tokens: "200" },
          description: "Vlog your Starbucks morning routine",
          status: "open" as const,
        },
      ];

      tasks.forEach((task, index) => {
        setTimeout(() => {
          const taskMsg: Message = {
            id: generateMessageId(),
            role: "assistant",
            type: "card",
            content: "",
            cardData: {
              type: "task_opportunity",
              taskPayload: task,
            },
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, taskMsg]);
        }, index * 200);
      });

      return "Showing available tasks";
    },
  });

  useCopilotAction({
    name: "verifyInstagram",
    description: "Start Instagram verification process",
    parameters: [],
    handler: async () => {
      const widgetMsg: Message = {
        id: generateMessageId(),
        role: "assistant",
        type: "widget",
        content: "Let's verify your Instagram account:",
        widget: "instagram_connect",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, widgetMsg]);
      return "Instagram verification started";
    },
  });

  useCopilotAction({
    name: "showDashboard",
    description: "Display the global dashboard with user tasks and progress",
    parameters: [],
    handler: async () => {
      const widgetMsg: Message = {
        id: generateMessageId(),
        role: "assistant",
        type: "widget",
        content: "Here is your dashboard:",
        widget: "global_dashboard",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, widgetMsg]);
      return "Dashboard displayed";
    },
  });

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, suggestions]);

  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth >= 1024) {
          setSidebarOpen(true);
        } else {
          setSidebarOpen(false);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMounted]);

  // Initialize welcome message
  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true;
      const welcomeNode = INTERACTION_INVENTORY.find((n) => n.id === "welcome");
      if (welcomeNode) {
        setTimeout(() => {
          const welcomeMsg: Message = {
            id: "welcome",
            role: "assistant",
            type: welcomeNode.response.widget ? "widget" : "text",
            content: welcomeNode.response.text,
            widget: welcomeNode.response.widget,
            timestamp: Date.now(),
          };
          setMessages([welcomeMsg]);

          // Convert suggestedActions to Suggestions format
          const convertedSuggestions = (welcomeNode.suggestedActions || []).map((action, index) => ({
            id: `${welcomeNode.id}-suggestion-${index}`,
            text: action.label,
            action: action.payload
          }));
          setSuggestions(convertedSuggestions);
          devLog("info", "Welcome message displayed");
        }, 500);
      }
    }
  }, []);

  const triggerResponse = async (
    input: string | null,
    nodeId: string | null = null,
    showUserMessage = true,
    skipUserMessage = false
  ) => {
    if (input && showUserMessage && !skipUserMessage) {
      const userMsg: Message = {
        id: generateMessageId(),
        role: "user",
        type: "text",
        content: input,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
    }

    setIsTyping(true);
    setSuggestions([]);

    // Find the node first
    let node;
    if (nodeId) {
      node = INTERACTION_INVENTORY.find((n) => n.id === nodeId)!;
    } else if (input) {
      node = findNodeFromInput(input);
    }

    // Check if user is trying to browse tasks without verification
    if (node && node.id === "browse_tasks" && !isVerified) {
      node = INTERACTION_INVENTORY.find(
        (n) => n.id === "verification_required"
      )!;
    }

    if (node) {
      const delay = node.response.delay || 500;
      await new Promise((r) => setTimeout(r, delay));

      const aiMsg: Message = {
        id: generateMessageId(),
        role: "assistant",
        type: node.response.widget ? "widget" : "text",
        content: node.response.text,
        widget: node.response.widget,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Convert suggestedActions to Suggestions format
      const convertedSuggestions = (node.suggestedActions || []).map((action, index) => ({
        id: `${node.id}-suggestion-${index}`,
        text: action.label,
        action: action.payload
      }));
      setSuggestions(convertedSuggestions);
      setIsTyping(false);

      if (node.id === "verification_success") {
        setIsVerified(true);
      }
    } else {
      // For unmatched queries, AI will automatically call actions via CopilotKit
      // Just show typing indicator and let CopilotKit handle it
      setIsTyping(false);
    }
  };

  const handleSend = async (directMessage?: string) => {
    const message = directMessage || inputValue;
    if (!message.trim()) return;
    if (!directMessage) {
      setInputValue("");
    }

    // Add user message to our state
    const userMsg: Message = {
      id: generateMessageId(),
      role: "user",
      type: "text",
      content: message,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Always let AI decide what to do
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          isVerified,
          conversationHistory: messages.slice(-5).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Check if AI wants to trigger an action
        if (data.action) {
          await handleAIAction(data.action, data.actionData);
        }

        // Show AI text response if provided
        if (data.response) {
          const aiMsg: Message = {
            id: generateMessageId(),
            role: "assistant",
            type: "text",
            content: data.response,
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, aiMsg]);
        }

        // Update suggestions if provided
        if (data.suggestions && data.suggestions.length > 0) {
          const newSuggestions = data.suggestions.map(
            (text: string, index: number) => ({
              id: `ai-sug-${Date.now()}-${index}`,
              text: text,
              action: null,
            })
          );
          setSuggestions(newSuggestions);
        } else {
          setSuggestions([]);
        }
      }
    } catch (error) {
      console.error("Error calling AI:", error);
      const errorMsg: Message = {
        id: generateMessageId(),
        role: "assistant",
        type: "text",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = async (action: string) => {
    // Directly trigger response for the action
    devLog("info", `Quick action clicked: ${action}`);
    triggerResponse(null, action, false);
  };

  const handleInstagramVerified = (
    username: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    followersCount: number
  ) => {
    devLog("success", `Instagram verified: @${username}`);
    setIsVerified(true);

    // AI will handle showing the success message and Twin Matrix
    const successMsg: Message = {
      id: generateMessageId(),
      role: "assistant",
      type: "text",
      content:
        "✅ **Verification Complete!**\n\nYour Instagram is now linked. Let me show you your Twin Matrix Score!",
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, successMsg]);

    // Show Twin Matrix after a short delay
    setTimeout(() => {
      const matrixMsg: Message = {
        id: generateMessageId(),
        role: "assistant",
        type: "widget",
        content: "Here is your Twin Matrix visualization:",
        widget: "twin_matrix",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, matrixMsg]);
    }, 800);
  };

  const handleViewTask = (taskId: string) => {
    devLog("info", `Viewing task: ${taskId}`);

    // Map task ID to detailed task data
    const taskDetailsMap: Record<string, TaskOpportunityPayload> = {
      proof_of_humanity: {
        brand: {
          name: "twin3 protocol",
          logoUrl: "https://placehold.co/48x48/3B82F6/FFF?text=T3",
        },
        title: "Proof of Humanity",
        description:
          "Verify your human identity to unlock premium tasks and boost your Twin Matrix Score.\n\nRequirements:\n• Connect Instagram account\n• Connect LinkedIn (optional)\n• Complete WorldCoin verification\n\nThis helps establish your authentic identity in the twin3 ecosystem.",
        reward: {
          tokens: "100 $twin3",
        },
        status: "open" as const,
        spotsLeft: 999,
        imageUrl:
          "https://placehold.co/600x300/3B82F6/FFF?text=Proof+of+Humanity",
      },
      share_on_x: {
        brand: {
          name: "X (Twitter)",
          logoUrl: "https://placehold.co/48x48/000000/FFF?text=X",
        },
        title: "Share your Twin Matrix",
        description:
          "Share your Twin Matrix visualization on X (Twitter) to unlock rewards and showcase your digital identity!\n\nRequirements:\n• Generate your Twin Matrix\n• Post on X with hashtag #twin3\n• Submit proof of post URL\n\nDeadline: 24 hours remaining",
        reward: {
          tokens: "200 $twin3",
        },
        status: "open" as const,
        spotsLeft: 50,
        deadline: "24 hours",
        imageUrl: "https://placehold.co/600x300/000000/FFF?text=Share+on+X",
      },
      connect_linkedin: {
        brand: {
          name: "LinkedIn",
          logoUrl: "https://placehold.co/48x48/0077B5/FFF?text=in",
        },
        title: "Connect Professional Identity",
        description:
          "Link your LinkedIn profile to enhance your Twin Matrix Score with professional credentials.\n\nRequirements:\n• Connect your LinkedIn account\n• Verify employment history\n• Complete profile authentication\n\nStatus: Under review - we're verifying your submission.",
        reward: {
          tokens: "500 $twin3",
        },
        status: "open" as const,
        spotsLeft: 25,
        imageUrl:
          "https://placehold.co/600x300/0077B5/FFF?text=LinkedIn+Connect",
      },
      loreal_campaign: {
        brand: {
          name: "L'Oréal Paris",
          logoUrl: "https://placehold.co/48x48/E1306C/FFF?text=L",
        },
        title: "Lipstick Filter Challenge",
        description:
          "Create engaging content featuring L'Oréal's new lipstick line using our AR filter.\n\nRequirements:\n• Use Filter #666\n• Mention 'Moisturizing'\n• Tag @lorealparis\n• Video length 15-60s\n\nThis task has been completed. Great work!",
        reward: {
          tokens: "500 $twin3",
          gift: "Full PR Package (Worth $3000)",
        },
        status: "closed" as const,
        imageUrl:
          "https://placehold.co/600x300/E1306C/FFF?text=Lipstick+Campaign",
      },
    };

    const taskDetail = taskDetailsMap[taskId];
    if (taskDetail) {
      setSelectedTask(taskDetail);
    } else {
      // Fallback: trigger response for unknown tasks
      triggerResponse(null, taskId, false);
    }
  };

  const handleAIAction = async (action: string, actionData?: any) => {
    switch (action) {
      case "show_instagram_widget":
        const instagramMsg: Message = {
          id: generateMessageId(),
          role: "assistant",
          type: "widget",
          content: "Connect your Instagram to verify your identity:",
          widget: "instagram_connect",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, instagramMsg]);
        break;

      case "show_twin_matrix":
        const matrixMsg: Message = {
          id: generateMessageId(),
          role: "assistant",
          type: "widget",
          content: "Here is your Twin Matrix visualization:",
          widget: "twin_matrix",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, matrixMsg]);
        break;

      case "show_tasks":
        const tasks = actionData?.tasks || [
          {
            id: "task1",
            brand: { name: "L'Oréal Paris", logoUrl: "" },
            title: "Share your favorite lipstick shade",
            reward: { tokens: "150" },
            description:
              "Create a 30-second video showcasing your favorite L'Oréal lipstick",
            status: "open" as const,
          },
          {
            id: "task2",
            brand: { name: "Starbucks", logoUrl: "" },
            title: "Coffee Vlog Challenge",
            reward: { tokens: "200" },
            description: "Vlog your Starbucks morning routine",
            status: "open" as const,
          },
        ];

        tasks.forEach((task: any, index: number) => {
          setTimeout(() => {
            const taskMsg: Message = {
              id: generateMessageId(),
              role: "assistant",
              type: "card",
              content: "",
              cardData: {
                type: "task_opportunity",
                taskPayload: task,
              },
              timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, taskMsg]);
          }, index * 200);
        });
        break;

      case "show_dashboard":
        const dashboardMsg: Message = {
          id: generateMessageId(),
          role: "assistant",
          type: "widget",
          content: "Here is your dashboard:",
          widget: "global_dashboard",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, dashboardMsg]);
        break;

      default:
        console.log("Unknown action:", action);
    }
  };

  const quickActions = [
    { icon: FileText, label: "Browse All Tasks", action: "browse_tasks" },
    { icon: LayoutDashboard, label: "My Dashboard", action: "dashboard" },
    { icon: CheckSquare, label: "Tasks In Progress", action: "dashboard" },
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* Left Sidebar - same as before */}
      <div
        style={{
          width: sidebarOpen ? "280px" : "0",
          transition: "width 0.3s ease",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRight: sidebarOpen ? "1px solid var(--glass-border)" : "none",
          background: "var(--glass-bg)",
          backdropFilter: "blur(var(--glass-blur)) saturate(180%)",
        }}
      >
        {sidebarOpen && (
          <div
            className="animate-fade-in"
            style={{
              padding: "var(--space-lg)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-lg)",
              height: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-sm)",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "var(--radius-md)",
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #8e8e93 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={18} color="#000" />
              </div>
              <span
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                }}
              >
                twin3.ai
              </span>
            </div>

            <ScoreProgressWidget score={156} tier="Fair" />

            <div
              className="glass"
              style={{
                padding: "var(--space-md)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-sm)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "var(--space-sm)",
                }}
              >
                <Coins size={16} color="var(--color-success)" />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--color-text-primary)",
                  }}
                >
                  Gas Free Minting
                </span>
              </div>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.5,
                  textAlign: "center",
                }}
              >
                Mint your Twin NFT without paying gas fees
              </p>

              <p
                style={{
                  fontSize: "48px",
                  color: "white",
                  lineHeight: 1.5,
                  textAlign: "center",
                }}
              >
                2750
              </p>
            </div>

            <div style={{ flex: 1 }} />

            <button
              className="btn btn-ghost"
              style={{ width: "100%", justifyContent: "flex-start" }}
            >
              <Settings size={16} />
              Settings
            </button>
          </div>
        )}
      </div>

      {/* Main Content - continues in next part... */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <header
          className="glass"
          style={{
            height: "64px",
            borderBottom: "1px solid var(--glass-border)",
            display: "flex",
            alignItems: "center",
            padding: "0 var(--space-lg)",
            gap: "var(--space-md)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "var(--space-sm)",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-text-secondary)",
            }}
          >
            <Menu size={20} />
          </button>
          <h1
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "var(--color-text-primary)",
            }}
          >
            Twin AI Assistant
          </h1>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setShowDevConsole(!showDevConsole)}
            style={{
              background: "transparent",
              border: "1px solid var(--glass-border)",
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "var(--radius-sm)",
              color: "var(--color-text-secondary)",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-xs)",
            }}
          >
            <Terminal size={14} />
            DevConsole
          </button>
        </header>

        {/* Messages */}
        <div
          className="scrollbar-hide"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "var(--space-lg)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-md)",
          }}
        >
          {messages.map((msg) => {
            if (msg.widget === "feature_grid") {
              const features = [
                {
                  icon: Target,
                  title: "Discover Your Value",
                  desc: "AI analyzes your unique influence and generates your Twin Matrix Score (0-255)",
                },
                {
                  icon: Handshake,
                  title: "Match Brand Tasks",
                  desc: "Higher scores unlock premium brand collaborations with better rewards",
                },
                {
                  icon: Sparkles,
                  title: "Build Digital Assets",
                  desc: "Transform your influence into portable proof of authenticity for the AI era",
                },
              ];

              return (
                <div key={msg.id} style={{ width: '100%' }}>
                  <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    padding: '0 var(--space-lg)'
                  }}>
                    <MessageBubble message={msg} />
                  </div>
                  <div
                    className="animate-fade-in"
                    style={{
                      textAlign: "center",
                      padding: "20px 20px 40px",
                      maxWidth: "1200px",
                      margin: "0 auto",
                    }}
                  >
                    <h1
                      style={{
                        fontSize: "56px",
                        fontWeight: 700,
                        color: "var(--color-text-primary)",
                        marginBottom: "24px",
                        lineHeight: 1.1,
                      }}
                    >
                      Welcome to twin3
                  </h1>
                  <p
                    style={{
                      fontSize: "20px",
                      fontWeight: 500,
                      color: "var(--color-text-primary)",
                      marginBottom: "16px",
                      maxWidth: "900px",
                      margin: "0 auto 16px",
                    }}
                  >
                    twin3 transforms your social influence into a verifiable
                    digital identity.
                  </p>
                  <p
                    style={{
                      fontSize: "18px",
                      color: "var(--color-text-secondary)",
                      marginBottom: "48px",
                      maxWidth: "900px",
                      margin: "0 auto 48px",
                    }}
                  >
                    AI analyzes your content style and engagement to unlock
                    exclusive brand collaborations.
                  </p>
                  <button
                    onClick={() => triggerResponse(null, "verify_human", false)}
                    className="btn btn-primary"
                    style={{
                      fontSize: "16px",
                      padding: "16px 48px",
                      marginBottom: "80px",
                      borderRadius: "12px",
                      fontWeight: 500,
                    }}
                  >
                    Discover My Value
                  </button>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(280px, 1fr))",
                      gap: "24px",
                      marginTop: "60px",
                    }}
                  >
                    {features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="glass"
                        style={{
                          padding: "32px 24px",
                          borderRadius: "16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                          textAlign: "left",
                          background: "rgba(255, 255, 255, 0.02)",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                        }}
                      >
                        <feat.icon
                          size={32}
                          color="var(--color-text-primary)"
                          strokeWidth={1.5}
                        />
                        <h3
                          style={{
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {feat.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "14px",
                            color: "var(--color-text-secondary)",
                            lineHeight: 1.6,
                          }}
                        >
                          {feat.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                  </div>
                </div>
              );
            }

            if (
              msg.type === "card" &&
              msg.cardData?.type === "task_opportunity"
            ) {
              const task = msg.cardData.taskPayload;
              return (
                <div
                  key={msg.id}
                  className="animate-fade-in-scale"
                  style={{ maxWidth: "600px" }}
                >
                  <div
                    className="glass card-hover"
                    style={{
                      padding: "var(--space-lg)",
                      borderRadius: "var(--radius-xl)",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedTask(task)}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "var(--space-md)",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "13px",
                            color: "var(--color-text-secondary)",
                            marginBottom: "4px",
                          }}
                        >
                          {task.brand.name}
                        </div>
                        <h3
                          style={{
                            fontSize: "16px",
                            fontWeight: 600,
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {task.title}
                        </h3>
                      </div>
                      <div
                        style={{
                          background: "rgba(48, 209, 88, 0.1)",
                          border: "1px solid rgba(48, 209, 88, 0.3)",
                          borderRadius: "var(--radius-md)",
                          padding: "6px 12px",
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "var(--color-success)",
                        }}
                      >
                        {task.reward.tokens} pts
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "var(--color-text-secondary)",
                        marginBottom: "var(--space-md)",
                      }}
                    >
                      {task.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: "var(--space-sm)",
                        flexWrap: "wrap",
                      }}
                    >
                      <div className="chip">
                        <Clock size={14} />
                        3-5 days
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            if (msg.widget) {
              let widgetComponent;
              switch (msg.widget) {
                case "twin_matrix":
                  widgetComponent = <TwinMatrixWidget />;
                  break;
                case "instagram_connect":
                  widgetComponent = (
                    <InstagramConnectWidget
                      onVerified={handleInstagramVerified}
                    />
                  );
                  break;
                case "active_task":
                  widgetComponent = <ActiveTaskWidget />;
                  break;
                case "global_dashboard":
                  widgetComponent = (
                    <GlobalDashboardWidget onViewTask={handleViewTask} />
                  );
                  break;
                default:
                  widgetComponent = null;
              }

              return widgetComponent ? (
                <div
                  key={msg.id}
                  className="animate-fade-in-scale"
                  style={{ maxWidth: "900px" }}
                >
                  <MessageBubble message={msg} />
                  {widgetComponent}
                </div>
              ) : (
                <MessageBubble key={msg.id} message={msg} />
              );
            }

            return <MessageBubble key={msg.id} message={msg} />;
          })}

          {isTyping && (
            <div
              className="animate-fade-in"
              style={{
                display: "flex",
                gap: "var(--space-sm)",
                alignItems: "center",
              }}
            >
              <div
                className="glass"
                style={{
                  padding: "12px 16px",
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  gap: "6px",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--color-text-secondary)",
                      animation: `bounce 1.2s ease-in-out ${i * 0.15}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={scrollRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div
            className="animate-fade-in"
            style={{
              padding: "0 var(--space-lg) var(--space-md)",
              display: "flex",
              gap: "var(--space-sm)",
              flexWrap: "wrap",
            }}
          >
            {suggestions.map((sug) => (
              <button
                key={sug.id}
                className="chip"
                onClick={() => triggerResponse(null, sug.action || null, false)}
              >
                {sug.text}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          className="glass"
          style={{
            borderTop: "1px solid var(--glass-border)",
            padding: "var(--space-lg)",
          }}
        >
          <div
            className="glass"
            style={{
              display: "flex",
              gap: "var(--space-sm)",
              alignItems: "flex-end",
              padding: "var(--space-sm)",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Twin3, tasks, or your digital twin..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: "var(--color-text-primary)",
                fontSize: "14px",
                resize: "none",
                outline: "none",
                minHeight: "40px",
                maxHeight: "120px",
                padding: "var(--space-sm)",
              }}
              rows={1}
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
              className="btn btn-primary"
              style={{
                padding: "10px 16px",
                minWidth: "auto",
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div
        className="right-sidebar"
        style={{
          width: "320px",
          borderLeft: "1px solid var(--glass-border)",
          background: "var(--glass-bg)",
          backdropFilter: "blur(var(--glass-blur)) saturate(180%)",
          padding: "var(--space-lg)",
          flexDirection: "column",
          gap: "var(--space-lg)",
        }}
      >
        <h2
          style={{
            fontSize: "15px",
            fontWeight: 600,
            color: "var(--color-text-primary)",
          }}
        >
          Quick Actions
        </h2>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-sm)",
          }}
        >
          {quickActions.map((qa, idx) => (
            <button
              key={idx}
              className="glass glass-hover"
              onClick={() => handleQuickAction(qa.action)}
              style={{
                padding: "var(--space-md)",
                borderRadius: "var(--radius-lg)",
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "var(--space-sm)",
                textAlign: "left",
              }}
            >
              <qa.icon size={18} color="var(--color-primary)" />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "var(--color-text-primary)",
                }}
              >
                {qa.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Modals */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onAccept={() => {
            setSelectedTask(null);
            triggerResponse(null, "accept_task", false);
          }}
        />
      )}

      {showDevConsole && (
        <DevConsole
          isOpen={showDevConsole}
          onClose={() => setShowDevConsole(false)}
        />
      )}
    </div>
  );
}
