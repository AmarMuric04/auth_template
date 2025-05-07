import type { Message } from "ai";
import { Avatar } from "@/components/ui/avatar";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarkdownRenderer } from "./code-block";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0 items-center justify-center bg-gradient-to-r from-purple-500 to-teal-400">
          <Bot className="h-4 w-4 text-white" />
        </Avatar>
      )}

      <div
        className={cn(
          "max-w-[80%] break-words rounded-2xl px-3 py-1",
          isUser
            ? "bg-gradient-to-r from-purple-500 to-teal-400 text-white"
            : "bg-gray-100 dark:bg-gray-700 dark:text-gray-100"
        )}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-full dark:prose-invert break-words">
            <MarkdownRenderer content={message.content} />
          </div>
        )}
      </div>

      {isUser && (
        <Avatar className="h-8 w-8 shrink-0 items-center justify-center bg-gray-200 dark:bg-gray-600">
          <User className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </Avatar>
      )}
    </div>
  );
}
