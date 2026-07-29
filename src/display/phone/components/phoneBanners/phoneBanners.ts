import MakeElement from '../../../../utils/makeElement';

const makeEle = new MakeElement;


export function PhoneBannerHeader() {
	const headerBanner = makeEle.createEle('div','phoneBanner__header',null,['phoneDisplayComponents','phoneBanner__items','phoneBanner__header'])

	headerBanner.innerHTML = `
		<div class="phoneBanner__header--background">
			<div class="phoneBanner__header--text">
				MTA Train Viewer
			</div>
		</div>
	`;


	return headerBanner;
}


export function PhoneBannerFooter() {
	const footerBanner = makeEle.createEle('div', 'phoneBanner__footer',null,['phoneBanner__footer','phoneDisplayComponents','phoneBanner__items']);
	const footerCreatorTag = makeEle.createEle('div','phoneBanner__footer-creator-tag',null,['phoneHeader__footer-item','phoneBanner__footer-creator-tag']);
	const footerDisclaimer = makeEle.createEle('div','phoneBanner__footer-disclaimer',null,['phoneBanner__footer-items','phoneBanner__footer-disclaimer']);

	footerCreatorTag.innerHTML = `
		<div class="creator-tag">
			Made by The Big Oh.
		</div>
	`;

	footerDisclaimer.innerHTML = `
		<div class="disclaimer-text">
			This is not affliated with the MTA, NYC, NYCDOT, or other gov entities. Just me and my code and curiousity.
		</div>
	`;

	footerBanner.append(footerDisclaimer, footerCreatorTag);


	return footerBanner;
}