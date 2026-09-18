import type { GameObject } from '../objects/GameObject';

export class Action {
    name = 'BaseAction';
    source: GameObject | null = null;

    constructor(source: GameObject) {
        this.source = source;
    }

    async perform() {}

    async canPerform(): Promise<boolean> {
        return true;
    }
}
