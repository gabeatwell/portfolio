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
</style>
