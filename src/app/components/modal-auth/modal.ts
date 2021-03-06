import { DOM_ELEMENTS, DOM_FORMS } from '../../../ts/dom-collection';
import { googleAuthProvider } from '../../../js/firebase.cofig';
import { ui } from '../../../ts/class-ui';
import {
	signUp,
	signInWithEmailAndPass,
	signInWithGoogle,
	passwordReset,
} from '../../../ts/authentication';

export const modal = (): void => {
	// ---- Default ----

	ui.hideModalOnClick(
		[
			DOM_ELEMENTS.overlaySignIn,
			DOM_ELEMENTS.overlaySignUp,
		],
		[
			DOM_ELEMENTS.modalSignIn,
			DOM_ELEMENTS.modalSignUp,
			DOM_ELEMENTS.modalResetPass,
		],
	);

	// ---- SIGN-UP ----

	DOM_FORMS.formSignUp.addEventListener('submit', (e) => {
		e.preventDefault();
		const {
			firstname,
			lastname,
			email,
			password,
		} = e.currentTarget as HTMLFormElement;

		signUp(
			{
				firstname: firstname.value,
				lastname: lastname.value,
				email: email.value,
				password: password.value,
			},
			{
				overlay: DOM_ELEMENTS.overlaySignUp,
				modal: DOM_ELEMENTS.modalSignUp,
				form: DOM_FORMS.formSignUp,
			},
		);
	});

	DOM_ELEMENTS.modalSignUp.addEventListener('click', (e) => {
		const { action } = (e.target as HTMLElement).dataset;
		switch (action) {
			case 'password':
				e.preventDefault();
				ui.passwordToggle(DOM_FORMS.formSignUp);
				break;

			case 'close':
				ui.hideModalDefault(
					DOM_ELEMENTS.overlaySignUp,
					(e.currentTarget as HTMLElement),
				);
				break;

			default:
				break;
		}
	});

	// ---- SIGN-IN ----

	DOM_FORMS.formSignIn.addEventListener('submit', (e) => {
		e.preventDefault();
		const {
			email,
			password,
		} = e.currentTarget as HTMLFormElement;

		signInWithEmailAndPass(
			{
				email: email.value,
				password: password.value,
			},
			{
				overlay: DOM_ELEMENTS.overlaySignIn,
				modal: DOM_ELEMENTS.modalSignIn,
				form: DOM_FORMS.formSignIn,
			},
		);
	});

	DOM_ELEMENTS.modalSignIn.addEventListener('click', (e) => {
		const { action } = (e.target as HTMLElement).dataset;
		switch (action) {
			case 'google':
				signInWithGoogle(
					googleAuthProvider,
					{
						overlay: DOM_ELEMENTS.overlaySignIn,
						modal: DOM_ELEMENTS.modalSignIn,
						form: DOM_FORMS.formSignIn,
					},
				);
				break;

			case 'reset':
				DOM_ELEMENTS.modalResetPass.classList.add('visible');
				break;

			case 'signup':
				ui.hideModalDefault(
					DOM_ELEMENTS.overlaySignIn,
					DOM_ELEMENTS.modalSignIn,
				);
				ui.showModalDefault(
					DOM_ELEMENTS.overlaySignUp,
					DOM_ELEMENTS.modalSignUp,
				);
				break;

			case 'password':
				e.preventDefault();
				ui.passwordToggle(DOM_FORMS.formSignIn);
				break;

			case 'close':
				ui.hideModalDefault(
					DOM_ELEMENTS.overlaySignIn,
					(e.currentTarget as HTMLElement),
				);
				break;

			default:
				break;
		}
	});

	// ---- RESET PASSWORD ----

	DOM_ELEMENTS.modalResetPass.addEventListener('click', (e) => {
		const { action } = (e.target as HTMLElement).dataset;
		if (action === 'close') {
			ui.hideModalDefault(
				DOM_ELEMENTS.overlaySignIn,
				DOM_ELEMENTS.modalResetPass,
			);
		}
	});

	DOM_FORMS.formResetPass.addEventListener('submit', (e) => {
		e.preventDefault();
		const { email } = e.currentTarget as HTMLFormElement;

		passwordReset(
			email.value,
			{
				modal: DOM_ELEMENTS.modalResetPass,
				form: DOM_FORMS.formResetPass,
			},
		);
	});

	// ---- REDIRECT ----

	DOM_ELEMENTS.signInRedirectBtns.forEach((btn) => {
		btn.addEventListener('click', () => {
			if (DOM_ELEMENTS.modalSignUp.classList.contains('active')) {
				ui.hideModalDefault(
					DOM_ELEMENTS.overlaySignUp,
					DOM_ELEMENTS.modalSignUp,
				);
				ui.showModalDefault(
					DOM_ELEMENTS.overlaySignIn,
					DOM_ELEMENTS.modalSignIn,
				);
			} else {
				DOM_ELEMENTS.modalResetPass.classList.remove('visible');
			}
		});
	});
};
