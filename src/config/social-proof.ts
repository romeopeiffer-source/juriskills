/** Displayed student count until real signup numbers are wired in. */
export const STUDENT_COUNT_DISPLAY = 500;

/**
 * Returns the number of students to display as social proof.
 * Today it's a static constant; later this can query Prisma (unique users +
 * waitlist signups) without any change needed at the call sites.
 */
export async function getStudentCount(): Promise<number> {
  return STUDENT_COUNT_DISPLAY;
}
