import { JSX } from 'solid-js/jsx-runtime';
import { Accessor } from 'solid-js';

export type _SwipeDirection = 'right' | 'left' | 'up' | 'down';

export type _SwipeCardRef = {
    snapBack?: () => Promise<void> | void;
    swipe?: (direction: _SwipeDirection, velocity?: number) => Promise<void> | void;
    swiped?: Accessor<boolean>;
};

export type _SwipeCardProps = Omit<JSX.HTMLAttributes<HTMLDivElement>, 'style'> & {
    style?: JSX.CSSProperties;
    threshold?: number;
    minSpeed?: number;
    // TODO: add releaseOutsideViewport flag and functionality
    rotationMultiplier?: number;
    maxRotation?: number;
    bouncePower?: number;
    snapBackDuration?: number;
    smoothDuration?: number;
    // TODO: allow possible async functions
    onSwipe?: (direction: _SwipeDirection) => void;
    onSnapBack?: () => void;
    onMove?: (direction: _SwipeDirection) => void;
    // TODO: find a way to pass it as nullable
    apiRef?: NonNullable<_SwipeCardRef & any>;
};

export type _Coordinate = {
    x: number;
    y: number;
};

export type _Speed = _Coordinate;

export type _TemporalCoordinate = _Coordinate & {
    timestamp: number;
};

export interface Character {
  id: string

  name: string
  description: string
  avatarId?: string
  visibility: 'public' | 'private' | 'unlisted'

  createdAt: string
  updatedAt: string
}

/** Represents an individual message. */
export interface ChatMsg {
  /** Who sent this message. */
  speaker: Speaker

  /** Contents of the message. */
  utterance: string

  /** When the message was sent. */
  timestamp: Date
}

/** Representation of a speaker for front-end components. */
export interface Speaker {
  /** User-friendly name. */
  name: string

  /** URL to the speaker's avatar. */
  avatarUrl?: string

  /** Whether this is a human speaker. */
  isHuman?: boolean
}

export interface User {
  id: string
  email: string
  displayName: string
}
