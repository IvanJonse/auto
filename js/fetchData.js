export const fetchData = async() => {
    try {
        const response = await fetch('https://forest-quark-seeder.glitch.me/api');
        if (!response.ok) {
            throw new Error(`Error, status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.log(`Ошибка при получении данных: ${error}`);
    }
};