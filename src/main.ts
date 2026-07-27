import { waitForEvenAppBridge, TextContainerProperty, CreateStartUpPageContainer } from '@evenrealities/even_hub_sdk'
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import Stations from '../src/data/stations.json';
import PhoneDisplay from './display/phone/phone.ts';
import './style.scss';

const bridge = await waitForEvenAppBridge()
console.log(Stations);

const mainText = new TextContainerProperty({
  xPosition: 0,
  yPosition: 0,
  width: 576,
  height: 288,
  borderWidth: 0,
  borderColor: 5,
  paddingLength: 4,
  containerID: 1,
  containerName: 'main',
  content: 'Hello from G2!',
  isEventCapture: 1,
})

const result = await bridge.createStartUpPageContainer(new CreateStartUpPageContainer({
  containerTotalNum: 1,
  textObject: [mainText],
}))
console.log('Page created:', result === 0 ? 'success' : 'failed')

const url = "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs";
const res = await fetch(url);

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



PhoneDisplay();