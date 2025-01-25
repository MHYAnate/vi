// import { cn } from "@/lib/utils";
// import { Message } from "ai";

// interface ChatMessageProps {
//   role: "user" | "assistant | system | data";
//   content: string;
// }

// export function ChatMessage({ role, content }: Message) {
//   return (
//     <div
//       className={cn(
//         "mb-4 flex items-start gap-4 rounded-lg px-4 py-2",
//         role === "user" ? "bg-gray-100" : "bg-blue-50"
//       )}
//     >
//       <div className="rounded-full bg-white p-2 shadow">
//         {role === "user" ? "👤" : "🤖"}
//       </div>
//       <div className="flex-1">
//         <p className="font-semibold capitalize">{role}</p>
//         <p className="mt-1 text-gray-700">{content}</p>
//       </div>
//     </div>
//   );
// }