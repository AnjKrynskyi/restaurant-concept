import { firestore, firebase } from '../js/firebase.cofig';
import { Booking } from '../app/components/hero/class-booking';

class Database {
	public date: string;
	public user: firebase.User;

	async getFavourites(uid: string): Promise<string[]> {
		try {
			const favouritesSnapshot = await firestore.collection('favourites').doc(uid).get();
			return favouritesSnapshot.exists ? favouritesSnapshot.data().ids : [];
		} catch (error) {
			return error;
		}
	}

	async updateFavourites(docId: string) {
		const { uid } = this.user;
		const menuDocRef = firestore.collection('menu').doc(docId);

		try {
			const userDocRef = await firestore.collection('favourites').doc(uid).get();

			firestore.runTransaction(async (transaction) => {
				const sfDoc = await transaction.get(menuDocRef);
				if (!sfDoc.exists) {
					console.log('Document does not exist!');
				} else {
					const updateLikes = sfDoc.data().likes + 1;
					transaction.update(menuDocRef, { likes: updateLikes });
				}
			});

			menuDocRef
				.get()
				.then((menuDocSnapshot) => {
					if (!userDocRef.exists) {
						firestore.collection('favourites').doc(uid).set({
							ids: firebase.firestore.FieldValue.arrayUnion(menuDocSnapshot.id),
						});
					} else {
						firestore.collection('favourites').doc(uid).update({
							ids: firebase.firestore.FieldValue.arrayUnion(menuDocSnapshot.id),
						});
					}
				});
		} catch (error) {
			console.error(error);
		}
	}

	removeFavourite(docId: string) {
		const { uid } = this.user;
		const menuDocRef = firestore.collection('menu').doc(docId);
		const userDocRef = firestore.collection('favourites').doc(uid);

		firestore.runTransaction(async (transaction) => {
			const sfDoc = await transaction.get(menuDocRef);
			if (!sfDoc.exists) {
				console.log('Document does not exist!');
			} else {
				const updateLikes = sfDoc.data().likes - 1;
				transaction.update(menuDocRef, { likes: updateLikes });
			}
		});

		userDocRef.update({
			ids: firebase.firestore.FieldValue.arrayRemove(docId),
		});
	}

	setBooking(bookingObj: Booking) {
		firestore.collection('reservation').doc()
			.set({
				...bookingObj,
			});
	}

	async getBookings(): Promise<any[]> {
		try {
			const reservationSnapshot = await firestore.collection('reservation').get();
			return reservationSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
		} catch (error) {
			return error;
		}
	}

	async getActualBookings(): Promise<any[]> {
		const today = new Date().getTime();

		try {
			const reservationSnapshot = await firestore.collection('reservation').get();
			const reservationData: any[] = reservationSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

			return reservationData.filter((item) => (today <= new Date(`${item.date} ${item.time}`).getTime())
				&& (new Date(this.date).setHours(0, 0, 0, 0) === new Date(item.date).setHours(0, 0, 0, 0)));
		} catch (error) {
			return error;
		}
	}
}

export const database = new Database();