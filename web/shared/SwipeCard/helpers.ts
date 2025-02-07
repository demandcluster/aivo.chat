import { _SwipeDirection } from './types';
import { _SwipeCardProps, _Speed, _Coordinate, _TemporalCoordinate } from './types';

export const _PropsDefault: _SwipeCardProps = {
    style: {},
    threshold: 300,
    minSpeed: 0,
    rotationMultiplier: 7.5,
    maxRotation: 90,
    snapBackDuration: 300,
    smoothDuration: 40,
    bouncePower: 0.1,
    onSwipe: () => {},
    onMove: () => {},
    onSnapBack: () => {},
    apiRef: {}
};

export const _calcSpeed = (oldCoords: _TemporalCoordinate, newCoords: _TemporalCoordinate): _Speed => {
    const deltaX = newCoords.x - oldCoords.x;
    const deltaY = newCoords.y - oldCoords.y;
    const deltaT = (newCoords.timestamp - oldCoords.timestamp) / 1000;

    const x = deltaX / deltaT;
    const y = deltaY / deltaT;

    return { x, y };
};

export const _calcDirection = (speed: _Speed): _SwipeDirection => {
    if (Math.abs(speed.x) > Math.abs(speed.y)) {
        if (speed.x >= 0) return 'right';
        return 'left';
    } else {
        if (speed.y >= 0) return 'up';
        return 'down';
    }
};

export const _mouseCoordinates = (event: MouseEvent): _Coordinate => ({
    x: event.clientX,
    y: event.clientY
});

export const _touchCoordinates = (event: TouchEvent): _Coordinate => ({
    x: event.touches[0].clientX,
    y: event.touches[0].clientY
});

export const _extractDivProps = (value: _SwipeCardProps) => {
    const result = {};
    const toExclude = Object.keys(_PropsDefault) as Array<keyof _SwipeCardProps>;
    for (const property of Object.keys(value) as Array<keyof _SwipeCardProps>) {
        if (!toExclude.includes(property)) result[property] = value[property];
    }

    return result;
};
