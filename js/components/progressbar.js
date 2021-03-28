const template = document.createElement('template');

template.innerHTML = `
<style>
:host{
	height: 100%;
	width: 100%;
}
div{
	--progress-bar__width: 0%;

	background: var(--color__primary--50, #E6E6FF);
	width: 100%;
	height: 100%;
	border-radius: 5rem;
	overflow: hidden;
	position: relative;
}
div::after{
	content: "";
	position: absolute;
	height: 100%;
	width: var(--progress-bar__width);
	background: var(--color__primary--500, #5D55FA);
	transition: width .3s ease-out;
}
</style>
<div></div>
`;

class ProgressBar extends HTMLElement{
	static get observedAttributes(){
		return ['progress'];
	}
	constructor(){
		super();
		this.attachShadow({mode: 'open'});
		this.shadowRoot.appendChild(template.content.cloneNode(true));

	}

	connectedCallback(){
		if(!this.hasAttribute('progress')){
			this.setAttribute('progress', '0%');
		}
		else{
			this._upgradeProperty('progress');
		}
	}
	attributeChangedCallback(attribute, oldValue, newValue){
		const hasValue = newValue !== null;
		switch(attribute){
			case 'progress':
				this.shadowRoot.querySelector('div').style.setProperty('--progress-bar__width', this._validateProgressValue(newValue));
		}
	}
	_validateProgressValue(value){
		if(typeof value === 'string' || value instanceof String){
			value = Number.parseFloat(value);
		}
		if(Number.isNaN(value)){
			return '0%';
		}
		if(value < 0)
			value = 0;
		if(value > 100)
			value = 100;
		return `${value}%`;
	}
	set progress(value){
		value = this._validateProgressValue(value);
		this.setAttribute('progress', value);
	}
	get progress(){
		return this.getAttribute('progress');
	}

	// Use this to invoke setters for any properties that were set
	// Prior to the prototype being connected to this class.
	_upgradeProperty(prop){
		if(this.hasOwnProperty(prop)){
			let value = this[prop];
			delete this[prop];
			this[prop] = value;
		}
	}
}

window.customElements.define('progress-bar', ProgressBar);