import confetti from 'canvas-confetti';

export const triggerConfetti = (goldOnly: boolean = false) => {
  if (typeof window === 'undefined') return;

  try {
    if (goldOnly) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#F59E0B', '#FBBF24', '#D97706', '#FEF3C7', '#FFFFFF'],
        ticks: 200,
        gravity: 1.1,
        scalar: 1.1,
      });
    } else {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#38BDF8', '#818CF8', '#34D399', '#F472B6', '#FBBF24'],
        ticks: 220,
      });
    }
  } catch {
    // ignore
  }
};

export const triggerBurstConfetti = () => {
  if (typeof window === 'undefined') return;
  try {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#38BDF8'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  } catch {
    // ignore
  }
};
