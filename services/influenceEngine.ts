/**
 * Influence Engine - Score Calculation for twin3
 * Ported from instagent with twin3 adaptations
 */

export interface ScoreInput {
    followers: number;
    engagement: number;    // Likes + Comments
    saves: number;         // High-value interactions
    monthsActive: number;  // Account age
}

/**
 * Calculate influence score (0-255 range)
 * Formula: Score = Norm( W1*Log(Reach) + W2*Log(Engagement) + W3*Log(Saves) + W4*Log(MonthsActive) )
 */
export const calculateInfluenceScore = (input: ScoreInput): number => {
    const { followers, engagement, saves, monthsActive } = input;

    // Safe values to avoid log(0)
    const safeFollowers = Math.max(10, followers);
    const safeEngagement = Math.max(10, engagement);
    const safeSaves = Math.max(10, saves);
    const safeMonths = Math.max(1, monthsActive);

    // Weights
    const W1 = 12;  // Reach/Followers
    const W2 = 18;  // Engagement
    const W3 = 28;  // Saves (highest - value density)
    const W4 = 8;   // Legacy (account age)

    // Score components
    const scoreReach = Math.log10(safeFollowers) * W1;
    const scoreEngagement = Math.log10(safeEngagement) * W2;
    const scoreSaves = Math.log10(safeSaves) * W3;
    const scoreLegacy = Math.log10(safeMonths) * W4;

    // Sum and normalize
    const rawScore = scoreReach + scoreEngagement + scoreSaves + scoreLegacy;
    const finalScore = Math.min(255, Math.max(0, Math.round(rawScore * 0.82)));

    return finalScore;
};

/**
 * Get tier color based on score
 */
export const getScoreTier = (score: number): { tier: string; color: string } => {
    if (score >= 220) return { tier: 'Mythic', color: '#FF0055' };
    if (score >= 180) return { tier: 'Elite', color: '#833AB4' };
    if (score >= 140) return { tier: 'High', color: '#C13584' };
    if (score >= 100) return { tier: 'Good', color: '#F56040' };
    if (score >= 60) return { tier: 'Fair', color: '#FCAF45' };
    return { tier: 'Starter', color: '#6B7280' };
};

/**
 * Calculate twin3 matrix score from 6 dimensions
 * Returns 0-255 score
 */
export const calculateMatrixScore = (dimensions: {
    physical: number;
    digital: number;
    social: number;
    cognitive: number;
    emotional: number;
    spiritual: number;
}): number => {
    const { physical, digital, social, cognitive, emotional, spiritual } = dimensions;

    // Weighted average (digital and social have higher weights)
    const weights = {
        physical: 0.12,
        digital: 0.22,
        social: 0.25,
        cognitive: 0.18,
        emotional: 0.13,
        spiritual: 0.10
    };

    const weightedSum =
        physical * weights.physical +
        digital * weights.digital +
        social * weights.social +
        cognitive * weights.cognitive +
        emotional * weights.emotional +
        spiritual * weights.spiritual;

    // Scale to 0-255
    return Math.round((weightedSum / 100) * 255);
};
