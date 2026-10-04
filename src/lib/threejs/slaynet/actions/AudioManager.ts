export class AudioManager {
    private audioContextMap: Map<string, AudioBuffer> = new Map();
    private audioContext: AudioContext | null = null;

    async initialize(): Promise<void> {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }
    }

    async loadSound(key: string, url: string): Promise<void> {
        if (this.audioContextMap.has(key)) return;

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer =
            await this.audioContext!.decodeAudioData(arrayBuffer);
        this.audioContextMap.set(key, audioBuffer);
    }

    playSound(key: string, volume: number = 0.5): void {
        if (!this.audioContext || !this.audioContextMap.has(key)) return;

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();

        source.buffer = this.audioContextMap.get(key)!;
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.start(0);
    }

    dispose(): void {
        this.audioContextMap.clear();
        this.audioContext?.close();
    }
}
