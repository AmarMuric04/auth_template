"use client";

import { Message, useChat } from "ai/react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Bot, Trash2 } from "lucide-react";
import { ChatMessage } from "./chat-message";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { v4 as uuidv4 } from "uuid";

type ChatProps = {
  /** The UI element that triggers the chat (e.g., button, icon, etc.) */
  children: React.ReactNode;

  /** Optional text that will be shown at the top of the chat */
  title?: string;

  /** Optional text that will be shown in the chat preview */
  description?: string;

  /** Optional config key to load system message and model from ai.config.ts */
  configKey?: string;

  /** Optional custom system message to override config file */
  system?: string;

  /** Optional placeholder override for the input field */
  placeholder?: string;

  /** Optional starting message(s) */
  initialMessages?: Message[];

  /** Optional API route if not using default /api/chat */
  api?: string;

  pos?: {
    side?: "top" | "right" | "bottom" | "left" | undefined;
    align?: "center" | "start" | "end" | undefined;
  };
};

export function Chat({
  title = "AI Agent",
  description = "Ask me anything related to Our Brand! I can help with information, navigating through the website, and more",
  configKey,
  system,
  placeholder,
  initialMessages,
  api,
  pos = {
    side: "right",
    align: "start",
  },
  children,
}: ChatProps) {
  const [chatKey, setChatKey] = useState(() => uuidv4());
  const [inputRows, setInputRows] = useState(1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      id: String(chatKey),
      api: api || "/api/chat",
      initialMessages,
      body: {
        configKey,
        system,
      },
    });

  useEffect(() => {
    if (!system && !configKey) {
      console.warn(
        "[Chat] Neither 'system' nor 'configKey' was provided. Default config will be used."
      );
    }

    if (system && configKey) {
      throw new Error(
        "You can't use both 'system' and 'configKey' at the same time. Choose one."
      );
    }
  }, [system, configKey]);

  useEffect(() => {
    const rows = input.split("\n").length;
    setInputRows(Math.min(5, Math.max(1, rows)));
  }, [input]);

  useEffect(() => {
    const el = scrollAreaRef.current;
    if (!el) return;

    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const resetConversation = () => {
    setChatKey(() => uuidv4());
  };

  return (
    <div className="w-fit h-fit">
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>

        <PopoverContent
          side={pos.side}
          align={pos.align}
          sideOffset={20}
          alignOffset={20}
          className={cn(
            "transition-all opacity-100 border border-accent bg-background rounded-3xl overflow-hidden",
            "aspect-[8/13] w-[90vw] max-w-md",
            "flex flex-col"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-accent">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-teal-400 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h2 className="font-semibold">{title}</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetConversation}
              title="Clear conversation"
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="h-8 w-8 p-1 lg:p-0 lg:h-16 lg:w-16 rounded-full bg-gradient-to-r from-purple-500 to-teal-400 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Welcome to the AI Chat
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  {description}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}

                {isLoading && (
                  <div className="flex items-start gap-3 animate-pulse">
                    <Avatar className="items-center justify-center bg-gradient-to-r from-purple-500 to-teal-400">
                      <Bot className="h-4 w-4 text-white" />
                    </Avatar>
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-3 max-w-[80%]">
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-600 rounded-full mb-2"></div>
                      <div className="h-4 w-64 bg-gray-200 dark:bg-gray-600 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-accent w-full">
            <form onSubmit={handleSubmit} className="flex gap-2 w-full">
              <div className="relative flex-1 w-full">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder={placeholder || "Ask something..."}
                  className="resize-none pr-10 py-3 rounded-2xl border-accent focus-visible:ring-purple-500 break-words w-full max-w-full"
                  rows={inputRows}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 bottom-2 h-8 w-8 bg-gradient-to-r from-purple-500 to-teal-400 hover:from-purple-600 hover:to-teal-500 rounded-full"
                  disabled={isLoading || !input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-2 text-sm text-red-500">
                Error: {error.message}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
