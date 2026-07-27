import { trainRoutesByColor } from '../../../../state';
import MakeElement from '../../../../utils/makeElement';

const makeEle = new MakeElement;
const trainsDivsArranged = [];

export default function PhoneTrainList() {
	const trains = trainRoutesByColor;
	const phoneTrainListDiv = makeEle.createEle('div','phoneTrainList',null,['phoneTrainList']);
	const phoneTrainListHeader = makeEle.createEle('div','phoneTrainList__header',null,['phoneTrainList__header'])

	phoneTrainListHeader.innerHTML = `
		<div class="phoneTrainList__header--text">
			Trains: 
		</div>
	`;

	phoneTrainListDiv.append(phoneTrainListHeader);

	trains.forEach((train, i) => {
		let traArr = [];
		for (let x = 0; x <= train.routes.length - 1; x++) {
			console.log(train.routes[x]);
			let trainRouteName = train.routes[x].toString();
			
			const classes = /Express$/.test(trainRouteName) ? ['train-list__item', 'train-list__item--express','express'] : ['train-list__item'];
			const tra = makeEle.createEle('div','train-list__item-'+x,null,classes);
			
			tra.style.setProperty('--train-color',train.color);
			tra.innerHTML = `<div class="train-list__item-text"> ${trainRouteName.replace(/Express$/, '')} </div>`;
			traArr.push(tra);
		}
		trainsDivsArranged.push(traArr);
	})

	trainsDivsArranged.forEach((train, i) => {
		let trainListContainer = makeEle.createEle('div','phoneTrainList__trainListContainer-'+i, null,['phoneTrainList__trainListContainer']);
		for (let x=0; x <= train.length-1;x++) {
			trainListContainer.append(train[x]);
		}
		phoneTrainListDiv.append(trainListContainer);
	})

	return phoneTrainListDiv;
}