export const GameConfig = {
    AceOfShadows: {
        CardCount: 144,
        StackCount: 3,
        CircleRadius: 250,
        Animation: {
            MoveDuration: 2.0, // Seconds
            IntervalDelay: 1000, // Milliseconds
        },
        Layout: {
            PositionOffset: 15, // Random scatter range
            RotationOffset: 0.3, // Random rotation range
            CardScale: 0.65
        }
    },
    MagicWords: {
        Bubble: {
            Width: 500,
            AvatarSize: 100,
            Padding: 20,
            PopInDuration: 0.6,
            PopInEase: 'back.out(1.7)'
        },
        Text: {
            FontSize: 24,
            LineHeight: 40,
            FontFamily: 'PoppinsBold',
            Color: 0xffffff,
            TypewriterSpeed: 0.03 // Seconds per character
        },
        Sequence: {
            DisplayTime: 3000 // How long to show a bubble before next
        }
    },
    PhoenixFlame: {
        MaxParticles: 10,
        SpawnWidth: 4,
        GlobalSpeed: 60
    }
};