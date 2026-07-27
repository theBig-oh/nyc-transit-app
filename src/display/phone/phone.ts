import PhoneTrainList from './components/phoneTrainList/phoneTrainList';


export default function PhoneDisplay() {
	console.log("this is coming from PhoneDisplay()");

	const phoneBody = document.querySelector('div.phone-body');


	phoneBody.innerHTML = 'This is coming from PhoneDisplay';

	phoneBody.append(PhoneTrainList());
}