/// <reference types="youtube" />

declare global {
    interface Window {
        onYouTubeIframeAPIReady?: () => void;
    }
}

export class YoutubeGuide {
    player: YT.Player | null = null;
    apiReady = $state(false);
    playerReady = $state(false);
    playing = $state(false);
    #pendingPlay = false;

    #getVideoId: () => string;

    constructor(getVideoId: () => string) {
        this.#getVideoId = getVideoId;
    }

    mount() {
        this.loadApi();
        const check = setInterval(() => {
            if (this.apiReady) {
                clearInterval(check);
                this.createPlayer();
            }
        }, 100);

        return () => {
            clearInterval(check);
            this.close();
        };
    }

    loadApi() {
        if (window.YT?.Player) {
            this.apiReady = true;
            return;
        }
        if (
            document.querySelector(
                'script[src="https://www.youtube.com/iframe_api"]',
            )
        ) {
            window.onYouTubeIframeAPIReady = () => (this.apiReady = true);
            return;
        }
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.head.appendChild(tag);
        window.onYouTubeIframeAPIReady = () => (this.apiReady = true);
    }

    createPlayer() {
        if (!this.apiReady || this.player || !window.YT) return;
        const videoId = this.#getVideoId();

        this.player = new window.YT.Player('yt-player', {
            videoId,
            playerVars: {
                autoplay: 0,
                controls: 1,
                playsinline: 1,
                modestbranding: 1,
                rel: 0,
                loop: 1,
                playlist: videoId,
            },
            events: {
                onReady: (event) => {
                    this.playerReady = true;
                    if (this.#pendingPlay) {
                        event.target.unMute();
                        event.target.playVideo();
                        this.#pendingPlay = false;
                    }
                },
            },
        });
    }

    play = () => {
        this.playing = true;
        if (this.player && this.playerReady) {
            this.player.unMute();
            this.player.playVideo();
        } else {
            this.#pendingPlay = true;
        }
    };

    close() {
        this.playing = false;
        this.playerReady = false;
        this.#pendingPlay = false;
        try {
            this.player?.destroy();
        } catch {
            /* ignore */
        }
        this.player = null;
    }
}
