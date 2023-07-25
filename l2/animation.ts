/// <mls shortName="animation" project="100541" enhancement="_100541_enhancementLit" groupName="animation" />

import { html, LitElement } from 'lit';
import { customElement, property, queryAsync } from 'lit/decorators.js';

/**
 * @summary Animate elements declaratively with nearly 100 baked-in presets, or roll your own with custom keyframes. Powered by the [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API).
 * @documentation https://shoelace.style/components/animation
 * @status stable
 * @since 2.0
 *
 *
 * @slot - The element to animate. Avoid slotting in more than one element, as subsequent ones will be ignored. To
 *  animate multiple elements, either wrap them in a single container or use multiple `<sl-animation>` elements.
 */
@customElement('animation-100541')
export class Animations extends LitElement {
    //static get observedAttributes() { return ['play']; }

    private animation?: Animation;
    private hasStarted = false;

    @queryAsync('slot') defaultSlot: Promise<HTMLSlotElement>;

    /**
    * The name of the built-in animation to use. For custom animations, use the `keyframes` prop.
    * @fieldType { "propertyType":"list", "defaultValue":"none", "items": ["bounce","flash","headShake","heartBeat"]}
    */
    @property() name = 'none';

    /**
     * Plays the animation. When omitted, the animation will be paused. This attribute will be automatically removed when
     * the animation finishes or gets canceled.
     */
    @property({ type: Boolean, reflect: true }) play = false;

    /** The number of milliseconds to delay the start of the animation. */
    @property({ type: Number }) delay = 0;

    /**
     * Determines the direction of playback as well as the behavior when reaching the end of an iteration.
     * [Learn more](https://developer.mozilla.org/en-US/docs/Web/CSS/animation-direction)
     */
    @property() direction: PlaybackDirection = 'normal';

    /** The number of milliseconds each iteration of the animation takes to complete. */
    @property({ type: Number }) duration = 1000;


    /**
    * The easing function to use for the animation. This can be a Shoelace easing function or a custom easing function
    * such as `cubic-bezier(0, 1, .76, 1.14)`.
    * @fieldType { "propertyType":"list", "defaultValue":"none", "items": ["linear","ease","easeIn","easeOut","easeInOut","easeInSine","easeOutSine","easeInOutSine","easeInQuad","easeOutQuad","easeInOutQuad","easeInCubic","easeOutCubic","easeInOutCubic","easeInQuart","easeOutQuart","easeInOutQuart","easeInQuint","easeOutQuint","easeInOutQuint","easeInExpo","easeOutExpo","easeInOutExpo","easeInCirc","easeOutCirc","easeInOutCirc","easeInBack","easeOutBack", "easeInOutBack"]}
    */
    @property() easing = 'linear';

    /** The number of milliseconds to delay after the active period of an animation sequence. */
    @property({ attribute: 'end-delay', type: Number }) endDelay = 0;

    /** Sets how the animation applies styles to its target before and after its execution. */
    @property() fill: FillMode = 'auto';

    /** The number of iterations to run before the animation completes. Defaults to `Infinity`, which loops. */
    @property({ type: Number }) iterations = Infinity;

    /** The offset at which to start the animation, usually between 0 (start) and 1 (end). */
    @property({ attribute: 'iteration-start', type: Number }) iterationStart = 0;

    /** The keyframes to use for the animation. If this is set, `name` will be ignored. */
    @property({ attribute: false }) keyframes?: Keyframe[];

    /**
     * Sets the animation's playback rate. The default is `1`, which plays the animation at a normal speed. Setting this
     * to `2`, for example, will double the animation's speed. A negative value can be used to reverse the animation. This
     * value can be changed without causing the animation to restart.
     */
    @property({ attribute: 'playback-rate', type: Number }) playbackRate = 1;

    static watch = (propertyName: string | string[], options?: any) => {
        const resolvedOptions: Required<any> = {
            waitUntilFirstUpdate: false,
            ...options
        };
        return <ElemClass extends LitElement>(proto: ElemClass, decoratedFnName: any) => {
            // @ts-expect-error - update is a protected property
            const { update } = proto;
            const watchedProperties = Array.isArray(propertyName) ? propertyName : [propertyName];

            // @ts-expect-error - update is a protected property
            proto.update = function (this: ElemClass, changedProps: Map<keyof ElemClass, ElemClass[keyof ElemClass]>) {
                watchedProperties.forEach(property => {
                    const key = property as keyof ElemClass;
                    if (changedProps.has(key)) {
                        const oldValue = changedProps.get(key);
                        const newValue = this[key];

                        if (oldValue !== newValue) {
                            if (!resolvedOptions.waitUntilFirstUpdate || this.hasUpdated) {
                                (this[decoratedFnName] as unknown as any)(oldValue, newValue);
                            }
                        }
                    }
                });

                update.call(this, changedProps);
            };
        };
    }

    /** Gets and sets the current animation time. */
    get currentTime() {
        return this.animation?.currentTime ?? 0;
    }

    set currentTime(time: number) {
        if (this.animation) {
            this.animation.currentTime = time;
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.createAnimation();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.destroyAnimation();
    }

    private animations = {
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
        ]
    }

    private handleAnimationFinish = () => {
        this.play = false;
        this.hasStarted = false;
    };

    private handleAnimationCancel = () => {
        this.play = false;
        this.hasStarted = false;
    };

    private handleSlotChange() {
        this.destroyAnimation();
        this.createAnimation();
    }

    private async createAnimation() {
        const easing = this.animations.easings[this.easing] ?? this.easing;
        const keyframes = this.keyframes ?? (this.animations as unknown as Partial<Record<string, Keyframe[]>>)[this.name];
        const slot = await this.defaultSlot;
        const element = slot.assignedElements()[0] as HTMLElement | undefined;

        if (!element || !keyframes) {
            return false;
        }

        this.destroyAnimation();
        this.animation = element.animate(keyframes, {
            delay: this.delay,
            direction: this.direction,
            duration: this.duration,
            easing,
            endDelay: this.endDelay,
            fill: this.fill,
            iterationStart: this.iterationStart,
            iterations: this.iterations
        });
        this.animation.playbackRate = this.playbackRate;
        this.animation.addEventListener('cancel', this.handleAnimationCancel);
        this.animation.addEventListener('finish', this.handleAnimationFinish);

        if (this.play) {
            this.hasStarted = true;
        } else {
            this.animation.pause();
        }

        return true;
    }

    private destroyAnimation() {
        if (this.animation) {
            this.animation.cancel();
            this.animation.removeEventListener('cancel', this.handleAnimationCancel);
            this.animation.removeEventListener('finish', this.handleAnimationFinish);
            this.hasStarted = false;
        }
    }

    @Animations.watch([
        'name',
        'delay',
        'direction',
        'duration',
        'easing',
        'endDelay',
        'fill',
        'iterations',
        'iterationsStart',
        'keyframes'
    ])
    handleAnimationChange() {
        if (!this.hasUpdated) {
            return;
        }

        this.createAnimation();
    }

    @Animations.watch('play')
    handlePlayChange() {
        if (this.animation) {
            if (this.play && !this.hasStarted) {
                this.hasStarted = true;
            }

            if (this.play) {
                this.animation.play();
            } else {
                this.animation.pause();
            }

            return true;
        }
        return false;
    }

    @Animations.watch('playbackRate')
    handlePlaybackRateChange() {
        if (this.animation) {
            this.animation.playbackRate = this.playbackRate;
        }
    }

    /** Clears all keyframe effects caused by this animation and aborts its playback. */
    cancel() {
        this.animation?.cancel();
    }

    /** Sets the playback time to the end of the animation corresponding to the current playback direction. */
    finish() {
        this.animation?.finish();
    }

    render() {
        return html` <slot @slotchange=${this.handleSlotChange}></slot> `;
    }

}
