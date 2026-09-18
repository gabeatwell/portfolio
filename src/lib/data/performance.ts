// performance utility.. track Core Web Vitals including CLS

interface LayoutShiftAttribution {
    node?: Element;
    previousRect?: DOMRectReadOnly;
    currentRect?: DOMRectReadOnly;
}

interface LayoutShift extends PerformanceEntry {
    value: number;
    hadRecentInput: boolean;
    sources?: LayoutShiftAttribution[];
}

interface LargestContentfulPaint extends PerformanceEntry {
    renderTime: number;
    loadTime: number;
    size: number;
    element?: Element;
}

interface PerformanceEventTiming extends PerformanceEntry {
    processingStart: number;
    processingEnd: number;
    cancelable: boolean;
    target?: Node;
}

export function initPerformanceMonitoring() {
    const abortController = new AbortController();

    if (typeof window === 'undefined') return;

    // Track Cumulative Layout Shift (CLS)
    let clsValue: number = 0;
    let clsEntries: PerformanceEntry[] = [];

    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            const layoutShift = entry as LayoutShift;
            // Only count layout shifts without recent user input
            if (!layoutShift.hadRecentInput) {
                clsValue += layoutShift.value;
                clsEntries.push(entry);

                console.log('🔄 Layout shift detected:', {
                    value: layoutShift.value,
                    totalCLS: clsValue,
                    sources: layoutShift.sources?.map(
                        (source: LayoutShiftAttribution) => ({
                            element: source.node?.tagName || 'unknown',
                            className: source.node?.className || '',
                            id: source.node?.id || '',
                        }),
                    ),
                });
            }
        }
    });

    try {
        observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
        console.warn('Layout shift observer not supported');
    }

    // Track Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as LargestContentfulPaint;
        console.log('🖼️ LCP:', lastEntry.startTime, 'ms', lastEntry.element);
    });

    try {
        lcpObserver.observe({
            type: 'largest-contentful-paint',
            buffered: true,
        });
    } catch (e) {
        console.warn('LCP observer not supported');
    }

    // Track First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            const eventEntry = entry as PerformanceEventTiming;
            console.log(
                '⚡ FID:',
                eventEntry.processingStart - eventEntry.startTime,
                'ms',
            );
        }
    });

    try {
        fidObserver.observe({ type: 'first-input', buffered: true });
    } catch (e) {
        console.warn('FID observer not supported');
    }

    // Report final scores when page is hidden
    document.addEventListener(
        'visibilitychange',
        () => {
            if (document.visibilityState === 'hidden') {
                console.log('📊 Final Performance Scores:', {
                    CLS: clsValue,
                    layoutShifts: clsEntries.length,
                });
            }
        },
        { signal: abortController.signal },
    );

    return () => {
        abortController.abort();
        observer.disconnect();
        lcpObserver.disconnect();
        fidObserver.disconnect();
    };
}

// Helper function to check if element is causing layout shift
export function identifyShiftCauses() {
    const problematicElements = [
        'img:not([width]):not([height])',
        'iframe:not([width]):not([height])',
        '[loading="lazy"]:not([width]):not([height])',
        '.loading:empty',
        '[style*="height: auto"]:not([width])',
    ];

    problematicElements.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            console.warn(
                `⚠️ Potential CLS elements found: ${selector}`,
                elements,
            );
        }
    });
}
