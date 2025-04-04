export const decodeBase64 = (str) => {
    try {
        if (!str || typeof str !== 'string') {
            return ''; // Return an empty string if the input is invalid
        }
        // Attempt to decode the base64 string
        return decodeURIComponent(atob(str).split('').map(c =>
            `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
    } catch (e) {
        //console.error('Error decoding base64:', e);
        return str; // Return the original string if decoding fails
    }
};
