/// <mls shortName="internalAnimations" project="100541" enhancement="_100541_enhancementLit" />

export const animations = {
    easings: {
        linear: 'linear',
        ease: 'ease',
        easeIn: 'ease-in',
        easeOut: 'ease-out',
        easeInOut: 'ease-in-out',
        easeInSine: 'cubic-bezier(0.47, 0, 0.745, 0.715)',
        easeOutSine: 'cubic-bezier(0.39, 0.575, 0.565, 1)',
        easeInOutSine: 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
        easeInQuad: 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
        easeOutQuad: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        easeInOutQuad: 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
        easeInCubic: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
        easeOutCubic: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        easeInOutCubic: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
        easeInQuart: 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
        easeOutQuart: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
        easeInOutQuart: 'cubic-bezier(0.77, 0, 0.175, 1)',
        easeInQuint: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
        easeOutQuint: 'cubic-bezier(0.23, 1, 0.32, 1)',
        easeInOutQuint: 'cubic-bezier(0.86, 0, 0.07, 1)',
        easeInExpo: 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        easeOutExpo: 'cubic-bezier(0.19, 1, 0.22, 1)',
        easeInOutExpo: 'cubic-bezier(1, 0, 0, 1)',
        easeInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
        easeOutCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
        easeInOutCirc: 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
        easeInBack: 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
        easeOutBack: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        easeInOutBack: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },
    bounce: [
        { offset: 0, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', transform: 'translate3d(0, 0, 0)' },
        { offset: 0.2, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', transform: 'translate3d(0, 0, 0)' },
        { offset: 0.4, easing: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)', transform: 'translate3d(0, -30px, 0) scaleY(1.1)' },
        { offset: 0.43, easing: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)', transform: 'translate3d(0, -30px, 0) scaleY(1.1)' },
        { offset: 0.53, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', transform: 'translate3d(0, 0, 0)' },
        { offset: 0.7, easing: 'cubic-bezier(0.755, 0.05, 0.855, 0.06)', transform: 'translate3d(0, -15px, 0) scaleY(1.05)' },
        {
            offset: 0.8,
            'transition-timing-function': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
            transform: 'translate3d(0, 0, 0) scaleY(0.95)'
        },
        { offset: 0.9, transform: 'translate3d(0, -4px, 0) scaleY(1.02)' },
        { offset: 1, easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)', transform: 'translate3d(0, 0, 0)' }
    ],
    flash: [
        { offset: 0, opacity: '1' },
        { offset: 0.25, opacity: '0' },
        { offset: 0.5, opacity: '1' },
        { offset: 0.75, opacity: '0' },
        { offset: 1, opacity: '1' }
    ],
    headShake: [
        { offset: 0, transform: 'translateX(0)' },
        { offset: 0.065, transform: 'translateX(-6px) rotateY(-9deg)' },
        { offset: 0.185, transform: 'translateX(5px) rotateY(7deg)' },
        { offset: 0.315, transform: 'translateX(-3px) rotateY(-5deg)' },
        { offset: 0.435, transform: 'translateX(2px) rotateY(3deg)' },
        { offset: 0.5, transform: 'translateX(0)' }
    ],
    heartBeat: [
        { offset: 0, transform: 'scale(1)' },
        { offset: 0.14, transform: 'scale(1.3)' },
        { offset: 0.28, transform: 'scale(1)' },
        { offset: 0.42, transform: 'scale(1.3)' },
        { offset: 0.7, transform: 'scale(1)' }
    ],
    jello: [
        { offset: 0, transform: 'translate3d(0, 0, 0)' },
        { offset: 0.111, transform: 'translate3d(0, 0, 0)' },
        { offset: 0.222, transform: 'skewX(-12.5deg) skewY(-12.5deg)' },
        { offset: 0.33299999999999996, transform: 'skewX(6.25deg) skewY(6.25deg)' },
        { offset: 0.444, transform: 'skewX(-3.125deg) skewY(-3.125deg)' },
        { offset: 0.555, transform: 'skewX(1.5625deg) skewY(1.5625deg)' },
        { offset: 0.6659999999999999, transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' },
        { offset: 0.777, transform: 'skewX(0.390625deg) skewY(0.390625deg)' },
        { offset: 0.888, transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' },
        { offset: 1, transform: 'translate3d(0, 0, 0)' }
    ],
    pulse: [
        { offset: 0, transform: 'scale3d(1, 1, 1)' },
        { offset: 0.5, transform: 'scale3d(1.05, 1.05, 1.05)' },
        { offset: 1, transform: 'scale3d(1, 1, 1)' }
    ],
    rubberBand: [
        { offset: 0, transform: 'scale3d(1, 1, 1)' },
        { offset: 0.3, transform: 'scale3d(1.25, 0.75, 1)' },
        { offset: 0.4, transform: 'scale3d(0.75, 1.25, 1)' },
        { offset: 0.5, transform: 'scale3d(1.15, 0.85, 1)' },
        { offset: 0.65, transform: 'scale3d(0.95, 1.05, 1)' },
        { offset: 0.75, transform: 'scale3d(1.05, 0.95, 1)' },
        { offset: 1, transform: 'scale3d(1, 1, 1)' }
    ],
    shake: [
        { offset: 0, transform: 'translate3d(0, 0, 0)' },
        { offset: 0.1, transform: 'translate3d(-10px, 0, 0)' },
        { offset: 0.2, transform: 'translate3d(10px, 0, 0)' },
        { offset: 0.3, transform: 'translate3d(-10px, 0, 0)' },
        { offset: 0.4, transform: 'translate3d(10px, 0, 0)' },
        { offset: 0.5, transform: 'translate3d(-10px, 0, 0)' },
        { offset: 0.6, transform: 'translate3d(10px, 0, 0)' },
        { offset: 0.7, transform: 'translate3d(-10px, 0, 0)' },
        { offset: 0.8, transform: 'translate3d(10px, 0, 0)' },
        { offset: 0.9, transform: 'translate3d(-10px, 0, 0)' },
        { offset: 1, transform: 'translate3d(0, 0, 0)' }
    ],
    shakeX: [
        { offset: 0, transform: 'translate3d(0, 0, 0)' },
        { offset: 0.1, transform: 'translate3d(-10px, 0, 0)' },
        { offset: 0.2, transform: 'translate3d(10px, 0, 0)' },
        { offset: 0.3, transform: 'translate3d(-10px, 0, 0)' },
        { offset: 0.4, transform: 'translate3d(10px, 0, 0)' },
        { offset: 0.5, transform: 'translate3d(-10px, 0, 0)' },
        { offset: 0.6, transform: 'translate3d(10px, 0, 0)' },
        { offset: 0.7, transform: 'translate3d(-10px, 0, 0)' },
        { offset: 0.8, transform: 'translate3d(10px, 0, 0)' },
        { offset: 0.9, transform: 'translate3d(-10px, 0, 0)' },
        { offset: 1, transform: 'translate3d(0, 0, 0)' }
    ],
    shakeY: [
        { offset: 0, transform: 'translate3d(0, 0, 0)' },
        { offset: 0.1, transform: 'translate3d(0, -10px, 0)' },
        { offset: 0.2, transform: 'translate3d(0, 10px, 0)' },
        { offset: 0.3, transform: 'translate3d(0, -10px, 0)' },
        { offset: 0.4, transform: 'translate3d(0, 10px, 0)' },
        { offset: 0.5, transform: 'translate3d(0, -10px, 0)' },
        { offset: 0.6, transform: 'translate3d(0, 10px, 0)' },
        { offset: 0.7, transform: 'translate3d(0, -10px, 0)' },
        { offset: 0.8, transform: 'translate3d(0, 10px, 0)' },
        { offset: 0.9, transform: 'translate3d(0, -10px, 0)' },
        { offset: 1, transform: 'translate3d(0, 0, 0)' }
    ],
    swing: [
        { offset: 0.2, transform: 'rotate3d(0, 0, 1, 15deg)' },
        { offset: 0.4, transform: 'rotate3d(0, 0, 1, -10deg)' },
        { offset: 0.6, transform: 'rotate3d(0, 0, 1, 5deg)' },
        { offset: 0.8, transform: 'rotate3d(0, 0, 1, -5deg)' },
        { offset: 1, transform: 'rotate3d(0, 0, 1, 0deg)' }
    ],
    tada: [
        { offset: 0, transform: 'scale3d(1, 1, 1)' },
        { offset: 0.1, transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)' },
        { offset: 0.2, transform: 'scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)' },
        { offset: 0.3, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' },
        { offset: 0.4, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)' },
        { offset: 0.5, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' },
        { offset: 0.6, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)' },
        { offset: 0.7, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' },
        { offset: 0.8, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)' },
        { offset: 0.9, transform: 'scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)' },
        { offset: 1, transform: 'scale3d(1, 1, 1)' }
    ],
    wobble: [
        { offset: 0, transform: 'translate3d(0, 0, 0)' },
        { offset: 0.15, transform: 'translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg)' },
        { offset: 0.3, transform: 'translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg)' },
        { offset: 0.45, transform: 'translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg)' },
        { offset: 0.6, transform: 'translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg)' },
        { offset: 0.75, transform: 'translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg)' },
        { offset: 1, transform: 'translate3d(0, 0, 0)' }
    ],
    backInDown: [
        { offset: 0, transform: 'translateY(-1200px) scale(0.7)', opacity: '0.7' },
        { offset: 0.8, transform: 'translateY(0px) scale(0.7)', opacity: '0.7' },
        { offset: 1, transform: 'scale(1)', opacity: '1' }
    ],
    backInLeft: [
        { offset: 0, transform: 'translateX(-2000px) scale(0.7)', opacity: '0.7' },
        { offset: 0.8, transform: 'translateX(0px) scale(0.7)', opacity: '0.7' },
        { offset: 1, transform: 'scale(1)', opacity: '1' }
    ],
    backInRight: [
        { offset: 0, transform: 'translateX(2000px) scale(0.7)', opacity: '0.7' },
        { offset: 0.8, transform: 'translateX(0px) scale(0.7)', opacity: '0.7' },
        { offset: 1, transform: 'scale(1)', opacity: '1' }
    ],
    backInUp: [
        { offset: 0, transform: 'translateY(1200px) scale(0.7)', opacity: '0.7' },
        { offset: 0.8, transform: 'translateY(0px) scale(0.7)', opacity: '0.7' },
        { offset: 1, transform: 'scale(1)', opacity: '1' }
    ],
    backOutDown: [
        { offset: 0, transform: 'scale(1)', opacity: '1' },
        { offset: 0.2, transform: 'translateY(0px) scale(0.7)', opacity: '0.7' },
        { offset: 1, transform: 'translateY(700px) scale(0.7)', opacity: '0.7' }
    ],
    backOutLeft: [
        { offset: 0, transform: 'scale(1)', opacity: '1' },
        { offset: 0.2, transform: 'translateX(0px) scale(0.7)', opacity: '0.7' },
        { offset: 1, transform: 'translateX(-2000px) scale(0.7)', opacity: '0.7' }
    ],
    backOutRight: [
        { offset: 0, transform: 'scale(1)', opacity: '1' },
        { offset: 0.2, transform: 'translateX(0px) scale(0.7)', opacity: '0.7' },
        { offset: 1, transform: 'translateX(2000px) scale(0.7)', opacity: '0.7' }
    ],
    backOutUp: [
        { offset: 0, transform: 'scale(1)', opacity: '1' },
        { offset: 0.2, transform: 'translateY(0px) scale(0.7)', opacity: '0.7' },
        { offset: 1, transform: 'translateY(-700px) scale(0.7)', opacity: '0.7' }
    ],
}