/**
 * Generates a random number between 0 and `max` that is the same each day.
 *
 * This function is designed to be used as a random number generator that produces the same result each day.
 * It uses two environment variables, `RANDOM1` and `RANDOM2`, to generate a number.
 * The two numbers are then combined with the day, month, and year of the date to generate a random number.
 *
 * @param date The date to generate a random number for.
 * @param max The maximum random number to generate.
 * @returns The generated random number.
 * @throws {Error} If `RANDOM1` or `RANDOM2` is not a valid number.
 */
export function randomNumberByDate(date: Date, max: number) {
    const RANDOM1 = Number(process.env.RANDOM1);
    const RANDOM2 = Number(process.env.RANDOM2);
    if (isNaN(RANDOM1)) throw new Error("RANDOM1 is not correct.");
    if (isNaN(RANDOM2)) throw new Error("RANDOM2 is not correct.");
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    return (RANDOM1 * (day + month * 100 + year * 10000) + RANDOM2) % max;
}

/**
 * Compare two dates.
 *
 * @param date1 The first date.
 * @param date2 The second date.
 * @returns `-1` if `date1` is before `date2`, `1` if `date1` is after `date2`, and `0` if `date1` is equal to `date2`.
 */
export function compateDays(date1: Date, date2: Date) {
    if (date1.getFullYear() > date2.getFullYear()) return 1;
    if (date1.getFullYear() < date2.getFullYear()) return -1;
    if (date1.getMonth() > date2.getMonth()) return 1;
    if (date1.getMonth() < date2.getMonth()) return -1;
    if (date1.getDate() > date2.getDate()) return 1;
    if (date1.getDate() < date2.getDate()) return -1;
    return 0;
}