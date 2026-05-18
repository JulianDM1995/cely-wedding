import { Guest, GuestMessage, Media } from '@/payload-types'

export type ExtendedGuestMessage = GuestMessage & {
    owner?: Guest
    media?: Media
}
