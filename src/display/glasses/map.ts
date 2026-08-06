import {
	ImageContainerProperty,
	ImageRawDataUpdate
} from '@evenrealities/even_hub_sdk';
import {
	mapPrimeTopWidth,
	mapPrimeTopHeight,
	mapPrimeTopBytes
} from '../../images/mapPrimeTop';
import {
	mapPrimeBottomWidth,
	mapPrimeBottomHeight,
	mapPrimeBottomBytes
} from '../../images/mapPrimeBottom';
import {
	routeMapImages
} from '../../images/routeMapsIndex';

export const mapTopContainerId = 1;
export const mapBottomContainerId = 2;

// Initialize the ER Bridge method
let bridgeRef = null;
export function setMapBridge(bri) {
	bridgeRef = bri;
	console.log('bridge initialized in map.ts');
}

// Create the image containers/objects
export function mapImageObjects() {
	return [
		new ImageContainerProperty({
			xPosition: 0,
			yPosition: 0,
			width: mapPrimeTopWidth,
			height: mapPrimeTopHeight,
			containerID: mapTopContainerId,
			containerName: 'mapPrimeTop',
			zOrderIndex: 0
		}),
		new ImageContainerProperty({
			xPosition: 0,
			yPosition: mapPrimeTopHeight,
			width: mapPrimeBottomWidth,
			height: mapPrimeBottomHeight,
			containerID: mapBottomContainerId,
			containerName: 'mapPrimeBottom',
			zOrderIndex: 1
		})
	]
}

// Push the map into the display
export async function pushMapToDisplay() {
	await Promise.all([
		bridgeRef.updateImageRawData(new ImageRawDataUpdate({
			containerID: mapTopContainerId,
			containerName: 'mapPrimeTop',
			imageData: mapPrimeTopBytes
		})),
		bridgeRef.updateImageRawData(new ImageRawDataUpdate({
			containerID: mapBottomContainerId,
			containerName: 'mapPrimeBottom',
			imageData: mapPrimeBottomBytes
		}))
	]);
}


export async function pushRouteMapToDisplay(routeIndex) {
	const routeVar = routeMapImages[routeIndex];

	if (!routeVar) {
		await pushMapToDisplay();
		return;
	}

	await Promise.all([
		bridgeRef.updateImageRawData(new ImageRawDataUpdate({
			containerID: mapTopContainerId,
			containerName: 'mapPrimeTop',
			imageData: routeVar.top.bytes
		})),
		bridgeRef.updateImageRawData(new ImageRawDataUpdate({
			containerID: mapBottomContainerId,
			containerName: 'mapPrimeBottom',
			imageData: routeVar.bottom.bytes
		}))
	]);

}

let flashTimer: ReturnType<typeof setInterval> | null = null;
let flashShowingRoute = false;
let flashGeneration = 0;

// Alternates the display between the base map and the highlighted route
// every intervalMs, giving the selected route a blinking effect.
export function startRouteFlash(routeIndex: number, intervalMs = 500) {
	stopRouteFlash();
	flashShowingRoute = false;
	const myGeneration = ++flashGeneration;

	async function tick() {
		if (myGeneration !== flashGeneration) {
			return;
		}

		flashShowingRoute = !flashShowingRoute;
		if (flashShowingRoute) {
			await pushRouteMapToDisplay(routeIndex);
		} else {
			await pushMapToDisplay();
		}

		if (myGeneration !== flashGeneration) {
			return;
		}

		flashTimer = setTimeout(tick, intervalMs);
	}
	
	flashTimer = setTimeout(tick, intervalMs);
}



export function stopRouteFlash() {
	flashGeneration++;

	if (flashTimer) {
		clearTimeout(flashTimer);
		flashTimer = null;
	}
}