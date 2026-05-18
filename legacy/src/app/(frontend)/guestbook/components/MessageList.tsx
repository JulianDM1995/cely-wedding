import { ExtendedGuestMessage } from '../types'

export const MessageList = ({ messages }: { messages: ExtendedGuestMessage[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {messages.map((msg) => (
            <div key={msg.id} className="bg-gray-900 p-6 rounded-xl border border-gray-800 break-words hover:border-gray-700 transition-colors">
                {msg.media && typeof msg.media === 'object' && msg.media.url && (
                    <img
                        src={msg.media.url}
                        alt={msg.media.alt || 'Guest Image'}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                )}
                <p className="text-lg mb-4 text-gray-200">"{msg.message}"</p>
                <p className="text-sm text-gray-500 font-bold text-right">
                    - {typeof msg.owner === 'object' ? msg.owner?.name : 'Guest'}
                </p>
            </div>
        ))}
    </div>
)
