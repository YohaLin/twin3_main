import React, { useState } from "react";
import {
  Instagram,
  ArrowRight,
  CheckCircle,
  Shield,
  Target,
  Gift,
  Zap,
} from "lucide-react";

/**
 * ============================================================
 * DEVELOPER NOTE: Instagram OAuth Integration
 * ============================================================
 *
 * This component currently uses a MOCK flow for demonstration.
 *
 * For production, implement Instagram Basic Display API OAuth:
 *
 * 1. Register your app at https://developers.facebook.com/
 * 2. Configure Instagram Basic Display product
 * 3. Implement OAuth 2.0 flow:
 *    - Redirect to: https://api.instagram.com/oauth/authorize
 *    - Handle callback with authorization code
 *    - Exchange code for access_token
 *    - Fetch user profile: GET /me?fields=id,username,account_type
 *
 * Required scopes: user_profile, user_media
 *
 * Reference: https://developers.facebook.com/docs/instagram-basic-display-api
 * Similar implementation: https://app.passport.xyz
 * ============================================================
 */

// Instagram gradient for button
const INSTAGRAM_GRADIENT = "linear-gradient(135deg, #833AB4, #E1306C, #F77737)";

interface InstagramConnectWidgetProps {
  onConnect?: (username: string) => void;
  onVerified?: (username: string, followersCount: number) => void;
}

type FlowStep = "intro" | "authorizing" | "success";

export const InstagramConnectWidget: React.FC<InstagramConnectWidgetProps> = ({
  onConnect,
  onVerified,
}) => {
  const [step, setStep] = useState<FlowStep>("intro");
  const [mockUsername, setMockUsername] = useState("");
  const [mockFollowersCount, setMockFollowersCount] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  const handleConnectClick = () => {
    setStep("authorizing");

    // TODO: In production, redirect to Instagram OAuth URL
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 20;
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        setMockUsername("demo_user");
        // Provide a mock followers count for the demo flow so handlers
        // (like onVerified) receive a valid numeric value instead of
        // referencing an undefined identifier.
        setMockFollowersCount(1240);
        setStep("success");
      }
    }, 600);
  };

  // Step 1: Introduction
  if (step === "intro") {
    return (
      <div
        className="card animate-fade-in"
        style={{
          maxWidth: "400px",
          padding: "28px",
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          {/* Instagram icon with gradient background */}
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: INSTAGRAM_GRADIENT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Instagram size={26} color="white" />
          </div>
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 500,
                color: "var(--color-text-primary)",
                marginBottom: "2px",
              }}
            >
              Connect Instagram
            </h3>
            <p
              style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}
            >
              Verify your social identity
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          <BenefitRow
            icon={<Target size={16} />}
            text="Generate your Twin Matrix Score (0-255)"
          />
          <BenefitRow
            icon={<Gift size={16} />}
            text="Higher scores unlock premium tasks"
          />
          <BenefitRow
            icon={<Zap size={16} />}
            text="Verified creators earn 3-5x more"
          />
        </div>

        {/* Connect Button - Instagram gradient, just "Connect" text */}
        <button
          onClick={handleConnectClick}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "15px",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: INSTAGRAM_GRADIENT,
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          Connect
        </button>

        {/* Security note */}
        <div
          style={{
            marginTop: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            fontSize: "12px",
            color: "var(--color-text-dim)",
          }}
        >
          <Shield size={12} />
          Secure OAuth — we never see your password
        </div>
      </div>
    );
  }

  // Step 2: Authorizing
  if (step === "authorizing") {
    return (
      <div
        className="card animate-fade-in"
        style={{
          maxWidth: "400px",
          padding: "40px 28px",
          background: "var(--glass-bg)",
          border: "1px solid var(--glass-border)",
          textAlign: "center",
        }}
      >
        {/* Instagram icon with gradient */}
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "18px",
            background: INSTAGRAM_GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <Instagram size={36} color="white" />
        </div>

        <h3
          style={{
            fontSize: "18px",
            fontWeight: 500,
            color: "var(--color-text-primary)",
            marginBottom: "8px",
          }}
        >
          Connecting to Instagram
        </h3>
        <p
          style={{
            fontSize: "14px",
            color: "var(--color-text-secondary)",
            marginBottom: "24px",
          }}
        >
          Authorizing your account...
        </p>

        {/* Progress Bar - gradient */}
        <div
          style={{
            width: "100%",
            height: "4px",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "2px",
            overflow: "hidden",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: INSTAGRAM_GRADIENT,
              borderRadius: "2px",
              transition: "width 0.5s ease",
            }}
          />
        </div>

        <p style={{ fontSize: "12px", color: "var(--color-text-dim)" }}>
          {progress < 40
            ? "Opening Instagram..."
            : progress < 70
              ? "Waiting for authorization..."
              : "Fetching profile..."}
        </p>

        {/* Dev indicator */}
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "rgba(255, 159, 10, 0.1)",
            border: "1px solid rgba(255, 159, 10, 0.2)",
            borderRadius: "8px",
            fontSize: "11px",
            color: "var(--color-warning)",
          }}
        >
          <strong>DEV:</strong> Mock OAuth flow
        </div>
      </div>
    );
  }

  // Step 3: Success
  return (
    <div
      className="card animate-fade-in"
      style={{
        maxWidth: "400px",
        padding: "40px 28px",
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        textAlign: "center",
      }}
    >
      {/* Success icon - green */}
      <div
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "rgba(48, 209, 88, 0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <CheckCircle size={36} color="var(--color-success)" />
      </div>

      <h3
        style={{
          fontSize: "18px",
          fontWeight: 500,
          color: "var(--color-text-primary)",
          marginBottom: "8px",
        }}
      >
        Connected Successfully
      </h3>
      <p
        style={{
          fontSize: "14px",
          color: "var(--color-text-secondary)",
          marginBottom: "24px",
        }}
      >
        @{mockUsername} is now linked
      </p>

      {/* Profile card */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "14px",
          background: "rgba(255, 255, 255, 0.04)",
          borderRadius: "12px",
          border: "1px solid var(--glass-border)",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: INSTAGRAM_GRADIENT,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Instagram size={22} color="white" />
        </div>
        <div style={{ textAlign: "left", flex: 1 }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--color-text-primary)",
            }}
          >
            @{mockUsername}
          </div>
          <div
            style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}
          >
            Verified
          </div>
        </div>
        <CheckCircle size={18} color="var(--color-success)" />
      </div>

      {/* Continue button - white primary */}
      <button
        onClick={() => {
          onConnect?.(mockUsername);
          onVerified?.(mockUsername, mockFollowersCount);
        }}
        className="btn btn-primary"
        style={{
          width: "100%",
          padding: "14px",
          fontSize: "15px",
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        View My Twin Matrix
        <ArrowRight size={16} />
      </button>
    </div>
  );
};

// Benefit row component - white icon, vertically centered
const BenefitRow: React.FC<{ icon: React.ReactNode; text: string }> = ({
  icon,
  text,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 14px",
      background: "rgba(255, 255, 255, 0.08)",
      borderRadius: "10px",
      border: "1px solid rgba(255, 255, 255, 0.12)",
    }}
  >
    <div
      style={{
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <span
      style={{
        fontSize: "14px",
        color: "var(--color-text-primary)",
        lineHeight: 1.4,
      }}
    >
      {text}
    </span>
  </div>
);
