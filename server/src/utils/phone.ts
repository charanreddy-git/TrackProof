import { ApiError } from "./api-error";

const E164_PATTERN = /^\+[1-9]\d{7,14}$/;

/**
 * Normalise a phone number to E.164.
 *
 * Indian mobile numbers are accepted in the common local formats:
 *   98765 43210      -> +919876543210
 *   098765 43210     -> +919876543210
 *   91 98765 43210   -> +919876543210
 *   +91 98765 43210  -> +919876543210
 *
 * International numbers must include a country code.
 */
export function normalizePhone(raw: string): string {
  let value = raw.trim().replace(/[\s\-().]/g, "");

  if (value.startsWith("00")) {
    value = `+${value.slice(2)}`;
  }

  if (!value.startsWith("+")) {
    if (/^[6-9]\d{9}$/.test(value)) {
      value = `+91${value}`;
    } else if (/^0[6-9]\d{9}$/.test(value)) {
      value = `+91${value.slice(1)}`;
    } else if (/^91[6-9]\d{9}$/.test(value)) {
      value = `+${value}`;
    } else {
      value = `+${value}`;
    }
  }

  if (!E164_PATTERN.test(value)) {
    throw ApiError.badRequest(
      "Enter a valid mobile number. Include your country code if you are outside India."
    );
  }

  return value;
}

/** Display an Indian number in a familiar format; leave other numbers intact. */
export function formatPhone(phone: string): string {
  if (/^\+91\d{10}$/.test(phone)) {
    return `+91 ${phone.slice(3, 8)} ${phone.slice(8)}`;
  }
  return phone;
}
