import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import { db } from "../db";
import { user, session, authDevice } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "AuthError";
  }
}

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MiB
    timeCost: 3,
    parallelism: 1,
  });
}

export async function verifyPassword(hashedPassword: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hashedPassword, password);
  } catch {
    return false;
  }
}

export async function createUser(name: string, email: string, password: string): Promise<AuthUser> {
  const hashedPassword = await hashPassword(password);
  const userId = uuidv4();

  try {
    const [newUser] = await db
      .insert(user)
      .values({
        id: userId,
        name,
        email,
        password: hashedPassword,
        emailVerified: false,
      })
      .returning();

    return newUser as AuthUser;
  } catch (error: any) {
    if (error.code === "23505") { // Unique constraint violation
      throw new AuthError("Email already exists", "EMAIL_EXISTS");
    }
    throw error;
  }
}

export async function authenticateUser(email: string, password: string): Promise<AuthUser> {
  const [dbUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email));

  if (!dbUser) {
    throw new AuthError("Invalid email or password", "INVALID_CREDENTIALS");
  }

  const isValidPassword = await verifyPassword(dbUser.password, password);
  if (!isValidPassword) {
    throw new AuthError("Invalid email or password", "INVALID_CREDENTIALS");
  }

  return dbUser as AuthUser;
}

export async function createSession(userId: string, ipAddress?: string, userAgent?: string): Promise<AuthSession> {
  const sessionId = uuidv4();
  const token = uuidv4();
  const expiresAt = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000); // 7 days

  const [newSession] = await db
    .insert(session)
    .values({
      id: sessionId,
      token,
      userId,
      expiresAt,
      ipAddress,
      userAgent,
    })
    .returning();

  return newSession as AuthSession;
}

export async function getSession(token: string): Promise<{ session: AuthSession; user: AuthUser } | null> {
  const [sessionData] = await db
    .select()
    .from(session)
    .innerJoin(user, eq(session.userId, user.id))
    .where(and(
      eq(session.token, token),
      gt(session.expiresAt, new Date())
    ));

  if (!sessionData) {
    return null;
  }

  return {
    session: {
      id: sessionData.session.id,
      token: sessionData.session.token,
      userId: sessionData.session.userId,
      expiresAt: sessionData.session.expiresAt,
      ipAddress: sessionData.session.ipAddress,
      userAgent: sessionData.session.userAgent,
    },
    user: {
      id: sessionData.user.id,
      name: sessionData.user.name,
      email: sessionData.user.email,
      emailVerified: sessionData.user.emailVerified,
      image: sessionData.user.image,
      createdAt: sessionData.user.createdAt,
      updatedAt: sessionData.user.updatedAt,
    },
  };
}

export async function deleteSession(token: string): Promise<void> {
  await db
    .delete(session)
    .where(eq(session.token, token));
}

export async function getUserCount(): Promise<number> {
  const [result] = await db
    .select({ count: db.$count(user.id) })
    .from(user);

  return result.count;
}

export async function createAuthDevice(userId: string, name: string): Promise<string> {
  const deviceId = uuidv4();
  const deviceKey = uuidv4();

  await db
    .insert(authDevice)
    .values({
      id: deviceId,
      name,
      userId,
      deviceKey,
    });

  return deviceKey;
}

export async function authenticateDevice(deviceKey: string): Promise<AuthUser | null> {
  const [device] = await db
    .select()
    .from(authDevice)
    .innerJoin(user, eq(authDevice.userId, user.id))
    .where(eq(authDevice.deviceKey, deviceKey));

  if (!device) {
    return null;
  }

  // Update last used
  await db
    .update(authDevice)
    .set({ lastUsedAt: new Date() })
    .where(eq(authDevice.id, device.auth_device.id));

  return {
    id: device.user.id,
    name: device.user.name,
    email: device.user.email,
    emailVerified: device.user.emailVerified,
    image: device.user.image,
    createdAt: device.user.createdAt,
    updatedAt: device.user.updatedAt,
  };
}
