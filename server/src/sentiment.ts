type SentimentResult = {
  sentiment: string;
  riskLevel: string;
};

const negativeWords = [
  "angry",
  "frustrated",
  "terrible",
  "awful",
  "bad",
  "hate",
  "broken",
  "issue",
  "problem",
  "cannot",
  "can't",
  "failed",
];

const urgentWords = [
  "urgent",
  "immediately",
  "asap",
  "emergency",
  "now",
  "critical",
];

export function analyzeSentiment(text: string): SentimentResult {
  const lowerText = text.toLowerCase();

  let negativeScore = 0;
  let urgentScore = 0;

  for (const word of negativeWords) {
    if (lowerText.includes(word)) {
      negativeScore++;
    }
  }

  for (const word of urgentWords) {
    if (lowerText.includes(word)) {
      urgentScore++;
    }
  }

  if (urgentScore >= 1) {
    return {
      sentiment: "NEGATIVE",
      riskLevel: "HIGH",
    };
  }

  if (negativeScore >= 2) {
    return {
      sentiment: "NEGATIVE",
      riskLevel: "MEDIUM",
    };
  }

  if (negativeScore >= 1) {
    return {
      sentiment: "NEGATIVE",
      riskLevel: "LOW",
    };
  }

  return {
    sentiment: "NEUTRAL",
    riskLevel: "LOW",
  };
}