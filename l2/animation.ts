/// <mls shortName="animation" project="100541" enhancement="_100541_enhancementLit" groupName="animation" />

/**
 * This code has been forked and modified from a project found on https://github.com/shoelace-style/shoelace.
 * The original project is licensed under the MIT license.
 */

import { html, LitElement } from 'lit';
import { customElement, property, queryAsync } from 'lit/decorators.js';
import { animations } from './_100541_internalAnimations';

/**
 * 
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
    * @fieldType { "propertyType":"list", "defaultValue":"none", "items": ["bounce","flash","headShake","heartBeat","jello","pulse","rubberBand","shake","shakeX","shakeY","swing","tada","wobble","backInDown","backInLeft","backInRight","backInUp","backOutDown","backOutLeft","backOutRight","backOutUp"]}
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
        const easing = animations.easings[this.easing] ?? this.easing;
        const keyframes = this.keyframes ?? (animations as unknown as Partial<Record<string, Keyframe[]>>)[this.name];
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
