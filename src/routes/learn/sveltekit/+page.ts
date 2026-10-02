export async function load() {
    try {
        const { default: svelteKitDetails } =
            await import('#lib/components/learn/pages/sveltekit-details.json');
        return {
            svelteKitDetails,
        };
    } catch {
        return {
            svelteKitDetails: [],
        };
    }
}
