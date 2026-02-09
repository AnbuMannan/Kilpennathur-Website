"use client";

import { MessageCircle } from "lucide-react";

export function WhatsAppFloat() {
  const phoneNumber = "919876543210"; // Replace with actual number
  const message = "Hello! I have a question about Kilpennathur.";

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-24 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </button>
  );
}
