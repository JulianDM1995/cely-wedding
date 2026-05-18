import { Guest } from '@/payload-types'

export const TypingIndicator = ({ owner }: { owner?: Guest }) => (
    <div className="sticky top-0 z-50 mb-8 w-full">
        <div className="bg-white text-black p-8 rounded-2xl shadow-2xl transform scale-105 border-4 border-yellow-400 animate-pulse">
            <h2 className="text-xs font-bold uppercase tracking-widest text-yellow-600 mb-2">Live Update</h2>
            <p className="text-2xl font-serif mb-4">
                {owner ? `${owner.name} is writing...` : 'Someone is writing a message...'}
            </p>
        </div>
    </div>
)
