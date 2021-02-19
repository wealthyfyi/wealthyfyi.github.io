class FinancialHealthFeedback {
	constructor() {
		this.mkudos = [];
		this.mrecommendations = [];
	}

	/* Parameter:
	Object {"key" : value, "weight": value}
	*/
	set kudos(kudo) {
		this.mkudos.push(kudo);
	}
	/* Parameter:
	Object {"key" : value, "weight": value}
	*/
	set recommendations(rec) {
		this.mrecommendations.push(rec);
	}
	get kudos() {
		return this.mkudos;
	}
	get recommendations() {
		return this.mrecommendations;
	}
}

class FormQuestion{
	constructor(formId, question){
		this.inputType = question["type"];
		this.formElement = document.getElementById(formId);
		this.inputElements = [];
		this.preprocessQuestion(this.inputType, question);
		if("radio" == this.inputType){
			this.buildRadioQuestion(question["answers"]);
		} else if("text" == this.inputType){
			this.buildTextQuestion(question["answers"]);
		} else if("checkbox" == this.inputType){
			this.buildCheckboxQuestion(question["answers"]);
		}else if("number" == this.inputType){
			this.buildNumberQuestion(question["answers"]);
		}else{
			console.log("Unknown question type. Try \"radio\", \"text\", or \"checkbox\".");
		}
		for(let element of this.inputElements){
			element.addEventListener('input', ()=>{this.onInputHandler()});
		}
	}

	preprocessQuestion(inputType, question){
		const name = question["name"];
		this.addQuestion(question["question"]);
		question["answers"].forEach((answer, index) =>{
			if(!answer.hasOwnProperty("input-attributes")){
				answer["input-attributes"] = {};
			}
			if(!answer.hasOwnProperty("label-attributes")){
				answer["label-attributes"] = {};
			}
			if("radio" == inputType) {
				answer["input-attributes"]["name"] = name;
			} else{
				answer["input-attributes"]["name"] = name + "-" + index.toString();
			}
			answer["input-attributes"]["class"] = "form__" + inputType + "-input";
			answer["input-attributes"]["id"] = name + "-" + index.toString();

			answer["label-attributes"]["class"] = "form__" + inputType + "-label";
			answer["label-attributes"]["for"] = answer["input-attributes"]["id"];
		});
	}
	setAttributes(answerElements, answer){
		if(answer.hasOwnProperty("input-attributes")){
			for(const attribute in answer["input-attributes"]){
				answerElements["input"].setAttribute(attribute, answer["input-attributes"][attribute]);
			}
		} if(answer.hasOwnProperty("label-attributes")){
			for(const attribute in answer["label-attributes"]){
				answerElements["label"].setAttribute(attribute, answer["label-attributes"][attribute]);
			}
		}
		answerElements["label"].innerHTML = answer["label"];
	}
	addQuestion(question){
		let questionElement = document.createElement("h1");
		questionElement.innerHTML = question;
		questionElement.classList.add("form__header");
		this.formElement.appendChild(questionElement);
	}
	buildRadioQuestion(answers){
		let parentElement = document.createElement("fieldset");
		parentElement.className = "form__radio-group";
		let legend = document.createElement("legend");
		legend.className = "form__radio-legend";
		legend.innerHTML = "Select the most accurate answer for your situation.";
		parentElement.appendChild(legend);
		answers.forEach((answer) =>{
			let answerElements = this.addFormInputElement(parentElement, "radio");
			this.setAttributes(answerElements, answer);
		});
		this.formElement.appendChild(parentElement);
	}

																	// this might require each answer having an optional "attribute" blob so we can add a placeholder.
	buildTextQuestion(answers){
		answers.forEach( (answer)=>{
			// each text input element needs a container with position:relative
			// so the label can be aligned with position:absolute relative to the container.
			let parentElement = document.createElement("div");
			parentElement.className = "form__text";
			let answerElements = this.addFormInputElement(parentElement, "text");
			// We set a whitespace placeholder so the :placeholder-shown selector still works
			// when no placeholder was specified in the label-attributes blob
			answerElements["input"].setAttribute("placeholder", " ");
			this.setAttributes(answerElements, answer);
			this.formElement.appendChild(parentElement);
		});
	}
	buildNumberQuestion(answers){
		answers.forEach( (answer)=>{
			// each text input element needs a container with position:relative
			// so the label can be aligned with position:absolute relative to the container.
			let parentElement = document.createElement("div");
			parentElement.className = "form__text";
			let answerElements = this.addFormInputElement(parentElement, "number");
			// We set a whitespace placeholder so the :placeholder-shown selector still works
			// when no placeholder was specified in the label-attributes blob
			answerElements["input"].setAttribute("placeholder", " ");
			this.setAttributes(answerElements, answer);
			this.formElement.appendChild(parentElement);
		});
	}
	buildCheckboxQuestion(answers){

		answers.forEach((answer) =>{
			let answerElements = this.addFormInputElement(this.formElement, "checkbox");
			this.setAttributes(answerElements, answer);
		});
	}
	onInputHandler(){
		for(let element of this.inputElements){
			if(element.value || element.checked){
				document.getElementById("question__next-button").disabled = false;
				return;
			}
		}
		document.getElementById("question__next-button").disabled = true;
	}
	addFormInputElement(parentElement, inputType){
		let result = {};
		result["input"] = parentElement.appendChild(document.createElement("input"));
		result["input"].setAttribute("type", inputType);
		result["label"] = parentElement.appendChild(document.createElement("label"));
		this.inputElements.push(result["input"]);
		return result;
	}
}




class Question extends FormQuestion{
	constructor(formId, question, completionCallback){
		super(formId, question);
		this.onCompletion = completionCallback;
		this.question = question["question"];
		this.name = question["name"];
		this.answers = question["answers"];
		this.formElement.onsubmit = (e) =>{e.preventDefault();};
		// Add the "next" button at the bottom right corner of the form
		let nextButton = document.createElement("button");
		nextButton.classList.add("button");
		nextButton.setAttribute("type", "submit");
		nextButton.id = "question__next-button";
		nextButton.disabled = true;
		nextButton.innerHTML = "Continue &rarr;";
		nextButton.setAttribute("style", "margin: 20px 20px 20px auto;");
		let nextButtonContainer = document.createElement("div");
		nextButtonContainer.style.display = "flex";
		nextButtonContainer.style.justifyContent = "flex-end";
		this.nextButton = nextButtonContainer.appendChild(nextButton);
		this.formElement.appendChild(nextButtonContainer);
		this.nextButton.onclick = ()=>this.onNextPressed();
	}

	onNextPressed(){
		// Run form validation
		for(const element of document.getElementsByTagName("input")){
			if(element.type == "radio"){
				const props = Array.from(document.getElementsByName(element.name)
				// reduce the 2 boolean values we want into the 1 and 2 bit of the sum
					,(elem)=>{return elem.required + 2*elem.checked;}
				)
				// If any of the radios are required, the 1 bit will be set.
				// If any of the radios are checked, the 2 bit will be set.
				.reduce((sum,current)=>{ return sum |= current;});
				const isRequired = !!(props & 1);
				const isChecked = !!(props & 2);
				if(isRequired & !isChecked){
					return;
				} 
			}else{
			}
		}

		// Pull answers from this question
		let answerelements = Array.from(document.getElementsByClassName("form__" + this.inputType + "-input"));
		let sendAnalyticsEvent = (name, answer) => { 
			gtag('event', 'FinancialCheckupQA' ,{
			'QuestionID' : name,
			'Question' : this.question,
			'Answer' : answer
			});
		};
		//add the current answers to the URLSearchParams
		// We use the history API for this so that:
		// 1. The back button works to take the user back by 1 question
		// 2. The page doesn't refresh.
		let searchParams = new URLSearchParams(window.location.search);
		if("text" == this.inputType || "number" == this.inputType){
			answerelements.forEach((element) =>{
				searchParams.set(element.getAttribute("name"), element.value);
				sendAnalyticsEvent(element.getAttribute("name"),element.value);
			});
			} else if ("radio" == this.inputType){
				answerelements.forEach((element) =>{
					if(element.checked){
						searchParams.set(element.getAttribute("name"), element.id);
						sendAnalyticsEvent(element.getAttribute("name"),document.querySelector(`label[for='${element.id}']`).innerHTML);
					}
				});
			}else if("checkbox" == this.inputType){
				answerelements.forEach((element) =>{
					if(element.checked){
						searchParams.set(element.getAttribute("name"), "checked");
						sendAnalyticsEvent(element.getAttribute("name"),document.querySelector(`label[for='${element.id}']`).innerHTML);
					} else{
						searchParams.delete(element.getAttribute("name"));
					}
				});
			}else{
				alert("Input type not recognized.");
			}
		history.pushState(null,'',window.location.pathname + '?' + searchParams.toString());

		// Spawn the next question
		this.onCompletion();

	}
	hasAnswerProperty(answerElement, property){
		if( (	"checkbox" == this.inputType
				||"radio" == this.inputType)
				&& answerElement.checked){
			let answerindex = parseInt(String(answerElement.id).split('-').pop());
			if(this.answers.length <= answerindex){
				return false;
			}
			if(this.answers[answerindex].hasOwnProperty(property)){
				return true;
			}
		}
		//@@TODO: handle text questions
		// ...
		return false;
	}
	getAnswerProperty(answerElement, property){
		if(this.hasAnswerProperty(answerElement, property)){
			let answerindex = parseInt(String(answerElement.id).split('-').pop());
			return this.answers[answerindex][property];
		}
		else{
			return null;
		}
	}

}

class FinancialCheckup{
	constructor(formId, questions){
		this.formId = formId;
		this.formElement = document.getElementById(this.formId);
		this.questions = questions;
		this.nextQ = 1;
		this.results = new FinancialHealthFeedback();
		this.nextquestion(this.nextQ);
	}

	formtransitionout(){
		// Remove the form elements from this question
		this.formTransitions = this.formElement.style.transition;
		if(this.formTransitions.length){
			this.formElement.style.transition += ",opacity .3s";
		} else{
			this.formElement.style.transition = "opacity .3s";
		}
		this.formElement.style.opacity = 0;
		for(let child of this.formElement.children){
			child.classList.add("expirednode");
		}
		setTimeout(() =>{
			while(document.getElementsByClassName("expirednode").length){
				this.formElement.removeChild(document.getElementsByClassName("expirednode")[0]);
			}
		}, 300);

	}
	formtransitionin(){
		// make the next question appear
		setTimeout(()=>{
			this.formElement.style.opacity = 1;
		}, 500);
		setTimeout(() => {
			this.formElement.style.transition = this.formTransitions;
		}, 800);
	}

	// Return value is the next question ID. NaN -> exit to results page.
	handleSalary(){
		let incomeElement = document.getElementById("magi-0");
		if(null == incomeElement){
			console.log("Failed to find the salary input element.");
			return;
		}
		// load info on whether or not the user maxed their IRA
		// That info helps provide recommendations based on income
		let searchParams = new URLSearchParams(window.location.search);
		let maxedTraditionalIRA = false;
		let maxedRothIRA = false;
		if(!searchParams.has("iramax")){
			console.error("Invalid financial health checkup flow - got to income question without first answering about IRA.");
		}
		const iraAnswer = searchParams.get("iramax");
		switch(iraAnswer){
			case "iramax-0":
				maxedTraditionalIRA = true;
				break;
			case "iramax-1":
				maxedRothIRA = true;
				break;
			default:
				break;
		}

		const income = parseFloat(incomeElement.value);
		// @@TODO: Check if the user's tax filing status is single or married.
		if(false && "married" == filingStatus){
			if(193000 < income){
				if(maxedTraditionalIRA){
					this.results.recommendations = "rolloverira";
					return 14;
				} else if(!maxedRothIRA){
					this.results.recommendations = "backdoorroth";
					return NaN;
				}
			}
		}
		else{ // user is filing as single
			if(122000 < income){
				if(maxedTraditionalIRA){
					this.results.recommendations = "rolloverira";
					return 14;
				} else if(!maxedRothIRA){
					this.results.recommendations = "backdoorroth";
					return NaN;
				}
			}else if(64000 < income){
				if(!maxedTraditionalIRA && !maxedRothIRA){
					this.results.recommendations = "maxrothira";
					return NaN;
				}
			}
		}
	}

	// Return value is the next question ID. NaN -> exit to results page.
	handleJobStability(){
		// load info on whether or not the user has stable job prospects
		// That info helps provide recommendations based on income
		let searchParams = new URLSearchParams(window.location.search);
		if(!searchParams.has("jobprospects")){
			console.error("No answer about job prospects was found.");
		}
		
		let stableJob = false;
		switch(searchParams.get("jobprospects")){
			case "jobprospects-0":
				stableJob = true;
				break;
			case "jobprospects-1":
				stableJob = false;
				break;
			default:
				break;
		}
		let emergencyFundMonths = 0;
		switch(searchParams.get("emergencyfund")){
			case "emergencyfund-0":
				emergencyFundMonths = 0;
				break;
			case "emergencyfund-1":
				emergencyFundMonths = 1;
				break;
			case "emergencyfund-2":
				emergencyFundMonths = 3;
				break;
			case "emergencyfund-3":
				emergencyFundMonths = 6;
				break;
			case "emergencyfund-4":
				emergencyFundMonths = 12;
				break;
		}
		let hasModerateInterestDebt = searchParams.has("debttypes-1");

		if(stableJob){
			if(3 > emergencyFundMonths){
				this.results.recommendations = "increaseefund";
				return NaN;
			}else if(3 <= emergencyFundMonths){
				this.results.kudos = "efundkudo1";
				if(hasModerateInterestDebt){
					this.results.recommendations = "reduceinterestrate";
					this.results.recommendations = "avalancheMethod";
					return NaN;
				}else{
					return 9;
				}
			}
		}else{ // unstable job
			if(6 > emergencyFundMonths){
				this.results.recommendations = "increaseefund";
				return NaN;
			} else if(hasModerateInterestDebt){
				this.results.recommendations = "reduceinterestrate";
				this.results.recommendations = "avalancheMethod";
				if(12 < emergencyFundMonths){
					this.results.kudos = "efundkudo1";
				}
				return NaN;
			}else if(12 > emergencyFundMonths){
				this.results.recommendations = "increaseefund";
				return 9;
			} else { // efund is 1 year or more, no moderate interest debt
				this.results.kudos = "efundkudo1";
				return 9;
			}
		}
	}
	// Return value is the next question ID. NaN -> exit to results page.
	handleLargePurchases(){
		let searchParams = new URLSearchParams(window.location.search);
		if(!searchParams.has("employermatch")){
			console.error("Question about employer-sponsored retirement account was missed.");
		}

	}
	onquestioncomplete(){
		// Pull the answers from the question
		let answerelements = Array.from(document.getElementsByClassName("form__" + this.questions[this.questionIndex]["type"] + "-input"));

		// determine the next question ID
		let workingNextQ = this.nextQ + 1;
		for(const answer of answerelements) {
			if(isNaN(workingNextQ)){
				break;
			}
			if(answer.checked && this.currentQuestion.hasAnswerProperty(answer, "nextQ")){
				let answerNextQ = this.currentQuestion.getAnswerProperty(answer,"nextQ");
				if(isNaN(answerNextQ) || answerNextQ > workingNextQ){
					workingNextQ = answerNextQ;
				}
			}
		};
		// Handle any special logic for the current question

		switch(this.nextQ){
			case 8:
				workingNextQ = this.handleJobStability();
				break;
			case 12:
				workingNextQ = this.handleSalary();
				break;
				//@@TODO: check if they have access to an employer sponsored retirement account.
				/*
			case 15:
				workingNextQ = this.handleLargePurchases();
				break;
				*/
		}

		// add any kudos and recommendations to the results
		answerelements.forEach( (answer) => {
			if(answer.checked){
				const recs = this.currentQuestion.getAnswerProperty(answer, "recommendation");
				if(null != recs) {
					for(const rec of recs){
						this.results.recommendations = rec;
					}
				}
				const kudos = this.currentQuestion.getAnswerProperty(answer, "kudos");
				if(null != kudos){
					for(const kudo of kudos){
						this.results.kudos = kudo;
					}
				}
			}
		});

		// Clear the completed question from the form
		this.formtransitionout();

		// Setup the next question
		setTimeout(()=>{this.nextquestion(workingNextQ);},300);

		this.formtransitionin();
	}

	// null = increment question by 1
	// NaN = exit survey
	// any other number = question id
	nextquestion(next){
		if(null == next){
			this.nextQ += 1;
		}else if(!isNaN(next)){
			this.nextQ = next;
		} else{ // NaN
			// Exit the survey and show results
			
			let searchParams = new URLSearchParams({});
			
			for(const kudo of this.results.kudos){
				searchParams.append("kudos",kudo);
			}
			for(const rec of this.results.recommendations){
				searchParams.append("recommendations",rec);
			}
			window.location.assign('results.html?' + searchParams.toString());
			return;
		}
		this.questionIndex = this.nextQ - 1;
		this.currentQuestion = new Question(this.formId, this.questions[this.questionIndex], this.onquestioncomplete.bind(this));
	}
}

const questions = [
	{
		"id" : 1,
		"question" : "What is your current employment situation?",
		"type" : "radio",
		"name":"employment",
		"answers" : [
			{
				"label" : "Not earning income",
				"nextQ" : NaN,
				"recommendation" : ["unsupported"],
				"input-attributes" : {"required":true}
			},
			{
				"label" : "Part-time employment"
			},
			{
				"label" : "Full-time employment"
			},
			{
				"label" : "Self-employed with income"
			}
		]
	},
	{
		"id" : 2,
		"question" : "How does your monthly spending compare to your income?",
		"type" : "radio",
		"name":"budget",
		"answers" : [
			{
				"label" : "I spend more than I make",
				"recommendation" : ["spendless"],
				"nextQ" : NaN,
				"input-attributes" : {"required":true}
			},
			{
				"label" : "I spend as much as I make",
				"nextQ" : 4,
				"recommendation": ["spendless"]
			},
			{
				"label" : "I spend less than I make",
				"nextQ" : 4,
				"kudos": ["budget1"]
			}
		]
	},
	{
		"id" : 3,
		"question" : "Do you have enough income to cover essential expenses (e.g., rent, groceries, utilities, healthcare, etc.) each month?",
		"type" : "radio",
		"name" : "essential-expenses",
		"answers":[
			{
				"label": "Yes",
				"input-attributes" : {"required":true}
			},
			{
				"label": "No",
				"nextQ" : NaN
			}
		]
	},
	{
		"id" : 4,
		"question" : "How many months of expenses can you pay for with the money in your checkings & savings accounts?",
		"type" : "radio",
		"name" : "emergencyfund",
		"answers" : [
			{
				"label" : "Less than a month",
				"nextQ" : NaN,
				"recommendation" : ["efund1"],
				"input-attributes" : {"required":true}
			},
			{
				"label" : "1-2 months"
			},
			{
				"label" : "3-6 months"
			},
			{
				"label" : "6-11 months",
				"kudos" : ["efundkudo1"]
			},
			{
				"label" : "More than 12 months",
				"kudos" : ["efundkudo1"]
			}
		]
	},
	{
		"id" : 5,
		"question" : "Does your employer offer a retirement account with an employer match?",
		"type" : "radio",
		"name" : "employermatch",
		"answers": [
			{
				"label" : "Yes",
				"input-attributes" : {"required":true}
			},
			{
				"label" : "No",
				"nextQ" : 7
			}
		]
	},
	{
		"id" : 6,
		"question" : "Have you contributed enough to your employer-sponsored retirement account to get the full employer match?",
		"type" : "radio",
		"name" : "employermatch",
		"answers": [
			{
				"label" : "Yes",
				"kudos" : ["employermatchkudo1"],
				"input-attributes" : {"required":true}
			},
			{
				"label" : "No",
				"nextQ" : NaN,
				"recommendation" : ["employermatch1"]
			}
		]
	},
	{
		"id" : 7,
		"question" : "What types of debt do you have?",
		"type" : "checkbox",
		"name" : "debttypes",
		"answers": [
			{
				"label" : "High-interest debt e.g., credit card debt",
				"nextQ" : NaN,
				"recommendation" : ["highinterest1"],
				"input-attributes" : {"required":true}
			},
			{
				"label" : "Moderate-interest debt, e.g., private student loans, personal line of credit"
			},
			{
				"label" : "Low-interest debt, e.g., mortgage, federal student loans"
			},
			{
				"label" : "None",
				"kudos" : ["debtfreekudo1"]
			}
		]
	},
	{
		"id" : 8,
		"question" : "Do you expect to be employed full time for the next year?",
		"type" : "radio",
		"name" : "jobprospects",
		"answers": [
			{
				"label" : "Yes",
				"input-attributes" : {"required":true}
			},
			{
				"label" : "No"
			}
		]
	},
	{
		"id" : 9,
		"question" : "Do you have an HSA-qualified high-deductible health plan and are eligible for an HSA?",
		"type" : "radio",
		"name" : "hsaeligible",
		"answers": [
			{
				"label" : "Yes",
				"input-attributes" : {"required":true}
			},
			{
				"label" : "No",
				"nextQ" : 11
			}
		]
	},
	{
		"id" : 10,
		"question" : "Have you maxed out your HSA?",
		"type" : "radio",
		"name" : "hsamax",
		"answers": [
			{
				"label" : "Yes",
				"kudos" : ["hsamaxkudo1"],
				"recommendation" : ["hsafees1"],
				"input-attributes" : {"required":true}
			},
			{
				"label" : "No",
				"nextQ" : NaN,
				"recommendation" : ["hsamax1", "hsafees1"]
			}
		]
	},
	{
		"id" : 11,
		"question" : "Have you maxed out your IRA this year?",
		"type" : "radio",
		"name" : "iramax",
		"answers": [
			{
				"label" : "Yes, my Traditional IRA",
				"input-attributes" : {"required":true}
			},
			{
				"label" : "Yes, my Roth IRA",
				"nextQ" : 14
			},
			{
				"label" : "No"
			}
		]
	},
	{
		"id" : 12,
		"question" : "What is your current annual income?",
		"type" : "number",
		"name" : "magi",
		"answers": [
			{
				"label" : "Annual income (include salary, stocks, and bonuses)"
			}
		]
	},
	{
		"id" : 13,
		"question" : "Do you expect your future income to be greater than the IRA threshold?",
		"type" : "radio",
		"name" : "futureincome",
		"answers": [
			{
				"label" : "Yes",
				"nextQ" : NaN,
				"recommendation" : ["evaluateiratype", "maxira"]
			},
			{
				"label" : "No",
				"nextQ" : NaN,
				"recommendation" : ["maxtraditionalira"]
			}
		]
	},
	{
		"id" : 14,
		"question" : "Does your employer offer an employee stock purchase plan (ESPP)?",
		"type" : "radio",
		"name" : "espp",
		"answers": [
			{
				"label" : "Yes",
				"recommendation" : ["evaluateespp"]
			},
			{
				"label" : "No"
			}
		]
	},
	{
		"id" : 15,
		"question" : "Are you expecting any large, required purchases or personal investments (e.g., college) in the next 3-5 years?",
		"type" : "radio",
		"name" : "othergoals",
		"answers": [
			{
				"label" : "Yes",
				"nextQ" : NaN,
				"recommendation" : ["othergoalsavings"]
			},
			{
				"label" : "No",
				"recommendation" : ["max401k"]
			}
		]
	},
	{
		"id" : 16,
		"question" : "Does your 401K provide an after-tax 401K with immediate rollover to a Roth account?",
		"type" : "radio",
		"name" : "megabackdoor",
		"answers": [
			{
				"label" : "Yes",
				"nextQ" : NaN,
				"recommendation" : ["megabackdoor"]
			},
			{
				"label" : "No"
			}
		]
	},
	{
		"id" : 17,
		"question" : "Do you plan to have children and also want to contribute to their college expenses?",
		"type" : "radio",
		"name" : "children",
		"answers": [
			{
				"label" : "Yes",
				"nextQ" : NaN,
				"recommendation" : ["esa"]
			},
			{
				"label" : "No"
			}
		]
	},
	{
		"id" : 18,
		"question" : "Do you have a mortgage?",
		"type" : "radio",
		"name" : "children",
		"answers": [
			{
				"label" : "Yes",
				"nextQ" : NaN,
				"recommendation" : ["mortgagepayments"]
			},
			{
				"label" : "No",
				"nextQ" : NaN,
				"recommendation" : ["taxablebrokerage", "taxharvesting", "lowinterestdebts", "donoradvisedfunds", "rebalanceportfolio"]
			}
		]
	}
]


let app = new FinancialCheckup("checkup__form--container", questions);
