<script lang='ts'>
  const story = { camZ: 8, rot: 0, color: 0x44aaff }

  function frame() {
      const r = scrollyEl.getBoundingClientRect()
      const p = Math.min(Math.max(-r.top / (r.height - innerHeight), 0), 1) // 0→1 across story
      // interpolate keyframes from p (2 stops = mix, N stops = segment lookup)
      camera.position.z += (lerpPath(p) - camera.position.z) * 0.08   // lerp ≈ GSAP scrub smoothing
      // ...rotation, material color from p the same way
      renderer.render(scene, camera)
  }
</script>

<section class="scrolly">
	<div class="stage">{@attach render}</div>

	<div class="chaper"></div>
	<div class="chaper"></div>
	<div class="chaper"></div>
</section>

<style>
  .scrolly {
    view-timeline-name: --scrolly;

    & .stage {
      position: sticky;
      inset-block-start: 0;
      block-size: 100svh;
    }

    & .chapter {
      animation: reveal 1ms linear;
      animation-timeline: view();
      animation-range: entry 20% cover 55%;
    }
  }

  @keyframes reveal {
    from {opacity: 0; transform: translateY(3rem);}
    to {opacity: 1; transform: none;}
  }

  @supports not (animation-timeline: view()) {
    .chapter {animation: none; opacity: 1; transform: none;}
  }
  @media (prefers-reduced-motion: reduce) {
    .chapter {animation: none;}
  }

  /*@property --p { syntax: '<number>'; initial-value: 0; inherits: true; }
  .scrolly { animation: track linear; animation-timeline: --story; }*/
  /*@keyframes track { to { --p: 1; } }*/
  /* e.g. .progress-bar { scale: var(--p) 1; } */

</style>
