import { DOM_ELEMENTS, DOM_FORMS } from './dom-collection';
import { Storage } from './class-storage';

class UI {
	// ---- MODAL LOGIC ----

	// On click
	showModalOnClick(element: Element, overlay: Element, modal: Element) {
		element.addEventListener('click', () => {
			overlay.classList.add('visible');
			modal.classList.add('active');
		});
	}

	hideModalOnClick(overlays: Array<Element>, modals: Array<Element>) {
		overlays.forEach((overlay: Element) => {
			overlay.addEventListener('click', (e) => {
				if (e.target !== e.currentTarget) return;
				overlay.classList.remove('visible');
				modals.forEach((modal: Element) => {
					modal.classList.remove('active', 'visible');
				});
			});
		});
	}

	// Default
	showModalDefault(overlay: Element, modal: Element) {
		overlay.classList.add('visible');
		modal.classList.add('active');
	}

	hideModalDefault(overlay: Element, modal: Element) {
		overlay.classList.remove('visible');
		modal.classList.remove('active', 'visible');
	}

	// Reset
	resetModal(overlay: Element, modal: Element, form: HTMLFormElement) {
		if (overlay === undefined) {
			modal.classList.remove('active', 'visible');
			form.reset();
		} else {
			overlay.classList.remove('visible');
			modal.classList.remove('active', 'visible');
			form.reset();
		}
	}

	// Toggle password
	passwordToggle(form: HTMLFormElement) {
		const { password: input } = form;
		const icon = input.nextElementSibling.firstChild;
		if (input.type === 'password') {
			input.setAttribute('type', 'text');
			icon.classList.remove('fa-eye');
			icon.classList.add('fa-eye-slash');
		} else {
			input.setAttribute('type', 'password');
			icon.classList.remove('fa-eye-slash');
			icon.classList.add('fa-eye');
		}
	}

	// Validate inputs
	validateInputs(e: Event, input: HTMLInputElement, behaviour?: string) {
		const { length } = (e.target as HTMLInputElement).value;

		switch (behaviour) {
			case 'focus':
				if (!length) {
					input.classList.add('invalid');
				}
				break;

			case 'blur':
				input.classList.remove('invalid');
				break;

			default:
				if (!length) {
					input.classList.add('invalid');
				} else {
					input.classList.remove('invalid');
				}
				break;
		}
	}

	// ---- LOADER LOGIC ----

	loaderToggle(id: string) {
		const loader = document.getElementById(id);
		loader.classList.toggle('active');
	}

	// ---- USER-NAV LOGIC ----

	userDropdownToggle() {
		DOM_ELEMENTS.userNavButton.classList.toggle('active');
		DOM_ELEMENTS.userNavDropdown.classList.toggle('active');
	}

	userDropdownHide() {
		DOM_ELEMENTS.userNavButton.classList.remove('active');
		DOM_ELEMENTS.userNavDropdown.classList.remove('active');
	}

	// ---- USER LOGIC ----

	userSignInSetupUI() {
		DOM_ELEMENTS.userNav.classList.add('active');
		DOM_ELEMENTS.authBlock.classList.remove('active');
		this.displayUserInfo();
	}

	userSignOutSetupUI() {
		DOM_ELEMENTS.userNav.classList.remove('active');
		DOM_ELEMENTS.authBlock.classList.add('active');
		DOM_ELEMENTS.heroBlockFirst.classList.remove('shrink', 'active');
		setTimeout(() => DOM_ELEMENTS.heroBlockSecond.classList.remove('front'), 200);
		this.removeUserInfo();
	}

	signOutUser() {
		Storage.removeItem('user');
		this.userSignOutSetupUI();
	}

	displayUserInfo(page?: string) {
		const {
			firstname,
			lastname,
			email,
		} = DOM_FORMS.formBooking !== null ? DOM_FORMS.formBooking : { firstname: '', lastname: '', email: '' };
		const {
			displayName: name,
			photoURL: picture,
			email: userEmail,
		} = Storage.getUser();
		const firstName: string = name.split(' ', 1).toString();
		const lastName: string = name.split(' ').pop().toString();
		const getLetter: string = firstName.charAt(0).toUpperCase();
		const displayPicture = () => {
			if (picture === null) {
				DOM_ELEMENTS.userletter.innerText = getLetter;
			} else {
				(DOM_ELEMENTS.userPicture as HTMLImageElement).src = picture;
			}
		};

		switch (page) {
			case 'profile':
				DOM_ELEMENTS.userName.innerText = name;
				DOM_ELEMENTS.userEmail.innerText = userEmail;
				displayPicture();
				break;

			default:
				DOM_ELEMENTS.userName.innerText = firstName;
				displayPicture();
				DOM_FORMS.formBooking.querySelectorAll('input')
					.forEach((input) => input.classList.remove('invalid'));
				firstname.value = firstName;
				lastname.value = lastName;
				email.value = userEmail;
				break;
		}
	}

	removeUserInfo() {
		DOM_ELEMENTS.userName.innerText = '';
		DOM_ELEMENTS.userletter.innerText = '';
		DOM_ELEMENTS.userPicture.removeAttribute('src');
		DOM_FORMS.formBooking.reset();
	}

	// ---- PRODUCTS ----
	// Page transition

	pageTransition(element: HTMLElement, action: string, className: string = 'active') {
		switch (action) {
			case 'add':
				element.classList.add(className);
				break;

			case 'remove':
				element.classList.remove(className);
				break;

			default:
				break;
		}
	}

	displayTooltip(selector: string, action: string) {
		const tooltips = document.querySelectorAll(selector);
		tooltips.forEach((tooltip) => {
			switch (action) {
				case 'disable':
					tooltip.classList.add('tooltip-disabled');
					tooltip.classList.remove('tooltip');
					break;

				case 'enable':
					tooltip.classList.remove('tooltip-disabled');
					tooltip.classList.add('tooltip');
					break;

				default:
					break;
			}
		});
	}

	// ---- GALLERY ----
	// Categories navigation

	optionActive(event: Event, options: NodeListOf<Element>, className: string = 'active') {
		options.forEach((option) => {
			option.classList.remove(className);
		});
		(event.target as HTMLElement).classList.add(className);
	}

	// ---- PROFILE ----

	pageActive(hash: string, listOfLinks: string, listOfPages: string) {
		const links = document.querySelectorAll(listOfLinks);
		const pages = document.querySelectorAll(listOfPages);
		links.forEach((link) => {
			link.classList.remove('active');
			if (link.getAttribute('href') === hash) {
				link.classList.add('active');
			}
		});
		pages.forEach((page) => {
			page.classList.remove('active');
			if (page.getAttribute('data-page') === hash) {
				page.classList.add('active');
			}
		});
	}
}

export const ui = new UI();
