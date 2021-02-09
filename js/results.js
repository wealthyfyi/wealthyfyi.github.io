let kudos = {
	budget1 : {
		title : "Start building wealth",
		brief : "Having money left over each month is the first step towards becoming wealthy. Keep up the good work!"
	},
	efundkudo1 : {
		title: "You're prepared for emergencies",
		brief: "Emergencies can happen at any time. Fortunately, you're ready for them. Great job!"
	},
	employermatchkudo1 : {
		title: "Unbeatable returns",
		brief: "Employer contribution matching is a guaranteed high return on your investment, and it goes into a tax-advantaged account. Talk about a win-win! Getting the full match is a huge accelerator for building wealth."
	},
	debtfreekudo1 : {
		title: "Debt free living",
		brief: "For many people, debt is a huge burden to shoulder. Being debt free is a wonderful position to be in. Congratulations!"
	},
	hsamaxkudo1 : {
		title: "A healthy future ahead of you",
		brief: "Healthcare is expensive, and it only gets more expensive as you get older. Fortunately you're preparing for it by fully funding your Health Savings Account (HSA). Did you know an HSA is the best retirement account in America? There are no taxes on the income that funds it, the gains in the HSA, nor on the withdrawals for eligible health expenses. If you can avoid withdrawing for your expenses now, it'll pay of dramatically over time."
	}
}
let recommendations = {
	spendless : {
		title: "Reduce your spending",
		brief: "In order to start building wealth, you need to spend less than you make. The easiest way to start doing that is to reduce your spending."
	},
	efund1 : {
		title: "Build an emergency fund",
		brief: "Being prepared for emergencies is the first step towards financial freedom. Get started by saving enough cash to cover a month of expenses in a high yield savings account."
	},
	employermatch1 : {
		title: "Get unbeatable returns",
		brief: "When your employer matches your contributions to a 401(K) account, it's like you're getting an guaranteed 100% return on your investment. Adjusted for risk, it's probably the best investment you can make. As an added bonus, your contribution and the employer match are tax advantaged."
	},
	highinterest1 : {
		title: "Pay down high interest loans",
		brief: "Loans that have an interest rate similar to or higher than your investment return rate should be paid off before investing. Since investment has some risk of producing lower returns and loan interest is fixed, it's usually good to pay off loans with >5% interest before investing."
	},
	hsafees1 : {
		title: "Give your HSA a health check",
		brief: "While the Health Savings Account (HSA) is the best investment account in America, not all of them are created equal. Some have higher management fees than others. It's worth checking to see if you could be paying lower fees by switching to another HSA provider."
	},
	hsamax1 : {
		title: "Invest in your future health",
		brief: "The Health Savings Account (HSA) is the best investing account America. Once you've maxed out your employer matching in your 401(K) account, the next best thing to max out is your HSA. It provides all the tax advantages of both a Traditional and a Roth retirement account, making it a better way to invest than both of them."
	},
	evaluateiratype : {
		title: "Traditional or Roth IRA?",
		brief: "Individual Retirement Accounts (IRAs) provide tax incentives to encourage you to save for your future. Contributions to a Traditional account reduce your tax bill now, reducing the burden on your budget today. Money you contribute to a Roth account is taxed normally, but all the growth is tax-free. Generally it's better to use a Roth account if you expect your income to go up, otherwise a Traditional account is likely better."
	},
	maxira : {
		title: "Max out that IRA",
		brief: "An Individual Retirement Account (IRA) provide tax incentives to encourage you to save for your future. These tax incentives help your dollars do more for you by reducing how many of them you have to give to the government. Contributing the full limit to your IRA helps your money do more for you."
	},
	maxtraditionalira : {
		title: "Max out a Traditional IRA",
		brief: "An Individual Retirement Account (IRA) provide tax incentives to encourage you to save for your future. Using a Traditional IRA will reduce your tax bill today, making it easier to invest. Those savings will be able to grow unimpeded; you won't have to pay taxes until you withdraw your money in retirement."
	},
	evaluateespp : {
		title: "Grow with your employer",
		brief: "Some companies have an Employee Stock Purchase Program (ESPP) that allows employees to use a portion of their salary to purchase shares of the company at a discounted price. There are typically no restrictions on when you can sell the shares either. If your employer offers an ESPP with these characteristics, it's likely you can increase your income by contributing the maximum amount to the ESPP and then selling the shares immediately when you get them to avoid becoming over-exposed to your employer."
	},
	othergoalsavings : {
		title: "Prepare for expected expenses",
		brief: "Whether it's a car, house, college, elder care, or other major upcoming expense you expect to have in the next 5 years, you should start saving now if you haven't. For planned expenses within the next 5 years, it's usually better put your savings in something with a lower risk than stocks. A high yield savings account and bonds are great places to park money with a very low risk tolerance."
	},
	max401k : {
		title: "Max your 401(K)",
		brief: "The tax advantage from investing in a 401(K) account is a major accelerator for retirement savings. Contributing the maximum amount of money allowed by the IRS is a great way to get the most out of your money."
	},
	megabackdoor : {
		title: "The \"Mega Backdoor\"",
		brief: "If you've maxed your 401(K) and are looking to invest even more money, the \"Mega backdoor\" Roth IRA might be what you're looking for. It's only available with some employers - you'll need to be able to make after-tax 401(K) contributions and roll them over to a Roth IRA. If your retirement plan offers that, you can contribute up to $58k in 2021 to your 401(K), which includes the $19.5k contribution limit and your employer match. Anything left in the $58k limit can be contributed using the \"Mega backdoor\" method for even more tax-advantaged savings."
	},
	esa : {
		title: "Saving for education",
		brief: "If you want to pay for college, trade school, private K-12 school, apprenticeships, or student loans, whether for yourself or someone else, you should consider using a 529 plan Education Savings Account (ESA). Growth in an ESA isn't taxed if it's withdrawn for eligible education expenses. This makes it a great way to save for future education expenses."
	},
	
}
class ResultsCardBuilder{
	constructor(resultKey, resultsObj){
		this.parentelement = document.getElementById("results");
		let card = this.CreateCard();
		if(resultsObj.hasOwnProperty(resultKey)){
			let result = resultsObj[resultKey];
			card.append(this.Title(result["title"]));
			card.append(this.Brief(result["brief"]));
			if(result.hasOwnProperty("learnmore")){
				card.append(this.Action(result["learnmore"]));
			}
		}
	}
	CreateCard(){
		let card = document.createElement("section");
		card.classList.add("card");
		return this.parentelement.appendChild(card);
	}
	Title(title){
		let titleElement = document.createElement("h2");
		titleElement.classList.add("card__title");
		titleElement.innerHTML = title;
		return titleElement;
	}
	Brief(brief){
		let briefElement = document.createElement("p");
		briefElement.classList.add("card__text");
		briefElement.innerHTML = brief;
		return briefElement;
	}
	Action(action){
		let actionElement = document.createElement("a");
		actionElement.classList.add("card__action");
		actionElement.classList.add("button");
		actionElement.innerHTML = "Learn more";
		actionElement.href = action;
		return actionElement;
	}
}

class Results{
	constructor(){
		let searchParams = new URLSearchParams(window.location.search);
		for(const result of searchParams.getAll("kudos")){
			new ResultsCardBuilder(result, kudos);
		}
		for(const result of searchParams.getAll("recommendations")){
			new ResultsCardBuilder(result, recommendations);
		}
	}
}



let _app = new Results();