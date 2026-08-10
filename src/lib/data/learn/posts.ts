export const learnPosts = {
    css: `
    # CSS

<div class="grid-section" id="transitions">
<div class="content">

## transitions

CSS transitions provide a way to control animation speed when changing CSS properties. Instead of having property changes take effect immediately, you can cause the changes in a property to take place over a period of time. For example, if you change the color of an element from white to black, usually the change is instantaneous. With CSS transitions enabled, changes occur at time intervals that follow an acceleration curve, all of which can be customized. Animations that involve transitioning between two states are often called implicit transitions as the states in between the start and final states are implicitly defined by the browser.

CSS transitions let you decide which properties to animate (by listing them explicitly), when the animation will start (by setting a delay), how long the transition will last (by setting a duration), and how the transition will run (by defining an easing function, e.g., linearly or quick at the beginning, slow at the end).

</div>
<div class="image">

\`\`\`css
div {
    transition: <property> <duration> <timing> <delay>;
}

.example {
    transform: translate(100px);
    transition: transform 1s ease-out;
}
\`\`\`

</div>
</div>

---

<div class="grid-section" id="animations">
<div class="content">

## animations

In order to create the animations we need to use the \`@keyframes\` rule. This rule specifies the animation code. The animation is created by gradually changing from one set of CSS styles to another. During the animation, you can change the set of CSS styles many times. Specify when the style change will happen in percent, or with the keywords \`from\` and \`to\` which is the same as 0% and 100%. 0% is the beginning of the animation, 100% is when the animation is complete. The following example will change the background-color of the div element from red to yellow:

</div>
<div class="image">

\`\`\`css
.example {
    animation: colors 1s ease-out;
}

@keyframes colors {
    0% {
        background: yellow;
    }
    50% {
        background: green;
    }
    100% {
        background: blue;
    }
}
\`\`\`

</div>
</div>

---

<div class="grid-section" id="interpolate">
<div class="content">

## interpolate-size

The CSS interpolate-size property allows a page to opt in to animations and transitions of CSS intrinsic sizing keywords such as auto, min-content, fit-content, etc., in the cases where we can animate those keywords. The gist is to add the following snippet to your stylesheet to opt-in to interpolating from \`&lt;length-percentage&gt;\`'s to any of the supported \`&lt;intrinsic-size-keyword&gt;\`'s or vice versa.

</div>
<div class="image">

\`\`\`css
:root {
    interpolate-size: allow-keywords;
}
\`\`\`

</div>
</div>

---

<div class="grid-section" id="calc">
<div class="content">

## calc-size

The calc-size() function is a new addition to CSS that allows for the calculation of intrinsic sizes like auto, min-content, max-content, fit-content, stretch, and contain. This function enables web developers to animate elements with height: auto or other intrinsic sizes without needing JavaScript. \`calc-size()\` works similarly to the \`calc()\` function but can handle intrinsic sizes. It accepts two arguments: the first is the intrinsic size you want to calculate, and the second is the calculation you want to perform on that size.

</div>
<div class="image">

\`\`\`css
.example {
    --size: 50px;
    height: calc-size(var(--size) + 3rem);
}
\`\`\`

</div>
</div>

---

<div class="grid-section" id="details">
<div class="content">

## details element

The \`&lt;details&gt;\` element can now be animated using the interpolate-size property, allowing for smooth transitions when opening and closing. Here's how you can implement this: Enable Interpolation - Add \`interpolate-size: allow-keywords;\` to the \`&lt;details&gt;\` element to enable transitions to and from intrinsic sizing keywords like auto, min-content, max-content, and fit-content.
Apply specific styles to the \`&lt;details&gt;\` element and its pseudo-element \`::details-content\` to control the transition behavior.

</div>
<div class="image">

\`\`\`css
details {
    inline-size: 50ch;

    &::details-content {
        opacity: 0;
        transition:
            content-visibility 1s allow-discreet,
            opacity 1s;
    }

    &::[open]::details=content {
        opacity: 1;
    }
}
\`\`\`

</div>
</div>

---

<div class="grid-section" id="view">
<div class="content">

## view transitions

The \`view transitions\` api is used to transition your website between pages for MPA (multi-page application) use or between elements for SPA (single page application) use. It's quite easy to do, it takes one line of code. In the following image, I've included some examples of how to set it up. The first example \`@view-transition &#123;navigation: auto;&#125;\` is all you have to add to your css to make a crossfade animation happen on every page transition. You have to add this to your \`:root\` in css for it to happen to every page transition.

The example: \`::view-transition-old(root), ::view-transition-new(root)\` examples are to customize the transitions. Old is the state that the page is leaving from and new means the state the page is going to. (root) means the root of the file.. if you want the animate the transition of a specific DOM element, you would have to create a \`view-transition-name = "example"\` in css on the element and change root into the name \`::view-transition-group(example)\`. To select both of these at once you use \`::view-transition-group\`.

</div>
<div class="image long">

\`\`\`css
@view-transition {
    navigation: auto;
}

:root::view-transition-old(root) {
    animation: fade-out 2s ease-out forwards;
}

@keyframes fade-out {
    to {
        opacity: 0;
    }
}
\`\`\`

</div>
</div>

---

<div class="grid-section" id="anchor">
<div class="content">

## anchor position

CSS anchor positioning provides a way to position an element relative to another element. Here are the steps to use anchor positioning:
Step one: Make an anchor that another element can position to.. and step two: position an element to that anchor.

### make an anchor

To make an element an anchor, you give it an anchor-name value of any string that starts with two dashes. This is the identifier that the positioned element will use to find its anchor. The more descriptive the name is, the better. You can even give an element multiple anchor names, if it will be used as an anchor in different ways.

\`\`\`css
#anchor {
    anchor-name: --example-anchor;
}
\`\`\`

### position an element to the anchor

You will need to set a few properties on the positioned element.. You need to pull the element out of the document's flow by setting position: absolute or position: fixed to it. Next, you need to set which anchor you want to tether to, by setting position-anchor to the anchor name you set on the anchor. Finally, you'll need to set how to position the anchor. You'll learn more about position-area later in this module.

\`\`\`css
#positioned-element {
    position: absolute;
    position-anchor: --example-anchor;
    top: anchor(bottom);
}
\`\`\`

### scoping the anchors

The anchor-scope property sets which anchor names will be matched only among an element and its descendants. It accepts a list of one or more anchor names or the keyword all to limit the scope of all defined anchor names.

An anchor-scope is ideally added to an ancestor of both the positioned element and anchor element that does not contain other anchor elements with the same name. Often, this is on the reusable component's root.

If you’re using anchor-scope, verify that both the anchor and positioned element are descendants of the element with the anchor-scope rule, or if the anchor itself has the anchor-scope rule, that the positioned element is a descendant of the anchor.

### debugging tips

If it seems like the anchor positioning isn't working (if your positioned element is in the top left corner of the anchor), what I've learned is the anchor and positioned element have to be siblings, there should be no parent/child relationship. If the anchor element is a parent to the positioned element anchor positioning will not work.

### valid pseudo-elements

The valid pseudo-elements are \`::before\`, \`::after\` and \`::file-selector-button\`.

</div>
<div class="image long">

\`\`\`html
<section>
    <div id="anchor"></div>
    <div id="positionedElement"></div>
</section>
\`\`\`

\`\`\`css
section {
    position: relative;
    anchor-scope: --anchor;

    & #anchor {
        anchor-name: --anchor;
    }

    & #positionedElement {
        position: absolute;
        position-anchor: --anchor;
        bottom: anchor(top);
    }
}
\`\`\`

</div>
</div>

<script>
	import './md.css';
</script>

    \`,
    gsap: \`
    # Greensock Animation Platform

<div class="grid-section" id="tweens">
<div class="content">

## tweens

In web animation, a tween stands for "in-betweening". Basically, it is the foundation for the whole GSAP process. There are 3 types of tweens: \`gsap.to("element", { variables })\` animating one state TO another state, \`gsap.from("element", { variables })\` animating one state FROM another state, \`gsap.fromTo("element", { variables }, { variables })\` specifically choosing the STARTING and ENDING state.

</div>
<div class="image">

\`\`\`js
gsap.to(<element>, { <variables> }, <position parameter>);

gsap.to('.example', { x: 500 }, '<');
\`\`\`

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

\`\`\`js
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
\`\`\`

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

\`\`\`js
const tl = gsap.timeline()

tl.to('.red', { x: 100, duration: 2 })
tl.to('.blue', { y: 300, duration: 1 }, '+=300')
\`\`\`

</div>
</div>

---

<div class="grid-section" id="percentage">
<div class="content">

## percentage keyframes

This familiar syntax makes porting animations over from CSS really easy. Instead of using delays and duration in the keyframe object, you specify an overall duration on the tween itself, then define the position of each keyframe using percentages.

</div>
<div class="image">

\`\`\`js
gsap.to('.example', {
    keyframes: {
        '0%': { x: 50 },
        '50%': { y: 500 },
        '100%': { x: -50 },
        easeEach: 'power2.out',
    },
    duration: 3,
})
\`\`\`

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

\`\`\`js
gsap.to(<element>, { <variables> }, <position parameter>)
gsap.to('.example', { y: 200 }, '+=200')
\`\`\`

</div>
</div>

---

<div class="grid-section" id="fouc">
<div class="content">

## flash of unstyled content

Have you ever noticed an annoying "flash of unstyled content" (FOUC) when a web page first loads? This looks like a weird jump or lag.. That happens because browsers render things as quickly as possible, often BEFORE your JavaScript executes the first time. So what if some of your initial styles are set via JavaScript...like with GSAP?

<DetailsElement summary="solution">

apply \`visibility: hidden;\` to your elements in CSS and then use GSAP's autoAlpha property to show it (or animate it in) when the page loads. autoAlpha affects opacity and visibility, changing it to visible when the opacity is greater than 0.

</DetailsElement>

</div>
<div class="image">

\`\`\`css
/* first hide element in css */
.example {
    visibility: hidden;
}
\`\`\`

\`\`\`js
// then use autoAlpha in gsap
gsap.to('.example', { autoAlpha: 1 })
\`\`\`

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

\`\`\`js
// install with a package manager
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
\`\`\`

\`\`\`js
gsap.registerPlugin(ScrollTrigger)

ScrollTrigger.create({
    trigger: '.example',
    start: 'top bottom',
    end: 'bottom center',
    onUpdate: (self) => {
        console.log('Updated!')
    },
})
\`\`\`

</div>
</div>

---

<div class="grid-section" id="morphsvg">
<div class="content">

## morphSVG

MorphSVGPlugin morphs SVG paths by animating the data inside the d attribute. MorphSVGPlugin finds the paths and automatically figures out how to add enough points to the circle to get a super smooth morph. It will rip through all that ugly path data, convert everything to cubic beziers, and dynamically subdivide them when necessary, adding points so that the beginning and ending quantities match (but visually it looks the same). It's all done seamlessly under the hood.

There's a utility function, \`MorphSVGPlugin.convertToPath()\`, that can convert primitive shapes like \`<circle>\`, \`<rect>\`, \`<ellipse>\`, \`<polygon>\`, \`<polyline>\`, and \`<line>\` directly into the equivalent \`<path>\` that looks identical to the original and is swapped right into the DOM.

To use the MorphSVG plugin, you can either use npm or use the cdn. Npm makes it easy because it uses the modular syntax meaning you can import/export files (i.e: gsap and the MorphSVG plugin). When using a cdn, you use the cdn url in the head of your html page. Then you can register the plugin by adding \`gsap.registerPlugin(MorphSVGPlugin);\` in your javascript.

</div>
<div class="image">

\`\`\`js
// install with a package manager
import gsap from 'gsap'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

// converts a <rect> from the id original into a <path>
MorphSVGPlugin.convertToPath('#original rect')

// #new is what you want the shape to morph into
gsap.to('#original', { morphSVG: '#new' })
\`\`\`

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

    `,
};
