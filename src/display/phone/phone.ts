import PhoneTrainList from './components/phoneTrainList/phoneTrainList';
import { PhoneBannerHeader, PhoneBannerFooter } from './components/phoneBanners/phoneBanners';

export default function PhoneDisplay() {
	console.log("this is coming from PhoneDisplay()");

	const phoneBody = document.querySelector('div.phone-body');

	phoneBody.append(PhoneBannerHeader(), PhoneTrainList(), PhoneBannerFooter());
}