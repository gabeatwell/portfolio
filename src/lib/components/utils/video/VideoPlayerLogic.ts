export function playVid(video: HTMLVideoElement | null) {
    video?.play();
}

export function pauseVid(video: HTMLVideoElement | null) {
    video?.pause();
}

export function stopVid(
    video: HTMLVideoElement | null,
    currentTime: number,
): number {
    if (!video) return currentTime;
    video.pause();
    video.currentTime = 0;
    return 0;
}

export function changeVol(event: Event, video: HTMLVideoElement | null) {
    if (!video) return;
    video.volume = Number((event.target as HTMLInputElement).value);
}

export function togglePlay(video: HTMLVideoElement | null) {
    if (!video) return;
    if (video.paused) {
        video.play();
    } else {
        video.pause();
    }
}

export function handleKeydown(
    event: KeyboardEvent,
    video: HTMLVideoElement | null,
) {
    if (event.code === 'Space' || event.key === ' ') {
        event.preventDefault();
        togglePlay(video);
    }
}

export function handleLoadedMetadata(
    video: HTMLVideoElement | null,
    duration: number,
): number {
    if (!video) return duration;
    return video.duration || 0;
}

export function handleTimeUpdate(
    video: HTMLVideoElement | null,
    currentTime: number,
): number {
    if (!video) return currentTime;
    return video.currentTime;
}

export function handleSeek(
    video: HTMLVideoElement | null,
    event: Event,
    currentTime: number,
): number {
    if (!video) return currentTime;
    const value = Number((event.target as HTMLInputElement).value);
    video.currentTime = value;
    return value;
}
