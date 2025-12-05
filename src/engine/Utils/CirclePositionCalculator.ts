type Point = { x: number; y: number };

export default class CirclePositionCalculator {
    static calculate(count: number, radius: number, startAngleDeg: number = 270): Point[] {
        if (count === 0) return [];

        const positions: Point[] = [];
        const angleStep = 360 / count;
        let currentAngle = startAngleDeg;

        for (let i = 0; i < count; i++) {
            const rad = currentAngle * (Math.PI / 180);
            positions.push({
                x: Math.cos(rad) * radius,
                y: -Math.sin(rad) * radius
            });
            currentAngle -= angleStep;
        }

        return positions;
    }
}
