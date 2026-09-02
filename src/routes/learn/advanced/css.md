# CSS

<div class="grid-section" id="transitions">
<div class="content">

## transitions

CSS transitions provide a way to control animation speed when changing CSS properties. Instead of having property changes take effect immediately, you can cause the changes in a property to take place over a period of time. For example, if you change the color of an element from white to black, usually the change is instantaneous. With CSS transitions enabled, changes occur at time intervals that follow an acceleration curve, all of which can be customized. Animations that involve transitioning between two states are often called implicit transitions as the states in between the start and final states are implicitly defined by the browser.

CSS transitions let you decide which properties to animate (by listing them explicitly), when the animation will start (by setting a delay), how long the transition will last (by setting a duration), and how the transition will run (by defining an easing function, e.g., linearly or quick at the beginning, slow at the end).

</div>
<div class="image">

```css
div {
    transition: <property> <duration> <timing> <delay>;
}

.example {
    transform: translate(100px);
    transition: transform 1s ease-out;
}
```

</div>
</div>

---

<div class="grid-section" id="animations">
<div class="content">

## animations

In order to create the animations we need to use the `@keyframes` rule. This rule specifies the animation code. The animation is created by gradually changing from one set of CSS styles to another. During the animation, you can change the set of CSS styles many times. Specify when the style change will happen in percent, or with the keywords `from` and `to` which is the same as 0% and 100%. 0% is the beginning of the animation, 100% is when the animation is complete. The following example will change the background-color of the div element from red to yellow:

</div>
<div class="image">

```css
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
```

</div>
</div>

---

<div class="grid-section" id="interpolate">
<div class="content">

## interpolate-size

The CSS interpolate-size property allows a page to opt in to animations and transitions of CSS intrinsic sizing keywords such as auto, min-content, fit-content, etc., in the cases where we can animate those keywords. The gist is to add the following snippet to your stylesheet to opt-in to interpolating from `&lt;length-percentage&gt;`'s to any of the supported `&lt;intrinsic-size-keyword&gt;`'s or vice versa.

</div>
<div class="image">

```css
:root {
    interpolate-size: allow-keywords;
}
```

</div>
</div>

---

<div class="grid-section" id="calc">
<div class="content">

## calc-size

The calc-size() function is a new addition to CSS that allows for the calculation of intrinsic sizes like auto, min-content, max-content, fit-content, stretch, and contain. This function enables web developers to animate elements with height: auto or other intrinsic sizes without needing JavaScript. `calc-size()` works similarly to the `calc()` function but can handle intrinsic sizes. It accepts two arguments: the first is the intrinsic size you want to calculate, and the second is the calculation you want to perform on that size.

</div>
<div class="image">

```css
.example {
    --size: 50px;
    height: calc-size(var(--size) + 3rem);
}
```

</div>
</div>

---

<div class="grid-section" id="details">
<div class="content">

## details element

The `&lt;details&gt;` element can now be animated using the interpolate-size property, allowing for smooth transitions when opening and closing. Here's how you can implement this: Enable Interpolation - Add `interpolate-size: allow-keywords;` to the `&lt;details&gt;` element to enable transitions to and from intrinsic sizing keywords like auto, min-content, max-content, and fit-content.
Apply specific styles to the `&lt;details&gt;` element and its pseudo-element `::details-content` to control the transition behavior.

</div>
<div class="image">

```css
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
```

</div>
</div>

---

<div class="grid-section" id="view">
<div class="content">

## view transitions

The `view transitions` api is used to transition your website between pages for MPA (multi-page application) use or between elements for SPA (single page application) use. It's quite easy to do, it takes one line of code. In the following image, I've included some examples of how to set it up. The first example `@view-transition &#123;navigation: auto;&#125;` is all you have to add to your css to make a crossfade animation happen on every page transition. You have to add this to your `:root` in css for it to happen to every page transition.

The example: `::view-transition-old(root), ::view-transition-new(root)` examples are to customize the transitions. Old is the state that the page is leaving from and new means the state the page is going to. (root) means the root of the file.. if you want the animate the transition of a specific DOM element, you would have to create a `view-transition-name = "example"` in css on the element and change root into the name `::view-transition-group(example)`. To select both of these at once you use `::view-transition-group`.

</div>
<div class="image long">

```css
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
```

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

```css
#anchor {
    anchor-name: --example-anchor;
}
```

### position an element to the anchor

You will need to set a few properties on the positioned element.. You need to pull the element out of the document's flow by setting position: absolute or position: fixed to it. Next, you need to set which anchor you want to tether to, by setting position-anchor to the anchor name you set on the anchor. Finally, you'll need to set how to position the anchor. You'll learn more about position-area later in this module.

```css
#positioned-element {
    position: absolute;
    position-anchor: --example-anchor;
    top: anchor(bottom);
}
```

### scoping the anchors

The anchor-scope property sets which anchor names will be matched only among an element and its descendants. It accepts a list of one or more anchor names or the keyword all to limit the scope of all defined anchor names.

An anchor-scope is ideally added to an ancestor of both the positioned element and anchor element that does not contain other anchor elements with the same name. Often, this is on the reusable component's root.

If you’re using anchor-scope, verify that both the anchor and positioned element are descendants of the element with the anchor-scope rule, or if the anchor itself has the anchor-scope rule, that the positioned element is a descendant of the anchor.

### debugging tips

If it seems like the anchor positioning isn't working (if your positioned element is in the top left corner of the anchor), what I've learned is the anchor and positioned element have to be siblings, there should be no parent/child relationship. If the anchor element is a parent to the positioned element anchor positioning will not work.

### valid pseudo-elements

The valid pseudo-elements are `::before`, `::after` and `::file-selector-button`.

</div>
<div class="image long">

```html
<section>
    <div id="anchor"></div>
    <div id="positionedElement"></div>
</section>
```

```css
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
```

</div>
</div>

<script>
	import './md.css';
</script>
