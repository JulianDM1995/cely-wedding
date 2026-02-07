import { ExtendedGuestMessage } from '../types'

export const FeaturedMessage = ({ message }: { message: ExtendedGuestMessage }) => (
    <div className="sticky top-0 z-50 mb-8 w-full">
        <div className="bg-white text-black p-8 rounded-2xl shadow-2xl transform scale-105 border-4 border-yellow-400">
            <h2 className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-2">Now Reading</h2>
            {message.media && typeof message.media === 'object' && message.media.url && (
                <img
                    src={message.media.url}
                    alt={message.media.alt || 'Guest Image'}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                />
            )}
            <p className="text-3xl font-serif mb-4">"{message.message}"</p>
            {message.owner && (
                <p className="text-right font-bold text-lg">- {typeof message.owner === 'object' ? message.owner.name : 'Guest'}</p>
            )}
        </div>
    </div>
)
