import { waitForEvenAppBridge, TextContainerProperty, CreateStartUpPageContainer } from '@evenrealities/even_hub_sdk'
import { setGeoBridge, getUserLocation } from './utils/geolocate';  
import { mtaURL, setUserLat, setUserLon, userLat, userLon, FALLBACK_LAT, FALLBACK_LON } from './state';
import { displayGrid } from './utils/makeElement';

import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import Stations from '../src/data/stations.json';
import PhoneDisplay from './display/phone/phone.ts';
import './style.scss';

const bridge = await waitForEvenAppBridge();


try {
  const loc = await getUserLocation();
  setUserLat(loc.lat);
  setUserLon(loc.lon);
  console.log(`just got user location: ${loc.lat}, ${loc.lon}`);
} catch {
  console.log('GPS aint happenin, setting fallback');
  setUserLat(FALLBACK_LAT);
  setUserLon(FALLBACK_LON);

}

const displayArray = [];

const exampleText = [userLat, userLon];
const exampleTextTwo = ['this',' is',' an', ' example'];
const exampleTextThree = ['checking ','out ','more ','things'];




const mainText = new TextContainerProperty({
  xPosition: 0,
  yPosition: 0,
  width: 576,
  height: 100,
  borderWidth: 3,
  borderColor: 5,
  paddingLength: 4,
  containerID: 1,
  containerName: 'main',
  content: exampleText.join('\n'),
  isEventCapture: 0,
})

const secText = new TextContainerProperty({
  xPosition: 0,
  yPosition: 0,
  width: 100,
  height: 100,
  borderWidth: 2,
  borderColor: 5,
  paddingLength: 4,
  containerID: 2,
  containerName: 'sec',
  content: exampleTextTwo.join('\n'),
  isEventCapture: 0,
})

const threeText = new TextContainerProperty({
  xPosition: 0,
  yPosition: 0,
  width: 100,
  height: 100,
  borderWidth: 2,
  borderColor: 5,
  paddingLength: 4,
  containerID: 3,
  containerName: 'three',
  content: exampleTextThree.join('\n'),
  isEventCapture: 0,
})

const fourText = new TextContainerProperty({
  xPosition: 0,
  yPosition: 0,
  width: 100,
  height: 100,
  borderWidth: 2,
  borderColor: 5,
  paddingLength: 4,
  containerID: 4,
  containerName: 'four',
  content: exampleTextTwo.join('\n'),
  isEventCapture: 0,
})

const fiveText = new TextContainerProperty({
  xPosition: 0,
  yPosition: 0,
  width: 100,
  height: 100,
  borderWidth: 2,
  borderColor: 5,
  paddingLength: 4,
  containerID: 5,
  containerName: 'five',
  content: exampleText.join('\n'),
  isEventCapture: 0,
})

const sixText = new TextContainerProperty({
  xPosition: 0,
  yPosition: 0,
  width: 100,
  height: 100,
  borderWidth: 2,
  borderColor: 5,
  paddingLength: 4,
  containerID: 6,
  containerName: 'six',
  content: exampleTextThree.join('\n'),
  isEventCapture: 0,
})
const sevenText = new TextContainerProperty({
  xPosition: 0,
  yPosition: 0,
  width: 100,
  height: 100,
  borderWidth: 2,
  borderColor: 5,
  paddingLength: 4,
  containerID: 7,
  containerName: 'seven',
  content: exampleText.join('\n'),
  isEventCapture: 0,
})

const eightText = new TextContainerProperty({
  xPosition: 0,
  yPosition: 0,
  width: 100,
  height: 100,
  borderWidth: 2,
  borderColor: 5,
  paddingLength: 4,
  containerID: 8,
  containerName: 'eight',
  content: exampleTextTwo.join('\n'),
  isEventCapture: 0,
})


displayArray.push(mainText, secText, threeText, fourText, fiveText, sixText, sevenText, eightText);


const result = await bridge.createStartUpPageContainer(new CreateStartUpPageContainer({
  containerTotalNum: displayArray.length,
  textObject: displayGrid(displayArray, 6),
}))
console.log(displayArray);


/*

console.log('Page created:', result === 0 ? 'success' : 'failed')
const res = await fetch(mtaURL);

console.log('status:', res.status, res.headers.get('content-type'));
const buffer = await res.arrayBuffer();
const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(new Uint8Array(buffer));

console.log('feed timestamp:', feed.header.timestamp, new Date(Number(feed.header.timestamp)
* 1000).toISOString())
console.log('gtfs realtime version:', feed.header.gtfsRealtimeVersion)
console.log('entity count:', feed.entity.length)

const first = feed.entity.find(e => e.tripUpdate)
console.log('\n--- sample tripUpdate entity ---')
console.log(JSON.stringify(first, null, 2))

*/



PhoneDisplay();