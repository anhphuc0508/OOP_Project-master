import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";

const ChatbotIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
    </svg>
);

const SendIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
    </svg>
);

const CloseIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);


interface Message {
    role: 'user' | 'model';
    text: string;
}

const Chatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Xin chào! Tôi là trợ lý AI của GymSup. Tôi có thể giúp gì cho bạn về các sản phẩm bổ sung?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = inputValue.trim();
        if (!trimmedInput || isLoading) return;

        const userMessage: Message = { role: 'user', text: trimmedInput };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            if (!chatRef.current) {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
                chatRef.current = ai.chats.create({
                    model: 'gemini-2.5-flash',
                    config: {
                        systemInstruction: "You are a friendly and knowledgeable AI assistant for GymSup, an e-commerce store specializing in gym supplements. Your role is to help users find products, answer questions about supplements like whey protein, creatine, mass gainers, and provide general fitness advice. Keep your answers concise, helpful, and focused on the products and information relevant to a gym supplement store. Do not answer questions outside of this scope. All your responses must be in Vietnamese.",
                    },
                });
            }

            const response = await chatRef.current.sendMessage({ message: trimmedInput });
            const modelMessage: Message = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error(error);
            const errorMessage: Message = { role: 'model', text: 'Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-5 right-5 z-50 transition-transform duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-gym-yellow text-gym-darker rounded-full p-4 shadow-lg hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
                    aria-label="Open chatbot"
                >
                    <ChatbotIcon className="h-8 w-8" />
                </button>
            </div>

            <div className={`fixed bottom-5 right-5 z-50 w-[calc(100%-40px)] max-w-sm h-[70vh] max-h-[600px] bg-gym-dark rounded-lg shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex justify-between items-center p-4 bg-gym-darker rounded-t-lg">
                    <h3 className="text-lg font-bold text-gym-yellow">GymSup AI Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="text-gym-gray hover:text-white" aria-label="Close chatbot">
                        <CloseIcon className="h-6 w-6" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg px-4 py-2 ${msg.role === 'user' ? 'bg-gym-yellow text-gym-darker' : 'bg-gym-darker text-white'}`}>
                                <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gym-darker text-white">
                                <div className="flex items-center space-x-1">
                                    <span className="h-2 w-2 bg-gym-gray rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                                    <span className="h-2 w-2 bg-gym-gray rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                                    <span className="h-2 w-2 bg-gym-gray rounded-full animate-pulse"></span>
                                </div>
                            </div>
                        </div>
                    )}
                     <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-700">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Nhập câu hỏi của bạn..."
                            className="flex-1 bg-gym-darker border border-gray-600 rounded-full py-2 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gym-yellow"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !inputValue.trim()}
                            className="bg-gym-yellow text-gym-darker rounded-full p-2.5 disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-yellow-300 transition-colors"
                            aria-label="Send message"
                        >
                            <SendIcon className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
