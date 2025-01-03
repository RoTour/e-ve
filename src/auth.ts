import * as jose from "jose";

export const createJwt = async (content: string) => {
	const jwtSecret: string = Bun.env.JWT_SECRET ?? "no_secret";
	const secret = new TextEncoder().encode(jwtSecret);
	const token = await new jose.SignJWT({
		serverId: content,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setIssuedAt()
		.setExpirationTime("2h")
		.sign(secret);

	return token;
};
