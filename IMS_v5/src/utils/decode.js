const isBase64 = (str) => /^[A-Za-z0-9+/]+={0,2}$/.test(str);

export function decodeBase64(input = "") {
  if (!isBase64(input)) return input;
  try {
    const binary = atob(input);
    return decodeURIComponent(
      binary
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return input;
  }
}