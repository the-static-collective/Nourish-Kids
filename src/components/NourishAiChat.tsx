import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles, RefreshCw, AlertCircle, Heart, Lightbulb } from "lucide-react";
import { ChatMessage } from "../types";

export const NourishAiChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "assistant",
      content:
        "Hello! I'm Nourish AI, your warm, judgment-free kitchen companion. Tell me what ingredients you have, what your child likes or dislikes, or any budget goal, and I'll give you instant, practical meal ideas and tips!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "I have 2 eggs, 1 slice of bread, and an apple. What can I make for my 2-year-old?",
    "What are high-iron budget foods for a toddler?",
    "How to make canned beans taste delicious to a picky 5-year-old?",
    "My toddler is teething and rejecting hard foods, what soft nutritious ideas can I make?",
    "How do I stretch 1 lb of ground meat or lentils into 4 kid meals?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to contact AI assistant.");
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I am here to help you nourish your child.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Sorry, I had trouble generating a response. Please check your connection and try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#fffdfa] rounded-2xl border border-[#e8ded1] shadow-sm flex flex-col h-[75vh] max-h-[700px] overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-[#2b2219] text-[#fffdfa] p-4 sm:p-5 flex items-center justify-between border-b border-[#3f3126]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#b85a22] flex items-center justify-center text-white shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
              <span>Nourish AI Companion</span>
              <span className="text-[10px] bg-[#436a52] text-[#e3eedb] px-2 py-0.5 rounded-full font-bold">
                Gemini 3.6 Flash
              </span>
            </h3>
            <p className="text-xs text-[#d1c2b5]">Ask anything about budget cooking, toddler safety, or picky eating</p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: "welcome-reset",
                role: "assistant",
                content: "Chat cleared! What's on your mind or in your pantry today?",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              },
            ])
          }
          className="text-xs text-[#d1c2b5] hover:text-white hover:underline transition"
        >
          Reset Chat
        </button>
      </div>

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#fcf9f5]">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs sm:text-sm ${
                isUser ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-xs ${
                  isUser ? "bg-[#2b2219]" : "bg-[#b85a22]"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 space-y-1.5 shadow-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? "bg-[#2b2219] text-[#fffdfa] rounded-tr-none"
                    : "bg-white text-[#2b2219] border border-[#e8ded1] rounded-tl-none"
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[10px] opacity-70 border-b border-current/10 pb-1 font-semibold">
                  <span>{isUser ? "You" : "Nourish AI"}</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div>{msg.content}</div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 text-xs sm:text-sm flex-row">
            <div className="w-8 h-8 rounded-full bg-[#b85a22] flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-white text-[#544538] border border-[#e8ded1] rounded-2xl rounded-tl-none p-4 flex items-center gap-2 font-medium">
              <RefreshCw className="w-4 h-4 animate-spin text-[#b85a22]" />
              <span>Nourish AI is thinking of kid-friendly meal ideas...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="p-3 bg-[#f9f3ec] border-t border-[#e8ded1] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-2">
        <span className="text-[11px] font-bold text-[#8a5b28] flex items-center gap-1 shrink-0 self-center pr-1">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Tap to ask:</span>
        </span>
        {samplePrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#e8ded1] text-xs text-[#544538] hover:bg-[#f3e8dd] transition hover:border-[#b85a22] shrink-0 font-medium"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-[#e8ded1]">
        {errorMessage && (
          <p className="text-xs text-[#c0392b] mb-2 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMessage}</span>
          </p>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything... (e.g. 'I have eggs and pasta, what can I make for my 3-year-old?')"
            className="flex-1 px-4 py-3 rounded-xl border border-[#d2c2b2] bg-[#fdfaf7] text-xs sm:text-sm text-[#2b2219] placeholder-[#9c8b7d] focus:outline-none focus:ring-2 focus:ring-[#b85a22]"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 rounded-xl bg-[#b85a22] text-white hover:bg-[#91461b] font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-sm disabled:opacity-40"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
