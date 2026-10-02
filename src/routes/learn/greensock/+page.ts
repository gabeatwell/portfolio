export async function load() {
    try {
        const { default: greensockDetails } =
            await import('#lib/components/learn/pages/greensock-details.json');
        return {
            greensockDetails,
        };
    } catch {
        return {
            greensockDetails: [],
        };
    }
}
