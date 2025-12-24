"use client";

import { useState, useRef, useEffect } from "react";
import { useCopilotChat } from "@copilotkit/react-core";
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
  Users,
  Terminal,
  Target,
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
  useA2UIActions,
  useA2UIContext,
  findNodeFromInput,
  type WidgetPayload,
} from "../services/copilotService";

export default function ChatLayoutWithCopilot() {
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

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // CopilotKit chat integration
  const { isLoading } = useCopilotChat();

  // Register A2UI actions with CopilotKit
  useA2UIActions(
    // onShowWidget
    (payload: WidgetPayload) => {
      devLog("info", `Showing widget: ${payload.type}`);
      const widgetMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        type: "widget",
        content: "",
        widget: payload.type,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, widgetMsg]);
    },
    // onVerify
    (verified: boolean) => {
      setIsVerified(verified);
      devLog("success", `User verification status: ${verified}`);
    },
    // onShowTasks
    (tasks: any[]) => {
      tasks.forEach((task, index) => {
        setTimeout(() => {
          const taskMsg: Message = {
            id: `task-${task.id}-${Date.now()}`,
            role: "assistant",
            type: "card",
            content: "",
            cardData: {
              type: "task_opportunity",
              payload: task,
            },
            timestamp: Date.now(),
          };
          setMessages((prev) => [...prev, taskMsg]);
        }, index * 200);
      });
    }
  );

  // Provide context to CopilotKit
  useA2UIContext(isVerified, messages);

  // Quick Actions
  const quickActions = [
    { icon: FileText, label: "Browse All Tasks", action: "browse_tasks" },
    { icon: LayoutDashboard, label: "My Dashboard", action: "dashboard" },
    { icon: CheckSquare, label: "Tasks In Progress", action: "dashboard" },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, suggestions]);

  useEffect(() => {
    // Auto-open sidebar on desktop (client-side only)
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
          setSuggestions(welcomeNode.response.suggestions || []);
          devLog("info", "Welcome message displayed");
        }, 500);
      }
    }
  }, []);

  const triggerResponse = async (
    input: string | null,
    nodeId: string | null = null,
    showUserMessage = true
  ) => {
    // Verification gate
    const targetId = nodeId || input;
    if (
      (targetId === "browse_tasks" || input === "browse_tasks") &&
      !isVerified
    ) {
      nodeId = "verification_required";
      input = null;
      showUserMessage = false;
      devLog("info", "User not verified - redirecting to verification flow");
    }

    if (input && showUserMessage) {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        type: "text",
        content: input,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);
    }

    setIsTyping(true);
    setSuggestions([]);

    let node;
    if (nodeId) {
      node = INTERACTION_INVENTORY.find((n) => n.id === nodeId)!;
    } else if (input) {
      node = findNodeFromInput(input);
    }

    // If found a matching node, use inventory response
    if (node) {
      const delay = node.response.delay || 500;
      await new Promise((r) => setTimeout(r, delay));

      const aiMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        type: node.response.widget ? "widget" : "text",
        content: node.response.text,
        widget: node.response.widget,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setSuggestions(node.response.suggestions || []);
      setIsTyping(false);

      // Handle special actions
      if (node.id === "verification_success") {
        setIsVerified(true);
        devLog("success", "User verified successfully");
      }

      devLog("info", `Matched inventory node: ${node.id}`);
    } else if (input) {
      // Use fallback for unmatched queries (CopilotKit integration needs refinement)
      devLog("info", "No inventory match - using fallback");

      const fallbackNode = INTERACTION_INVENTORY.find(
        (n) => n.id === "fallback"
      );
      if (fallbackNode) {
        await new Promise((r) =>
          setTimeout(r, fallbackNode.response.delay || 500)
        );

        const aiMsg: Message = {
          id: Date.now().toString(),
          role: "assistant",
          type: "text",
          content: fallbackNode.response.text,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setSuggestions(fallbackNode.response.suggestions || []);
      }

      setIsTyping(false);
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const message = inputValue;
    setInputValue("");
    triggerResponse(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (action: string) => {
    devLog("info", `Quick action triggered: ${action}`);
    if (action === "dashboard") {
      triggerResponse(null, "dashboard", false);
    } else {
      triggerResponse(action, null, false);
    }
  };

  const handleInstagramVerified = (
    username: string,
    followersCount: number
  ) => {
    devLog(
      "success",
      `Instagram verified: @${username} with ${followersCount} followers`
    );
    triggerResponse(null, "verification_success", false);
  };

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
      {/* Left Sidebar */}
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
            {/* Logo */}
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

            {/* Score Widget */}
            <ScoreProgressWidget score={156} tier="Fair" />

            {/* Gas Free Minting */}
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
                }}
              >
                Mint your Twin NFT without paying gas fees
              </p>
            </div>

            <div style={{ flex: 1 }} />

            {/* Settings */}
            <button
              className="btn btn-ghost"
              style={{ width: "100%", justifyContent: "flex-start" }}
              onClick={() => devLog("info", "Settings clicked")}
            >
              <Settings size={16} />
              Settings
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
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
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
              e.currentTarget.style.color = "var(--color-text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--color-text-secondary)";
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
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "var(--glass-border)";
            }}
          >
            <Terminal size={14} />
            DevConsole
          </button>
        </header>

        {/* Messages Area */}
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
            // Special rendering for feature_grid
            if (msg.widget === "feature_grid") {
              const features = [
                {
                  icon: Target,
                  title: "Brand Partnerships",
                  desc: "Work with top brands",
                },
                {
                  icon: Coins,
                  title: "Earn Rewards",
                  desc: "Get paid for your influence",
                },
                {
                  icon: Users,
                  title: "Build Community",
                  desc: "Connect with other creators",
                },
                {
                  icon: Sparkles,
                  title: "AI-Powered Matching",
                  desc: "Perfect task recommendations",
                },
              ];

              return (
                <div key={msg.id}>
                  <MessageBubble message={msg} />
                  <div
                    className="animate-fade-in"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "var(--space-md)",
                      margin: "var(--space-md) 0",
                    }}
                  >
                    {features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="glass glass-hover"
                        style={{
                          padding: "var(--space-lg)",
                          borderRadius: "var(--radius-lg)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "var(--space-sm)",
                          cursor: "pointer",
                        }}
                      >
                        <feat.icon size={24} color="var(--color-primary)" />
                        <h3
                          style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {feat.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "var(--color-text-secondary)",
                          }}
                        >
                          {feat.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            // Special rendering for task cards
            if (
              msg.type === "card" &&
              msg.cardData?.type === "task_opportunity"
            ) {
              const task = msg.cardData.payload;
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
                          {task.brand}
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
                        {task.reward} pts
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
                        {task.timeframe || "3-5 days"}
                      </div>
                      <div className="chip">
                        <Target size={14} />
                        {task.category}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Widget rendering
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
                  widgetComponent = <GlobalDashboardWidget />;
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

          {/* Typing Indicator */}
          {(isTyping || isLoading) && (
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
                onClick={() => {
                  devLog("info", `Suggestion clicked: ${sug.text}`);
                  triggerResponse(sug.text, sug.action || null, false);
                }}
              >
                {sug.text}
              </button>
            ))}
          </div>
        )}

        {/* Input Area */}
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
              onClick={handleSend}
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

      {/* Right Sidebar - Quick Actions (Desktop only) */}
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
                transition: "all 0.2s ease",
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
            devLog("success", `Task accepted: ${selectedTask.title}`);
            setSelectedTask(null);
            triggerResponse(null, "accept_task", false);
          }}
        />
      )}

      {showDevConsole && (
        <DevConsole onClose={() => setShowDevConsole(false)} />
      )}
    </div>
  );
}
