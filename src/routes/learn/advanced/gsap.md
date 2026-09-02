# Greensock Animation Platform

<div class="grid-section" id="tweens">
<div class="content">

## tweens

In web animation, a tween stands for "in-betweening". Basically, it is the foundation for the whole GSAP process. There are 3 types of tweens: `gsap.to("element", { variables })` animating one state TO another state, `gsap.from("element", { variables })` animating one state FROM another state, `gsap.fromTo("element", { variables }, { variables })` specifically choosing the STARTING and ENDING state.

</div>
<div class="image">

```js
gsap.to(<element>, { <variables> }, <position parameter>);

gsap.to('.example', { x: 500 }, '<');
```

</div>
</div>

---

<div class="grid-section" id="staggers">
<div class="content">

## staggers

A value of stagger: 0.1 would cause there to be 0.1 seconds between the start times of each tween. You can even stagger items that are laid out in a grid just by telling GSAP how many columns and rows your grid has. A negative value would do the same but backwards so that the last element begins first. All tweens recognize a stagger property which can be a number, an object, or a function. To get more control, wrap things in a configuration object which can have any of the following properties (in addition to most of the special properties that tweens have.

<DetailsElement summary="functions">

Only use this if you need to run custom logic for distributing the staggers. The function gets called once for each target/element in the Array and should return the total delay from the starting position (not the amount of delay from the previous tween's start time). The function receives the following parameters: index [Integer] - The index value from the list, target [Object] - The target in the list at that index value, list [Array | NodeList] - The targets array (or NodeList).

</DetailsElement>

</div>
<div class="image">

```js
gsap.to('.example', { yPercent: 100, stagger: 0.1 })

gsap.to('.example', {
    y: 50,
    stagger: {
        each: 0.2,
        from: 'edges',
    },
})

gsap.to('.example', {
    y: 50,
    stagger: function (index) {
        // logic goes here
        return index * 0.2
    },
})
```

</div>
</div>

---

<div class="grid-section" id="timelines">
<div class="content">

## timelines

Just like we've seen with staggers, It's common to animate more than one thing. But what if we need more control over the order and timing of those animations? A lot of people reach for delays, and they're not wrong, delays do give us rudimentary control. But this method of sequencing animations is a little fragile. What happens if we lengthen the duration of the first tween? The second and third tweens have no awareness of this change, so now there's an overlap - we'd have to increase all of the delays to keep them synchronized. If you've animated with CSS you will have run into this problem before. But what if we want to add a gap or delay in between some of the tweens? One option would be to add a delay to a tween to offset it's start time. But this isn't hugely flexible. What if we want tweens to overlap or start at the same time?

Timelines makes sequencing multiple tweens really easy and faster to code, in the long run. You can also position them with the position parameter.

</div>
<div class="image">

```js
const tl = gsap.timeline()

tl.to('.red', { x: 100, duration: 2 })
tl.to('.blue', { y: 300, duration: 1 }, '+=300')
```

</div>
</div>

---

<div class="grid-section" id="percentage">
<div class="content">

## percentage keyframes

This familiar syntax makes porting animations over from CSS really easy. Instead of using delays and duration in the keyframe object, you specify an overall duration on the tween itself, then define the position of each keyframe using percentages.

</div>
<div class="image">

```js
gsap.to('.example', {
    keyframes: {
        '0%': { x: 50 },
        '50%': { y: 500 },
        '100%': { x: -50 },
        easeEach: 'power2.out',
    },
    duration: 3,
})
```

</div>
</div>

---

<div class="grid-section" id="position">
<div class="content">

## position parameter

The secret to building gorgeous sequences with precise timing is understanding the position parameter which is used in many methods throughout GSAP. This one super-flexible parameter controls the placement of your tweens, labels, callbacks, pauses, and even nested timelines, so you'll be able to literally place anything anywhere in any sequence.

Notice that the position parameter comes after the vars parameter:

</div>
<div class="image">

```js
gsap.to(<element>, { <variables> }, <position parameter>)
gsap.to('.example', { y: 200 }, '+=200')
```

</div>
</div>

---

<div class="grid-section" id="fouc">
<div class="content">

## flash of unstyled content

Have you ever noticed an annoying "flash of unstyled content" (FOUC) when a web page first loads? This looks like a weird jump or lag.. That happens because browsers render things as quickly as possible, often BEFORE your JavaScript executes the first time. So what if some of your initial styles are set via JavaScript...like with GSAP?

<DetailsElement summary="solution">

apply `visibility: hidden;` to your elements in CSS and then use GSAP's autoAlpha property to show it (or animate it in) when the page loads. autoAlpha affects opacity and visibility, changing it to visible when the opacity is greater than 0.

</DetailsElement>

</div>
<div class="image">

```css
/* first hide element in css */
.example {
    visibility: hidden;
}
```

```js
// then use autoAlpha in gsap
gsap.to('.example', { autoAlpha: 1 })
```

</div>
</div>

---

<div class="grid-section" id="scrolltrigger">
<div class="content">

## scroll trigger

ScrollTrigger is a plugin provided by GSAP. It enables anyone to create scroll-based animations with a few lines of code. Most websites that are on places like awwwards.com use scroll-based designs, and also use SVG at the same time!

You don't need to put ScrollTriggers directly into animations (though that's probably the most common use case). You can use the callbacks for anything...

</div>
<div class="image">

```js
// install with a package manager
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
```

```js
gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.create({
    trigger: '.example',
    start: 'top bottom',
    end: 'bottom center',
    onUpdate: (self) => {
        console.log('Updated!')
    },
})
```

</div>
</div>

---

<div class="grid-section" id="morphsvg">
<div class="content">

## morphSVG

MorphSVGPlugin morphs SVG paths by animating the data inside the d attribute. MorphSVGPlugin finds the paths and automatically figures out how to add enough points to the circle to get a super smooth morph. It will rip through all that ugly path data, convert everything to cubic beziers, and dynamically subdivide them when necessary, adding points so that the beginning and ending quantities match (but visually it looks the same). It's all done seamlessly under the hood.

There's a utility function, `MorphSVGPlugin.convertToPath()`, that can convert primitive shapes like `<circle>`, `<rect>`, `<ellipse>`, `<polygon>`, `<polyline>`, and `<line>` directly into the equivalent `<path>` that looks identical to the original and is swapped right into the DOM.

To use the MorphSVG plugin, you can either use npm or use the cdn. Npm makes it easy because it uses the modular syntax meaning you can import/export files (i.e: gsap and the MorphSVG plugin). When using a cdn, you use the cdn url in the head of your html page. Then you can register the plugin by adding `gsap.registerPlugin(MorphSVGPlugin);` in your javascript.

</div>
<div class="image">

```js
// install with a package manager
import gsap from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

// converts a <rect> from the id original into a <path>
MorphSVGPlugin.convertToPath('#original rect')

// #new is what you want the shape to morph into
gsap.to('#original', { morphSVG: '#new' })
```

</div>
</div>

<script>
	import './md.css';
	import Subheading from './Subheading.svelte';
	import DetailsElement from './DetailsElement.svelte'
</script>

<style>
	:global(img) {
		display: block;
		margin-left: auto;
		margin-right: auto;
		max-inline-size: 100%;
	}
</style>
