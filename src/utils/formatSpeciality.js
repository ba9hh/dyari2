export function formatSpeciality(specialities = []) {
    if (!specialities.length) return "";
    if (specialities.length === 1) return `Specialité : ${specialities[0]}`;

    const last = specialities[specialities.length - 1];
    const rest = specialities.slice(0, -1);

    return `Specialité : ${rest.join(" , ")} et ${last}`;
}