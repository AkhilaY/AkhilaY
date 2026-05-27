import ChatInterface from "@/components/chat/ChatInterface";

export const metadata = {
  title: "Stylé — Your Personal Stylist",
};

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-cream">
      <ChatInterface />
    </div>
  );
}
