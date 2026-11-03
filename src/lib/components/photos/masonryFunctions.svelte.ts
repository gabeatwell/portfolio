interface Image {
    src: string;
    alt: string;
}

class MasonryState {
    selectedImage: Image | null = $state<Image | null>(null);
    isOpen: boolean = $state<boolean>(false);
    imageErrors: string[] = $state<string[]>([]);
}
export const masonryState = new MasonryState();

export function openPopover(popoverEl: HTMLElement | null, img: Image) {
    if (!popoverEl) return;

    if (masonryState.isOpen) {
        masonryState.isOpen = false;

        setTimeout(() => {
            masonryState.selectedImage = img;
            popoverEl.showPopover();
            setTimeout(() => {
                masonryState.isOpen = true;
            }, 10);
        }, 50);
    } else {
        masonryState.selectedImage = img;
        popoverEl.showPopover();
        setTimeout(() => {
            masonryState.isOpen = true;
        }, 10);
    }
}

export function closePopover(popoverEl: HTMLElement | null) {
    if (!popoverEl) return;

    masonryState.isOpen = false;

    setTimeout(() => {
        popoverEl.hidePopover();
        masonryState.selectedImage = null;
    }, 1000);
}

export function handleImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.8;

    const scaleX = maxWidth / naturalWidth;
    const scaleY = maxHeight / naturalHeight;
    const scale = Math.min(scaleX, scaleY, 1);

    img.style.width = `${naturalWidth * scale}px`;
    img.style.height = `${naturalHeight * scale}px`;
}

export function handleImageError(event: Event, imgSrc: string) {
    masonryState.imageErrors = [...masonryState.imageErrors, imgSrc];
}
