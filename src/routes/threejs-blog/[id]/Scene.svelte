<script lang="ts">
    import { onMount } from 'svelte';
    import {
        DirectionalLight,
        IcosahedronGeometry,
        Mesh,
        MeshStandardMaterial,
        PerspectiveCamera,
        Scene,
        WebGLRenderer,
    } from 'three';

    interface Post {
        id: number;
        title: string;
        subtitle: string;
        content: string;
        image?: string;
        date?: string;
    }

    let { post }: { post: Post } = $props();
    let container: HTMLDivElement | undefined = $state();

    onMount(() => {
        if (!container) return;

        const scene = new Scene();
        const camera = new PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000,
        );
        const renderer = new WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        const geometry = new IcosahedronGeometry(1, 1);
        const material = new MeshStandardMaterial({
            color: 0x44aaff,
            metalness: 0.3,
            roughness: 0.4,
        });
        const mesh = new Mesh(geometry, material);
        scene.add(mesh);

        const light = new DirectionalLight(0xffffff, 2);
        light.position.set(2, 3, 4);
        scene.add(light);

        camera.position.z = 5;

        function animate() {
            mesh.rotation.x += 0.01;
            mesh.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        renderer.setAnimationLoop(animate);

        // Responsive: keep canvas + camera in sync with the container
        const ro = new ResizeObserver(() => {
            const w = container?.clientWidth ?? 1;
            const h = container?.clientHeight ?? 1;
            renderer.setSize(w, h);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        });
        ro.observe(container);

        // Cleanup runs when Isle unmounts the island
        return () => {
            ro.disconnect();
            renderer.setAnimationLoop(null);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            container?.removeChild(renderer.domElement);
        };
    });
</script>

<div class="scene" bind:this={container} title={post.title}></div>

<style>
    .scene {
        width: 100%;
        height: 60vh;
        min-height: 400px;
        background: var(--clr-dark-500);
        border-radius: var(--radius);
        margin-block: 2em;
    }
</style>
