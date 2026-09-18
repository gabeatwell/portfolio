# DebugLogger Component

A reusable debug logging component for Svelte 5 applications that provides dynamic, categorized debugging with console controls.

## Features

- **Dynamic Control**: Enable/disable debugging at runtime via browser console
- **Categorized Logging**: Organize debug messages by category (events, lifecycle, etc.)
- **Visual Distinction**: Emoji-coded categories for easy identification
- **Timestamped Output**: Grouped console logs with timestamps
- **Namespace Support**: Multiple components can have independent debug controls

## Usage

### 1. Import and Setup

```svelte
<script>
	import DebugLogger from '$lib/data/DebugLogger.svelte';

	// Define debug categories for your component
	const debugCategories = ['events', 'installation', 'userChoice', 'lifecycle'];
</script>
```

### 2. Wrap Your Component

```svelte
<DebugLogger namespace="YourComponent" categories={debugCategories}>
	{#snippet children({ debug, isEnabled })}
		<script>
			// Your component logic here
			$effect(() => {
				debug('lifecycle', 'Component mounted');

				// Event handlers with debugging
				function handleEvent(event) {
					debug('events', 'Event triggered', { event });
					// Your event logic
				}

				return () => {
					debug('lifecycle', 'Component cleanup');
				};
			});
		</script>

		<!-- Your component markup -->
		<button onclick={handleClick}>Click me</button>
	{/snippet}
</DebugLogger>
```

### 3. Console Controls

Once your component is rendered, control debugging via browser console:

```javascript
// Enable all debugging for "YourComponent"
window.yourcomponentDebug.enable();

// Enable specific categories only
window.yourcomponentDebug.enable(['events', 'lifecycle']);

// Toggle individual categories
window.yourcomponentDebug.toggle('events');

// Check current debug status
window.yourcomponentDebug.status();

// Disable all debugging
window.yourcomponentDebug.disable();
```

## Available Categories

| Category       | Emoji | Purpose                        |
| -------------- | ----- | ------------------------------ |
| `events`       | 📡    | Event handling and listeners   |
| `installation` | ⬇️    | App installation processes     |
| `userChoice`   | 👤    | User interaction tracking      |
| `lifecycle`    | 🔄    | Component lifecycle events     |
| `state`        | 📊    | State changes and updates      |
| `network`      | 🌐    | Network requests and responses |
| `performance`  | ⚡    | Performance monitoring         |
| `error`        | ❌    | Error conditions               |
| `warning`      | ⚠️    | Warning messages               |
| `info`         | ℹ️    | General information            |

## Complete Example

```svelte
<script>
	import DebugLogger from '$lib/data/DebugLogger.svelte';
	import A11yAnnouncer from '$lib/components/layout/A11yAnnouncer.svelte';

	const debugCategories = ['events', 'installation', 'userChoice', 'lifecycle'];

	let deferredPrompt = $state(null);
	let isInstallable = $state(false);
	let installStatus = $state('');
</script>

<DebugLogger namespace="InstallButton" categories={debugCategories}>
	{#snippet children({ debug, isEnabled })}
		<script>
			$effect(() => {
				debug('lifecycle', 'Setting up event listeners');

				function handleBeforeInstallPrompt(event) {
					debug('events', 'beforeinstallprompt fired', { event });
					event.preventDefault();
					deferredPrompt = event;
					isInstallable = true;
					installStatus = 'App can now be installed';
				}

				function handleAppInstalled() {
					debug('events', 'appinstalled event fired');
					isInstallable = false;
					installStatus = 'App installed successfully';
				}

				window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
				window.addEventListener('appinstalled', handleAppInstalled);

				return () => {
					debug('lifecycle', 'Cleaning up event listeners');
					window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
					window.removeEventListener('appinstalled', handleAppInstalled);
				};
			});

			const installApp = async () => {
				debug('installation', 'Install button clicked');

				if (!deferredPrompt) {
					debug('installation', 'No deferredPrompt available');
					return;
				}

				try {
					deferredPrompt.prompt();
					const choiceResult = await deferredPrompt.userChoice;
					debug('userChoice', 'User choice received', { outcome: choiceResult.outcome });

					deferredPrompt = null;
					isInstallable = false;
				} catch (error) {
					debug('installation', 'Error during installation', error);
				}
			};
		</script>

		<A11yAnnouncer message={installStatus} />
		<button onclick={installApp} hidden={!isInstallable}> Install App </button>
	{/snippet}
</DebugLogger>
```

## Console Commands Reference

```javascript
// Replace "componentname" with your actual namespace (lowercase)
window.componentnameDebug.enable(); // Enable all
window.componentnameDebug.enable(['events']); // Enable specific categories
window.componentnameDebug.disable(); // Disable all
window.componentnameDebug.toggle('events'); // Toggle category
window.componentnameDebug.status(); // Show current config
```
