// `game` isn't ready until the "ready" hook fires; sheets only render after that,
// so the non-null assertion here is safe and keeps callers from repeating it.
export const localize = (key: string) => game.i18n!.localize(key);
