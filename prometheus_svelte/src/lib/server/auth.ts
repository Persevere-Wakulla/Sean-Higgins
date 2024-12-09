import { SvelteKitAuth, type User } from '@auth/sveltekit';
import Credentials from '@auth/sveltekit/providers/credentials';
import bcrypt from 'bcryptjs';
import getSubscriberModel from './schema/subscriber';

export const { signIn, signOut, handle } = SvelteKitAuth({
	providers: [
		Credentials({
			authorize: async (credentials, request) => {
				try {
					const subscriberModel = await getSubscriberModel();
					const subscriber = await subscriberModel.findOne({ username: credentials.username }).lean();
					if (subscriber) {
						var isCorrectPassword = await bcrypt.compare(
							credentials.password as string,
							subscriber.password
						);
						if (isCorrectPassword) {
							return {
                                id: 'testing',
                                name: subscriber.username,
                                image: 'hello.jpg',
								email: subscriber.email,
                                expires: new Date(Date.now())
							} as User;
						}
					}
					return null;
				} catch (error) {
					console.dir(error);
					return null;
				}
			}
		})
	],
    pages: {
		signIn: '/'
	}
});
