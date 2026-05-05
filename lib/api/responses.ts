import { NextResponse } from "next/server";

export const json = <T>(data: T, init?: ResponseInit) =>
  NextResponse.json(data, init);

export const error = (status: number, message: string, extra?: Record<string, unknown>) =>
  NextResponse.json({ error: message, ...(extra ?? {}) }, { status });

export const unauthorized = () => error(401, "Unauthenticated");
export const forbidden = () => error(403, "Forbidden");
export const notFound = (what = "Not found") => error(404, what);
export const badRequest = (
  message: string,
  fieldErrors?: Record<string, string>,
) => error(400, message, fieldErrors ? { fieldErrors } : undefined);
