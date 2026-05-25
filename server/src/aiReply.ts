type ReplyInput = {
  title: string;
  description: string;
  category: string;
  sentiment: string;
  riskLevel: string;
};

//Suggested Replies to ticket queries based of urgency and sentiments
export function generateSuggestedReply(ticket: ReplyInput): string {
  const text = `${ticket.title} ${ticket.description}`.toLowerCase();

  if (ticket.riskLevel === "HIGH") {
    return "I’m really sorry you’re experiencing this issue. I understand this is urgent, and I’ll prioritise this ticket so we can help resolve it as quickly as possible.";
  }

  if (ticket.category === "Login Issue") {
    return "I’m sorry you’re having trouble logging in. Could you confirm whether you are seeing an error message, and whether you have already tried resetting your password?";
  }

  if (ticket.category === "Payment Issue") {
    return "I’m sorry there’s an issue with your payment. Could you please confirm the payment method used and whether any error message appeared during the transaction?";
  }

  if (ticket.category === "Technical Bug") {
    return "Thanks for reporting this. Could you provide the steps you followed before the issue occurred, along with any screenshots or error messages if available?";
  }

  if (text.includes("password")) {
    return "It sounds like this may be related to password access. Please try resetting your password, and let us know if the issue continues after that.";
  }

  if (ticket.sentiment === "NEGATIVE") {
    return "I’m sorry this has caused frustration. I’ll look into this carefully and help guide you through the next steps.";
  }

  return "Thanks for reaching out. I’ll review the details of your request and help you with the next steps.";
}