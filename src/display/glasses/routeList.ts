import { ListContainerProperty } from '@evenrealities/even_hub_sdk';

export const RouteListContainerId = 3;
export const RouteListContainerName = 'routeList';

export function routeListObject(routeNames) {
	return new ListContainerProperty({
		xPosition: 250,
		yPosition: 0,
		width: 326,
		height: 288,
		containerID: RouteListContainerId,
		containerName: RouteListContainerName,
		zOrderIndex: 2,
		isEventCapture: 1,
		borderWidth: 2,
  		borderColor: 5,
  		paddingLength: 4,
		itemContainer: {
			itemCount: routeNames.length,
			itemWidth: 326,
			isItemSelectBorderEn: 1,
			itemName: routeNames
		}
	})
}